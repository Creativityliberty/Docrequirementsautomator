/**
 * Service de prévisualisation en temps réel
 */

// Cache pour stocker les prévisualisations récentes
const previewCache = new Map();

/**
 * Génère une clé de cache basée sur les paramètres de prévisualisation
 * 
 * @param {Object} params - Paramètres de prévisualisation
 * @returns {string} - Clé de cache
 */
const generateCacheKey = (params) => {
  return JSON.stringify({
    projectName: params.projectName,
    description: params.description?.substring(0, 100),
    features: params.features?.map(f => f.substring(0, 50)),
    template: params.template
  });
};

/**
 * Fonction de debounce pour limiter les appels fréquents
 * 
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} - Fonction debouncée
 */
const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Service de prévisualisation en temps réel
 */
export const previewService = {
  /**
   * Génère une prévisualisation du document
   * 
   * @param {Object} params - Paramètres de prévisualisation
   * @param {string} params.projectName - Nom du projet
   * @param {string} params.description - Description du projet
   * @param {Array<string>} params.features - Fonctionnalités du projet
   * @param {string} params.template - Template à utiliser
   * @returns {Promise<string>} - Contenu prévisualisé
   */
  generatePreview: async (params) => {
    const cacheKey = generateCacheKey(params);
    
    // Vérifier si la prévisualisation est dans le cache
    if (previewCache.has(cacheKey)) {
      return previewCache.get(cacheKey);
    }
    
    try {
      // Dans une implémentation réelle, nous appellerions l'API
      // Pour l'instant, nous simulons la génération
      
      // Simuler un délai court
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Générer un contenu de prévisualisation simple
      const { projectName, description, features, template } = params;
      
      const featuresList = features && features.length > 0
        ? features.map(f => `- ${f}`).join('\n')
        : '- Fonctionnalité 1\n- Fonctionnalité 2';
      
      const content = `# ${projectName || 'Projet'} Design

## 📋 Objectifs et Vision

### Objectifs Principaux
${description || `Description du projet ${projectName || 'Exemple'}`}

### Fonctionnalités
${featuresList}

## 🏗️ Architecture

Cette section sera générée en fonction du template ${template || 'sélectionné'}.

### Structures de Données Principales

#### Structure 1
\`\`\`typescript
interface ExampleStructure {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}
\`\`\`

### Diagramme de flux

\`\`\`mermaid
flowchart TD
    start[Start] --> process[Process]
    process --> decision{Decision}
    decision -->|Yes| end[End]
    decision -->|No| process
\`\`\`

## 📊 Métriques et Monitoring

- Métrique 1: Description de la métrique
- Métrique 2: Description de la métrique
- Métrique 3: Description de la métrique

## 🚀 Plan d'Implémentation

### Phase 1: Foundation
1. Tâche 1
2. Tâche 2
3. Tâche 3

### Phase 2: Développement
1. Tâche 1
2. Tâche 2
3. Tâche 3
`;
      
      // Stocker dans le cache
      previewCache.set(cacheKey, content);
      
      return content;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw new Error(`Failed to generate preview: ${error.message}`);
    }
  },
  
  /**
   * Version debouncée de generatePreview pour limiter les appels
   * 
   * @param {Object} params - Paramètres de prévisualisation
   * @param {Function} callback - Fonction de callback (error, content)
   */
  generatePreviewDebounced: function(params, callback) {
    const debouncedFn = debounce(async () => {
      try {
        const content = await this.generatePreview(params);
        callback(null, content);
      } catch (error) {
        callback(error, null);
      }
    }, 500);
    
    debouncedFn();
  }
};