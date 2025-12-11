/**
 * Design System Theme Configuration
 * Central source of truth for colors, typography, spacing, and visual styles
 */

export const colors = {
  // Primary
  primary: "#00ff87",
  primaryDark: "#00cc6a",
  primaryLight: "#33ffaa",

  // Background
  background: {
    primary: "#121212",
    secondary: "#1a1a1a",
    tertiary: "#232323",
    elevated: "#2a2a2a",
  },

  // Text
  text: {
    primary: "#ffffff",
    secondary: "#cccccc",
    tertiary: "#999999",
    disabled: "#666666",
  },

  // Borders
  border: {
    light: "#333333",
    medium: "#444444",
    dark: "#555555",
  },

  // Status
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#FF5722",
  info: "#2196F3",

  // Overlays
  overlay: "rgba(0, 0, 0, 0.8)",
  overlayLight: "rgba(0, 0, 0, 0.5)",
};

export const typography = {
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },

  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
};

export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Default theme export
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
