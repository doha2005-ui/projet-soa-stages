package ma.inpt.soa.service6suivistagesrest.dao;

import ma.inpt.soa.service6suivistagesrest.entity.Stage;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StageDAO {

    public Stage creerStage(Stage s) {
        String sql = "INSERT INTO stages (etudiant_id, entreprise_id, intitule, date_debut, date_fin, tuteur_entreprise, tuteur_academique, etat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, s.getEtudiantId());
            ps.setInt(2, s.getEntrepriseId());
            ps.setString(3, s.getIntitule());
            ps.setDate(4, new java.sql.Date(s.getDateDebut().getTime()));
            ps.setDate(5, new java.sql.Date(s.getDateFin().getTime()));
            ps.setString(6, s.getTuteurEntreprise());
            ps.setString(7, s.getTuteurAcademique());
            ps.setString(8, s.getEtat());
            
            ps.executeUpdate();
            
            ResultSet generatedKeys = ps.getGeneratedKeys();
            if (generatedKeys.next()) {
                s.setId(generatedKeys.getInt(1));
            }
            return s;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Création) : " + ex.getMessage());
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
                s.setEtudiantId(rs.getInt("etudiant_id"));
                s.setEntrepriseId(rs.getInt("entreprise_id"));
                s.setIntitule(rs.getString("intitule"));
                s.setDateDebut(rs.getDate("date_debut"));
                s.setDateFin(rs.getDate("date_fin"));
                s.setTuteurEntreprise(rs.getString("tuteur_entreprise"));
                s.setTuteurAcademique(rs.getString("tuteur_academique"));
                s.setEtat(rs.getString("etat"));
                return s;
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Lecture) : " + ex.getMessage());
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
                s.setEtudiantId(rs.getInt("etudiant_id"));
                s.setEntrepriseId(rs.getInt("entreprise_id"));
                s.setIntitule(rs.getString("intitule"));
                s.setDateDebut(rs.getDate("date_debut"));
                s.setDateFin(rs.getDate("date_fin"));
                s.setTuteurEntreprise(rs.getString("tuteur_entreprise"));
                s.setTuteurAcademique(rs.getString("tuteur_academique"));
                s.setEtat(rs.getString("etat"));
                liste.add(s);
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Liste) : " + ex.getMessage());
        }
        return liste;
    }

    public boolean mettreAJourStatut(int id, String nouveauStatut) {
        String sql = "UPDATE stages SET etat = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, nouveauStatut);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Mise à jour) : " + ex.getMessage());
            return false;
        }
    }
}