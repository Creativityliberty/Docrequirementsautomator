/**
 * Service API pour communiquer avec le backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Effectue une requête GET
 * 
 * @param {string} endpoint - Endpoint API
 * @returns {Promise<any>} - Réponse de l'API
 */
const get = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Une erreur est survenue');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Effectue une requête POST
 * 
 * @param {string} endpoint - Endpoint API
 * @param {Object} data - Données à envoyer
 * @returns {Promise<any>} - Réponse de l'API
 */
const post = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Une erreur est survenue');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Effectue une requête DELETE
 * 
 * @param {string} endpoint - Endpoint API
 * @returns {Promise<any>} - Réponse de l'API
 */
const del = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Une erreur est survenue');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
  }
};

// API Documents
export const documentsApi = {
  /**
   * Génère un nouveau document
   * 
   * @param {Object} data - Données du document
   * @returns {Promise<Object>} - Document généré
   */
  generate: (data) => post('/docs/generate', data),
  
  /**
   * Adapte un document existant
   * 
   * @param {Object} data - Données du document
   * @returns {Promise<Object>} - Document adapté
   */
  adapt: (data) => post('/docs/adapt', data),
  
  /**
   * Récupère tous les documents
   * 
   * @returns {Promise<Array>} - Liste des documents
   */
  getAll: () => get('/docs'),
  
  /**
   * Récupère un document par son ID
   * 
   * @param {string} id - ID du document
   * @returns {Promise<Object>} - Document
   */
  getById: (id) => get(`/docs/${id}`),
  
  /**
   * Supprime un document
   * 
   * @param {string} id - ID du document
   * @returns {Promise<Object>} - Résultat de la suppression
   */
  delete: (id) => del(`/docs/${id}`),
};

// API Templates
export const templatesApi = {
  /**
   * Récupère tous les templates
   * 
   * @returns {Promise<Array>} - Liste des templates
   */
  getAll: () => get('/templates'),
  
  /**
   * Récupère un template par son nom
   * 
   * @param {string} name - Nom du template
   * @returns {Promise<Object>} - Template
   */
  getByName: (name) => get(`/templates/${name}`),
};

// API Modèles
export const modelsApi = {
  /**
   * Récupère tous les modèles disponibles
   * 
   * @returns {Promise<Array>} - Liste des modèles
   */
  getAll: () => get('/models'),
};