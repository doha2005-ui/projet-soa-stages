package ma.inpt.soa.service6suivistagesrest.entity;

import java.util.Date;

public class Evaluation {
    private int id;
    private int idStage;
    private int note;
    private String commentaire;
    private Date dateEvaluation;

    public Evaluation() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getIdStage() { return idStage; }
    public void setIdStage(int idStage) { this.idStage = idStage; }
    public int getNote() { return note; }
    public void setNote(int note) { this.note = note; }
    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
    public Date getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(Date dateEvaluation) { this.dateEvaluation = dateEvaluation; }
}
