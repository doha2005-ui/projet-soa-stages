package ma.inpt.soa.service6suivistagesrest.dao;

import ma.inpt.soa.service6suivistagesrest.entity.Stage;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StageDAO {

    public Stage creerStage(Stage s) {
        String sql = "INSERT INTO stages (id_candidature, id_entreprise, date_debut, date_fin, statut) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, s.getIdCandidature());
            ps.setInt(2, s.getIdEntreprise());
            ps.setDate(3, new java.sql.Date(s.getDateDebut().getTime()));
            ps.setDate(4, new java.sql.Date(s.getDateFin().getTime()));
            ps.setString(5, s.getStatut());

            ps.executeUpdate();

            // Récupérer l'ID généré par PostgreSQL
            ResultSet generatedKeys = ps.getGeneratedKeys();
            if (generatedKeys.next()) {
                s.setId(generatedKeys.getInt(1));
            }

            return s;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL : " + ex.getMessage());
            return null;
        }
    }

    public Stage getStage(int id) {
        String sql = "SELECT * FROM stages WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Stage s = new Stage();
                s.setId(rs.getInt("id"));
                s.setIdCandidature(rs.getInt("id_candidature"));
                s.setIdEntreprise(rs.getInt("id_entreprise"));
                s.setDateDebut(rs.getDate("date_debut"));
                s.setDateFin(rs.getDate("date_fin"));
                s.setStatut(rs.getString("statut"));
                return s;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public List<Stage> listerStages() {
        List<Stage> liste = new ArrayList<>();
        String sql = "SELECT * FROM stages";
        try (Connection conn = DatabaseConnection.getConnection();
                Statement st = conn.createStatement();
                ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Stage s = new Stage();
                s.setId(rs.getInt("id"));
                s.setIdCandidature(rs.getInt("id_candidature"));
                s.setIdEntreprise(rs.getInt("id_entreprise"));
                s.setDateDebut(rs.getDate("date_debut"));
                s.setDateFin(rs.getDate("date_fin"));
                s.setStatut(rs.getString("statut"));
                liste.add(s);
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return liste;
    }

    public boolean mettreAJourStatut(int id, String nouveauStatut) {
        String sql = "UPDATE stages SET statut = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nouveauStatut);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
