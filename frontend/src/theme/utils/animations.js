/**
 * Utilitaires d'animation pour le système de design
 * Définit des animations réutilisables dans toute l'application
 */

// Durées d'animation
export const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
};

// Courbes d'accélération
export const easing = {
  // Accélération standard
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Décélération (entrée)
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Accélération (sortie)
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // Rebond
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

/**
 * Crée une transition CSS pour les propriétés spécifiées
 * @param {Object} props - Options de transition
 * @param {Array<string>} props.properties - Propriétés CSS à animer
 * @param {string} props.easing - Courbe d'accélération à utiliser
 * @param {number} props.duration - Durée de l'animation en ms
 * @param {number} props.delay - Délai avant le début de l'animation en ms
 * @returns {string} Chaîne de transition CSS
 */
export const createTransition = ({
  properties = ['all'],
  easing: easingValue = easing.easeInOut,
  duration: durationValue = duration.standard,
  delay = 0,
}) => {
  return properties
    .map((property) => `${property} ${durationValue}ms ${easingValue} ${delay}ms`)
    .join(',');
};

/**
 * Animations CSS prédéfinies
 */
export const animations = {
  // Fondu
  fade: {
    in: {
      opacity: 1,
      transition: createTransition({
        properties: ['opacity'],
        duration: duration.shorter,
      }),
    },
    out: {
      opacity: 0,
      transition: createTransition({
        properties: ['opacity'],
        duration: duration.shorter,
      }),
    },
  },

  // Zoom
  zoom: {
    in: {
      transform: 'scale(1)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.shorter,
        easing: easing.easeOut,
      }),
    },
    out: {
      transform: 'scale(0)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.shorter,
        easing: easing.easeIn,
      }),
    },
  },

  // Glissement
  slide: {
    up: {
      transform: 'translateY(0)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
    down: {
      transform: 'translateY(100%)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
    left: {
      transform: 'translateX(-100%)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
    right: {
      transform: 'translateX(100%)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
  },

  // Rotation
  rotate: {
    in: {
      transform: 'rotate(0deg)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
    out: {
      transform: 'rotate(90deg)',
      transition: createTransition({
        properties: ['transform'],
        duration: duration.standard,
      }),
    },
  },

  // Pulsation
  pulse: {
    keyframes: `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
    animation: 'pulse 1.5s infinite',
  },

  // Secousse
  shake: {
    keyframes: `
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(5px);
        }
      }
    `,
    animation: 'shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
  },

  // Rebond
  bounce: {
    keyframes: `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
    `,
    animation: 'bounce 1s ease infinite',
  },
};

/**
 * Génère une chaîne CSS avec toutes les animations keyframes
 * @returns {string} Chaîne CSS avec toutes les animations keyframes
 */
export const generateKeyframes = () => {
  return Object.values(animations)
    .filter((animation) => animation.keyframes)
    .map((animation) => animation.keyframes)
    .join('\n');
};

// Configuration complète des animations
const animationUtils = {
  duration,
  easing,
  createTransition,
  animations,
  generateKeyframes,
};

export default animationUtils;
