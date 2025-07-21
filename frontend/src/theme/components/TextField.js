/**
 * Composant TextField personnalisé
 * Étend le composant TextField de Material-UI avec notre système de design
 */

import React from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styles personnalisés pour le champ de texte
const StyledTextField = styled(MuiTextField)(({ theme, variant, size, error }) => {
  // Styles de base pour tous les champs de texte
  const baseStyles = {
    '& .MuiInputBase-root': {
      borderRadius: theme.shape.borderRadius,
      fontFamily: theme.typography.body1.fontFamily,
      transition: 'all 0.2s ease-in-out',
    },
    '& .MuiInputLabel-root': {
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.fontSize.sm,
    },
    '& .MuiFormHelperText-root': {
      fontFamily: theme.typography.caption.fontFamily,
      fontSize: theme.typography.fontSize.xs,
      marginTop: '4px',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
  };

  // Styles spécifiques à la taille
  const sizeStyles = {
    small: {
      '& .MuiInputBase-root': {
        padding: '8px 12px',
        fontSize: theme.typography.fontSize.xs,
      },
      '& .MuiInputLabel-root': {
        fontSize: theme.typography.fontSize.xs,
      },
    },
    medium: {
      '& .MuiInputBase-root': {
        padding: '10px 14px',
        fontSize: theme.typography.fontSize.sm,
      },
    },
    large: {
      '& .MuiInputBase-root': {
        padding: '12px 16px',
        fontSize: theme.typography.fontSize.md,
      },
      '& .MuiInputLabel-root': {
        fontSize: theme.typography.fontSize.md,
      },
    },
  };

  // Styles spécifiques à la variante
  const variantStyles = {
    outlined: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderWidth: '1px',
        },
        '&:hover fieldset': {
          borderWidth: '1px',
        },
        '&.Mui-focused fieldset': {
          borderWidth: '2px',
        },
      },
    },
    filled: {
      '& .MuiFilledInput-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
    standard: {
      '& .MuiInput-underline:before': {
        borderBottomWidth: '1px',
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomWidth: '2px',
      },
      '& .MuiInput-underline:after': {
        borderBottomWidth: '2px',
      },
    },
  };

  return {
    ...baseStyles,
    ...(sizeStyles[size] || sizeStyles.medium),
    ...(variantStyles[variant] || variantStyles.outlined),
  };
});

/**
 * Composant TextField personnalisé
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant TextField
 */
const TextField = (props) => {
  return <StyledTextField {...props} />;
};

TextField.propTypes = {
  /**
   * Variante du champ de texte (outlined, filled, standard)
   */
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  /**
   * Taille du champ de texte (small, medium, large)
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Label du champ de texte
   */
  label: PropTypes.string,
  /**
   * Placeholder du champ de texte
   */
  placeholder: PropTypes.string,
  /**
   * Texte d'aide affiché sous le champ de texte
   */
  helperText: PropTypes.node,
  /**
   * Si le champ de texte est en erreur
   */
  error: PropTypes.bool,
  /**
   * Si le champ de texte est désactivé
   */
  disabled: PropTypes.bool,
  /**
   * Si le champ de texte est en lecture seule
   */
  readOnly: PropTypes.bool,
  /**
   * Si le champ de texte est requis
   */
  required: PropTypes.bool,
  /**
   * Si le champ de texte prend toute la largeur disponible
   */
  fullWidth: PropTypes.bool,
  /**
   * Fonction appelée lors du changement de valeur
   */
  onChange: PropTypes.func,
  /**
   * Valeur du champ de texte
   */
  value: PropTypes.string,
  /**
   * Valeur par défaut du champ de texte
   */
  defaultValue: PropTypes.string,
};

TextField.defaultProps = {
  variant: 'outlined',
  size: 'medium',
  error: false,
  disabled: false,
  required: false,
  fullWidth: false,
  onChange: () => {},
};

export default TextField;
