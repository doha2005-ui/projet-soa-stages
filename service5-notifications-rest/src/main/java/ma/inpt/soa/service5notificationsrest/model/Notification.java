package ma.inpt.soa.service5notificationsrest.model;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destinataire_id", nullable = false)
    private Long destinataireId;

    @Column(name = "destinataire_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DestinataireType destinataireType;

    @Column(name = "titre", nullable = false, length = 150)
    private String titre;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "date_envoi")
    private Timestamp dateEnvoi;

    @Column(name = "statut", length = 10)
    @Enumerated(EnumType.STRING)
    private StatutNotification statut;

    @Column(name = "service_emetteur", nullable = false, length = 100)
    private String serviceEmetteur;

    public enum DestinataireType {
        ETUDIANT, ENTREPRISE, RESPONSABLE
    }

    public enum StatutNotification {
        LUE, NON_LUE
    }

    public Notification() {
        this.dateEnvoi = new Timestamp(System.currentTimeMillis());
        this.statut = StatutNotification.NON_LUE;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDestinataireId() { return destinataireId; }
    public void setDestinataireId(Long destinataireId) { this.destinataireId = destinataireId; }
    public DestinataireType getDestinataireType() { return destinataireType; }
    public void setDestinataireType(DestinataireType destinataireType) { this.destinataireType = destinataireType; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Timestamp getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(Timestamp dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    public StatutNotification getStatut() { return statut; }
    public void setStatut(StatutNotification statut) { this.statut = statut; }
    public String getServiceEmetteur() { return serviceEmetteur; }
    public void setServiceEmetteur(String serviceEmetteur) { this.serviceEmetteur = serviceEmetteur; }
}