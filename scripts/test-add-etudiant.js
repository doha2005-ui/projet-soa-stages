const req = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service1.soa.inpt.ma/">
  <soapenv:Header/>
  <soapenv:Body>
    <ser:ajouterEtudiant>
      <etudiant>
        <cne>G99999999</cne>
        <nom>DERRAZ</nom>
        <prenom>DOHA</prenom>
        <email>dohaderraz@gmail.com</email>
        <filiere>AMOA</filiere>
        <annee>2</annee>
        <telephone>0986431</telephone>
      </etudiant>
    </ser:ajouterEtudiant>
  </soapenv:Body>
</soapenv:Envelope>`;

fetch('http://localhost:8082/service1-etudiants-soap/etudiants', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml;charset=UTF-8', 'SOAPAction': '""' },
  body: req
}).then(r => {
  console.log('STATUS:', r.status);
  return r.text();
}).then(t => console.log('BODY:', t.substring(0, 300)))
  .catch(e => console.error(e));

