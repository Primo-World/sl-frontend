import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";

// Screens
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import WalletScreen from "../screens/WalletScreen";
import ReferScreen from "../screens/ReferScreen";
import EarnScreen from "../screens/EarnScreen";
import HelpScreen from "../screens/HelpScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsStack from "./SettingsStack";

// ✅ Reusable helper
import withTabHidden from "./withTabHidden";

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  const { colors, dark } = useTheme();

  // ✅ Define sub-screens in a list
  const subScreens = [
    { name: "Messages", component: MessagesScreen, title: "Messages" },
    { name: "Wallet", component: WalletScreen, title: "Wallet" },
    { name: "Refer", component: ReferScreen, title: "Refer & Invite" },
    { name: "Earn", component: EarnScreen, title: "Earn Rewards" },
    { name: "Help", component: HelpScreen, title: "Help & Support" },
  ];

  return (
    <Stack.Navigator>
      {/* Main Account Screen */}
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ headerShown: false }}
      />

      {/* Settings stack */}
      <Stack.Screen
        name="Settings"
        component={withTabHidden(SettingsStack) || AccountScreen} // fallback
        options={{ headerShown: false }}
      />

      {/* Auto-map sub-screens */}
      {Array.isArray(subScreens) &&
        subScreens.map(({ name, component, title }) =>
          component ? (
            <Stack.Screen
              key={name}
              name={name}
              component={withTabHidden(component) || AccountScreen} // fallback
              options={{ headerShown: true, title }}
            />
          ) : null
        )}

      {/* Chat screen */}
      <Stack.Screen
        name="Chat"
        component={withTabHidden(ChatScreen) || AccountScreen} // fallback
        options={({ route }) => ({
          headerShown: true,
          title: route?.params?.name || "Chat",
          headerStyle: { backgroundColor: dark ? colors.card : "#fff" },
          headerTintColor: dark ? colors.text : "#000",
          headerTitleStyle: { fontWeight: "bold", color: colors.text },
        })}
      />
    </Stack.Navigator>
  );
}
