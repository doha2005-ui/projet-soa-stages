# Conventions de l'équipe : Projet SOA 2026-2027

## 1. Répartition du Front-end par Service (Nouvelle Organisation)

Pour éviter les conflits d'intégration, le front-end est divisé par **service** et non par type d'utilisateur. Chaque membre implémente et teste directement les écrans de ses propres services.

| Membre | Rôle / Services | Dossiers Frontend | Protocole |
|---|---|---|---|
| **Membre 1** | Étudiants & Notifications | `frontend/pages/etudiants`<br>`frontend/pages/notifications` | SOAP (Service 1)<br>REST (Service 5) |
| **Membre 2** | Entreprises & Suivi Stages | `frontend/pages/entreprises`<br>`frontend/pages/stages` | SOAP (Service 2)<br>REST (Service 6) |
| **Membre 3** | Offres & Candidatures | `frontend/pages/offres`<br>`frontend/pages/candidatures` | SOAP (Service 3)<br>REST (Service 4) |
| **Membre 4** | Squelette Commun & BPMN | `frontend/shared`<br>`frontend/index.html`<br>`frontend/pages/bpmn` | BPMN Bonita & Socle commun |

> **Règle Git :** Chacun ne modifie que ses propres dossiers dans `frontend/pages`. Les fichiers du dossier `frontend/shared` ne sont modifiés que via Merge Request validée par le **Membre 4**.

---

## 2. Statuts de Candidature

Les transitions de statuts convenues pour les candidatures sont :
1. `déposée` : Candidature soumise par l'étudiant (soit via REST direct, soit déclenchant Bonita).
2. `en cours d'évaluation` : Prise en charge par le recruteur de l'entreprise.
3. `acceptée` : Validation de l'offre par l'entreprise puis validation pédagogique.
4. `refusée` : Candidature rejetée avec motif.

---

## 3. Format des Erreurs et Protocoles

### Services REST (Services 4, 5, 6 & Bonita)
- **Format standard JSON en cas d'erreur** :
  ```json
  {
    "code": 404,
    "message": "Description explicite de l'erreur"
  }
  ```
- **Codes HTTP utilisés** :
  - `200 OK` : Succès avec données retournées.
  - `201 Created` : Ressource créée avec succès (ex: dépôt candidature).
  - `204 No Content` : Opération réussie sans corps de réponse.
  - `400 Bad Request` : Données invalides envoyées.
  - `404 Not Found` : Ressource inexistante.
  - `500 Internal Server Error` : Erreur interne serveur.

### Services SOAP JAX-WS (Services 1, 2, 3)
- Utilisation de l'enveloppe SOAP 1.1 construite via `frontend/shared/soap.js`.
- En cas d'anomalie métier ou technique, génération d'une **SOAP Fault** :
  ```xml
  <soap:Fault>
    <faultcode>soap:Client</faultcode>
    <faultstring>Message explicite d'erreur</faultstring>
  </soap:Fault>
  ```
- L'utilitaire `soapCall()` extrait automatiquement `faultstring` et le remonte sous forme d'erreur lisible.

---

## 4. Données Simulées (Mode Mock)

- Chaque membre maintient un fichier d'exemple JSON dans son dossier :
  - `pages/etudiants/mock-etudiants.json`
  - `pages/notifications/mock-notifications.json`
  - `pages/entreprises/mock-entreprises.json`
  - `pages/stages/mock-stages.json`
  - `pages/offres/mock-offres.json`
  - `pages/candidatures/mock-candidatures.json`
  - `pages/bpmn/mock-bpmn.json`
- L'interrupteur `useMock` dans `frontend/shared/config.js` (ou directement via le bouton à bascule dans l'en-tête de l'application) permet de basculer instantanément entre les données simulées et les services réels Tomcat.

---

## 5. Déploiement et CORS

- **Recommandation principale** : Déployer le front-end directement dans Tomcat sous le dossier `webapps/frontend`.
  - Même port (8080) et même adresse IP (`localhost`) = **aucun problème de CORS**.
- **Alternative serveur séparé (Live Server / Node / Python)** :
  - Si le front-end tourne sur un autre port (ex: 3000 ou 5500), chaque membre doit activer le filtre CORS de Tomcat dans le `web.xml` de son service :
  ```xml
  <filter>
    <filter-name>CorsFilter</filter-name>
    <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
    <init-param>
      <param-name>cors.allowed.origins</param-name>
      <param-value>*</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>CorsFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
  ```
