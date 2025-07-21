#!/bin/bash

# Script d'installation pour Design Doc Automator

echo "Installation de Design Doc Automator..."

# Installer les dépendances du backend
echo "Installation des dépendances du backend..."
cd backend
npm install
cd ..

# Installer les dépendances du frontend
echo "Installation des dépendances du frontend..."
cd frontend
npm install
cd ..

# Installer les dépendances globales
echo "Installation des dépendances globales..."
npm install

echo "Installation terminée avec succès !"
echo "Pour démarrer l'application :"
echo "- Backend : cd backend && npm run dev"
echo "- Frontend : cd frontend && npm start"