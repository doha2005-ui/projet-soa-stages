package ma.inpt.soa.service6suivistagesrest.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class CompteRendu {
    private int id;
    private int stageId;
    private String periode;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDepot;
    private String resume;
    private String statutValidation;

    public CompteRendu() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStageId() { return stageId; }
    public void setStageId(int stageId) { this.stageId = stageId; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public Date getDateDepot() { return dateDepot; }
    public void setDateDepot(Date dateDepot) { this.dateDepot = dateDepot; }

    public String getResume() { return resume; }
    public void setResume(String resume) { this.resume = resume; }

    public String getStatutValidation() { return statutValidation; }
    public void setStatutValidation(String statutValidation) { this.statutValidation = statutValidation; }
}