# Projet SOA : Gestion intelligente des stages

Plateforme de gestion des offres de stage, candidatures et suivi des stages (3 services SOAP, 3 services REST, orchestration BPMN).

## Services

| Dossier | Type | Responsable |
|---|---|---|
| service1-etudiants-soap | soap | Membre 1 |
| service2-entreprises-soap | soap | Membre 2 |
| service3-offres-soap | soap | Membre 3 |
| service4-candidatures-rest | rest | Membre 3 |
| service5-notifications-rest | rest | Membre 1 |
| service6-suivi-stages-rest | rest | Membre 2 |
| bpmn | Processus Bonita | Membre 4 |
| frontend | Interface (bonus) | Membres 1, 2, 3 |

## Prérequis

JDK 11 ou plus, Maven 3.8+, Tomcat 9, MySQL ou PostgreSQL, Bonita Studio, SoapUI, Postman.

## Démarrage

1. `cp <service>/src/main/resources/db.properties.example <service>/src/main/resources/db.properties` puis renseigner ses identifiants.
2. Créer la base avec `database/schema.sql`.
3. Compiler : `mvn clean package` (génère un `.war` par service dans `target/`).
4. Déployer les `.war` dans le dossier `webapps` de Tomcat.

## Règles Git

- Personne ne pousse directement sur `main` : passer par une Merge Request.
- Une branche par membre, par exemple `membre1/service1-etudiants`.
- Ne modifier que le dossier de ses propres services.
- Avant de travailler : `git checkout main && git pull`, puis fusionner `main` dans sa branche.
