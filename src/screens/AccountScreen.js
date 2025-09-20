import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";
import AccessibleButton from "../components/AccessibleButton";

export default function AccountScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  const dynamicStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    scrollContainer: { paddingBottom: 40, backgroundColor: theme.background },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 40, backgroundColor: theme.background },
    profileSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    nameText: { fontSize: settings.largeText ? 28 : 24, fontWeight: "bold", color: theme.text },
    ratingContainer: {
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginTop: 4,
      alignSelf: "flex-start",
      backgroundColor: theme.cardBackground ?? theme.background,
    },
    ratingText: { fontSize: settings.largeText ? 18 : 14, color: theme.text },
    profileImagePlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.cardBackground ?? "#ccc",
      justifyContent: "center",
      alignItems: "center",
    },
    quickActionsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    quickActionButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 8,
      marginHorizontal: 4,
      alignItems: "center",
      backgroundColor: theme.cardBackground ?? theme.background,
    },
    quickActionText: { marginTop: 8, fontSize: settings.largeText ? 18 : 14, color: theme.text },
    infoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 12, marginBottom: 12, backgroundColor: theme.cardBackground ?? theme.background },
    infoTitle: { fontSize: settings.largeText ? 20 : 16, fontWeight: "bold", color: theme.text },
    infoSubtitle: { fontSize: settings.largeText ? 18 : 14, marginTop: 4, color: theme.tabBarInactive },
    progressText: { fontSize: settings.largeText ? 20 : 16, fontWeight: "bold", color: theme.text },
    sectionHeader: { fontSize: settings.largeText ? 18 : 14, fontWeight: "bold", marginBottom: 10, marginTop: 20, textTransform: "uppercase", color: theme.tabBarInactive },
    menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.tabBarInactive, backgroundColor: theme.cardBackground ?? theme.background },
    menuIcon: { marginRight: 16 },
    menuTitle: { fontSize: settings.largeText ? 20 : 16, color: theme.text, flexShrink: 1 },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
        <View style={dynamicStyles.container}>
          {/* User Profile Section */}
          <View style={dynamicStyles.profileSection}>
            <View>
              <Text allowFontScaling maxFontSizeMultiplier={2.5} style={dynamicStyles.nameText}>
                Frank Antwi
              </Text>
              <View style={dynamicStyles.ratingContainer}>
                <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.ratingText}>
                  ⭐ 5.0
                </Text>
              </View>
            </View>

            {/* Clickable Profile Circle */}
            <TouchableOpacity
              style={dynamicStyles.profileImagePlaceholder}
              // ✅ Navigate correctly to the nested EditProfile screen
              onPress={() => navigation.navigate("Settings", { screen: "EditProfile" })}
              accessibilityLabel="Edit your profile"
            >
              <Icon name="person-outline" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Section Header */}
          <Text allowFontScaling maxFontSizeMultiplier={2.5} style={dynamicStyles.sectionHeader}>
            YOUR ACTIONS
          </Text>

          {/* Quick Action Buttons */}
          <View style={dynamicStyles.quickActionsContainer}>
            <AccessibleButton label="Help" onPress={() => navigation.navigate("Help")} style={dynamicStyles.quickActionButton} accessibilityLabel="Get help and support">
              <Icon name="help-circle-outline" size={24} color={theme.text} />
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.quickActionText}>Help</Text>
            </AccessibleButton>

            <AccessibleButton label="Wallet" onPress={() => navigation.navigate("Wallet")} style={dynamicStyles.quickActionButton} accessibilityLabel="Open your wallet">
              <Icon name="wallet-outline" size={24} color={theme.text} />
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.quickActionText}>Wallet</Text>
            </AccessibleButton>

            <AccessibleButton label="Activity" onPress={() => navigation.navigate("Activity")} style={dynamicStyles.quickActionButton} accessibilityLabel="View your activity history">
              <Icon name="time" size={24} color={theme.text} />
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.quickActionText}>Activity</Text>
            </AccessibleButton>
          </View>

          {/* Informational Cards */}
          <AccessibleButton label="Safety Checkup" onPress={() => {}} style={dynamicStyles.infoCard} accessibilityLabel="Learn ways to make rides safer">
            <View>
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.infoTitle}>Safety checkup</Text>
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.infoSubtitle}>Learn ways to make rides safer</Text>
            </View>
            <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.progressText}>1/7</Text>
          </AccessibleButton>

          <AccessibleButton label="Privacy Checkup" onPress={() => {}} style={dynamicStyles.infoCard} accessibilityLabel="Take a privacy settings tour">
            <View>
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.infoTitle}>Privacy checkup</Text>
              <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.infoSubtitle}>Take an interactive tour of your privacy settings</Text>
            </View>
            <MaterialCommunityIcons name="clipboard-check-outline" size={27} color={theme.tabBarActive} />
          </AccessibleButton>

          {/* Section Header */}
          <Text allowFontScaling maxFontSizeMultiplier={2.5} style={dynamicStyles.sectionHeader}>
            MORE OPTIONS
          </Text>

          {/* Menu Items */}
          <AccessibleButton label="Settings" onPress={() => navigation.navigate("Settings")} style={dynamicStyles.menuItem} accessibilityLabel="Go to settings">
            <Icon name="settings-outline" size={24} color={theme.text} style={dynamicStyles.menuIcon} />
            <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.menuTitle}>Settings</Text>
          </AccessibleButton>

          <AccessibleButton label="Messages" onPress={() => navigation.navigate("Messages")} style={dynamicStyles.menuItem} accessibilityLabel="Open messages">
            <Icon name="mail-outline" size={24} color={theme.text} style={dynamicStyles.menuIcon} />
            <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.menuTitle}>Messages</Text>
          </AccessibleButton>

          <AccessibleButton label="Refer a Friend" onPress={() => navigation.navigate("Refer")} style={dynamicStyles.menuItem} accessibilityLabel="Refer a friend to the app">
            <Icon name="gift-outline" size={24} color={theme.text} style={dynamicStyles.menuIcon} />
            <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.menuTitle}>Refer a Friend</Text>
          </AccessibleButton>

          <AccessibleButton label="Earn" onPress={() => navigation.navigate("Earn")} style={dynamicStyles.menuItem} accessibilityLabel="Earn by driving or delivering">
            <MaterialCommunityIcons name="car-outline" size={24} color={theme.text} style={dynamicStyles.menuIcon} />
            <Text allowFontScaling maxFontSizeMultiplier={2.0} style={dynamicStyles.menuTitle}>Earn by driving or delivering</Text>
          </AccessibleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
