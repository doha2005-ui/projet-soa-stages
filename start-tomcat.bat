@echo off
REM ==============================================================
REM Script pour lancer Apache Tomcat localement
REM ==============================================================

set "TOMCAT_DIR=C:\Users\dell\apache-tomcat-9.0.122"

if exist "%TOMCAT_DIR%\bin\startup.bat" (
    echo ==============================================================
    echo   Demarrage d'Apache Tomcat 9 depuis :
    echo   %TOMCAT_DIR%
    echo ==============================================================
    cd /d "%TOMCAT_DIR%\bin"
    call startup.bat
) else (
    echo [ERREUR] Le dossier Tomcat n'a pas ete trouve dans : %TOMCAT_DIR%
    echo Veuillez verifier l'emplacement de votre dossier Tomcat.
    pause
)

