import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AccessibleButton from "../components/AccessibleButton";

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useContext(AuthContext);
  const { theme } = useTheme();

  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    const success = await resetPassword(email);

    if (success) {
      Alert.alert(
        "Password Reset",
        "A password reset link has been sent to your email."
      );
    } else {
      Alert.alert(
        "Password Reset Failed",
        "Could not find an account with that email."
      );
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.text,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.tabBarInactive,
      padding: 15,
      borderRadius: 10,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },
    backLink: {
      marginTop: 20,
      textAlign: "center",
      color: theme.tabBarActive,
      fontSize: 16,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Forgot Your Password?</Text>
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Enter your email"
          placeholderTextColor={theme.tabBarInactive}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <AccessibleButton label="Reset Password" onPress={handleReset} />
      <Text
        style={dynamicStyles.backLink}
        onPress={() => navigation.navigate("Login")}
      >
        Go back to Login
      </Text>
    </View>
  );
}
