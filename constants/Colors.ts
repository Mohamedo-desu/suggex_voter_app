// Color themes
const ColorThemes = {
  FOREST: {
    primary: "#4CAF50",
    textPrimary: "#2e5a2e",
    textSecondary: "#688f68",
    textDark: "#2a2c2a",
    placeholderText: "#767676",
    background: "#ffffff",
    cardBackground: "#f1f8f2",
    inputBackground: "#f4faf5",
    border: "#c8e6c9",
    white: "#ffffff",
    black: "#000000",
    error: "#FF3D00",
    warning: "#FFA500",
    success: "#0acf45",
    invited: "#BA68C8",
  },
  RETRO: {
    primary: "#e17055",
    textPrimary: "#784e2d",
    textSecondary: "#a58e7c",
    textDark: "#50372a",
    placeholderText: "#767676",
    background: "#ede1d1",
    cardBackground: "#faf5eb",
    inputBackground: "#f7f2ea",
    border: "#e2d6c1",
    white: "#ffffff",
    black: "#000000",
  },
  OCEAN: {
    primary: "#1976D2",
    textPrimary: "#1a4971",
    textSecondary: "#6d93b8",
    textDark: "#0d2b43",
    placeholderText: "#767676",
    background: "#e3f2fd",
    cardBackground: "#f5f9ff",
    inputBackground: "#f0f8ff",
    border: "#bbdefb",
    white: "#ffffff",
    black: "#000000",
  },
  BLOSSOM: {
    primary: "#EC407A",
    textPrimary: "#7d2150",
    textSecondary: "#b06a8f",
    textDark: "#5a1836",
    placeholderText: "#767676",
    background: "#fce4ec",
    cardBackground: "#fff5f8",
    inputBackground: "#fef8fa",
    border: "#f8bbd0",
    white: "#ffffff",
    black: "#000000",
  },
  SUNSET: {
    primary: "#FF7043",
    textPrimary: "#6b2d16",
    textSecondary: "#b7654a",
    textDark: "#3e1c0e",
    placeholderText: "#767676",
    background: "#fff3e0",
    cardBackground: "#fff8f1",
    inputBackground: "#fff9f4",
    border: "#ffccbc",
    white: "#ffffff",
    black: "#000000",
  },
  MIDNIGHT: {
    primary: "#3F51B5",
    textPrimary: "#1c204d",
    textSecondary: "#7379a1",
    textDark: "#121631",
    placeholderText: "#767676",
    background: "#e8eaf6",
    cardBackground: "#f0f1fa",
    inputBackground: "#f4f5fd",
    border: "#c5cae9",
    white: "#ffffff",
    black: "#000000",
  },
  PASTEL: {
    primary: "#BA68C8",
    textPrimary: "#5e2c6c",
    textSecondary: "#a67aae",
    textDark: "#421f4d",
    placeholderText: "#767676",
    background: "#f3e5f5",
    cardBackground: "#faf0fb",
    inputBackground: "#f9f4fc",
    border: "#e1bee7",
    white: "#ffffff",
    black: "#000000",
  },
};

// Random color theme generator
export const getRandomColors = () => {
  const themes = Object.values(ColorThemes);
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
};

// Default export (set the default to FOREST or change as needed)
const Colors = ColorThemes.FOREST;

export default Colors;
