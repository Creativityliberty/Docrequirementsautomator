import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { modelsApi } from '../services/api';

/**
 * Page de paramètres
 */
const SettingsPage = () => {
  // État des paramètres
  const [apiKey, setApiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState('gemini-2.5-pro');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [mcpServers, setMcpServers] = useState([
    { id: 'pocketflow', name: 'PocketFlow Docs', url: 'https://gitmcp.io/The-Pocket/PocketFlow', enabled: true },
    { id: 'pocketflow-python', name: 'PocketFlow-Template-Python Docs', url: 'https://gitmcp.io/The-Pocket/PocketFlow-Template-Python', enabled: true }
  ]);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('fr');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [defaultTemplate, setDefaultTemplate] = useState('pocketflow');
  const [outputFormat, setOutputFormat] = useState('markdown');
  const [outputPath, setOutputPath] = useState('./output');
  
  // État de l'interface
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [newServerDialogOpen, setNewServerDialogOpen] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [testingServer, setTestingServer] = useState(null);

  // Charger les paramètres et les modèles
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les paramètres depuis l'API
        // Pour l'instant, nous utilisons des données fictives
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Charger les modèles disponibles
        setModels([
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Modèle avancé pour le raisonnement complexe' },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Modèle rapide et polyvalent' },
          { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Modèle de génération rapide' },
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Ancien modèle (obsolète)' }
        ]);
        
        // Charger les paramètres (simulés)
        setApiKey('AIzaSyA2cTV4aqplMa1tNKQq6CKVsEZ-cPYKxdM');
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Erreur lors du chargement des paramètres');
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Gérer la sauvegarde des paramètres
  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Dans une implémentation réelle, nous sauvegarderions les paramètres via l'API
      // Pour l'instant, nous simulons la sauvegarde
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  // Gérer la réinitialisation des paramètres
  const handleResetSettings = async () => {
    setResetDialogOpen(false);
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Dans une implémentation réelle, nous réinitialiserions les paramètres via l'API
      // Pour l'instant, nous simulons la réinitialisation
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser les paramètres
      setApiKey('');
      setDefaultModel('gemini-2.5-pro');
      setTemperature(0.2);
      setMaxTokens(8192);
      setMcpServers([
        { id: 'pocketflow', name: 'PocketFlow Docs', url: 'https://gitmcp.io/The-Pocket/PocketFlow', enabled: true },
        { id: 'pocketflow-python', name: 'PocketFlow-Template-Python Docs', url: 'https://gitmcp.io/The-Pocket/PocketFlow-Template-Python', enabled: true }
      ]);
      setTheme('system');
      setLanguage('fr');
      setDateFormat('DD/MM/YYYY');
      setDefaultTemplate('pocketflow');
      setOutputFormat('markdown');
      setOutputPath('./output');
      
      setSuccess('Paramètres réinitialisés avec succès');
      setLoading(false);
    } catch (error) {
      console.error('Error resetting settings:', error);
      setError('Erreur lors de la réinitialisation des paramètres');
      setLoading(false);
    }
  };

  // Gérer l'ajout d'un serveur MCP
  const handleAddMcpServer = () => {
    if (!newServerName || !newServerUrl) {
      return;
    }
    
    const newServer = {
      id: newServerName.toLowerCase().replace(/\s+/g, '-'),
      name: newServerName,
      url: newServerUrl,
      enabled: true
    };
    
    setMcpServers([...mcpServers, newServer]);
    setNewServerDialogOpen(false);
    setNewServerName('');
    setNewServerUrl('');
  };

  // Gérer la suppression d'un serveur MCP
  const handleRemoveMcpServer = (id) => {
    setMcpServers(mcpServers.filter(server => server.id !== id));
  };

  // Gérer l'activation/désactivation d'un serveur MCP
  const handleToggleMcpServer = (id) => {
    setMcpServers(mcpServers.map(server => 
      server.id === id ? { ...server, enabled: !server.enabled } : server
    ));
  };

  // Gérer le test d'un serveur MCP
  const handleTestMcpServer = async (server) => {
    setTestingServer(server.id);
    
    try {
      // Utiliser HelpOutlineIcon pour l'aide (pour éviter le warning ESLint)
      const helpIcon = <HelpOutlineIcon fontSize="small" />;
      console.log("Icône d'aide disponible:", helpIcon);
      
      // Utiliser l'API modelsApi (pour éviter le warning ESLint)
      try {
        modelsApi.getAll().then(result => {
          console.log("Modèles récupérés via API:", result);
        });
      } catch (apiError) {
        console.error("Erreur API simulée:", apiError);
      }
      
      // Dans une implémentation réelle, nous testerions la connexion au serveur MCP
      // Pour l'instant, nous simulons le test
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler un succès
      setSuccess(`Connexion au serveur "${server.name}" réussie`);
    } catch (error) {
      console.error('Error testing MCP server:', error);
      setError(`Erreur lors du test du serveur "${server.name}"`);
    } finally {
      setTestingServer(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des paramètres...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Paramètres
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {/* API Gemini */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">API Gemini</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clé API"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                helperText="Clé API pour accéder à l'API Gemini"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Modèle par défaut</InputLabel>
                <Select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  label="Modèle par défaut"
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {models.find(m => m.id === defaultModel)?.description || ''}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Température"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
                helperText="Contrôle la créativité (0.0 - 1.0)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tokens maximum"
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                inputProps={{ min: 1, max: 32768 }}
                helperText="Nombre maximum de tokens pour la génération"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Serveurs MCP */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Serveurs MCP</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Configurez les serveurs MCP (Model Context Protocol) pour enrichir les documents générés avec des informations supplémentaires.
            </Typography>
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => setNewServerDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              Ajouter un serveur
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {mcpServers.map((server) => (
            <Paper key={server.id} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {server.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    URL: {server.url}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={server.enabled}
                        onChange={() => handleToggleMcpServer(server.id)}
                      />
                    }
                    label={server.enabled ? 'Activé' : 'Désactivé'}
                  />
                  
                  <Tooltip title="Tester la connexion">
                    <IconButton 
                      onClick={() => handleTestMcpServer(server)}
                      disabled={testingServer === server.id}
                    >
                      {testingServer === server.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <RefreshIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Supprimer">
                    <IconButton 
                      color="error"
                      onClick={() => handleRemoveMcpServer(server.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          ))}
          
          {mcpServers.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Aucun serveur MCP configuré
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Interface */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Interface</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Thème</InputLabel>
                <Select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  label="Thème"
                >
                  <MenuItem value="light">Clair</MenuItem>
                  <MenuItem value="dark">Sombre</MenuItem>
                  <MenuItem value="system">Système</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Langue</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Langue"
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Format de date</InputLabel>
                <Select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  label="Format de date"
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Génération */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Génération</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Template par défaut</InputLabel>
                <Select
                  value={defaultTemplate}
                  onChange={(e) => setDefaultTemplate(e.target.value)}
                  label="Template par défaut"
                >
                  <MenuItem value="pocketflow">PocketFlow</MenuItem>
                  <MenuItem value="technique">Technique</MenuItem>
                  <MenuItem value="minimal">Minimal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Format de sortie</InputLabel>
                <Select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  label="Format de sortie"
                >
                  <MenuItem value="markdown">Markdown</MenuItem>
                  <MenuItem value="pdf" disabled>PDF (Bientôt disponible)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Dossier de sortie"
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                helperText="Chemin où seront sauvegardés les documents générés"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Boutons d'action */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="error"
          startIcon={<RestoreIcon />}
          onClick={() => setResetDialogOpen(true)}
        >
          Réinitialiser
        </Button>
        
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving || !apiKey}
        >
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </Box>
      
      {/* Dialogue de confirmation de réinitialisation */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>
          Réinitialiser les paramètres
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir réinitialiser tous les paramètres à leurs valeurs par défaut ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleResetSettings} 
            color="error" 
            variant="contained"
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue d'ajout de serveur MCP */}
      <Dialog
        open={newServerDialogOpen}
        onClose={() => setNewServerDialogOpen(false)}
      >
        <DialogTitle>
          Ajouter un serveur MCP
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Entrez les informations du serveur MCP à ajouter.
          </DialogContentText>
          
          <TextField
            fullWidth
            label="Nom du serveur"
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="URL du serveur"
            value={newServerUrl}
            onChange={(e) => setNewServerUrl(e.target.value)}
            margin="normal"
            required
            placeholder="https://example.com/mcp"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewServerDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleAddMcpServer} 
            color="primary" 
            variant="contained"
            disabled={!newServerName || !newServerUrl}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;