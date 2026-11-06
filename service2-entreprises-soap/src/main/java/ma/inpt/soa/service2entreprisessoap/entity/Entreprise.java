package ma.inpt.soa.service2entreprisessoap.entity;

public class Entreprise {
    private int id;
    private String nom;
    private String secteur;
    private String adresse;
    private String email;
    private String telephone;
    private String responsableContact;
    private boolean estActive;

    public Entreprise() {}

    // Getters et Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getSecteur() { return secteur; }
    public void setSecteur(String secteur) { this.secteur = secteur; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getResponsableContact() { return responsableContact; }
    public void setResponsableContact(String responsableContact) { this.responsableContact = responsableContact; }
    public boolean isEstActive() { return estActive; }
    public void setEstActive(boolean estActive) { this.estActive = estActive; }
}