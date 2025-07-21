import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

/**
 * Composant de prévisualisation pour le contenu Markdown
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.content - Contenu Markdown à prévisualiser
 * @param {boolean} props.loading - Indique si le contenu est en cours de chargement
 * @param {string} props.error - Message d'erreur éventuel
 * @returns {JSX.Element} - Composant de prévisualisation
 */
const PreviewComponent = ({ content, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff4f4' }}>
        <Typography color="error">Erreur de prévisualisation: {error}</Typography>
      </Paper>
    );
  }

  if (!content) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Typography color="textSecondary">
          Remplissez le formulaire pour voir la prévisualisation
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      maxHeight: '600px', 
      overflow: 'auto',
      '& h1': { fontSize: '2rem', mb: 2 },
      '& h2': { fontSize: '1.5rem', mt: 3, mb: 1, color: '#1976d2' },
      '& h3': { fontSize: '1.25rem', mt: 2, mb: 1 },
      '& p': { mb: 1.5 },
      '& ul, & ol': { mb: 2, pl: 3 },
      '& code': { 
        backgroundColor: '#f5f5f5', 
        p: 0.5, 
        borderRadius: 1,
        fontFamily: 'monospace'
      },
      '& pre': { 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1,
        overflow: 'auto',
        mb: 2
      }
    }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Paper>
  );
};

export default PreviewComponent;