/**
 * Composant de démonstration du système de layout responsive
 * Montre comment utiliser les composants Header, Sidebar et ContentArea ensemble
 */

import React, { useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Importer nos composants de layout personnalisés
import { Header, Sidebar, ContentArea, Container, Row, Col, Card, CardContent, CardHeader } from '../theme/components';

/**
 * Composant de démonstration du système de layout
 * @returns {React.ReactElement} Composant LayoutDemo
 */
const LayoutDemo = () => {
  // État pour gérer l'ouverture/fermeture de la sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Éléments de navigation pour la sidebar
  const navItems = [
    { id: 'home', label: 'Accueil', icon: <HomeIcon /> },
    { id: 'documents', label: 'Documents', icon: <DescriptionIcon /> },
    { id: 'history', label: 'Historique', icon: <HistoryIcon /> },
    { id: 'dashboard', label: 'Tableau de bord', icon: <DashboardIcon /> },
    { id: 'settings', label: 'Paramètres', icon: <SettingsIcon /> },
  ];
  
  // Gérer le toggle de la sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header 
        title="Design Doc Automator" 
        showMenuIcon 
        onMenuClick={handleSidebarToggle}
        rightActions={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" size="large">
              <SettingsIcon />
            </IconButton>
          </Box>
        }
      />
      
      {/* Layout principal avec sidebar et contenu */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar
          variant="persistent"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={navItems}
          activeItem="documents"
        />
        
        {/* Zone de contenu principale */}
        <ContentArea
          hasHeader
          hasSidebar
          sidebarOpen={sidebarOpen}
          sidebarWidth={240}
        >
          <Container>
            {/* Titre de la page */}
            <Typography variant="h4" component="h1" gutterBottom>
              Démonstration du système de layout responsive
            </Typography>
            
            {/* Section de démonstration de la grille */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Démonstration de la grille responsive
              </Typography>
              
              <Row spacing={2}>
                <Col xs={12} md={6} lg={4}>
                  <Card>
                    <CardHeader title="Colonne 1" />
                    <CardContent>
                      <Typography>
                        Cette colonne prend 12/12 sur mobile, 6/12 sur tablette et 4/12 sur desktop.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Card>
                    <CardHeader title="Colonne 2" />
                    <CardContent>
                      <Typography>
                        Cette colonne prend 12/12 sur mobile, 6/12 sur tablette et 4/12 sur desktop.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
                <Col xs={12} md={12} lg={4}>
                  <Card>
                    <CardHeader title="Colonne 3" />
                    <CardContent>
                      <Typography>
                        Cette colonne prend 12/12 sur mobile et tablette, et 4/12 sur desktop.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
            </Paper>
            
            {/* Section de démonstration des breakpoints */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Démonstration des breakpoints responsive
              </Typography>
              
              <Row spacing={2}>
                <Col xs={12}>
                  <Card>
                    <CardHeader title="Breakpoints" />
                    <CardContent>
                      <Typography variant="body1" paragraph>
                        Notre système utilise les breakpoints suivants :
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="xs: 0px et plus" 
                            secondary="Pour les téléphones mobiles en mode portrait" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="sm: 600px et plus" 
                            secondary="Pour les téléphones mobiles en mode paysage" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="md: 960px et plus" 
                            secondary="Pour les tablettes" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="lg: 1280px et plus" 
                            secondary="Pour les ordinateurs portables et de bureau" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="xl: 1920px et plus" 
                            secondary="Pour les grands écrans" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
            </Paper>
            
            {/* Section de démonstration des composants de layout */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Composants de layout disponibles
              </Typography>
              
              <Row spacing={2}>
                <Col xs={12} md={6}>
                  <Card>
                    <CardHeader title="Header" />
                    <CardContent>
                      <Typography>
                        Le composant Header fournit une barre de navigation en haut de l'application.
                        Il peut contenir un titre, un logo, des actions à gauche et à droite, et peut être configuré pour se masquer lors du défilement.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card>
                    <CardHeader title="Sidebar" />
                    <CardContent>
                      <Typography>
                        Le composant Sidebar fournit une barre latérale pour la navigation.
                        Il peut être configuré comme permanent, persistent ou temporary, et s'adapte automatiquement aux écrans mobiles.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card>
                    <CardHeader title="ContentArea" />
                    <CardContent>
                      <Typography>
                        Le composant ContentArea s'adapte automatiquement à la présence d'un Header et/ou d'une Sidebar.
                        Il ajuste ses marges et sa largeur en fonction de l'état de ces composants.
                      </Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
            </Paper>
          </Container>
        </ContentArea>
      </Box>
    </Box>
  );
};

export default LayoutDemo;
