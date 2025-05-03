import { createTheme } from '@shopify/restyle';

export const palette = {
  primary: '#4CAF50',
  textPrimary: '#2e5a2e',
  textSecondary: '#688f68',
  textDark: '#2a2c2a',
  placeholderText: '#b9b9b9',
  background: '#ffffff',
  cardBackground: '#f1f8f2',
  inputBackground: '#f4faf5',
  border: '#c8e6c9',
  white: '#ffffff',
  black: '#000000',
  lightGray: '#EEE',
  darkGray: '#333',
  error: '#FF3D00',
  warning: '#FFA500',
  success: '#0acf45',
  invited: '#BA68C8',
};

const theme = createTheme({
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  colors: {
    background: palette.background,
    mainBackground: palette.background,
    mainForeground: palette.textDark,
    primary: palette.primary,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textDark: palette.textDark,
    placeholderText: palette.placeholderText,
    cardBackground: palette.cardBackground,
    inputBackground: palette.inputBackground,
    border: palette.border,
    white: palette.white,
    black: palette.black,
    lightGray: palette.lightGray,
    darkGray: palette.darkGray,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
    invited: palette.invited,
  },
  textVariants: {
    defaults: {
      color: 'mainForeground',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'textPrimary',
    },
    subheader: {
      fontSize: 20,
      fontWeight: '600',
      color: 'textPrimary',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: 'textDark',
    },
    caption: {
      fontSize: 14,
      color: 'textSecondary',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 8,
      padding: 'm',
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'cardBackground',
    },
  },
});

type Theme = typeof theme;

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.darkGray,
    mainBackground: palette.darkGray,
    mainForeground: palette.white,
    cardBackground: palette.black,
    inputBackground: palette.darkGray,
  },
};

export default theme;
