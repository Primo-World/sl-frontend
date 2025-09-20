import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

// A reusable component for a privacy setting option.
// It can handle a toggle (switch) or a button (navigates to a new screen).
const PrivacyOption = ({ icon, title, description, isEnabled, onToggle, onPress, type, theme }) => (
  <TouchableOpacity
    style={styles(theme).optionItem}
    onPress={onPress}
    disabled={type === "toggle"} // Disable the press effect if it's a toggle
  >
    {/* Fix: Explicitly set icon color to ensure visibility in dark mode */}
    <Icon
      name={icon}
      size={24}
      color={theme.mode === 'dark' ? '#A0A0A0' : theme.text}
      style={styles(theme).optionIcon}
    />
    <View style={styles(theme).optionContent}>
      <Text style={styles(theme).optionTitle}>{title}</Text>
      {/* Fix: Explicitly set description color for visibility in dark mode */}
      <Text style={styles(theme).optionDescription}>{description}</Text>
    </View>
    {/* Only render the Switch component if the type is "toggle" */}
    {type === "toggle" && (
      <Switch
        trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
        thumbColor={theme.switchThumb}
        ios_backgroundColor={theme.switchIosBackground}
        onValueChange={onToggle}
        value={isEnabled}
      />
    )}
    {/* Only render the chevron icon if the type is "button" */}
    {type === "button" && (
      <Icon
        name="chevron-forward-outline"
        size={24}
        // Fix: Explicitly set chevron color to ensure visibility in dark mode
        color={theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary}
      />
    )}
  </TouchableOpacity>
);

// Centralized stylesheet function to handle dynamic theming.
const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollViewContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginTop: 24,
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: theme.text,
  },
  optionDescription: {
    fontSize: 14,
    // Fix: Use a lighter color for descriptions in dark mode
    color: theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary,
    marginTop: 2,
  },
});

export default function PrivacyScreen() {
  const { theme } = useTheme();
  // State variables for various privacy settings
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(true);
  const [personalizedContentEnabled, setPersonalizedContentEnabled] = useState(false);
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);

  // Example function for handling button presses
  const handleButtonPress = (feature) => {
    console.log(`Navigating to ${feature} screen.`);
    // In a real app, you would use navigation.navigate() here.
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles(theme).scrollViewContent}>

        {/* --- Data Usage Section --- */}
        <Text style={styles(theme).sectionHeader}>Data Usage</Text>
        <PrivacyOption
          type="toggle"
          icon="bar-chart-outline"
          title="Limit Data Collection"
          description="We will only collect essential data to operate the service and improve features."
          isEnabled={dataCollectionEnabled}
          onToggle={() => setDataCollectionEnabled(!dataCollectionEnabled)}
          theme={theme}
        />
        <PrivacyOption
          type="toggle"
          icon="person-outline"
          title="Personalized Content"
          description="Allow us to suggest content and features based on your usage."
          isEnabled={personalizedContentEnabled}
          onToggle={() => setPersonalizedContentEnabled(!personalizedContentEnabled)}
          theme={theme}
        />
        <PrivacyOption
          type="toggle"
          icon="bug-outline"
          title="Send Crash Reports"
          description="Automatically send crash data to help us fix bugs and improve stability."
          isEnabled={crashReportsEnabled}
          onToggle={() => setCrashReportsEnabled(!crashReportsEnabled)}
          theme={theme}
        />

        {/* --- Account Security Section --- */}
        <Text style={styles(theme).sectionHeader}>Account Security</Text>
        <PrivacyOption
          type="button"
          icon="lock-closed-outline"
          title="Change Password"
          description="Secure your account by changing your password."
          onPress={() => handleButtonPress("ChangePassword")}
          theme={theme}
        />
        <PrivacyOption
          type="toggle"
          icon="shield-checkmark-outline"
          title="Two-Factor Authentication (2FA)"
          description="Add an extra layer of security to your account."
          isEnabled={twoFactorAuthEnabled}
          onToggle={() => setTwoFactorAuthEnabled(!twoFactorAuthEnabled)}
          theme={theme}
        />
        <PrivacyOption
          type="button"
          icon="receipt-outline"
          title="Review Authorized Devices"
          description="See and manage all devices logged into your account."
          onPress={() => handleButtonPress("AuthorizedDevices")}
          theme={theme}
        />

        {/* --- Data Control Section --- */}
        <Text style={styles(theme).sectionHeader}>Your Data</Text>
        <PrivacyOption
          type="button"
          icon="download-outline"
          title="Request a Data Download"
          description="Receive a copy of your personal information."
          onPress={() => handleButtonPress("RequestDataDownload")}
          theme={theme}
        />
        <PrivacyOption
          type="button"
          icon="trash-outline"
          title="Delete My Account"
          description="This action is permanent and cannot be undone."
          onPress={() => handleButtonPress("DeleteAccount")}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
