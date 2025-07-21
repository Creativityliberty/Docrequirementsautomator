/**
 * Client pour l'API Gemini
 * Gère les interactions avec l'API Gemini de Google
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createModelsManager } = require('./models-manager');

/**
 * Crée et configure un client pour l'API Gemini
 * 
 * @param {Object} config - Configuration pour l'API Gemini
 * @returns {Object} - Client Gemini configuré
 */
function getGeminiClient(config) {
  if (!config || !config.apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(config.apiKey);
  const modelName = config.model || 'gemini-2.5-pro';
  const temperature = config.temperature || 0.2;
  const maxOutputTokens = config.maxOutputTokens || 8192;
  
  // Créer le gestionnaire de modèles
  const modelsManager = createModelsManager({ gemini: config });
  
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.8,
      topK: 40
    }
  });

  return {
    /**
     * Génère un document de design basé sur les données fournies
     * 
     * @param {Object} data - Données pour la génération
     * @param {string} data.projectName - Nom du projet
     * @param {string} data.template - Contenu du template
     * @param {string} data.description - Description du projet
     * @param {Array<string>} data.features - Fonctionnalités principales
     * @param {string} data.instructions - Instructions spécifiques
     * @param {string} data.additionalContext - Contexte supplémentaire
     * @returns {Promise<string>} - Contenu du document généré
     */
    async generateDesignDoc(data) {
      const { 
        projectName, 
        template, 
        description = '', 
        features = [], 
        instructions,
        additionalContext = ''
      } = data;
      
      const featuresText = features.map(f => `- ${f}`).join('\n');
      
      const prompt = `
Tu es un expert en architecture logicielle et en documentation technique.

TÂCHE: Crée un document de design détaillé pour le projet "${projectName}" en suivant le format du template fourni.

DESCRIPTION DU PROJET:
${description}

FONCTIONNALITÉS PRINCIPALES:
${featuresText}

INSTRUCTIONS SPÉCIFIQUES:
${instructions}

TEMPLATE DE RÉFÉRENCE:
${template}

${additionalContext}

DIRECTIVES:
1. Respecte la structure du template fourni (sections, sous-sections)
2. Adapte le contenu au contexte du projet "${projectName}"
3. Inclus des diagrammes Mermaid si pertinent (architecture, flux, classes)
4. Sois précis et technique dans les descriptions
5. Utilise un style professionnel et clair
6. Génère un document complet et cohérent
7. Utilise des exemples de code pertinents pour le projet

Réponds uniquement avec le contenu Markdown du document de design, sans commentaires additionnels.
`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error(`Failed to generate design document: ${error.message}`);
      }
    },
    
    /**
     * Adapte un document de design existant pour un nouveau projet
     * 
     * @param {Object} data - Données pour l'adaptation
     * @param {string} data.exampleContent - Contenu du document exemple
     * @param {string} data.projectName - Nom du nouveau projet
     * @param {string} data.description - Description du nouveau projet
     * @returns {Promise<string>} - Contenu du document adapté
     */
    async adaptExampleDoc(data) {
      const { exampleContent, projectName, description = '' } = data;
      
      const prompt = `
Tu es un expert en architecture logicielle et en documentation technique.

TÂCHE: Adapte le document de design fourni pour le nouveau projet "${projectName}".

DESCRIPTION DU NOUVEAU PROJET:
${description}

DOCUMENT EXEMPLE:
${exampleContent}

DIRECTIVES:
1. Conserve la structure générale du document exemple
2. Remplace les noms de projets, concepts et détails spécifiques pour les adapter au nouveau projet "${projectName}"
3. Conserve les diagrammes Mermaid mais adapte-les au nouveau contexte
4. Maintiens le niveau de détail technique et la qualité du document original
5. Assure-toi que tous les exemples de code sont pertinents pour le nouveau projet
6. Adapte les objectifs, métriques et plans d'implémentation au nouveau contexte

Réponds uniquement avec le contenu Markdown du document de design adapté, sans commentaires additionnels.
`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error(`Failed to adapt design document: ${error.message}`);
      }
    },
    
    /**
     * Obtient des informations sur les modèles Gemini disponibles
     * 
     * @returns {Promise<Object>} - Informations sur les modèles
     */
    async getModelInfo() {
      try {
        const models = await modelsManager.listModels();
        return {
          currentModel: modelName,
          availableModels: models
        };
      } catch (error) {
        console.error('Error getting model info:', error);
        // Fallback en cas d'erreur
        return {
          currentModel: modelName,
          availableModels: [
            {
              id: 'gemini-2.5-pro',
              name: 'Gemini 2.5 Pro',
              description: 'Modèle avancé avec raisonnement complexe',
              bestFor: ['Documents techniques', 'Raisonnement approfondi']
            },
            {
              id: 'gemini-2.5-flash',
              name: 'Gemini 2.5 Flash',
              description: 'Nouvelle génération, rapide',
              bestFor: ['Génération de contenu améliorée', 'Réponses rapides']
            },
            {
              id: 'gemini-2.0-flash',
              name: 'Gemini 2.0 Flash',
              description: 'Modèle de génération rapide',
              bestFor: ['Génération de contenu', 'Streaming en temps réel']
            },
            {
              id: 'gemini-1.5-pro',
              name: 'Gemini 1.5 Pro (obsolète)',
              description: 'Ancien modèle pour tâches complexes',
              bestFor: ['Compatibilité avec anciens systèmes']
            }
          ]
        };
      }
    },
    
    /**
     * Change le modèle utilisé par le client
     * 
     * @param {string} newModelName - Nom du nouveau modèle à utiliser
     * @returns {Object} - Client avec le nouveau modèle configuré
     */
    useModel(newModelName) {
      if (!newModelName) {
        throw new Error('Model name is required');
      }
      
      console.log(`Switching to model: ${newModelName}`);
      
      const newModel = genAI.getGenerativeModel({
        model: newModelName,
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP: 0.8,
          topK: 40
        }
      });
      
      // Retourner une nouvelle instance du client avec le nouveau modèle
      return getGeminiClient({
        ...config,
        model: newModelName
      });
    },
    
    /**
     * Obtient le modèle recommandé pour un type de tâche spécifique
     * 
     * @param {string} taskType - Type de tâche (designDoc, quickDraft, codeGeneration)
     * @returns {Promise<string>} - Nom du modèle recommandé
     */
    async getRecommendedModel(taskType) {
      return modelsManager.getRecommendedModel(taskType);
    }
  };
}

module.exports = {
  getGeminiClient
};