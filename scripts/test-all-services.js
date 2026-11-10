/**
 * Script de test complet de tous les 6 services SOA
 * Port Tomcat : 8082
 */
const BASE = 'http://localhost:8082';

async function testAll() {
  console.log('==============================================================');
  console.log('   TEST D\'INTÉGRATION COMPLET DES 6 SERVICES SOA (Port 8082)');
  console.log('==============================================================\n');

  // --- SERVICE 1: Étudiants (SOAP) ---
  console.log('--- TEST 1 : SERVICE 1 (Étudiants - SOAP JAX-WS) ---');
  try {
    const res = await fetch(`${BASE}/service1-etudiants-soap/etudiants?wsdl`);
    console.log(`WSDL Statut : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    
    const soapReq = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.service1etudiantssoap.soa.inpt.ma/">
      <soapenv:Header/><soapenv:Body><ser:listerEtudiants/></soapenv:Body>
    </soapenv:Envelope>`;
    const rSoap = await fetch(`${BASE}/service1-etudiants-soap/etudiants`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8', 'SOAPAction': '""' },
      body: soapReq
    });
    console.log(`SOAP Appel listerEtudiants() : HTTP ${rSoap.status} ${rSoap.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    if (rSoap.status === 200) {
      const text = await rSoap.text();
      console.log(`Extrait réponse : ${text.substring(0, 150)}...`);
    }
  } catch (e) {
    console.log(`❌ Erreur Service 1: ${e.message}`);
  }

  // --- SERVICE 2: Entreprises (SOAP) ---
  console.log('\n--- TEST 2 : SERVICE 2 (Entreprises - SOAP JAX-WS) ---');
  try {
    const res = await fetch(`${BASE}/service2-entreprises-soap/services/entreprise?wsdl`);
    console.log(`WSDL Statut : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    
    const soapReq = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.soa.inpt.ma/">
      <soapenv:Header/><soapenv:Body><soap:listerEntreprises/></soapenv:Body>
    </soapenv:Envelope>`;
    const rSoap = await fetch(`${BASE}/service2-entreprises-soap/services/entreprise`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8', 'SOAPAction': '""' },
      body: soapReq
    });
    console.log(`SOAP Appel listerEntreprises() : HTTP ${rSoap.status} ${rSoap.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
  } catch (e) {
    console.log(`❌ Erreur Service 2: ${e.message}`);
  }

  // --- SERVICE 3: Offres (SOAP) ---
  console.log('\n--- TEST 3 : SERVICE 3 (Offres de Stage - SOAP JAX-WS) ---');
  try {
    const res = await fetch(`${BASE}/service3-offres-soap/OffreService?wsdl`);
    console.log(`WSDL Statut : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);

    const soapReq = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service3.soa.inpt.ma/">
      <soapenv:Header/><soapenv:Body><ser:listerOffres/></soapenv:Body>
    </soapenv:Envelope>`;
    const rSoap = await fetch(`${BASE}/service3-offres-soap/OffreService`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8', 'SOAPAction': '""' },
      body: soapReq
    });
    console.log(`SOAP Appel listerOffres() : HTTP ${rSoap.status} ${rSoap.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    if (rSoap.status === 200) {
      const text = await rSoap.text();
      console.log(`Extrait réponse : ${text.substring(0, 150)}...`);
    }
  } catch (e) {
    console.log(`❌ Erreur Service 3: ${e.message}`);
  }

  // --- SERVICE 4: Candidatures (REST) ---
  console.log('\n--- TEST 4 : SERVICE 4 (Candidatures - REST Jersey) ---');
  try {
    const res = await fetch(`${BASE}/service4-candidatures-rest/api/candidatures`);
    console.log(`REST GET /api/candidatures : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`Nombre de candidatures : ${Array.isArray(data) ? data.length : 'JSON valide'}`);
    }
  } catch (e) {
    console.log(`❌ Erreur Service 4: ${e.message}`);
  }

  // --- SERVICE 5: Notifications (REST) ---
  console.log('\n--- TEST 5 : SERVICE 5 (Notifications - REST Jersey) ---');
  try {
    const res = await fetch(`${BASE}/service5-notifications-rest/api/notifications`);
    console.log(`REST GET /api/notifications : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`Nombre de notifications : ${Array.isArray(data) ? data.length : 'JSON valide'}`);
    }
  } catch (e) {
    console.log(`❌ Erreur Service 5: ${e.message}`);
  }

  // --- SERVICE 6: Suivi des Stages (REST) ---
  console.log('\n--- TEST 6 : SERVICE 6 (Suivi des Stages - REST Jersey) ---');
  try {
    const res = await fetch(`${BASE}/service6-suivi-stages-rest/api/stages`);
    console.log(`REST GET /api/stages : HTTP ${res.status} ${res.status === 200 ? '✅ OK' : '❌ ERREUR'}`);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`Nombre de stages enregistrés : ${Array.isArray(data) ? data.length : 'JSON valide'}`);
    }
  } catch (e) {
    console.log(`❌ Erreur Service 6: ${e.message}`);
  }

  console.log('\n==============================================================');
  console.log('                      FIN DU TEST GLOBAL');
  console.log('==============================================================');
}

testAll();
