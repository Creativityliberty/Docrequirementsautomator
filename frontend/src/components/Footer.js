import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

/**
 * Composant de pied de page
 */
const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 'auto', py: 3, bgcolor: 'background.paper' }}>
      <Divider />
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Design Doc Automator v1.0.0
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" variant="body2" color="text.secondary">
              Documentation
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              GitHub
            </Link>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Propulsé par Gemini API
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">
              Tous les services sont opérationnels
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;