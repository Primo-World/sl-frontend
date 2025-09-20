import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 Use your machine’s LAN IP
  const API_URL = "/api/locations/search?q=Accra/api";

  // Restore user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ✅ Signup with backend
  // UPDATED: Now accepts a 'role' parameter for driver registration
  const signup = async (name, email, password, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass the 'role' to the backend
        body: JSON.stringify({
          name,
          email,
          password,
          role // This line is new!
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Signup Failed", data.message || "Something went wrong");
        return false;
      }

      // The backend must send back a user object with a 'role' field here
      const userData = { ...data.user, token: data.token };
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      Alert.alert("Success", "Account created!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Could not connect to server");
      return false;
    }
  };

  // ✅ Login with backend
  // Assumes the backend returns a user object with a 'role' field
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return false;
      }

      // The backend must send back a user object with a 'role' field here
      const userData = { ...data.user, token: data.token };
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Could not connect to server");
      return false;
    }
  };

  // ✅ A simulated function to test the driver screen
  // In a real app, this logic would be part of your main login function
  const loginDriver = async () => {
    try {
      const driverData = {
        name: "Test Driver",
        email: "driver@example.com",
        role: "driver", // This is the key field
        token: "fake-driver-token-123",
        // Add other driver-specific data here
      };
      
      setUser(driverData);
      await AsyncStorage.setItem("user", JSON.stringify(driverData));
      Alert.alert("Test Login", "Logged in as a driver!");
      return true;
    } catch (error) {
      console.error("Simulated login error:", error);
      Alert.alert("Error", "Could not perform simulated login");
      return false;
    }
  };

  // ✅ Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  // Simulated resetPassword
  const resetPassword = async (email) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
          console.log(`Password reset email simulated for: ${email}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Password reset simulation error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, loading, resetPassword, loginDriver }}
    >
      {children}
    </AuthContext.Provider>
  );
}
