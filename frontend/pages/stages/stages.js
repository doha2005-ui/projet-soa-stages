/**
 * frontend/pages/stages/stages.js
 * Membre 2 : Service 6 Suivi des Stages (REST Jersey)
 * Pages : suivi des stages (stage, comptes rendus, évaluations, historique)
 */

import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

let stagesCache = [];

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Suivi des Stages & Évaluations</h2>
        <p class="page-subtitle">Suivi du déroulement, validation des comptes rendus et notation tuteur</p>
        <div class="page-meta">
          <span class="member-chip">Membre 2</span>
          <span class="badge-type badge-rest">REST Jersey</span>
          <span class="text-muted" style="font-size: 0.8rem;">Service 6: <code>${CONFIG.services.stages.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-outline" id="btn-actualiser-stages">↻ Actualiser</button>
      </div>
    </div>

    <!-- Liste des stages en cours -->
    <div class="grid" id="stages-container" style="gap: 1.5rem;">
      <div style="text-align: center; color: var(--text-muted); padding: 2rem;">Chargement des stages...</div>
    </div>

    <!-- Modal Dépôt Compte Rendu -->
    <div id="cr-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Déposer un Compte Rendu de Stage</h3>
          <button class="close-btn" id="cr-close-btn">&times;</button>
        </div>
        <form id="cr-form">
          <input type="hidden" id="cr-stage-id">
          <div class="form-group">
            <label class="form-label">Période concernée</label>
            <input type="text" id="cr-periode" class="form-input" placeholder="Ex: Avril 2026 (Semaine 9-12)" required>
          </div>
          <div class="form-group">
            <label class="form-label">Activités réalisées & Résultats</label>
            <textarea id="cr-resume" class="form-textarea" rows="4" placeholder="Décrivez les livrables, difficultés et avancement..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="cr-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Soumettre (REST POST)</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Évaluation du Tuteur -->
    <div id="eval-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Évaluation du Stage</h3>
          <button class="close-btn" id="eval-close-btn">&times;</button>
        </div>
        <form id="eval-form">
          <input type="hidden" id="eval-stage-id">
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Note Tuteur Entreprise (/20)</label>
              <input type="number" step="0.5" min="0" max="20" id="eval-note-ent" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Note Encadrant Académique (/20)</label>
              <input type="number" step="0.5" min="0" max="20" id="eval-note-acad" class="form-input">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Appréciation / Commentaire</label>
            <textarea id="eval-comm" class="form-textarea" rows="3" placeholder="Évaluation des compétences..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="eval-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer l'évaluation</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await chargerStages();

  // Événements
  document.getElementById('btn-actualiser-stages').addEventListener('click', chargerStages);
  document.getElementById('cr-close-btn').addEventListener('click', () => fermerModal('cr-modal'));
  document.getElementById('cr-cancel-btn').addEventListener('click', () => fermerModal('cr-modal'));
  document.getElementById('eval-close-btn').addEventListener('click', () => fermerModal('eval-modal'));
  document.getElementById('eval-cancel-btn').addEventListener('click', () => fermerModal('eval-modal'));

  document.getElementById('cr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await soumettreCompteRendu();
  });

  document.getElementById('eval-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await enregistrerEvaluation();
  });
}

async function chargerStages() {
  try {
    const serviceInfo = CONFIG.services.stages;
    const data = await restCall(serviceInfo.endpoint, { method: 'GET' }, serviceInfo.mockFile);
    stagesCache = Array.isArray(data) ? data : [];
    afficherStages(stagesCache);
  } catch (err) {
    showToast(`Erreur chargement suivi des stages: ${err.message}`, 'error');
  }
}

