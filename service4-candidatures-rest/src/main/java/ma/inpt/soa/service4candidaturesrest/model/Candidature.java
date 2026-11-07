package ma.inpt.soa.service4candidaturesrest.model;

import java.io.Serializable;

public class Candidature implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int offreId;
    private String offreTitre;
    private String entrepriseNom;
    private int etudiantId;
    private String etudiantNom;
    private String etudiantEmail;
    private String dateDepot;
    private String statut = "déposée";
    private String motivation;
    private String orchestrateur = "REST (Service 4 direct)";

    public Candidature() {
    }

    public Candidature(int id, int offreId, String offreTitre, String entrepriseNom,
                       int etudiantId, String etudiantNom, String etudiantEmail,
                       String dateDepot, String statut, String motivation, String orchestrateur) {
        this.id = id;
        this.offreId = offreId;
        this.offreTitre = offreTitre;
        this.entrepriseNom = entrepriseNom;
        this.etudiantId = etudiantId;
        this.etudiantNom = etudiantNom;
        this.etudiantEmail = etudiantEmail;
        this.dateDepot = dateDepot;
        this.statut = statut;
        this.motivation = motivation;
        this.orchestrateur = orchestrateur;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOffreId() {
        return offreId;
    }

    public void setOffreId(int offreId) {
        this.offreId = offreId;
    }

    public String getOffreTitre() {
        return offreTitre;
    }

    public void setOffreTitre(String offreTitre) {
        this.offreTitre = offreTitre;
    }

    public String getEntrepriseNom() {
        return entrepriseNom;
    }

    public void setEntrepriseNom(String entrepriseNom) {
        this.entrepriseNom = entrepriseNom;
    }

    public int getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(int etudiantId) {
        this.etudiantId = etudiantId;
    }

    public String getEtudiantNom() {
        return etudiantNom;
    }

    public void setEtudiantNom(String etudiantNom) {
        this.etudiantNom = etudiantNom;
    }

    public String getEtudiantEmail() {
        return etudiantEmail;
    }

    public void setEtudiantEmail(String etudiantEmail) {
        this.etudiantEmail = etudiantEmail;
    }

    public String getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(String dateDepot) {
        this.dateDepot = dateDepot;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public String getOrchestrateur() {
        return orchestrateur;
    }

    public void setOrchestrateur(String orchestrateur) {
        this.orchestrateur = orchestrateur;
    }
}
