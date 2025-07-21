/**
 * Composant Card personnalisé
 * Étend le composant Card de Material-UI avec notre système de design
 */

import React from 'react';
import PropTypes from 'prop-types';
import { 
  Card as MuiCard, 
  CardHeader as MuiCardHeader,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  CardMedia as MuiCardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styles personnalisés pour la carte
const StyledCard = styled(MuiCard)(({ theme, elevation, variant }) => {
  // Styles de base pour toutes les cartes
  const baseStyles = {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    '&:hover': {
      transform: elevation > 0 ? 'translateY(-2px)' : 'none',
      boxShadow: elevation > 0 ? theme.shadows[elevation + 1] : 'none',
    },
  };

  // Styles spécifiques à la variante
  const variantStyles = {
    outlined: {
      border: `1px solid ${theme.palette.divider}`,
    },
    elevation: {
      boxShadow: theme.shadows[elevation],
    },
  };

  return {
    ...baseStyles,
    ...(variantStyles[variant] || variantStyles.elevation),
  };
});

// Styles pour le header de la carte
const StyledCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing.space[4],
  '& .MuiCardHeader-title': {
    ...theme.typography.h6,
    color: theme.palette.text.primary,
  },
  '& .MuiCardHeader-subheader': {
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
  },
}));

// Styles pour le contenu de la carte
const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing.space[4],
  '&:last-child': {
    paddingBottom: theme.spacing.space[4],
  },
}));

// Styles pour les actions de la carte
const StyledCardActions = styled(MuiCardActions)(({ theme }) => ({
  padding: theme.spacing.space[2],
  '& > :not(:first-of-type)': {
    marginLeft: theme.spacing.space[2],
  },
}));

// Styles pour les médias de la carte
const StyledCardMedia = styled(MuiCardMedia)(({ theme }) => ({
  objectFit: 'cover',
}));

/**
 * Composant Card personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Card
 */
const Card = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

/**
 * Composant CardHeader personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant CardHeader
 */
const CardHeader = (props) => {
  return <StyledCardHeader {...props} />;
};

/**
 * Composant CardContent personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant CardContent
 */
const CardContent = ({ children, ...props }) => {
  return <StyledCardContent {...props}>{children}</StyledCardContent>;
};

/**
 * Composant CardActions personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant CardActions
 */
const CardActions = ({ children, ...props }) => {
  return <StyledCardActions {...props}>{children}</StyledCardActions>;
};

/**
 * Composant CardMedia personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant CardMedia
 */
const CardMedia = (props) => {
  return <StyledCardMedia {...props} />;
};

Card.propTypes = {
  /**
   * Contenu de la carte
   */
  children: PropTypes.node.isRequired,
  /**
   * Niveau d'élévation de la carte (0-24)
   */
  elevation: PropTypes.number,
  /**
   * Variante de la carte (outlined, elevation)
   */
  variant: PropTypes.oneOf(['outlined', 'elevation']),
};

Card.defaultProps = {
  elevation: 1,
  variant: 'elevation',
};

CardHeader.propTypes = {
  /**
   * Titre de la carte
   */
  title: PropTypes.node,
  /**
   * Sous-titre de la carte
   */
  subheader: PropTypes.node,
  /**
   * Avatar affiché à gauche du titre
   */
  avatar: PropTypes.node,
  /**
   * Action affichée à droite du titre
   */
  action: PropTypes.node,
};

CardContent.propTypes = {
  /**
   * Contenu de la carte
   */
  children: PropTypes.node.isRequired,
};

CardActions.propTypes = {
  /**
   * Actions de la carte
   */
  children: PropTypes.node.isRequired,
  /**
   * Si les actions doivent être alignées à droite
   */
  disableSpacing: PropTypes.bool,
};

CardActions.defaultProps = {
  disableSpacing: false,
};

CardMedia.propTypes = {
  /**
   * URL de l'image
   */
  image: PropTypes.string,
  /**
   * Texte alternatif de l'image
   */
  alt: PropTypes.string,
  /**
   * Hauteur du média
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Composant à utiliser pour le rendu
   */
  component: PropTypes.elementType,
};

CardMedia.defaultProps = {
  component: 'img',
};

// Exporter tous les composants
export { Card, CardHeader, CardContent, CardActions, CardMedia };
export default Card;
