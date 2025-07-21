#!/usr/bin/env node
/**
 * Script d'intégration pour npm pour exécuter le système PocketFlow
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Vérifier si Python est installé
function checkPythonInstalled() {
  try {
    const result = require('child_process').spawnSync('python3', ['--version']);
    if (result.status !== 0) {
      console.error('❌ Python 3 n\'est pas installé ou n\'est pas dans le PATH');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Python 3 n\'est pas installé ou n\'est pas dans le PATH');
    process.exit(1);
  }
}

// Vérifier si les dépendances Python sont installées
function checkPythonDependencies() {
  // Pour l'instant, nous n'avons besoin que de httpx
  try {
    const result = require('child_process').spawnSync('pip3', ['show', 'httpx']);
    if (result.status !== 0) {
      console.log('📦 Installation de la dépendance Python httpx...');
      require('child_process').spawnSync('pip3', ['install', 'httpx'], { stdio: 'inherit' });
    }
  } catch (error) {
    console.log('📦 Installation de la dépendance Python httpx...');
    require('child_process').spawnSync('pip3', ['install', 'httpx'], { stdio: 'inherit' });
  }
}

// Exécuter le script Python
function runPythonScript(args) {
  const scriptPath = path.join(__dirname, 'update_docs.py');
  
  // Rendre le script exécutable
  fs.chmodSync(scriptPath, '755');
  
  // Construire les arguments
  const pythonArgs = [scriptPath, ...args];
  
  // Exécuter le script
  const pythonProcess = spawn('python3', pythonArgs, { stdio: 'inherit' });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Le script Python s'est terminé avec le code ${code}`);
      process.exit(code);
    }
  });
}

// Fonction principale
function main() {
  console.log('🚀 Démarrage de la mise à jour automatique des documents...');
  
  // Vérifier les prérequis
  checkPythonInstalled();
  checkPythonDependencies();
  
  // Récupérer les arguments
  const args = process.argv.slice(2);
  
  // Exécuter le script Python
  runPythonScript(args);
}

// Exécuter la fonction principale
main();
