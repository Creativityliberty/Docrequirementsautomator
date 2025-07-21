/**
 * Contrôleur pour la gestion des modèles Gemini
 */

const { createModelsManager } = require('../../src/models-manager');
const config = require('../../config/default.json');

/**
 * Récupère tous les modèles disponibles
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllModels = async (req, res) => {
  try {
    // Dans une implémentation réelle, nous utiliserions le ModelsManager pour récupérer les modèles
    // Pour l'instant, nous utilisons des données fictives
    
    const models = [
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Modèle avancé pour le raisonnement complexe et la génération de documents techniques détaillés',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Documents techniques', 'Architecture', 'Raisonnement approfondi']
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Modèle rapide et polyvalent pour la génération de contenu',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Génération rapide', 'Brouillons', 'Itérations multiples']
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Modèle de génération rapide avec fonctionnalités nouvelle génération',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Génération de contenu', 'Streaming en temps réel']
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro (obsolète)',
        description: 'Ancien modèle pour tâches de raisonnement complexes',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Compatibilité avec anciens systèmes']
      }
    ];
    
    res.status(200).json({
      success: true,
      models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère les modèles recommandés par type de tâche
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getRecommendedModels = async (req, res) => {
  try {
    // Dans une implémentation réelle, nous utiliserions le ModelsManager pour récupérer les recommandations
    // Pour l'instant, nous utilisons des données fictives
    
    const recommendedModels = {
      designDoc: 'gemini-2.5-pro',
      quickDraft: 'gemini-2.5-flash',
      codeGeneration: 'gemini-2.5-pro',
      adaptation: 'gemini-2.5-pro'
    };
    
    res.status(200).json({
      success: true,
      recommendedModels
    });
  } catch (error) {
    console.error('Error fetching recommended models:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère les informations d'un modèle spécifique
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Dans une implémentation réelle, nous utiliserions le ModelsManager pour récupérer le modèle
    // Pour l'instant, nous utilisons des données fictives
    
    const models = {
      'gemini-2.5-pro': {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Modèle avancé pour le raisonnement complexe et la génération de documents techniques détaillés',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Documents techniques', 'Architecture', 'Raisonnement approfondi'],
        capabilities: {
          multimodal: true,
          codeGeneration: true,
          longContext: true,
          streaming: true,
          maxInputTokens: 1048576,
          maxOutputTokens: 8192
        }
      },
      'gemini-2.5-flash': {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Modèle rapide et polyvalent pour la génération de contenu',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Génération rapide', 'Brouillons', 'Itérations multiples'],
        capabilities: {
          multimodal: true,
          codeGeneration: true,
          longContext: true,
          streaming: true,
          maxInputTokens: 1048576,
          maxOutputTokens: 8192
        }
      },
      'gemini-2.0-flash': {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Modèle de génération rapide avec fonctionnalités nouvelle génération',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Génération de contenu', 'Streaming en temps réel'],
        capabilities: {
          multimodal: true,
          codeGeneration: true,
          longContext: false,
          streaming: true,
          maxInputTokens: 32768,
          maxOutputTokens: 4096
        }
      },
      'gemini-1.5-pro': {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro (obsolète)',
        description: 'Ancien modèle pour tâches de raisonnement complexes',
        inputTypes: ['texte', 'images', 'audio', 'vidéo'],
        bestFor: ['Compatibilité avec anciens systèmes'],
        capabilities: {
          multimodal: true,
          codeGeneration: true,
          longContext: true,
          streaming: true,
          maxInputTokens: 1048576,
          maxOutputTokens: 8192
        }
      }
    };
    
    const model = models[id];
    
    if (!model) {
      return res.status(404).json({ error: 'Modèle non trouvé' });
    }
    
    res.status(200).json({
      success: true,
      model
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: error.message });
  }
};