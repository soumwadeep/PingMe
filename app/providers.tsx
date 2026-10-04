"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PaletteMode } from "@mui/material";

type Appearance = "light" | "dark" | "system";
type AppearanceContextValue = { appearance: Appearance; setAppearance: (value: Appearance) => void };
const AppearanceContext = createContext<AppearanceContextValue>({ appearance: "system", setAppearance: () => undefined });

export function useAppearance() {
  return useContext(AppearanceContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>(() => typeof window === "undefined" ? "system" : (localStorage.getItem("pingme-appearance") as Appearance | null) || "system");
  const [systemMode, setSystemMode] = useState<PaletteMode>(() => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemMode(media.matches ? "dark" : "light");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const setAppearance = (value: Appearance) => {
    setAppearanceState(value);
    localStorage.setItem("pingme-appearance", value);
  };
  const mode = appearance === "system" ? systemMode : appearance;
  const theme = useMemo(() => createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: { main: "#635BFF", light: "#8B83FF", dark: "#4D45E6" },
      success: { main: "#22C55E" }, warning: { main: "#F59E0B" }, error: { main: "#EF4444" },
      background: mode === "light" ? { default: "#F7F8FC", paper: "#FFFFFF" } : { default: "#0D0E14", paper: "#161821" },
      text: mode === "light" ? { primary: "#15171A", secondary: "#6B7280" } : { primary: "#F6F7FB", secondary: "#9CA3AF" },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
      h1: { fontWeight: 750, letterSpacing: "-0.045em" },
      h2: { fontWeight: 720, letterSpacing: "-0.035em" },
      button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 12, minHeight: 44, boxShadow: "none" } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  }), [mode]);

  return <AppearanceContext.Provider value={{ appearance, setAppearance }}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></AppearanceContext.Provider>;
}
