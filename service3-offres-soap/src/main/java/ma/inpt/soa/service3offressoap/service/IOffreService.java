package ma.inpt.soa.service3offressoap.service;

import ma.inpt.soa.service3offressoap.model.Offre;
import java.util.List;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

@WebService(targetNamespace = "http://service3.soa.inpt.ma/")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface IOffreService {

    @WebMethod
    List<Offre> listerOffres();

    @WebMethod
    Offre consulterOffre(@WebParam(name = "id") int id) throws Exception;

    @WebMethod
    Offre creerOffre(@WebParam(name = "offre") Offre offre) throws Exception;

    @WebMethod
    boolean modifierOffre(@WebParam(name = "offre") Offre offre) throws Exception;

    @WebMethod
    boolean supprimerOffre(@WebParam(name = "id") int id) throws Exception;

    @WebMethod
    boolean verifierDisponibilite(@WebParam(name = "offreId") int offreId) throws Exception;

    @WebMethod
    boolean reserverPlace(@WebParam(name = "offreId") int offreId) throws Exception;

    @WebMethod
    boolean verifierCompatibilite(@WebParam(name = "offreId") int offreId, @WebParam(name = "etudiantId") int etudiantId) throws Exception;
}
