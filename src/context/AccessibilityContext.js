// src/context/AccessibilityContext.js
import React, { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    screenReader: false,
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    vibration: false,
    colorInversion: false,
    dndEnabled: false,
    inAppSoundsEnabled: true,
    appUpdatesEnabled: true,
    promotionsEnabled: false,
    newsletterEnabled: true,
    serviceSmsEnabled: true,
  });

  // update a single key
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // update multiple keys at once
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
