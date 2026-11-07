Add-Type -AssemblyName System.Drawing

function Save-ImageDual($bmp, $filename) {
    $bmp.Save("images/$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save("docs/images/$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Image générée : $filename"
}

# ==============================================================================
# 1. FIGURE 33 : bpmn-complet.png (Diagramme BPMN complet avec 3 couloirs)
# ==============================================================================
$bmp33 = New-Object System.Drawing.Bitmap(1200, 560)
$g = [System.Drawing.Graphics]::FromImage($bmp33)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::White)

$fontTitle = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
$fontHeader = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$fontBody = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$fontMethod = New-Object System.Drawing.Font("Segoe UI", 7, [System.Drawing.FontStyle]::Regular)
$fontGate = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$fontLane = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)

# Cadre général
$penBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($brushBg, 20, 15, 1160, 530)
$g.DrawRectangle($penBorder, 20, 15, 1160, 530)

$brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))
$brushBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
$brushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(5, 150, 105))
$brushRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 38, 38))
$brushPurple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(124, 58, 237))

$g.DrawString("Figure 33 : Diagramme BPMN Complet de Gestion et Conventionnement des Stages (INPT)", $fontTitle, $brushDark, 40, 30)

# Dessin des 3 couloirs (Pool & Lanes)
$penLane = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(148, 163, 184), 1.5)
$brushLaneHeader = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))

# Couloir 1 : Entreprise (y: 65 -> 200, h: 135)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 65, 1080, 135)
$g.DrawRectangle($penLane, 70, 65, 1080, 135)
$g.FillRectangle($brushLaneHeader, 70, 65, 30, 135)
$g.DrawRectangle($penLane, 70, 65, 30, 135)

# Couloir 2 : Responsable PFE (y: 200 -> 380, h: 180)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 200, 1080, 180)
$g.DrawRectangle($penLane, 70, 200, 1080, 180)
$g.FillRectangle($brushLaneHeader, 70, 200, 30, 180)
$g.DrawRectangle($penLane, 70, 200, 30, 180)

# Couloir 3 : Etudiant (y: 380 -> 510, h: 130)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 380, 1080, 130)
$g.DrawRectangle($penLane, 70, 380, 1080, 130)
$g.FillRectangle($brushLaneHeader, 70, 380, 30, 130)
$g.DrawRectangle($penLane, 70, 380, 30, 130)

# Labels des couloirs (verticaux)
$sf = New-Object System.Drawing.StringFormat
$sf.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionVertical
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("ENTREPRISE", $fontHeader, $brushDark, 85, 132, $sf)
$g.DrawString("RESPONSABLE DES STAGES (INPT)", $fontHeader, $brushDark, 85, 290, $sf)
$g.DrawString("ÉTUDIANT", $fontHeader, $brushDark, 85, 445, $sf)

# Flèches
$penLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(71, 85, 105), 2)
$penLine.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)
$penGreenLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(5, 150, 105), 2)
$penGreenLine.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)
$penRedLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 38, 38), 2)
$penRedLine.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)

# 1. Start Event (dans Entreprise)
$brushStart = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 252, 231))
$penStart = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, 163, 74), 2.5)
$g.FillEllipse($brushStart, 120, 115, 34, 34)
$g.DrawEllipse($penStart, 120, 115, 34, 34)
$g.DrawString("Candidature Retenue", $fontMethod, $brushDark, 100, 155)

# Liaison Start -> SOAP S1
$penNorm = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(71, 85, 105), 2)
$g.DrawLine($penNorm, 154, 132, 185, 132)
$g.DrawLine($penNorm, 185, 132, 185, 280)
$g.DrawLine($penLine, 185, 280, 210, 280)

# Tâche 1 : SOAP S1 (dans Responsable)
$brushTask = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$penBlue = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(59, 130, 246), 1.8)
$g.FillRectangle($brushTask, 210, 245, 120, 70)
$g.DrawRectangle($penBlue, 210, 245, 120, 70)
$g.DrawString("SERVICE 1 (SOAP)", $fontHeader, $brushBlue, 215, 253)
$g.DrawString("Check Eligibilite", $fontBody, $brushDark, 215, 270)
$g.DrawString("verifierStatut()", $fontMethod, $brushMuted, 215, 290)

$g.DrawLine($penLine, 330, 280, 360, 280)

