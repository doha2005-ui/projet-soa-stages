package ma.inpt.soa.service6suivistagesrest.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

public class Stage {
    private int id;
    private int etudiantId;
    private int entrepriseId;
    private String intitule;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDebut;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateFin;
    
    private String tuteurEntreprise;
    private String tuteurAcademique;
    private String etat;
    
    // Champs enrichis pour le frontend
    private String etudiantNom;
    private String etudiantPrenom;
    private String etudiantCne;
    private String entrepriseNom;
    private List<CompteRendu> comptesRendus;
    private Evaluation evaluation;

    public Stage() {}

    // Getters et Setters existants
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getEtudiantId() { return etudiantId; }
    public void setEtudiantId(int etudiantId) { this.etudiantId = etudiantId; }

    public int getEntrepriseId() { return entrepriseId; }
    public void setEntrepriseId(int entrepriseId) { this.entrepriseId = entrepriseId; }

    public String getIntitule() { return intitule; }
    public void setIntitule(String intitule) { this.intitule = intitule; }

    public Date getDateDebut() { return dateDebut; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }

    public Date getDateFin() { return dateFin; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }

    public String getTuteurEntreprise() { return tuteurEntreprise; }
    public void setTuteurEntreprise(String tuteurEntreprise) { this.tuteurEntreprise = tuteurEntreprise; }

    public String getTuteurAcademique() { return tuteurAcademique; }
    public void setTuteurAcademique(String tuteurAcademique) { this.tuteurAcademique = tuteurAcademique; }

    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }

    // Nouveaux getters et setters
    public String getEtudiantNom() { return etudiantNom; }
    public void setEtudiantNom(String etudiantNom) { this.etudiantNom = etudiantNom; }

    public String getEtudiantPrenom() { return etudiantPrenom; }
    public void setEtudiantPrenom(String etudiantPrenom) { this.etudiantPrenom = etudiantPrenom; }

    public String getEtudiantCne() { return etudiantCne; }
    public void setEtudiantCne(String etudiantCne) { this.etudiantCne = etudiantCne; }

    public String getEntrepriseNom() { return entrepriseNom; }
    public void setEntrepriseNom(String entrepriseNom) { this.entrepriseNom = entrepriseNom; }

    public List<CompteRendu> getComptesRendus() { return comptesRendus; }
    public void setComptesRendus(List<CompteRendu> comptesRendus) { this.comptesRendus = comptesRendus; }

    public Evaluation getEvaluation() { return evaluation; }
    public void setEvaluation(Evaluation evaluation) { this.evaluation = evaluation; }
}