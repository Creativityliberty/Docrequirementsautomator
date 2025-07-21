#!/bin/bash

# Script pour démarrer le backend et le frontend

echo "Démarrage de Design Doc Automator..."

# Créer les dossiers nécessaires s'ils n'existent pas
mkdir -p design-doc-automator/output
mkdir -p design-doc-automator/templates

# Installer les dépendances si nécessaire
if [ ! -d "design-doc-automator/node_modules" ]; then
  echo "Installation des dépendances principales..."
  cd design-doc-automator
  npm install
  cd ..
fi

if [ ! -d "design-doc-automator/backend/node_modules" ]; then
  echo "Installation des dépendances du backend..."
  cd design-doc-automator/backend
  npm install express cors body-parser uuid
  cd ../..
fi

if [ ! -d "design-doc-automator/frontend/node_modules" ]; then
  echo "Installation des dépendances du frontend..."
  cd design-doc-automator/frontend
  npm install
  cd ../..
fi

# Démarrer le backend en arrière-plan
echo "Démarrage du backend..."
cd design-doc-automator/backend
node server.js &
BACKEND_PID=$!
cd ../..

# Attendre que le backend soit prêt
echo "Attente du démarrage du backend..."
sleep 3

# Démarrer le frontend
echo "Démarrage du frontend..."
cd design-doc-automator/frontend
npm start

# Quand le frontend se termine, arrêter le backend
echo "Arrêt du backend..."
kill $BACKEND_PID