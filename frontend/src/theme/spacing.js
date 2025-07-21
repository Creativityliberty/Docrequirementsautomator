/**
 * Configuration de l'espacement du système de design
 * Définit les valeurs d'espacement cohérentes pour les marges, paddings et grilles
 */

// Unité de base pour l'espacement (4px)
export const baseUnit = 4;

// Fonction pour calculer l'espacement en multiples de l'unité de base
export const spacing = (multiplier = 1) => `${baseUnit * multiplier}px`;

// Valeurs d'espacement prédéfinies
export const space = {
  0: spacing(0),    // 0px
  1: spacing(1),    // 4px
  2: spacing(2),    // 8px
  3: spacing(3),    // 12px
  4: spacing(4),    // 16px
  5: spacing(6),    // 24px
  6: spacing(8),    // 32px
  7: spacing(12),   // 48px
  8: spacing(16),   // 64px
  9: spacing(24),   // 96px
  10: spacing(32),  // 128px
};

// Espacement pour les conteneurs
export const container = {
  xs: '1rem',       // 16px
  sm: '1.5rem',     // 24px
  md: '2rem',       // 32px
  lg: '4rem',       // 64px
  xl: '6rem',       // 96px
};

// Espacement pour les grilles
export const grid = {
  gutter: space[4],  // 16px
  margin: space[4],  // 16px
};

// Points de rupture (breakpoints) pour le responsive design
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Valeurs pour les z-index
export const zIndex = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Valeurs pour les bordures
export const border = {
  radius: {
    none: '0',
    sm: '0.125rem',    // 2px
    md: '0.25rem',     // 4px
    lg: '0.5rem',      // 8px
    xl: '1rem',        // 16px
    full: '9999px',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
};

// Valeurs pour les ombres
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Configuration complète de l'espacement
const spacingConfig = {
  baseUnit,
  spacing,
  space,
  container,
  grid,
  breakpoints,
  zIndex,
  border,
  shadows,
};

export default spacingConfig;
