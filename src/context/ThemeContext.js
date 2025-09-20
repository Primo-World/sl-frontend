import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { AccessibilityInfo, Vibration } from "react-native";
import { useAccessibility } from "./AccessibilityContext";

const ThemeContext = createContext();

// ---------- Base themes ----------
const lightColors = {
  mode: "light",
  background: "#ffffff",
  text: "#000000",
  subText: "#444444",         // secondary text
  primary: "#007AFF",         // NEW - main accent (blue like iOS)
  buttonText: "#ffffff",      // text on buttons
  placeholder: "#888888",     // input placeholders
  border: "#dcdcdc",
  cardBackground: "#f8f8f8",  // surface background
  tabBarBackground: "#f8f8f8",
  tabBarActive: "#000000",
  tabBarInactive: "#7a7a7a",
  icon: "#000000",            // ADDED: Icon color for light mode
  iconBackground: "#E8E8E8",  // ADDED: Icon background for light mode
};

const darkColors = {
  mode: "dark",
  background: "#000000",
  text: "#ffffff",
  subText: "#cccccc",
  primary: "#0A84FF",         // NEW - brighter blue for dark mode
  buttonText: "#000000",
  placeholder: "#aaaaaa",
  border: "#333333",
  cardBackground: "#1a1a1a",
  tabBarBackground: "#0b0b0b",
  tabBarActive: "#ffffff",
  tabBarInactive: "#7a7a7a",
  icon: "#FFFFFF",            // ADDED: Icon color for dark mode
  iconBackground: "#3A3A3C",  // ADDED: Icon background for dark mode
};

// ---------- High contrast variants ----------
const highContrastLight = {
  ...lightColors,
  background: "#ffffff",
  text: "#000000",
  subText: "#000000",
  primary: "#0000FF",         // high contrast blue
  buttonText: "#000000",
  placeholder: "#000000",
  border: "#000000",
  cardBackground: "#ffffff",
  tabBarBackground: "#ffffff",
  tabBarActive: "#000000",
  tabBarInactive: "#000000",
  icon: "#000000",            // ADDED: Icon color for high contrast light
  iconBackground: "#F2F2F7",  // ADDED: Icon background for high contrast light
};

const highContrastDark = {
  ...darkColors,
  background: "#000000",
  text: "#ffffff",
  subText: "#ffffff",
  primary: "#FFFF00",         // high contrast yellow on black
  buttonText: "#ffffff",
  placeholder: "#ffffff",
  border: "#ffffff",
  cardBackground: "#000000",
  tabBarBackground: "#000000",
  tabBarActive: "#ffffff",
  tabBarInactive: "#ffffff",
  icon: "#ffffff",            // ADDED: Icon color for high contrast dark
  iconBackground: "#1A1A1A",  // ADDED: Icon background for high contrast dark
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("dark");
  const { settings } = useAccessibility();

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
    if (settings.vibration) {
      Vibration.vibrate(50); // haptic feedback
    }
  };

  // Announce for screen readers
  useEffect(() => {
    if (settings.screenReader) {
      AccessibilityInfo.announceForAccessibility("Screen reader enabled");
    }
  }, [settings.screenReader]);

  // ---------- Compute theme ----------
  const theme = useMemo(() => {
    let baseTheme =
      settings.highContrast
        ? themeMode === "dark"
          ? highContrastDark
          : highContrastLight
        : themeMode === "dark"
        ? darkColors
        : lightColors;

    // Color inversion (invert ALL relevant surfaces)
    if (settings.colorInversion) {
      baseTheme = {
        ...baseTheme,
        background: baseTheme.text,
        text: baseTheme.background,
        subText: baseTheme.background,
        primary: baseTheme.border,      // invert primary as well
        buttonText: baseTheme.background,
        placeholder: baseTheme.background,
        border: baseTheme.text,
        cardBackground: baseTheme.text,
        tabBarBackground: baseTheme.text,
        tabBarActive: baseTheme.background,
        tabBarInactive: baseTheme.background,
      };
    }

    return baseTheme;
  }, [themeMode, settings]);

  // ---------- Global helper for reduceMotion ----------
  const prefersReducedMotion = settings.reduceMotion;

  /**
   * Helper to run animations conditionally.
   * @param {Function} animatedFn - function returning animation
   * @param {any} fallback - fallback value if reduceMotion is enabled
   */
  const withMotion = (animatedFn, fallback) => {
    return prefersReducedMotion ? fallback : animatedFn();
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        prefersReducedMotion,
        withMotion, // expose motion helper
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);