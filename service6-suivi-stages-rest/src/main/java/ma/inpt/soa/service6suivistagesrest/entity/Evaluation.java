package ma.inpt.soa.service6suivistagesrest.entity;

import java.math.BigDecimal;
import java.util.Date;

public class Evaluation {
    private int id;
    private int stageId;
    private BigDecimal noteEntreprise;
    private BigDecimal noteAcademique;
    private String commentaireTuteur;
    private Date dateEvaluation;

    public Evaluation() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStageId() { return stageId; }
    public void setStageId(int stageId) { this.stageId = stageId; }

    public BigDecimal getNoteEntreprise() { return noteEntreprise; }
    public void setNoteEntreprise(BigDecimal noteEntreprise) { this.noteEntreprise = noteEntreprise; }

    public BigDecimal getNoteAcademique() { return noteAcademique; }
    public void setNoteAcademique(BigDecimal noteAcademique) { this.noteAcademique = noteAcademique; }

    public String getCommentaireTuteur() { return commentaireTuteur; }
    public void setCommentaireTuteur(String commentaireTuteur) { this.commentaireTuteur = commentaireTuteur; }

    public Date getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(Date dateEvaluation) { this.dateEvaluation = dateEvaluation; }
}