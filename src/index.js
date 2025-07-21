/**
 * Design Document Automator
 * Point d'entrée principal de l'application
 */

const path = require('path');
const { generateDesignDoc, generateFromExample } = require('./generator');
const { loadConfig } = require('./utils');
const { isMCPServerAvailable } = require('./mcp-client');
const { getGeminiClient } = require('./gemini-client');
const { createModelsManager } = require('./models-manager');

/**
 * Fonction principale de l'application
 * 
 * @param {Object} options - Options de génération
 * @param {string} options.mode - Mode de génération ('template' ou 'example')
 * @param {string} options.projectName - Nom du projet
 * @param {string} options.template - Nom du template à utiliser (pour mode 'template')
 * @param {string} options.examplePath - Chemin vers le document exemple (pour mode 'example')
 * @param {string} options.outputPath - Chemin de sortie pour le document généré
 * @param {string} options.description - Description du projet
 * @param {Array<string>} options.features - Fonctionnalités principales du projet
 * @param {Object} options.config - Configuration de l'application (optionnel)
 * @returns {Promise<Object>} - Résultat de la génération
 */
async function main(options = {}) {
  try {
    console.log('Design Document Automator - Starting...');
    
    // Utiliser les options fournies ou les arguments de ligne de commande
    const mode = options.mode || (process.argv.includes('--use-example') ? 'example' : 'template');
    const projectName = options.projectName || process.argv[2] || 'MyProject';
    const outputPath = options.outputPath || process.argv[4] || path.resolve(__dirname, '../output');
    const description = options.description || process.argv[5] || `Projet ${projectName}`;
    
    // Charger la configuration
    const config = options.config || loadConfig();
    
    // Vérifier la disponibilité des serveurs MCP
    try {
      const mcpAvailable = await isMCPServerAvailable("PocketFlow Docs");
      console.log(`MCP Server "PocketFlow Docs" available: ${mcpAvailable}`);
    } catch (error) {
      console.warn("Could not check MCP server availability:", error.message);
    }
    
    // Initialiser le gestionnaire de modèles
    const modelsManager = createModelsManager(config);
    
    // Afficher les informations sur le modèle utilisé
    const modelName = config.gemini.model;
    console.log(`Using Gemini model: ${modelName}`);
    
    let result;
    
    if (mode === 'example') {
      // Générer à partir d'un exemple existant
      const examplePath = options.examplePath || process.argv[3] || path.resolve(__dirname, '../../Design.md');
      console.log(`Generating from example: ${examplePath}`);
      
      result = await generateFromExample(examplePath, {
        projectName,
        outputPath,
        description,
        config
      });
      
      console.log(`Design document generated from example: ${result.outputPath}`);
    } else {
      // Générer à partir d'un template
      const template = options.template || process.argv[3] || 'pocketflow';
      const features = options.features || (process.argv[6] ? process.argv[6].split(',') : undefined);
      
      console.log(`Generating from template: ${template}`);
      
      result = await generateDesignDoc({
        projectName,
        template,
        outputPath,
        description,
        features
      }, config);
      
      console.log(`Design document generated successfully: ${result.outputPath}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating design document:', error);
    if (!options.suppressExit) {
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Affiche l'aide de l'application
 */
function showHelp() {
  console.log(`
Design Document Automator - Help

Usage:
  node index.js [projectName] [template|--use-example] [outputPath] [description] [features]

Options:
  projectName       Nom du projet (défaut: 'MyProject')
  template          Nom du template à utiliser (défaut: 'pocketflow')
  --use-example     Utiliser un exemple existant au lieu d'un template
  outputPath        Chemin de sortie pour le document généré (défaut: '../output')
  description       Description du projet
  features          Liste de fonctionnalités séparées par des virgules
  --model           Modèle Gemini à utiliser (défaut: gemini-2.5-pro)
  --help, -h        Affiche cette aide

Examples:
  node index.js "Mon Projet" pocketflow
  node index.js "Mon Projet" --use-example ../../Design.md
  node index.js "Mon Projet" pocketflow ./output "Description" "Feature1,Feature2" --model gemini-2.5-flash
  
Pour une interface en ligne de commande plus complète, utilisez:
  node cli.js help
  `);
}

// Exécuter le programme ou afficher l'aide
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
} else if (require.main === module) {
  main();
}

module.exports = { main };