/**
 * frontend/pages/candidatures/candidatures.js
 * Membre 3 : Service 4 Candidatures (REST Jersey)
 * Pages : candidatures (dépôt, liste, changement de statut)
 * Intégration : Orchestration BPMN optionnelle avec Membre 4
 */

import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

let candidaturesCache = [];

export async function render(container) {
  const preselectedOffreId = sessionStorage.getItem('candidature_preselected_offre_id');
  const preselectedOffreTitre = sessionStorage.getItem('candidature_preselected_offre_titre');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des Candidatures</h2>
        <p class="page-subtitle">Dépôt de dossiers, suivi de l'avancement et transitions de statuts</p>
        <div class="page-meta">
          <span class="member-chip">Membre 3</span>
          <span class="badge-type badge-rest">REST Jersey</span>
          <span class="text-muted" style="font-size: 0.8rem;">Service 4: <code>${CONFIG.services.candidatures.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-deposer-candidature">+ Déposer une Candidature</button>
      </div>
    </div>

    <!-- Alert orchestration BPMN vs REST -->
    <div class="alert alert-info">
      <span>⚙️ <strong>Architecture Hybride :</strong> Le dépôt d'une candidature peut soit appeler directement le Service 4 REST (Membre 3), soit instancier le processus Bonita BPMN (Membre 4). Choisissez la voie lors du dépôt !</span>
    </div>

    <!-- Filtres des statuts -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <label class="form-label" style="margin: 0;">Filtrer par statut :</label>
        <select id="cand-statut-filter" class="form-select" style="max-width: 220px;">
          <option value="ALL">Tous les statuts</option>
          <option value="déposée">Déposée</option>
          <option value="en cours d'évaluation">En cours d'évaluation</option>
          <option value="acceptée">Acceptée</option>
          <option value="refusée">Refusée</option>
        </select>
        <span class="text-muted" style="font-size: 0.85rem;" id="cand-count"></span>
      </div>
    </div>

    <!-- Tableau des candidatures -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Réf</th>
            <th>Offre & Entreprise</th>
            <th>Candidat</th>
            <th>Date Dépôt</th>
            <th>Orchestration</th>
            <th>Statut</th>
            <th style="text-align: right;">Action Statut</th>
          </tr>
        </thead>
        <tbody id="candidatures-table-body">
          <tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Chargement...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Dépôt Candidature -->
    <div id="candidature-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Déposer une Candidature</h3>
          <button class="close-btn" id="cand-close-btn">&times;</button>
        </div>
        <form id="candidature-form">
          <div class="form-group">
            <label class="form-label">Offre visée</label>
            <input type="text" id="cand-form-offre" class="form-input" placeholder="Intitulé de l'offre" required>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Nom & Prénom Étudiant</label>
              <input type="text" id="cand-form-nom" class="form-input" required placeholder="Ex: Yassine Benali">
            </div>
            <div class="form-group">
              <label class="form-label">Email Universitaire</label>
              <input type="email" id="cand-form-email" class="form-input" required placeholder="etudiant@inpt.ac.ma">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Lettre / Motivation synthétique</label>
            <textarea id="cand-form-motivation" class="form-textarea" rows="3" placeholder="Expliquez brièvement votre intérêt..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Mode de soumission</label>
            <select id="cand-form-route" class="form-select">
              <option value="REST">Direct Service 4 (REST)</option>
              <option value="BPMN">Déclencher Processus Bonita (BPMN Membre 4)</option>
            </select>
            <small style="color: var(--text-muted);">Conforme à la convention de coordination Membre 3 / Membre 4</small>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="cand-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Soumettre la candidature</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await chargerCandidatures();

  // Événements
  document.getElementById('cand-statut-filter').addEventListener('change', (e) => {
    filtrerCandidatures(e.target.value);
  });

  document.getElementById('btn-deposer-candidature').addEventListener('click', () => {
    ouvrirModal();
  });

  document.getElementById('cand-close-btn').addEventListener('click', fermerModal);
  document.getElementById('cand-cancel-btn').addEventListener('click', fermerModal);

  document.getElementById('candidature-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await soumettreCandidature();
  });

  // Si l'utilisateur vient de cliquer sur "Postuler" depuis la page offres
  if (preselectedOffreTitre) {
    ouvrirModal(preselectedOffreTitre);
    sessionStorage.removeItem('candidature_preselected_offre_id');
    sessionStorage.removeItem('candidature_preselected_offre_titre');
  }
}

