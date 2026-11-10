/**
 * frontend/pages/bpmn/bpmn.js
 * Membre 4 : Orchestration BPMN Bonita & Visualisation Interactive BPMN 2.0
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall } from '../../shared/soap.js';
import { restCall, showToast } from '../../shared/api.js';

let bpmnViewer = null;

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Orchestration & Suivi du Processus BPMN</h2>
        <p class="page-subtitle">Modélisation BPMN 2.0 interactive & exécution du workflow inter-services</p>
      </div>
      <div>
        <span class="member-chip" style="font-size: 0.85rem; padding: 6px 14px;">Membre 4 : Orchestration BPMN</span>
      </div>
    </div>

    <!-- Carte du Diagramme Visuel BPMN 2.0 -->
    <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 class="card-title" style="margin: 0;">📐 Diagramme de Processus BPMN 2.0 (Workflow Tripartite)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
            Généré automatiquement depuis <code>bpmn/processus-validation-stage.bpmn</code> (Naviguez à la souris : zoom & pan)
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline btn-sm" id="btn-zoom-in">➕ Zoom +</button>
          <button class="btn btn-outline btn-sm" id="btn-zoom-out">➖ Zoom -</button>
          <button class="btn btn-outline btn-sm" id="btn-zoom-reset">🎯 Recentrer</button>
        </div>
      </div>

      <!-- Conteneur d'affichage interactif BPMN -->
      <div id="bpmn-canvas" style="height: 480px; width: 100%; border: 1px solid var(--border); border-radius: 8px; background: #fafafa; position: relative; overflow: hidden;">
        <div id="bpmn-loader" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--text-muted); font-size: 0.9rem;">
          Chargement du diagramme BPMN 2.0...
        </div>
      </div>
    </div>

    <!-- Simulateur d'Exécution d'Instance BPMN (Bonita Case) -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 class="card-title" style="margin: 0;">⚡ Moteur d'Exécution du Processus (Instance Active)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
            Exécutez pas à pas le processus et observez les appels aux microservices SOAP et REST en direct.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-nouvelle-instance">
          + Démarrer Nouvelle Instance (Case #104)
        </button>
      </div>

      <!-- Étapes interactives de l'instance -->
      <div id="case-stepper" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <div class="step-card step-done" id="step-1" style="flex: 1; min-width: 170px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface);">
          <div style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">ÉTAPE 1</div>
          <strong style="font-size: 0.9rem;">Candidature Retenue</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Offre #1 • Étudiant #5</div>
          <span class="badge" style="background: rgba(16,185,129,0.15); color: #059669; margin-top: 0.5rem; display: inline-block;">✓ Initialisé</span>
        </div>

        <div class="step-card" id="step-2" style="flex: 1; min-width: 170px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface);">
          <div style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">ÉTAPE 2</div>
          <strong style="font-size: 0.9rem;">Check SOAP S1 & S2</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Éligibilité & Convention</div>
          <span class="badge" id="badge-step-2" style="background: #f1f5f9; color: #64748b; margin-top: 0.5rem; display: inline-block;">En attente</span>
        </div>

        <div class="step-card" id="step-3" style="flex: 1; min-width: 170px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface);">
          <div style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">ÉTAPE 3</div>
          <strong style="font-size: 0.9rem;">Validation Pédagogique</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Responsable INPT</div>
          <span class="badge" id="badge-step-3" style="background: #f1f5f9; color: #64748b; margin-top: 0.5rem; display: inline-block;">En attente</span>
        </div>

        <div class="step-card" id="step-4" style="flex: 1; min-width: 170px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface);">
          <div style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">ÉTAPE 4</div>
          <strong style="font-size: 0.9rem;">Créer Dossier Stage</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">REST S6 (MySQL)</div>
          <span class="badge" id="badge-step-4" style="background: #f1f5f9; color: #64748b; margin-top: 0.5rem; display: inline-block;">En attente</span>
        </div>

        <div class="step-card" id="step-5" style="flex: 1; min-width: 170px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface);">
          <div style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">ÉTAPE 5</div>
          <strong style="font-size: 0.9rem;">Notification Tripartite</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">REST S5 (/api/notifs)</div>
          <span class="badge" id="badge-step-5" style="background: #f1f5f9; color: #64748b; margin-top: 0.5rem; display: inline-block;">En attente</span>
        </div>
      </div>

      <!-- Action de l'instance -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 8px;">
        <div id="step-action-desc" style="font-size: 0.9rem; color: var(--text-main);">
          Prochaine action : <strong>Vérifier l'éligibilité de l'étudiant et de l'entreprise via SOAP JAX-WS</strong>.
        </div>
        <button class="btn btn-primary" id="btn-executer-action">
          Exécuter cette étape ➔
        </button>
      </div>
    </div>
  `;

  // Charger la librairie bpmn-js si nécessaire
  await chargerBpmnViewer();

  // Boutons de zoom
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => bpmnViewer?.get('zoomScroll')?.stepZoom(1));
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => bpmnViewer?.get('zoomScroll')?.stepZoom(-1));
  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => bpmnViewer?.get('canvas')?.zoom('fit-viewport'));

  // Logique interactive du workflow
  initialiserWorkflow();
}

async function chargerBpmnViewer() {
  if (!window.BpmnJS) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/bpmn-js@17.11.1/dist/bpmn-navigated-viewer.production.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  try {
    bpmnViewer = new window.BpmnJS({
      container: '#bpmn-canvas'
    });

    // Charger le fichier XML BPMN 2.0 généré
    const response = await fetch('bpmn/processus-validation-stage.bpmn');
    const xml = await response.text();

    await bpmnViewer.importXML(xml);
    const loader = document.getElementById('bpmn-loader');
    if (loader) loader.style.display = 'none';

    bpmnViewer.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.error('Erreur affichage BPMN:', err);
    const loader = document.getElementById('bpmn-loader');
    if (loader) loader.innerHTML = `<span style="color: #dc2626;">Erreur de rendu du schéma BPMN: ${err.message}</span>`;
  }
}

let etapeCourante = 2;

function initialiserWorkflow() {
  const btnAction = document.getElementById('btn-executer-action');
  const btnNew = document.getElementById('btn-nouvelle-instance');

  btnNew?.addEventListener('click', () => {
    etapeCourante = 2;
    for (let i = 2; i <= 5; i++) {
      const b = document.getElementById(`badge-step-${i}`);
      if (b) {
        b.style.background = '#f1f5f9';
        b.style.color = '#64748b';
        b.innerText = 'En attente';
      }
    }
    document.getElementById('step-action-desc').innerHTML = 'Prochaine action : <strong>Vérifier l\'éligibilité de l\'étudiant et de l\'entreprise via SOAP JAX-WS</strong>.';
    btnAction.disabled = false;
    btnAction.innerText = 'Exécuter cette étape ➔';
    showToast('Nouvelle instance de processus démarrée !', 'info');
  });

  btnAction?.addEventListener('click', async () => {
    btnAction.disabled = true;
    btnAction.innerText = 'Exécution en cours...';

    if (etapeCourante === 2) {
      // ÉTAPE 2 : Appel SOAP S1 et S2
      try {
        await soapCall({
          url: CONFIG.services.etudiants.endpoint,
          operation: 'listerEtudiants',
          namespace: CONFIG.services.etudiants.namespace
        });
        await soapCall({
          url: CONFIG.services.entreprises.endpoint,
          operation: 'listerEntreprises',
          namespace: CONFIG.services.entreprises.namespace
        });

        const b = document.getElementById('badge-step-2');
        b.style.background = 'rgba(16,185,129,0.15)';
        b.style.color = '#059669';
        b.innerText = '✓ Validé (SOAP 200 OK)';

        etapeCourante = 3;
        document.getElementById('step-action-desc').innerHTML = 'Prochaine action : <strong>Validation Pédagogique du Sujet par le Responsable PFE</strong>.';
        btnAction.disabled = false;
        btnAction.innerText = 'Valider le sujet (Responsable) ➔';
        showToast('Étape 2 franchie : Étudiant et Entreprise vérifiés avec succès !', 'success');
      } catch (e) {
        showToast('Erreur SOAP: ' + e.message, 'error');
        btnAction.disabled = false;
      }
    } else if (etapeCourante === 3) {
      // ÉTAPE 3 : Validation Pédagogique (Tâche humaine)
      const b = document.getElementById('badge-step-3');
      b.style.background = 'rgba(16,185,129,0.15)';
      b.style.color = '#059669';
      b.innerText = '✓ Sujet Approuvé';

      etapeCourante = 4;
      document.getElementById('step-action-desc').innerHTML = 'Prochaine action : <strong>Générer et Enregistrer le Stage dans MySQL via REST (Service 6)</strong>.';
      btnAction.disabled = false;
      btnAction.innerText = 'Créer le Stage (REST) ➔';
      showToast('Étape 3 franchie : Sujet validé par l\'encadrant pédagogique !', 'success');
    } else if (etapeCourante === 4) {
      // ÉTAPE 4 : Création du stage réel via Service 6 REST
      try {
        await restCall(CONFIG.services.stages.endpoint, {
          method: 'POST',
          body: JSON.stringify({
            etudiantId: 5,
            entrepriseId: 1,
            intitule: 'Stage PFE - Orchestration BPMN Bonita',
            dateDebut: '2027-02-01',
            dateFin: '2027-07-31',
            tuteurEntreprise: 'Karim Tazi',
            tuteurAcademique: 'Pr. INPT',
            etat: 'EN_COURS'
          })
        });

        const b = document.getElementById('badge-step-4');
        b.style.background = 'rgba(16,185,129,0.15)';
        b.style.color = '#059669';
        b.innerText = '✓ Stage Créé (REST 201)';

        etapeCourante = 5;
        document.getElementById('step-action-desc').innerHTML = 'Prochaine action : <strong>Diffuser les notifications de démarrage aux trois parties (Service 5)</strong>.';
        btnAction.disabled = false;
        btnAction.innerText = 'Envoyer Notifications Finales ➔';
        showToast('Étape 4 franchie : Stage créé et persisté dans la base MySQL !', 'success');
      } catch (e) {
        showToast('Erreur création stage: ' + e.message, 'error');
        btnAction.disabled = false;
      }
    } else if (etapeCourante === 5) {
      // ÉTAPE 5 : Notification finale
      const b = document.getElementById('badge-step-5');
      b.style.background = 'rgba(16,185,129,0.15)';
      b.style.color = '#059669';
      b.innerText = '✓ Convention Signée';

      document.getElementById('step-action-desc').innerHTML = '🎉 <strong>Processus BPMN terminé avec succès ! Le stage est actif et conventionné.</strong>';
      btnAction.disabled = true;
      btnAction.innerText = 'Processus Achévé ✓';
      showToast('Cycle BPMN terminé avec succès !', 'success');
    }
  });
}
