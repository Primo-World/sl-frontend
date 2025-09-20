import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ActivityScreen from "../screens/ActivityScreen";
import AccountStack from "./AccountStack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, Vibration, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

// Custom Accessible Tab Button
function AccessibleTabButton({ children, onPress, accessibilityLabel }) {
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  const handlePress = () => {
    if (settings.vibration) {
      Vibration.vibrate(40);
    }
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.tabButton,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabNavigator() {
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
      }}
    >
      {/* ✅ Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: settings.largeText ? 16 : 12,
                fontWeight: settings.largeText ? "bold" : "normal",
              }}
            >
              Home
            </Text>
          ),
          tabBarButton: (props) => (
            <AccessibleTabButton {...props} accessibilityLabel="Home Tab" />
          ),
        }}
      />

      {/* ✅ Services */}
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: settings.largeText ? 16 : 12,
                fontWeight: settings.largeText ? "bold" : "normal",
              }}
            >
              Services
            </Text>
          ),
          tabBarButton: (props) => (
            <AccessibleTabButton {...props} accessibilityLabel="Services Tab" />
          ),
        }}
      />

      {/* ✅ Activity */}
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: settings.largeText ? 16 : 12,
                fontWeight: settings.largeText ? "bold" : "normal",
              }}
            >
              Activity
            </Text>
          ),
          tabBarButton: (props) => (
            <AccessibleTabButton {...props} accessibilityLabel="Activity Tab" />
          ),
        }}
      />

      {/* ✅ Account (Stack + Hide TabBar on sub-screens) */}
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={({ route }) => {
          // Get current nested route
          const routeName = getFocusedRouteNameFromRoute(route) ?? "AccountMain";
          console.log("🔍 Current Account route:", routeName);

          return {
            // 👇 Hide bottom tab bar if not on AccountMain
            tabBarStyle: [
              {
                display: routeName === "AccountMain" ? "flex" : "none",
              },
            ],

            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <Text
                style={{
                  color,
                  fontSize: settings.largeText ? 16 : 12,
                  fontWeight: settings.largeText ? "bold" : "normal",
                }}
              >
                Account
              </Text>
            ),
            tabBarButton: (props) => (
              <AccessibleTabButton {...props} accessibilityLabel="Account Tab" />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
});
