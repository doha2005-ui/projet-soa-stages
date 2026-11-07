package ma.inpt.soa.service2entreprisessoap;

import ma.inpt.soa.service2entreprisessoap.dao.EntrepriseDAO;
import ma.inpt.soa.service2entreprisessoap.entity.Entreprise;
import ma.inpt.soa.service2entreprisessoap.soap.EntrepriseServiceImpl;

import java.util.List;

/**
 * Classe de test autonome pour le Service 2 (Entreprises SOAP).
 * Exécutable directement avec : Run As > Java Application dans Eclipse / IntelliJ
 */
public class TestService2 {

    public static void main(String[] args) {
        System.out.println("==============================================================");
        System.out.println("   TEST DU SERVICE 2 : ENTREPRISES (SOAP JAX-WS)");
        System.out.println("==============================================================");

        EntrepriseServiceImpl service = new EntrepriseServiceImpl();
        EntrepriseDAO dao = new EntrepriseDAO();

        // 1. Test Listing des entreprises existantes
        System.out.println("\n[1/4] Test de listerEntreprises()...");
        List<Entreprise> listeInitiale = service.listerEntreprises();
        System.out.println("Nombre d'entreprises trouvées : " + listeInitiale.size());
        for (Entreprise e : listeInitiale) {
            System.out.println("  - #" + e.getId() + " : " + e.getRaisonSociale() + " (" + e.getVille() + ") - Conventionnée: " + e.isConventionnee());
        }

        // 2. Test Ajout d'une nouvelle entreprise
        System.out.println("\n[2/4] Test de ajouterEntreprise()...");
        String testEmail = "test_" + System.currentTimeMillis() + "@inpt-partenaire.ma";
        Entreprise nouvelle = new Entreprise();
        nouvelle.setRaisonSociale("INPT Innovation Labs");
        nouvelle.setSecteur("R&D Télécoms & IA");
        nouvelle.setVille("Rabat");
        nouvelle.setContactNom("Dr. Testeur");
        nouvelle.setContactEmail(testEmail);
        nouvelle.setTelephone("+212 5 37 00 00 00");
        nouvelle.setConventionnee(true);

        boolean ajoutOk = service.ajouterEntreprise(nouvelle);
        System.out.println("Résultat de l'ajout : " + (ajoutOk ? "✅ SUCCÈS" : "❌ ÉCHEC"));

        // 3. Test Consultation par Email
        System.out.println("\n[3/4] Test de consulterEntrepriseParEmail(" + testEmail + ")...");
        Entreprise trouvee = service.consulterEntrepriseParEmail(testEmail);
        if (trouvee != null) {
            System.out.println("✅ Entreprise trouvée en base :");
            System.out.println("  - ID : " + trouvee.getId());
            System.out.println("  - Raison Sociale : " + trouvee.getRaisonSociale());
            System.out.println("  - Contact : " + trouvee.getContactNom() + " (" + trouvee.getContactEmail() + ")");

            // 4. Test Vérification statut conventionnée
            System.out.println("\n[4/4] Test de verifierEntrepriseReferencee(ID=" + trouvee.getId() + ")...");
            boolean estConventionnee = service.verifierEntrepriseReferencee(trouvee.getId());
            System.out.println("Statut conventionné : " + (estConventionnee ? "✅ CONVENTIONNÉE" : "⚠️ NON CONVENTIONNÉE"));
        } else {
            System.out.println("⚠️ Entreprise non trouvée (vérifiez la connexion MySQL)");
        }

        System.out.println("\n==============================================================");
        System.out.println("   FIN DU TEST SERVICE 2");
        System.out.println("==============================================================");
    }
}

