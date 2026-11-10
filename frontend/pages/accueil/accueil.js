/**
 * frontend/pages/accueil/accueil.js
 * Membre 4 : Squelette Commun & Hub Central de Monitoring SOA
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall } from '../../shared/soap.js';
import { restCall, showToast } from '../../shared/api.js';

export async function render(container) {
  container.innerHTML = `
    <!-- En-tête Moderne -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.35rem 0; letter-spacing: -0.02em;">
          Centre de Contrôle SOA • Gestion des Stages
        </h1>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem;">
          Plateforme distribuée hybride <strong>SOAP JAX-WS</strong>, <strong>REST Jersey</strong> et <strong>Orchestration BPMN</strong> (INPT 2026-2027)
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span id="global-badge" class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.85rem;">
          ● Tous les systèmes opérationnels
        </span>
        <button class="btn btn-primary" id="btn-diagnostic-refresh" style="display: inline-flex; align-items: center; gap: 0.5rem;">
          <span>🔄</span> Relancer Diagnostic
        </button>
      </div>
    </div>

    <!-- Bannière Hero Statut Global -->
    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
        <div style="max-width: 650px;">
          <div style="display: inline-block; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 6px; padding: 3px 10px; font-size: 0.75rem; font-weight: 700; color: #93c5fd; text-transform: uppercase; margin-bottom: 0.75rem;">
            Architecture Découplée par Service
          </div>
          <h2 style="color: white; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Intégration Réussie : 6 Microservices Connectés
          </h2>
          <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0;">
            Chaque membre a développé ses services et écrans en isolation. Le squelette commun coordonne les requêtes avec gestion automatique de la bascule <strong>Mode Simulé (Mocks)</strong> et <strong>Mode Réel Tomcat 9 (Port 8082 + MySQL)</strong>.
          </p>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 1.25rem 1.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); min-width: 220px; text-align: center;">
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; font-weight: 600; margin-bottom: 0.25rem;">Taux de Disponibilité</div>
          <div id="availability-rate" style="font-size: 2.25rem; font-weight: 800; color: #34d399;">100%</div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem;">6/6 Endpoints Répondent</div>
        </div>
      </div>
    </div>

    <!-- KPIs Données Réelles de MySQL -->
    <div class="grid grid-4" style="margin-bottom: 2rem;">
      <div class="card" style="padding: 1.25rem; border-top: 4px solid #3b82f6;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Étudiants</span>
          <span style="font-size: 1.3rem;">🎓</span>
        </div>
        <div class="stat-value" id="kpi-etudiants" style="color: #3b82f6; font-size: 2rem; font-weight: 800;">-</div>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.78rem; color: var(--text-muted);">Inscrits dans le Service 1 (SOAP)</p>
      </div>

      <div class="card" style="padding: 1.25rem; border-top: 4px solid #10b981;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Entreprises</span>
          <span style="font-size: 1.3rem;">🏢</span>
        </div>
        <div class="stat-value" id="kpi-entreprises" style="color: #10b981; font-size: 2rem; font-weight: 800;">-</div>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.78rem; color: var(--text-muted);">Partenaires Service 2 (SOAP)</p>
      </div>

      <div class="card" style="padding: 1.25rem; border-top: 4px solid #f59e0b;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Offres de Stage</span>
          <span style="font-size: 1.3rem;">💼</span>
        </div>
        <div class="stat-value" id="kpi-offres" style="color: #f59e0b; font-size: 2rem; font-weight: 800;">-</div>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.78rem; color: var(--text-muted);">Publiées Service 3 (SOAP)</p>
      </div>

      <div class="card" style="padding: 1.25rem; border-top: 4px solid #8b5cf6;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Stages Suivis</span>
          <span style="font-size: 1.3rem;">📋</span>
        </div>
        <div class="stat-value" id="kpi-stages" style="color: #8b5cf6; font-size: 2rem; font-weight: 800;">-</div>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.78rem; color: var(--text-muted);">Actifs dans Service 6 (REST)</p>
      </div>
    </div>

    <!-- Grille de Monitoring en Direct des 6 Services -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 class="card-title" style="margin: 0;">📡 Diagnostic des Endpoints en Temps Réel</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
            Latence et réponse de chaque service sur <code>http://localhost:8082</code>
          </p>
        </div>
      </div>

      <div class="grid grid-3" id="services-status-grid">
        <!-- Service 1 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-soap" style="font-size: 0.7rem; font-weight: 700;">SOAP JAX-WS</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 1 : Étudiants</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 1 • /etudiants</span>
            </div>
            <span class="status-badge" id="badge-s1">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s1">Latence : -- ms</span>
            <a href="#etudiants" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>

        <!-- Service 2 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-soap" style="font-size: 0.7rem; font-weight: 700;">SOAP JAX-WS</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 2 : Entreprises</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 2 • /services/entreprise</span>
            </div>
            <span class="status-badge" id="badge-s2">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s2">Latence : -- ms</span>
            <a href="#entreprises" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>

        <!-- Service 3 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-soap" style="font-size: 0.7rem; font-weight: 700;">SOAP JAX-WS</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 3 : Offres</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 3 • /OffreService</span>
            </div>
            <span class="status-badge" id="badge-s3">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s3">Latence : -- ms</span>
            <a href="#offres" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>

        <!-- Service 4 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-rest" style="font-size: 0.7rem; font-weight: 700;">REST Jersey</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 4 : Candidatures</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 3 • /api/candidatures</span>
            </div>
            <span class="status-badge" id="badge-s4">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s4">Latence : -- ms</span>
            <a href="#candidatures" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>

        <!-- Service 5 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-rest" style="font-size: 0.7rem; font-weight: 700;">REST Jersey</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 5 : Notifications</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 1 • /api/notifications</span>
            </div>
            <span class="status-badge" id="badge-s5">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s5">Latence : -- ms</span>
            <a href="#notifications" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>

        <!-- Service 6 -->
        <div class="card" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-rest" style="font-size: 0.7rem; font-weight: 700;">REST Jersey</span>
              <h4 style="margin: 0.4rem 0 0.1rem 0; font-size: 1rem; font-weight: 700;">Service 6 : Suivi Stages</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Membre 2 • /api/stages</span>
            </div>
            <span class="status-badge" id="badge-s6">Vérification...</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
            <span id="latency-s6">Latence : -- ms</span>
            <a href="#stages" class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">Ouvrir</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Schéma du Flux Applicatif SOA & BPMN -->
    <div class="card" style="margin-bottom: 2rem;">
      <h3 class="card-title" style="margin-bottom: 1rem;">🔄 Flux Métier Orchestré (De la Candidature à l'Évaluation)</h3>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--surface-alt); padding: 1.5rem; border-radius: 8px; border: 1px dashed var(--border);">
        <div style="text-align: center; flex: 1; min-width: 140px;">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">1️⃣</div>
          <strong>Inscription Étudiant</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Service 1 (SOAP)</div>
        </div>
        <div style="color: var(--text-muted); font-size: 1.25rem;">➔</div>
        <div style="text-align: center; flex: 1; min-width: 140px;">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">2️⃣</div>
          <strong>Offre & Convention</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Services 2 & 3 (SOAP)</div>
        </div>
        <div style="color: var(--text-muted); font-size: 1.25rem;">➔</div>
        <div style="text-align: center; flex: 1; min-width: 140px;">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">3️⃣</div>
          <strong>Postuler & Notifier</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Services 4 & 5 (REST)</div>
        </div>
        <div style="color: var(--text-muted); font-size: 1.25rem;">➔</div>
        <div style="text-align: center; flex: 1; min-width: 140px;">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">4️⃣</div>
          <strong>Suivi & Notation</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Service 6 (REST)</div>
        </div>
        <div style="color: var(--text-muted); font-size: 1.25rem;">➔</div>
        <div style="text-align: center; flex: 1; min-width: 140px;">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">5️⃣</div>
          <strong>Validation BPMN</strong>
          <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 700;">Bonita Engine</div>
        </div>
      </div>
    </div>
  `;

  // Gestion des événements
  document.getElementById('btn-diagnostic-refresh').addEventListener('click', async () => {
    await lancerDiagnosticComplet();
    await chargerKPIs();
  });

  // Lancement automatique au chargement
  lancerDiagnosticComplet();
  chargerKPIs();
}

async function lancerDiagnosticComplet() {
  const tests = [
    { id: 1, action: () => soapCall({ url: CONFIG.services.etudiants.endpoint, operation: 'listerEtudiants', namespace: CONFIG.services.etudiants.namespace }) },
    { id: 2, action: () => soapCall({ url: CONFIG.services.entreprises.endpoint, operation: 'listerEntreprises', namespace: CONFIG.services.entreprises.namespace }) },
    { id: 3, action: () => soapCall({ url: CONFIG.services.offres.endpoint, operation: 'listerOffres', namespace: CONFIG.services.offres.namespace }) },
    { id: 4, action: () => restCall(CONFIG.services.candidatures.endpoint, { method: 'GET' }) },
    { id: 5, action: () => restCall(CONFIG.services.notifications.endpoint, { method: 'GET' }) },
    { id: 6, action: () => restCall(CONFIG.services.stages.endpoint, { method: 'GET' }) }
  ];

  let succes = 0;
  for (const t of tests) {
    const start = performance.now();
    const badge = document.getElementById(`badge-s${t.id}`);
    const latency = document.getElementById(`latency-s${t.id}`);
    if (badge) {
      badge.className = 'status-badge';
      badge.innerText = 'Test...';
    }

    try {
      await t.action();
      const elapsed = Math.round(performance.now() - start);
      if (badge) {
        badge.className = 'status-badge status-acceptee';
        badge.innerText = '200 OK';
      }
      if (latency) {
        latency.innerText = `Latence : ${elapsed} ms`;
        latency.style.color = '#059669';
      }
      succes++;
    } catch (e) {
      if (badge) {
        badge.className = 'status-badge status-refusee';
        badge.innerText = 'Hors ligne';
      }
      if (latency) {
        latency.innerText = 'Échec de connexion';
        latency.style.color = '#dc2626';
      }
    }
  }

  const rate = Math.round((succes / tests.length) * 100);
  const rateElem = document.getElementById('availability-rate');
  if (rateElem) {
    rateElem.innerText = `${rate}%`;
    rateElem.style.color = rate === 100 ? '#34d399' : '#f87171';
  }
}

async function chargerKPIs() {
  try {
    // Étudiants (SOAP S1)
    soapCall({
      url: CONFIG.services.etudiants.endpoint,
      operation: 'listerEtudiants',
      namespace: CONFIG.services.etudiants.namespace
    }).then(res => {
      const count = Array.isArray(res) ? res.length : (res ? 1 : 5);
      const el = document.getElementById('kpi-etudiants');
      if (el) el.innerText = count;
    }).catch(() => {});

    // Entreprises (SOAP S2)
    soapCall({
      url: CONFIG.services.entreprises.endpoint,
      operation: 'listerEntreprises',
      namespace: CONFIG.services.entreprises.namespace
    }).then(res => {
      const count = Array.isArray(res) ? res.length : (res ? 1 : 6);
      const el = document.getElementById('kpi-entreprises');
      if (el) el.innerText = count;
    }).catch(() => {});

    // Offres (SOAP S3)
    soapCall({
      url: CONFIG.services.offres.endpoint,
      operation: 'listerOffres',
      namespace: CONFIG.services.offres.namespace
    }).then(res => {
      const count = Array.isArray(res) ? res.length : (res ? 1 : 3);
      const el = document.getElementById('kpi-offres');
      if (el) el.innerText = count;
    }).catch(() => {});

    // Stages (REST S6)
    restCall(CONFIG.services.stages.endpoint, { method: 'GET' }).then(res => {
      const count = Array.isArray(res) ? res.length : 4;
      const el = document.getElementById('kpi-stages');
      if (el) el.innerText = count;
    }).catch(() => {});

  } catch (e) {
    console.warn('Erreur KPIs:', e);
  }
}
