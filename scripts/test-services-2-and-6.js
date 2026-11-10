/**
 * scripts/test-services-2-and-6.js
 * Script de test réseau pour Service 2 (SOAP) et Service 6 (REST).
 *
 * Supporte le port 8081 (Tomcat sans conflit Postgres) et 8080.
 * Exécution : node scripts/test-services-2-and-6.js [PORT]
 */

const http = require('http');

// Port Tomcat : 8082 configuré sur votre machine
const TOMCAT_PORT = process.argv[2] || process.env.TOMCAT_PORT || 8082;
const BASE_URL = `http://localhost:${TOMCAT_PORT}`;

const CONFIG = {
  service2SoapUrl: `${BASE_URL}/service2-entreprises-soap/services/entreprise`,
  service6RestUrl: `${BASE_URL}/service6-suivi-stages-rest/api/stages`
};

function doRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', err => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`Timeout (5s). Vérifiez que Tomcat tourne sur le port ${TOMCAT_PORT}.`));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testService2Soap() {
  console.log('\n==============================================================');
  console.log(`  TEST 1 : SERVICE 2 (ENTREPRISES - SOAP JAX-WS)`);
  console.log(`  URL : ${CONFIG.service2SoapUrl}`);
  console.log('==============================================================');

  const soapEnvelopeLister = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://soap.soa.inpt.ma/">
  <soapenv:Header/>
  <soapenv:Body>
    <ws:listerEntreprises/>
  </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const url = new URL(CONFIG.service2SoapUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '"listerEntreprises"',
        'Content-Length': Buffer.byteLength(soapEnvelopeLister)
      }
    };

    console.log('-> Envoi requête SOAP listerEntreprises()...');
    const res = await doRequest(options, soapEnvelopeLister);
    console.log(`Statut HTTP : ${res.statusCode}`);

    if (res.statusCode === 200) {
      console.log('✅ SUCCÈS : Le service SOAP Entreprises répond correctement !');
      console.log('Extrait XML : ' + res.body.slice(0, 300) + '...\n');
    } else {
      console.log(`❌ Réponse HTTP ${res.statusCode} :`);
      console.log(res.body.slice(0, 400));
    }
  } catch (err) {
    console.log('❌ ÉCHEC DE CONNEXION :');
    console.log('   ' + err.message);
    console.log(`   👉 Conseil : Assurez-vous que Tomcat 9 est démarré sur le port ${TOMCAT_PORT} et que service2-entreprises-soap.war est déployé.`);
  }
}

async function testService6Rest() {
  console.log('\n==============================================================');
  console.log(`  TEST 2 : SERVICE 6 (SUIVI DES STAGES - REST JERSEY)`);
  console.log(`  URL : ${CONFIG.service6RestUrl}`);
  console.log('==============================================================');

  try {
    const url = new URL(CONFIG.service6RestUrl);
    const optionsGet = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    console.log('-> [1/2] Test GET /api/stages (Lister les stages)...');
    const resGet = await doRequest(optionsGet);
    console.log(`Statut HTTP : ${resGet.statusCode}`);

    if (resGet.statusCode === 200) {
      console.log('✅ SUCCÈS : Le service REST Suivi des Stages répond en JSON !');
      try {
        const json = JSON.parse(resGet.body);
        console.log(`Nombre de stages récupérés : ${Array.isArray(json) ? json.length : 0}`);
        if (Array.isArray(json) && json.length > 0) {
          console.log(`Premier stage : #${json[0].id} - "${json[0].intitule}" (État: ${json[0].etat})`);
        }
      } catch {
        console.log('Corps brut : ' + resGet.body.slice(0, 300));
      }
    } else {
      console.log(`❌ Réponse HTTP ${resGet.statusCode} :`);
      console.log(resGet.body.slice(0, 400));
    }

    const nouveauStage = JSON.stringify({
      etudiantId: 1,
      entrepriseId: 1,
      intitule: "Stage Test CLI - Architecture Microservices",
      dateDebut: "2026-02-01",
      dateFin: "2026-06-30",
      tuteurEntreprise: "M. Karim Tazi",
      tuteurAcademique: "Pr. Alami",
      etat: "EN_COURS"
    });

    const optionsPost = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(nouveauStage)
      }
    };

    console.log('\n-> [2/2] Test POST /api/stages (Création d\'un stage)...');
    const resPost = await doRequest(optionsPost, nouveauStage);
    console.log(`Statut HTTP : ${resPost.statusCode}`);
    if (resPost.statusCode === 201) {
      console.log('✅ SUCCÈS : Stage créé avec succès (201 Created) !');
    } else {
      console.log(`⚠️ Code HTTP : ${resPost.statusCode}`);
    }

  } catch (err) {
    console.log('❌ ÉCHEC DE CONNEXION :');
    console.log('   ' + err.message);
    console.log(`   👉 Conseil : Assurez-vous que Tomcat 9 est démarré sur le port ${TOMCAT_PORT} et que service6-suivi-stages-rest.war est déployé.`);
  }
}

async function run() {
  console.log(`>>> Test des services sur Tomcat (Port ciblé : ${TOMCAT_PORT}) <<<`);
  await testService2Soap();
  await testService6Rest();
  console.log('\n==============================================================');
  console.log('  FIN DES TESTS AUTOMATISÉS');
  console.log('==============================================================\n');
}

run();
