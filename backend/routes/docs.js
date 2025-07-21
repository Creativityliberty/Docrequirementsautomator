/**
 * Routes pour la gestion des documents
 */

const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');

/**
 * @route   POST /api/docs/generate
 * @desc    Génère un nouveau document de design
 * @access  Public
 */
router.post('/generate', docsController.generateDoc);

/**
 * @route   POST /api/docs/adapt
 * @desc    Adapte un document existant
 * @access  Public
 */
router.post('/adapt', docsController.adaptDoc);

/**
 * @route   GET /api/docs
 * @desc    Récupère tous les documents générés
 * @access  Public
 */
router.get('/', docsController.getAllDocs);

/**
 * @route   GET /api/docs/:id
 * @desc    Récupère un document spécifique
 * @access  Public
 */
router.get('/:id', docsController.getDocById);

/**
 * @route   DELETE /api/docs/:id
 * @desc    Supprime un document
 * @access  Public
 */
router.delete('/:id', docsController.deleteDoc);

module.exports = router;