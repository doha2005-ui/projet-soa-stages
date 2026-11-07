-- ==============================================================================
-- Projet SOA : Gestion intelligente des stages (2026-2027)
-- Schéma de base de données relationnelle MySQL / MariaDB
-- Chaque service gère son périmètre fonctionnel conformément à l'architecture.
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS soa_stages CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE soa_stages;

-- ------------------------------------------------------------------------------
-- MEMBRE 1 : Service 1 (SOAP Étudiants) & Service 5 (REST Notifications)
-- ------------------------------------------------------------------------------

-- Table des étudiants (Service 1 - SOAP)
CREATE TABLE IF NOT EXISTS etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cne VARCHAR(30) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(30),
    filiere VARCHAR(100) NOT NULL,
    annee VARCHAR(50) NOT NULL,
    cv_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des notifications (Service 5 - REST)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destinataire_id INT NOT NULL,
    destinataire_type ENUM('ETUDIANT', 'ENTREPRISE', 'RESPONSABLE') NOT NULL,
    titre VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('LUE', 'NON_LUE') DEFAULT 'NON_LUE',
    service_emetteur VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- MEMBRE 2 : Service 2 (SOAP Entreprises) & Service 6 (REST Suivi des Stages)
-- ------------------------------------------------------------------------------

-- Table des entreprises d'accueil (Service 2 - SOAP)
CREATE TABLE IF NOT EXISTS entreprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raison_sociale VARCHAR(150) NOT NULL,
    secteur VARCHAR(100) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    contact_nom VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    telephone VARCHAR(30),
    conventionnee BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des stages en cours / validés (Service 6 - REST)
CREATE TABLE IF NOT EXISTS stages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    entreprise_id INT NOT NULL,
    intitule VARCHAR(200) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    tuteur_entreprise VARCHAR(100),
    tuteur_academique VARCHAR(100),
    etat ENUM('EN_COURS', 'TERMINE', 'SUSPENDU') DEFAULT 'EN_COURS',
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des comptes rendus périodiques de stage (Service 6 - REST)
CREATE TABLE IF NOT EXISTS comptes_rendus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage_id INT NOT NULL,
    periode VARCHAR(100) NOT NULL,
    date_depot DATE NOT NULL,
    resume TEXT NOT NULL,
    statut_validation ENUM('EN_ATTENTE', 'VALIDÉ', 'À_REVOIR') DEFAULT 'EN_ATTENTE',
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des évaluations de stage (Service 6 - REST)
CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage_id INT NOT NULL UNIQUE,
    note_entreprise DECIMAL(4,2),
    note_academique DECIMAL(4,2),
    commentaire_tuteur TEXT,
    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- MEMBRE 3 : Service 3 (SOAP Offres) & Service 4 (REST Candidatures)
-- ------------------------------------------------------------------------------

-- Table des offres de stage (Service 3 - SOAP)
CREATE TABLE IF NOT EXISTS offres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entreprise_id INT NOT NULL,
    titre VARCHAR(200) NOT NULL,
    lieu VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    duree VARCHAR(50),
    remuneration VARCHAR(100),
    competences TEXT,
    description TEXT NOT NULL,
    date_publication DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table des candidatures (Service 4 - REST)
CREATE TABLE IF NOT EXISTS candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offre_id INT NOT NULL,
    etudiant_id INT NOT NULL,
    date_depot DATE NOT NULL,
    statut ENUM('déposée', 'en cours d\'évaluation', 'acceptée', 'refusée') DEFAULT 'déposée',
    motivation TEXT,
    orchestrateur VARCHAR(50) DEFAULT 'REST',
    FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE,
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================================
-- JEU DE DONNÉES DE TEST (SEED DATA)
-- Conforme aux fichiers mock JSON du front-end
-- ==============================================================================

-- Étudiants (Membre 1)
INSERT INTO etudiants (id, cne, nom, prenom, email, telephone, filiere, annee, cv_url) VALUES
(1, 'G138094521', 'Benali', 'Yassine', 'yassine.benali@inpt.ac.ma', '+212 6 12 34 56 78', 'Ingénierie des Données et Logiciel (IDL)', '3ème année (PFE)', 'cv_benali.pdf'),
(2, 'G134088912', 'El Idrissi', 'Fatima', 'fatima.elidrissi@inpt.ac.ma', '+212 6 78 90 12 34', 'Cyber Sécurité et Confiance Numérique (CSCN)', '3ème année (PFE)', 'cv_elidrissi.pdf'),
(3, 'G131102948', 'Amrani', 'Mehdi', 'mehdi.amrani@inpt.ac.ma', '+212 6 55 44 33 22', 'Systèmes Embarqués et IoT (SEIoT)', '2ème année', 'cv_amrani.pdf'),
(4, 'G139981240', 'Chraibi', 'Salma', 'salma.chraibi@inpt.ac.ma', '+212 6 61 22 33 44', 'Cloud et Réseaux Télécoms (CRT)', '3ème année (PFE)', 'cv_chraibi.pdf')
ON DUPLICATE KEY UPDATE cne=cne;

