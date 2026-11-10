package ma.inpt.soa.service2entreprisessoap.soap;

import ma.inpt.soa.service2entreprisessoap.dao.EntrepriseDAO;
import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;

import java.util.List;

import javax.jws.WebService;

@WebService(endpointInterface = "ma.inpt.soa.service2entreprisessoap.soap.EntrepriseService", targetNamespace = "http://soap.soa.inpt.ma/", serviceName = "EntrepriseService", portName = "EntreprisePort")
public class EntrepriseServiceImpl implements EntrepriseService {

    private final EntrepriseDAO dao = new EntrepriseDAO();

    @Override
    public boolean ajouterEntreprise(Entreprise entreprise) {
        System.out.println("SOAP: Tentative d'ajout de l'entreprise : " + entreprise.getRaisonSociale());
        return dao.ajouterEntreprise(entreprise);
    }

    @Override
    public Entreprise consulterEntrepriseParEmail(String email) {
        System.out.println("SOAP: Consultation de l'entreprise avec l'email : " + email);
        return dao.consulterEntreprise(email);
    }

    @Override
    public boolean verifierEntrepriseReferencee(int id) {
        System.out.println("SOAP: Vérification de l'entreprise ID : " + id);
        return dao.verifierEntrepriseReferencee(id);
    }

    @Override
    public List<Entreprise> listerEntreprises() {
        
        return dao.listerToutes();
    }
}