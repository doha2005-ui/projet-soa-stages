/**
 * frontend/pages/accueil/accueil.js
 * Membre 4 : Squelette Commun - Tableau de Bord & Point de Contrôle
 *
 * Présentation du projet SOA et "Point de contrôle rapide" (Hello check)
 * pour valider que chaque membre a bien branché ses services.
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall } from '../../shared/soap.js';
import { restCall, showToast } from '../../shared/api.js';

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Plateforme SOA : Gestion Intelligente des Stages</h2>
        <p class="page-subtitle">Architecture orientée services divisée par service (Équipe 2026-2027)</p>
      </div>
      <div>
        <span class="member-chip" style="font-size: 0.85rem; padding: 6px 14px;">Squelette & Coordination : Membre 4</span>
      </div>
    </div>

    <!-- Bannière Explicative du Principe -->
    <div class="card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white;">
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #fff;">
        🎯 Nouvelle Organisation du Front-end par Service
      </h3>
      <p style="font-size: 0.95rem; opacity: 0.95; line-height: 1.6; max-width: 900px;">
        Pour éviter les blocages d'intégration de fin de projet, chaque membre développe et teste directement
        les écrans correspondant à ses propres services. Les espaces utilisateur (Étudiant, Entreprise, Responsable)
        sont des vues filtrées du squelette commun fourni par le <strong>Membre 4</strong>.
      </p>
    </div>

    <!-- Point de contrôle rapide "Hello World" (Semaine 1) -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 class="card-title" style="margin: 0;">🧪 Point de Contrôle Rapide : Test d'Intégration "Hello"</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
            Testez la connectivité et la bonne intégration des modules de chaque membre en un clic.
          </p>
        </div>
        <button class="btn btn-outline btn-sm" id="btn-tester-tout">Tester Tous les Services</button>
      </div>

      <div class="grid grid-2" id="checklist-services">
        <!-- Carte Membre 1 -->
        <div class="card" style="background: var(--surface-alt); border-left: 4px solid #3b82f6;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="member-chip">Membre 1</span>
                <strong>Étudiants (SOAP) & Notifications (REST)</strong>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.4rem 0;">
                Dossiers : <code>frontend/pages/etudiants</code> & <code>notifications</code>
              </p>
            </div>
            <span class="status-badge status-acceptee" id="status-m1">Prêt</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <a href="#etudiants" class="btn btn-outline btn-sm">Ouvrir Étudiants</a>
            <a href="#notifications" class="btn btn-outline btn-sm">Ouvrir Notifications</a>
            <button class="btn btn-primary btn-sm" onclick="window.pingService('etudiants')">Ping SOAP</button>
          </div>
        </div>

        <!-- Carte Membre 2 -->
        <div class="card" style="background: var(--surface-alt); border-left: 4px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="member-chip">Membre 2</span>
                <strong>Entreprises (SOAP) & Suivi Stages (REST)</strong>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.4rem 0;">
                Dossiers : <code>frontend/pages/entreprises</code> & <code>stages</code>
              </p>
            </div>
            <span class="status-badge status-acceptee" id="status-m2">Prêt</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <a href="#entreprises" class="btn btn-outline btn-sm">Ouvrir Entreprises</a>
            <a href="#stages" class="btn btn-outline btn-sm">Ouvrir Stages</a>
            <button class="btn btn-primary btn-sm" onclick="window.pingService('entreprises')">Ping SOAP</button>
          </div>
        </div>

        <!-- Carte Membre 3 -->
        <div class="card" style="background: var(--surface-alt); border-left: 4px solid #f59e0b;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="member-chip">Membre 3</span>
                <strong>Offres (SOAP) & Candidatures (REST)</strong>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.4rem 0;">
                Dossiers : <code>frontend/pages/offres</code> & <code>candidatures</code>
              </p>
            </div>
            <span class="status-badge status-acceptee" id="status-m3">Prêt</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <a href="#offres" class="btn btn-outline btn-sm">Ouvrir Offres</a>
            <a href="#candidatures" class="btn btn-outline btn-sm">Ouvrir Candidatures</a>
            <button class="btn btn-primary btn-sm" onclick="window.pingService('offres')">Ping SOAP</button>
          </div>
        </div>

        <!-- Carte Membre 4 -->
        <div class="card" style="background: var(--surface-alt); border-left: 4px solid #8b5cf6;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="member-chip">Membre 4</span>
                <strong>Squelette Commun & Processus BPMN</strong>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.4rem 0;">
                Dossiers : <code>frontend/shared</code>, <code>index.html</code> & <code>bpmn</code>
              </p>
            </div>
            <span class="status-badge status-acceptee" id="status-m4">Prêt</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <a href="#bpmn" class="btn btn-outline btn-sm">Ouvrir BPMN Bonita</a>
            <button class="btn btn-primary btn-sm" onclick="window.pingService('bpmn')">Ping Bonita</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Récapitulatif de la matrice des protocoles -->
    <div class="card">
      <h3 class="card-title">Matrice Technique des Services</h3>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Protocole</th>
              <th>Membre</th>
              <th>URL Tomcat / Endpoint</th>
              <th>Dossier Frontend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Service 1 : Étudiants</strong></td>
              <td><span class="badge-type badge-soap">SOAP</span></td>
              <td><span class="member-chip">Membre 1</span></td>
              <td><code>/service1-etudiants-soap/EtudiantService</code></td>
              <td><code>pages/etudiants</code></td>
            </tr>
            <tr>
              <td><strong>Service 2 : Entreprises</strong></td>
              <td><span class="badge-type badge-soap">SOAP</span></td>
              <td><span class="member-chip">Membre 2</span></td>
              <td><code>/service2-entreprises-soap/EntrepriseService</code></td>
              <td><code>pages/entreprises</code></td>
            </tr>
            <tr>
              <td><strong>Service 3 : Offres</strong></td>
              <td><span class="badge-type badge-soap">SOAP</span></td>
              <td><span class="member-chip">Membre 3</span></td>
              <td><code>/service3-offres-soap/OffreService</code></td>
              <td><code>pages/offres</code></td>
            </tr>
            <tr>
              <td><strong>Service 4 : Candidatures</strong></td>
              <td><span class="badge-type badge-rest">REST</span></td>
              <td><span class="member-chip">Membre 3</span></td>
              <td><code>/service4-candidatures-rest/api/candidatures</code></td>
              <td><code>pages/candidatures</code></td>
            </tr>
            <tr>
              <td><strong>Service 5 : Notifications</strong></td>
              <td><span class="badge-type badge-rest">REST</span></td>
              <td><span class="member-chip">Membre 1</span></td>
              <td><code>/service5-notifications-rest/api/notifications</code></td>
              <td><code>pages/notifications</code></td>
            </tr>
            <tr>
              <td><strong>Service 6 : Suivi Stages</strong></td>
              <td><span class="badge-type badge-rest">REST</span></td>
              <td><span class="member-chip">Membre 2</span></td>
              <td><code>/service6-suivi-stages-rest/api/stages</code></td>
              <td><code>pages/stages</code></td>
            </tr>
            <tr>
              <td><strong>Orchestrateur Bonita</strong></td>
              <td><span class="badge-type badge-bpmn">BPMN REST</span></td>
              <td><span class="member-chip">Membre 4</span></td>
              <td><code>/bonita/API/bpm</code></td>
              <td><code>pages/bpmn</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-tester-tout').addEventListener('click', async () => {
    showToast('Vérification de tous les modules en cours...', 'info');
    await pingService('etudiants');
    await pingService('entreprises');
    await pingService('offres');
    await pingService('bpmn');
    showToast('Tous les modules répondent avec succès !', 'success');
  });
}

window.pingService = async function(serviceKey) {
  const s = CONFIG.services[serviceKey];
  if (!s) return;

  try {
    if (s.type === 'SOAP') {
      await soapCall({
        url: s.endpoint,
        operation: 'ping',
        mockFallback: s.mockFile
      });
    } else {
      await restCall(s.endpoint, { method: 'GET' }, s.mockFile);
    }
    showToast(`Connexion OK avec ${s.name} (${CONFIG.useMock ? 'Mode Mock' : 'Live Tomcat'})`, 'success');
  } catch (err) {
    showToast(`Erreur avec ${s.name}: ${err.message}`, 'error');
  }
};

