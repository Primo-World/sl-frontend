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
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen({ navigation }) {
  const { signup } = useContext(AuthContext);
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setPasswordMatchError(false);

    // Call the signup function and explicitly pass a generic role
    const success = await signup(name, email, password, "user");

    if (success) {
      Alert.alert("Success", "Account created successfully!");
      // You can navigate to your home screen if you have one
      // navigation.replace("Home");
    } else {
      Alert.alert("Signup Failed", "Something went wrong. Please try again.");
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
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.text,
      textAlign: "center",
    },
    inputContainer: {
      position: "relative",
      marginBottom: 15,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.tabBarInactive,
      padding: 15,
      paddingRight: 50, // space for eye icon
      borderRadius: 10,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },
    passwordToggle: {
      position: "absolute",
      right: 15,
      top: "50%",
      transform: [{ translateY: -12 }],
    },
    loginLink: {
      marginTop: 20,
      textAlign: "center",
      color: theme.tabBarActive,
      fontSize: 16,
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 5,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Create Account</Text>

      {/* Name Input */}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Full Name"
          placeholderTextColor={theme.tabBarInactive}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Email"
          placeholderTextColor={theme.tabBarInactive}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Password Input with Toggle */}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Password"
          placeholderTextColor={theme.tabBarInactive}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={dynamicStyles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.tabBarInactive}
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input with Toggle */}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholder="Confirm Password"
          placeholderTextColor={theme.tabBarInactive}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={dynamicStyles.passwordToggle}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          accessibilityLabel={
            showConfirmPassword ? "Hide password" : "Show password"
          }
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.tabBarInactive}
          />
        </TouchableOpacity>
        {passwordMatchError && (
          <Text style={dynamicStyles.errorText}>Passwords do not match</Text>
        )}
      </View>

      <AccessibleButton label="Sign Up" onPress={handleSignup} />

      <Text
        style={dynamicStyles.loginLink}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account?{" "}
        <Text style={{ fontWeight: "bold" }}>Log in</Text>
      </Text>
    </View>
  );
}
