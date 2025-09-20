import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your driver-specific screens
import DriverScreen from "../screens/DriverScreen";
import DriverLoginScreen from "../screens/DriverLoginScreen";

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DriverMain"
        component={DriverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DriverLogin"
        component={DriverLoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
