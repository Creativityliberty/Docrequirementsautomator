import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Composants
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import PreviewPage from './pages/PreviewPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateEditorPage from './pages/TemplateEditorPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Composant de démonstration du système de layout
import LayoutDemo from './components/LayoutDemo';

// Système de design personnalisé
import customTheme from './theme';

// Création du thème Material-UI à partir de notre système de design
const theme = createTheme({
  ...customTheme.mui,
  components: {
    // Personnalisation des composants Material-UI
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
        },
      },
    },
  },
});

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route pour la démonstration du système de layout */}
          <Route path="/layout-demo" element={<LayoutDemo />} />
          
          {/* Routes standard avec Header, Footer et Container */}
          <Route path="*" element={
            <>
              <Header />
              <Container component="main" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 160px)' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/generate" element={<GeneratePage />} />
                  <Route path="/preview" element={<PreviewPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/templates/edit/:id" element={<TemplateEditorPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Container>
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;