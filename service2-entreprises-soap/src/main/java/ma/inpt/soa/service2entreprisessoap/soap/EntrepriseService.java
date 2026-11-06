package ma.inpt.soa.service2entreprisessoap.soap;

import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService(name = "EntrepriseService", targetNamespace = "http://soap.soa.inpt.ma/")
public interface EntrepriseService {
    @WebMethod boolean ajouterEntreprise(@WebParam(name = "entreprise") Entreprise entreprise);
    @WebMethod Entreprise consulterEntreprise(@WebParam(name = "id") int id);
    @WebMethod boolean verifierEntrepriseReferencee(@WebParam(name = "id") int id);
}