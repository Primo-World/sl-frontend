// screens/AccessibilityScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  AccessibilityInfo,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibilityScreen() {
  const { theme } = useTheme();
  const { settings, updateSetting } = useAccessibility();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    section: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    leftRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    sectionText: {
      fontSize: settings.largeText ? 20 : 16,
      color: theme.text,
      flex: 1,
    },
    sectionIcon: {
      marginRight: 12,
    },
    scroll: {
      marginTop: 10,
    },
    infoBox: {
      padding: 20,
    },
    infoText: {
      fontSize: settings.largeText ? 18 : 14,
      color: theme.text,
      lineHeight: settings.largeText ? 26 : 20,
    },
    sectionHeader: {
      fontSize: settings.largeText ? 18 : 14,
      fontWeight: "bold",
      color: theme.text,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
    },
  });

  const handleToggle = (key, label, val) => {
    updateSetting(key, val);
    AccessibilityInfo.announceForAccessibility(
      `${label} ${val ? "enabled" : "disabled"}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView style={styles.scroll}>
        {/* Vision */}
        <Text style={styles.sectionHeader}>Vision</Text>
        {[
          { key: "screenReader", label: "Screen Reader", icon: "volume-high-outline" },
          { key: "highContrast", label: "High Contrast Mode", icon: "contrast-outline" },
          { key: "largeText", label: "Large Text", icon: "text-outline" },
        ].map((item) => (
          <View key={item.key} style={styles.section}>
            <View style={styles.leftRow}>
              <Icon name={item.icon} size={22} color={theme.text} style={styles.sectionIcon} />
              <Text style={styles.sectionText}>{item.label}</Text>
            </View>
            <Switch
              value={settings[item.key]}
              onValueChange={(val) => handleToggle(item.key, item.label, val)}
            />
          </View>
        ))}

        {/* Motion */}
        <Text style={styles.sectionHeader}>Motion</Text>
        <View style={styles.section}>
          <View style={styles.leftRow}>
            <Icon name="remove-outline" size={22} color={theme.text} style={styles.sectionIcon} />
            <Text style={styles.sectionText}>Reduce Motion</Text>
          </View>
          <Switch
            value={settings.reduceMotion}
            onValueChange={(val) => handleToggle("reduceMotion", "Reduce Motion", val)}
          />
        </View>

        {/* Interaction */}
        <Text style={styles.sectionHeader}>Interaction</Text>
        <View style={styles.section}>
          <View style={styles.leftRow}>
            <Icon
              name="notifications-outline" // ✅ replaced vibrate-outline
              size={22}
              color={theme.text}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionText}>Vibration Feedback</Text>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={(val) => handleToggle("vibration", "Vibration Feedback", val)}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.leftRow}>
            <Icon name="color-filter-outline" size={22} color={theme.text} style={styles.sectionIcon} />
            <Text style={styles.sectionText}>Color Inversion</Text>
          </View>
          <Switch
            value={settings.colorInversion}
            onValueChange={(val) => handleToggle("colorInversion", "Color Inversion", val)}
          />
        </View>

        {/* Learn More */}
        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            Alert.alert(
              "Accessibility",
              "Accessibility settings help improve usability for all users. Enable features like screen readers, high contrast mode, or reduced motion to suit your needs."
            )
          }
        >
          <View style={styles.leftRow}>
            <Icon
              name="information-circle-outline"
              size={22}
              color={theme.text}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionText}>
              Learn More About Accessibility
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            These features are designed to make your app more inclusive and
            user-friendly for everyone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
