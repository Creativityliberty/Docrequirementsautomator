/**
 * Generator module
 * Responsable de la génération des documents de design
 */

const fs = require('fs').promises;
const path = require('path');
const { getGeminiClient } = require('./gemini-client');
const { getPocketFlowDocs, isMCPServerAvailable } = require('./mcp-client');
const { loadTemplate, ensureDirectoryExists, replaceTemplateValues } = require('./utils');

/**
 * Génère un document de design basé sur un template et les informations du projet
 * 
 * @param {Object} options - Options de génération
 * @param {string} options.projectName - Nom du projet
 * @param {string} options.template - Nom du template à utiliser
 * @param {string} options.outputPath - Chemin de sortie pour le document généré
 * @param {string} options.description - Description du projet
 * @param {Array<string>} options.features - Fonctionnalités principales du projet
 * @param {Object} config - Configuration de l'application
 * @returns {Promise<Object>} - Résultat de la génération
 */
async function generateDesignDoc(options, config) {
  const { projectName, template, outputPath, description, features } = options;
  
  // 1. Charger le template
  const templateContent = await loadTemplate(template);
  
  // 2. Récupérer des informations supplémentaires depuis MCP si disponible
  let additionalContext = '';
  try {
    const mcpAvailable = await isMCPServerAvailable("PocketFlow Docs");
    if (mcpAvailable) {
      console.log("MCP server available, fetching additional context...");
      const pocketflowDocs = await getPocketFlowDocs("architecture patterns");
      additionalContext = `\n\nInformations supplémentaires de PocketFlow:\n${pocketflowDocs.data}`;
    }
  } catch (error) {
    console.warn("Could not fetch MCP data:", error.message);
  }
  
  // 3. Préparer les données pour l'API Gemini
  const promptData = {
    projectName,
    template: templateContent,
    description: description || `Projet ${projectName}`,
    features: features || ["Fonctionnalité 1", "Fonctionnalité 2"],
    instructions: config.instructions?.[template] || 'Créer un document de design détaillé',
    additionalContext
  };
  
  // 4. Appeler l'API Gemini pour générer le contenu
  const geminiClient = getGeminiClient(config.gemini);
  const generatedContent = await geminiClient.generateDesignDoc(promptData);
  
  // 5. Remplacer les placeholders dans le contenu généré
  const finalContent = replaceTemplateValues(generatedContent, {
    PROJECT_NAME: projectName
  });
  
  // 6. Sauvegarder le document généré
  const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-design.md`;
  const fullOutputPath = path.join(outputPath, fileName);
  
  await ensureDirectoryExists(outputPath);
  await fs.writeFile(fullOutputPath, finalContent, 'utf8');
  
  return {
    outputPath: fullOutputPath,
    content: finalContent
  };
}

/**
 * Génère un exemple de document de design basé sur un exemple existant
 * 
 * @param {string} examplePath - Chemin vers le document exemple
 * @param {Object} options - Options de génération
 * @returns {Promise<Object>} - Résultat de la génération
 */
async function generateFromExample(examplePath, options) {
  const { projectName, outputPath } = options;
  
  // 1. Charger l'exemple
  const exampleContent = await fs.readFile(examplePath, 'utf8');
  
  // 2. Adapter l'exemple au nouveau projet
  const geminiClient = getGeminiClient(options.config?.gemini);
  const adaptedContent = await geminiClient.adaptExampleDoc({
    exampleContent,
    projectName,
    description: options.description || `Projet ${projectName}`
  });
  
  // 3. Sauvegarder le document généré
  const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-design.md`;
  const fullOutputPath = path.join(outputPath, fileName);
  
  await ensureDirectoryExists(outputPath);
  await fs.writeFile(fullOutputPath, adaptedContent, 'utf8');
  
  return {
    outputPath: fullOutputPath,
    content: adaptedContent
  };
}

module.exports = {
  generateDesignDoc,
  generateFromExample
};