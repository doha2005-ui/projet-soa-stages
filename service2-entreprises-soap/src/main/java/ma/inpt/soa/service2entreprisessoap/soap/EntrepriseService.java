package ma.inpt.soa.service2entreprisessoap.soap;

import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService(targetNamespace = "http://soap.soa.inpt.ma/", serviceName = "EntrepriseService")
public interface EntrepriseService {

    @WebMethod(operationName = "ajouterEntreprise")
    boolean ajouterEntreprise(@WebParam(name = "entreprise") Entreprise entreprise);

    @WebMethod(operationName = "consulterEntrepriseParEmail")
    Entreprise consulterEntrepriseParEmail(@WebParam(name = "email") String email);

    @WebMethod(operationName = "verifierEntrepriseReferencee")
    boolean verifierEntrepriseReferencee(@WebParam(name = "id") int id);
}