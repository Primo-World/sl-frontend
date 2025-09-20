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

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    const success = await login(email, password);

    if (success) {
      Alert.alert("Success", "Logged in successfully!");
      // You can navigate to your home screen if you have one
      // navigation.replace("Home"); 
    } else {
      // ❗ AuthContext already alerts detailed error (from backend),
      // so here we only fall back with a generic one.
      Alert.alert("Login Failed", "Invalid email or password");
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
    forgotPasswordLink: {
      color: theme.tabBarActive,
      fontWeight: "bold",
      fontSize: 14,
      textAlign: "right",
      marginBottom: 20,
    },
    signupLink: {
      marginTop: 20,
      textAlign: "center",
      color: theme.tabBarActive,
      fontSize: 16,
    },
    driverLink: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: theme.primary,
      fontWeight: 'bold'
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Welcome Back</Text>

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

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={dynamicStyles.forgotPasswordLink}>Forgot Password?</Text>
      </TouchableOpacity>

      <AccessibleButton label="Login" onPress={handleLogin} />

      <Text
        style={dynamicStyles.signupLink}
        onPress={() => navigation.navigate("Signup")}
      >
        Don&apos;t have an account?{" "}
        <Text style={{ fontWeight: "bold" }}>Sign up</Text>
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("DriverLogin")}>
        <Text style={dynamicStyles.driverLink}>
          Are you a driver? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
