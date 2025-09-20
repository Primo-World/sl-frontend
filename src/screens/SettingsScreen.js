import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext"; // now using user from context

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useContext(AuthContext); // <-- get user from context
  const isDarkMode = theme.mode === "dark";

  const displayName = user?.name ?? "Frank Antwi";
  const displayPhone = user?.phone ?? "+233 59 942 9509";
  const displayEmail = user?.email ?? "frankantwi301@gmail.com";

  const initials = (displayName || "F")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.tabBarBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    profileImagePlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.tabBarInactive,
      marginRight: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    initialsText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.background, // contrasts with placeholder
    },
    profileInfo: {
      flex: 1,
    },
    nameText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    contactText: {
      fontSize: 14,
      color: theme.tabBarInactive,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.tabBarInactive,
      marginBottom: 10,
      marginTop: 10,
      textTransform: "uppercase",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.tabBarInactive,
    },
    menuItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      color: theme.text,
    },
    menuSubtitle: {
      fontSize: 12,
      color: theme.tabBarInactive,
      marginTop: 2,
    },
    logoutButton: {
      marginTop: 30,
      paddingVertical: 14,
      backgroundColor: "#e53935",
      borderRadius: 8,
      alignItems: "center",
    },
    logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <ScrollView contentContainerStyle={dynamicStyles.container}>
        {/* Profile Section is now tappable and reads from AuthContext */}
        <TouchableOpacity
          style={dynamicStyles.profileSection}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={dynamicStyles.profileImagePlaceholder}>
            <Text style={dynamicStyles.initialsText}>{initials}</Text>
          </View>

          <View style={dynamicStyles.profileInfo}>
            <Text style={dynamicStyles.nameText}>{displayName}</Text>
            <Text style={dynamicStyles.contactText}>{displayPhone}</Text>
            <Text style={dynamicStyles.contactText}>{displayEmail}</Text>
          </View>

          <Icon name="chevron-forward-outline" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* App Settings Section */}
        <Text style={dynamicStyles.sectionHeader}>App Settings</Text>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("AddHome")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <Icon
              name="home-outline"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Add Home</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("AddWork")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <Icon
              name="briefcase-outline"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Add Work</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("Shortcuts")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <Icon
              name="bookmarks-outline"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Shortcuts</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("Privacy")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <Icon
              name="lock-closed-outline"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Privacy</Text>
              <Text style={dynamicStyles.menuSubtitle}>Manage the data you share with us</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        <View style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemContent}>
            <Icon name="sunny-outline" size={24} color={theme.text} style={dynamicStyles.menuIcon} />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Appearance</Text>
              <Text style={dynamicStyles.menuSubtitle}>{isDarkMode ? "Dark mode" : "Light mode"}</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: theme.tabBarInactive, true: theme.tabBarActive }}
            thumbColor={isDarkMode ? theme.text : theme.background}
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("Accessibility")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <MaterialCommunityIcons
              name="human-wheelchair"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Accessibility</Text>
              <Text style={dynamicStyles.menuSubtitle}>Manage your accessibility settings</Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("Communication")}
        >
          <View style={dynamicStyles.menuItemContent}>
            <Icon
              name="chatbox-ellipses-outline"
              size={24}
              color={theme.text}
              style={dynamicStyles.menuIcon}
            />
            <View style={dynamicStyles.menuTextContainer}>
              <Text style={dynamicStyles.menuTitle}>Communication</Text>
              <Text style={dynamicStyles.menuSubtitle}>
                Choose your preferred contact methods and manage your notification settings
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={theme.tabBarInactive} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={dynamicStyles.logoutButton} onPress={logout}>
          <Text style={dynamicStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
