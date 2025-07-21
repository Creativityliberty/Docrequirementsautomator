/**
 * Composant Header personnalisé
 * En-tête responsive avec barre de navigation et actions
 */

import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  useScrollTrigger,
  Slide,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Style pour l'AppBar
const StyledAppBar = styled(AppBar)(({ theme, position, elevation, color }) => ({
  position: position || 'fixed',
  backgroundColor: color === 'transparent' 
    ? 'transparent' 
    : theme.palette[color]?.main || theme.palette.primary.main,
  boxShadow: elevation ? theme.shadows[elevation] : 'none',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  zIndex: theme.zIndex.drawer + 1,
}));

// Style pour la barre d'outils
const StyledToolbar = styled(Toolbar)(({ theme, dense }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  ...(dense && {
    minHeight: 48,
  }),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

// Composant pour masquer l'en-tête lors du défilement
function HideOnScroll({ children, trigger }) {
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

/**
 * Composant Header personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Header
 */
const Header = ({
  title,
  logo,
  position,
  elevation,
  color,
  hideOnScroll,
  dense,
  leftActions,
  rightActions,
  onMenuClick,
  showMenuIcon,
  ...props
}) => {
  // Détecter si l'écran est petit (mobile)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  
  // Détecter le défilement pour masquer l'en-tête
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Contenu de l'en-tête
  const headerContent = (
    <StyledAppBar 
      position={position} 
      elevation={elevation} 
      color={color}
      {...props}
    >
      <StyledToolbar dense={dense}>
        {/* Zone gauche */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showMenuIcon && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onMenuClick}
              edge="start"
              sx={{ mr: 2 }}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {logo && (
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {logo}
            </Box>
          )}
          
          {title && (
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          )}
          
          {leftActions && (
            <Box sx={{ ml: 2, display: { xs: isMobile ? 'none' : 'flex', md: 'flex' } }}>
              {leftActions}
            </Box>
          )}
        </Box>
        
        {/* Zone droite */}
        {rightActions && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {rightActions}
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );

  // Retourner l'en-tête avec ou sans l'effet de défilement
  return hideOnScroll ? (
    <HideOnScroll trigger={trigger}>
      {headerContent}
    </HideOnScroll>
  ) : headerContent;
};

Header.propTypes = {
  /**
   * Titre de l'en-tête
   */
  title: PropTypes.node,
  /**
   * Logo de l'en-tête
   */
  logo: PropTypes.node,
  /**
   * Position de l'en-tête (fixed, absolute, sticky, static, relative)
   */
  position: PropTypes.oneOf(['fixed', 'absolute', 'sticky', 'static', 'relative']),
  /**
   * Élévation de l'en-tête (0-24)
   */
  elevation: PropTypes.number,
  /**
   * Couleur de l'en-tête
   */
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'transparent']),
  /**
   * Si l'en-tête doit être masqué lors du défilement
   */
  hideOnScroll: PropTypes.bool,
  /**
   * Si la barre d'outils doit être dense
   */
  dense: PropTypes.bool,
  /**
   * Actions à afficher à gauche
   */
  leftActions: PropTypes.node,
  /**
   * Actions à afficher à droite
   */
  rightActions: PropTypes.node,
  /**
   * Fonction appelée lors du clic sur l'icône de menu
   */
  onMenuClick: PropTypes.func,
  /**
   * Si l'icône de menu doit être affichée
   */
  showMenuIcon: PropTypes.bool,
};

Header.defaultProps = {
  position: 'fixed',
  elevation: 4,
  color: 'primary',
  hideOnScroll: false,
  dense: false,
  showMenuIcon: false,
};

export default Header;
