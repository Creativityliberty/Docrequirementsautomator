/**
 * Serveur Express pour Design Doc Automator
 * Point d'entrée du backend
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const docsRoutes = require('./routes/docs');
const templatesRoutes = require('./routes/templates');
const modelsRoutes = require('./routes/models');

// Configuration
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use('/api/docs', docsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/models', modelsRoutes);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;