# Tâche 2 : SOAP S2
$g.FillRectangle($brushTask, 360, 245, 120, 70)
$g.DrawRectangle($penBlue, 360, 245, 120, 70)
$g.DrawString("SERVICE 2 (SOAP)", $fontHeader, $brushBlue, 365, 253)
$g.DrawString("Check Convention", $fontBody, $brushDark, 365, 270)
$g.DrawString("verifierEntreprise()", $fontMethod, $brushMuted, 365, 290)

$g.DrawLine($penLine, 480, 280, 510, 280)

# Passerelle 1 (Losange)
$brushYellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 249, 195))
$penYellow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(202, 138, 4), 2)
$ptsP1 = @(
    (New-Object System.Drawing.Point(530, 260)),
    (New-Object System.Drawing.Point(550, 280)),
    (New-Object System.Drawing.Point(530, 300)),
    (New-Object System.Drawing.Point(510, 280))
)
$g.FillPolygon($brushYellow, $ptsP1)
$g.DrawPolygon($penYellow, $ptsP1)
$brushGateTxt = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(133, 77, 14))
$g.DrawString("X", $fontGate, $brushGateTxt, 522, 267)
$g.DrawString("Eligible ?", $fontMethod, $brushDark, 513, 240)

# Passerelle 1 [OUI] -> Tâche Humaine Validation Sujet
$g.DrawLine($penGreenLine, 550, 280, 600, 280)
$g.DrawString("Oui", $fontMethod, $brushGreen, 555, 265)

# Tâche Humaine Sujet (Responsable)
$penGreenBox = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 1.8)
$g.FillRectangle($brushTask, 600, 245, 120, 70)
$g.DrawRectangle($penGreenBox, 600, 245, 120, 70)
$g.DrawString("TACHE HUMAINE", $fontHeader, $brushGreen, 605, 253)
$g.DrawString("Validation Sujet", $fontBody, $brushDark, 605, 270)
$g.DrawString("Responsable INPT", $fontMethod, $brushMuted, 605, 290)

# Passerelle 1 [NON] -> Notifier Refus Étudiant
$g.DrawLine($penNorm, 530, 300, 530, 440)
$g.DrawLine($penRedLine, 530, 440, 580, 440)
$g.DrawString("Non", $fontMethod, $brushRed, 535, 340)

# Tâche Rejet Éligibilité (dans couloir Étudiant)
$brushRedBox = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 242, 242))
$penRedBox = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(239, 68, 68), 1.5)
$g.FillRectangle($brushRedBox, 580, 410, 115, 60)
$g.DrawRectangle($penRedBox, 580, 410, 115, 60)
$g.DrawString("REST S5 : Notif Refus", $fontHeader, $brushRed, 585, 420)
$g.DrawString("Avis Rejet CNE", $fontBody, $brushDark, 585, 438)

$g.DrawLine($penLine, 695, 440, 730, 440)
$brushRedCirc = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 226, 226))
$g.FillEllipse($brushRedCirc, 730, 426, 28, 28)
$g.DrawEllipse($penRedBox, 730, 426, 28, 28)
$g.DrawString("Refuse", $fontMethod, $brushRed, 728, 460)

# Suite Validation Sujet -> Passerelle 2
$g.DrawLine($penLine, 720, 280, 755, 280)

$ptsP2 = @(
    (New-Object System.Drawing.Point(775, 260)),
    (New-Object System.Drawing.Point(795, 280)),
    (New-Object System.Drawing.Point(775, 300)),
    (New-Object System.Drawing.Point(755, 280))
)
$g.FillPolygon($brushYellow, $ptsP2)
$g.DrawPolygon($penYellow, $ptsP2)
$g.DrawString("X", $fontGate, $brushGateTxt, 767, 267)
$g.DrawString("Valide ?", $fontMethod, $brushDark, 758, 240)

# Passerelle 2 [OUI] -> REST S6 Créer Stage
$g.DrawLine($penGreenLine, 795, 280, 835, 280)
$g.DrawString("Valide", $fontMethod, $brushGreen, 800, 265)

