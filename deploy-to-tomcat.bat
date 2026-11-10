@echo off
REM ==============================================================
REM Script de deploiement automatique vers Apache Tomcat 9
REM ==============================================================

set "TOMCAT_WEBAPPS=C:\Users\dell\apache-tomcat-9.0.122\webapps"
set "PROJECT_DIR=%~dp0"

echo ==============================================================
echo   Deploiement des services vers Tomcat webapps
echo   Destination : %TOMCAT_WEBAPPS%
echo ==============================================================

if not exist "%TOMCAT_WEBAPPS%" (
    echo [ERREUR] Dossier webapps introuvable : %TOMCAT_WEBAPPS%
    pause
    exit /b 1
)

REM 1. Deploiement des fichiers .war des services
for %%S in (
    service1-etudiants-soap
    service2-entreprises-soap
    service3-offres-soap
    service4-candidatures-rest
    service5-notifications-rest
    service6-suivi-stages-rest
) do (
    if exist "%PROJECT_DIR%%%S\target\%%S.war" (
        echo [OK] Copie de %%S.war...
        copy /Y "%PROJECT_DIR%%%S\target\%%S.war" "%TOMCAT_WEBAPPS%\" >nul
    ) else (
        echo [--] %%S.war non trouve dans %%S\target\ (pas encore compile)
    )
)

REM 2. Deploiement du front-end
if exist "%PROJECT_DIR%frontend" (
    echo [OK] Copie du dossier frontend vers webapps\frontend...
    xcopy /E /I /Y "%PROJECT_DIR%frontend" "%TOMCAT_WEBAPPS%\frontend" >nul
)

echo.
echo ==============================================================
echo   Deploiement termine !
echo   Regardez le terminal de Tomcat : il a recharge les services.
echo ==============================================================
pause

