/**
 * frontend/pages/candidatures/candidatures.js
 * Membre 3 : Service 4 Candidatures (REST Jersey)
 * Pages : candidatures (depot, suivi des dossiers, evaluation, transitions de statuts)
 * Intégration : Architecture hybride REST direct & Orchestration BPMN Bonita
 * Design : Professionnel, épuré, sans emojis, conforme aux standards institutionnels
 */

import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

let candidaturesCache = [];
let filtreStatutActif = 'ALL';

// Icones SVG vectorielles (Style Feather / Lucide)
const ICONS = {
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  building: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line></svg>`,
  fileText: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
};

export async function render(container) {
  const preselectedOffreId = sessionStorage.getItem('candidature_preselected_offre_id');
  const preselectedOffreTitre = sessionStorage.getItem('candidature_preselected_offre_titre');
  const preselectedEntreprise = sessionStorage.getItem('candidature_preselected_entreprise') || 'Entreprise Partenaire';

  const currentRole = CONFIG.activeRole;
  const isEtudiant = currentRole === 'etudiant';
  const isEntreprise = currentRole === 'entreprise';
  const isResponsable = currentRole === 'responsable';
  const isAll = currentRole === 'all';

  const canApply = isAll || isEtudiant;

  let roleTitle = "Gestion des Candidatures";
  let roleSubtitle = "Dépôt de dossiers de stage, suivi de l'avancement et transitions de statuts";
  let roleBannerHtml = "";

  if (isEtudiant) {
    roleTitle = "Mes Candidatures";
    roleSubtitle = "Suivi de l'avancement de vos dossiers auprès des entreprises et de l'administration";
    roleBannerHtml = `
      <div class="role-context-banner student-banner">
        <span><strong>Espace Candidat :</strong> Consultez vos dossiers déposés. Vous pouvez annuler votre candidature tant qu'elle est en cours d'évaluation.</span>
      </div>`;
  } else if (isEntreprise) {
    roleTitle = "Évaluation des Candidatures";
    roleSubtitle = "Examen des profils étudiants, consultation des motivations et prise de décision";
    roleBannerHtml = `
      <div class="role-context-banner company-banner">
        <span><strong>Espace Recruteur Entreprise :</strong> Évaluez les candidatures associées à vos offres et appliquez les transitions d'état.</span>
      </div>`;
  } else if (isResponsable) {
    roleTitle = "Supervision Globale des Candidatures";
    roleSubtitle = "Observabilité académique de l'attribution des stages et du flux d'orchestration";
    roleBannerHtml = `
      <div class="role-context-banner admin-banner">
        <span><strong>Espace Responsable Pédagogique :</strong> Vue d'ensemble sur le vivier d'étudiants ayant postulé et vérification des validations finales.</span>
      </div>`;
  } else {
    roleBannerHtml = `
      <div class="role-context-banner dev-banner">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; width: 100%;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="member-chip">Membre 3</span>
            <span class="badge-type badge-rest">REST Jersey</span>
            <span class="text-muted" style="font-size: 0.8rem;">Endpoint : <code>${CONFIG.services.candidatures.endpoint}</code></span>
          </div>
          <span style="font-size: 0.78rem; color: var(--text-muted);">Architecture Hybride REST direct / BPMN Bonita (Membre 4)</span>
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

      .kpi-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .kpi-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 0.85rem 1rem;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
      }
      .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
      }
      .kpi-card.active {
        border-color: var(--primary);
        background: #f8fafc;
        box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
      }
      .kpi-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: #cbd5e1;
      }
      .kpi-card#kpi-all::before { background: var(--primary); }
      .kpi-card#kpi-deposee::before { background: #64748b; }
      .kpi-card#kpi-encours::before { background: #d97706; }
      .kpi-card#kpi-acceptee::before { background: #059669; }
      .kpi-card#kpi-refusee::before { background: #dc2626; }

      .kpi-val {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.1;
      }
      .kpi-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 0.35rem;
        font-weight: 500;
      }

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
        min-width: 240px;
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

      .avatar-circle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        color: white;
        flex-shrink: 0;
      }

      .table-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
      }
      .table th {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-muted);
        padding: 0.85rem 1rem;
      }
      .table td {
        padding: 0.85rem 1rem;
        font-size: 0.85rem;
      }

      .modal-quote {
        background: var(--surface-alt);
        border-left: 4px solid var(--primary);
        padding: 1rem;
        border-radius: var(--radius-sm);
        margin: 1rem 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--text-main);
      }
    </style>

    <div class="page-header">
      <div>
        <h2 class="page-title">${roleTitle}</h2>
        <p class="page-subtitle">${roleSubtitle}</p>
      </div>
      <div>
        ${canApply ? `<button class="btn btn-primary" id="btn-deposer-candidature">+ Déposer une Candidature</button>` : ''}
      </div>
    </div>

    ${roleBannerHtml}

    <!-- Bandeau KPI interactif sans emojis -->
    <div class="kpi-row">
      <div class="kpi-card active" data-filter="ALL" id="kpi-all">
        <div class="kpi-val" style="color: var(--primary);" id="val-total">--</div>
        <div class="kpi-label">Total candidatures</div>
      </div>
      <div class="kpi-card" data-filter="déposée" id="kpi-deposee">
        <div class="kpi-val" style="color: #475569;" id="val-deposees">--</div>
        <div class="kpi-label">Dossiers déposés</div>
      </div>
      <div class="kpi-card" data-filter="en cours d'évaluation" id="kpi-encours">
        <div class="kpi-val" style="color: #d97706;" id="val-encours">--</div>
        <div class="kpi-label">En cours d'évaluation</div>
      </div>
      <div class="kpi-card" data-filter="acceptée" id="kpi-acceptee">
        <div class="kpi-val" style="color: #059669;" id="val-acceptees">--</div>
        <div class="kpi-label">Candidatures acceptées</div>
      </div>
      <div class="kpi-card" data-filter="refusée" id="kpi-refusee">
        <div class="kpi-val" style="color: #dc2626;" id="val-refusees">--</div>
        <div class="kpi-label">Candidatures refusées</div>
      </div>
    </div>

    <!-- Filtres & Recherche -->
    <div class="filter-toolbar">
      <div class="search-box">
        <span class="search-box-icon">${ICONS.search}</span>
        <input type="text" id="cand-search-input" class="form-input" placeholder="Rechercher par candidat, email, intitulé du stage ou entreprise...">
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <select id="cand-statut-filter" class="form-select" style="min-width: 170px;">
          <option value="ALL">Tous les statuts</option>
          <option value="déposée">Déposée</option>
          <option value="en cours d'évaluation">En cours d'évaluation</option>
          <option value="acceptée">Acceptée</option>
          <option value="refusée">Refusée</option>
        </select>
        <select id="cand-route-filter" class="form-select" style="min-width: 170px;">
          <option value="ALL">Tous les orchestrateurs</option>
          <option value="REST">REST Direct (Service 4)</option>
          <option value="BPMN">BPMN Bonita (Membre 4)</option>
        </select>
      </div>
      <span class="text-muted" style="font-size: 0.85rem; font-weight: 500;" id="cand-count"></span>
    </div>

    <!-- Tableau Moderne des Candidatures -->
    <div class="table-card">
      <div class="table-container" style="border: none;">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 70px;">Réf</th>
              <th>Offre Visée & Entreprise</th>
              <th>Candidat (Étudiant)</th>
              <th style="width: 110px;">Date Dépôt</th>
              <th style="width: 130px;">Orchestration</th>
              <th style="width: 130px;">Statut</th>
              <th style="width: 100px; text-align: center;">Dossier</th>
              <th style="min-width: 150px; text-align: right;">Action Décision</th>
            </tr>
          </thead>
          <tbody id="candidatures-table-body">
            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">Chargement des candidatures via REST Jersey...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Dépôt Candidature -->
    <div id="candidature-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <h3 class="modal-title">Déposer un Dossier de Candidature</h3>
          <button class="close-btn" id="cand-close-btn">&times;</button>
        </div>
        <form id="candidature-form">
          <div class="form-group">
            <label class="form-label">Offre visée *</label>
            <input type="text" id="cand-form-offre" class="form-input" placeholder="Intitulé exact de l'offre de stage" required>
          </div>
          <div class="form-group">
            <label class="form-label">Entreprise d'accueil</label>
            <input type="text" id="cand-form-entreprise" class="form-input" placeholder="Ex: TechSolutions Maroc" required>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Nom & Prénom de l'Étudiant *</label>
              <input type="text" id="cand-form-nom" class="form-input" required placeholder="Ex: Yassine Benali">
            </div>
            <div class="form-group">
              <label class="form-label">Email Académique INPT *</label>
              <input type="email" id="cand-form-email" class="form-input" required placeholder="etudiant@inpt.ac.ma">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Lettre / Motivation synthétique *</label>
            <textarea id="cand-form-motivation" class="form-textarea" rows="4" placeholder="Présentez vos compétences clés, votre filière et votre projet académique en lien avec le sujet..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Mode d'Orchestration & Workflow</label>
            <select id="cand-form-route" class="form-select">
              <option value="REST">Direct Service 4 REST (Jersey - Membre 3)</option>
              <option value="BPMN">Processus Métier Bonita BPMN (Orchestration - Membre 4)</option>
            </select>
            <small style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px; display: block;">
              Conforme aux spécifications : Le service REST communique avec le processus Bonita pour le suivi d'avancement.
            </small>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" class="btn btn-outline" id="cand-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Soumettre le dossier</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Affichage Détails Dossier & Motivation -->
    <div id="detail-dossier-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3 class="modal-title" id="detail-modal-title">Détails du Dossier</h3>
          <button class="close-btn" id="detail-close-btn">&times;</button>
        </div>
        <div id="detail-modal-body">
          <!-- Injecté dynamiquement -->
        </div>
      </div>
    </div>
  `;

  await chargerCandidatures();

  // Événements
  const btnDeposer = document.getElementById('btn-deposer-candidature');
  if (btnDeposer) {
    btnDeposer.addEventListener('click', () => {
      ouvrirModal();
    });
  }

  document.getElementById('cand-close-btn').addEventListener('click', fermerModal);
  document.getElementById('cand-cancel-btn').addEventListener('click', fermerModal);
  document.getElementById('detail-close-btn').addEventListener('click', fermerDetailModal);

  document.getElementById('cand-search-input').addEventListener('input', appliquerFiltres);
  document.getElementById('cand-statut-filter').addEventListener('change', (e) => {
    filtreStatutActif = e.target.value;
    synchroniserKpiActif();
    appliquerFiltres();
  });
  document.getElementById('cand-route-filter').addEventListener('change', appliquerFiltres);

  // Clic sur les cartes KPI pour filtrage direct
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      filtreStatutActif = card.dataset.filter;
      const select = document.getElementById('cand-statut-filter');
      if (select) select.value = filtreStatutActif;
      synchroniserKpiActif();
      appliquerFiltres();
    });
  });

  document.getElementById('candidature-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await soumettreCandidature();
  });

  // Si l'utilisateur arrive en ayant cliqué sur "Postuler" dans la page Offres
  if (preselectedOffreTitre) {
    ouvrirModal(preselectedOffreTitre, preselectedEntreprise);
    sessionStorage.removeItem('candidature_preselected_offre_id');
    sessionStorage.removeItem('candidature_preselected_offre_titre');
    sessionStorage.removeItem('candidature_preselected_entreprise');
  }
}

async function chargerCandidatures() {
  try {
    const serviceInfo = CONFIG.services.candidatures;
    const data = await restCall(serviceInfo.endpoint, { method: 'GET' }, serviceInfo.mockFile);
    candidaturesCache = Array.isArray(data) ? data.map(normaliserCandidature) : [];
    mettreAJourKPIs();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur chargement candidatures: ${err.message}`, 'error');
  }
}

