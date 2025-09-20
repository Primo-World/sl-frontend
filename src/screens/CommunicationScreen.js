import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext"; // 👈 import context

const CommunicationOption = ({ icon, title, description, isEnabled, onToggle, theme }) => (
  <View style={styles(theme).optionItem}>
    <Icon
      name={icon}
      size={24}
      color={theme.text}
      style={styles(theme).optionIcon}
    />
    <View style={styles(theme).optionContent}>
      <Text style={styles(theme).optionTitle}>{title}</Text>
      <Text style={styles(theme).optionDescription}>{description}</Text>
    </View>
    <Switch
      trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
      thumbColor={theme.switchThumb}
      ios_backgroundColor={theme.switchIosBackground}
      onValueChange={onToggle}
      value={isEnabled}
    />
  </View>
);

export default function CommunicationScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings, updateSetting, updateSettings } = useAccessibility(); // 👈 global

  const handleUnsubscribeAll = () => {
    updateSettings({
      appUpdatesEnabled: false,
      promotionsEnabled: false,
      newsletterEnabled: false,
      serviceSmsEnabled: false,
    });
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles(theme).scrollViewContent}>

        <Text style={styles(theme).sectionHeader}>Do Not Disturb</Text>
        <CommunicationOption
          icon="moon-outline"
          title="Enable Do Not Disturb"
          description="Silence all notifications temporarily."
          isEnabled={settings.dndEnabled}
          onToggle={() => updateSetting("dndEnabled", !settings.dndEnabled)}
          theme={theme}
        />

        <Text style={styles(theme).sectionHeader}>In-App Notifications</Text>
        <CommunicationOption
          icon="volume-high-outline"
          title="In-App Sounds"
          description="Play sounds for new messages and events."
          isEnabled={settings.inAppSoundsEnabled}
          onToggle={() => updateSetting("inAppSoundsEnabled", !settings.inAppSoundsEnabled)}
          theme={theme}
        />

        <Text style={styles(theme).sectionHeader}>Email</Text>
        <CommunicationOption
          icon="sync-outline"
          title="App Updates"
          description="Receive important announcements and security updates."
          isEnabled={settings.appUpdatesEnabled}
          onToggle={() => updateSetting("appUpdatesEnabled", !settings.appUpdatesEnabled)}
          theme={theme}
        />
        <CommunicationOption
          icon="megaphone-outline"
          title="Promotions & Offers"
          description="Get special deals, tips, and updates."
          isEnabled={settings.promotionsEnabled}
          onToggle={() => updateSetting("promotionsEnabled", !settings.promotionsEnabled)}
          theme={theme}
        />
        <CommunicationOption
          icon="newspaper-outline"
          title="Weekly Newsletter"
          description="Subscribe to our curated weekly summary."
          isEnabled={settings.newsletterEnabled}
          onToggle={() => updateSetting("newsletterEnabled", !settings.newsletterEnabled)}
          theme={theme}
        />

        <Text style={styles(theme).sectionHeader}>SMS</Text>
        <CommunicationOption
          icon="chatbox-ellipses-outline"
          title="Service Alerts via SMS"
          description="Receive important updates via text message."
          isEnabled={settings.serviceSmsEnabled}
          onToggle={() => updateSetting("serviceSmsEnabled", !settings.serviceSmsEnabled)}
          theme={theme}
        />

        {/* ✅ Modern link-style unsubscribe */}
        <TouchableOpacity style={styles(theme).unsubscribeButton} onPress={handleUnsubscribeAll}>
          <Text style={styles(theme).unsubscribeText}>Unsubscribe from All</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollViewContent: { paddingTop: 16, paddingHorizontal: 16 },
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
  optionIcon: { marginRight: 15 },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 16, color: theme.text },
  optionDescription: {
    fontSize: 14,
    color: theme.mode === "dark" ? "#BBBBBB" : "#555555",
    marginTop: 2,
  },
  unsubscribeButton: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  unsubscribeText: { 
    color: "#007AFF", // 👈 iOS blue / modern link blue
    fontSize: 16, 
    fontWeight: "600" 
  },
});
