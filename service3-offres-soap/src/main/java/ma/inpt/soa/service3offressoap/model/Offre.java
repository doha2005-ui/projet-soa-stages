package ma.inpt.soa.service3offressoap.model;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "offre")
@XmlAccessorType(XmlAccessType.FIELD)
public class Offre implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int entrepriseId;
    private String entrepriseNom;
    private String titre;
    private String lieu;
    private String type;
    private String duree;
    private String remuneration;
    private String competences;
    private String description;
    private String datePublication;
    private String dateLimite;
    private int placesDisponibles = 1;
    private boolean active = true;

    public Offre() {
    }

    public Offre(int id, int entrepriseId, String entrepriseNom, String titre, String lieu,
                 String type, String duree, String remuneration, String competences,
                 String description, String datePublication, boolean active) {
        this.id = id;
        this.entrepriseId = entrepriseId;
        this.entrepriseNom = entrepriseNom;
        this.titre = titre;
        this.lieu = lieu;
        this.type = type;
        this.duree = duree;
        this.remuneration = remuneration;
        this.competences = competences;
        this.description = description;
        this.datePublication = datePublication;
        this.active = active;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEntrepriseId() {
        return entrepriseId;
    }

    public void setEntrepriseId(int entrepriseId) {
        this.entrepriseId = entrepriseId;
    }

    public String getEntrepriseNom() {
        return entrepriseNom;
    }

    public void setEntrepriseNom(String entrepriseNom) {
        this.entrepriseNom = entrepriseNom;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDuree() {
        return duree;
    }

    public void setDuree(String duree) {
        this.duree = duree;
    }

    public String getRemuneration() {
        return remuneration;
    }

    public void setRemuneration(String remuneration) {
        this.remuneration = remuneration;
    }

    public String getCompetences() {
        return competences;
    }

    public void setCompetences(String competences) {
        this.competences = competences;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(String datePublication) {
        this.datePublication = datePublication;
    }

    public String getDateLimite() {
        return dateLimite;
    }

    public void setDateLimite(String dateLimite) {
        this.dateLimite = dateLimite;
    }

    public int getPlacesDisponibles() {
        return placesDisponibles;
    }

    public void setPlacesDisponibles(int placesDisponibles) {
        this.placesDisponibles = placesDisponibles;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
