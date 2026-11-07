@echo off
chcp 65001 >nul
echo Lancement du test global des 6 services SOA...
node scripts/test-all-services.js
pause

