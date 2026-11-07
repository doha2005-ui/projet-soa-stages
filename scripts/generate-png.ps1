Add-Type -AssemblyName System.Drawing

$width = 1100
$height = 520
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::White)

# Polices
$fontTitle = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$fontHeader = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$fontBody = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$fontMethod = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
$fontGate = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)

# Cadre général
$penBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($brushBg, 20, 15, 1060, 485)
$g.DrawRectangle($penBorder, 20, 15, 1060, 485)

# Titre
$brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))
$g.DrawString("Figure 34 : Detail des Passerelles de Decision (Workflow des Candidatures)", $fontTitle, $brushDark, 40, 35)
$g.DrawString("Passerelle 1 (Etape 5) : Eligibilite SOAP S1/S2  •  Passerelle 2 (Etape 7) : Decision Entreprise  •  Sous-processus groupe", $fontSub, $brushMuted, 40, 60)

# Stylos flèches
$penLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(51, 65, 85), 2)
$penGreen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(5, 150, 105), 2)
$penRed = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 38, 38), 2)

$penLine.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)
$penGreen.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)
$penRed.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(4, 5)

# Début
$brushStart = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 252, 231))
$penStart = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, 163, 74), 2.5)
$g.FillEllipse($brushStart, 65, 192, 36, 36)
$g.DrawEllipse($penStart, 65, 192, 36, 36)
$g.DrawString("Debut", $fontMethod, $brushDark, 68, 235)

# Connexions
$g.DrawLine($penLine, 101, 210, 150, 210)
$g.DrawLine($penLine, 280, 210, 315, 210)
$g.DrawLine($penLine, 445, 210, 485, 210)

# Boîte 1 : SOAP S1
$brushTask = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$penTaskBlue = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(59, 130, 246), 2)
$g.FillRectangle($brushTask, 150, 165, 130, 90)
$g.DrawRectangle($penTaskBlue, 150, 165, 130, 90)
$brushBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
$g.DrawString("SERVICE 1 (SOAP)", $fontHeader, $brushBlue, 158, 175)
$g.DrawString("Verification CNE", $fontBody, $brushDark, 158, 195)
$g.DrawString("& Eligibilite", $fontBody, $brushDark, 158, 212)
$g.DrawString("verifierStatut()", $fontMethod, $brushMuted, 158, 232)

# Boîte 2 : SOAP S2
$g.FillRectangle($brushTask, 315, 165, 130, 90)
$g.DrawRectangle($penTaskBlue, 315, 165, 130, 90)
$g.DrawString("SERVICE 2 (SOAP)", $fontHeader, $brushBlue, 323, 175)
$g.DrawString("Verification", $fontBody, $brushDark, 323, 195)
$g.DrawString("Convention Entreprise", $fontBody, $brushDark, 323, 212)
$g.DrawString("verifierEntreprise()", $fontMethod, $brushMuted, 323, 232)

# Passerelle 1 (Losange)
$brushYellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 249, 195))
$penYellow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(202, 138, 4), 2)
$pts1 = @(
    (New-Object System.Drawing.Point(510, 185)),
    (New-Object System.Drawing.Point(535, 210)),
    (New-Object System.Drawing.Point(510, 235)),
    (New-Object System.Drawing.Point(485, 210))
)
$g.FillPolygon($brushYellow, $pts1)
$g.DrawPolygon($penYellow, $pts1)
$brushGateTxt = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(133, 77, 14))
$g.DrawString("X", $fontGate, $brushGateTxt, 500, 195)
$g.DrawString("Passerelle 1 (Etape 5)", $fontHeader, $brushGateTxt, 460, 150)
$g.DrawString("Eligible ?", $fontSub, $brushDark, 488, 165)

# Passerelle 1 - Branche Oui
$g.DrawLine($penGreen, 535, 210, 600, 210)
$brushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(5, 150, 105))
$g.DrawString("Oui (Conforme)", $fontMethod, $brushGreen, 538, 195)

# Passerelle 1 - Branche Non
$penRedNoCap = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 38, 38), 2)
$g.DrawLine($penRedNoCap, 510, 235, 510, 370)
$g.DrawLine($penRed, 510, 370, 560, 370)
$brushRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 38, 38))
$g.DrawString("Non (Ineligible)", $fontMethod, $brushRed, 515, 270)

# Tâche Rejet 1
$brushRedBox = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 242, 242))
$penRedBox = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(239, 68, 68), 1.5)
$g.FillRectangle($brushRedBox, 560, 335, 130, 70)
$g.DrawRectangle($penRedBox, 560, 335, 130, 70)
$g.DrawString("SERVICE 5 (REST)", $fontHeader, $brushRed, 568, 345)
$g.DrawString("Notifier Rejet", $fontBody, $brushDark, 568, 362)
$g.DrawString("POST /api/notifications", $fontMethod, $brushMuted, 568, 380)

