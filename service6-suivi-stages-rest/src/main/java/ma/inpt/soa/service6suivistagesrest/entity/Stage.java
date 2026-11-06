package ma.inpt.soa.service6suivistagesrest.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

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

    public Stage() {}

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
}