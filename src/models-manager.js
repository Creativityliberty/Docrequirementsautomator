/**
 * Module de gestion des modèles Gemini
 * Permet de lister, récupérer et gérer les modèles disponibles
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Classe pour gérer les modèles Gemini
 */
class ModelsManager {
  /**
   * Crée une instance du gestionnaire de modèles
   * 
   * @param {string} apiKey - Clé API Gemini
   * @param {Object} config - Configuration des modèles
   */
  constructor(apiKey, config = {}) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.config = config;
    this.cachedModels = null;
  }

  /**
   * Récupère la liste des modèles disponibles via l'API Gemini
   * 
   * @returns {Promise<Array>} - Liste des modèles disponibles
   */
  async listModels() {
    try {
      if (this.cachedModels) {
        return this.cachedModels;
      }
      
      console.log('Fetching available models from Gemini API...');
      
      // Dans une implémentation réelle, nous utiliserions l'API pour récupérer les modèles
      // Mais pour l'instant, nous utilisons les modèles définis dans la configuration
      const models = this.config.models?.available || [
        {
          id: 'gemini-2.5-pro',
          name: 'Gemini 2.5 Pro',
          description: 'Modèle avancé pour le raisonnement complexe'
        },
        {
          id: 'gemini-2.5-flash',
          name: 'Gemini 2.5 Flash',
          description: 'Modèle rapide et polyvalent'
        }
      ];
      
      this.cachedModels = models;
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }

  /**
   * Récupère les informations détaillées sur un modèle spécifique
   * 
   * @param {string} modelId - Identifiant du modèle
   * @returns {Promise<Object>} - Informations sur le modèle
   */
  async getModelInfo(modelId) {
    try {
      const models = await this.listModels();
      const model = models.find(m => m.id === modelId);
      
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }
      
      // Dans une implémentation réelle, nous ferions un appel API pour obtenir plus de détails
      // Pour l'instant, nous retournons les informations de base
      return {
        ...model,
        capabilities: this.getModelCapabilities(modelId)
      };
    } catch (error) {
      console.error(`Error getting info for model ${modelId}:`, error);
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }

  /**
   * Récupère le modèle recommandé pour un type de tâche spécifique
   * 
   * @param {string} taskType - Type de tâche (designDoc, quickDraft, codeGeneration, etc.)
   * @returns {string} - Identifiant du modèle recommandé
   */
  getRecommendedModel(taskType) {
    const recommended = this.config.models?.recommended || {
      designDoc: 'gemini-2.5-pro',
      quickDraft: 'gemini-2.5-flash',
      codeGeneration: 'gemini-2.5-pro'
    };
    
    return recommended[taskType] || 'gemini-2.5-pro';
  }

  /**
   * Détermine les capacités d'un modèle en fonction de son identifiant
   * 
   * @param {string} modelId - Identifiant du modèle
   * @returns {Object} - Capacités du modèle
   */
  getModelCapabilities(modelId) {
    // Capacités par défaut
    const defaultCapabilities = {
      multimodal: false,
      codeGeneration: false,
      longContext: false,
      streaming: true
    };
    
    // Capacités spécifiques par modèle
    const modelCapabilities = {
      'gemini-2.5-pro': {
        multimodal: true,
        codeGeneration: true,
        longContext: true,
        streaming: true,
        maxInputTokens: 1048576,
        maxOutputTokens: 8192
      },
      'gemini-2.5-flash': {
        multimodal: true,
        codeGeneration: true,
        longContext: true,
        streaming: true,
        maxInputTokens: 1048576,
        maxOutputTokens: 8192
      },
      'gemini-2.0-flash': {
        multimodal: true,
        codeGeneration: true,
        longContext: false,
        streaming: true,
        maxInputTokens: 32768,
        maxOutputTokens: 4096
      },
      'gemini-1.5-pro': {
        multimodal: true,
        codeGeneration: true,
        longContext: true,
        streaming: true,
        maxInputTokens: 1048576,
        maxOutputTokens: 8192
      },
      'gemini-1.5-flash': {
        multimodal: true,
        codeGeneration: true,
        longContext: false,
        streaming: true,
        maxInputTokens: 32768,
        maxOutputTokens: 2048
      }
    };
    
    return modelCapabilities[modelId] || defaultCapabilities;
  }
}

/**
 * Crée et configure un gestionnaire de modèles
 * 
 * @param {Object} config - Configuration pour l'API Gemini
 * @returns {ModelsManager} - Gestionnaire de modèles configuré
 */
function createModelsManager(config) {
  if (!config || !config.gemini || !config.gemini.apiKey) {
    throw new Error('Gemini API key is required in config');
  }
  
  return new ModelsManager(config.gemini.apiKey, config);
}

module.exports = {
  createModelsManager,
  ModelsManager
};