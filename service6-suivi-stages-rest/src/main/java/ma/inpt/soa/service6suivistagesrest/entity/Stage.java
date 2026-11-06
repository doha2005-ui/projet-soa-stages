package ma.inpt.soa.service6suivistagesrest.entity;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
public class Stage {
    private int id;
    private int idCandidature;
    private int idEntreprise;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDebut;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateFin;
    private String statut;

    public Stage() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getIdCandidature() { return idCandidature; }
    public void setIdCandidature(int idCandidature) { this.idCandidature = idCandidature; }
    public int getIdEntreprise() { return idEntreprise; }
    public void setIdEntreprise(int idEntreprise) { this.idEntreprise = idEntreprise; }
    public Date getDateDebut() { return dateDebut; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }
    public Date getDateFin() { return dateFin; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}