/**
 * frontend/shared/config.js
 * Fourni par Membre 4 (Responsable Squelette Commun & BPMN)
 *
 * Centralise les adresses de tous les services SOA pour faciliter l'intégration
 * et éviter de casser les écrans lors d'un changement de port ou d'hôte.
 *
 * Comprend également l'interrupteur 'useMock' pour tester avec les données JSON
 * simulées sans attendre que les web services backend soient déployés.
 */

const STORAGE_KEY_MOCK = 'soa_use_mock';
const STORAGE_KEY_ROLE = 'soa_active_role';

export const CONFIG = {
  // Mode mock activé par défaut pour permettre un démarrage immédiat
  useMock: localStorage.getItem(STORAGE_KEY_MOCK) !== null
    ? localStorage.getItem(STORAGE_KEY_MOCK) === 'true'
    : true,

  // Rôle actif pour le filtrage des menus ('all', 'etudiant', 'entreprise', 'responsable')
  activeRole: localStorage.getItem(STORAGE_KEY_ROLE) || 'all',

  // Hôte Tomcat par défaut (si déployé dans le même Tomcat ou externe)
  tomcatBaseUrl: 'http://localhost:8080',

  // Configuration de chaque service du projet
  services: {
    // Membre 1 : Service 1 (SOAP JAX-WS) & Service 5 (REST Jersey)
    etudiants: {
      name: 'Service 1 : Étudiants',
      type: 'SOAP',
      member: 'Membre 1',
      endpoint: 'http://localhost:8080/service1-etudiants-soap/EtudiantService',
      namespace: 'http://service1.soa.inpt.ma/',
      mockFile: 'pages/etudiants/mock-etudiants.json'
    },
    notifications: {
      name: 'Service 5 : Notifications',
      type: 'REST',
      member: 'Membre 1',
      endpoint: 'http://localhost:8080/service5-notifications-rest/api/notifications',
      mockFile: 'pages/notifications/mock-notifications.json'
    },

    // Membre 2 : Service 2 (SOAP JAX-WS) & Service 6 (REST Jersey)
    entreprises: {
      name: 'Service 2 : Entreprises',
      type: 'SOAP',
      member: 'Membre 2',
      endpoint: 'http://localhost:8080/service2-entreprises-soap/services/entreprise',
      namespace: 'http://soap.soa.inpt.ma/',
      mockFile: 'pages/entreprises/mock-entreprises.json'
    },
    stages: {
      name: 'Service 6 : Suivi des Stages',
      type: 'REST',
      member: 'Membre 2',
      endpoint: 'http://localhost:8080/service6-suivi-stages-rest/api/stages',
      mockFile: 'pages/stages/mock-stages.json'
    },

    // Membre 3 : Service 3 (SOAP JAX-WS) & Service 4 (REST Jersey)
    offres: {
      name: 'Service 3 : Offres',
      type: 'SOAP',
      member: 'Membre 3',
      endpoint: 'http://localhost:8080/service3-offres-soap/OffreService',
      namespace: 'http://service3.soa.inpt.ma/',
      mockFile: 'pages/offres/mock-offres.json'
    },
    candidatures: {
      name: 'Service 4 : Candidatures',
      type: 'REST',
      member: 'Membre 3',
      endpoint: 'http://localhost:8080/service4-candidatures-rest/api/candidatures',
      mockFile: 'pages/candidatures/mock-candidatures.json'
    },

    // Membre 4 : Bonita BPMN
    bpmn: {
      name: 'Orchestrateur : Processus BPMN (Bonita)',
      type: 'REST',
      member: 'Membre 4',
      endpoint: 'http://localhost:8080/bonita/API/bpm',
      mockFile: 'pages/bpmn/mock-bpmn.json'
    }
  },

  /**
   * Bascule le mode mock (données simulées <-> vrais services)
   */
  setMockMode(enable) {
    this.useMock = Boolean(enable);
    localStorage.setItem(STORAGE_KEY_MOCK, String(this.useMock));
  },

  /**
   * Change le filtre de rôle de l'interface
   */
  setActiveRole(role) {
    this.activeRole = role;
    localStorage.setItem(STORAGE_KEY_ROLE, role);
  }
};