# Fin Rejet 1
$g.DrawLine($penLine, 690, 370, 725, 370)
$brushRedCircle = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 226, 226))
$g.FillEllipse($brushRedCircle, 725, 355, 30, 30)
$g.DrawEllipse($penRedBox, 725, 355, 30, 30)
$g.DrawString("Rejet", $fontMethod, $brushRed, 727, 390)

# Boîte 3 : Décision Entreprise
$penTaskGreen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 2)
$g.FillRectangle($brushTask, 600, 165, 130, 90)
$g.DrawRectangle($penTaskGreen, 600, 165, 130, 90)
$g.DrawString("TACHE HUMAINE", $fontHeader, $brushGreen, 608, 175)
$g.DrawString("Decision RH &", $fontBody, $brushDark, 608, 195)
$g.DrawString("Entretien Entreprise", $fontBody, $brushDark, 608, 212)
$g.DrawString("Etape 6 : Evaluation", $fontMethod, $brushMuted, 608, 232)

$g.DrawLine($penLine, 730, 210, 770, 210)

# Passerelle 2 (Losange)
$pts2 = @(
    (New-Object System.Drawing.Point(795, 185)),
    (New-Object System.Drawing.Point(820, 210)),
    (New-Object System.Drawing.Point(795, 235)),
    (New-Object System.Drawing.Point(770, 210))
)
$g.FillPolygon($brushYellow, $pts2)
$g.DrawPolygon($penYellow, $pts2)
$g.DrawString("X", $fontGate, $brushGateTxt, 785, 195)
$g.DrawString("Passerelle 2 (Etape 7)", $fontHeader, $brushGateTxt, 745, 150)
$g.DrawString("Retenu(e) ?", $fontSub, $brushDark, 773, 165)

# Passerelle 2 - Branche Oui
$g.DrawLine($penGreen, 820, 210, 875, 210)
$g.DrawString("Acceptee", $fontMethod, $brushGreen, 824, 195)

# Passerelle 2 - Branche Non
$g.DrawLine($penRedNoCap, 795, 235, 795, 370)
$g.DrawLine($penRed, 795, 370, 840, 370)
$g.DrawString("Refusee", $fontMethod, $brushRed, 800, 270)

# Tâche Rejet 2
$g.FillRectangle($brushRedBox, 840, 335, 130, 70)
$g.DrawRectangle($penRedBox, 840, 335, 130, 70)
$g.DrawString("SERVICE 5 (REST)", $fontHeader, $brushRed, 848, 345)
$g.DrawString("Notifier Refus RH", $fontBody, $brushDark, 848, 362)
$g.DrawString("POST /api/notifications", $fontMethod, $brushMuted, 848, 380)

$g.DrawLine($penLine, 970, 370, 1000, 370)
$g.FillEllipse($brushRedCircle, 1000, 355, 30, 30)
$g.DrawEllipse($penRedBox, 1000, 355, 30, 30)
$g.DrawString("Refuse", $fontMethod, $brushRed, 1000, 390)

# Boîte Finale : Service 6 REST
$penTaskPurple = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(139, 92, 246), 2)
$brushPurple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(124, 58, 237))
$g.FillRectangle($brushTask, 875, 165, 130, 90)
$g.DrawRectangle($penTaskPurple, 875, 165, 130, 90)
$g.DrawString("SERVICE 6 (REST)", $fontHeader, $brushPurple, 883, 175)
$g.DrawString("Creation Stage", $fontBody, $brushDark, 883, 195)
$g.DrawString("& Convention", $fontBody, $brushDark, 883, 212)
$g.DrawString("POST /api/stages", $fontMethod, $brushMuted, 883, 232)

$g.DrawLine($penGreen, 1005, 210, 1040, 210)

# Fin Succès
$penEndGreen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, 163, 74), 4)
$g.FillEllipse($brushStart, 1040, 192, 36, 36)
$g.DrawEllipse($penEndGreen, 1040, 192, 36, 36)
$g.DrawString("Stage Actif", $fontBody, $brushGreen, 1025, 235)

# Sauvegarde dans les deux emplacements (docs/images et images/)
$bmp.Save("docs/images/bpmn-passerelle.png", [System.Drawing.Imaging.ImageFormat]::Png)

New-Item -ItemType Directory -Path "images" -Force -ErrorAction SilentlyContinue | Out-Null
$bmp.Save("images/bpmn-passerelle.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Host "Images générées : docs/images/bpmn-passerelle.png et images/bpmn-passerelle.png"

