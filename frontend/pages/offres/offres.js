/**
 * frontend/pages/offres/offres.js
 * Membre 3 : Service 3 Offres (SOAP JAX-WS)
 * Pages : offres (catalogue, publication, modification, reservation de places)
 * Design : Professionnel, epure, sans emojis, conforme aux standards institutionnels
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall, getXmlNodeText } from '../../shared/soap.js';
import { showToast } from '../../shared/api.js';

let offresCache = [];

// Icones SVG vectorielles epurees (Style Feather / Lucide)
const ICONS = {
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  building: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line></svg>`,
  mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  dollar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  award: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
  cpu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`
};

export async function render(container) {
  const currentRole = CONFIG.activeRole;
  const isEtudiant = currentRole === 'etudiant';
  const isEntreprise = currentRole === 'entreprise';
  const isResponsable = currentRole === 'responsable';
  const isAll = currentRole === 'all';

  const canPublishOffre = isAll || isEntreprise;

  let roleTitle = "Offres de Stages";
  let roleSubtitle = "Catalogue des stages PFE et d'application proposés par nos entreprises partenaires";
  let roleBannerHtml = "";

  if (isEtudiant) {
    roleTitle = "Catalogue des Stages";
    roleSubtitle = "Consultez les offres disponibles des entreprises partenaires et postulez en ligne";
    roleBannerHtml = `
      <div class="role-context-banner student-banner">
        <span><strong>Espace Candidat :</strong> Parcourez les offres de stage, vérifiez les prérequis et soumettez votre dossier directement.</span>
      </div>`;
  } else if (isEntreprise) {
    roleTitle = "Gestion des Offres de Stage";
    roleSubtitle = "Publication et suivi des offres de stage via le Service Web SOAP JAX-WS";
    roleBannerHtml = `
      <div class="role-context-banner company-banner">
        <span><strong>Espace Recruteur Entreprise :</strong> Déposez vos offres de stage, définissez les quotas de places et ajustez la disponibilité.</span>
      </div>`;
  } else if (isResponsable) {
    roleTitle = "Supervision Pédagogique des Offres";
    roleSubtitle = "Validation académique des sujets de stages et contrôle de la conformité des offres";
    roleBannerHtml = `
      <div class="role-context-banner admin-banner">
        <span><strong>Espace Responsable Stages :</strong> Vérification de l'adéquation des offres avec les filières et suivi des quotas.</span>
      </div>`;
  } else {
    roleBannerHtml = `
      <div class="role-context-banner dev-banner">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; width: 100%;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="member-chip">Membre 3</span>
            <span class="badge-type badge-soap">SOAP JAX-WS</span>
            <span class="text-muted" style="font-size: 0.8rem;">Endpoint : <code>${CONFIG.services.offres.endpoint}</code></span>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-ping-soap" title="Tester la connectivité du service JAX-WS">Ping Service SOAP</button>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <style>
      .role-context-banner {
        border-radius: var(--radius-md);
        padding: 0.75rem 1rem;
        margin-bottom: 1.25rem;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .student-banner { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
      .company-banner { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
      .admin-banner { background: #fdf4ff; color: #86198f; border: 1px solid #f5d0fe; }
      .dev-banner { background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; }

      .stats-strip {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-box {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 0.85rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        box-shadow: var(--shadow-sm);
      }
      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stat-icon.blue { background: #eff6ff; color: #1d4ed8; }
      .stat-icon.purple { background: #f5f3ff; color: #6d28d9; }
      .stat-icon.green { background: #ecfdf5; color: #047857; }
      .stat-icon.amber { background: #fffbeb; color: #b45309; }
      .stat-val { font-size: 1.4rem; font-weight: 700; color: var(--text-main); line-height: 1.1; }
      .stat-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

      .filter-toolbar {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 0.85rem 1rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        box-shadow: var(--shadow-sm);
      }
      .search-box {
        position: relative;
        flex: 1;
        min-width: 260px;
      }
      .search-box input {
        width: 100%;
        padding-left: 2.2rem;
      }
      .search-box-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-light);
        display: flex;
        align-items: center;
        pointer-events: none;
      }

      .offre-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        position: relative;
        overflow: hidden;
      }
      .offre-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.07);
        border-color: #cbd5e1;
      }
      .offre-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--primary);
      }
      .offre-card.technique::before {
        background: #0d9488;
      }
      .offre-card.initiation::before {
        background: #d97706;
      }

      .badge-avail {
        font-size: 0.72rem;
        font-weight: 600;
        padding: 3px 9px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .badge-avail.open {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
      }
      .badge-avail.closed {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .avail-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
      }
      .badge-avail.open .avail-dot { background: #059669; }
      .badge-avail.closed .avail-dot { background: #dc2626; }

      .skill-pill {
        display: inline-block;
        background: #f1f5f9;
        color: #334155;
        border: 1px solid #e2e8f0;
        font-size: 0.72rem;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 4px;
        margin-right: 4px;
        margin-bottom: 4px;
      }

      .specs-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        background: var(--surface-alt);
        border-radius: var(--radius-sm);
        padding: 0.65rem 0.75rem;
        margin: 0.85rem 0;
        font-size: 0.78rem;
      }
      .spec-item {
        display: flex;
        flex-direction: column;
      }
      .spec-item-label {
        font-size: 0.68rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 2px;
      }
      .spec-item-val {
        font-weight: 600;
        color: var(--text-main);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>

    <div class="page-header">
      <div>
        <h2 class="page-title">${roleTitle}</h2>
        <p class="page-subtitle">${roleSubtitle}</p>
      </div>
      <div>
        ${canPublishOffre ? `<button class="btn btn-primary" id="btn-nouvelle-offre">+ Déposer une Offre (SOAP)</button>` : ''}
      </div>
    </div>

    ${roleBannerHtml}

    <!-- Barre d'indicateurs KPI epuree -->
    <div class="stats-strip">
      <div class="stat-box">
        <div class="stat-icon blue">${ICONS.briefcase}</div>
        <div>
          <div class="stat-val" id="stat-total-offres">--</div>
          <div class="stat-desc">Offres publiées</div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon purple">${ICONS.award}</div>
        <div>
          <div class="stat-val" id="stat-pfe-offres">--</div>
          <div class="stat-desc">Sujets PFE 3ème année</div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon green">${ICONS.users}</div>
        <div>
          <div class="stat-val" id="stat-places-dispo">--</div>
          <div class="stat-desc">Places disponibles</div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon amber">${ICONS.cpu}</div>
        <div>
          <div class="stat-val" id="stat-tech-offres">--</div>
          <div class="stat-desc">Stages Techniques / Init.</div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et filtres de catalogue -->
    <div class="filter-toolbar">
      <div class="search-box">
        <span class="search-box-icon">${ICONS.search}</span>
        <input type="text" id="offre-search" class="form-input" placeholder="Rechercher par intitulé, compétence, mot-clé, ville ou entreprise...">
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <select id="offre-type-filter" class="form-select" style="min-width: 170px;">
          <option value="ALL">Tous les types de stage</option>
          <option value="PFE">PFE (3ème année)</option>
          <option value="Technique">Stage Technique (2ème année)</option>
          <option value="Initiation">Stage d'Initiation (1ère année)</option>
        </select>
        <select id="offre-dispo-filter" class="form-select" style="min-width: 170px;">
          <option value="ALL">Toutes les disponibilités</option>
          <option value="DISPO">Places disponibles uniquement</option>
        </select>
      </div>
      <span class="text-muted" style="font-size: 0.85rem; font-weight: 500;" id="offres-count"></span>
    </div>

    <!-- Grille des cartes d'offres -->
    <div class="grid grid-2" id="offres-list">
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">
        Chargement des offres via SOAP JAX-WS...
      </div>
    </div>

    <!-- Modal Déposer / Éditer Offre (SOAP) -->
    <div id="offre-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content" style="max-width: 620px;">
        <div class="modal-header">
          <h3 class="modal-title" id="offre-modal-title">Déposer une Offre de Stage</h3>
          <button class="close-btn" id="offre-close-btn">&times;</button>
        </div>
        <form id="offre-form">
          <input type="hidden" id="form-offre-id">
          
          <div class="form-group">
            <label class="form-label">Intitulé du Sujet / Titre de la Mission *</label>
            <input type="text" id="form-offre-titre" class="form-input" required placeholder="Ex: Stage PFE - Architectures Microservices & Cloud">
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Raison Sociale / Entreprise *</label>
              <input type="text" id="form-offre-ent" class="form-input" required placeholder="Ex: TechSolutions Maroc">
            </div>
            <div class="form-group">
              <label class="form-label">Type de Stage *</label>
              <select id="form-offre-type" class="form-select" required>
                <option value="PFE (Projet de Fin d'Études)">PFE (Projet de Fin d'Études)</option>
                <option value="Stage Technique (2ème année)">Stage Technique (2ème année)</option>
                <option value="Stage d'Initiation">Stage d'Initiation</option>
              </select>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Lieu & Modalités *</label>
              <input type="text" id="form-offre-lieu" class="form-input" required placeholder="Ex: Casablanca, Technopark (Hybride)">
            </div>
            <div class="form-group">
              <label class="form-label">Durée du Stage</label>
              <input type="text" id="form-offre-duree" class="form-input" placeholder="Ex: 6 mois, 3 mois...">
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Gratification / Rémunération</label>
              <input type="text" id="form-offre-remun" class="form-input" placeholder="Ex: 5000 DH / mois">
            </div>
            <div class="form-group">
              <label class="form-label">Places Disponibles (Quota)</label>
              <input type="number" id="form-offre-places" class="form-input" min="1" max="50" value="1" required>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Date Limite de Dépôt</label>
              <input type="date" id="form-offre-date-limite" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Compétences Clés (séparées par virgules)</label>
              <input type="text" id="form-offre-skills" class="form-input" placeholder="Ex: Java, Spring Boot, Docker, React">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descriptif Détaillé de la Mission *</label>
            <textarea id="form-offre-desc" class="form-textarea" rows="4" required placeholder="Contexte du projet, livrables attendus, profil recherché..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" class="btn btn-outline" id="offre-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary" id="offre-submit-btn">Enregistrer l'Offre (SOAP)</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await chargerOffres();

  // Événements
  const btnNouvelle = document.getElementById('btn-nouvelle-offre');
  if (btnNouvelle) {
    btnNouvelle.addEventListener('click', () => ouvrirModal());
  }

  const btnPingSoap = document.getElementById('btn-ping-soap');
  if (btnPingSoap) {
    btnPingSoap.addEventListener('click', testerPingSoap);
  }

  document.getElementById('offre-close-btn').addEventListener('click', fermerModal);
  document.getElementById('offre-cancel-btn').addEventListener('click', fermerModal);

  document.getElementById('offre-search').addEventListener('input', appliquerFiltres);
  document.getElementById('offre-type-filter').addEventListener('change', appliquerFiltres);
  document.getElementById('offre-dispo-filter').addEventListener('change', appliquerFiltres);

  document.getElementById('offre-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await sauvegarderOffre();
  });
}

async function chargerOffres() {
  try {
    const serviceInfo = CONFIG.services.offres;
    const result = await soapCall({
      url: serviceInfo.endpoint,
      operation: 'listerOffres',
      namespace: serviceInfo.namespace,
      mockFallback: serviceInfo.mockFile
    });

    if (Array.isArray(result)) {
      offresCache = result.map(o => normaliserOffre(o));
    } else if (result?.xmlDoc) {
      const nodes = result.xmlDoc.querySelectorAll('return, offre');
      offresCache = Array.from(nodes).map(node => ({
        id: parseInt(getXmlNodeText(node, 'id', '0'), 10),
        entrepriseId: parseInt(getXmlNodeText(node, 'entrepriseId', '1'), 10),
        titre: getXmlNodeText(node, 'titre', 'Offre de stage'),
        entrepriseNom: getXmlNodeText(node, 'entrepriseNom', 'Entreprise Partenaire'),
        lieu: getXmlNodeText(node, 'lieu', 'Non spécifié'),
        type: getXmlNodeText(node, 'type', "PFE (Projet de Fin d'Études)"),
        duree: getXmlNodeText(node, 'duree', '6 mois'),
        remuneration: getXmlNodeText(node, 'remuneration', 'Gratification de stage'),
        competences: getXmlNodeText(node, 'competences', ''),
        description: getXmlNodeText(node, 'description', ''),
        datePublication: getXmlNodeText(node, 'datePublication', ''),
        dateLimite: getXmlNodeText(node, 'dateLimite', '2026-12-31'),
        placesDisponibles: parseInt(getXmlNodeText(node, 'placesDisponibles', '1'), 10),
        active: getXmlNodeText(node, 'active') !== 'false'
      }));
    }

    mettreAJourKPIs();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur chargement offres: ${err.message}`, 'error');
  }
}

function normaliserOffre(o) {
  return {
    id: o.id || Date.now(),
    entrepriseId: o.entrepriseId || 1,
    titre: o.titre || "Stage sans titre",
    entrepriseNom: o.entrepriseNom || "Entreprise Partenaire",
    lieu: o.lieu || "Casablanca",
    type: o.type || "PFE (Projet de Fin d'Études)",
    duree: o.duree || "6 mois",
    remuneration: o.remuneration || "Indemnité conventionnée",
    competences: o.competences || "",
    description: o.description || "",
    datePublication: o.datePublication || new Date().toISOString().split('T')[0],
    dateLimite: o.dateLimite || "2026-12-31",
    placesDisponibles: (o.placesDisponibles !== undefined) ? parseInt(o.placesDisponibles, 10) : 1,
    active: o.active !== false
  };
}

function mettreAJourKPIs() {
  const elTotal = document.getElementById('stat-total-offres');
  const elPfe = document.getElementById('stat-pfe-offres');
  const elPlaces = document.getElementById('stat-places-dispo');
  const elTech = document.getElementById('stat-tech-offres');

  if (!elTotal) return;

  const total = offresCache.length;
  const pfe = offresCache.filter(o => (o.type || '').includes('PFE')).length;
  const tech = total - pfe;
  const places = offresCache.reduce((acc, o) => acc + (o.placesDisponibles || 0), 0);

  elTotal.textContent = total;
  elPfe.textContent = pfe;
  elTech.textContent = tech;
  elPlaces.textContent = places;
}

function appliquerFiltres() {
  const searchInput = document.getElementById('offre-search');
  const typeFilter = document.getElementById('offre-type-filter');
  const dispoFilter = document.getElementById('offre-dispo-filter');

  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedType = typeFilter ? typeFilter.value : 'ALL';
  const selectedDispo = dispoFilter ? dispoFilter.value : 'ALL';

  const resultats = offresCache.filter(offre => {
    const textCorpus = `${offre.titre} ${offre.entrepriseNom} ${offre.lieu} ${offre.competences || ''} ${offre.description || ''}`.toLowerCase();
    const matchText = !q || textCorpus.includes(q);

    let matchType = true;
    if (selectedType === 'PFE') {
      matchType = (offre.type || '').includes('PFE');
    } else if (selectedType === 'Technique') {
      matchType = (offre.type || '').includes('Technique');
    } else if (selectedType === 'Initiation') {
      matchType = (offre.type || '').includes('Initiation');
    }

    let matchDispo = true;
    if (selectedDispo === 'DISPO') {
      matchDispo = (offre.placesDisponibles > 0) && offre.active;
    }

    return matchText && matchType && matchDispo;
  });

  afficherOffres(resultats);
}

function afficherOffres(liste) {
  const container = document.getElementById('offres-list');
  const countEl = document.getElementById('offres-count');
  if (!container) return;

  if (countEl) {
    countEl.textContent = `${liste.length} offre(s) trouvée(s)`;
  }

  if (liste.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem; background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius-md);">
        <p style="font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Aucune offre ne correspond à vos critères</p>
        <p style="font-size: 0.85rem;">Modifiez vos termes de recherche ou réinitialisez les filtres.</p>
      </div>`;
    return;
  }

  const currentRole = CONFIG.activeRole;
  const isEtudiant = currentRole === 'etudiant';
  const isEntreprise = currentRole === 'entreprise';
  const isAll = currentRole === 'all';

  container.innerHTML = liste.map(offre => {
    let cardClass = "offre-card";
    if ((offre.type || '').includes('Technique')) cardClass += " technique";
    if ((offre.type || '').includes('Initiation')) cardClass += " initiation";

    const skillsList = (offre.competences || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const skillsHtml = skillsList.length > 0
      ? skillsList.map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join('')
      : `<span style="font-size: 0.75rem; color: var(--text-muted);">Non spécifié</span>`;

    const isAvailable = (offre.placesDisponibles > 0) && offre.active;
    const availBadge = isAvailable
      ? `<span class="badge-avail open"><span class="avail-dot"></span>${offre.placesDisponibles} place(s)</span>`
      : `<span class="badge-avail closed"><span class="avail-dot"></span>Clôturée</span>`;

    let actionsHtml = "";
    if (isEtudiant) {
      if (isAvailable) {
        actionsHtml = `
          <a href="#candidatures" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;" onclick="window.postulerAOffre(${offre.id}, '${escapeHtml(offre.titre)}', '${escapeHtml(offre.entrepriseNom)}')">
            Postuler à cette offre &rarr;
          </a>`;
      } else {
        actionsHtml = `<button class="btn btn-outline btn-sm" disabled style="width: 100%; opacity: 0.6;">Places épuisées</button>`;
      }
    } else if (isEntreprise) {
      actionsHtml = `
        <div style="display: flex; gap: 0.5rem; width: 100%; justify-content: flex-end;">
          <button class="btn btn-outline btn-sm" onclick="window.editerOffre(${offre.id})">Modifier</button>
          <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fecaca;" onclick="window.supprimerOffre(${offre.id})">Clôturer</button>
        </div>`;
    } else if (isAll) {
      actionsHtml = `
        <div style="display: flex; gap: 0.5rem; width: 100%; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline btn-sm" onclick="window.editerOffre(${offre.id})">Modifier</button>
          <a href="#candidatures" class="btn btn-primary btn-sm" onclick="window.postulerAOffre(${offre.id}, '${escapeHtml(offre.titre)}', '${escapeHtml(offre.entrepriseNom)}')">
            Postuler &rarr;
          </a>
        </div>`;
    } else {
      actionsHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">Consultation académique</span>
          <button class="btn btn-outline btn-sm" onclick="window.verifierCompatibiliteModal(${offre.id})">Vérifier Règle JAX-WS</button>
        </div>`;
    }

    return `
      <div class="${cardClass}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.6rem;">
            <div>
              <span class="member-chip" style="font-size: 0.7rem; font-weight: 600;">${escapeHtml(offre.type)}</span>
            </div>
            ${availBadge}
          </div>

          <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem; line-height: 1.35;">
            ${escapeHtml(offre.titre)}
          </h3>

          <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span>${escapeHtml(offre.entrepriseNom)}</span>
            <span style="color: var(--text-light);">&bull;</span>
            <span style="color: var(--text-muted); font-weight: 400;">${escapeHtml(offre.lieu)}</span>
          </div>

          <p style="font-size: 0.83rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml(offre.description || 'Aucune description spécifiée.')}
          </p>

          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-item-label">${ICONS.clock} Durée</span>
              <span class="spec-item-val">${escapeHtml(offre.duree || '6 mois')}</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">${ICONS.dollar} Rémunération</span>
              <span class="spec-item-val">${escapeHtml(offre.remuneration || 'Selon profil')}</span>
            </div>
            <div class="spec-item">
              <span class="spec-item-label">${ICONS.calendar} Date Limite</span>
              <span class="spec-item-val">${escapeHtml(offre.dateLimite || '31/12/2026')}</span>
            </div>
          </div>

          <div style="margin-top: 0.65rem;">
            <div style="font-size: 0.68rem; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.35rem;">Compétences requises</div>
            <div style="display: flex; flex-wrap: wrap;">
              ${skillsHtml}
            </div>
          </div>
        </div>

        <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border);">
          ${actionsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ouvrirModal(offre = null) {
  const modal = document.getElementById('offre-modal');
  const title = document.getElementById('offre-modal-title');
  const submitBtn = document.getElementById('offre-submit-btn');

  if (offre) {
    title.textContent = `Modifier l'Offre : #${offre.id}`;
    submitBtn.textContent = "Mettre à jour (SOAP)";
    document.getElementById('form-offre-id').value = offre.id;
    document.getElementById('form-offre-titre').value = offre.titre || '';
    document.getElementById('form-offre-ent').value = offre.entrepriseNom || '';
    document.getElementById('form-offre-type').value = offre.type || "PFE (Projet de Fin d'Études)";
    document.getElementById('form-offre-lieu').value = offre.lieu || '';
    document.getElementById('form-offre-duree').value = offre.duree || '6 mois';
    document.getElementById('form-offre-remun').value = offre.remuneration || '';
    document.getElementById('form-offre-places').value = offre.placesDisponibles || 1;
    document.getElementById('form-offre-date-limite').value = offre.dateLimite || '2026-12-31';
    document.getElementById('form-offre-skills').value = offre.competences || '';
    document.getElementById('form-offre-desc').value = offre.description || '';
  } else {
    title.textContent = "Déposer une Nouvelle Offre de Stage (SOAP)";
    submitBtn.textContent = "Publier l'Offre (SOAP)";
    document.getElementById('offre-form').reset();
    document.getElementById('form-offre-id').value = '';
    document.getElementById('form-offre-places').value = '2';
    document.getElementById('form-offre-duree').value = '6 mois';
    document.getElementById('form-offre-date-limite').value = '2026-12-31';
  }

  modal.style.display = 'flex';
}

function fermerModal() {
  document.getElementById('offre-modal').style.display = 'none';
}

async function sauvegarderOffre() {
  const id = document.getElementById('form-offre-id').value;
  const offreData = {
    id: id ? parseInt(id, 10) : (200 + offresCache.length + 1),
    titre: document.getElementById('form-offre-titre').value.trim(),
    entrepriseNom: document.getElementById('form-offre-ent').value.trim(),
    type: document.getElementById('form-offre-type').value,
    lieu: document.getElementById('form-offre-lieu').value.trim(),
    duree: document.getElementById('form-offre-duree').value.trim() || '6 mois',
    remuneration: document.getElementById('form-offre-remun').value.trim() || 'Gratification de stage',
    placesDisponibles: parseInt(document.getElementById('form-offre-places').value, 10) || 1,
    dateLimite: document.getElementById('form-offre-date-limite').value || '2026-12-31',
    competences: document.getElementById('form-offre-skills').value.trim(),
    description: document.getElementById('form-offre-desc').value.trim(),
    datePublication: new Date().toISOString().split('T')[0],
    active: true
  };

  try {
    const serviceInfo = CONFIG.services.offres;
    const bodyXml = `
      <offre>
        ${id ? `<id>${id}</id>` : ''}
        <titre>${escapeXmlText(offreData.titre)}</titre>
        <entrepriseNom>${escapeXmlText(offreData.entrepriseNom)}</entrepriseNom>
        <type>${escapeXmlText(offreData.type)}</type>
        <lieu>${escapeXmlText(offreData.lieu)}</lieu>
        <duree>${escapeXmlText(offreData.duree)}</duree>
        <remuneration>${escapeXmlText(offreData.remuneration)}</remuneration>
        <placesDisponibles>${offreData.placesDisponibles}</placesDisponibles>
        <dateLimite>${escapeXmlText(offreData.dateLimite)}</dateLimite>
        <competences>${escapeXmlText(offreData.competences)}</competences>
        <description>${escapeXmlText(offreData.description)}</description>
        <active>true</active>
      </offre>
    `;

    await soapCall({
      url: serviceInfo.endpoint,
      operation: id ? 'modifierOffre' : 'creerOffre',
      bodyXml,
      namespace: serviceInfo.namespace,
      mockFallback: () => {
        if (id) {
          const idx = offresCache.findIndex(o => o.id == id);
          if (idx !== -1) offresCache[idx] = { ...offresCache[idx], ...offreData };
        } else {
          offresCache.unshift(offreData);
        }
        return { success: true };
      }
    });

    showToast(id ? 'Offre mise à jour avec succès via SOAP.' : 'Offre publiée avec succès via SOAP JAX-WS.', 'success');
    fermerModal();
    if (!CONFIG.useMock) {
      await chargerOffres(); // recharge depuis la base (nouvel id, entreprise réelle)
    } else {
      mettreAJourKPIs();
      appliquerFiltres();
    }
  } catch (err) {
    showToast(`Erreur lors de l'enregistrement SOAP: ${err.message}`, 'error');
  }
}

function escapeXmlText(str) {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function testerPingSoap() {
  try {
    const serviceInfo = CONFIG.services.offres;
    showToast("Envoi de la requête SOAP ping()...", "info");
    const res = await soapCall({
      url: serviceInfo.endpoint,
      operation: 'ping',
      namespace: serviceInfo.namespace,
      mockFallback: () => ({ message: "PONG SOAP (Mode Mock)" })
    });

    let message = "Connectivité SOAP Service 3 OK";
    if (res?.xmlDoc) {
      message = getXmlNodeText(res.xmlDoc, 'return', message);
    }
    showToast(`Connexion établie : ${message}`, "success");
  } catch (err) {
    showToast(`Échec du Ping SOAP: ${err.message}`, "error");
  }
}

// Fonctions globales exposées pour les actions inline
window.editerOffre = function(id) {
  const offre = offresCache.find(o => o.id == id);
  if (offre) ouvrirModal(offre);
};

window.supprimerOffre = async function(id) {
  if (!confirm(`Confirmez-vous la clôture de l'offre #${id} ?`)) return;
  try {
    const serviceInfo = CONFIG.services.offres;
    await soapCall({
      url: serviceInfo.endpoint,
      operation: 'supprimerOffre',
      bodyXml: `<id>${id}</id>`,
      namespace: serviceInfo.namespace,
      mockFallback: () => {
        const item = offresCache.find(o => o.id == id);
        if (item) {
          item.active = false;
          item.placesDisponibles = 0;
        }
        return { success: true };
      }
    });

    const item = offresCache.find(o => o.id == id);
    if (item) {
      item.active = false;
      item.placesDisponibles = 0;
    }

    showToast('Offre clôturée avec succès.', 'success');
    mettreAJourKPIs();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur clôture offre: ${err.message}`, 'error');
  }
};

window.postulerAOffre = function(id, titre, entreprise) {
  sessionStorage.setItem('candidature_preselected_offre_id', id);
  sessionStorage.setItem('candidature_preselected_offre_titre', titre);
  sessionStorage.setItem('candidature_preselected_entreprise', entreprise);
};

window.verifierCompatibiliteModal = function(id) {
  const offre = offresCache.find(o => o.id == id);
  if (!offre) return;
  const isDispo = offre.placesDisponibles > 0 && offre.active;
  alert(
    `[Contrôle SOAP JAX-WS : verifierCompatibilite]\n\n` +
    `Offre : #${offre.id} - ${offre.titre}\n` +
    `Entreprise : ${offre.entrepriseNom}\n` +
    `Places restantes : ${offre.placesDisponibles}\n` +
    `Date limite : ${offre.dateLimite}\n` +
    `Statut disponibilité : ${isDispo ? 'VALIDE (Places disponibles)' : 'NON DISPONIBLE (Sujet clôturé)'}\n\n` +
    `Règle académique AMOA §5 : Un étudiant peut postuler uniquement si le quota n'est pas atteint.`
  );
};