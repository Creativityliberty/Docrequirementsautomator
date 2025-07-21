/**
 * Palette de couleurs du système de design
 * Utilisée pour maintenir une cohérence visuelle dans toute l'application
 */

// Couleurs primaires
export const primary = {
  main: '#3f51b5',
  light: '#757de8',
  dark: '#002984',
  contrastText: '#ffffff'
};

// Couleurs secondaires
export const secondary = {
  main: '#f50057',
  light: '#ff5983',
  dark: '#bb002f',
  contrastText: '#ffffff'
};

// Couleurs neutres
export const neutral = {
  white: '#ffffff',
  black: '#000000',
  grey50: '#fafafa',
  grey100: '#f5f5f5',
  grey200: '#eeeeee',
  grey300: '#e0e0e0',
  grey400: '#bdbdbd',
  grey500: '#9e9e9e',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121'
};

// Couleurs de feedback
export const feedback = {
  success: {
    main: '#4caf50',
    light: '#80e27e',
    dark: '#087f23',
    contrastText: '#ffffff'
  },
  warning: {
    main: '#ff9800',
    light: '#ffc947',
    dark: '#c66900',
    contrastText: '#000000'
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
    contrastText: '#ffffff'
  },
  info: {
    main: '#2196f3',
    light: '#6ec6ff',
    dark: '#0069c0',
    contrastText: '#ffffff'
  }
};

// Couleurs de fond
export const background = {
  default: neutral.grey50,
  paper: neutral.white,
  dark: neutral.grey900
};

// Couleurs de texte
export const text = {
  primary: neutral.grey900,
  secondary: neutral.grey600,
  disabled: neutral.grey400,
  hint: neutral.grey500
};

// Palette complète
const colors = {
  primary,
  secondary,
  neutral,
  feedback,
  background,
  text
};

export default colors;
