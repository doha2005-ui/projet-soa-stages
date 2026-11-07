# Guide de Répartition du Front-end par Service
**Équipe Projet SOA 2026-2027 — Gestion Intelligente des Stages**

---

## 1. Principe Fondateur et Objectifs

Dans une approche classique par « espaces utilisateurs » (un espace étudiant, un espace entreprise, un espace responsable), chaque membre développait une interface appelant des services SOAP ou REST développés par d'autres collègues. Les incohérences et les blocages d'intégration n'apparaissaient alors qu'à la toute fin du projet.

Pour garantir une intégration fluide, **le front-end est divisé par service, et non par rôle utilisateur** :
- Chaque membre développe et teste **les écrans correspondant à ses propres services**.
- Dès la première semaine, chaque membre valide son API (en SOAP ou REST) directement depuis son interface.
- Les espaces *Étudiant*, *Entreprise* et *Responsable* restent disponibles : ce sont de simples **vues filtrées du squelette commun** (via le sélecteur de rôle en haut de page), sans duplication de code.

---

## 2. Arborescence Globale du Front-end

```
frontend/
│
├── index.html                           # Page principale (squelette et conteneur dynamique)
├── server.js                            # Serveur local Node.js léger (zéro dépendance)
│
├── shared/                              # SOCLE COMMUN (Géré uniquement par Membre 4)
│   ├── config.js                        # URLs des services et interrupteur useMock
│   ├── api.js                           # Utilitaire d'appel REST (gestion HTTP & {code, message})
│   ├── soap.js                          # Utilitaire d'appel SOAP (enveloppe XML, DOMParser & Fault)
│   ├── layout.js                        # Routage dynamique (#...) et filtres de profil
│   └── theme.css                        # Feuille de style unifiée (couleurs, boutons, badges, tables)
│
└── pages/                               # PAGES DÉDIÉES PAR SERVICE
    ├── accueil/                         # Tableau de bord et point de contrôle "Hello" (Semaine 1)
    │   └── accueil.js
    │
    ├── etudiants/                       # Service 1 SOAP (Membre 1)
    │   ├── etudiants.js
    │   └── mock-etudiants.json
    │
    ├── notifications/                   # Service 5 REST (Membre 1)
    │   ├── notifications.js
    │   └── mock-notifications.json
    │
    ├── entreprises/                     # Service 2 SOAP (Membre 2)
    │   ├── entreprises.js
    │   └── mock-entreprises.json
    │
    ├── stages/                          # Service 6 REST (Membre 2)
    │   ├── stages.js
    │   └── mock-stages.json
    │
    ├── offres/                          # Service 3 SOAP (Membre 3)
    │   ├── offres.js
    │   └── mock-offres.json
    │
    ├── candidatures/                    # Service 4 REST (Membre 3)
    │   ├── candidatures.js
    │   └── mock-candidatures.json
    │
    └── bpmn/                            # Orchestrateur Bonita (Membre 4)
        ├── bpmn.js
        └── mock-bpmn.json
```

---

## 3. Matrice des Responsabilités : Qui modifie quoi ?

Pour éviter les conflits Git, **chaque membre a un périmètre de fichiers strictement délimité**. Aucun membre ne doit modifier les fichiers d'un collègue sans concertation.

### 👤 Membre 1 : Étudiants (SOAP) & Notifications (REST)
- **Services backend associés :**
  - `service1-etudiants-soap/`
  - `service5-notifications-rest/`
