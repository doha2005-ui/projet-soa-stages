@echo off
REM ==============================================================
REM Script de test réseau : Service 2 (SOAP) et Service 6 (REST)
REM ==============================================================

cd /d "%~dp0"
echo ==============================================================
echo   Lancement des tests automatises Service 2 et Service 6...
echo ==============================================================
node scripts\test-services-2-and-6.js
pause

