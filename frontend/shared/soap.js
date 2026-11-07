/**
 * frontend/shared/soap.js
 * Fourni par Membre 4 (Responsable Squelette Commun & BPMN)
 *
 * Utilitaire d'appel SOAP JAX-WS commun pour les Services 1 (Étudiants),
 * Service 2 (Entreprises) et Service 3 (Offres).
 *
 * Fonctions :
 * - Construction automatique de l'enveloppe SOAP 1.1
 * - Envoi de la requête POST avec headers text/xml et SOAPAction
 * - Détection et extraction des fautes SOAP (<faultstring>, <soap:Fault>)
 * - Parsing XML avec window.DOMParser
 * - Support transparent du mode mock pour tester l'UI sans backend
 */

import { CONFIG } from './config.js';

export class SoapError extends Error {
  constructor(faultCode, faultString, xmlDoc = null) {
    super(faultString);
    this.name = 'SoapError';
    this.faultCode = faultCode;
    this.xmlDoc = xmlDoc;
  }
}

/**
 * Construit une enveloppe SOAP 1.1 standard
 *
 * @param {string} operation - Nom de la méthode JAX-WS (ex: "listerEtudiants")
 * @param {string} bodyXml - Contenu XML des arguments
 * @param {string} namespace - Espace de nom cible (ex: "http://service1.soa.inpt.ma/")
 * @returns {string} Enveloppe XML prête à l'envoi
 */
export function buildSoapEnvelope(operation, bodyXml = '', namespace = '') {
  const nsDecl = namespace ? ` xmlns:ws="${namespace}"` : '';
  const opOpen = operation ? `<ws:${operation}${nsDecl}>` : '';
  const opClose = operation ? `</ws:${operation}>` : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"${nsDecl}>
  <soapenv:Header/>
  <soapenv:Body>
    ${opOpen}
      ${bodyXml}
    ${opClose}
  </soapenv:Body>
</soapenv:Envelope>`.trim();
}

/**
 * Effectue un appel SOAP vers un service Web JAX-WS
 *
 * @param {string} url - URL du endpoint JAX-WS (ex: "http://localhost:8080/service1-etudiants-soap/EtudiantService")
 * @param {string} operation - Nom de l'opération SOAP
 * @param {string} bodyXml - Paramètres XML à envoyer dans le corps
 * @param {string} namespace - Namespace XML de l'opération
 * @param {string|object|Function} mockFallback - Données JSON ou fonction fallback si mode mock activé
 * @returns {Promise<{xmlDoc: Document, rawText: string, data?: any}>}
 */
export async function soapCall({ url, operation, bodyXml = '', namespace = '', mockFallback = null }) {
  // 1. Mode Mock simulé
  if (CONFIG.useMock && mockFallback) {
    await new Promise(resolve => setTimeout(resolve, 150));

    if (typeof mockFallback === 'function') {
      return await mockFallback({ operation, bodyXml });
    }

    if (typeof mockFallback === 'string') {
      try {
        const res = await fetch(mockFallback);
        if (!res.ok) throw new Error(`Mock non trouvé : ${mockFallback}`);
        return await res.json();
      } catch (err) {
        console.warn(`[SOAP Mock] Échec chargement mock ${mockFallback}`, err);
      }
    } else {
      return mockFallback;
    }
  }

  // 2. Appel SOAP réel
  const envelope = buildSoapEnvelope(operation, bodyXml, namespace);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `"${operation}"`
      },
      body: envelope
    });

    const responseText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseText, 'application/xml');

    // Vérifier les erreurs de syntaxe XML du parser du navigateur
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`Erreur d'analyse XML: ${parserError.textContent}`);
    }

    // Détection des SOAP Fault
    const fault = xmlDoc.querySelector('Fault, soap\\:Fault, soapenv\\:Fault');
    if (fault) {
      const faultCode = fault.querySelector('faultcode')?.textContent || 'Client/Server Fault';
      const faultString = fault.querySelector('faultstring')?.textContent || 'Erreur SOAP interne inconnue';
      throw new SoapError(faultCode, faultString, xmlDoc);
    }

    if (!response.ok) {
      throw new SoapError(`HTTP_${response.status}`, `Erreur HTTP lors de l'appel SOAP: ${response.statusText}`, xmlDoc);
    }

    return { xmlDoc, rawText: responseText };
  } catch (err) {
    if (err instanceof SoapError) {
      throw err;
    }

    console.error(`[SOAP Error] Impossible de joindre ${url} :`, err);
    throw new SoapError(
      'NETWORK_ERROR',
      `Impossible de joindre le service SOAP (${url}). Vérifiez le déploiement Tomcat ou activez le mode mock.`,
      null
    );
  }
}

/**
 * Utilitaire pour extraire le texte d'un noeud XML ou sous-noeuds
 */
export function getXmlNodeText(parentNode, selector, defaultValue = '') {
  if (!parentNode) return defaultValue;
  const node = parentNode.querySelector(selector);
  return node ? node.textContent.trim() : defaultValue;
}

