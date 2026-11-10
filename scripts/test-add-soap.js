const soapReq = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.soa.inpt.ma/">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:ajouterEntreprise>
         <entreprise>
            <raisonSociale>Test Entreprise</raisonSociale>
            <secteur>IT</secteur>
            <ville>Rabat</ville>
            <contactNom>Ali</contactNom>
            <contactEmail>ali@test.ma</contactEmail>
            <telephone>0600000000</telephone>
            <conventionnee>true</conventionnee>
         </entreprise>
      </soap:ajouterEntreprise>
   </soapenv:Body>
</soapenv:Envelope>`;

fetch('http://localhost:8082/service2-entreprises-soap/services/entreprise', {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml;charset=UTF-8', 'SOAPAction': '""' },
    body: soapReq
}).then(r => r.text()).then(t => console.log('RESPONSE:', t)).catch(e => console.error(e));

