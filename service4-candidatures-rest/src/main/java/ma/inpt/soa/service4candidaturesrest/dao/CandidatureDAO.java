package ma.inpt.soa.service4candidaturesrest.dao;

import ma.inpt.soa.service4candidaturesrest.model.Candidature;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CandidatureDAO {

    private static final List<String> STATUTS_VALIDES = Arrays.asList(
        "déposée", "en cours d'évaluation", "acceptée", "refusée"
    );

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
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL listerToutes: " + ex.getMessage());
        }
        return liste;
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
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL getById: " + ex.getMessage());
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
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL listerParStatut: " + ex.getMessage());
        }
        return liste;
    }

    public boolean existeDoublon(int offreId, int etudiantId) {
        String sql = "SELECT COUNT(*) FROM candidatures WHERE offre_id = ? AND etudiant_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, offreId);
            ps.setInt(2, etudiantId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL vérification doublon: " + ex.getMessage());
        }
        return false;
    }

    public Candidature deposerCandidature(Candidature c) throws Exception {
        // 1. Résoudre offre_id si nécessaire
        int resolvedOffreId = c.getOffreId();
        if (resolvedOffreId <= 0 && c.getOffreTitre() != null && !c.getOffreTitre().trim().isEmpty()) {
            resolvedOffreId = resoudreOffreId(c.getOffreTitre());
        }
        if (resolvedOffreId <= 0) {
            resolvedOffreId = 1;
        }
        c.setOffreId(resolvedOffreId);

        // 2. Résoudre etudiant_id si nécessaire
        int resolvedEtudiantId = c.getEtudiantId();
        if (resolvedEtudiantId <= 0 && c.getEtudiantEmail() != null && !c.getEtudiantEmail().trim().isEmpty()) {
            resolvedEtudiantId = resoudreEtudiantId(c.getEtudiantEmail(), c.getEtudiantNom());
        }
        if (resolvedEtudiantId <= 0) {
            resolvedEtudiantId = 1;
        }
        c.setEtudiantId(resolvedEtudiantId);

        // 3. Vérification de doublon
        if (existeDoublon(resolvedOffreId, resolvedEtudiantId)) {
            throw new IllegalStateException("Candidature déjà déposée pour cette offre par cet étudiant.");
        }

        // 4. Date par défaut
        if (c.getDateDepot() == null || c.getDateDepot().trim().isEmpty()) {
            c.setDateDepot(LocalDate.now().toString());
        }

        // 5. Statut par défaut
        if (c.getStatut() == null || c.getStatut().trim().isEmpty()) {
            c.setStatut("déposée");
        }

        String sql = "INSERT INTO candidatures (offre_id, etudiant_id, date_depot, statut, motivation, orchestrateur) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, c.getOffreId());
            ps.setInt(2, c.getEtudiantId());
            ps.setDate(3, Date.valueOf(c.getDateDepot()));
            ps.setString(4, c.getStatut());
            ps.setString(5, c.getMotivation() != null ? c.getMotivation() : "");
            ps.setString(6, c.getOrchestrateur() != null ? c.getOrchestrateur() : "REST");

            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        c.setId(keys.getInt(1));
                    }
                }
                // Récupérer la version enrichie avec noms et titres
                Candidature enrichie = getById(c.getId());
                return enrichie != null ? enrichie : c;
            }
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL deposerCandidature: " + ex.getMessage());
            throw new Exception("Erreur base de données lors du dépôt : " + ex.getMessage());
        }
        return null;
    }

    public boolean changerStatut(int id, String nouveauStatut) throws IllegalArgumentException {
        if (nouveauStatut == null || !STATUTS_VALIDES.contains(nouveauStatut.trim())) {
            throw new IllegalArgumentException("Statut invalide. Statuts autorisés : " + STATUTS_VALIDES);
        }

        String sql = "UPDATE candidatures SET statut = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, nouveauStatut.trim());
            ps.setInt(2, id);

            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL changerStatut: " + ex.getMessage());
            return false;
        }
    }

    public List<Candidature> listerParEtudiant(int etudiantId) {
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
                   + "WHERE c.etudiant_id = ? "
                   + "ORDER BY c.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, etudiantId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    liste.add(extraireCandidature(rs));
                }
            }
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL listerParEtudiant: " + ex.getMessage());
        }
        return liste;
    }

    public boolean supprimerCandidature(int id) throws IllegalStateException {
        Candidature existante = getById(id);
        if (existante == null) {
            return false;
        }
        // Règle de gestion AMOA : on ne peut pas annuler une candidature déjà acceptée
        if ("acceptée".equalsIgnoreCase(existante.getStatut())) {
            throw new IllegalStateException("Règle de gestion : Impossible d'annuler une candidature déjà acceptée par l'entreprise.");
        }

        String sql = "DELETE FROM candidatures WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("[CandidatureDAO] Erreur SQL supprimerCandidature: " + ex.getMessage());
            return false;
        }
    }

    private int resoudreOffreId(String titre) {
        String sql = "SELECT id FROM offres WHERE LOWER(titre) LIKE LOWER(?) LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + titre.trim() + "%");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            // Ignorer
        }
        return 1;
    }

    private int resoudreEtudiantId(String email, String nom) {
        if (email != null && !email.trim().isEmpty()) {
            String sql = "SELECT id FROM etudiants WHERE LOWER(email) = LOWER(?) LIMIT 1";
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {

                ps.setString(1, email.trim());
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return rs.getInt("id");
                    }
                }
            } catch (SQLException e) {
                // Ignorer
            }
        }

        if (nom != null && !nom.trim().isEmpty()) {
            String sql = "SELECT id FROM etudiants WHERE LOWER(CONCAT(prenom, ' ', nom)) LIKE LOWER(?) OR LOWER(nom) LIKE LOWER(?) LIMIT 1";
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {

                ps.setString(1, "%" + nom.trim() + "%");
                ps.setString(2, "%" + nom.trim() + "%");
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return rs.getInt("id");
                    }
                }
            } catch (SQLException e) {
                // Ignorer
            }
        }
        return 1;
    }

    private Candidature extraireCandidature(ResultSet rs) throws SQLException {
        Candidature c = new Candidature();
        c.setId(rs.getInt("id"));
        c.setOffreId(rs.getInt("offre_id"));
        c.setEtudiantId(rs.getInt("etudiant_id"));

        Date dateDepot = rs.getDate("date_depot");
        c.setDateDepot(dateDepot != null ? dateDepot.toString() : "");

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
