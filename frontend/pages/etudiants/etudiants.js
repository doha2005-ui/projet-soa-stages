/**
 * frontend/pages/etudiants/etudiants.js
 * Membre 1 : Service 1 Étudiants (SOAP JAX-WS)
 * Pages : étudiants (fiche, liste, modification)
 */

import { CONFIG } from '../../shared/config.js';
import { soapCall, getXmlNodeText } from '../../shared/soap.js';
import { showToast } from '../../shared/api.js';

let etudiantsCache = [];

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestion des Étudiants</h2>
        <p class="page-subtitle">Consultation, fiche détaillée et mise à jour du profil étudiant</p>
        <div class="page-meta">
          <span class="member-chip">Membre 1</span>
          <span class="badge-type badge-soap">SOAP JAX-WS</span>
          <span class="text-muted" style="font-size: 0.8rem;">Service 1: <code>${CONFIG.services.etudiants.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-nouveau-etudiant">+ Nouvel Étudiant</button>
      </div>
    </div>

    <!-- Barre d'outils / Recherche -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <input type="text" id="etudiant-search" class="form-input" placeholder="Rechercher par nom, prénom ou CNE..." style="max-width: 320px;">
        <span class="text-muted" style="font-size: 0.85rem;" id="etudiant-count">Chargement...</span>
      </div>
    </div>

    <!-- Tableau de la liste des étudiants -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>CNE</th>
            <th>Nom & Prénom</th>
            <th>Filière & Année</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody id="etudiants-table-body">
          <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Chargement des données...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Fiche / Modification Étudiant -->
    <div id="etudiant-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="etudiant-modal-title">Fiche Étudiant</h3>
          <button class="close-btn" id="modal-close-btn">&times;</button>
        </div>
        <form id="etudiant-form">
          <input type="hidden" id="form-id">
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">CNE</label>
              <input type="text" id="form-cne" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input type="text" id="form-nom" class="form-input" required>
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input type="text" id="form-prenom" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email Universitaire</label>
              <input type="email" id="form-email" class="form-input" required>
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Filière</label>
              <input type="text" id="form-filiere" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Niveau / Année</label>
              <input type="text" id="form-annee" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Téléphone</label>
            <input type="text" id="form-telephone" class="form-input">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="modal-cancel-btn">Annuler</button>
            <button type="submit" class="btn btn-primary" id="modal-save-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Chargement des données SOAP
  await chargerEtudiants();

  // Événements
  document.getElementById('etudiant-search').addEventListener('input', (e) => {
    filtrerEtudiants(e.target.value);
  });

  document.getElementById('btn-nouveau-etudiant').addEventListener('click', () => {
    ouvrirModal();
  });

  document.getElementById('modal-close-btn').addEventListener('click', fermerModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', fermerModal);

  document.getElementById('etudiant-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await sauvegarderEtudiant();
  });
}

async function chargerEtudiants() {
  try {
    const serviceInfo = CONFIG.services.etudiants;

    // Appel SOAP via la bibliothèque commune partagée (Membre 4)
    const result = await soapCall({
      url: serviceInfo.endpoint,
      operation: 'listerEtudiants',
      namespace: serviceInfo.namespace,
      mockFallback: serviceInfo.mockFile
    });

    if (Array.isArray(result)) {
      etudiantsCache = result;
    } else if (result?.xmlDoc) {
      // Parser le XML SOAP si retour réel JAX-WS
      const nodes = result.xmlDoc.querySelectorAll('return, etudiant');
      etudiantsCache = Array.from(nodes).map(node => ({
        id: getXmlNodeText(node, 'id'),
        cne: getXmlNodeText(node, 'cne'),
        nom: getXmlNodeText(node, 'nom'),
        prenom: getXmlNodeText(node, 'prenom'),
        email: getXmlNodeText(node, 'email'),
        filiere: getXmlNodeText(node, 'filiere'),
        annee: getXmlNodeText(node, 'annee'),
        telephone: getXmlNodeText(node, 'telephone')
      }));
    }

    afficherTableau(etudiantsCache);
  } catch (err) {
    showToast(`Erreur chargement étudiants: ${err.message}`, 'error');
  }
}

