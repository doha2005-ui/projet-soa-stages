package ma.inpt.soa.service2entreprisessoap.dao;

import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EntrepriseDAO {

    public boolean ajouterEntreprise(Entreprise e) {
        String sql = "INSERT INTO entreprises (raison_sociale, secteur, ville, contact_nom, contact_email, telephone, conventionnee) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, e.getRaisonSociale());
            ps.setString(2, e.getSecteur());
            ps.setString(3, e.getVille());
            ps.setString(4, e.getContactNom());
            ps.setString(5, e.getContactEmail());
            ps.setString(6, e.getTelephone());
            ps.setBoolean(7, e.isConventionnee());

            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Ajout) : " + ex.getMessage());
            return false;
        }
    }

    public Entreprise consulterEntreprise(String email) {
        String sql = "SELECT * FROM entreprises WHERE contact_email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                Entreprise e = new Entreprise();
                e.setId(rs.getInt("id"));
                e.setRaisonSociale(rs.getString("raison_sociale"));
                e.setSecteur(rs.getString("secteur"));
                e.setVille(rs.getString("ville"));
                e.setContactNom(rs.getString("contact_nom"));
                e.setContactEmail(rs.getString("contact_email"));
                e.setTelephone(rs.getString("telephone"));
                e.setConventionnee(rs.getBoolean("conventionnee"));
                return e;
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Consultation) : " + ex.getMessage());
        }
        return null;
    }

    public boolean verifierEntrepriseReferencee(int id) {
        String sql = "SELECT conventionnee FROM entreprises WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getBoolean("conventionnee");
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Vérification) : " + ex.getMessage());
        }
        return false;
    }

    public List<Entreprise> listerToutes() {
        List<Entreprise> liste = new ArrayList<>();
        String sql = "SELECT * FROM entreprises";
        try (Connection conn = DatabaseConnection.getConnection();
                Statement st = conn.createStatement();
                ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Entreprise e = new Entreprise();
                e.setId(rs.getInt("id"));
                e.setRaisonSociale(rs.getString("raison_sociale"));
                e.setSecteur(rs.getString("secteur"));
                e.setVille(rs.getString("ville"));
                e.setContactNom(rs.getString("contact_nom"));
                e.setContactEmail(rs.getString("contact_email"));
                e.setTelephone(rs.getString("telephone"));
                e.setConventionnee(rs.getBoolean("conventionnee"));
                liste.add(e);
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Liste) : " + ex.getMessage());
        }
        return liste;
    }
}