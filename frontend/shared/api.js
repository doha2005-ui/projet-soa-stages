/**
 * frontend/shared/api.js
 * Fourni par Membre 4 (Responsable Squelette Commun & BPMN)
 *
 * Utilitaire d'appel REST commun qui gère :
 * - Les en-têtes JSON (Content-Type, Accept)
 * - Les codes de réponse HTTP (200, 201, 204, 400, 404, 500, etc.)
 * - Le format standard d'erreur convenu par l'équipe : { code, message }
 * - Le basculement transparent vers les mocks JSON lorsque CONFIG.useMock = true
 */

import { CONFIG } from './config.js';

export class ApiError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Fonction universelle d'appel REST pour les services Membre 1 (Notifications),
 * Membre 2 (Suivi Stages), Membre 3 (Candidatures), et Membre 4 (Bonita BPMN).
 *
 * @param {string} url - URL du endpoint REST
 * @param {object} options - Options fetch (method, headers, body, etc.)
 * @param {string|object|Function} mockFallback - Chemin du fichier JSON ou données simulées si useMock = true
 * @returns {Promise<any>} Données JSON retournées
 */
export async function restCall(url, options = {}, mockFallback = null) {
  // 1. Si le mode mock est activé et qu'un fallback est fourni
  if (CONFIG.useMock && mockFallback) {
    // Petit délai simulé pour une expérience réaliste (150ms)
    await new Promise(resolve => setTimeout(resolve, 150));

    if (typeof mockFallback === 'function') {
      return mockFallback(options);
    }

    if (typeof mockFallback === 'string') {
      try {
        const mockResponse = await fetch(mockFallback);
        if (!mockResponse.ok) {
          throw new Error(`Mock introuvable: ${mockFallback}`);
        }
        return await mockResponse.json();
      } catch (mockErr) {
        console.warn(`[Mock REST Fallback] Impossible de charger ${mockFallback}, utilisation des données en mémoire`, mockErr);
      }
    } else {
      return mockFallback;
    }
  }

  // 2. Appel réseau réel vers le service Tomcat/Jersey
  const defaultHeaders = {
    'Accept': 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {})
  };

  const fetchConfig = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, fetchConfig);

    // Réponse vide (204 No Content)
    if (response.status === 204) {
      return null;
    }

    let responseData = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Gestion des codes d'erreur HTTP
    if (!response.ok) {
      let code = response.status;
      let message = response.statusText || 'Erreur lors de la requête REST';

      // Vérification du format convenu { code, message }
      if (responseData && typeof responseData === 'object') {
        if (responseData.code) code = responseData.code;
        if (responseData.message) message = responseData.message;
      } else if (typeof responseData === 'string' && responseData.trim().length > 0) {
        message = responseData;
      }

      throw new ApiError(code, message, responseData);
    }

    return responseData;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    // Erreur réseau (ex: Tomcat arrêté ou CORS non configuré)
    console.error(`[REST Error] Appel vers ${url} échoué :`, err);
    throw new ApiError(
      0,
      `Impossible de joindre le service REST (${url}). Vérifiez que Tomcat est démarré ou activez le mode mock.`,
      err
    );
  }
}

/**
 * Affiche une notification toast temporaire dans l'interface
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

