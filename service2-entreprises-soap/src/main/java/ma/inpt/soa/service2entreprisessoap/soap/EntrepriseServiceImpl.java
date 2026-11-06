package ma.inpt.soa.service2entreprisessoap.soap;

import ma.inpt.soa.service2entreprisessoap.dao.EntrepriseDAO;
import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import javax.jws.WebService;

@WebService(endpointInterface = "ma.inpt.soa.service2entreprisessoap.soap.EntrepriseService",
            serviceName = "EntrepriseService",
            targetNamespace = "http://soap.soa.inpt.ma/")
public class EntrepriseServiceImpl implements EntrepriseService {
    private EntrepriseDAO dao = new EntrepriseDAO();

    @Override
    public boolean ajouterEntreprise(Entreprise entreprise) { return dao.ajouterEntreprise(entreprise); }

    @Override
    public Entreprise consulterEntreprise(int id) { return dao.consulterEntreprise(id); }

    @Override
    public boolean verifierEntrepriseReferencee(int id) { return dao.verifierEntrepriseReferencee(id); }
}