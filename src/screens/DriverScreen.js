import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CommunicationContext } from '../context/CommunicationContext';

export default function DriverScreen() {
  const { colors } = useTheme();
  const { settings } = useAccessibility();
  const { user, logout } = useContext(AuthContext);
  const { sendShuttleLocation } = useContext(CommunicationContext);
  const [isSharing, setIsSharing] = useState(false);

  // 1. Start location sharing when the screen loads
  useEffect(() => {
    let locationSubscription = null;
    const startLocationSharing = async () => {
      // Check for location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed to share your location.');
        return;
      }

      // Check if user is a driver and has a shuttle ID
      if (user?.role === 'driver' && user?.shuttleId) {
        setIsSharing(true);
        // Start watching location changes
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update location every 5 seconds
            distanceInterval: 10, // Or update every 10 meters
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            // Send location to the backend
            sendShuttleLocation(user.shuttleId, { latitude, longitude });
          }
        );
      }
    };

    startLocationSharing();

    // 2. Clean up when the component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        setIsSharing(false);
      }
    };
  }, [user, sendShuttleLocation]); // Added sendShuttleLocation to dependency array

  const handleLogout = () => {
    if (settings.vibration) {
      Vibration.vibrate(10);
    }
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Hello, {user?.name}
        </Text>
        <Text style={[styles.roleText, { color: colors.text }]}>
          You are logged in as a {user?.role}.
        </Text>
        {isSharing ? (
          <View style={styles.sharingStatus}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.sharingText, { color: colors.primary }]}>Sharing live location...</Text>
          </View>
        ) : (
          <Text style={[styles.sharingText, { color: colors.error }]}>Location sharing not active.</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <Ionicons 
          name="log-out-outline" 
          size={settings.largeText ? 24 : 20} 
          color={colors.buttonText} 
          style={styles.buttonIcon} 
        />
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  sharingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sharingText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
