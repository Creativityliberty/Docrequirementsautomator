/**
 * Contrôleur pour la gestion des documents
 */

const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const generatorService = require('../services/generatorService');

// Base de données temporaire pour stocker les métadonnées des documents
// Dans une application réelle, cela serait remplacé par une base de données
let documents = [
  {
    id: 'doc-1',
    projectName: 'SmartInventory',
    description: 'Système de gestion d\'inventaire intelligent',
    template: 'pocketflow',
    model: 'gemini-2.5-pro',
    createdAt: new Date().toISOString(),
    filePath: path.resolve(__dirname, '../../output/smartinventory-design.md')
  },
  {
    id: 'doc-2',
    projectName: 'TaskFlow',
    description: 'Système de gestion de tâches intelligent',
    template: 'pocketflow',
    model: 'gemini-2.5-flash',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    filePath: path.resolve(__dirname, '../../output/taskflow-design.md')
  }
];

/**
 * Génère un nouveau document de design
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.generateDoc = async (req, res) => {
  try {
    const { projectName, description, features, template, model } = req.body;
    
    if (!projectName) {
      return res.status(400).json({ error: 'Le nom du projet est requis' });
    }
    
    // Dans une implémentation réelle, nous générerions le document via le service
    // Pour l'instant, nous simulons la génération
    
    // Créer un ID unique pour le document
    const docId = uuidv4();
    const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-design.md`;
    const filePath = path.resolve(__dirname, `../../output/${fileName}`);
    
    // Simuler le contenu du document
    const content = `# ${projectName} Design\n\n## 📋 Objectifs et Vision\n\n### Objectifs Principaux\n${description || `Projet ${projectName}`}\n\n### Fonctionnalités\n${features ? features.map(f => `- ${f}`).join('\n') : '- Fonctionnalité 1\n- Fonctionnalité 2'}`;
    
    // Écrire le contenu dans le fichier
    await fs.writeFile(filePath, content, 'utf8');
    
    // Enregistrer les métadonnées du document
    const docMetadata = {
      id: docId,
      projectName,
      description: description || `Projet ${projectName}`,
      template: template || 'pocketflow',
      model: model || 'gemini-2.5-pro',
      createdAt: new Date().toISOString(),
      filePath
    };
    
    documents.push(docMetadata);
    
    res.status(201).json({
      success: true,
      document: {
        ...docMetadata,
        content
      }
    });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Adapte un document existant
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.adaptDoc = async (req, res) => {
  try {
    const { projectName, description, exampleContent, model } = req.body;
    
    if (!projectName || !exampleContent) {
      return res.status(400).json({ error: 'Le nom du projet et le contenu exemple sont requis' });
    }
    
    // Dans une implémentation réelle, nous adapterions le document via le service
    // Pour l'instant, nous simulons l'adaptation
    
    // Créer un ID unique pour le document
    const docId = uuidv4();
    const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-design.md`;
    const filePath = path.resolve(__dirname, `../../output/${fileName}`);
    
    // Simuler le contenu adapté
    const content = exampleContent
      .replace(/# .*/, `# ${projectName} Design`)
      .replace(/### Objectifs Principaux[\s\S]*?(?=###)/, `### Objectifs Principaux\n${description || `Projet ${projectName}`}\n\n`);
    
    // Écrire le contenu dans le fichier
    await fs.writeFile(filePath, content, 'utf8');
    
    // Enregistrer les métadonnées du document
    const docMetadata = {
      id: docId,
      projectName,
      description: description || `Projet ${projectName}`,
      model: model || 'gemini-2.5-pro',
      createdAt: new Date().toISOString(),
      filePath,
      isAdapted: true
    };
    
    documents.push(docMetadata);
    
    res.status(201).json({
      success: true,
      document: {
        ...docMetadata,
        content
      }
    });
  } catch (error) {
    console.error('Error adapting document:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère tous les documents générés
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllDocs = async (req, res) => {
  try {
    // Trier les documents par date de création (du plus récent au plus ancien)
    const sortedDocs = [...documents].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.status(200).json({
      success: true,
      count: sortedDocs.length,
      documents: sortedDocs
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère un document spécifique
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getDocById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver le document par ID
    const document = documents.find(doc => doc.id === id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    // Lire le contenu du document
    let content;
    try {
      content = await fs.readFile(document.filePath, 'utf8');
    } catch (error) {
      console.warn(`Could not read file ${document.filePath}:`, error);
      content = `# ${document.projectName} Design\n\n(Contenu non disponible)`;
    }
    
    res.status(200).json({
      success: true,
      document: {
        ...document,
        content
      }
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Supprime un document
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteDoc = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver le document par ID
    const documentIndex = documents.findIndex(doc => doc.id === id);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    const document = documents[documentIndex];
    
    // Supprimer le fichier
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      console.warn(`Could not delete file ${document.filePath}:`, error);
      // Continuer même si la suppression du fichier échoue
    }
    
    // Supprimer le document de la liste
    documents.splice(documentIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Document supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: error.message });
  }
};