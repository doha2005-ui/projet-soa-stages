package ma.inpt.soa.service1etudiantssoap.service;

import ma.inpt.soa.service1etudiantssoap.model.Etudiant;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import java.util.List;

@WebService(targetNamespace = "http://service1.soa.inpt.ma/")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface IEtudiantService {

    @WebMethod
    List<Etudiant> listerEtudiants() throws Exception;

    @WebMethod
    Etudiant ajouterEtudiant(@WebParam(name = "etudiant") Etudiant etudiant) throws Exception;

    @WebMethod
    Etudiant consulterEtudiantParCNE(@WebParam(name = "cne") String cne) throws Exception;

    @WebMethod
    Etudiant modifierEtudiant(@WebParam(name = "etudiant") Etudiant etudiant) throws Exception;

    @WebMethod
    boolean supprimerEtudiant(@WebParam(name = "id") Long id) throws Exception;

    @WebMethod
    boolean verifierExistence(@WebParam(name = "cne") String cne) throws Exception;

    @WebMethod
    boolean verifierStatut(@WebParam(name = "cne") String cne) throws Exception; // <-- AJOUTÉE ICI
}