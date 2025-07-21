/**
 * Composant Button personnalisé
 * Étend le composant Button de Material-UI avec notre système de design
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styles personnalisés pour le bouton
const StyledButton = styled(MuiButton)(({ theme, variant, size, color }) => {
  // Récupérer les couleurs du thème
  const getColorValues = (colorName) => {
    const colors = {
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      error: theme.palette.error,
      warning: theme.palette.warning,
      info: theme.palette.info,
      success: theme.palette.success,
    };
    return colors[colorName] || colors.primary;
  };

  // Récupérer les valeurs de couleur
  const colorValues = getColorValues(color);

  // Styles de base pour tous les boutons
  const baseStyles = {
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.button.fontFamily,
    fontWeight: theme.typography.button.fontWeight,
    letterSpacing: theme.typography.button.letterSpacing,
    textTransform: theme.typography.button.textTransform,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  };

  // Styles spécifiques à la taille
  const sizeStyles = {
    small: {
      padding: '4px 12px',
      fontSize: theme.typography.fontSize.xs,
    },
    medium: {
      padding: '6px 16px',
      fontSize: theme.typography.fontSize.sm,
    },
    large: {
      padding: '8px 22px',
      fontSize: theme.typography.fontSize.md,
    },
  };

  // Styles spécifiques à la variante
  const variantStyles = {
    contained: {
      boxShadow: theme.shadows[1],
      '&:hover': {
        boxShadow: theme.shadows[3],
      },
    },
    outlined: {
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
      },
    },
    text: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  };

  return {
    ...baseStyles,
    ...(sizeStyles[size] || sizeStyles.medium),
    ...(variantStyles[variant] || variantStyles.contained),
  };
});

/**
 * Composant Button personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Button
 */
const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

Button.propTypes = {
  /**
   * Contenu du bouton
   */
  children: PropTypes.node.isRequired,
  /**
   * Variante du bouton (contained, outlined, text)
   */
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  /**
   * Taille du bouton (small, medium, large)
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Couleur du bouton (primary, secondary, error, warning, info, success)
   */
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
  /**
   * Si le bouton est désactivé
   */
  disabled: PropTypes.bool,
  /**
   * Si le bouton prend toute la largeur disponible
   */
  fullWidth: PropTypes.bool,
  /**
   * Fonction appelée lors du clic sur le bouton
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: 'contained',
  size: 'medium',
  color: 'primary',
  disabled: false,
  fullWidth: false,
  onClick: () => {},
};

export default Button;