async function chargerCandidatures() {
  try {
    const serviceInfo = CONFIG.services.candidatures;
    const data = await restCall(serviceInfo.endpoint, { method: 'GET' }, serviceInfo.mockFile);
    candidaturesCache = Array.isArray(data) ? data : [];
    afficherCandidatures(candidaturesCache);
  } catch (err) {
    showToast(`Erreur chargement candidatures: ${err.message}`, 'error');
  }
}

function afficherCandidatures(liste) {
  const tbody = document.getElementById('candidatures-table-body');
  const countEl = document.getElementById('cand-count');
  if (!tbody) return;

  countEl.textContent = `${liste.length} candidature(s)`;

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Aucune candidature trouvée</td></tr>`;
    return;
  }

  tbody.innerHTML = liste.map(item => {
    const badgeClass = getStatusClass(item.statut);
    return `
      <tr>
        <td><code>#${item.id}</code></td>
        <td>
          <strong>${item.offreTitre}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${item.entrepriseNom || 'Entreprise partenaire'}</div>
        </td>
        <td>
          <div>${item.etudiantNom}</div>
          <div style="font-size: 0.75rem; color: var(--text-light);">${item.etudiantEmail}</div>
        </td>
        <td>${item.dateDepot}</td>
        <td><span class="member-chip" style="font-size: 0.7rem;">${item.orchestrateur}</span></td>
        <td><span class="status-badge ${badgeClass}">${item.statut}</span></td>
        <td style="text-align: right;">
          <select class="form-select" style="width: auto; padding: 0.2rem 0.5rem; font-size: 0.75rem; display: inline-block;" onchange="window.changerStatutCandidature(${item.id}, this.value)">
            <option value="" disabled selected>Modifier statut...</option>
            <option value="déposée">Déposée</option>
            <option value="en cours d'évaluation">En cours d'évaluation</option>
            <option value="acceptée">Acceptée</option>
            <option value="refusée">Refusée</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusClass(statut) {
  switch ((statut || '').toLowerCase()) {
    case 'déposée': return 'status-deposee';
    case 'en cours d\'évaluation': return 'status-en-cours';
    case 'acceptée': return 'status-acceptee';
    case 'refusée': return 'status-refusee';
    default: return 'status-deposee';
  }
}

function filtrerCandidatures(statut) {
  if (statut === 'ALL') {
    afficherCandidatures(candidaturesCache);
  } else {
    afficherCandidatures(candidaturesCache.filter(c => c.statut.toLowerCase() === statut.toLowerCase()));
  }
}

function ouvrirModal(offreTitre = '') {
  document.getElementById('candidature-form').reset();
  if (offreTitre) {
    document.getElementById('cand-form-offre').value = offreTitre;
  }
  document.getElementById('candidature-modal').style.display = 'flex';
}

function fermerModal() {
  document.getElementById('candidature-modal').style.display = 'none';
}

async function soumettreCandidature() {
  const route = document.getElementById('cand-form-route').value;
  const nouvelleCand = {
    id: Date.now(),
    offreTitre: document.getElementById('cand-form-offre').value,
    entrepriseNom: 'Entreprise partenaire',
    etudiantNom: document.getElementById('cand-form-nom').value,
    etudiantEmail: document.getElementById('cand-form-email').value,
    dateDepot: new Date().toISOString().split('T')[0],
    statut: 'déposée',
    motivation: document.getElementById('cand-form-motivation').value,
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

    showToast(`Candidature soumise avec succès via ${route} !`, 'success');
    fermerModal();
    afficherCandidatures(candidaturesCache);
  } catch (err) {
    showToast(`Erreur soumission candidature: ${err.message}`, 'error');
  }
}

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

    showToast(`Statut mis à jour : "${nouveauStatut}"`, 'success');
    afficherCandidatures(candidaturesCache);
  } catch (err) {
    showToast(`Erreur changement de statut: ${err.message}`, 'error');
  }
};

