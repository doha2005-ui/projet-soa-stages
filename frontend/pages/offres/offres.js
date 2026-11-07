/**
 * frontend/pages/offres/offres.js
 * Membre 3 : Service 3 Offres (SOAP JAX-WS)
 * Pages : offres (liste, création, modification)
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall, getXmlNodeText } from '../../shared/soap.js';
import { showToast } from '../../shared/api.js';

let offresCache = [];

export async function render(container) {
  const currentRole = CONFIG.activeRole;
  const canPublishOffre = currentRole === 'all' || currentRole === 'entreprise';

  const roleMetaHtml = currentRole === 'all'
    ? `<span class="member-chip">Membre 3</span>
       <span class="badge-type badge-soap">SOAP JAX-WS</span>
       <span class="text-muted" style="font-size: 0.8rem;">Service 3: <code>${CONFIG.services.offres.endpoint}</code></span>`
    : `<span class="member-chip" style="background: #e0f2fe; color: #0369a1;">Vue : ${currentRole === 'etudiant' ? 'Espace Étudiant (Consultation & Postulation)' : currentRole === 'entreprise' ? 'Espace Entreprise (Publication & Gestion)' : 'Espace Responsable (Supervision)'}</span>`;

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Offres de Stages</h2>
        <p class="page-subtitle">Catalogue des stages PFE et d'application proposés par nos partenaires</p>
        <div class="page-meta">
          ${roleMetaHtml}
        </div>
      </div>
      <div>
        ${canPublishOffre ? `<button class="btn btn-primary" id="btn-nouvelle-offre">+ Déposer une Offre</button>` : ''}
      </div>
    </div>

    <!-- Barre de recherche et filtre -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <input type="text" id="offre-search" class="form-input" placeholder="Rechercher par titre, compétences, entreprise..." style="max-width: 350px;">
        <select id="offre-type-filter" class="form-select" style="max-width: 200px;">
          <option value="ALL">Tous les types de stages</option>
          <option value="PFE">PFE (Projet Fin d'Études)</option>
          <option value="Technique">Stage Technique / Ouvrier</option>
        </select>
        <span class="text-muted" style="font-size: 0.85rem;" id="offres-count"></span>
      </div>
    </div>

    <!-- Liste des cartes d'offres -->
    <div class="grid grid-2" id="offres-list">
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">
        Chargement des offres...
      </div>
    </div>

    <!-- Modal Création / Édition Offre -->
    <div id="offre-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="offre-modal-title">Déposer une Offre</h3>
          <button class="close-btn" id="offre-close-btn">&times;</button>
        </div>
        <form id="offre-form">
          <input type="hidden" id="form-offre-id">
          <div class="form-group">
            <label class="form-label">Intitulé du Sujet / Titre</label>
            <input type="text" id="form-offre-titre" class="form-input" required placeholder="Ex: Stage PFE Microservices & Cloud">
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Nom de l'Entreprise</label>
              <input type="text" id="form-offre-ent" class="form-input" required placeholder="Ex: TechSolutions Maroc">
            </div>
            <div class="form-group">
              <label class="form-label">Type de Stage</label>
              <select id="form-offre-type" class="form-select" required>
                <option value="PFE (Projet de Fin d'Études)">PFE (Projet de Fin d'Études)</option>
                <option value="Stage Technique (2ème année)">Stage Technique (2ème année)</option>
                <option value="Stage d'Initiation">Stage d'Initiation</option>
              </select>
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Lieu</label>
              <input type="text" id="form-offre-lieu" class="form-input" required placeholder="Ex: Casablanca / Télétravail">
            </div>
            <div class="form-group">
              <label class="form-label">Durée & Rémunération</label>
              <input type="text" id="form-offre-remun" class="form-input" placeholder="Ex: 6 mois - 4500 DH/mois">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Compétences et Technologies requises</label>
            <input type="text" id="form-offre-skills" class="form-input" placeholder="Ex: Java, Spring Boot, React, Docker">
          </div>
          <div class="form-group">
            <label class="form-label">Descriptif détaillé de la mission</label>
            <textarea id="form-offre-desc" class="form-textarea" rows="4" required placeholder="Contexte, objectifs du stage, tâches..."></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="offre-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Publier l'Offre (SOAP)</button>
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
  document.getElementById('offre-close-btn').addEventListener('click', fermerModal);
  document.getElementById('offre-cancel-btn').addEventListener('click', fermerModal);

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
      offresCache = result;
    } else if (result?.xmlDoc) {
      const nodes = result.xmlDoc.querySelectorAll('return, offre');
      offresCache = Array.from(nodes).map(node => ({
        id: getXmlNodeText(node, 'id'),
        titre: getXmlNodeText(node, 'titre'),
        entrepriseNom: getXmlNodeText(node, 'entrepriseNom'),
        lieu: getXmlNodeText(node, 'lieu'),
        type: getXmlNodeText(node, 'type'),
        duree: getXmlNodeText(node, 'duree'),
        remuneration: getXmlNodeText(node, 'remuneration'),
        competences: getXmlNodeText(node, 'competences'),
        description: getXmlNodeText(node, 'description'),
        datePublication: getXmlNodeText(node, 'datePublication'),
        active: getXmlNodeText(node, 'active') !== 'false'
      }));
    }

    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur chargement offres: ${err.message}`, 'error');
  }
}

function appliquerFiltres() {
  const q = document.getElementById('offre-search').value.toLowerCase().trim();
  const typeFilter = document.getElementById('offre-type-filter').value;

  const resultats = offresCache.filter(offre => {
    const matchText = (offre.titre + ' ' + offre.entrepriseNom + ' ' + (offre.competences || '')).toLowerCase().includes(q);
    const matchType = typeFilter === 'ALL' || (offre.type && offre.type.includes(typeFilter));
    return matchText && matchType;
  });

  afficherOffres(resultats);
}

function afficherOffres(liste) {
  const container = document.getElementById('offres-list');
  const countEl = document.getElementById('offres-count');
  if (!container) return;

  countEl.textContent = `${liste.length} offre(s)`;

  if (liste.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Aucune offre correspondante.</div>`;
    return;
  }

  container.innerHTML = liste.map(offre => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin: 0;">${offre.titre}</h3>
          <span class="member-chip" style="font-size: 0.7rem; white-space: nowrap;">${offre.type}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">
          🏢 ${offre.entrepriseNom} • 📍 ${offre.lieu}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
          ${offre.description}
        </p>
        <div style="background: var(--surface-alt); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; font-size: 0.8rem; margin-bottom: 0.75rem;">
          <strong>Compétences :</strong> ${offre.competences || 'Non spécifié'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-light);">
          ⏳ ${offre.duree || 'Durée conventionnée'} | 💰 ${offre.remuneration || 'Gratification selon profil'}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
        ${(CONFIG.activeRole === 'all' || CONFIG.activeRole === 'entreprise') ? `<button class="btn btn-outline btn-sm" onclick="window.editerOffre(${offre.id})">Modifier</button>` : '<span></span>'}
        ${(CONFIG.activeRole === 'all' || CONFIG.activeRole === 'etudiant') ? `
        <a href="#candidatures" class="btn btn-primary btn-sm" onclick="window.postulerAOffre(${offre.id}, '${escapeHtml(offre.titre)}')">
          Postuler à cette offre →
        </a>` : `<span style="font-size: 0.8rem; color: var(--text-muted);">Consultation</span>`}
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  return (text || '').replace(/'/g, "\\'");
}

function ouvrirModal(offre = null) {
  const modal = document.getElementById('offre-modal');
  const title = document.getElementById('offre-modal-title');

  if (offre) {
    title.textContent = `Modifier Offre : ${offre.titre}`;
    document.getElementById('form-offre-id').value = offre.id;
    document.getElementById('form-offre-titre').value = offre.titre;
    document.getElementById('form-offre-ent').value = offre.entrepriseNom;
    document.getElementById('form-offre-type').value = offre.type;
    document.getElementById('form-offre-lieu').value = offre.lieu;
    document.getElementById('form-offre-remun').value = `${offre.duree} - ${offre.remuneration}`;
    document.getElementById('form-offre-skills').value = offre.competences || '';
    document.getElementById('form-offre-desc').value = offre.description;
  } else {
    title.textContent = "Déposer une Offre de Stage";
    document.getElementById('offre-form').reset();
    document.getElementById('form-offre-id').value = '';
  }

  modal.style.display = 'flex';
}

function fermerModal() {
  document.getElementById('offre-modal').style.display = 'none';
}

async function sauvegarderOffre() {
  const id = document.getElementById('form-offre-id').value;
  const offreData = {
    id: id ? parseInt(id, 10) : Date.now(),
    titre: document.getElementById('form-offre-titre').value,
    entrepriseNom: document.getElementById('form-offre-ent').value,
    type: document.getElementById('form-offre-type').value,
    lieu: document.getElementById('form-offre-lieu').value,
    duree: "6 mois",
    remuneration: document.getElementById('form-offre-remun').value || "Indemnité de stage",
    competences: document.getElementById('form-offre-skills').value,
    description: document.getElementById('form-offre-desc').value,
    datePublication: new Date().toISOString().split('T')[0],
    active: true
  };

  try {
    const serviceInfo = CONFIG.services.offres;
    const bodyXml = `
      <offre>
        ${id ? `<id>${id}</id>` : ''}
        <titre>${offreData.titre}</titre>
        <entrepriseNom>${offreData.entrepriseNom}</entrepriseNom>
        <type>${offreData.type}</type>
        <lieu>${offreData.lieu}</lieu>
        <competences>${offreData.competences}</competences>
        <description>${offreData.description}</description>
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
          if (idx !== -1) offresCache[idx] = offreData;
        } else {
          offresCache.unshift(offreData);
        }
        return { success: true };
      }
    });

    showToast('Offre enregistrée avec succès !', 'success');
    fermerModal();
    appliquerFiltres();
  } catch (err) {
    showToast(`Erreur enregistrement offre: ${err.message}`, 'error');
  }
}

window.editerOffre = function(id) {
  const offre = offresCache.find(o => o.id == id);
  if (offre) ouvrirModal(offre);
};

window.postulerAOffre = function(id, titre) {
  sessionStorage.setItem('candidature_preselected_offre_id', id);
  sessionStorage.setItem('candidature_preselected_offre_titre', titre);
};

