package ma.inpt.soa.service1etudiantssoap.service;

import ma.inpt.soa.service1etudiantssoap.model.Etudiant;
import javax.jws.WebService;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.EntityTransaction;
import java.util.List;

@WebService(endpointInterface = "ma.inpt.soa.service1etudiantssoap.service.IEtudiantService", serviceName = "EtudiantService")
public class EtudiantServiceImpl implements IEtudiantService {

    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("EtudiantsPU");

    @Override
    public List<Etudiant> listerEtudiants() throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT e FROM Etudiant e", Etudiant.class).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public Etudiant ajouterEtudiant(Etudiant etudiant) throws Exception {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(etudiant);
            tx.commit();
            return etudiant;
        } catch (Exception e) {
            tx.rollback();
            throw new Exception("Erreur ajout: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @Override
    public Etudiant consulterEtudiantParCNE(String cne) throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT e FROM Etudiant e WHERE e.cne = :cne", Etudiant.class)
                     .setParameter("cne", cne)
                     .getSingleResult();
        } catch (Exception e) {
            throw new Exception("Etudiant avec CNE " + cne + " introuvable");
        } finally {
            em.close();
        }
    }

    @Override
    public Etudiant modifierEtudiant(Etudiant etudiant) throws Exception {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(etudiant);
            tx.commit();
            return etudiant;
        } catch (Exception e) {
            tx.rollback();
            throw new Exception("Erreur modification: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @Override
    public boolean supprimerEtudiant(Long id) throws Exception {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Etudiant etudiant = em.find(Etudiant.class, id);
            if (etudiant == null) throw new Exception("Etudiant introuvable");
            em.remove(etudiant);
            tx.commit();
            return true;
        } catch (Exception e) {
            tx.rollback();
            throw new Exception("Erreur suppression: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @Override
    public boolean verifierExistence(String cne) throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            Long count = em.createQuery("SELECT COUNT(e) FROM Etudiant e WHERE e.cne = :cne", Long.class)
                           .setParameter("cne", cne)
                           .getSingleResult();
            return count > 0;
        } finally {
            em.close();
        }
    }
}