/**
 * Service pour la gestion des templates
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Chemin vers le dossier des templates
 */
const templatesDir = path.resolve(__dirname, '../../templates');

/**
 * Récupère tous les templates
 * 
 * @returns {Promise<Array>} - Liste des templates
 */
exports.getAllTemplates = async () => {
  try {
    // Lire le contenu du dossier des templates
    const files = await fs.readdir(templatesDir);
    
    // Filtrer pour ne garder que les fichiers .md
    const templateFiles = files.filter(file => file.endsWith('-template.md'));
    
    // Récupérer les métadonnées de chaque template
    const templates = await Promise.all(templateFiles.map(async (file) => {
      const name = file.replace('-template.md', '');
      const filePath = path.join(templatesDir, file);
      const stats = await fs.stat(filePath);
      
      return {
        name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        filePath,
        lastModified: stats.mtime.toISOString()
      };
    }));
    
    return templates;
  } catch (error) {
    console.error('Error getting templates:', error);
    throw new Error(`Failed to get templates: ${error.message}`);
  }
};

/**
 * Récupère un template par son nom
 * 
 * @param {string} name - Nom du template
 * @returns {Promise<Object>} - Template
 */
exports.getTemplateByName = async (name) => {
  try {
    const filePath = path.join(templatesDir, `${name}-template.md`);
    
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`Template "${name}" not found`);
    }
    
    // Lire le contenu du fichier
    const content = await fs.readFile(filePath, 'utf8');
    const stats = await fs.stat(filePath);
    
    return {
      name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      filePath,
      content,
      lastModified: stats.mtime.toISOString()
    };
  } catch (error) {
    console.error(`Error getting template "${name}":`, error);
    throw new Error(`Failed to get template: ${error.message}`);
  }
};

/**
 * Crée un nouveau template
 * 
 * @param {Object} template - Template à créer
 * @param {string} template.name - Nom du template
 * @param {string} template.content - Contenu du template
 * @returns {Promise<Object>} - Template créé
 */
exports.createTemplate = async (template) => {
  try {
    const { name, content } = template;
    const filePath = path.join(templatesDir, `${name}-template.md`);
    
    // Vérifier si le fichier existe déjà
    try {
      await fs.access(filePath);
      throw new Error(`Template "${name}" already exists`);
    } catch (error) {
      // Le fichier n'existe pas, on peut continuer
      if (error.message.includes('already exists')) {
        throw error;
      }
    }
    
    // Écrire le contenu dans le fichier
    await fs.writeFile(filePath, content, 'utf8');
    
    // Récupérer les statistiques du fichier
    const stats = await fs.stat(filePath);
    
    return {
      name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      filePath,
      content,
      lastModified: stats.mtime.toISOString()
    };
  } catch (error) {
    console.error(`Error creating template "${template.name}":`, error);
    throw new Error(`Failed to create template: ${error.message}`);
  }
};

/**
 * Met à jour un template existant
 * 
 * @param {string} name - Nom du template
 * @param {Object} updates - Mises à jour à appliquer
 * @param {string} updates.content - Nouveau contenu du template
 * @returns {Promise<Object>} - Template mis à jour
 */
exports.updateTemplate = async (name, updates) => {
  try {
    const filePath = path.join(templatesDir, `${name}-template.md`);
    
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`Template "${name}" not found`);
    }
    
    // Mettre à jour le contenu du fichier si nécessaire
    if (updates.content) {
      await fs.writeFile(filePath, updates.content, 'utf8');
    }
    
    // Récupérer les statistiques du fichier
    const stats = await fs.stat(filePath);
    const content = updates.content || await fs.readFile(filePath, 'utf8');
    
    return {
      name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      filePath,
      content,
      lastModified: stats.mtime.toISOString()
    };
  } catch (error) {
    console.error(`Error updating template "${name}":`, error);
    throw new Error(`Failed to update template: ${error.message}`);
  }
};

/**
 * Supprime un template
 * 
 * @param {string} name - Nom du template
 * @returns {Promise<void>}
 */
exports.deleteTemplate = async (name) => {
  try {
    const filePath = path.join(templatesDir, `${name}-template.md`);
    
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`Template "${name}" not found`);
    }
    
    // Supprimer le fichier
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting template "${name}":`, error);
    throw new Error(`Failed to delete template: ${error.message}`);
  }
};