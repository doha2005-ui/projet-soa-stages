/**
 * frontend/shared/layout.js
 * Fourni par Membre 4 (Responsable Squelette Commun & BPMN)
 *
 * Gère le routage par hash (#...), le rechargement dynamique des pages
 * par service et le filtrage des menus selon le rôle actif
 * (Tous les services, Espace Étudiant, Espace Entreprise, Espace Responsable).
 */

import { CONFIG } from './config.js';
import { showToast } from './api.js';

// Table de correspondance des routes
const ROUTES = {
  accueil: {
    title: 'Accueil',
    modulePath: '../pages/accueil/accueil.js',
    roles: ['all', 'etudiant', 'entreprise', 'responsable'],
    icon: '🏠',
    badge: null
  },
  etudiants: {
    title: 'Étudiants',
    modulePath: '../pages/etudiants/etudiants.js',
    roles: ['all', 'etudiant', 'responsable'],
    icon: '🎓',
    badge: { label: 'SOAP 1', class: 'badge-soap' }
  },
  notifications: {
    title: 'Notifications',
    modulePath: '../pages/notifications/notifications.js',
    roles: ['all', 'etudiant', 'entreprise', 'responsable'],
    icon: '🔔',
    badge: { label: 'REST 5', class: 'badge-rest' }
  },
  entreprises: {
    title: 'Entreprises',
    modulePath: '../pages/entreprises/entreprises.js',
    roles: ['all', 'entreprise', 'responsable'],
    icon: '🏢',
    badge: { label: 'SOAP 2', class: 'badge-soap' }
  },
  stages: {
    title: 'Suivi des Stages',
    modulePath: '../pages/stages/stages.js',
    roles: ['all', 'etudiant', 'entreprise', 'responsable'],
    icon: '📋',
    badge: { label: 'REST 6', class: 'badge-rest' }
  },
  offres: {
    title: 'Offres de Stage',
    modulePath: '../pages/offres/offres.js',
    roles: ['all', 'etudiant', 'entreprise', 'responsable'],
    icon: '💼',
    badge: { label: 'SOAP 3', class: 'badge-soap' }
  },
  candidatures: {
    title: 'Candidatures',
    modulePath: '../pages/candidatures/candidatures.js',
    roles: ['all', 'etudiant', 'entreprise', 'responsable'],
    icon: '📄',
    badge: { label: 'REST 4', class: 'badge-rest' }
  },
  bpmn: {
    title: 'Processus BPMN',
    modulePath: '../pages/bpmn/bpmn.js',
    roles: ['all', 'responsable'],
    icon: '⚙️',
    badge: { label: 'BPMN', class: 'badge-bpmn' }
  }
};

export function initLayout() {
  setupMockToggle();
  setupRoleSelector();
  renderNavigation();

  window.addEventListener('hashchange', handleNavigation);
  handleNavigation();
}

/**
 * Configure l'interrupteur du mode Mock
 */
function setupMockToggle() {
  const toggle = document.getElementById('mock-toggle');
  const label = document.getElementById('mock-label');
  if (!toggle) return;

  toggle.checked = CONFIG.useMock;
  updateMockLabel(toggle.checked);

  toggle.addEventListener('change', (e) => {
    CONFIG.setMockMode(e.target.checked);
    updateMockLabel(e.target.checked);
    showToast(
      e.target.checked
        ? 'Mode Mock activé (Données JSON simulées)'
        : 'Mode Réel activé (Appel direct aux web services Tomcat)',
      'info'
    );
    // Rafraîchir la page active
    handleNavigation();
  });
}

function updateMockLabel(isMock) {
  const label = document.getElementById('mock-label');
  if (label) {
    label.textContent = isMock ? 'Données simulées (Mock)' : 'Services Tomcat (Live)';
    label.style.color = isMock ? 'var(--primary)' : 'var(--success)';
    label.style.fontWeight = '600';
  }
}

/**
 * Configure les boutons de sélection de rôle (Tous, Étudiant, Entreprise, Responsable)
 */
function setupRoleSelector() {
  const buttons = document.querySelectorAll('.role-btn');
  buttons.forEach(btn => {
    const role = btn.dataset.role;
    if (role === CONFIG.activeRole) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CONFIG.setActiveRole(role);
      renderNavigation();
      showToast(`Vue filtrée : ${btn.textContent}`, 'info');
    });
  });
}

/**
 * Génère dynamiquement les liens du menu selon le rôle actif
 */
export function renderNavigation() {
  const navContainer = document.getElementById('sidebar-nav');
  if (!navContainer) return;

  const currentRole = CONFIG.activeRole;
  const currentHash = (window.location.hash.slice(1) || 'accueil').toLowerCase();

  const linksHtml = Object.entries(ROUTES)
    .filter(([_, route]) => route.roles.includes(currentRole))
    .map(([key, route]) => {
      const isActive = currentHash === key;
      const badgeHtml = route.badge
        ? `<span class="badge-type ${route.badge.class}">${route.badge.label}</span>`
        : '';

      return `
        <li class="nav-item">
          <a href="#${key}" class="${isActive ? 'active' : ''}">
            <span>${route.icon}</span>
            <span>${route.title}</span>
            ${badgeHtml}
          </a>
        </li>
      `;
    })
    .join('');

  navContainer.innerHTML = linksHtml;
}

/**
 * Charge dynamiquement le module de la page ciblée par le hash
 */
async function handleNavigation() {
  const currentHash = (window.location.hash.slice(1) || 'accueil').toLowerCase();
  const route = ROUTES[currentHash] || ROUTES.accueil;

  // Mise à jour de l'état actif dans la barre latérale
  document.querySelectorAll('.nav-item a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#${currentHash}`) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  const contentArea = document.getElementById('app-main');
  if (!contentArea) return;

  contentArea.innerHTML = `
    <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">Chargement du module ${route.title}...</div>
      <div style="font-size: 0.85rem;">Source : <code>${route.modulePath}</code></div>
    </div>
  `;

  try {
    const module = await import(route.modulePath);
    if (typeof module.render === 'function') {
      await module.render(contentArea);
    } else {
      contentArea.innerHTML = `<div class="card">Erreur : Le module <code>${route.modulePath}</code> n'exporte pas de fonction <code>render()</code>.</div>`;
    }
  } catch (err) {
    console.error(`Erreur chargement page ${route.title}:`, err);
    contentArea.innerHTML = `
      <div class="card" style="border-left: 4px solid var(--danger);">
        <h3 style="color: var(--danger); margin-bottom: 0.5rem;">Erreur de chargement du module</h3>
        <p>Impossible de charger <code>${route.modulePath}</code>.</p>
        <pre style="background: #fee2e2; padding: 1rem; border-radius: var(--radius-sm); margin-top: 1rem; font-size: 0.85rem;">${err.stack || err.message}</pre>
      </div>
    `;
  }
}