# Tâche 3 : REST S6 Création Stage
$penPurple = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(139, 92, 246), 1.8)
$g.FillRectangle($brushTask, 835, 245, 120, 70)
$g.DrawRectangle($penPurple, 835, 245, 120, 70)
$g.DrawString("SERVICE 6 (REST)", $fontHeader, $brushPurple, 840, 253)
$g.DrawString("Creation Stage", $fontBody, $brushDark, 840, 270)
$g.DrawString("POST /api/stages", $fontMethod, $brushMuted, 840, 290)

$g.DrawLine($penLine, 955, 280, 990, 280)

# Tâche 4 : REST S5 Notification Tripartite
$g.FillRectangle($brushTask, 990, 245, 120, 70)
$g.DrawRectangle($penPurple, 990, 245, 120, 70)
$g.DrawString("SERVICE 5 (REST)", $fontHeader, $brushPurple, 995, 253)
$g.DrawString("Diffuser Notifs", $fontBody, $brushDark, 995, 270)
$g.DrawString("Convention Prete", $fontMethod, $brushMuted, 995, 290)

$g.DrawLine($penGreenLine, 1110, 280, 1135, 280)

# End Event Succès
$penEndGreen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, 163, 74), 4)
$g.FillEllipse($brushStart, 1135, 264, 32, 32)
$g.DrawEllipse($penEndGreen, 1135, 264, 32, 32)
$g.DrawString("Stage Actif", $fontHeader, $brushGreen, 1125, 305)

Save-ImageDual $bmp33 "bpmn-complet.png"
$g.Dispose()
$bmp33.Dispose()


# ==============================================================================
# 2. FIGURE 36 : bpmn-connecteur.png (Configuration connecteur SOAP Service 1)
# ==============================================================================
$bmp36 = New-Object System.Drawing.Bitmap(1000, 520)
$g = [System.Drawing.Graphics]::FromImage($bmp36)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(241, 245, 249))

# Fenêtre Bonita Studio - Connecteur Wizard
$penWin = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
$g.FillRectangle([System.Drawing.Brushes]::White, 30, 20, 940, 480)
$g.DrawRectangle($penWin, 30, 20, 940, 480)

# Header de la fenêtre
$brushWinHeader = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$g.FillRectangle($brushWinHeader, 30, 20, 940, 45)
$fontModal = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Bonita Studio — Assistant de Configuration de Connecteur Web Service (SOAP 1.2)", $fontModal, [System.Drawing.Brushes]::White, 45, 32)

# Arborescence étapes à gauche
$g.FillRectangle([System.Drawing.Brushes]::AliceBlue, 30, 65, 220, 435)
$g.DrawLine($penWin, 250, 65, 250, 500)
$fontStep = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$fontStepActive = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)

$g.DrawString("1. Definition", $fontStep, $brushMuted, 45, 90)
$g.DrawString("2. WSDL & Service", $fontStepActive, $brushBlue, 45, 120)
$g.DrawString("3. Parametres d'entree", $fontStep, $brushMuted, 45, 150)
$g.DrawString("4. Mappage de sortie", $fontStep, $brushMuted, 45, 180)

# Formulaire à droite
$fontFormLabel = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$fontFormVal = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Regular)
$penInput = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1)

# Champ 1
$g.DrawString("Nom du connecteur :", $fontFormLabel, $brushDark, 280, 85)
$g.FillRectangle([System.Drawing.Brushes]::White, 280, 105, 650, 28)
$g.DrawRectangle($penInput, 280, 105, 650, 28)
$g.DrawString("VerifierEligibiliteEtudiantSOAP", $fontFormVal, $brushDark, 290, 111)

# Champ 2 - WSDL URL
$g.DrawString("URL du Document WSDL (Service 1 Etudiants) :", $fontFormLabel, $brushDark, 280, 145)
$g.FillRectangle([System.Drawing.Brushes]::White, 280, 165, 650, 28)
$g.DrawRectangle($penInput, 280, 165, 650, 28)
$g.DrawString("http://localhost:8082/service1-etudiants-soap/etudiants?wsdl", $fontFormVal, $brushBlue, 290, 171)

# Champ 3 - Port & Service
$g.DrawString("Service Name & Port Name :", $fontFormLabel, $brushDark, 280, 205)
$g.FillRectangle([System.Drawing.Brushes]::White, 280, 225, 650, 28)
$g.DrawRectangle($penInput, 280, 225, 650, 28)
$g.DrawString("EtudiantService / EtudiantServiceImplPort (JAX-WS RI)", $fontFormVal, $brushDark, 290, 231)

