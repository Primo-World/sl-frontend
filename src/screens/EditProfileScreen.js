import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function EditProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Name cannot be empty",
      });
      return;
    }

    try {
      await updateUser?.({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your changes were saved successfully",
      });

      navigation.goBack();
    } catch (err) {
      console.error("Failed to update user:", err);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not update profile. Please try again.",
      });
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    label: {
      color: theme.text,
      fontSize: 14,
      marginTop: 20,
      marginBottom: 6,
      fontWeight: "600",
    },
    input: {
      backgroundColor: theme.tabBarBackground,
      color: theme.text,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    saveButton: {
      marginTop: 40,
      backgroundColor: theme.tabBarActive,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    saveText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.tabBarInactive}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            placeholderTextColor={theme.tabBarInactive}
            returnKeyType="next"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+233..."
            placeholderTextColor={theme.tabBarInactive}
            autoCorrect={false}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}
