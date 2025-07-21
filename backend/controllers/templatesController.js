/**
 * Contrôleur pour la gestion des templates
 */

const path = require('path');
const fs = require('fs').promises;
const templatesService = require('../services/templatesService');

// Base de données temporaire pour stocker les métadonnées des templates
// Dans une application réelle, cela serait remplacé par une base de données
let templates = [
  {
    name: 'pocketflow',
    displayName: 'PocketFlow',
    description: 'Template standard avec architecture complète',
    lastModified: new Date().toISOString()
  },
  {
    name: 'technique',
    displayName: 'Technique',
    description: 'Template détaillé pour projets techniques',
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Template simplifié et minimaliste',
    lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Récupère tous les templates
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllTemplates = async (req, res) => {
  try {
    // Dans une implémentation réelle, nous récupérerions les templates depuis le service
    // Pour l'instant, nous utilisons les données fictives
    
    res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère un template spécifique
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getTemplateByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Trouver le template par nom
    const template = templates.find(t => t.name === name);
    
    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    // Dans une implémentation réelle, nous récupérerions le contenu du template depuis le service
    // Pour l'instant, nous utilisons un contenu fictif
    const content = `# {{PROJECT_NAME}} Design\n\n## 📋 Objectifs et Vision\n\n### Objectifs Principaux\n[Description des objectifs principaux du projet]\n\n### Buts du Système\n- [But 1]\n- [But 2]\n- [But 3]`;
    
    res.status(200).json({
      success: true,
      template: {
        ...template,
        content
      }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Crée un nouveau template
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createTemplate = async (req, res) => {
  try {
    const { displayName, description, content, instructions } = req.body;
    
    if (!displayName || !content) {
      return res.status(400).json({ error: 'Le nom et le contenu du template sont requis' });
    }
    
    // Générer un nom unique pour le template
    const name = displayName.toLowerCase().replace(/\s+/g, '-');
    
    // Vérifier si le template existe déjà
    if (templates.some(t => t.name === name)) {
      return res.status(400).json({ error: 'Un template avec ce nom existe déjà' });
    }
    
    // Créer le nouveau template
    const newTemplate = {
      name,
      displayName,
      description: description || '',
      lastModified: new Date().toISOString()
    };
    
    // Dans une implémentation réelle, nous sauvegarderions le contenu du template via le service
    // Pour l'instant, nous ajoutons simplement le template à notre liste
    templates.push(newTemplate);
    
    res.status(201).json({
      success: true,
      template: newTemplate
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Met à jour un template existant
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateTemplate = async (req, res) => {
  try {
    const { name } = req.params;
    const { displayName, description, content, instructions } = req.body;
    
    // Trouver le template par nom
    const templateIndex = templates.findIndex(t => t.name === name);
    
    if (templateIndex === -1) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    // Mettre à jour le template
    const updatedTemplate = {
      ...templates[templateIndex],
      displayName: displayName || templates[templateIndex].displayName,
      description: description !== undefined ? description : templates[templateIndex].description,
      lastModified: new Date().toISOString()
    };
    
    // Dans une implémentation réelle, nous sauvegarderions le contenu du template via le service
    // Pour l'instant, nous mettons simplement à jour le template dans notre liste
    templates[templateIndex] = updatedTemplate;
    
    res.status(200).json({
      success: true,
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Supprime un template
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Vérifier si le template existe
    const templateIndex = templates.findIndex(t => t.name === name);
    
    if (templateIndex === -1) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    // Dans une implémentation réelle, nous supprimerions le fichier du template via le service
    // Pour l'instant, nous supprimons simplement le template de notre liste
    templates.splice(templateIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Template supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Prévisualise un template avec des données d'exemple
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.previewTemplate = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Le contenu du template est requis' });
    }
    
    // Dans une implémentation réelle, nous prévisualiserions le template via le service
    // Pour l'instant, nous remplaçons simplement les placeholders par des valeurs d'exemple
    const previewContent = content
      .replace(/{{PROJECT_NAME}}/g, 'Exemple de Projet')
      .replace(/{{DESCRIPTION}}/g, 'Description du projet exemple')
      .replace(/{{FEATURE_LIST}}/g, '- Fonctionnalité 1\n- Fonctionnalité 2\n- Fonctionnalité 3')
      .replace(/{{AUTHOR}}/g, 'John Doe')
      .replace(/{{DATE}}/g, new Date().toLocaleDateString('fr-FR'));
    
    res.status(200).json({
      success: true,
      preview: previewContent
    });
  } catch (error) {
    console.error('Error previewing template:', error);
    res.status(500).json({ error: error.message });
  }
};