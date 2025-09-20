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

export default function DriverLoginScreen({ navigation }) {
  const { login, signup } = useContext(AuthContext);
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  // Use a state to toggle between login and signup modes
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    if (!isLoginMode) {
      // Logic for Signup
      if (!name.trim()) {
        Alert.alert("Error", "Name is required for sign up");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordMatchError(true);
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      setPasswordMatchError(false);

      // Call the signup function and explicitly pass 'driver' as the role
      const success = await signup(name, email, password, "driver");

      if (!success) {
        Alert.alert("Signup Failed", "Something went wrong. Please try again.");
      } else {
        Alert.alert("Success", "Driver account created!");
      }
    } else {
      // Logic for Login
      const success = await login(email, password);
      if (!success) {
        Alert.alert("Login Failed", "Invalid email or password");
      }
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
      paddingRight: 50,
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
    link: {
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
      <Text style={dynamicStyles.title}>
        Driver {isLoginMode ? "Login" : "Sign Up"}
      </Text>

      {/* Conditional fields for signup mode */}
      {!isLoginMode && (
        <>
          <View style={dynamicStyles.inputContainer}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Full Name"
              placeholderTextColor={theme.tabBarInactive}
              value={name}
              onChangeText={setName}
            />
          </View>
        </>
      )}

      {/* Common fields for both modes */}
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

      {/* Conditional fields for signup mode */}
      {!isLoginMode && (
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
      )}

      <AccessibleButton
        label={isLoginMode ? "Log In" : "Sign Up"}
        onPress={handleSubmit}
      />

      <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
        <Text style={dynamicStyles.link}>
          {isLoginMode
            ? "Need a driver account? Sign up"
            : "Already have a driver account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