# Champ 4 - Opération SOAP
$g.DrawString("Operation SOAP ciblee :", $fontFormLabel, $brushDark, 280, 265)
$g.FillRectangle([System.Drawing.Brushes]::White, 280, 285, 650, 28)
$g.DrawRectangle($penInput, 280, 285, 650, 28)
$g.DrawString("verifierStatut(cne : String) : Boolean", $fontFormVal, $brushGreen, 290, 291)

# Champ 5 - Enveloppe XML générée
$g.DrawString("Enveloppe de requete generee (Template XML) :", $fontFormLabel, $brushDark, 280, 325)
$brushCodeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($brushCodeBg, 280, 345, 650, 100)
$g.DrawRectangle($penInput, 280, 345, 650, 100)
$codeXml = "<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/""`n" +
           "                  xmlns:ser=""http://service1.soa.inpt.ma/"">`n" +
           "   <soapenv:Body>`n" +
           "      <ser:verifierStatut><cne>${cne_etudiant}</cne></ser:verifierStatut>`n" +
           "   </soapenv:Body>`n" +
           "</soapenv:Envelope>"
$g.DrawString($codeXml, $fontMethod, $brushDark, 290, 350)

# Boutons en bas
$brushBtn = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
$g.FillRectangle($brushBtn, 850, 458, 80, 28)
$g.DrawString("Terminer", $fontFormLabel, [System.Drawing.Brushes]::White, 860, 463)

Save-ImageDual $bmp36 "bpmn-connecteur.png"
$g.Dispose()
$bmp36.Dispose()


# ==============================================================================
# 3. FIGURE 37 : bpmn-lancement.png (Formulaire de démarrage d'une instance Bonita)
# ==============================================================================
$bmp37 = New-Object System.Drawing.Bitmap(1000, 520)
$g = [System.Drawing.Graphics]::FromImage($bmp37)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

# Portail Bonita UI
$g.FillRectangle([System.Drawing.Brushes]::White, 40, 25, 920, 470)
$g.DrawRectangle($penBorder, 40, 25, 920, 470)

# Header Bonita Portal
$brushPortalBar = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$g.FillRectangle($brushPortalBar, 40, 25, 920, 45)
$g.DrawString("Bonita Portal User — Demarrage du Processus de Conventionnement", $fontModal, [System.Drawing.Brushes]::White, 55, 36)

# Badge Process
$g.DrawString("Processus : Processus_Validation_Stage (Version 1.0.0)", $fontFormLabel, $brushBlue, 70, 90)
$g.DrawString("Veuillez renseigner les informations de la candidature selectionnee pour instancier le workflow :", $fontSub, $brushMuted, 70, 110)

# Formulaire d'instanciation
$g.DrawString("CNE de l'Etudiant :", $fontFormLabel, $brushDark, 70, 145)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 165, 380, 30)
$g.DrawRectangle($penInput, 70, 165, 380, 30)
$g.DrawString("G138094521 (Benali Yassine)", $fontFormVal, $brushDark, 80, 172)

$g.DrawString("Identifiant de l'Offre de Stage :", $fontFormLabel, $brushDark, 500, 145)
$g.FillRectangle([System.Drawing.Brushes]::White, 500, 165, 380, 30)
$g.DrawRectangle($penInput, 500, 165, 380, 30)
$g.DrawString("1 (Stage PFE Architectures Microservices)", $fontFormVal, $brushDark, 510, 172)

$g.DrawString("Entreprise Partenaire d'Accueil :", $fontFormLabel, $brushDark, 70, 215)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 235, 380, 30)
$g.DrawRectangle($penInput, 70, 235, 380, 30)
$g.DrawString("1 - TechSolutions Maroc (Conventionnee)", $fontFormVal, $brushDark, 80, 242)

$g.DrawString("Periode Prevue du Stage :", $fontFormLabel, $brushDark, 500, 215)
$g.FillRectangle([System.Drawing.Brushes]::White, 500, 235, 380, 30)
$g.DrawRectangle($penInput, 500, 235, 380, 30)
$g.DrawString("Du 01/02/2027 au 31/07/2027 (6 mois)", $fontFormVal, $brushDark, 510, 242)

