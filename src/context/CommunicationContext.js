import React, { createContext, useState, useMemo } from 'react';

// Default settings from your original file
const DEFAULTS = {
  dndEnabled: false,
  inAppSoundsEnabled: true,
  appUpdatesEnabled: true,
  promotionsEnabled: false,
  newsletterEnabled: true,
  serviceSmsEnabled: true,
};

export const CommunicationContext = createContext(null);

export function CommunicationProvider({ children }) {
  // State for location sharing
  const [shuttleLocation, setShuttleLocation] = useState(null);

  // State for app settings
  const [settings, setSettings] = useState(DEFAULTS);

  // Functions for location sharing
  const sendShuttleLocation = (shuttleId, location) => {
    // In a real app, this would send the location to your backend.
    setShuttleLocation(location);
    console.log(`Sending location for ${shuttleId}: ${location.latitude}, ${location.longitude}`);
  };

  const listenForShuttleLocation = (shuttleId) => {
    // This is where a user's app would listen for updates from the backend.
    // In our simplified version, we'll just return a placeholder function.
    return () => {
      console.log(`Listening for location for ${shuttleId}`);
    };
  };

  // Functions for app settings
  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const setSetting = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const unsubscribeAll = () =>
    setSettings((prev) => ({
      ...prev,
      appUpdatesEnabled: false,
      promotionsEnabled: false,
      newsletterEnabled: false,
      serviceSmsEnabled: false,
    }));

  const reset = () => setSettings(DEFAULTS);

  // Memoized value to prevent re-renders
  const value = useMemo(
    () => ({
      shuttleLocation,
      sendShuttleLocation,
      listenForShuttleLocation,
      settings,
      toggle,
      setSetting,
      unsubscribeAll,
      reset
    }),
    [shuttleLocation, settings]
  );

  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
}

// Custom hook for convenience
export function useCommunication() {
  const ctx = useContext(CommunicationContext);
  if (!ctx) {
    throw new Error("useCommunication must be used within a CommunicationProvider");
  }
  return ctx;
}
