import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";

// Screens
import SettingsScreen from "../screens/SettingsScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import AccessibilityScreen from "../screens/AccessibilityScreen";
import AddHomeScreen from "../screens/AddHomeScreen";
import AddWorkScreen from "../screens/AddWorkScreen";
import ShortcutsScreen from "../screens/ShortcutsScreen";
import CommunicationScreen from "../screens/CommunicationScreen";
import EditProfileScreen from "../screens/EditProfileScreen"; // ✅ new screen

const Stack = createNativeStackNavigator();

function SettingsStack() {
  const { colors, dark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: dark ? colors.card : "#fff",
        },
        headerTintColor: dark ? colors.text : "#000",
        headerTitleStyle: {
          fontWeight: "bold",
          color: colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      {/* ✅ Main Settings screen */}
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />

      {/* ✅ Sub-screens */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: "Privacy" }}
      />
      <Stack.Screen
        name="Accessibility"
        component={AccessibilityScreen}
        options={{ title: "Accessibility" }}
      />
      <Stack.Screen
        name="AddHome"
        component={AddHomeScreen}
        options={{ title: "Add Home" }}
      />
      <Stack.Screen
        name="AddWork"
        component={AddWorkScreen}
        options={{ title: "Add Work" }}
      />
      <Stack.Screen
        name="Shortcuts"
        component={ShortcutsScreen}
        options={{ title: "Shortcuts" }}
      />
      <Stack.Screen
        name="Communication"
        component={CommunicationScreen}
        options={{ title: "Communication" }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStack;
