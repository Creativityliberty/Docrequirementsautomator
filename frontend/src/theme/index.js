/**
 * Configuration principale du thème
 * Regroupe tous les éléments du système de design
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

// Thème principal de l'application
const theme = {
  colors,
  typography,
  spacing,
  // Configuration pour Material-UI
  mui: {
    palette: {
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrastText
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrastText
      },
      error: {
        main: colors.feedback.error.main,
        light: colors.feedback.error.light,
        dark: colors.feedback.error.dark,
        contrastText: colors.feedback.error.contrastText
      },
      warning: {
        main: colors.feedback.warning.main,
        light: colors.feedback.warning.light,
        dark: colors.feedback.warning.dark,
        contrastText: colors.feedback.warning.contrastText
      },
      info: {
        main: colors.feedback.info.main,
        light: colors.feedback.info.light,
        dark: colors.feedback.info.dark,
        contrastText: colors.feedback.info.contrastText
      },
      success: {
        main: colors.feedback.success.main,
        light: colors.feedback.success.light,
        dark: colors.feedback.success.dark,
        contrastText: colors.feedback.success.contrastText
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper
      }
    },
    typography: {
      fontFamily: typography.fontFamily.primary,
      h1: typography.h1,
      h2: typography.h2,
      h3: typography.h3,
      h4: typography.h4,
      h5: typography.h5,
      h6: typography.h6,
      subtitle1: typography.subtitle1,
      subtitle2: typography.subtitle2,
      body1: typography.body1,
      body2: typography.body2,
      button: typography.button,
      caption: typography.caption,
      overline: typography.overline
    },
    shape: {
      borderRadius: parseInt(spacing.border.radius.md)
    },
    shadows: [
      'none',
      spacing.shadows.sm,
      spacing.shadows.md,
      spacing.shadows.lg,
      spacing.shadows.xl,
      spacing.shadows['2xl'],
      spacing.shadows.inner,
      // Remplir avec des valeurs par défaut pour compléter les 25 niveaux d'ombre de Material-UI
      ...Array(19).fill(spacing.shadows.md)
    ]
  }
};

export default theme;
