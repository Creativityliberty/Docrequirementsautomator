/**
 * Service pour la génération de documents
 * Fait le lien entre l'API et le générateur existant
 */

const path = require('path');
const fs = require('fs').promises;
const { main } = require('../../src/index');
const { generateFromExample } = require('../../src/generator');
const { loadConfig } = require('../../src/utils');

/**
 * Génère un document de design
 * 
 * @param {Object} options - Options de génération
 * @param {string} options.projectName - Nom du projet
 * @param {string} options.description - Description du projet
 * @param {Array<string>} options.features - Fonctionnalités principales
 * @param {string} options.template - Template à utiliser
 * @param {string} options.model - Modèle Gemini à utiliser
 * @returns {Promise<Object>} - Résultat de la génération
 */
exports.generateDocument = async (options) => {
  try {
    const { projectName, description, features, template, model } = options;
    
    // Charger la configuration
    const config = loadConfig();
    
    // Mettre à jour le modèle si spécifié
    if (model) {
      config.gemini.model = model;
    }
    
    // Chemin de sortie pour le document généré
    const outputPath = path.resolve(__dirname, '../../output');
    
    // Générer le document
    const result = await main({
      mode: 'template',
      projectName,
      template,
      outputPath,
      description,
      features,
      config,
      suppressExit: true // Éviter de quitter le processus en cas d'erreur
    });
    
    return result;
  } catch (error) {
    console.error('Error in generateDocument service:', error);
    throw new Error(`Failed to generate document: ${error.message}`);
  }
};

/**
 * Adapte un document existant
 * 
 * @param {Object} options - Options d'adaptation
 * @param {string} options.projectName - Nom du projet
 * @param {string} options.description - Description du projet
 * @param {string} options.exampleContent - Contenu du document exemple
 * @param {string} options.model - Modèle Gemini à utiliser
 * @returns {Promise<Object>} - Résultat de l'adaptation
 */
exports.adaptDocument = async (options) => {
  try {
    const { projectName, description, exampleContent, model } = options;
    
    // Charger la configuration
    const config = loadConfig();
    
    // Mettre à jour le modèle si spécifié
    if (model) {
      config.gemini.model = model;
    }
    
    // Chemin de sortie pour le document généré
    const outputPath = path.resolve(__dirname, '../../output');
    
    // Créer un fichier temporaire pour le contenu exemple
    const tempFilePath = path.join(outputPath, `temp-example-${Date.now()}.md`);
    await fs.writeFile(tempFilePath, exampleContent, 'utf8');
    
    // Adapter le document
    const result = await generateFromExample(tempFilePath, {
      projectName,
      outputPath,
      description,
      config
    });
    
    // Supprimer le fichier temporaire
    try {
      await fs.unlink(tempFilePath);
    } catch (error) {
      console.warn(`Could not delete temporary file ${tempFilePath}:`, error);
    }
    
    return result;
  } catch (error) {
    console.error('Error in adaptDocument service:', error);
    throw new Error(`Failed to adapt document: ${error.message}`);
  }
};

/**
 * Récupère la liste des templates disponibles
 * 
 * @returns {Promise<Array>} - Liste des templates
 */
exports.getTemplates = async () => {
  try {
    const templatesDir = path.resolve(__dirname, '../../templates');
    const files = await fs.readdir(templatesDir);
    
    // Filtrer pour ne garder que les fichiers .md
    const templateFiles = files.filter(file => file.endsWith('-template.md'));
    
    // Extraire les noms des templates
    const templates = templateFiles.map(file => {
      const templateName = file.replace('-template.md', '');
      return {
        name: templateName,
        path: path.join(templatesDir, file)
      };
    });
    
    return templates;
  } catch (error) {
    console.error('Error getting templates:', error);
    throw new Error(`Failed to get templates: ${error.message}`);
  }
};