-- Entreprises (Membre 2)
INSERT INTO entreprises (id, raison_sociale, secteur, ville, contact_nom, contact_email, telephone, conventionnee) VALUES
(1, 'TechSolutions Maroc', 'Développement Logiciel & Cloud', 'Casablanca, Technopark', 'M. Karim Tazi', 'recrutement@techsolutions.ma', '+212 5 22 10 20 30', TRUE),
(2, 'Fintech Horizons', 'Banque & Finance Numérique', 'Casablanca Finance City (CFC)', 'Mme. Nezha Berrada', 'rh@fintechhorizons.com', '+212 5 22 99 88 77', TRUE),
(3, 'CyberShield Africa', 'Cybersécurité & Audit SOC', 'Rabat, Madinat Al Irfane', 'M. Omar Filali', 'hr@cybershield.ma', '+212 5 37 77 66 55', FALSE)
ON DUPLICATE KEY UPDATE raison_sociale=raison_sociale;

-- Offres de stage (Membre 3)
INSERT INTO offres (id, entreprise_id, titre, lieu, type, duree, remuneration, competences, description, date_publication, active) VALUES
(1, 1, 'Stage PFE - Architectures Microservices & DevOps', 'Casablanca, Technopark', 'PFE (Projet de Fin d\'Études)', '6 mois', '5000 DH / mois', 'Java, Spring Boot, Docker, Kubernetes, CI/CD', 'Conception et déploiement d\'une architecture orientée services résiliente avec passerelle API.', '2026-10-15', TRUE),
(2, 3, 'Stage PFE - Audit de Sécurité & DevSecOps', 'Rabat', 'PFE (Projet de Fin d\'Études)', '6 mois', '4500 DH / mois', 'SIEM, OWASP, Python, SonarQube, Sécurité Cloud', 'Mise en place de pipelines DevSecOps et tests d\'intrusion automatisés sur infrastructures virtualisées.', '2026-10-20', TRUE),
(3, 2, 'Stage d\'Application - Développement Frontend Angular/React', 'Casablanca Finance City', 'Stage Technique (2ème année)', '3 mois', '3500 DH / mois', 'TypeScript, Angular ou React, REST APIs, TailwindCSS', 'Modernisation du portail client et intégration des dashboards bancaires temps réel.', '2026-11-01', TRUE)
ON DUPLICATE KEY UPDATE titre=titre;

-- Candidatures (Membre 3)
INSERT INTO candidatures (id, offre_id, etudiant_id, date_depot, statut, motivation, orchestrateur) VALUES
(1, 1, 1, '2026-11-02', 'acceptée', 'Passionné d\'architectures distribuées et des technologies Docker/K8s.', 'REST'),
(2, 2, 2, '2026-11-04', 'en cours d\'évaluation', 'Expérience préalable en pentest web et projet académique SOC.', 'BPMN'),
(3, 3, 3, '2026-11-05', 'déposée', 'Très motivé pour contribuer à vos interfaces web fintech.', 'BPMN')
ON DUPLICATE KEY UPDATE statut=statut;

-- Stages conventionnés (Membre 2)
INSERT INTO stages (id, etudiant_id, entreprise_id, intitule, date_debut, date_fin, tuteur_entreprise, tuteur_academique, etat) VALUES
(1, 1, 1, 'Plateforme Microservices & CI/CD', '2026-02-01', '2026-06-30', 'Karim Tazi', 'Pr. Alami', 'EN_COURS'),
(2, 2, 2, 'Sécurisation de passerelles de paiement bancaire', '2026-02-15', '2026-07-15', 'Nezha Berrada', 'Pr. Bennani', 'EN_COURS')
ON DUPLICATE KEY UPDATE etat=etat;

-- Notifications (Membre 1)
INSERT INTO notifications (id, destinataire_id, destinataire_type, titre, message, date_envoi, statut, service_emetteur) VALUES
(1, 1, 'ETUDIANT', 'Candidature acceptée', 'Félicitations ! Votre candidature pour le stage chez TechSolutions Maroc a été acceptée.', '2026-11-05 14:32:00', 'LUE', 'service4-candidatures-rest'),
(2, 1, 'ETUDIANT', 'Dépôt compte rendu mi-parcours', 'Rappel : la date limite pour déposer votre compte rendu de stage n°1 est le 20 novembre 2026.', '2026-11-06 09:15:00', 'NON_LUE', 'service6-suivi-stages-rest')
ON DUPLICATE KEY UPDATE statut=statut;
