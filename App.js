import 'react-native-reanimated';
import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, Vibration, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import all screens
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import CourierScreen from './src/screens/CourierScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DriverScreen from './src/screens/DriverScreen';
import DriverLoginScreen from './src/screens/DriverLoginScreen';

// Import navigation stacks
import AccountStack from './src/navigation/AccountStack';
import DriverStack from './src/navigation/DriverStack'; // Import the driver stack

// Import the DrawerContent component
import DrawerContent from './src/components/DrawerContent';

// Import contexts
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AccessibilityProvider, useAccessibility } from './src/context/AccessibilityContext';
import { CommunicationProvider } from './src/context/CommunicationContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Bottom tab navigator for regular users
function Tabs() {
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          height: 70,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: settings.largeText ? 16 : 12,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            onPress={(e) => {
              if (settings.vibration) {
                Vibration.vibrate(10);
              }
              props.onPress?.(e);
            }}
            accessibilityRole="button"
            accessibilityLabel={props.accessibilityLabel}
          />
        ),
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Services') iconName = 'grid';
          if (route.name === 'Activity') iconName = 'time';
          if (route.name === 'Account') iconName = 'person';
          return (
            <Ionicons
              name={iconName}
              size={settings.largeText ? 28 : 24}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

// Main drawer navigator for regular users
function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
      drawerContent={({ state, ...props }) => {
        const currentRoute = state.routeNames[state.index];
        if (currentRoute === 'Map') {
          return <DrawerContent {...props} />;
        }
        return null;
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={Tabs}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{ swipeEnabled: true }}
      />
      <Drawer.Screen
        name="Courier"
        component={CourierScreen}
        options={{ swipeEnabled: false }}
      />
    </Drawer.Navigator>
  );
}

// Root navigator to handle authentication flow and user roles
function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme.mode === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? (
        user.role === 'driver' ? <DriverStack /> : <MainDrawerNavigator />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: !settings.reduceMotion,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

// The main App component, handling contexts
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AccessibilityProvider>
        <ThemeProvider>
          <CommunicationProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </CommunicationProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
