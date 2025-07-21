#!/usr/bin/env node

/**
 * Interface en ligne de commande pour Design Document Automator
 */

const { main } = require('./index');
const { loadConfig } = require('./utils');
const { getGeminiClient } = require('./gemini-client');
const { createModelsManager } = require('./models-manager');
const path = require('path');

/**
 * Affiche l'aide de l'application
 */
function showHelp() {
  console.log(`
Design Document Automator - CLI
===============================

Génère automatiquement des documents de design basés sur PocketFlow

Usage:
  design-doc [command] [options]

Commands:
  generate              Génère un document de design à partir d'un template
  adapt                 Adapte un document existant pour un nouveau projet
  models               Liste les modèles Gemini disponibles
  help                 Affiche cette aide

Options pour 'generate':
  --project, -p        Nom du projet (obligatoire)
  --template, -t       Template à utiliser (défaut: pocketflow)
  --output, -o         Dossier de sortie (défaut: ./output)
  --description, -d    Description du projet
  --features, -f       Liste de fonctionnalités séparées par des virgules
  --model, -m          Modèle Gemini à utiliser (défaut: gemini-2.5-pro)

Options pour 'adapt':
  --project, -p        Nom du nouveau projet (obligatoire)
  --example, -e        Chemin vers le document exemple (obligatoire)
  --output, -o         Dossier de sortie (défaut: ./output)
  --description, -d    Description du nouveau projet
  --model, -m          Modèle Gemini à utiliser (défaut: gemini-2.5-pro)

Options pour 'models':
  --detail, -d         Affiche les détails des modèles

Examples:
  design-doc generate --project "Mon Projet" --description "Un système de gestion de tâches"
  design-doc adapt --project "Mon Projet" --example ./examples/design.md
  design-doc models --detail
  `);
}

/**
 * Parse les arguments de la ligne de commande
 * 
 * @param {Array<string>} args - Arguments de la ligne de commande
 * @returns {Object} - Options parsées
 */
function parseArgs(args) {
  const options = {
    command: 'generate',
    project: null,
    template: 'pocketflow',
    output: './output',
    description: '',
    features: [],
    example: null,
    model: null,
    detail: false
  };

  // Extraire la commande
  if (args[0] && !args[0].startsWith('-')) {
    options.command = args[0];
    args = args.slice(1);
  }

  // Parser les options
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--project':
      case '-p':
        options.project = args[++i];
        break;
      case '--template':
      case '-t':
        options.template = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--description':
      case '-d':
        if (options.command === 'models') {
          options.detail = true;
        } else {
          options.description = args[++i];
        }
        break;
      case '--features':
      case '-f':
        options.features = args[++i].split(',').map(f => f.trim());
        break;
      case '--example':
      case '-e':
        options.example = args[++i];
        break;
      case '--model':
      case '-m':
        options.model = args[++i];
        break;
      case '--detail':
        options.detail = true;
        break;
      case '--help':
      case '-h':
        options.command = 'help';
        break;
    }
  }

  return options;
}

/**
 * Liste les modèles Gemini disponibles
 * 
 * @param {Object} options - Options de la commande
 * @param {Object} config - Configuration de l'application
 */
async function listModels(options, config) {
  try {
    console.log('Récupération des modèles Gemini disponibles...\n');
    
    const client = getGeminiClient(config.gemini);
    const modelInfo = await client.getModelInfo();
    
    console.log('Modèle actuel:', modelInfo.currentModel);
    console.log('\nModèles disponibles:');
    
    modelInfo.availableModels.forEach(model => {
      console.log(`\n- ${model.name} (${model.id})`);
      
      if (options.detail) {
        console.log(`  Description: ${model.description}`);
        if (model.bestFor && model.bestFor.length > 0) {
          console.log('  Recommandé pour:');
          model.bestFor.forEach(use => console.log(`    - ${use}`));
        }
        if (model.inputTypes && model.inputTypes.length > 0) {
          console.log(`  Types d'entrée: ${model.inputTypes.join(', ')}`);
        }
      }
    });
    
    console.log('\nModèles recommandés par type de tâche:');
    const modelsManager = createModelsManager(config);
    console.log(`- Document de design: ${modelsManager.getRecommendedModel('designDoc')}`);
    console.log(`- Brouillon rapide: ${modelsManager.getRecommendedModel('quickDraft')}`);
    console.log(`- Génération de code: ${modelsManager.getRecommendedModel('codeGeneration')}`);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error.message);
    process.exit(1);
  }
}

/**
 * Point d'entrée de l'interface en ligne de commande
 */
async function cli() {
  // Parser les arguments
  const options = parseArgs(process.argv.slice(2));
  
  // Afficher l'aide si demandé
  if (options.command === 'help') {
    showHelp();
    return;
  }
  
  try {
    // Charger la configuration
    const config = loadConfig();
    
    // Si un modèle spécifique est demandé, le définir dans la configuration
    if (options.model) {
      config.gemini.model = options.model;
    }
    
    // Exécuter la commande appropriée
    switch (options.command) {
      case 'generate':
        if (!options.project) {
          console.error('Erreur: Le nom du projet est obligatoire');
          console.log('Utilisez --project "Nom du projet" ou -p "Nom du projet"');
          process.exit(1);
        }
        
        await main({
          mode: 'template',
          projectName: options.project,
          template: options.template,
          outputPath: options.output,
          description: options.description,
          features: options.features,
          config
        });
        break;
        
      case 'adapt':
        if (!options.project) {
          console.error('Erreur: Le nom du projet est obligatoire');
          console.log('Utilisez --project "Nom du projet" ou -p "Nom du projet"');
          process.exit(1);
        }
        
        if (!options.example) {
          console.error('Erreur: Le chemin vers le document exemple est obligatoire');
          console.log('Utilisez --example "./chemin/vers/exemple.md" ou -e "./chemin/vers/exemple.md"');
          process.exit(1);
        }
        
        await main({
          mode: 'example',
          projectName: options.project,
          examplePath: options.example,
          outputPath: options.output,
          description: options.description,
          config
        });
        break;
        
      case 'models':
        await listModels(options, config);
        break;
        
      default:
        console.error(`Commande inconnue: ${options.command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter le CLI si appelé directement
if (require.main === module) {
  cli();
}

module.exports = { cli };