$g.DrawString("Intitule du Projet de Stage :", $fontFormLabel, $brushDark, 70, 285)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 305, 810, 30)
$g.DrawRectangle($penInput, 70, 305, 810, 30)
$g.DrawString("Conception et Deploiement d'une Architecture Microservices et Pipeline CI/CD", $fontFormVal, $brushDark, 80, 312)

# Alerte visuelle
$brushInfoAlert = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 246, 255))
$penInfoAlert = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(191, 219, 254), 1)
$g.FillRectangle($brushInfoAlert, 70, 360, 810, 50)
$g.DrawRectangle($penInfoAlert, 70, 360, 810, 50)
$g.DrawString("INFO : Le clic sur 'Demarrer le Processus' declenche le connecteur SOAP S1 pour verifier le CNE,", $fontSub, $brushBlue, 85, 370)
$g.DrawString("puis le connecteur SOAP S2 pour controler la convention de l'entreprise avant validation pedagogique.", $fontSub, $brushBlue, 85, 388)

# Bouton de lancement
$brushBtnStart = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
$g.FillRectangle($brushBtnStart, 680, 435, 200, 36)
$g.DrawString("Demarrer le Processus ➔", $fontFormLabel, [System.Drawing.Brushes]::White, 705, 444)

Save-ImageDual $bmp37 "bpmn-lancement.png"
$g.Dispose()
$bmp37.Dispose()


# ==============================================================================
# 4. FIGURE 38 : bpmn-tache-entreprise.png (Tâche de décision entreprise)
# ==============================================================================
$bmp38 = New-Object System.Drawing.Bitmap(1000, 520)
$g = [System.Drawing.Graphics]::FromImage($bmp38)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$g.FillRectangle([System.Drawing.Brushes]::White, 40, 25, 920, 470)
$g.DrawRectangle($penBorder, 40, 25, 920, 470)

# Header
$g.FillRectangle($brushPortalBar, 40, 25, 920, 45)
$g.DrawString("Bonita Portal — Tache Humaine a Traiter : Decision de l'Entreprise (Etape 6)", $fontModal, [System.Drawing.Brushes]::White, 55, 36)

# Infos Tâche
$g.DrawString("Tache assignee : Decision RH & Entretien Technique", $fontFormLabel, $brushDark, 70, 90)
$g.DrawString("Acteur connecte : M. Karim Tazi (Tuteur Entreprise - TechSolutions Maroc)", $fontSub, $brushMuted, 70, 110)

# Carte Détails Candidat
$g.FillRectangle([System.Drawing.Brushes]::AliceBlue, 70, 140, 810, 80)
$g.DrawRectangle($penInput, 70, 140, 810, 80)
$g.DrawString("CANDIDAT : Benali Yassine (CNE: G138094521) • Filiere: IDL (Genie Logiciel)", $fontFormLabel, $brushBlue, 85, 150)
$g.DrawString("Resultat Verification SOAP 1 (Etudiant) : ELIGIBLE (Annee PFE validee)", $fontSub, $brushGreen, 85, 170)
$g.DrawString("Resultat Verification SOAP 2 (Entreprise) : CONVENTIONNEE (Partenaire certifie)", $fontSub, $brushGreen, 85, 190)

# Formulaire de décision
$g.DrawString("Decision finale de l'entreprise :", $fontFormLabel, $brushDark, 70, 240)

# Radio Bouton 1 : Accepté
$g.FillEllipse($brushStart, 75, 267, 16, 16)
$g.DrawEllipse($penStart, 75, 267, 16, 16)
$g.FillEllipse([System.Drawing.Brushes]::Green, 79, 271, 8, 8)
$g.DrawString("Candidature Retenue (Generer la convention et activer le stage)", $fontFormLabel, $brushDark, 100, 267)

# Radio Bouton 2 : Refusé
$g.DrawEllipse($penBorder, 75, 297, 16, 16)
$g.DrawString("Candidature Non Retenue (Notifier le refus avec motif)", $fontFormLabel, $brushMuted, 100, 297)

# Commentaire RH
$g.DrawString("Observations & Remarques du Tuteur :", $fontFormLabel, $brushDark, 70, 330)
$g.FillRectangle([System.Drawing.Brushes]::White, 70, 350, 810, 60)
$g.DrawRectangle($penInput, 70, 350, 810, 60)
$g.DrawString("Excellent profil technique en Java/SOA. Entretien passe avec succes. Sujet valide par l'equipe Cloud.", $fontFormVal, $brushDark, 80, 360)

