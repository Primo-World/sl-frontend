import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function AddWorkScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // State variables for the work address form inputs
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [companyName, setCompanyName] = useState("");

  /**
   * Handles the action to save the entered work address.
   * Performs basic validation before showing a success alert.
   */
  const handleSaveWorkAddress = () => {
    // Basic validation to ensure required fields are not empty
    if (!companyName || !addressLine1 || !city || !state || !zipCode) {
      Alert.alert("Incomplete Information", "Please fill out all required fields.");
      return;
    }

    const newWorkAddress = {
      companyName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
    };

    console.log("Saving new work address:", newWorkAddress);
    Alert.alert("Success", "Work address has been saved!");
    // In a real application, you would send this data to an API
    // and then navigate back or to another screen.
    // navigation.goBack();
  };

  /**
   * Handles the action to use the user's current location.
   * This is a placeholder for a real location fetching function.
   */
  const handleUseCurrentLocation = () => {
    Alert.alert("Using Current Location", "A real app would now fetch your GPS coordinates and fill the address fields.");
    console.log("Fetching current location...");
    // A real app would use a library like react-native-geolocation-service
    // to get the device's current location and then use a geocoding API
    // to convert the coordinates to a street address.
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // The background color for the entire screen is dynamically set from the theme
      backgroundColor: theme.background,
    },
    scrollViewContent: {
      padding: 20,
    },
    label: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 5,
      marginTop: 15,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      color: theme.text,
      // The background color for the input field is now dynamically set from the theme
      backgroundColor: theme.cardBackground, 
    },
    // This style is used for both buttons to ensure a consistent look
    buttonOutline: {
      backgroundColor: "transparent",
      borderColor: theme.text, // Use theme.text to ensure visibility in both light and dark mode
      borderWidth: 2,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
    },
    // This style is now used for both button texts
    buttonOutlineText: {
      color: theme.text, // Use theme.text to ensure visibility in both light and dark mode
      fontSize: 18,
      fontWeight: "bold",
    },
    orText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.text,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Company Name Input */}
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter company name"
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={companyName}
          onChangeText={setCompanyName}
        />

        {/* Address Inputs */}
        <Text style={styles.label}>Address Line 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter street address"
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={addressLine1}
          onChangeText={setAddressLine1}
        />
        <Text style={styles.label}>Address Line 2 (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, etc."
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={addressLine2}
          onChangeText={setAddressLine2}
        />
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={city}
          onChangeText={setCity}
        />
        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter state"
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={state}
          onChangeText={setState}
        />
        <Text style={styles.label}>Zip Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter zip code"
          placeholderTextColor={theme.mode === "dark" ? "#A0A0A0" : theme.textSecondary}
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />

        {/* The "Save Address" button is now first */}
        <TouchableOpacity style={styles.buttonOutline} onPress={handleSaveWorkAddress}>
          <Text style={styles.buttonOutlineText}>Save Work Address</Text>
        </TouchableOpacity>
        
        {/* The "Or" text between the buttons */}
        <Text style={styles.orText}>Or</Text>

        {/* The "Use Current Location" button is now second */}
        <TouchableOpacity style={styles.buttonOutline} onPress={handleUseCurrentLocation}>
          <Text style={styles.buttonOutlineText}>Use Current Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