function normaliserCandidature(c) {
  return {
    id: c.id || Date.now(),
    offreId: c.offreId || 201,
    offreTitre: c.offreTitre || "Stage de fin d'études",
    entrepriseNom: c.entrepriseNom || "Entreprise Partenaire",
    etudiantId: c.etudiantId || 1,
    etudiantNom: c.etudiantNom || "Étudiant INPT",
    etudiantEmail: c.etudiantEmail || "etudiant@inpt.ac.ma",
    dateDepot: c.dateDepot || new Date().toISOString().split('T')[0],
    statut: (c.statut || 'déposée').toLowerCase(),
    motivation: c.motivation || "Aucune lettre de motivation fournie.",
    orchestrateur: c.orchestrateur || "REST (Service 4 direct)"
  };
}

function mettreAJourKPIs() {
  const elTotal = document.getElementById('val-total');
  const elDep = document.getElementById('val-deposees');
  const elEnc = document.getElementById('val-encours');
  const elAcc = document.getElementById('val-acceptees');
  const elRef = document.getElementById('val-refusees');

  if (!elTotal) return;

  const total = candidaturesCache.length;
  const dep = candidaturesCache.filter(c => c.statut === 'déposée').length;
  const enc = candidaturesCache.filter(c => c.statut === "en cours d'évaluation").length;
  const acc = candidaturesCache.filter(c => c.statut === 'acceptée').length;
  const ref = candidaturesCache.filter(c => c.statut === 'refusée').length;

  elTotal.textContent = total;
  elDep.textContent = dep;
  elEnc.textContent = enc;
  elAcc.textContent = acc;
  elRef.textContent = ref;
}

