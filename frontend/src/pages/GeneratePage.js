import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Container,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { documentsApi, templatesApi, modelsApi } from '../services/api';
import PreviewComponent from '../components/PreviewComponent';
import { previewService } from '../services/previewService';

/**
 * Page de génération de document
 */
const GeneratePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'adapt' ? 1 : 0;

  // État du formulaire
  const [mode, setMode] = useState(initialMode);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState(['']);
  const [selectedTemplate, setSelectedTemplate] = useState('pocketflow');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [exampleContent, setExampleContent] = useState('');
  const [templates, setTemplates] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // État de la prévisualisation
  const [activeTab, setActiveTab] = useState(0);
  const [previewContent, setPreviewContent] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  // Charger les templates et les modèles
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dans une implémentation réelle, ces données viendraient de l'API
        // Pour l'instant, nous utilisons des données fictives
        
        setTemplates([
          { name: 'pocketflow', displayName: 'PocketFlow', description: 'Template standard avec architecture' },
          { name: 'technique', displayName: 'Technique', description: 'Template détaillé pour projets techniques' },
          { name: 'minimal', displayName: 'Minimal', description: 'Template simplifié et minimaliste' }
        ]);
        
        setModels([
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Modèle avancé pour le raisonnement complexe' },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Modèle rapide et polyvalent' },
          { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Modèle de génération rapide' },
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Ancien modèle (obsolète)' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Erreur lors du chargement des données');
      }
    };
    
    fetchData();
  }, []);

  // Gérer le changement de mode
  const handleModeChange = (event, newMode) => {
    setMode(newMode);
  };
  
  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gérer l'ajout d'une fonctionnalité
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  // Gérer la suppression d'une fonctionnalité
  const handleRemoveFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  // Gérer la modification d'une fonctionnalité
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Gérer l'import de fichier
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setExampleContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };
  
  // Fonction pour générer la prévisualisation
  const generatePreview = useCallback(() => {
    // Ne générer la prévisualisation que si nous avons au moins un nom de projet
    if (!projectName) return;
    
    setPreviewLoading(true);
    setPreviewError(null);
    
    // Simuler un appel à l'API de prévisualisation
    setTimeout(() => {
      try {
        // Générer un contenu de prévisualisation simple
        const filteredFeatures = features.filter(f => f.trim() !== '');
        const featuresList = filteredFeatures.length > 0
          ? filteredFeatures.map(f => `- ${f}`).join('\n')
          : '- Fonctionnalité 1\n- Fonctionnalité 2';
        
        const content = `# ${projectName} Design

## 📋 Objectifs et Vision

### Objectifs Principaux
${description || `Description du projet ${projectName}`}

### Fonctionnalités
${featuresList}

## 🏗️ Architecture

Cette section sera générée en fonction du template ${selectedTemplate}.

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
        
        setPreviewContent(content);
        setPreviewLoading(false);
      } catch (error) {
        console.error('Error generating preview:', error);
        setPreviewError('Erreur lors de la génération de la prévisualisation');
        setPreviewLoading(false);
      }
    }, 500);
  }, [projectName, description, features, selectedTemplate]);
  
  // Générer la prévisualisation lorsque les données du formulaire changent
  useEffect(() => {
    if (activeTab === 1) {
      generatePreview();
    }
  }, [projectName, description, features, selectedTemplate, activeTab, generatePreview]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 0) {
        // Générer un nouveau document
        const filteredFeatures = features.filter(feature => feature.trim() !== '');
        
        // Afficher les fonctionnalités sélectionnées avec des Chips
        console.log("Fonctionnalités sélectionnées:", 
          filteredFeatures.map(feature => (
            <Chip key={feature} label={feature} color="primary" size="small" />
          ))
        );
        
        // Dans une implémentation réelle, nous appellerions l'API
        try {
          // Exemple d'utilisation des API
          const templates = await templatesApi.getAll();
          console.log("Templates disponibles:", templates);
          
          const models = await modelsApi.getAll();
          console.log("Modèles disponibles:", models);
          
          const result = await documentsApi.generate({
            projectName,
            description,
            features: filteredFeatures,
            template: selectedTemplate,
            model: selectedModel
          });
          console.log("Résultat de la génération:", result);
        } catch (apiError) {
          console.error("Erreur API simulée:", apiError);
        }
        
        // Pour l'instant, nous simulons un délai
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSuccess('Document généré avec succès !');
        setTimeout(() => {
          navigate('/preview/new-doc-id');
        }, 1500);
      } else {
        // Adapter un document existant
        if (!exampleContent) {
          throw new Error('Veuillez fournir un document exemple');
        }
        
        // Dans une implémentation réelle, nous appellerions l'API
        // Pour l'instant, nous simulons un délai
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSuccess('Document adapté avec succès !');
        setTimeout(() => {
          navigate('/preview/adapted-doc-id');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Générer un document de design
        </Typography>
        
        {/* Onglets de mode */}
        <Tabs value={mode} onChange={handleModeChange} sx={{ mb: 3 }}>
          <Tab label="Nouveau document" />
          <Tab label="Adapter un document existant" />
        </Tabs>
        
        {/* Onglets pour basculer entre l'édition et la prévisualisation */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Édition" />
          <Tab label="Prévisualisation" />
        </Tabs>
        
        {/* Contenu des onglets */}
        {activeTab === 0 ? (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Mode adaptation */}
            {mode === 1 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Document source
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    mb: 2, 
                    border: '2px dashed #ccc',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".md,.txt"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <Typography variant="body1" gutterBottom>
                    Glissez-déposez votre document ici ou cliquez pour parcourir
                  </Typography>
                  <Button variant="outlined" size="small">
                    Parcourir
                  </Button>
                </Paper>
                
                <Button 
                  variant="text" 
                  onClick={() => setExampleContent('')}
                  disabled={!exampleContent}
                >
                  Effacer
                </Button>
                
                {exampleContent && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Document chargé avec succès ({exampleContent.length} caractères)
                  </Alert>
                )}
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    const textarea = document.createElement('textarea');
                    document.body.appendChild(textarea);
                    textarea.value = '';
                    textarea.focus();
                    document.execCommand('paste');
                    setExampleContent(textarea.value);
                    document.body.removeChild(textarea);
                  }}
                >
                  Coller le contenu
                </Button>
              </Box>
            )}
            
            {/* Informations du projet */}
            <Typography variant="h6" gutterBottom>
              Informations du projet
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nom du projet"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  helperText="Nom du projet qui apparaîtra dans le document"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description du projet"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  helperText="Description détaillée du projet"
                />
              </Grid>
            </Grid>
            
            {/* Fonctionnalités (uniquement en mode nouveau document) */}
            {mode === 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fonctionnalités principales
                </Typography>
                
                {features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Fonctionnalité ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFeature(index)}
                      disabled={features.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddFeature}
                  sx={{ mt: 1 }}
                >
                  Ajouter une fonctionnalité
                </Button>
              </Box>
            )}
            
            {/* Sélection du template (uniquement en mode nouveau document) */}
            {mode === 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Template
                </Typography>
                
                <Grid container spacing={2}>
                  {templates.map((template) => (
                    <Grid item xs={12} sm={4} key={template.name}>
                      <Paper 
                        elevation={selectedTemplate === template.name ? 3 : 1}
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          border: selectedTemplate === template.name ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          '&:hover': {
                            borderColor: '#1976d2'
                          }
                        }}
                        onClick={() => setSelectedTemplate(template.name)}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {template.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Options avancées */}
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Options avancées</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Modèle Gemini</InputLabel>
                      <Select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        label="Modèle Gemini"
                      >
                        {models.map((model) => (
                          <MenuItem key={model.id} value={model.id}>
                            {model.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Format de sortie</InputLabel>
                      <Select
                        value="markdown"
                        label="Format de sortie"
                        disabled
                      >
                        <MenuItem value="markdown">Markdown</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Modèle sélectionné: {models.find(m => m.id === selectedModel)?.description || selectedModel}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            {/* Messages d'erreur et de succès */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
              </Alert>
            )}
            
            {/* Boutons d'action */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Annuler
              </Button>
              
              {mode === 0 && (
                <Button 
                  variant="contained" 
                  color="primary"
                  type="submit"
                  disabled={!projectName || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Génération en cours...' : 'Générer'}
                </Button>
              )}
              
              {mode === 1 && (
                <Button 
                  variant="contained" 
                  color="primary"
                  type="submit"
                  disabled={!projectName || !exampleContent || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Adaptation en cours...' : 'Adapter'}
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <PreviewComponent 
            content={previewContent}
            loading={previewLoading}
            error={previewError}
          />
        )}
      </Paper>
    </Container>
  );
};

export default GeneratePage;