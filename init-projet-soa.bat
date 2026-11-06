@echo off
REM ==============================================================================
REM Script d'initialisation Windows : Projet SOA 2026-2027
REM ==============================================================================

echo ==============================================================
echo   Projet SOA 2026-2027 : Gestion Intelligente des Stages
echo   Architecture Distribuee : 3 SOAP, 3 REST, BPMN Bonita
echo ==============================================================
echo.

echo [1/3] Verification des fichiers db.properties...
for %%S in (
  service1-etudiants-soap
  service2-entreprises-soap
  service3-offres-soap
  service4-candidatures-rest
  service5-notifications-rest
  service6-suivi-stages-rest
) do (
  if exist "%%S\src\main\resources\db.properties.example" (
    if not exist "%%S\src\main\resources\db.properties" (
      copy "%%S\src\main\resources\db.properties.example" "%%S\src\main\resources\db.properties" >nul
      echo   - Cree: %%S\src\main\resources\db.properties
    )
  )
)

echo.
echo [2/3] Structure Frontend par Service :
echo   - Membre 1 : frontend/pages/etudiants et frontend/pages/notifications
echo   - Membre 2 : frontend/pages/entreprises et frontend/pages/stages
echo   - Membre 3 : frontend/pages/offres et frontend/pages/candidatures
echo   - Membre 4 : frontend/shared (config.js, api.js, soap.js, theme.css), index.html et bpmn
echo.

echo [3/3] Execution du frontend :
echo   - Option 1 (Recommandee) : Double-cliquez sur 'start-frontend.bat' ou lancez 'node frontend/server.js'
echo   - Option 2 (Tomcat)      : Copiez le dossier 'frontend' dans %CATALINA_HOME%\webapps\frontend
echo   - Option 3 (VS Code)     : Clic-droit sur 'frontend/index.html' ^> Open with Live Server
echo.
echo ==============================================================
echo   Initialisation terminee avec succes !
echo ==============================================================

