package ma.inpt.soa.service4candidaturesrest.dao;

import ma.inpt.soa.service4candidaturesrest.model.Candidature;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class CandidatureDAO {

    private static final List<String> STATUTS_VALIDES = Arrays.asList(
        "déposée", "deposee",
        "en cours d'évaluation", "en cours d'evaluation", "en cours",
        "acceptée", "acceptee", "validée", "validee",
        "refusée", "refusee", "rejetée", "rejetee"
    );

    private static final List<Candidature> MEMORY_STORE = new CopyOnWriteArrayList<>();
    private static final AtomicInteger ID_GEN = new AtomicInteger(10);

    static {
        seedInitialMemoryData();
    }

    private static void seedInitialMemoryData() {
        if (!MEMORY_STORE.isEmpty()) return;
        Candidature c1 = new Candidature(
            1, 1, "Stage PFE - Architectures Microservices & DevOps", "TechSolutions Maroc",
            1, "Benali Yassine", "yassine.benali@inpt.ac.ma",
            "2026-11-02", "acceptée",
            "Élève-ingénieur INPT passionné par les systèmes distribués et le cloud native.",
            "REST (Service 4 direct)"
        );
        MEMORY_STORE.add(c1);

        Candidature c2 = new Candidature(
            2, 2, "Stage PFE - Audit de Sécurité & DevSecOps", "CyberShield Africa",
            2, "El Idrissi Fatima", "fatima.elidrissi@inpt.ac.ma",
            "2026-11-04", "en cours d'évaluation",
            "Certifications junior en cybersécurité et audits de vulnérabilités.",
            "BPMN (Bonita Process)"
        );
        MEMORY_STORE.add(c2);

        Candidature c3 = new Candidature(
            3, 3, "Stage Technique - Développement Fullstack Angular & Spring", "Fintech Horizons",
            3, "Amrani Mehdi", "mehdi.amrani@inpt.ac.ma",
            "2026-11-05", "déposée",
            "Étudiant en 2ème année souhaitant développer ses compétences fullstack en fintech.",
            "REST (Service 4 direct)"
        );
        MEMORY_STORE.add(c3);
    }

    public List<Candidature> listerToutes() {
        List<Candidature> liste = new ArrayList<>();
        String sql = "SELECT c.id, c.offre_id, c.etudiant_id, c.date_depot, c.statut, c.motivation, c.orchestrateur, "
                   + "       COALESCE(o.titre, 'Offre de stage') AS offre_titre, "
                   + "       COALESCE(e.raison_sociale, 'Entreprise Partenaire') AS entreprise_nom, "
                   + "       COALESCE(CONCAT(et.prenom, ' ', et.nom), 'Étudiant INPT') AS etudiant_nom, "
                   + "       COALESCE(et.email, 'etudiant@inpt.ac.ma') AS etudiant_email "
                   + "FROM candidatures c "
                   + "LEFT JOIN offres o ON c.offre_id = o.id "
                   + "LEFT JOIN entreprises e ON o.entreprise_id = e.id "
                   + "LEFT JOIN etudiants et ON c.etudiant_id = et.id "
                   + "ORDER BY c.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                liste.add(extraireCandidature(rs));
            }
            if (!liste.isEmpty()) return liste;
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible ou erreur listerToutes, bascule mémoire: " + ex.getMessage());
        }

        return new ArrayList<>(MEMORY_STORE);
    }

    public Candidature getById(int id) {
        String sql = "SELECT c.id, c.offre_id, c.etudiant_id, c.date_depot, c.statut, c.motivation, c.orchestrateur, "
                   + "       COALESCE(o.titre, 'Offre de stage') AS offre_titre, "
                   + "       COALESCE(e.raison_sociale, 'Entreprise Partenaire') AS entreprise_nom, "
                   + "       COALESCE(CONCAT(et.prenom, ' ', et.nom), 'Étudiant INPT') AS etudiant_nom, "
                   + "       COALESCE(et.email, 'etudiant@inpt.ac.ma') AS etudiant_email "
                   + "FROM candidatures c "
                   + "LEFT JOIN offres o ON c.offre_id = o.id "
                   + "LEFT JOIN entreprises e ON o.entreprise_id = e.id "
                   + "LEFT JOIN etudiants et ON c.etudiant_id = et.id "
                   + "WHERE c.id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extraireCandidature(rs);
                }
            }
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible getById #" + id + ", bascule mémoire: " + ex.getMessage());
        }

        for (Candidature c : MEMORY_STORE) {
            if (c.getId() == id) return c;
        }
        return null;
    }

    public List<Candidature> listerParStatut(String statut) {
        List<Candidature> liste = new ArrayList<>();
        String sql = "SELECT c.id, c.offre_id, c.etudiant_id, c.date_depot, c.statut, c.motivation, c.orchestrateur, "
                   + "       COALESCE(o.titre, 'Offre de stage') AS offre_titre, "
                   + "       COALESCE(e.raison_sociale, 'Entreprise Partenaire') AS entreprise_nom, "
                   + "       COALESCE(CONCAT(et.prenom, ' ', et.nom), 'Étudiant INPT') AS etudiant_nom, "
                   + "       COALESCE(et.email, 'etudiant@inpt.ac.ma') AS etudiant_email "
                   + "FROM candidatures c "
                   + "LEFT JOIN offres o ON c.offre_id = o.id "
                   + "LEFT JOIN entreprises e ON o.entreprise_id = e.id "
                   + "LEFT JOIN etudiants et ON c.etudiant_id = et.id "
                   + "WHERE LOWER(c.statut) = LOWER(?) "
                   + "ORDER BY c.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, statut);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    liste.add(extraireCandidature(rs));
                }
            }
            if (!liste.isEmpty()) return liste;
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible listerParStatut, bascule mémoire: " + ex.getMessage());
        }

        List<Candidature> res = new ArrayList<>();
        for (Candidature c : MEMORY_STORE) {
            if (c.getStatut() != null && c.getStatut().equalsIgnoreCase(statut)) {
                res.add(c);
            }
        }
        return res;
    }

    public List<Candidature> listerParEtudiant(int etudiantId) {
        List<Candidature> res = new ArrayList<>();
        for (Candidature c : listerToutes()) {
            if (c.getEtudiantId() == etudiantId) {
                res.add(c);
            }
        }
        return res;
    }

    public boolean existeDoublon(int offreId, int etudiantId) {
        for (Candidature c : MEMORY_STORE) {
            if (c.getOffreId() == offreId && c.getEtudiantId() == etudiantId) {
                return true;
            }
        }
        return false;
    }

    public Candidature deposerCandidature(Candidature c) {
        return creer(c);
    }

    public Candidature creer(Candidature c) {
        int eId = c.getEtudiantId() > 0 ? c.getEtudiantId() : 1;
        int oId = c.getOffreId() > 0 ? c.getOffreId() : 1;
        for (Candidature exist : MEMORY_STORE) {
            if (exist.getEtudiantId() == eId && exist.getOffreId() == oId) {
                throw new IllegalStateException("Doublon: l'etudiant #" + eId + " a deja postule a l'offre #" + oId + ".");
            }
        }
        if (c.getDateDepot() == null || c.getDateDepot().trim().isEmpty()) {
            c.setDateDepot(LocalDate.now().toString());
        }
        if (c.getStatut() == null || c.getStatut().trim().isEmpty()) {
            c.setStatut("déposée");
        }
        if (c.getOrchestrateur() == null || c.getOrchestrateur().trim().isEmpty()) {
            c.setOrchestrateur("REST (Service 4 direct)");
        }

        String sql = "INSERT INTO candidatures (offre_id, etudiant_id, date_depot, statut, motivation, orchestrateur) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, c.getOffreId() > 0 ? c.getOffreId() : 1);
            ps.setInt(2, c.getEtudiantId() > 0 ? c.getEtudiantId() : 1);
            ps.setDate(3, Date.valueOf(c.getDateDepot()));
            ps.setString(4, c.getStatut());
            ps.setString(5, c.getMotivation() != null ? c.getMotivation() : "");
            ps.setString(6, c.getOrchestrateur());

            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        c.setId(generatedKeys.getInt(1));
                    }
                }
                return c;
            }
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible pour creer, bascule mémoire: " + ex.getMessage());
        }

        if (c.getId() <= 0) {
            c.setId(ID_GEN.incrementAndGet());
        }
        MEMORY_STORE.add(0, c);
        return c;
    }

    public boolean changerStatut(int id, String nouveauStatut) {
        if (!STATUTS_VALIDES.contains(nouveauStatut.toLowerCase().trim())) {
            return false;
        }

        String sql = "UPDATE candidatures SET statut = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, nouveauStatut.toLowerCase().trim());
            ps.setInt(2, id);
            if (ps.executeUpdate() > 0) return true;
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible pour changerStatut, bascule mémoire: " + ex.getMessage());
        }

        for (Candidature c : MEMORY_STORE) {
            if (c.getId() == id) {
                c.setStatut(nouveauStatut.toLowerCase().trim());
                return true;
            }
        }
        return false;
    }

    public boolean supprimerCandidature(int id) {
        return annuler(id);
    }

    public boolean annuler(int id) {
        String sql = "DELETE FROM candidatures WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            if (ps.executeUpdate() > 0) return true;
        } catch (Exception ex) {
            System.err.println("[CandidatureDAO] Base inaccessible pour annuler, bascule mémoire: " + ex.getMessage());
        }

        return MEMORY_STORE.removeIf(c -> c.getId() == id);
    }

    private Candidature extraireCandidature(ResultSet rs) throws SQLException {
        Candidature c = new Candidature();
        c.setId(rs.getInt("id"));
        c.setOffreId(rs.getInt("offre_id"));
        c.setEtudiantId(rs.getInt("etudiant_id"));

        Date dateDep = rs.getDate("date_depot");
        c.setDateDepot(dateDep != null ? dateDep.toString() : "");

        c.setStatut(rs.getString("statut"));
        c.setMotivation(rs.getString("motivation"));
        c.setOrchestrateur(rs.getString("orchestrateur"));
        c.setOffreTitre(rs.getString("offre_titre"));
        c.setEntrepriseNom(rs.getString("entreprise_nom"));
        c.setEtudiantNom(rs.getString("etudiant_nom"));
        c.setEtudiantEmail(rs.getString("etudiant_email"));

        return c;
    }
}
