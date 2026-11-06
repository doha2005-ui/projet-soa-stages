# Projet SOA : Gestion intelligente des stages

Plateforme de gestion des offres de stage, candidatures et suivi des stages (3 services SOAP, 3 services REST, orchestration BPMN).

## Services & Responsabilités

| Dossier | Type | Responsable | Description |
|---|---|---|---|
| `service1-etudiants-soap` | SOAP | Membre 1 | Gestion des profils étudiants |
| `service2-entreprises-soap` | SOAP | Membre 2 | Annuaire des entreprises d'accueil |
| `service3-offres-soap` | SOAP | Membre 3 | Gestion des offres de stage |
| `service4-candidatures-rest` | REST | Membre 3 | Dépôt et suivi des candidatures |
| `service5-notifications-rest` | REST | Membre 1 | Historique et envoi des alertes |
| `service6-suivi-stages-rest` | REST | Membre 2 | Comptes rendus, évaluations et historique |
| `bpmn` | Bonita BPM | Membre 4 | Orchestration globale du cycle de vie du stage |
| `frontend` | SPA Web | Équipe | Divisé par service (voir ci-dessous) |

---

## Organisation du Front-end par Service

> 📄 **Guide complet de répartition de l'équipe :** Consultez [`docs/repartition-frontend.md`](docs/repartition-frontend.md) pour le détail exhaustif des responsabilités, la matrice des fichiers modifiables par membre et le guide d'utilisation des outils `shared/`.

Pour éviter les problèmes d'intégration de dernière minute, **le front-end est divisé par service et non par type d'utilisateur**. Chaque membre conçoit et teste directement les écrans de ses propres services dès le début du projet.

### Nouvelle répartition par membre

- **Membre 1 :**
  - **Pages :** Étudiants (fiche, liste, modification) et Notifications (historique).
  - **Dossiers :** `frontend/pages/etudiants` et `frontend/pages/notifications`.
- **Membre 2 :**
  - **Pages :** Entreprises (fiche, liste) et Suivi des stages (stage, comptes rendus, évaluations, historique).
  - **Dossiers :** `frontend/pages/entreprises` et `frontend/pages/stages`.
- **Membre 3 :**
  - **Pages :** Offres (liste, création, modification) et Candidatures (dépôt, liste, changement de statut).
  - **Dossiers :** `frontend/pages/offres` et `frontend/pages/candidatures`.
- **Membre 4 (Chef de projet technique) :**
  - **Squelette commun :** Page d'accueil, menu, mise en page, couche d'appel aux services et page de suivi du processus BPMN.
  - **Dossiers :** `frontend/shared`, `frontend/index.html` et `frontend/pages/bpmn`.

> **Remarque sur les espaces utilisateur :** Les espaces *Étudiant*, *Entreprise* et *Responsable* restent accessibles via le sélecteur de rôle dans l'en-tête, qui filtre la barre de navigation sans fragmenter le code.

### Socle commun fourni par le Membre 4 (`frontend/shared`)

1. **`config.js`** : Centralisation des URLs de tous les services et de l'interrupteur `useMock`.
2. **`api.js`** : Fonction universelle d'appel REST gérant les codes HTTP et le format d'erreur convenu `{code, message}`.
3. **`soap.js`** : Utilitaire client SOAP (construction enveloppe XML, envoi POST, parsing XML et extraction des erreurs `SOAP Fault`).
4. **`theme.css`** : Charte graphique unifiée (mêmes polices, couleurs, cartes, tables, statuts et boutons).
5. **`layout.js`** : Routeur dynamique par hash (`#accueil`, `#etudiants`, `#offres`, `#candidatures`, etc.) et filtre par profil.

---

## Règles d'intégration

1. **Données simulées d'abord :** Chaque membre dispose d'un fichier `mock-*.json`. Grâce au bouton **"Données simulées"** dans l'en-tête, le front-end fonctionne immédiatement, même si les services backend ne sont pas encore déployés.
2. **Déploiement Tomcat :** En copiant le dossier `frontend` dans le dossier `webapps` de Tomcat (`http://localhost:8080/frontend/`), les services et le front-end partagent la même origine, éliminant tout souci de CORS.
3. **Chacun dans son dossier :** Chaque membre n'édite que ses dossiers sous `frontend/pages`. Toute modification de `frontend/shared` passe par une Merge Request du Membre 4.
4. **Point de contrôle rapide :** Une page d'accueil avec diagnostic "Hello World" permet de valider le bon raccordement de chaque module.

---

## Prérequis

- JDK 11 ou plus
- Maven 3.8+
- Tomcat 9
- MySQL ou PostgreSQL
- Bonita Studio 7.x / 2023
- SoapUI / Postman

---

## Démarrage rapide

1. **Initialisation automatique :**
   - Sur Linux / macOS : `bash init-projet-soa.sh`
   - Sur Windows : `init-projet-soa.bat`
2. **Configuration base de données :** Ajuster `<service>/src/main/resources/db.properties` et exécuter `database/schema.sql`.
3. **Compilation globale :**
   ```bash
   mvn clean package
   ```
4. **Déploiement :**
   - **Option A (Serveur local Node.js - le plus rapide) :**
  Double-cliquer sur `start-frontend.bat` ou exécuter :
  ```bash
  node frontend/server.js
  ```
  Puis ouvrir dans votre navigateur : `http://localhost:3000`

- **Option B (Déploiement direct dans Tomcat - même origine, pas de CORS) :**
  Copier le dossier `frontend` dans le dossier `webapps` de Tomcat (`webapps/frontend`), puis accéder à :
  `http://localhost:8080/frontend/`

- **Option C (Extension VS Code) :**
  Clic-droit sur `frontend/index.html` > **Open with Live Server**.

---

## Règles Git

- Personne ne pousse directement sur `main` : passer par une Merge Request.
- Une branche par membre, par exemple `membre1/service1-etudiants`.
- Ne modifier que le dossier de ses propres services et de ses pages frontend dédiées.
- Avant de travailler : `git checkout main && git pull`, puis fusionner `main` dans sa branche.
