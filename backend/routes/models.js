/**
 * Routes pour la gestion des modèles Gemini
 */

const express = require('express');
const router = express.Router();
const modelsController = require('../controllers/modelsController');

/**
 * @route   GET /api/models
 * @desc    Récupère tous les modèles disponibles
 * @access  Public
 */
router.get('/', modelsController.getAllModels);

/**
 * @route   GET /api/models/recommended
 * @desc    Récupère les modèles recommandés par type de tâche
 * @access  Public
 */
router.get('/recommended', modelsController.getRecommendedModels);

/**
 * @route   GET /api/models/:id
 * @desc    Récupère les informations d'un modèle spécifique
 * @access  Public
 */
router.get('/:id', modelsController.getModelById);

module.exports = router;