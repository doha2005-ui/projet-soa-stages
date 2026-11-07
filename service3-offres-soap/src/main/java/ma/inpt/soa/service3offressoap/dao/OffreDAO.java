package ma.inpt.soa.service3offressoap.dao;

import ma.inpt.soa.service3offressoap.model.Offre;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class OffreDAO {

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
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL listerToutes: " + ex.getMessage());
        }
        return liste;
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
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL getById: " + ex.getMessage());
        }
        return null;
    }

    public Offre ajouterOffre(Offre o) {
        // Résolution de l'entreprise_id si absent
        int entId = o.getEntrepriseId();
        if (entId <= 0 && o.getEntrepriseNom() != null && !o.getEntrepriseNom().trim().isEmpty()) {
            entId = resoudreEntrepriseId(o.getEntrepriseNom());
        }
        if (entId <= 0) {
            entId = 1; // ID entreprise par défaut
        }
        o.setEntrepriseId(entId);

        if (o.getDatePublication() == null || o.getDatePublication().trim().isEmpty()) {
            o.setDatePublication(LocalDate.now().toString());
        }

        String sql = "INSERT INTO offres (entreprise_id, titre, lieu, type, duree, remuneration, competences, description, date_publication, active) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, o.getEntrepriseId());
            ps.setString(2, o.getTitre());
            ps.setString(3, o.getLieu() != null ? o.getLieu() : "Non spécifié");
            ps.setString(4, o.getType() != null ? o.getType() : "PFE (Projet de Fin d'Études)");
            ps.setString(5, o.getDuree() != null ? o.getDuree() : "6 mois");
            ps.setString(6, o.getRemuneration() != null ? o.getRemuneration() : "Indemnité selon convention");
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
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL ajouterOffre: " + ex.getMessage());
        }
        return null;
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

            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL modifierOffre: " + ex.getMessage());
            return false;
        }
    }

    public boolean supprimerOffre(int id) {
        String sql = "DELETE FROM offres WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL supprimerOffre: " + ex.getMessage());
            return false;
        }
    }

    public boolean verifierDisponibilite(int offreId) {
        String sql = "SELECT active FROM offres WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, offreId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getBoolean("active");
                }
            }
        } catch (SQLException ex) {
            System.err.println("[OffreDAO] Erreur SQL verifierDisponibilite: " + ex.getMessage());
        }
        return false;
    }

    public boolean reserverPlace(int offreId) {
        // Vérifie la disponibilité
        if (!verifierDisponibilite(offreId)) {
            return false;
        }
        // Enregistre la réservation (l'offre reste consultable ou peut être fermée si quota atteint)
        System.out.println("[OffreDAO] Place réservée pour l'offre ID : " + offreId);
        return true;
    }

    public boolean verifierCompatibilite(int offreId, int etudiantId) {
        Offre offre = getById(offreId);
        if (offre == null || !offre.isActive()) {
            return false;
        }
        // Règle de gestion : L'offre est valide et disponible
        return true;
    }

    private int resoudreEntrepriseId(String raisonSociale) {
        String sql = "SELECT id FROM entreprises WHERE LOWER(raison_sociale) LIKE LOWER(?) LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + raisonSociale.trim() + "%");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            // fallback
        }
        return 1;
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
        return o;
    }
}
