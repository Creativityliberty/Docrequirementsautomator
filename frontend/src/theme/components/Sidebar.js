/**
 * Composant Sidebar personnalisé
 * Barre latérale responsive pour la navigation et les actions
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Box,
  useMediaQuery
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Styles pour le drawer
const StyledDrawer = styled(Drawer)(({ theme, variant, open, width }) => {
  const drawerWidth = width || 240;
  
  return {
    width: variant === 'permanent' || open ? drawerWidth : 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
    },
    '& .MuiDrawer-paperAnchorLeft': {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiDrawer-paperAnchorRight': {
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  };
});

// Styles pour le header du drawer
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// Styles pour le contenu du drawer
const DrawerContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'auto',
}));

/**
 * Composant Sidebar personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Sidebar
 */
const Sidebar = ({
  variant,
  open,
  onClose,
  onOpen,
  width,
  anchor,
  items,
  header,
  footer,
  activeItem,
  onItemClick,
  onToggle,
  ...props
}) => {
  // État local pour gérer l'ouverture/fermeture sur mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Détecter si l'écran est petit (mobile)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  
  // Déterminer si le drawer est ouvert
  const isOpen = variant === 'permanent' ? true : (isMobile ? mobileOpen : open);
  
  // Gérer la fermeture du drawer
  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
      if (onClose) onClose();
    } else if (onClose) {
      onClose();
    }
  };
  
  // Gérer l'ouverture/fermeture du drawer (utilisé par les composants parents)
  const handleDrawerToggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen(prevState => {
        const newState = !prevState;
        if (newState && onOpen) onOpen();
        if (!newState && onClose) onClose();
        return newState;
      });
    } else if (open) {
      if (onClose) onClose();
    } else {
      if (onOpen) onOpen();
    }
  }, [isMobile, open, onOpen, onClose]);
  
  // Exposer la fonction handleDrawerToggle au parent via props.onToggle
  useEffect(() => {
    if (onToggle) {
      onToggle(handleDrawerToggle);
    }
  }, [onToggle, handleDrawerToggle]);
  
  // Gérer le clic sur un élément
  const handleItemClick = (item) => {
    if (isMobile) {
      setMobileOpen(false);
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };
  
  // Déterminer la variante du drawer en fonction de l'écran
  const drawerVariant = isMobile ? 'temporary' : variant;

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={isOpen}
      anchor={anchor}
      width={width}
      onClose={handleDrawerClose}
      {...props}
    >
      {/* Header du drawer */}
      {(header || variant !== 'permanent') && (
        <DrawerHeader>
          {header}
          {variant !== 'permanent' && (
            <IconButton onClick={handleDrawerClose} size="large">
              {anchor === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
        </DrawerHeader>
      )}
      
      <Divider />
      
      {/* Contenu du drawer */}
      <DrawerContent>
        {/* Liste des éléments */}
        <List sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={activeItem === item.id}
                onClick={() => handleItemClick(item)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    noWrap: true,
                    variant: 'body2',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        {/* Footer du drawer */}
        {footer && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>{footer}</Box>
          </>
        )}
      </DrawerContent>
    </StyledDrawer>
  );
};

Sidebar.propTypes = {
  /**
   * Variante du drawer (permanent, persistent, temporary)
   */
  variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
  /**
   * Si le drawer est ouvert
   */
  open: PropTypes.bool,
  /**
   * Fonction appelée lors de la fermeture du drawer
   */
  onClose: PropTypes.func,
  /**
   * Fonction appelée lors de l'ouverture du drawer
   */
  onOpen: PropTypes.func,
  /**
   * Largeur du drawer en pixels
   */
  width: PropTypes.number,
  /**
   * Position du drawer (left, right)
   */
  anchor: PropTypes.oneOf(['left', 'right']),
  /**
   * Éléments du drawer
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ),
  /**
   * Contenu du header du drawer
   */
  header: PropTypes.node,
  /**
   * Contenu du footer du drawer
   */
  footer: PropTypes.node,
  /**
   * ID de l'élément actif
   */
  activeItem: PropTypes.string,
  /**
   * Fonction appelée lors du clic sur un élément
   */
  onItemClick: PropTypes.func,
};

Sidebar.defaultProps = {
  variant: 'persistent',
  open: false,
  width: 240,
  anchor: 'left',
  items: [],
};

export default Sidebar;
