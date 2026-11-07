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
        EntityTransaction tx = null;
        try {
            tx = em.getTransaction();
            tx.begin();
            
            // Vérifier si le CNE existe déjà
            Etudiant existant = em.createQuery("SELECT e FROM Etudiant e WHERE e.cne = :cne", Etudiant.class)
                .setParameter("cne", etudiant.getCne())
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
                
            if (existant != null) {
                throw new Exception("Doublon CNE: un étudiant avec ce CNE existe déjà");
            }
            
            etudiant.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
            em.persist(etudiant);
            tx.commit();
            return etudiant;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public Etudiant consulterEtudiantParCNE(String cne) throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            Etudiant etudiant = em.createQuery("SELECT e FROM Etudiant e WHERE e.cne = :cne", Etudiant.class)
                .setParameter("cne", cne)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
                
            if (etudiant == null) {
                throw new Exception("Etudiant avec CNE " + cne + " introuvable");
            }
            
            return etudiant;
        } finally {
            em.close();
        }
    }

    @Override
    public Etudiant modifierEtudiant(Etudiant etudiant) throws Exception {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = null;
        try {
            tx = em.getTransaction();
            tx.begin();
            
            // Vérifier si l'étudiant existe
            Etudiant existant = em.find(Etudiant.class, etudiant.getId());
            if (existant == null) {
                throw new Exception("Etudiant introuvable");
            }
            
            // Mettre à jour les champs
            existant.setNom(etudiant.getNom());
            existant.setPrenom(etudiant.getPrenom());
            existant.setEmail(etudiant.getEmail());
            existant.setTelephone(etudiant.getTelephone());
            existant.setFiliere(etudiant.getFiliere());
            existant.setAnnee(etudiant.getAnnee());
            existant.setCvUrl(etudiant.getCvUrl());
            
            em.merge(existant);
            tx.commit();
            return existant;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean supprimerEtudiant(Long id) throws Exception {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = null;
        try {
            tx = em.getTransaction();
            tx.begin();
            
            Etudiant etudiant = em.find(Etudiant.class, id);
            if (etudiant == null) {
                throw new Exception("Etudiant introuvable");
            }
            
            em.remove(etudiant);
            tx.commit();
            return true;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean verifierExistence(String cne) throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            // Vérifie uniquement si le CNE existe dans la base de données
            Long count = em.createQuery("SELECT COUNT(e) FROM Etudiant e WHERE e.cne = :cne", Long.class)
                .setParameter("cne", cne)
                .getSingleResult();
            return count > 0;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean verifierStatut(String cne) throws Exception {
        EntityManager em = emf.createEntityManager();
        try {
            // Vérifie si le CNE existe ET si le statut est strictement 'ACTIF'
            Long count = em.createQuery("SELECT COUNT(e) FROM Etudiant e WHERE e.cne = :cne AND e.statut = 'ACTIF'", Long.class)
                .setParameter("cne", cne)
                .getSingleResult();
            return count > 0;
        } finally {
            em.close();
        }
    }
}