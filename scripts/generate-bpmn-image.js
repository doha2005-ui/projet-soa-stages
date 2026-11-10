const fs = require('fs');

// Génération d'une image SVG ultra-nette et professionnelle conforme BPMN 2.0
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 520" width="1100" height="520" style="background:#ffffff; font-family: 'Segoe UI', Arial, sans-serif;">
  <defs>
    <!-- Flèche directionnelle -->
    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
    </marker>
    <!-- Dégradés -->
    <linearGradient id="taskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="gatewayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Titre / Légende du diagramme -->
  <rect x="20" y="15" width="1060" height="490" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="45" y="45" font-size="16" font-weight="700" fill="#1e293b">Détail des Passerelles de Décision (Sous-Processus de Validation des Candidatures)</text>
  <text x="45" y="65" font-size="12" fill="#64748b">Étape 5 : Contrôle Éligibilité • Étape 7 : Décision d'Acceptation Entreprise &amp; École</text>

  <!-- ================= LIAISONS / CONNECTEURS ================= -->
  <!-- Début -> Sous-Processus -->
  <line x1="100" y1="210" x2="150" y2="210" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Tâche Check S1 -> Tâche Check S2 -->
  <line x1="280" y1="210" x2="310" y2="210" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Tâche Check S2 -> Passerelle 1 -->
  <line x1="440" y1="210" x2="480" y2="210" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Passerelle 1 [OUI] -> Tâche Décision Entreprise -->
  <line x1="530" y1="210" x2="600" y2="210" stroke="#059669" stroke-width="2" marker-end="url(#arrow)" />
  <text x="545" y="200" font-size="11" font-weight="700" fill="#059669">Oui (Conforme)</text>

  <!-- Passerelle 1 [NON] -> Refus Éligibilité -->
  <line x1="505" y1="235" x2="505" y2="380" stroke="#dc2626" stroke-width="2" />
  <line x1="505" y1="380" x2="550" y2="380" stroke="#dc2626" stroke-width="2" marker-end="url(#arrow)" />
  <text x="515" y="270" font-size="11" font-weight="700" fill="#dc2626">Non (Échec)</text>

  <!-- Décision Entreprise -> Passerelle 2 -->
  <line x1="730" y1="210" x2="770" y2="210" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Passerelle 2 [ACCEPTÉE] -> Validation Sujet & Convention -->
  <line x1="820" y1="210" x2="880" y2="210" stroke="#059669" stroke-width="2" marker-end="url(#arrow)" />
  <text x="825" y="200" font-size="11" font-weight="700" fill="#059669">Acceptée</text>

  <!-- Passerelle 2 [REFUSÉE] -> Notification Refus Entreprise -->
  <line x1="795" y1="235" x2="795" y2="380" stroke="#dc2626" stroke-width="2" />
  <line x1="795" y1="380" x2="830" y2="380" stroke="#dc2626" stroke-width="2" marker-end="url(#arrow)" />
  <text x="805" y="270" font-size="11" font-weight="700" fill="#dc2626">Refusée</text>

  <!-- Fin Succès -->
  <line x1="1010" y1="210" x2="1040" y2="210" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Fin Refus 1 -->
  <line x1="680" y1="380" x2="710" y2="380" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />
  <!-- Fin Refus 2 -->
  <line x1="960" y1="380" x2="990" y2="380" stroke="#334155" stroke-width="2" marker-end="url(#arrow)" />

  <!-- ================= FORMES BPMN ================= -->

  <!-- Événement de Début -->
  <circle cx="80" cy="210" r="18" fill="#dcfce7" stroke="#16a34a" stroke-width="2" filter="url(#shadow)" />
  <polygon points="74,202 74,218 89,210" fill="#16a34a" />
  <text x="80" y="245" font-size="11" text-anchor="middle" font-weight="600" fill="#334155">Candidature<tspan x="80" dy="14">Déposée</tspan></text>

  <!-- Boîte Sous-Processus : Tâche 1 (SOAP Étudiant) -->
  <rect x="150" y="165" width="130" height="90" rx="8" fill="url(#taskGrad)" stroke="#3b82f6" stroke-width="1.8" filter="url(#shadow)" />
  <text x="160" y="185" font-size="10" font-weight="700" fill="#2563eb">SERVICE 1 (SOAP)</text>
  <text x="160" y="205" font-size="11" font-weight="600" fill="#1e293b">Vérification CNE</text>
  <text x="160" y="220" font-size="11" font-weight="600" fill="#1e293b">&amp; Éligibilité</text>
  <text x="160" y="242" font-size="9" fill="#64748b">verifierStatut()</text>

  <!-- Boîte Sous-Processus : Tâche 2 (SOAP Entreprise) -->
  <rect x="310" y="165" width="130" height="90" rx="8" fill="url(#taskGrad)" stroke="#3b82f6" stroke-width="1.8" filter="url(#shadow)" />
  <text x="320" y="185" font-size="10" font-weight="700" fill="#2563eb">SERVICE 2 (SOAP)</text>
  <text x="320" y="205" font-size="11" font-weight="600" fill="#1e293b">Vérification</text>
  <text x="320" y="220" font-size="11" font-weight="600" fill="#1e293b">Convention</text>
  <text x="320" y="242" font-size="9" fill="#64748b">verifierEntreprise()</text>

  <!-- PASSERELLE 1 (Étape 5 : Conditions Satisfaites ?) -->
  <g transform="translate(480, 185)" filter="url(#shadow)">
    <polygon points="25,0 50,25 25,50 0,25" fill="url(#gatewayGrad)" stroke="#ca8a04" stroke-width="2" />
    <text x="25" y="32" font-size="22" font-weight="bold" text-anchor="middle" fill="#854d0e">✕</text>
  </g>
  <text x="505" y="150" font-size="11" font-weight="700" text-anchor="middle" fill="#854d0e">PASSERELLE 1</text>
  <text x="505" y="165" font-size="10" text-anchor="middle" fill="#475569">Conditions Validées ?</text>

  <!-- Tâche Refus Éligibilité -->
  <rect x="550" y="345" width="130" height="70" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" filter="url(#shadow)" />
  <text x="560" y="365" font-size="10" font-weight="700" fill="#dc2626">SERVICE 5 (REST)</text>
  <text x="560" y="383" font-size="11" font-weight="600" fill="#991b1b">Notifier Rejet</text>
  <text x="560" y="400" font-size="9" fill="#b91c1c">Motif : non éligible</text>

  <!-- Fin Rejet 1 -->
  <circle cx="725" cy="380" r="15" fill="#fee2e2" stroke="#dc2626" stroke-width="3" filter="url(#shadow)" />
  <text x="725" y="410" font-size="10" font-weight="600" text-anchor="middle" fill="#dc2626">Candidature Rejetée</text>

  <!-- Tâche Humaine Entreprise (Étape 6) -->
  <rect x="600" y="165" width="130" height="90" rx="8" fill="url(#taskGrad)" stroke="#10b981" stroke-width="1.8" filter="url(#shadow)" />
  <text x="610" y="185" font-size="10" font-weight="700" fill="#059669">TÂCHE HUMAINE</text>
  <text x="610" y="205" font-size="11" font-weight="600" fill="#1e293b">Entretien &amp;</text>
  <text x="610" y="220" font-size="11" font-weight="600" fill="#1e293b">Décision RH</text>
  <text x="610" y="242" font-size="9" fill="#64748b">Tuteur Entreprise</text>

  <!-- PASSERELLE 2 (Étape 7 : Décision Entreprise) -->
  <g transform="translate(770, 185)" filter="url(#shadow)">
    <polygon points="25,0 50,25 25,50 0,25" fill="url(#gatewayGrad)" stroke="#ca8a04" stroke-width="2" />
    <text x="25" y="32" font-size="22" font-weight="bold" text-anchor="middle" fill="#854d0e">✕</text>
  </g>
  <text x="795" y="150" font-size="11" font-weight="700" text-anchor="middle" fill="#854d0e">PASSERELLE 2</text>
  <text x="795" y="165" font-size="10" text-anchor="middle" fill="#475569">Décision Entreprise ?</text>

  <!-- Tâche Refus Entreprise -->
  <rect x="830" y="345" width="130" height="70" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" filter="url(#shadow)" />
  <text x="840" y="365" font-size="10" font-weight="700" fill="#dc2626">SERVICE 5 (REST)</text>
  <text x="840" y="383" font-size="11" font-weight="600" fill="#991b1b">Notifier Refus</text>
  <text x="840" y="400" font-size="9" fill="#b91c1c">Candidat non retenu</text>

  <!-- Fin Rejet 2 -->
  <circle cx="1005" cy="380" r="15" fill="#fee2e2" stroke="#dc2626" stroke-width="3" filter="url(#shadow)" />
  <text x="1005" y="410" font-size="10" font-weight="600" text-anchor="middle" fill="#dc2626">Refus Entreprise</text>

  <!-- Tâche Création Convention & Stage -->
  <rect x="880" y="165" width="130" height="90" rx="8" fill="url(#taskGrad)" stroke="#8b5cf6" stroke-width="1.8" filter="url(#shadow)" />
  <text x="890" y="185" font-size="10" font-weight="700" fill="#7c3aed">SERVICE 6 (REST)</text>
  <text x="890" y="205" font-size="11" font-weight="600" fill="#1e293b">Édition Convention</text>
  <text x="890" y="220" font-size="11" font-weight="600" fill="#1e293b">&amp; Création Stage</text>
  <text x="890" y="242" font-size="9" fill="#64748b">POST /api/stages</text>

  <!-- Fin Succès -->
  <circle cx="1055" cy="210" r="16" fill="#dcfce7" stroke="#16a34a" stroke-width="4" filter="url(#shadow)" />
  <text x="1055" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="#16a34a">Stage<tspan x="1055" dy="14">Activé</tspan></text>

</svg>
`;

fs.writeFileSync('docs/images/bpmn-passerelle.svg', svg.trim());
console.log('Fichier SVG docs/images/bpmn-passerelle.svg généré avec succès !');

