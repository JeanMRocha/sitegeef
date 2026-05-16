/**
 * Identidade Visual GEEF
 *
 * Baseada em:
 * - Uva (roxo): símbolo espiritual, meditação
 * - Videira (verde): crescimento, vida
 * - Luz (bege/creme): pureza, abertura
 */

export const colors = {
  // Primárias (Uva)
  uva: {
    950: "#3d0028",
    900: "#5a003d",
    800: "#7a0050",
    700: "#8a005a",
    600: "#a01470",
    500: "#b82d8a",
    400: "#d058aa",
    300: "#e08ac4",
    200: "#f0b5de",
    100: "#f8ddef",
  },

  // Secundárias (Videira)
  videira: {
    950: "#1a3d2e",
    900: "#2d5a47",
    800: "#3d7a5a",
    700: "#4d9a6d",
    600: "#63c984",
    500: "#7dd99a",
    400: "#9ae5b0",
    300: "#b5f0c9",
    200: "#d4f8e0",
    100: "#edfdf5",
  },

  // Neutros (Luz)
  light: {
    950: "#1c201f",
    900: "#2d3135",
    800: "#3d4449",
    700: "#525a63",
    600: "#6b7580",
    500: "#8a95a8",
    400: "#a8b5c4",
    300: "#c8d0dc",
    200: "#dfe3e8",
    100: "#f0f2f5",
    50: "#f8f9fa",
  },

  // Contexto
  bg: "#f8f4ec", // Bege claro (fundo light)
  bgDark: "#11100f", // Fundo dark
  text: "#1c201f", // Texto light
  textDark: "#f4efe7", // Texto dark

  // Estados
  success: "#63c984",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const;

/**
 * Temas: Light e Dark
 */
export const themes = {
  light: {
    bg: colors.bg,
    surface: "rgba(255, 255, 255, 0.84)",
    surfaceHover: "rgba(255, 255, 255, 0.92)",
    text: colors.text,
    textMuted: colors.light[600],
    border: colors.light[200],
    primary: colors.uva[700],
    primaryHover: colors.uva[800],
    secondary: colors.videira[600],
    secondaryHover: colors.videira[700],
  },
  dark: {
    bg: colors.bgDark,
    surface: "#221f1d",
    surfaceHover: "#2d2926",
    text: colors.textDark,
    textMuted: "#b7ada2",
    border: "#453f3a",
    primary: "#d06aa8",
    primaryHover: colors.uva[300],
    secondary: "#8fd4a2",
    secondaryHover: colors.videira[300],
  },
} as const;

export type Theme = keyof typeof themes;
export type Colors = typeof colors;
export type ThemeColors = typeof themes.light;
