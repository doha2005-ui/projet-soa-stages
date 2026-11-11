package ma.inpt.soa.service3offressoap.dao;

import ma.inpt.soa.service3offressoap.model.Offre;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class OffreDAO {

    private static final List<Offre> MEMORY_STORE = new CopyOnWriteArrayList<>();
    private static final AtomicInteger ID_GEN = new AtomicInteger(10);

    static {
        seedInitialMemoryData();
    }

    private static void seedInitialMemoryData() {
        if (!MEMORY_STORE.isEmpty()) return;
        Offre o1 = new Offre();
        o1.setId(1);
        o1.setEntrepriseId(1);
        o1.setEntrepriseNom("TechSolutions Maroc");
        o1.setTitre("Stage PFE - Architectures Microservices & DevOps");
        o1.setLieu("Casablanca, Technopark");
        o1.setType("PFE (Projet de Fin d'Études)");
        o1.setDuree("6 mois");
        o1.setRemuneration("5000 DH / mois");
        o1.setPlacesDisponibles(2);
        o1.setDateLimite("2026-12-31");
        o1.setCompetences("Java, Spring Boot, Docker, Kubernetes, CI/CD");
        o1.setDescription("Conception et déploiement d'une architecture orientée services résiliente avec observabilité.");
        o1.setDatePublication("2026-10-15");
        o1.setActive(true);
        MEMORY_STORE.add(o1);

        Offre o2 = new Offre();
        o2.setId(2);
        o2.setEntrepriseId(3);
        o2.setEntrepriseNom("CyberShield Africa");
        o2.setTitre("Stage PFE - Audit de Sécurité & DevSecOps");
        o2.setLieu("Rabat, Agdal");
        o2.setType("PFE (Projet de Fin d'Études)");
        o2.setDuree("6 mois");
        o2.setRemuneration("4500 DH / mois");
        o2.setPlacesDisponibles(1);
        o2.setDateLimite("2027-01-15");
        o2.setCompetences("SIEM, OWASP, Python, SonarQube, Sécurité Cloud");
        o2.setDescription("Mise en place de pipelines DevSecOps et tests d'intrusion automatisés.");
        o2.setDatePublication("2026-10-20");
        o2.setActive(true);
        MEMORY_STORE.add(o2);

        Offre o3 = new Offre();
        o3.setId(3);
        o3.setEntrepriseId(2);
        o3.setEntrepriseNom("Fintech Horizons");
        o3.setTitre("Stage Technique - Développement Fullstack Angular & Spring");
        o3.setLieu("Casablanca Finance City");
        o3.setType("Stage Technique (2ème année)");
        o3.setDuree("3 mois");
        o3.setRemuneration("3500 DH / mois");
        o3.setPlacesDisponibles(3);
        o3.setDateLimite("2027-02-28");
        o3.setCompetences("TypeScript, Angular, REST APIs, Spring Boot");
        o3.setDescription("Modernisation du portail financier client et dashboards temps réel.");
        o3.setDatePublication("2026-11-01");
        o3.setActive(true);
        MEMORY_STORE.add(o3);
    }

    public List<Offre> listerToutes() {
        List<Offre> liste = new ArrayList<>();
        String sql = "SELECT o.id, o.entreprise_id, o.titre, o.lieu, o.type, o.duree, o.remuneration, "
                   + "       o.competences, o.description, o.date_publication, o.active, "
                   + "       COALESCE(e.raison_sociale, 'Entreprise Partenaire') AS entreprise_nom "
                   + "FROM offres o "
                   + "LEFT JOIN entreprises e ON o.entreprise_id = e.id "
                   + "ORDER BY o.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                liste.add(extraireOffre(rs));
            }
            if (!liste.isEmpty()) return liste;
        } catch (Exception ex) {
            System.err.println("[OffreDAO] Base inaccessible ou erreur listerToutes, bascule mémoire: " + ex.getMessage());
        }
        return new ArrayList<>(MEMORY_STORE);
    }

    public Offre getById(int id) {
        String sql = "SELECT o.id, o.entreprise_id, o.titre, o.lieu, o.type, o.duree, o.remuneration, "
                   + "       o.competences, o.description, o.date_publication, o.active, "
                   + "       COALESCE(e.raison_sociale, 'Entreprise Partenaire') AS entreprise_nom "
                   + "FROM offres o "
                   + "LEFT JOIN entreprises e ON o.entreprise_id = e.id "
                   + "WHERE o.id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extraireOffre(rs);
                }
            }
        } catch (Exception ex) {
            System.err.println("[OffreDAO] Base inaccessible pour getById #" + id + ", bascule mémoire: " + ex.getMessage());
        }

        for (Offre o : MEMORY_STORE) {
            if (o.getId() == id) return o;
        }
        return null;
    }

    public Offre ajouterOffre(Offre o) {
        if (o.getDatePublication() == null || o.getDatePublication().trim().isEmpty()) {
            o.setDatePublication(LocalDate.now().toString());
        }
        // Retrouver l'entreprise réelle à partir de son nom (le formulaire n'envoie que le nom)
        try (Connection connE = DatabaseConnection.getConnection()) {
            String nomEnt = o.getEntrepriseNom() != null ? o.getEntrepriseNom().trim() : "";
            if (!nomEnt.isEmpty()) {
                Integer idEnt = trouverId(connE, "SELECT id FROM entreprises WHERE raison_sociale = ?", nomEnt);
                if (idEnt != null) {
                    o.setEntrepriseId(idEnt);
                } else if (o.getEntrepriseId() <= 0) {
                    throw new IllegalArgumentException("Aucune entreprise nommée « " + nomEnt + " » dans la base.");
                }
            } else if (o.getEntrepriseId() <= 0) {
                throw new IllegalArgumentException("L'entreprise est obligatoire (nom ou identifiant).");
            }
        } catch (SQLException ex) {
            throw new RuntimeException("Base de données inaccessible : " + ex.getMessage(), ex);
        }

        String sql = "INSERT INTO offres (entreprise_id, titre, lieu, type, duree, remuneration, competences, description, date_publication, active) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, o.getEntrepriseId() > 0 ? o.getEntrepriseId() : 1);
            ps.setString(2, o.getTitre());
            ps.setString(3, o.getLieu() != null ? o.getLieu() : "Non spécifié");
            ps.setString(4, o.getType() != null ? o.getType() : "PFE (Projet de Fin d'Études)");
            ps.setString(5, o.getDuree() != null ? o.getDuree() : "6 mois");
            ps.setString(6, o.getRemuneration() != null ? o.getRemuneration() : "Indemnité conventionnée");
            ps.setString(7, o.getCompetences() != null ? o.getCompetences() : "");
            ps.setString(8, o.getDescription());
            ps.setDate(9, Date.valueOf(o.getDatePublication()));
            ps.setBoolean(10, o.isActive());

            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        o.setId(generatedKeys.getInt(1));
                    }
                }
                return o;
            }
        } catch (Exception ex) {
            throw new RuntimeException("Échec d'enregistrement de l'offre : " + ex.getMessage(), ex);
        }
        throw new RuntimeException("Aucune ligne insérée pour l'offre.");
    }

    private Integer trouverId(Connection conn, String sql, String valeur) throws SQLException {
        if (valeur == null) return null;
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, valeur.trim());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt(1) : null;
            }
        }
    }

    public boolean modifierOffre(Offre o) {
        String sql = "UPDATE offres SET titre = ?, lieu = ?, type = ?, duree = ?, remuneration = ?, "
                   + "                   competences = ?, description = ?, active = ? "
                   + "WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, o.getTitre());
            ps.setString(2, o.getLieu());
            ps.setString(3, o.getType());
            ps.setString(4, o.getDuree());
            ps.setString(5, o.getRemuneration());
            ps.setString(6, o.getCompetences());
            ps.setString(7, o.getDescription());
            ps.setBoolean(8, o.isActive());
            ps.setInt(9, o.getId());

            if (ps.executeUpdate() > 0) return true;
        } catch (Exception ex) {
            System.err.println("[OffreDAO] Base inaccessible pour modifierOffre, bascule mémoire: " + ex.getMessage());
        }

        for (int i = 0; i < MEMORY_STORE.size(); i++) {
            if (MEMORY_STORE.get(i).getId() == o.getId()) {
                MEMORY_STORE.set(i, o);
                return true;
            }
        }
        return false;
    }

    public boolean supprimerOffre(int id) {
        String sql = "DELETE FROM offres WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            if (ps.executeUpdate() > 0) return true;
        } catch (Exception ex) {
            System.err.println("[OffreDAO] Base inaccessible pour supprimerOffre, bascule mémoire: " + ex.getMessage());
        }

        return MEMORY_STORE.removeIf(o -> o.getId() == id);
    }

    public boolean verifierDisponibilite(int offreId) {
        Offre o = getById(offreId);
        if (o == null || !o.isActive()) {
            return false;
        }
        if (o.getPlacesDisponibles() <= 0) {
            return false;
        }
        if (o.getDateLimite() != null && !o.getDateLimite().trim().isEmpty()) {
            try {
                LocalDate limite = LocalDate.parse(o.getDateLimite());
                if (LocalDate.now().isAfter(limite)) {
                    return false;
                }
            } catch (Exception ignored) {
            }
        }
        return true;
    }

    public boolean reserverPlace(int offreId) {
        if (!verifierDisponibilite(offreId)) {
            return false;
        }
        Offre o = getById(offreId);
        if (o != null) {
            int nouvellesPlaces = Math.max(0, o.getPlacesDisponibles() - 1);
            o.setPlacesDisponibles(nouvellesPlaces);
            if (nouvellesPlaces == 0) {
                o.setActive(false);
            }
            try {
                String sql = "UPDATE offres SET places_disponibles = ?, active = ? WHERE id = ?";
                try (Connection conn = DatabaseConnection.getConnection();
                     PreparedStatement ps = conn.prepareStatement(sql)) {
                    ps.setInt(1, nouvellesPlaces);
                    ps.setBoolean(2, o.isActive());
                    ps.setInt(3, offreId);
                    ps.executeUpdate();
                }
            } catch (Exception ignored) {
            }
            return true;
        }
        return false;
    }

    public boolean verifierCompatibilite(int offreId, int etudiantId) {
        return verifierDisponibilite(offreId);
    }

    private Offre extraireOffre(ResultSet rs) throws SQLException {
        Offre o = new Offre();
        o.setId(rs.getInt("id"));
        o.setEntrepriseId(rs.getInt("entreprise_id"));
        o.setTitre(rs.getString("titre"));
        o.setLieu(rs.getString("lieu"));
        o.setType(rs.getString("type"));
        o.setDuree(rs.getString("duree"));
        o.setRemuneration(rs.getString("remuneration"));
        o.setCompetences(rs.getString("competences"));
        o.setDescription(rs.getString("description"));

        Date datePub = rs.getDate("date_publication");
        o.setDatePublication(datePub != null ? datePub.toString() : "");
        o.setActive(rs.getBoolean("active"));
        o.setEntrepriseNom(rs.getString("entreprise_nom"));

        try {
            Date dateLim = rs.getDate("date_limite");
            if (dateLim != null) {
                o.setDateLimite(dateLim.toString());
            } else if (datePub != null) {
                o.setDateLimite(datePub.toLocalDate().plusDays(60).toString());
            }
        } catch (SQLException ignored) {
            if (datePub != null) {
                o.setDateLimite(datePub.toLocalDate().plusDays(60).toString());
            }
        }

        try {
            int places = rs.getInt("places_disponibles");
            if (!rs.wasNull()) {
                o.setPlacesDisponibles(places);
            }
        } catch (SQLException ignored) {
            o.setPlacesDisponibles(1);
        }

        return o;
    }
}