package ma.inpt.soa.service6suivistagesrest.dao;

import ma.inpt.soa.service6suivistagesrest.entity.CompteRendu;
import ma.inpt.soa.service6suivistagesrest.entity.Evaluation;
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
                s.setComptesRendus(listerComptesRendus(s.getId()));
                s.setEvaluation(getEvaluation(s.getId()));
                return s;
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Lecture) : " + ex.getMessage());
        }
        return null;
    }

    public List<Stage> listerStages() {
        List<Stage> liste = new ArrayList<>();
        
        String sql = "SELECT s.id, s.etudiant_id, s.entreprise_id, s.intitule, " +
                "s.date_debut, s.date_fin, s.tuteur_entreprise, " +
                "s.tuteur_academique, s.etat, " +
                "CONCAT(e.nom, ' ', e.prenom) as etudiant_nom, e.cne as etudiant_cne, " +
                "ent.raison_sociale as entreprise_nom " +
                "FROM stages s " +
                "LEFT JOIN etudiants e ON s.etudiant_id = e.id " +
                "LEFT JOIN entreprises ent ON s.entreprise_id = ent.id";
        
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
                
                // MAPPING CORRIGÉ (plus de setEtudiantPrenom)
                s.setEtudiantNom(rs.getString("etudiant_nom"));
                s.setEtudiantCne(rs.getString("etudiant_cne"));
                s.setEntrepriseNom(rs.getString("entreprise_nom"));

                // Charger les comptes rendus et évaluation pour ce stage
                s.setComptesRendus(listerComptesRendus(s.getId()));
                s.setEvaluation(getEvaluation(s.getId()));

                liste.add(s);
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Liste) : " + ex.getMessage());
        }
        return liste;
    }

    private List<CompteRendu> listerComptesRendus(int stageId) {
        List<CompteRendu> liste = new ArrayList<>();
        String sql = "SELECT * FROM comptes_rendus WHERE stage_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stageId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                CompteRendu cr = new CompteRendu();
                cr.setId(rs.getInt("id"));
                cr.setStageId(rs.getInt("stage_id"));
                cr.setPeriode(rs.getString("periode"));
                cr.setDateDepot(rs.getDate("date_depot"));
                cr.setResume(rs.getString("resume"));
                cr.setFichierNom(rs.getString("fichier_nom"));
                cr.setFichierData(rs.getString("fichier_data"));
                cr.setStatutValidation(rs.getString("statut_validation"));
                liste.add(cr);
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Comptes Rendus) : " + ex.getMessage());
        }
        return liste;
    }

    private Evaluation getEvaluation(int stageId) {
        String sql = "SELECT * FROM evaluations WHERE stage_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stageId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                Evaluation e = new Evaluation();
                e.setId(rs.getInt("id"));
                e.setStageId(rs.getInt("stage_id"));
                e.setNoteEntreprise(rs.getBigDecimal("note_entreprise"));
                e.setNoteAcademique(rs.getBigDecimal("note_academique"));
                e.setCommentaireTuteur(rs.getString("commentaire_tuteur"));
                e.setDateEvaluation(rs.getDate("date_evaluation"));
                return e;
            }
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Evaluation) : " + ex.getMessage());
        }
        return null;
    }

    public boolean enregistrerEvaluation(int stageId, Evaluation eval) {
        String sql = "INSERT INTO evaluations (stage_id, note_entreprise, note_academique, commentaire_tuteur) " +
                     "VALUES (?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE note_entreprise = VALUES(note_entreprise), " +
                     "note_academique = VALUES(note_academique), " +
                     "commentaire_tuteur = VALUES(commentaire_tuteur)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, stageId);
            ps.setBigDecimal(2, eval.getNoteEntreprise());
            ps.setBigDecimal(3, eval.getNoteAcademique());
            ps.setString(4, eval.getCommentaireTuteur());
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Enregistrement Évaluation) : " + ex.getMessage());
            return false;
        }
    }

    public boolean ajouterCompteRendu(int stageId, CompteRendu cr) {
        String sql = "INSERT INTO comptes_rendus (stage_id, periode, date_depot, resume, fichier_nom, fichier_data, statut_validation) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, stageId);
            ps.setString(2, cr.getPeriode());
            ps.setDate(3, cr.getDateDepot() != null ? new java.sql.Date(cr.getDateDepot().getTime()) : new java.sql.Date(System.currentTimeMillis()));
            ps.setString(4, cr.getResume());
            ps.setString(5, cr.getFichierNom());
            ps.setString(6, cr.getFichierData());
            ps.setString(7, cr.getStatutValidation() != null ? cr.getStatutValidation() : "EN_ATTENTE");
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("ERREUR SQL (Ajout Compte Rendu) : " + ex.getMessage());
            return false;
        }
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