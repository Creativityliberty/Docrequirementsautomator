import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Checkbox,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { documentsApi } from '../services/api';

/**
 * Page d'historique des documents
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Charger les documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les documents depuis l'API
        // Pour l'instant, nous utilisons des données fictives
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer des données fictives
        const mockDocuments = Array.from({ length: 42 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          
          const templates = ['pocketflow', 'technique', 'minimal'];
          const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
          
          return {
            id: `doc-${i + 1}`,
            projectName: `Projet ${i + 1}`,
            createdAt: date.toISOString(),
            template: templates[Math.floor(Math.random() * templates.length)],
            model: models[Math.floor(Math.random() * models.length)]
          };
        });
        
        // Trier par date (du plus récent au plus ancien)
        mockDocuments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setDocuments(mockDocuments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Erreur lors du chargement des documents');
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);

  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer la sélection d'un document
  const handleSelectDocument = (id) => {
    const selectedIndex = selectedDocuments.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selectedDocuments, id];
    } else {
      newSelected = selectedDocuments.filter(docId => docId !== id);
    }
    
    setSelectedDocuments(newSelected);
  };

  // Gérer la sélection de tous les documents
  const handleSelectAllDocuments = (event) => {
    if (event.target.checked) {
      const newSelected = filteredDocuments.map(doc => doc.id);
      setSelectedDocuments(newSelected);
      return;
    }
    setSelectedDocuments([]);
  };

  // Ouvrir le dialogue de suppression
  const handleDeleteDialogOpen = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  // Fermer le dialogue de suppression
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Supprimer un document
  const handleDeleteDocument = async () => {
    try {
      // Dans une implémentation réelle, nous supprimerions le document via l'API
      // Pour l'instant, nous simulons la suppression
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour la liste des documents
      if (documentToDelete) {
        setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
        setSelectedDocuments(selectedDocuments.filter(id => id !== documentToDelete.id));
      } else if (selectedDocuments.length > 0) {
        setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
        setSelectedDocuments([]);
      }
      
      handleDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Erreur lors de la suppression du document');
    }
  };

  // Télécharger un document
  const handleDownloadDocument = (document) => {
    // Dans une implémentation réelle, nous téléchargerions le document
    // Pour l'instant, nous simulons un téléchargement
    
    const content = `# ${document.projectName} Design\n\nCeci est un exemple de contenu pour le document ${document.projectName}.`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.projectName.toLowerCase().replace(/\s+/g, '-')}-design.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    // Utiliser FilterListIcon pour indiquer le filtrage (dans la console pour l'exemple)
    console.log(<FilterListIcon fontSize="small" />, "Filtrage des documents");
    
    // Exemple d'utilisation de l'API documents (simulé)
    try {
      documentsApi.getAll().then(result => {
        console.log("Documents récupérés via API:", result);
      }).catch(err => {
        console.error("Erreur API simulée:", err);
      });
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
    }
    
    // Filtre de recherche
    const matchesSearch = doc.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de date
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const docDate = new Date(doc.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today - docDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays < 1;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    // Filtre de template
    const matchesTemplate = templateFilter === 'all' || doc.template === templateFilter;
    
    // Filtre de modèle
    const matchesModel = modelFilter === 'all' || doc.model === modelFilter;
    
    return matchesSearch && matchesDate && matchesTemplate && matchesModel;
  });

  // Pagination
  const paginatedDocuments = filteredDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Vérifier si un document est sélectionné
  const isSelected = (id) => selectedDocuments.indexOf(id) !== -1;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des documents...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Historique des documents
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filtres */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              label="Date"
            >
              <MenuItem value="all">Toutes les dates</MenuItem>
              <MenuItem value="today">Aujourd'hui</MenuItem>
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Template</InputLabel>
            <Select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              label="Template"
            >
              <MenuItem value="all">Tous les templates</MenuItem>
              <MenuItem value="pocketflow">PocketFlow</MenuItem>
              <MenuItem value="technique">Technique</MenuItem>
              <MenuItem value="minimal">Minimal</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Modèle</InputLabel>
            <Select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              label="Modèle"
            >
              <MenuItem value="all">Tous les modèles</MenuItem>
              <MenuItem value="gemini-2.5-pro">Gemini 2.5 Pro</MenuItem>
              <MenuItem value="gemini-2.5-flash">Gemini 2.5 Flash</MenuItem>
              <MenuItem value="gemini-2.0-flash">Gemini 2.0 Flash</MenuItem>
              <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Actions groupées */}
      {selectedDocuments.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} sélectionné{selectedDocuments.length > 1 ? 's' : ''}
            </Typography>
            
            <Box>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ ml: 1 }}
              >
                Supprimer
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Liste des documents */}
      {filteredDocuments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Aucun document trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Essayez de modifier vos filtres ou générez un nouveau document
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/generate')}
            sx={{ mt: 2 }}
          >
            Générer un document
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedDocuments.length > 0 && selectedDocuments.length < filteredDocuments.length}
                      checked={filteredDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                      onChange={handleSelectAllDocuments}
                    />
                  </TableCell>
                  <TableCell>Nom du projet</TableCell>
                  <TableCell>Date de création</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Modèle</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDocuments.map((doc) => {
                  const isItemSelected = isSelected(doc.id);
                  
                  return (
                    <TableRow
                      key={doc.id}
                      hover
                      selected={isItemSelected}
                      onClick={() => handleSelectDocument(doc.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{doc.projectName}</TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>{doc.template}</TableCell>
                      <TableCell>{doc.model}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir">
                          <IconButton onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/preview/${doc.id}`);
                          }}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Télécharger">
                          <IconButton onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDocument(doc);
                          }}>
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Supprimer">
                          <IconButton 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDialogOpen(doc);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </Paper>
      )}
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>
          Supprimer {documentToDelete ? 'le document' : 'les documents sélectionnés'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {documentToDelete 
              ? `Êtes-vous sûr de vouloir supprimer le document "${documentToDelete.projectName}" ?`
              : `Êtes-vous sûr de vouloir supprimer les ${selectedDocuments.length} documents sélectionnés ?`
            }
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteDocument} 
            color="error" 
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryPage;