package ma.inpt.soa.service6suivistagesrest.entity;

import java.util.Date;

public class CompteRendu {
    private int id;
    private int idStage;
    private Date dateRedaction;
    private String contenu;

    public CompteRendu() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getIdStage() { return idStage; }
    public void setIdStage(int idStage) { this.idStage = idStage; }
    public Date getDateRedaction() { return dateRedaction; }
    public void setDateRedaction(Date dateRedaction) { this.dateRedaction = dateRedaction; }
    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }
}