/**
 * frontend/pages/bpmn/bpmn.js
 * Membre 4 : Orchestration BPMN Bonita
 * Pages : suivi du processus BPMN (cycle de vie des candidatures et conventions)
 */

import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

let bpmnCache = null;

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Orchestration & Suivi du Processus BPMN</h2>
        <p class="page-subtitle">Supervision du moteur Bonita BPM et orchestration des services SOA</p>
        <div class="page-meta">
          <span class="member-chip">Membre 4</span>
          <span class="badge-type badge-bpmn">BPMN Bonita</span>
          <span class="text-muted" style="font-size: 0.8rem;">Endpoint Bonita: <code>${CONFIG.services.bpmn.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-outline" id="btn-refresh-bpmn">↻ Rafraîchir BPMN</button>
      </div>
    </div>

    <!-- Workflow visuel des étapes -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <h3 class="card-title">Flux Global du Processus de Stage</h3>
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding: 1rem 0; align-items: center;">
        <div style="flex: 1; min-width: 150px; background: #e0f2fe; border: 1px solid #7dd3fc; padding: 0.75rem; border-radius: var(--radius-sm); text-align: center;">
          <div style="font-size: 0.75rem; color: #0369a1; font-weight: 700;">1. CANDIDATURE</div>
          <div style="font-size: 0.825rem; font-weight: 600;">Dépôt Étudiant</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Membre 3 (REST 4)</div>
        </div>
        <div style="color: var(--text-light); font-weight: bold;">➔</div>
        <div style="flex: 1; min-width: 150px; background: #fef3c7; border: 1px solid #fde68a; padding: 0.75rem; border-radius: var(--radius-sm); text-align: center;">
          <div style="font-size: 0.75rem; color: #b45309; font-weight: 700;">2. ENTREPRISE</div>
          <div style="font-size: 0.825rem; font-weight: 600;">Sélection RH</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Membre 2 (SOAP 2)</div>
        </div>
        <div style="color: var(--text-light); font-weight: bold;">➔</div>
        <div style="flex: 1; min-width: 150px; background: #f3e8ff; border: 1px solid #d8b4fe; padding: 0.75rem; border-radius: var(--radius-sm); text-align: center;">
          <div style="font-size: 0.75rem; color: #7e22ce; font-weight: 700;">3. ÉCOLE</div>
          <div style="font-size: 0.825rem; font-weight: 600;">Validation Sujet</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Responsable PFE</div>
        </div>
        <div style="color: var(--text-light); font-weight: bold;">➔</div>
        <div style="flex: 1; min-width: 150px; background: #dcfce7; border: 1px solid #86efac; padding: 0.75rem; border-radius: var(--radius-sm); text-align: center;">
          <div style="font-size: 0.75rem; color: #15803d; font-weight: 700;">4. CONVENTION</div>
          <div style="font-size: 0.825rem; font-weight: 600;">Génération & Signature</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Processus Bonita</div>
        </div>
        <div style="color: var(--text-light); font-weight: bold;">➔</div>
        <div style="flex: 1; min-width: 150px; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.75rem; border-radius: var(--radius-sm); text-align: center;">
          <div style="font-size: 0.75rem; color: #334155; font-weight: 700;">5. SUIVI DU STAGE</div>
          <div style="font-size: 0.825rem; font-weight: 600;">CRs & Évaluations</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">Membre 2 (REST 6)</div>
        </div>
      </div>
    </div>

    <!-- Instances de processus en cours (Bonita Cases) -->
    <div class="card">
      <h3 class="card-title">Instances Bonita Actives (Cases)</h3>
      <div id="bpmn-cases-container">
        <div style="text-align: center; color: var(--text-muted); padding: 2rem;">Chargement des instances Bonita...</div>
      </div>
    </div>
  `;

  await chargerBPMN();

  document.getElementById('btn-refresh-bpmn').addEventListener('click', chargerBPMN);
}

async function chargerBPMN() {
  try {
    const serviceInfo = CONFIG.services.bpmn;
    bpmnCache = await restCall(serviceInfo.endpoint + '/cases', { method: 'GET' }, serviceInfo.mockFile);
    afficherCases(bpmnCache?.instances || []);
  } catch (err) {
    showToast(`Erreur chargement BPMN: ${err.message}`, 'error');
  }
}

function afficherCases(instances) {
  const container = document.getElementById('bpmn-cases-container');
  if (!container) return;

  if (instances.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted);">Aucune instance en cours d'exécution.</div>`;
    return;
  }

  container.innerHTML = instances.map(inst => `
    <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; background: var(--surface);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <strong style="font-size: 1rem;">Instance Bonita Case #${inst.caseId}</strong>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Candidat : <strong>${inst.candidat}</strong> • Offre : <em>${inst.offre}</em>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-light);">Lancé le ${inst.dateLancement}</div>
        </div>
        <div>
          <span class="status-badge ${inst.statut === 'EN_COURS' ? 'status-acceptee' : 'status-en-cours'}">
            ${inst.etapeCourante}
          </span>
        </div>
      </div>

      <!-- Progression des étapes de l'instance -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
        ${inst.etapes.map((et, index) => {
          let stepBg = '#f1f5f9';
          let stepColor = '#64748b';
          let borderCol = '#e2e8f0';

          if (et.statut === 'TERMINÉ') {
            stepBg = '#dcfce7';
            stepColor = '#15803d';
            borderCol = '#86efac';
          } else if (et.statut === 'EN_COURS') {
            stepBg = '#fef3c7';
            stepColor = '#b45309';
            borderCol = '#fde68a';
          }

          return `
            <div style="padding: 0.4rem 0.75rem; border-radius: var(--radius-sm); background: ${stepBg}; color: ${stepColor}; border: 1px solid ${borderCol}; font-size: 0.75rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>${index + 1}. ${et.nom}</span>
              <strong style="font-size: 0.65rem;">(${et.statut})</strong>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 0.75rem; text-align: right;">
        <button class="btn btn-outline btn-sm" onclick="window.avancerEtapeBonita(${inst.caseId})">
          Simuler validation tâche Bonita ➔
        </button>
      </div>
    </div>
  `).join('');
}

window.avancerEtapeBonita = function(caseId) {
  const inst = bpmnCache?.instances?.find(i => i.caseId == caseId);
  if (!inst) return;

  const etapeEnCours = inst.etapes.find(e => e.statut === 'EN_COURS');
  if (etapeEnCours) {
    etapeEnCours.statut = 'TERMINÉ';
    const indexCourant = inst.etapes.indexOf(etapeEnCours);
    if (indexCourant + 1 < inst.etapes.length) {
      inst.etapes[indexCourant + 1].statut = 'EN_COURS';
      inst.etapeCourante = inst.etapes[indexCourant + 1].nom;
    } else {
      inst.statut = 'TERMINÉ';
      inst.etapeCourante = 'Processus Achévé';
    }
    afficherCases(bpmnCache.instances);
    showToast(`Tâche Bonita validée pour Case #${caseId}`, 'success');
  } else {
    showToast(`Toutes les étapes sont déjà franchies.`, 'info');
  }
};