function afficherStages(liste) {
  const container = document.getElementById('stages-container');
  if (!container) return;

  if (liste.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucun stage en cours enregistré.</div>`;
    return;
  }

  container.innerHTML = liste.map(stage => `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">${stage.intitule}</h3>
            <span class="status-badge status-en-cours">${stage.etat}</span>
          </div>
          <div style="color: var(--text-muted); font-size: 0.875rem;">
            Étudiant : <strong>${stage.etudiantNom}</strong> (<code>${stage.etudiantCne}</code>) • Entreprise : <strong>${stage.entrepriseNom}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.25rem;">
            Dates : Du ${stage.dateDebut} au ${stage.dateFin} | Tuteur Ent. : ${stage.tuteurEntreprise} | Tuteur Acad. : ${stage.tuteurAcademique}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="window.ouvrirDepotCR(${stage.id})">+ Déposer CR</button>
          <button class="btn btn-primary btn-sm" onclick="window.ouvrirEval(${stage.id})">Évaluer</button>
        </div>
      </div>

      <!-- Comptes rendus du stage -->
      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">
          Comptes Rendus Déposés (${stage.comptesRendus ? stage.comptesRendus.length : 0})
        </h4>
        <div class="grid grid-2">
          ${(stage.comptesRendus && stage.comptesRendus.length > 0)
            ? stage.comptesRendus.map(cr => `
              <div style="background: var(--surface-alt); border-radius: var(--radius-sm); padding: 0.75rem; border: 1px solid var(--border); font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <strong>${cr.periode}</strong>
                  <span class="status-badge ${cr.statutValidation === 'VALIDÉ' ? 'status-acceptee' : 'status-en-cours'}" style="font-size: 0.65rem;">
                    ${cr.statutValidation}
                  </span>
                </div>
                <p style="color: var(--text-main); font-size: 0.8rem; margin: 0.25rem 0;">${cr.resume}</p>
                <div style="font-size: 0.7rem; color: var(--text-light);">Déposé le ${cr.dateDepot}</div>
              </div>
            `).join('')
            : '<div style="font-size: 0.8rem; color: var(--text-muted);">Aucun compte rendu soumis pour le moment.</div>'}
        </div>
      </div>

      <!-- Évaluations -->
      <div style="background: #f8fafc; border-radius: var(--radius-sm); padding: 0.75rem; border: 1px dashed var(--border); font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Évaluation globale :</strong>
            <span style="color: var(--success); font-weight: 700; margin-left: 0.5rem;">
              ${stage.evaluations?.noteEntreprise ? `${stage.evaluations.noteEntreprise}/20 (Entreprise)` : 'Non noté'}
            </span>
            ${stage.evaluations?.noteAcademique ? ` | <span style="font-weight: 700; color: var(--primary);">${stage.evaluations.noteAcademique}/20 (Académique)</span>` : ''}
          </div>
        </div>
        ${stage.evaluations?.commentaireTuteur ? `<p style="font-style: italic; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem;">« ${stage.evaluations.commentaireTuteur} »</p>` : ''}
      </div>
    </div>
  `).join('');
}

function fermerModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.ouvrirDepotCR = function(stageId) {
  document.getElementById('cr-stage-id').value = stageId;
  document.getElementById('cr-form').reset();
  document.getElementById('cr-modal').style.display = 'flex';
};

window.ouvrirEval = function(stageId) {
  const stage = stagesCache.find(s => s.id == stageId);
  document.getElementById('eval-stage-id').value = stageId;
  document.getElementById('eval-note-ent').value = stage?.evaluations?.noteEntreprise || '';
  document.getElementById('eval-note-acad').value = stage?.evaluations?.noteAcademique || '';
  document.getElementById('eval-comm').value = stage?.evaluations?.commentaireTuteur || '';
  document.getElementById('eval-modal').style.display = 'flex';
};

async function soumettreCompteRendu() {
  const stageId = document.getElementById('cr-stage-id').value;
  const nouveauCR = {
    id: Date.now(),
    periode: document.getElementById('cr-periode').value,
    dateDepot: new Date().toISOString().split('T')[0],
    resume: document.getElementById('cr-resume').value,
    statutValidation: 'EN_ATTENTE'
  };

  try {
    const serviceInfo = CONFIG.services.stages;
    await restCall(
      `${serviceInfo.endpoint}/${stageId}/comptes-rendus`,
      { method: 'POST', body: JSON.stringify(nouveauCR) },
      () => {
        const stage = stagesCache.find(s => s.id == stageId);
        if (stage) {
          if (!stage.comptesRendus) stage.comptesRendus = [];
          stage.comptesRendus.push(nouveauCR);
        }
        return nouveauCR;
      }
    );

    showToast('Compte rendu déposé avec succès !', 'success');
    fermerModal('cr-modal');
    afficherStages(stagesCache);
  } catch (err) {
    showToast(`Erreur dépôt CR: ${err.message}`, 'error');
  }
}

async function enregistrerEvaluation() {
  const stageId = document.getElementById('eval-stage-id').value;
  const evalData = {
    noteEntreprise: parseFloat(document.getElementById('eval-note-ent').value),
    noteAcademique: document.getElementById('eval-note-acad').value ? parseFloat(document.getElementById('eval-note-acad').value) : null,
    commentaireTuteur: document.getElementById('eval-comm').value
  };

  try {
    const serviceInfo = CONFIG.services.stages;
    await restCall(
      `${serviceInfo.endpoint}/${stageId}/evaluation`,
      { method: 'PUT', body: JSON.stringify(evalData) },
      () => {
        const stage = stagesCache.find(s => s.id == stageId);
        if (stage) stage.evaluations = evalData;
        return evalData;
      }
    );

    showToast('Évaluation enregistrée !', 'success');
    fermerModal('eval-modal');
    afficherStages(stagesCache);
  } catch (err) {
    showToast(`Erreur évaluation: ${err.message}`, 'error');
  }
}

