package ma.inpt.soa.service2entreprisessoap.entity;

public class Entreprise {
    private int id;
    private String raisonSociale;
    private String secteur;
    private String ville;
    private String contactNom;
    private String contactEmail;
    private String telephone;
    private boolean conventionnee;

    public Entreprise() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }

    public String getSecteur() { return secteur; }
    public void setSecteur(String secteur) { this.secteur = secteur; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getContactNom() { return contactNom; }
    public void setContactNom(String contactNom) { this.contactNom = contactNom; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public boolean isConventionnee() { return conventionnee; }
    public void setConventionnee(boolean conventionnee) { this.conventionnee = conventionnee; }
}