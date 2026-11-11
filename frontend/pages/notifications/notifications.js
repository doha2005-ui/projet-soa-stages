import { CONFIG } from '../../shared/config.js';
import { restCall, showToast } from '../../shared/api.js';

let notificationsCache = [];

export async function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="page-title">Historique des Notifications</h2>
        <p class="page-subtitle">Suivi des alertes envoyées aux étudiants, entreprises et tuteurs</p>
        <div class="page-meta">
          <span class="member-chip">Membre 1</span>
          <span class="badge-type badge-rest">REST Jersey</span>
          <span class="text-muted" style="font-size: 0.8rem;">Service 5: <code>${CONFIG.services.notifications.endpoint}</code></span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-envoyer-notification">+ Envoyer Notification</button>
      </div>
    </div>

    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <label class="form-label" style="margin: 0;">Filtrer par rôle :</label>
        <select id="notif-role-filter" class="form-select" style="max-width: 200px;">
          <option value="ALL">Tous les rôles</option>
          <option value="ETUDIANT">Étudiant</option>
          <option value="ENTREPRISE">Entreprise</option>
          <option value="RESPONSABLE">Responsable</option>
        </select>
        <button class="btn btn-outline btn-sm" id="btn-marquer-tout-lu">Marquer tout comme lu</button>
      </div>
    </div>

    <div class="grid" id="notifications-list" style="gap: 1rem;">
      <div style="text-align: center; color: var(--text-muted); padding: 2rem;">Chargement des notifications...</div>
    </div>

    <div id="notif-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Nouvelle Notification</h3>
          <button class="close-btn" id="notif-modal-close">&times;</button>
        </div>
        <form id="notif-form">
          <div class="form-group">
            <label class="form-label">Type de destinataire</label>
            <select id="notif-form-type" class="form-select" required>
              <option value="ETUDIANT">Étudiant</option>
              <option value="ENTREPRISE">Entreprise</option>
              <option value="RESPONSABLE">Responsable PFE</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Titre de l'alerte</label>
            <input type="text" id="notif-form-titre" class="form-input" placeholder="Ex: Convention validée" required>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea id="notif-form-message" class="form-textarea" rows="4" placeholder="Corps du message..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="notif-modal-cancel">Annuler</button>
            <button type="submit" class="btn btn-primary">Envoyer (REST POST)</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await chargerNotifications();

  document.getElementById('notif-role-filter').addEventListener('change', (e) => {
    filtrerNotifications(e.target.value);
  });

  document.getElementById('btn-envoyer-notification').addEventListener('click', () => {
    document.getElementById('notif-modal').style.display = 'flex';
  });

  document.getElementById('notif-modal-close').addEventListener('click', fermerModal);
  document.getElementById('notif-modal-cancel').addEventListener('click', fermerModal);

  document.getElementById('notif-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await envoyerNotification();
  });

  document.getElementById('btn-marquer-tout-lu').addEventListener('click', () => {
    notificationsCache.forEach(n => n.statut = 'LUE');
    afficherNotifications(notificationsCache);
    showToast('Toutes les notifications sont marquées comme lues', 'info');
  });
}

async function chargerNotifications() {
  try {
    const serviceInfo = CONFIG.services.notifications;
    const data = await restCall(serviceInfo.endpoint, { method: 'GET' }, serviceInfo.mockFile);
    notificationsCache = Array.isArray(data) ? data : [];
    afficherNotifications(notificationsCache);
  } catch (err) {
    showToast(`Erreur chargement notifications: ${err.message}`, 'error');
  }
}

function afficherNotifications(liste) {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  if (liste.length === 0) {
    container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucune notification.</div>`;
    return;
  }

  container.innerHTML = liste.map(item => {
    const isUnread = item.statut === 'NON_LUE';
    const dateFormatted = new Date(item.dateEnvoi).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
      <div class="card" style="${isUnread ? 'border-left: 4px solid var(--primary); background: #f8faff;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="member-chip" style="font-size: 0.7rem;">${item.destinataireType}</span>
              <strong style="font-size: 1rem;">${item.titre}</strong>
              ${isUnread ? '<span class="status-badge status-en-cours" style="font-size: 0.65rem;">Nouveau</span>' : ''}
            </div>
            <p style="color: var(--text-main); font-size: 0.9rem; margin: 0.5rem 0;">${item.message}</p>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Émis par <code>${item.serviceEmetteur}</code> le ${dateFormatted}
            </div>
          </div>
          <div>
            ${isUnread ? `<button class="btn btn-outline btn-sm" onclick="window.marquerLu(${item.id})">Marquer lu</button>` : '<span style="font-size: 0.75rem; color: var(--text-light);">Lu</span>'}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filtrerNotifications(type) {
  if (type === 'ALL') {
    afficherNotifications(notificationsCache);
  } else {
    afficherNotifications(notificationsCache.filter(n => n.destinataireType === type));
  }
}

function fermerModal() {
  document.getElementById('notif-modal').style.display = 'none';
}

async function envoyerNotification() {
  const notif = {
    destinataireType: document.getElementById('notif-form-type').value,
    destinataireId: 1,
    titre: document.getElementById('notif-form-titre').value,
    message: document.getElementById('notif-form-message').value,
    dateEnvoi: new Date().toISOString(),
    statut: 'NON_LUE',
    serviceEmetteur: 'service5-notifications-rest'
  };

  try {
    const serviceInfo = CONFIG.services.notifications;
    await restCall(
      serviceInfo.endpoint,
      {
        method: 'POST',
        body: JSON.stringify(notif)
      },
      () => {
        notificationsCache.unshift(notif);
        return notif;
      }
    );

    showToast('Notification transmise !', 'success');
    fermerModal();
    document.getElementById('notif-form').reset();
    afficherNotifications(notificationsCache);
  } catch (err) {
    showToast(`Erreur envoi notification: ${err.message}`, 'error');
  }
}

window.marquerLu = async function(id) {
  const notif = notificationsCache.find(n => n.id == id);
  if (!notif) return;

  try {
    const serviceInfo = CONFIG.services.notifications;
    
    await restCall(
      `${serviceInfo.endpoint}/${id}/statut?statut=LUE`,
      { method: 'PUT' },
      () => {
        notif.statut = 'LUE';
        return notif;
      }
    );

    notif.statut = 'LUE';
    afficherNotifications(notificationsCache);
    showToast('Notification marquée comme lue', 'success');
  } catch (err) {
    showToast(`Erreur mise à jour : ${err.message}`, 'error');
  }
};