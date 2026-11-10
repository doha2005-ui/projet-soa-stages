package ma.inpt.soa.service6suivistagesrest;

import ma.inpt.soa.service6suivistagesrest.dao.StageDAO;
import ma.inpt.soa.service6suivistagesrest.entity.Stage;
import ma.inpt.soa.service6suivistagesrest.rest.StageResource;

import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.List;

/**
 * Classe de test autonome pour le Service 6 (Suivi des Stages REST).
 * Exécutable directement avec : Run As > Java Application dans Eclipse / IntelliJ
 */
public class TestService6 {

    public static void main(String[] args) {
        System.out.println("==============================================================");
        System.out.println("   TEST DU SERVICE 6 : SUIVI DES STAGES (REST JERSEY)");
        System.out.println("==============================================================");

        StageResource resource = new StageResource();
        StageDAO dao = new StageDAO();

        // 1. Test Lister les stages existants
        System.out.println("\n[1/4] Test de listerStages() (GET /api/stages)...");
        Response respListe = resource.listerStages();
        System.out.println("Code HTTP : " + respListe.getStatus());
        if (respListe.getEntity() instanceof List) {
            @SuppressWarnings("unchecked")
            List<Stage> liste = (List<Stage>) respListe.getEntity();
            System.out.println("Nombre de stages trouvés : " + liste.size());
            for (Stage s : liste) {
                System.out.println("  - Stage #" + s.getId() + " : " + s.getIntitule());
                System.out.println("    Étudiant : " + s.getEtudiantNom() + " (" + s.getEtudiantCne() + ")");
                System.out.println("    Entreprise : " + s.getEntrepriseNom() + " | État : " + s.getEtat());
                System.out.println("    Comptes rendus déposés : " + (s.getComptesRendus() != null ? s.getComptesRendus().size() : 0));
            }
        }

        // 2. Test Création d'un stage
        System.out.println("\n[2/4] Test de creerStage() (POST /api/stages)...");
        Stage nouveau = new Stage();
        nouveau.setEtudiantId(1); // Yassine Benali
        nouveau.setEntrepriseId(1); // TechSolutions Maroc
        nouveau.setIntitule("Test Automatisé - Architecture SOA & Cloud");
        nouveau.setDateDebut(new Date());
        nouveau.setDateFin(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 120)); // +4 mois
        nouveau.setTuteurEntreprise("M. Karim Tazi");
        nouveau.setTuteurAcademique("Pr. Encadrant INPT");
        nouveau.setEtat("EN_COURS");

        Response respCreer = resource.creerStage(nouveau);
        System.out.println("Code HTTP création : " + respCreer.getStatus() + " (" + (respCreer.getStatus() == 201 ? "✅ 201 CREATED" : "❌ ERREUR") + ")");

        int stageCreeId = 1;
        if (respCreer.getEntity() instanceof Stage) {
            Stage cree = (Stage) respCreer.getEntity();
            stageCreeId = cree.getId();
            System.out.println("✅ ID généré par MySQL : " + stageCreeId);
        }

        // 3. Test Consultation par ID
        System.out.println("\n[3/4] Test de getStage(ID=" + stageCreeId + ") (GET /api/stages/" + stageCreeId + ")...");
        Response respGet = resource.getStage(stageCreeId);
        System.out.println("Code HTTP consultation : " + respGet.getStatus());
        if (respGet.getEntity() instanceof Stage) {
            Stage stg = (Stage) respGet.getEntity();
            System.out.println("  Intitulé : " + stg.getIntitule());
            System.out.println("  État actuel : " + stg.getEtat());
        }

        // 4. Test Mise à jour du statut
        System.out.println("\n[4/4] Test de mettreAJourStatut() (PATCH /api/stages/" + stageCreeId + "/statut?statut=TERMINE)...");
        Response respPatch = resource.mettreAJourStatut(stageCreeId, "TERMINE");
        System.out.println("Code HTTP mise à jour : " + respPatch.getStatus() + " (" + (respPatch.getStatus() == 200 ? "✅ 200 OK" : "❌ ERREUR") + ")");
        System.out.println("Réponse : " + respPatch.getEntity());

        System.out.println("\n==============================================================");
        System.out.println("   FIN DU TEST SERVICE 6");
        System.out.println("==============================================================");
    }
}

