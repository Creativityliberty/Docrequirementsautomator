/**
 * Composant Grid personnalisé
 * Système de grille responsive basé sur flexbox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Styles pour le conteneur de grille
const GridContainer = styled(Box)(({ theme, spacing, fullWidth }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: fullWidth ? '100%' : 'auto',
  margin: spacing ? `-${theme.spacing.space[spacing]}` : 0,
  '& > *': {
    padding: spacing ? theme.spacing.space[spacing] : 0,
  },
}));

// Styles pour l'élément de grille
const GridItem = styled(Box)(({ theme, xs, sm, md, lg, xl }) => {
  // Fonction pour calculer la largeur en pourcentage
  const getWidth = (columns) => {
    if (!columns) return 'auto';
    return `${(columns / 12) * 100}%`;
  };

  return {
    boxSizing: 'border-box',
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
    [theme.breakpoints.up('xs')]: {
      flexBasis: getWidth(xs),
      maxWidth: getWidth(xs),
    },
    [theme.breakpoints.up('sm')]: {
      flexBasis: sm ? getWidth(sm) : getWidth(xs),
      maxWidth: sm ? getWidth(sm) : getWidth(xs),
    },
    [theme.breakpoints.up('md')]: {
      flexBasis: md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs)),
      maxWidth: md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs)),
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: lg ? getWidth(lg) : (md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs))),
      maxWidth: lg ? getWidth(lg) : (md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs))),
    },
    [theme.breakpoints.up('xl')]: {
      flexBasis: xl ? getWidth(xl) : (lg ? getWidth(lg) : (md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs)))),
      maxWidth: xl ? getWidth(xl) : (lg ? getWidth(lg) : (md ? getWidth(md) : (sm ? getWidth(sm) : getWidth(xs)))),
    },
  };
});

/**
 * Composant Container pour la grille
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Container
 */
export const Container = ({ children, maxWidth, ...props }) => {
  const StyledContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: theme.spacing.container.xs,
    paddingRight: theme.spacing.container.xs,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.container.sm,
      paddingRight: theme.spacing.container.sm,
      maxWidth: maxWidth === 'sm' ? '600px' : '100%',
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing.container.md,
      paddingRight: theme.spacing.container.md,
      maxWidth: maxWidth === 'md' ? '960px' : (maxWidth === 'sm' ? '600px' : '100%'),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing.container.lg,
      paddingRight: theme.spacing.container.lg,
      maxWidth: maxWidth === 'lg' ? '1280px' : (maxWidth === 'md' ? '960px' : (maxWidth === 'sm' ? '600px' : '100%')),
    },
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing.container.xl,
      paddingRight: theme.spacing.container.xl,
      maxWidth: maxWidth === 'xl' ? '1920px' : (maxWidth === 'lg' ? '1280px' : (maxWidth === 'md' ? '960px' : (maxWidth === 'sm' ? '600px' : '100%'))),
    },
  }));

  return <StyledContainer {...props}>{children}</StyledContainer>;
};

/**
 * Composant Row pour la grille
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Row
 */
export const Row = ({ children, spacing, fullWidth, ...props }) => {
  return (
    <GridContainer spacing={spacing} fullWidth={fullWidth} {...props}>
      {children}
    </GridContainer>
  );
};

/**
 * Composant Col pour la grille
 * @param {Object} props - Propriétés du composant
 * @returns {React.ReactElement} Composant Col
 */
export const Col = ({ children, xs, sm, md, lg, xl, ...props }) => {
  return (
    <GridItem xs={xs} sm={sm} md={md} lg={lg} xl={xl} {...props}>
      {children}
    </GridItem>
  );
};

Container.propTypes = {
  /**
   * Contenu du conteneur
   */
  children: PropTypes.node.isRequired,
  /**
   * Largeur maximale du conteneur (sm, md, lg, xl, false)
   */
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', false]),
};

Container.defaultProps = {
  maxWidth: 'lg',
};

Row.propTypes = {
  /**
   * Contenu de la ligne
   */
  children: PropTypes.node.isRequired,
  /**
   * Espacement entre les colonnes (0-10)
   */
  spacing: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  /**
   * Si la ligne prend toute la largeur disponible
   */
  fullWidth: PropTypes.bool,
};

Row.defaultProps = {
  spacing: 2,
  fullWidth: false,
};

Col.propTypes = {
  /**
   * Contenu de la colonne
   */
  children: PropTypes.node.isRequired,
  /**
   * Nombre de colonnes pour les écrans extra-small (0-12)
   */
  xs: PropTypes.number,
  /**
   * Nombre de colonnes pour les écrans small (0-12)
   */
  sm: PropTypes.number,
  /**
   * Nombre de colonnes pour les écrans medium (0-12)
   */
  md: PropTypes.number,
  /**
   * Nombre de colonnes pour les écrans large (0-12)
   */
  lg: PropTypes.number,
  /**
   * Nombre de colonnes pour les écrans extra-large (0-12)
   */
  xl: PropTypes.number,
};

Col.defaultProps = {
  xs: 12,
};

const Grid = { Container, Row, Col };

export default Grid;
