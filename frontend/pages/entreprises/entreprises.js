/**
 * frontend/pages/entreprises/entreprises.js
 * Membre 2 : Service 2 Entreprises (SOAP JAX-WS)
 * Pages : entreprises (fiche, liste, modification)
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall, getXmlNodeText } from '../../shared/soap.js';
import { showToast } from '../../shared/api.js';

let entreprisesCache = [];

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Entreprises Partenaires</h2>
        <p class="page-subtitle">Annuaire, conventions et fiches détaillées des entreprises d'accueil</p>
        <div class="page-meta">
          <span class="member-chip">Membre 2</span>
          <span class="badge-type badge-soap">SOAP JAX-WS</span>
          <span class="text-muted" style="font-size: 0.8rem;">Service 2: <code>${CONFIG.services.entreprises.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-nouvelle-entreprise">+ Nouvelle Entreprise</button>
      </div>
    </div>

    <!-- Filtres & Stats -->
    <div class="grid grid-3" style="margin-bottom: 1.5rem;">
      <div class="stat-card">
        <div class="stat-val" id="stat-total-ent">0</div>
        <div class="stat-label">Entreprises référencées</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" id="stat-conv-ent" style="color: var(--success);">0</div>
        <div class="stat-label">Conventions actives</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" id="stat-offres-ent" style="color: var(--info);">0</div>
        <div class="stat-label">Offres de stage publiées</div>
      </div>
    </div>

    <!-- Liste sous forme de cartes d'entreprises -->
    <div class="grid grid-3" id="entreprises-cards">
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
        Chargement des entreprises...
      </div>
    </div>

    <!-- Modal Fiche / Nouvelle Entreprise -->
    <div id="entreprise-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="ent-modal-title">Fiche Entreprise</h3>
          <button class="close-btn" id="ent-close-btn">&times;</button>
        </div>
        <form id="entreprise-form">
          <input type="hidden" id="form-ent-id">
          <div class="form-group">
            <label class="form-label">Raison Sociale</label>
            <input type="text" id="form-ent-nom" class="form-input" required placeholder="Ex: TechCorp Maroc">
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Secteur d'activité</label>
              <input type="text" id="form-ent-secteur" class="form-input" required placeholder="Ex: Télécoms, Cloud">
            </div>
            <div class="form-group">
              <label class="form-label">Ville / Adresse</label>
              <input type="text" id="form-ent-ville" class="form-input" required placeholder="Ex: Casablanca">
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Nom du Contact RH</label>
              <input type="text" id="form-ent-contact" class="form-input" required placeholder="M./Mme ...">
            </div>
            <div class="form-group">
              <label class="form-label">Email de Contact</label>
              <input type="email" id="form-ent-email" class="form-input" required placeholder="rh@entreprise.ma">
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input type="text" id="form-ent-tel" class="form-input" placeholder="+212 5 ...">
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.8rem;">
              <input type="checkbox" id="form-ent-convention" style="width: 18px; height: 18px;">
              <label for="form-ent-convention" class="form-label" style="margin: 0;">Convention cadre active</label>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="ent-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer (SOAP)</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await chargerEntreprises();

  // Événements
  document.getElementById('btn-nouvelle-entreprise').addEventListener('click', () => ouvrirModal());
  document.getElementById('ent-close-btn').addEventListener('click', fermerModal);
  document.getElementById('ent-cancel-btn').addEventListener('click', fermerModal);

  document.getElementById('entreprise-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await sauvegarderEntreprise();
  });
}

async function chargerEntreprises() {
  try {
    const serviceInfo = CONFIG.services.entreprises;
    const result = await soapCall({
      url: serviceInfo.endpoint,
      operation: 'listerEntreprises',
      namespace: serviceInfo.namespace,
      mockFallback: serviceInfo.mockFile
    });

    if (Array.isArray(result)) {
      entreprisesCache = result;
    } else if (result?.xmlDoc) {
      const nodes = result.xmlDoc.querySelectorAll('return, entreprise');
      entreprisesCache = Array.from(nodes).map(node => ({
        id: getXmlNodeText(node, 'id'),
        raisonSociale: getXmlNodeText(node, 'raisonSociale'),
        secteur: getXmlNodeText(node, 'secteur'),
        ville: getXmlNodeText(node, 'ville'),
        contactNom: getXmlNodeText(node, 'contactNom'),
        contactEmail: getXmlNodeText(node, 'contactEmail'),
        telephone: getXmlNodeText(node, 'telephone'),
        conventionnee: getXmlNodeText(node, 'conventionnee') === 'true',
        offresActives: parseInt(getXmlNodeText(node, 'offresActives', '0'), 10)
      }));
    }

    afficherCartes(entreprisesCache);
    mettreAJourStats(entreprisesCache);
  } catch (err) {
    showToast(`Erreur chargement entreprises: ${err.message}`, 'error');
  }
}

function afficherCartes(liste) {
  const container = document.getElementById('entreprises-cards');
  if (!container) return;

  if (liste.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Aucune entreprise trouvée</div>`;
    return;
  }

  container.innerHTML = liste.map(item => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h3 class="card-title" style="margin: 0;">${item.raisonSociale}</h3>
          ${item.conventionnee
            ? '<span class="status-badge status-acceptee" style="font-size: 0.7rem;">Conventionnée</span>'
            : '<span class="status-badge status-deposee" style="font-size: 0.7rem;">Non Conventionnée</span>'}
        </div>
        <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          📍 ${item.ville} • 🏷️ ${item.secteur}
        </p>
        <div style="font-size: 0.85rem; border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
          <div><strong>Contact :</strong> ${item.contactNom}</div>
          <div style="color: var(--text-muted); font-size: 0.8rem;">✉️ ${item.contactEmail}</div>
          <div style="color: var(--text-muted); font-size: 0.8rem;">📞 ${item.telephone || '-'}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
        <span style="font-size: 0.8rem; color: var(--info); font-weight: 600;">
          ${item.offresActives || 0} offre(s) active(s)
        </span>
        <button class="btn btn-outline btn-sm" onclick="window.editerEntreprise(${item.id})">Fiche & Modifier</button>
      </div>
    </div>
  `).join('');
}

function mettreAJourStats(liste) {
  document.getElementById('stat-total-ent').textContent = liste.length;
  document.getElementById('stat-conv-ent').textContent = liste.filter(e => e.conventionnee).length;
  const totalOffres = liste.reduce((acc, curr) => acc + (curr.offresActives || 0), 0);
  document.getElementById('stat-offres-ent').textContent = totalOffres;
}

function ouvrirModal(ent = null) {
  const modal = document.getElementById('entreprise-modal');
  const title = document.getElementById('ent-modal-title');

  if (ent) {
    title.textContent = `Fiche Entreprise : ${ent.raisonSociale}`;
    document.getElementById('form-ent-id').value = ent.id;
    document.getElementById('form-ent-nom').value = ent.raisonSociale;
    document.getElementById('form-ent-secteur').value = ent.secteur;
    document.getElementById('form-ent-ville').value = ent.ville;
    document.getElementById('form-ent-contact').value = ent.contactNom;
    document.getElementById('form-ent-email').value = ent.contactEmail;
    document.getElementById('form-ent-tel').value = ent.telephone || '';
    document.getElementById('form-ent-convention').checked = ent.conventionnee;
  } else {
    title.textContent = "Nouvelle Entreprise";
    document.getElementById('entreprise-form').reset();
    document.getElementById('form-ent-id').value = '';
    document.getElementById('form-ent-convention').checked = true;
  }

  modal.style.display = 'flex';
}

function fermerModal() {
  document.getElementById('entreprise-modal').style.display = 'none';
}

async function sauvegarderEntreprise() {
  const id = document.getElementById('form-ent-id').value;
  const entData = {
    id: id ? parseInt(id, 10) : Date.now(),
    raisonSociale: document.getElementById('form-ent-nom').value,
    secteur: document.getElementById('form-ent-secteur').value,
    ville: document.getElementById('form-ent-ville').value,
    contactNom: document.getElementById('form-ent-contact').value,
    contactEmail: document.getElementById('form-ent-email').value,
    telephone: document.getElementById('form-ent-tel').value,
    conventionnee: document.getElementById('form-ent-convention').checked,
    offresActives: 1
  };

  try {
    const serviceInfo = CONFIG.services.entreprises;
    const bodyXml = `
      <entreprise>
        ${id ? `<id>${id}</id>` : ''}
        <raisonSociale>${entData.raisonSociale}</raisonSociale>
        <secteur>${entData.secteur}</secteur>
        <ville>${entData.ville}</ville>
        <contactNom>${entData.contactNom}</contactNom>
        <contactEmail>${entData.contactEmail}</contactEmail>
        <telephone>${entData.telephone}</telephone>
        <conventionnee>${entData.conventionnee}</conventionnee>
      </entreprise>
    `;

    const res = await soapCall({
      url: serviceInfo.endpoint,
      operation: id ? 'modifierEntreprise' : 'ajouterEntreprise',
      bodyXml,
      namespace: serviceInfo.namespace,
      mockFallback: () => {
        if (id) {
          const idx = entreprisesCache.findIndex(e => e.id == id);
          if (idx !== -1) entreprisesCache[idx] = entData;
        } else {
          entreprisesCache.unshift(entData);
        }
        return { success: true };
      }
    });

    // En mode réel SOAP, vérifier si l'opération a réussi
    if (res?.xmlDoc) {
      const returnText = getXmlNodeText(res.xmlDoc, 'return');
      if (returnText === 'false') {
        throw new Error("La base de données a rejeté l'enregistrement (vérifiez que MySQL/Postgres est démarré et que db.properties est configuré).");
      }
    }

    // Si on est en mode Mock ou si c'est un succès réel
    if (CONFIG.useMock) {
      if (!id) entreprisesCache.unshift(entData);
    }

    showToast('Entreprise enregistrée avec succès !', 'success');
    fermerModal();

    if (!CONFIG.useMock) {
      await chargerEntreprises();
    } else {
      afficherCartes(entreprisesCache);
      mettreAJourStats(entreprisesCache);
    }
  } catch (err) {
    showToast(`Erreur enregistrement : ${err.message}`, 'error');
  }
}

window.editerEntreprise = function(id) {
  const ent = entreprisesCache.find(e => e.id == id);
  if (ent) ouvrirModal(ent);
};

