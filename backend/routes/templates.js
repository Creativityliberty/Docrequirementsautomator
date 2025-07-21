/**
 * Routes pour la gestion des templates
 */

const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');

/**
 * @route   GET /api/templates
 * @desc    Récupère tous les templates
 * @access  Public
 */
router.get('/', templatesController.getAllTemplates);

/**
 * @route   GET /api/templates/:name
 * @desc    Récupère un template spécifique
 * @access  Public
 */
router.get('/:name', templatesController.getTemplateByName);

/**
 * @route   POST /api/templates
 * @desc    Crée un nouveau template
 * @access  Public
 */
router.post('/', templatesController.createTemplate);

/**
 * @route   PUT /api/templates/:name
 * @desc    Met à jour un template existant
 * @access  Public
 */
router.put('/:name', templatesController.updateTemplate);

/**
 * @route   DELETE /api/templates/:name
 * @desc    Supprime un template
 * @access  Public
 */
router.delete('/:name', templatesController.deleteTemplate);

/**
 * @route   POST /api/templates/preview
 * @desc    Prévisualise un template avec des données d'exemple
 * @access  Public
 */
router.post('/preview', templatesController.previewTemplate);

module.exports = router;