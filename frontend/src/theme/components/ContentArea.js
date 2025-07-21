/**
 * Composant ContentArea personnalisé
 * Zone de contenu principale responsive qui s'adapte aux autres composants de layout
 */

import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Style pour la zone de contenu
const StyledContentArea = styled(Box)(({ 
  theme, 
  hasHeader, 
  hasSidebar, 
  sidebarWidth, 
  sidebarOpen,
  headerHeight,
  sidebarPosition,
  padding
}) => {
  // Calculer la marge supérieure en fonction de la présence d'un en-tête
  const marginTop = hasHeader ? `${headerHeight || 64}px` : 0;
  
  // Calculer la marge latérale en fonction de la présence d'une barre latérale
  const marginLeft = hasSidebar && sidebarOpen && sidebarPosition === 'left' ? `${sidebarWidth || 240}px` : 0;
  const marginRight = hasSidebar && sidebarOpen && sidebarPosition === 'right' ? `${sidebarWidth || 240}px` : 0;
  
  return {
    flexGrow: 1,
    padding: padding ? theme.spacing(padding) : 0,
    marginTop,
    marginLeft,
    marginRight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    minHeight: `calc(100vh - ${marginTop})`,
    width: `calc(100% - ${marginLeft} - ${marginRight})`,
    boxSizing: 'border-box',
    overflow: 'auto',
  };
});

/**
 * Composant ContentArea personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant ContentArea
 */
const ContentArea = ({
  children,
  hasHeader,
  hasSidebar,
  sidebarWidth,
  sidebarOpen,
  headerHeight,
  sidebarPosition,
  padding,
  ...props
}) => {
  return (
    <StyledContentArea
      hasHeader={hasHeader}
      hasSidebar={hasSidebar}
      sidebarWidth={sidebarWidth}
      sidebarOpen={sidebarOpen}
      headerHeight={headerHeight}
      sidebarPosition={sidebarPosition}
      padding={padding}
      {...props}
    >
      {children}
    </StyledContentArea>
  );
};

ContentArea.propTypes = {
  /**
   * Contenu de la zone
   */
  children: PropTypes.node,
  /**
   * Si un en-tête est présent
   */
  hasHeader: PropTypes.bool,
  /**
   * Si une barre latérale est présente
   */
  hasSidebar: PropTypes.bool,
  /**
   * Largeur de la barre latérale en pixels
   */
  sidebarWidth: PropTypes.number,
  /**
   * Si la barre latérale est ouverte
   */
  sidebarOpen: PropTypes.bool,
  /**
   * Hauteur de l'en-tête en pixels
   */
  headerHeight: PropTypes.number,
  /**
   * Position de la barre latérale (left, right)
   */
  sidebarPosition: PropTypes.oneOf(['left', 'right']),
  /**
   * Espacement intérieur (0-10)
   */
  padding: PropTypes.number,
};

ContentArea.defaultProps = {
  hasHeader: true,
  hasSidebar: false,
  sidebarOpen: false,
  headerHeight: 64,
  sidebarPosition: 'left',
  padding: 3,
};

export default ContentArea;