# Bouton Valider Tâche
$g.FillRectangle($brushBtn, 720, 435, 160, 36)
$g.DrawString("Soumettre la Decision ➔", $fontFormLabel, [System.Drawing.Brushes]::White, 735, 444)

Save-ImageDual $bmp38 "bpmn-tache-entreprise.png"
$g.Dispose()
$bmp38.Dispose()


# ==============================================================================
# 5. FIGURE 39 : bpmn-instance-terminee.png (Instance terminée avec variables)
# ==============================================================================
$bmp39 = New-Object System.Drawing.Bitmap(1000, 520)
$g = [System.Drawing.Graphics]::FromImage($bmp39)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

$g.FillRectangle([System.Drawing.Brushes]::White, 40, 25, 920, 470)
$g.DrawRectangle($penBorder, 40, 25, 920, 470)

# Header
$g.FillRectangle($brushPortalBar, 40, 25, 920, 45)
$g.DrawString("Bonita Portal Admin — Details de l'Instance Case #104 (Terminee)", $fontModal, [System.Drawing.Brushes]::White, 55, 36)

# Statut Instance
$g.DrawString("Instance ID : Case #104", $fontTitle, $brushDark, 70, 85)
$g.FillRectangle($brushStart, 270, 85, 120, 24)
$g.DrawRectangle($penStart, 270, 85, 120, 24)
$g.DrawString("STATUT : TERMINE", $fontHeader, $brushGreen, 280, 90)

$g.DrawString("Demarree le : 07/11/2026 a 18:20  •  Achevee le : 07/11/2026 a 18:22  •  Duree totale : 2 min 14 s", $fontSub, $brushMuted, 70, 115)

# Tableau des Variables du Processus
$g.DrawString("Variables du Processus enregistrees en fin d'execution :", $fontFormLabel, $brushDark, 70, 145)

$g.FillRectangle($brushLaneHeader, 70, 170, 810, 26)
$g.DrawRectangle($penBorder, 70, 170, 810, 26)
$g.DrawString("Nom de la Variable", $fontHeader, $brushDark, 80, 176)
$g.DrawString("Type", $fontHeader, $brushDark, 280, 176)
$g.DrawString("Valeur d'Execution Finale", $fontHeader, $brushDark, 450, 176)

$vars = @(
    @("cne_etudiant", "String", "G138094521"),
    @("etudiant_eligible", "Boolean", "true (Valide via SOAP S1)"),
    @("entreprise_conventionnee", "Boolean", "true (Valide via SOAP S2)"),
    @("sujet_approuve", "Boolean", "true (Validation Responsable INPT)"),
    @("decision_entreprise", "String", "ACCEPTEE (Entretien RH valide)"),
    @("stage_cree_id", "Integer", "1 (Enregistre dans MySQL via REST S6)"),
    @("statut_notification", "String", "ENVOYEE (Service 5 REST - 200 OK)")
)

$yVar = 196
foreach ($v in $vars) {
    $g.FillRectangle([System.Drawing.Brushes]::White, 70, $yVar, 810, 26)
    $g.DrawRectangle($penBorder, 70, $yVar, 810, 26)
    $g.DrawString($v[0], $fontFormVal, $brushBlue, 80, $yVar + 5)
    $g.DrawString($v[1], $fontMethod, $brushMuted, 280, $yVar + 6)
    $g.DrawString($v[2], $fontFormVal, $brushDark, 450, $yVar + 5)
    $yVar += 26
}

# Bloc résultat final
$g.FillRectangle($brushStart, 70, 395, 810, 65)
$g.DrawRectangle($penStart, 70, 395, 810, 65)
$g.DrawString("RESULTAT : Le stage est officiellement cree dans la table 'stages' (ID #1).", $fontFormLabel, $brushGreen, 85, 405)
$g.DrawString("La convention tripartite a ete generee et l'etudiant ainsi que l'entreprise ont ete notifies.", $fontSub, $brushDark, 85, 425)

Save-ImageDual $bmp39 "bpmn-instance-terminee.png"
$g.Dispose()
$bmp39.Dispose()

