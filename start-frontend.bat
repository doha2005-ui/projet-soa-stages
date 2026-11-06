@echo off
REM ==============================================================
REM Lanceur rapide du serveur Front-end SOA (Node.js)
REM ==============================================================

cd /d "%~dp0frontend"
echo ==============================================================
echo   Demarrage du serveur Front-end SOA...
echo ==============================================================
node server.js
pause