function synchroniserKpiActif() {
  document.querySelectorAll('.kpi-card').forEach(card => {
    if (card.dataset.filter.toLowerCase() === filtreStatutActif.toLowerCase()) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function appliquerFiltres() {
  const searchInput = document.getElementById('cand-search-input');
  const routeSelect = document.getElementById('cand-route-filter');

  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedRoute = routeSelect ? routeSelect.value : 'ALL';

  const resultats = candidaturesCache.filter(item => {
    const textCorpus = `${item.etudiantNom} ${item.etudiantEmail} ${item.offreTitre} ${item.entrepriseNom} ${item.motivation}`.toLowerCase();
    const matchText = !q || textCorpus.includes(q);

    const matchStatut = filtreStatutActif === 'ALL' || item.statut.toLowerCase() === filtreStatutActif.toLowerCase();

    let matchRoute = true;
    if (selectedRoute === 'REST') {
      matchRoute = (item.orchestrateur || '').includes('REST');
    } else if (selectedRoute === 'BPMN') {
      matchRoute = (item.orchestrateur || '').includes('BPMN');
    }

    return matchText && matchStatut && matchRoute;
  });

  afficherCandidatures(resultats);
}

function afficherCandidatures(liste) {
  const tbody = document.getElementById('candidatures-table-body');
  const countEl = document.getElementById('cand-count');
  if (!tbody) return;

  if (countEl) {
    countEl.textContent = `${liste.length} candidature(s) affichée(s)`;
  }

  if (liste.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          <p style="font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Aucune candidature correspondante</p>
          <p style="font-size: 0.8rem;">Modifiez vos termes de recherche ou sélectionnez un autre statut.</p>
        </td>
      </tr>`;
    return;
  }

  const currentRole = CONFIG.activeRole;
  const isEtudiant = currentRole === 'etudiant';
  const isEntreprise = currentRole === 'entreprise';
  const isResponsable = currentRole === 'responsable';

  const avatarColors = ['#1d4ed8', '#6d28d9', '#047857', '#b45309', '#be185d', '#0e7490'];

  tbody.innerHTML = liste.map((item, idx) => {
    const badgeClass = getStatusClass(item.statut);
    const statusLabel = getStatusLabel(item.statut);
    const isBpmn = (item.orchestrateur || '').includes('BPMN');
    const orchBadge = isBpmn
      ? `<span class="badge-type badge-bpmn" title="Déclenché via Bonita BPMN">BPMN Bonita</span>`
      : `<span class="badge-type badge-rest" title="Appel direct REST Service 4">REST Direct</span>`;

    const initials = item.etudiantNom
      ? item.etudiantNom.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : 'ET';
    const avatarColor = avatarColors[idx % avatarColors.length];

    let actionCellHtml = "";
    if (isEtudiant) {
      if (item.statut === 'acceptée') {
        actionCellHtml = `<span style="font-size: 0.78rem; font-weight: 600; color: var(--success);">Dossier validé</span>`;
      } else if (item.statut === 'refusée') {
        actionCellHtml = `<span style="font-size: 0.78rem; color: var(--text-muted);">Dossier clos</span>`;
      } else {
        actionCellHtml = `
          <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fca5a5; font-size: 0.72rem; padding: 3px 8px;" onclick="window.annulerCandidature(${item.id})">
            Annuler le dossier
          </button>`;
      }
    } else if (isEntreprise || isResponsable) {
      actionCellHtml = `
        <select class="form-select" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.75rem; display: inline-block; font-weight: 500;" onchange="window.changerStatutCandidature(${item.id}, this.value)">
          <option value="" disabled selected>Modifier statut...</option>
          <option value="déposée" ${item.statut === 'déposée' ? 'disabled' : ''}>Déposée</option>
          <option value="en cours d'évaluation" ${item.statut === "en cours d'évaluation" ? 'disabled' : ''}>En évaluation</option>
          <option value="acceptée" ${item.statut === 'acceptée' ? 'disabled' : ''}>Accepter candidat</option>
          <option value="refusée" ${item.statut === 'refusée' ? 'disabled' : ''}>Refuser dossier</option>
        </select>`;
    } else {
      actionCellHtml = `
        <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
          <select class="form-select" style="width: auto; padding: 0.2rem 0.4rem; font-size: 0.72rem;" onchange="window.changerStatutCandidature(${item.id}, this.value)">
            <option value="" disabled selected>Statut...</option>
            <option value="déposée">Déposée</option>
            <option value="en cours d'évaluation">En cours</option>
            <option value="acceptée">Acceptée</option>
            <option value="refusée">Refusée</option>
          </select>
          <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fca5a5; padding: 2px 6px; font-size: 0.7rem;" title="Supprimer" onclick="window.annulerCandidature(${item.id})">Suppr.</button>
        </div>`;
    }

    return `
      <tr>
        <td><code style="font-weight: 600; font-size: 0.8rem; background: var(--surface-alt); padding: 2px 6px; border-radius: 4px;">#${item.id}</code></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); line-height: 1.3;">${escapeHtml(item.offreTitre)}</div>
          <div style="font-size: 0.75rem; color: var(--primary); font-weight: 500; margin-top: 2px;">
            ${escapeHtml(item.entrepriseNom)}
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="avatar-circle" style="background: ${avatarColor};">${initials}</div>
            <div>
              <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(item.etudiantNom)}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(item.etudiantEmail)}</div>
            </div>
          </div>
        </td>
        <td style="white-space: nowrap; color: var(--text-muted); font-size: 0.8rem;">
          ${escapeHtml(item.dateDepot)}
        </td>
        <td>${orchBadge}</td>
        <td><span class="status-badge ${badgeClass}">${statusLabel}</span></td>
        <td style="text-align: center;">
          <button class="btn btn-outline btn-sm" style="padding: 2px 7px; font-size: 0.75rem;" onclick="window.ouvrirDetailDossier(${item.id})" title="Consulter la motivation et les informations">
            Consulter
          </button>
        </td>
        <td style="text-align: right;">
          ${actionCellHtml}
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusClass(statut) {
  switch ((statut || '').toLowerCase()) {
    case 'déposée': return 'status-deposee';
    case "en cours d'évaluation": return 'status-en-cours';
    case 'acceptée': return 'status-acceptee';
    case 'refusée': return 'status-refusee';
    default: return 'status-deposee';
  }
}

function getStatusLabel(statut) {
  switch ((statut || '').toLowerCase()) {
    case 'déposée': return 'Déposée';
    case "en cours d'évaluation": return 'En évaluation';
    case 'acceptée': return 'Acceptée';
    case 'refusée': return 'Refusée';
    default: return statut || 'Déposée';
  }
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

function ouvrirModal(offreTitre = '', entrepriseNom = '') {
  document.getElementById('candidature-form').reset();
  if (offreTitre) {
    document.getElementById('cand-form-offre').value = offreTitre;
  }
  if (entrepriseNom) {
    document.getElementById('cand-form-entreprise').value = entrepriseNom;
  }
  document.getElementById('candidature-modal').style.display = 'flex';
}

function fermerModal() {
  document.getElementById('candidature-modal').style.display = 'none';
}

function fermerDetailModal() {
  document.getElementById('detail-dossier-modal').style.display = 'none';
}

async function soumettreCandidature() {
  const route = document.getElementById('cand-form-route').value;
  const nouvelleCand = {
    id: 300 + candidaturesCache.length + 1,
    offreId: 201,
    offreTitre: document.getElementById('cand-form-offre').value.trim(),
    entrepriseNom: document.getElementById('cand-form-entreprise').value.trim() || 'Entreprise Partenaire',
    etudiantId: 10 + Math.floor(Math.random() * 90),
    etudiantNom: document.getElementById('cand-form-nom').value.trim(),
    etudiantEmail: document.getElementById('cand-form-email').value.trim(),
    dateDepot: new Date().toISOString().split('T')[0],
    statut: 'déposée',
    motivation: document.getElementById('cand-form-motivation').value.trim(),
    orchestrateur: route === 'BPMN' ? 'BPMN (Bonita Process)' : 'REST (Service 4 direct)'
  };

  try {
    const serviceTarget = route === 'BPMN'
      ? CONFIG.services.bpmn.endpoint + '/instantiation'
      : CONFIG.services.candidatures.endpoint;

    await restCall(
      serviceTarget,
      {
        method: 'POST',
        body: JSON.stringify(nouvelleCand)
      },
      () => {
        candidaturesCache.unshift(nouvelleCand);
        return nouvelleCand;
      }
    );

    showToast(`Candidature soumise avec succès via ${route === 'BPMN' ? 'Orchestration BPMN' : 'REST Service 4'}.`, 'success');
    fermerModal();
    if (!CONFIG.useMock) {
      await chargerCandidatures(); // recharge depuis la base (vrai id, jointures)
    } else {
      mettreAJourKPIs();
      appliquerFiltres();
    }
  } catch (err) {
    showToast(`Erreur de soumission: ${err.message}`, 'error');
  }
}

// Détail du dossier dans un modal soigné
window.ouvrirDetailDossier = function(id) {
  const item = candidaturesCache.find(c => c.id == id);
  if (!item) return;

  const currentRole = CONFIG.activeRole;
  const canEvaluate = currentRole === 'all' || currentRole === 'entreprise' || currentRole === 'responsable';

  document.getElementById('detail-modal-title').textContent = `Dossier #${item.id} - ${item.etudiantNom}`;

  const body = document.getElementById('detail-modal-body');
  body.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-light); font-weight: 700; letter-spacing: 0.04em;">Sujet de stage visé</div>
      <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">${escapeHtml(item.offreTitre)}</div>
      <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${escapeHtml(item.entrepriseNom)}</div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; background: var(--surface-alt); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 1rem;">
      <div>
        <span style="color: var(--text-muted);">Candidat :</span>
        <strong>${escapeHtml(item.etudiantNom)}</strong>
      </div>
      <div>
        <span style="color: var(--text-muted);">Email académique :</span>
        <strong>${escapeHtml(item.etudiantEmail)}</strong>
      </div>
      <div>
        <span style="color: var(--text-muted);">Date de soumission :</span>
        <strong>${escapeHtml(item.dateDepot)}</strong>
      </div>
      <div>
        <span style="color: var(--text-muted);">Orchestrateur :</span>
        <strong>${escapeHtml(item.orchestrateur)}</strong>
      </div>
      <div>
        <span style="color: var(--text-muted);">Statut actuel :</span>
        <span class="status-badge ${getStatusClass(item.statut)}">${getStatusLabel(item.statut)}</span>
      </div>
    </div>

    <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-light); font-weight: 700; letter-spacing: 0.04em;">Lettre & Argumentaire de motivation</div>
    <div class="modal-quote">
      "${escapeHtml(item.motivation)}"
    </div>

    ${canEvaluate ? `
      <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
        <div style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">Décision du recruteur :</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" onclick="window.changerStatutDepuisModal(${item.id}, 'en cours d\\'évaluation')">Mettre en évaluation</button>
          <button class="btn btn-primary btn-sm" style="background: var(--success); border-color: var(--success);" onclick="window.changerStatutDepuisModal(${item.id}, 'acceptée')">Accepter la candidature</button>
          <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fca5a5;" onclick="window.changerStatutDepuisModal(${item.id}, 'refusée')">Refuser</button>
        </div>
      </div>` : ''}
  `;

  document.getElementById('detail-dossier-modal').style.display = 'flex';
};

window.changerStatutDepuisModal = async function(id, nouveauStatut) {
  await window.changerStatutCandidature(id, nouveauStatut);
  fermerDetailModal();
};

window.changerStatutCandidature = async function(id, nouveauStatut) {
  if (!nouveauStatut) return;
  const item = candidaturesCache.find(c => c.id == id);
  if (!item) return;

  try {
    const serviceInfo = CONFIG.services.candidatures;
    await restCall(
      `${serviceInfo.endpoint}/${id}/statut`,
      {
        method: 'PATCH',
        body: JSON.stringify({ statut: nouveauStatut })
      },
      () => {
        item.statut = nouveauStatut;
        return { success: true, statut: nouveauStatut };
      }
    );

    item.statut = nouveauStatut;
    showToast(`Statut mis à jour : "${getStatusLabel(nouveauStatut)}"`, 'success');
    mettreAJourKPIs();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur changement de statut: ${err.message}`, 'error');
  }
};

window.annulerCandidature = async function(id) {
  if (!confirm('Confirmez-vous l\'annulation de cette candidature ?')) return;
  try {
    const serviceInfo = CONFIG.services.candidatures;
    await restCall(
      `${serviceInfo.endpoint}/${id}`,
      { method: 'DELETE' },
      () => {
        candidaturesCache = candidaturesCache.filter(c => c.id != id);
        return { success: true };
      }
    );

    candidaturesCache = candidaturesCache.filter(c => c.id != id);
    showToast('Candidature retirée avec succès.', 'success');
    mettreAJourKPIs();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur annulation: ${err.message}`, 'error');
  }
};