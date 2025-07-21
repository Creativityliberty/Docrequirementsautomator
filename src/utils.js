/**
 * Utilitaires pour le Design Document Automator
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Charge la configuration depuis le fichier de configuration
 * 
 * @param {string} configPath - Chemin vers le fichier de configuration (optionnel)
 * @returns {Object} - Configuration chargée
 */
function loadConfig(configPath = '../config/default.json') {
  try {
    // Utiliser require pour charger la configuration JSON
    const config = require(configPath);
    return config;
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    throw new Error(`Failed to load configuration: ${error.message}`);
  }
}

/**
 * Charge un template depuis le dossier des templates
 * 
 * @param {string} templateName - Nom du template à charger
 * @param {string} templatesDir - Dossier contenant les templates (optionnel)
 * @returns {Promise<string>} - Contenu du template
 */
async function loadTemplate(templateName, templatesDir = null) {
  // Utiliser un chemin absolu pour éviter les problèmes de chemin relatif
  const basePath = path.resolve(__dirname, '..');
  const templatePath = templatesDir 
    ? path.join(templatesDir, `${templateName}-template.md`)
    : path.join(basePath, 'templates', `${templateName}-template.md`);
  
  try {
    console.log(`Loading template from: ${templatePath}`);
    const content = await fs.readFile(templatePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load template ${templateName}: ${error.message}`);
  }
}

/**
 * S'assure qu'un répertoire existe, le crée si nécessaire
 * 
 * @param {string} dirPath - Chemin du répertoire
 * @returns {Promise<void>}
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    // Le répertoire n'existe pas, on le crée
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Remplace les placeholders dans un template
 * 
 * @param {string} template - Contenu du template
 * @param {Object} values - Valeurs à remplacer
 * @returns {string} - Template avec les valeurs remplacées
 */
function replaceTemplateValues(template, values) {
  let result = template;
  
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return result;
}

module.exports = {
  loadConfig,
  loadTemplate,
  ensureDirectoryExists,
  replaceTemplateValues
};