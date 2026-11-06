package ma.inpt.soa.service2entreprisessoap.dao;

import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import java.sql.*;

public class EntrepriseDAO {

    public boolean ajouterEntreprise(Entreprise e) {
        String sql = "INSERT INTO entreprises (nom, secteur, adresse, email, telephone, responsable_contact, est_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, e.getNom());
            ps.setString(2, e.getSecteur());
            ps.setString(3, e.getAdresse());
            ps.setString(4, e.getEmail());
            ps.setString(5, e.getTelephone());
            ps.setString(6, e.getResponsableContact());
            ps.setBoolean(7, e.isEstActive());
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }

    public Entreprise consulterEntreprise(int id) {
        String sql = "SELECT * FROM entreprises WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Entreprise e = new Entreprise();
                e.setId(rs.getInt("id"));
                e.setNom(rs.getString("nom"));
                e.setSecteur(rs.getString("secteur"));
                e.setAdresse(rs.getString("adresse"));
                e.setEmail(rs.getString("email"));
                e.setTelephone(rs.getString("telephone"));
                e.setResponsableContact(rs.getString("responsable_contact"));
                e.setEstActive(rs.getBoolean("est_active"));
                return e;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public boolean verifierEntrepriseReferencee(int id) {
        String sql = "SELECT COUNT(*) FROM entreprises WHERE id = ? AND est_active = true";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1) > 0;
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return false;
    }
}