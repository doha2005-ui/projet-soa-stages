package ma.inpt.soa.service3offressoap.service;

import ma.inpt.soa.service3offressoap.dao.OffreDAO;
import ma.inpt.soa.service3offressoap.model.Offre;
import java.util.List;
import javax.jws.WebService;

@WebService(
    endpointInterface = "ma.inpt.soa.service3offressoap.service.IOffreService",
    targetNamespace = "http://service3.soa.inpt.ma/",
    serviceName = "OffreService",
    portName = "OffrePort"
)
public class OffreServiceImpl implements IOffreService {

    private final OffreDAO dao = new OffreDAO();

    @Override
    public List<Offre> listerOffres() {
        System.out.println("[SOAP OffreService] Appel de listerOffres");
        return dao.listerToutes();
    }

    @Override
    public Offre consulterOffre(int id) throws Exception {
        System.out.println("[SOAP OffreService] Consultation offre ID : " + id);
        Offre o = dao.getById(id);
        if (o == null) {
            throw new Exception("Offre avec ID " + id + " introuvable.");
        }
        return o;
    }

    @Override
    public Offre creerOffre(Offre offre) throws Exception {
        System.out.println("[SOAP OffreService] Création offre : " + (offre != null ? offre.getTitre() : "null"));
        if (offre == null || offre.getTitre() == null || offre.getTitre().trim().isEmpty()) {
            throw new Exception("Le titre de l'offre est obligatoire.");
        }
        Offre creee = dao.ajouterOffre(offre);
        if (creee == null) {
            throw new Exception("Échec de l'enregistrement de l'offre en base de données.");
        }
        return creee;
    }

    @Override
    public boolean modifierOffre(Offre offre) throws Exception {
        System.out.println("[SOAP OffreService] Modification offre ID : " + (offre != null ? offre.getId() : "null"));
        if (offre == null || offre.getId() <= 0) {
            throw new Exception("Identifiant d'offre invalide pour la modification.");
        }
        boolean ok = dao.modifierOffre(offre);
        if (!ok) {
            throw new Exception("Échec de la modification de l'offre ID " + offre.getId());
        }
        return true;
    }

    @Override
    public boolean supprimerOffre(int id) throws Exception {
        System.out.println("[SOAP OffreService] Suppression offre ID : " + id);
        boolean ok = dao.supprimerOffre(id);
        if (!ok) {
            throw new Exception("Offre ID " + id + " introuvable ou échec de suppression.");
        }
        return true;
    }

    @Override
    public boolean verifierDisponibilite(int offreId) throws Exception {
        System.out.println("[SOAP OffreService] Vérification disponibilité offre ID : " + offreId);
        boolean dispo = dao.verifierDisponibilite(offreId);
        if (!dispo) {
            System.out.println("[SOAP OffreService] Offre ID " + offreId + " non disponible ou inactive.");
        }
        return dispo;
    }

    @Override
    public boolean reserverPlace(int offreId) throws Exception {
        System.out.println("[SOAP OffreService] Réservation de place pour offre ID : " + offreId);
        boolean ok = dao.reserverPlace(offreId);
        if (!ok) {
            throw new Exception("Impossible de réserver une place : l'offre ID " + offreId + " n'est pas disponible.");
        }
        return true;
    }

    @Override
    public boolean verifierCompatibilite(int offreId, int etudiantId) throws Exception {
        System.out.println("[SOAP OffreService] Vérification compatibilité offre ID " + offreId + " pour étudiant ID " + etudiantId);
        return dao.verifierCompatibilite(offreId, etudiantId);
    }
}
