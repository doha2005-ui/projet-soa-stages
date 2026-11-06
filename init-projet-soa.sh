#!/usr/bin/env bash
# ==============================================================================
# Script d'initialisation : Projet SOA 2026-2027 - Gestion intelligente des stages
# ==============================================================================

set -e

echo "=============================================================="
echo "  Projet SOA 2026-2027 : Gestion Intelligente des Stages"
echo "  Architecture Distribuée : 3 SOAP, 3 REST, BPMN Bonita"
echo "=============================================================="

# 1. Vérification des prérequis
echo ""
echo "[1/4] Vérification des prérequis système..."

command -v java >/dev/null 2>&1 || { echo "❌ Java n'est pas installé (JDK 11+ requis)"; exit 1; }
JAVA_VER=$(java -version 2>&1 | head -n 1)
echo "  ✓ Java détecté : $JAVA_VER"

command -v mvn >/dev/null 2>&1 || { echo "❌ Maven n'est pas installé (3.8+ requis)"; exit 1; }
MVN_VER=$(mvn -v 2>&1 | head -n 1)
echo "  ✓ Maven détecté : $MVN_VER"

# 2. Configuration des fichiers de propriétés de base de données
echo ""
echo "[2/4] Vérification des fichiers de configuration db.properties..."

SERVICES=(
  "service1-etudiants-soap"
  "service2-entreprises-soap"
  "service3-offres-soap"
  "service4-candidatures-rest"
  "service5-notifications-rest"
  "service6-suivi-stages-rest"
)

for SVC in "${SERVICES[@]}"; do
  PROP_EXAMPLE="$SVC/src/main/resources/db.properties.example"
  PROP_TARGET="$SVC/src/main/resources/db.properties"
  if [ -f "$PROP_EXAMPLE" ] && [ ! -f "$PROP_TARGET" ]; then
    cp "$PROP_EXAMPLE" "$PROP_TARGET"
    echo "  ✓ Créé $PROP_TARGET à partir de l'exemple"
  fi
done

# 3. Structure du Front-end
echo ""
echo "[3/4] Structure du Front-end par service :"
echo "  - Membre 1 : frontend/pages/etudiants & frontend/pages/notifications"
echo "  - Membre 2 : frontend/pages/entreprises & frontend/pages/stages"
echo "  - Membre 3 : frontend/pages/offres & frontend/pages/candidatures"
echo "  - Membre 4 : frontend/shared (config.js, api.js, soap.js, theme.css), index.html & bpmn"

# 4. Mode d'exécution
echo ""
echo "[4/4] Prêt ! Comment exécuter le front-end :"
echo "  Option A (Serveur local Node) : node frontend/server.js (ou cd frontend && node server.js)"
echo "  Option B (Recommandée Tomcat) : Déployer le dossier 'frontend' dans tomcat/webapps/frontend"
echo "  Option C (Python si installé) : cd frontend && python3 -m http.server 3000"
echo "                                  Puis ouvrir http://localhost:3000"
echo ""
echo "=============================================================="
echo "  Initialisation terminée avec succès !"
echo "=============================================================="

