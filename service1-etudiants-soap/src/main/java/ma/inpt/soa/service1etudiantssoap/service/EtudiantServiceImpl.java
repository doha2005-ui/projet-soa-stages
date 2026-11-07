package ma.inpt.soa.service1etudiantssoap.service;

import ma.inpt.soa.service1etudiantssoap.model.Etudiant;
import javax.jws.WebService;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.EntityTransaction;
import java.util.List; // <-- AJOUTER CET IMPORT

@WebService(endpointInterface = "ma.inpt.soa.service1etudiantssoap.service.IEtudiantService", serviceName = "EtudiantService")
public class EtudiantServiceImpl implements IEtudiantService {

    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("EtudiantsPU");

    // --- AJOUTER CETTE MÉTHODE ---
    @Override
    public List<Etudiant> listerEtudiants() throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT e FROM Etudiant e", Etudiant.class).getResultList();
        } finally {
            em.close();
        }
    }
    // -----------------------------

    // ... (le reste de tes méthodes ajouterEtudiant, consulterEtudiantParCNE, etc. reste inchangé)