function afficherTableau(liste) {
  const tbody = document.getElementById('etudiants-table-body');
  const countEl = document.getElementById('etudiant-count');
  if (!tbody) return;

  countEl.textContent = `${liste.length} étudiant(s) trouvé(s)`;

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Aucun étudiant trouvé</td></tr>`;
    return;
  }

  tbody.innerHTML = liste.map(item => `
    <tr>
      <td><code>${item.cne}</code></td>
      <td><strong>${item.nom}</strong> ${item.prenom}</td>
      <td>
        <span class="member-chip" style="font-size: 0.75rem;">${item.filiere}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${item.annee}</div>
      </td>
      <td>${item.email}</td>
      <td>${item.telephone || '-'}</td>
      <td style="text-align: right;">
        <button class="btn btn-outline btn-sm" onclick="window.editerEtudiant(${item.id})">Modifier</button>
      </td>
    </tr>
  `).join('');
}

function filtrerEtudiants(terme) {
  const q = terme.toLowerCase().trim();
  const filtre = etudiantsCache.filter(e =>
    e.nom.toLowerCase().includes(q) ||
    e.prenom.toLowerCase().includes(q) ||
    e.cne.toLowerCase().includes(q) ||
    e.filiere.toLowerCase().includes(q)
  );
  afficherTableau(filtre);
}

function ouvrirModal(etudiant = null) {
  const modal = document.getElementById('etudiant-modal');
  const title = document.getElementById('etudiant-modal-title');

  if (etudiant) {
    title.textContent = `Modifier Étudiant : ${etudiant.nom} ${etudiant.prenom}`;
    document.getElementById('form-id').value = etudiant.id;
    document.getElementById('form-cne').value = etudiant.cne;
    document.getElementById('form-nom').value = etudiant.nom;
    document.getElementById('form-prenom').value = etudiant.prenom;
    document.getElementById('form-email').value = etudiant.email;
    document.getElementById('form-filiere').value = etudiant.filiere;
    document.getElementById('form-annee').value = etudiant.annee;
    document.getElementById('form-telephone').value = etudiant.telephone || '';
  } else {
    title.textContent = "Nouvel Étudiant";
    document.getElementById('etudiant-form').reset();
    document.getElementById('form-id').value = '';
  }

  modal.style.display = 'flex';
}

function fermerModal() {
  document.getElementById('etudiant-modal').style.display = 'none';
}

async function sauvegarderEtudiant() {
  const id = document.getElementById('form-id').value;
  const etudiantData = {
    id: id ? parseInt(id, 10) : Date.now(),
    cne: document.getElementById('form-cne').value,
    nom: document.getElementById('form-nom').value,
    prenom: document.getElementById('form-prenom').value,
    email: document.getElementById('form-email').value,
    filiere: document.getElementById('form-filiere').value,
    annee: document.getElementById('form-annee').value,
    telephone: document.getElementById('form-telephone').value
  };

  try {
    const serviceInfo = CONFIG.services.etudiants;
    const bodyXml = `
      <etudiant>
        ${id ? `<id>${id}</id>` : ''}
        <cne>${etudiantData.cne}</cne>
        <nom>${etudiantData.nom}</nom>
        <prenom>${etudiantData.prenom}</prenom>
        <email>${etudiantData.email}</email>
        <filiere>${etudiantData.filiere}</filiere>
        <annee>${etudiantData.annee}</annee>
        <telephone>${etudiantData.telephone}</telephone>
      </etudiant>
    `;

    await soapCall({
      url: serviceInfo.endpoint,
      operation: id ? 'modifierEtudiant' : 'ajouterEtudiant',
      bodyXml,
      namespace: serviceInfo.namespace,
      mockFallback: () => {
        if (id) {
          const idx = etudiantsCache.findIndex(e => e.id == id);
          if (idx !== -1) etudiantsCache[idx] = etudiantData;
        } else {
          etudiantsCache.unshift(etudiantData);
        }
        return { success: true };
      }
    });

    showToast(id ? 'Étudiant modifié avec succès !' : 'Étudiant ajouté avec succès !', 'success');
    fermerModal();
    afficherTableau(etudiantsCache);
  } catch (err) {
    showToast(`Erreur enregistrement : ${err.message}`, 'error');
  }
}

// Exposé globalement pour les boutons onclick
window.editerEtudiant = function(id) {
  const etudiant = etudiantsCache.find(e => e.id == id);
  if (etudiant) ouvrirModal(etudiant);
};