- **Fichiers front-end autorisés (exclusivement) :**
  - `frontend/pages/etudiants/etudiants.js` (Fiche, liste, ajout, modification étudiant)
  - `frontend/pages/etudiants/mock-etudiants.json` (Données d'exemples d'étudiants)
  - `frontend/pages/notifications/notifications.js` (Historique et envoi des alertes)
  - `frontend/pages/notifications/mock-notifications.json` (Données d'exemples de notifications)
- ❌ **Interdit de modifier :** Les dossiers des autres membres (`entreprises`, `stages`, `offres`, `candidatures`, `bpmn`) et le dossier `frontend/shared/`.

---

### 👤 Membre 2 : Entreprises (SOAP) & Suivi des Stages (REST)
- **Services backend associés :**
  - `service2-entreprises-soap/`
  - `service6-suivi-stages-rest/`
- **Fichiers front-end autorisés (exclusivement) :**
  - `frontend/pages/entreprises/entreprises.js` (Annuaire des entreprises, fiche, conventions)
  - `frontend/pages/entreprises/mock-entreprises.json` (Données d'exemples d'entreprises)
  - `frontend/pages/stages/stages.js` (Suivi du stage, dépôt comptes rendus, évaluations)
  - `frontend/pages/stages/mock-stages.json` (Données d'exemples de stages et comptes rendus)
- ❌ **Interdit de modifier :** Les dossiers des autres membres et `frontend/shared/`.

---

### 👤 Membre 3 : Offres (SOAP) & Candidatures (REST)
- **Services backend associés :**
  - `service3-offres-soap/`
  - `service4-candidatures-rest/`
- **Fichiers front-end autorisés (exclusivement) :**
  - `frontend/pages/offres/offres.js` (Catalogue des offres, publication, édition)
  - `frontend/pages/offres/mock-offres.json` (Données d'exemples d'offres)
  - `frontend/pages/candidatures/candidatures.js` (Dépôt de candidature, transitions de statut)
  - `frontend/pages/candidatures/mock-candidatures.json` (Données d'exemples de candidatures)
- ❌ **Interdit de modifier :** Les dossiers des autres membres et `frontend/shared/`.

---

### 👤 Membre 4 : Squelette Commun, BPMN & Chef de Projet Technique
- **Services backend associés :**
  - `bpmn/` (Processus Bonita BPM)
- **Fichiers front-end sous sa responsabilité :**
  - `frontend/index.html` (Mise en page générale, sélecteurs, en-tête)
  - `frontend/shared/config.js` (Gestion des endpoints de services et du mode mock)
  - `frontend/shared/api.js` (Couche REST partagée)
  - `frontend/shared/soap.js` (Couche SOAP partagée)
  - `frontend/shared/layout.js` (Gestion du menu et chargement des pages)
  - `frontend/shared/theme.css` (Styles globaux)
  - `frontend/pages/accueil/accueil.js` (Point de contrôle et tableau de bord)
  - `frontend/pages/bpmn/bpmn.js` (Supervision du workflow BPMN Bonita)
  - `frontend/pages/bpmn/mock-bpmn.json` (Données d'exemples BPMN)
- **Rôle Git supplémentaire :** Revue et validation des Merge Requests (Pull Requests) sur GitHub.

---

## 4. Tableau Synthétique des Fichiers par Membre

| Membre | Rôle | Fichiers Front-end Modifiables | Services Backend Modifiables |
|---|---|---|---|
| **Membre 1** | Étudiants & Notifications | `frontend/pages/etudiants/*`<br>`frontend/pages/notifications/*` | `service1-etudiants-soap/`<br>`service5-notifications-rest/` |
| **Membre 2** | Entreprises & Suivi Stages | `frontend/pages/entreprises/*`<br>`frontend/pages/stages/*` | `service2-entreprises-soap/`<br>`service6-suivi-stages-rest/` |
| **Membre 3** | Offres & Candidatures | `frontend/pages/offres/*`<br>`frontend/pages/candidatures/*` | `service3-offres-soap/`<br>`service4-candidatures-rest/` |
| **Membre 4** | Squelette, BPMN & Intégration | `frontend/shared/*`<br>`frontend/index.html`<br>`frontend/pages/accueil/*`<br>`frontend/pages/bpmn/*` | `bpmn/` |

---

## 5. Comment Utiliser les Outils Communs (`frontend/shared`)

Tous les membres utilisent les fonctions prêtes à l'emploi développées dans `frontend/shared` :

### Pour appeler un service SOAP (Membres 1, 2, 3) :
```javascript
import { CONFIG } from '../../shared/config.js';
import { soapCall, getXmlNodeText } from '../../shared/soap.js';

// Exemple : Appel de l'opération SOAP 'listerEtudiants'
const res = await soapCall({
  url: CONFIG.services.etudiants.endpoint,
  operation: 'listerEtudiants',
  bodyXml: '', // Paramètres XML éventuels
  namespace: CONFIG.services.etudiants.namespace,
  mockFallback: CONFIG.services.etudiants.mockFile // Fichier JSON si useMock = true
});
```

### Pour appeler un service REST (Membres 1, 2, 3, 4) :
```javascript
import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

// Exemple : Récupérer des données via GET
const candidatures = await restCall(
  CONFIG.services.candidatures.endpoint,
  { method: 'GET' },
  CONFIG.services.candidatures.mockFile // Fichier JSON si useMock = true
);

// Exemple : Afficher un message à l'utilisateur
showToast('Candidature enregistrée avec succès !', 'success');
```

---

## 6. Règles de Collaboration Git

1. **Une branche par membre :**
   - Membre 1 : `membre1/etudiants-notifications`
   - Membre 2 : `membre2/entreprises-stages`
   - Membre 3 : `membre3/offres-candidatures`
   - Membre 4 : `membre4/squelette-bpmn`

2. **Aucun commit direct sur `main` :**
   - Chaque fonctionnalité est testée localement avec `start-frontend.bat` (ou `node server.js`).
   - Le membre pousse sa branche (`git push origin membreX/...`).
   - Il crée une **Pull Request (PR)** sur GitHub.
   - Le Membre 4 valide la fusion.

3. **Garantie zéro conflit :**
   Puisque chaque membre travaille dans des sous-dossiers isolés de `frontend/pages/`, Git réalise des fusions automatiques sans conflit.

