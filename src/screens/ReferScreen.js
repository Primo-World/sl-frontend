import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

/**
 * Renders the Refer a Friend screen.
 * This screen encourages users to share a referral link to earn rewards.
 */
export default function ReferScreen() {
  const { theme } = useTheme();

  // Mock referral code - in a real app, this would be fetched from an API
  const referralCode = "YOUR_APP_SL";

  /**
   * Handles the sharing action. In a real app, this would use the
   * React Native Sharing API to share the referral link.
   */
  const handleShare = () => {
    // This is a placeholder for a real sharing functionality
    console.log(`Sharing referral code: ${referralCode}`);
    // Replaced alert() with a console log for compatibility.
    console.log(`Your referral code has been copied!`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    // The icon at the top of the screen
    referIcon: {
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 24,
    },
    referralCodeContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 30,
      width: "100%",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    referralCodeText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
    },
    copyIcon: {
      padding: 5,
    },
    shareButton: {
      backgroundColor: "#007BFF",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    shareButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      
      <View style={styles.contentContainer}>
        <Icon name="gift-outline" size={80} color={theme.primary} style={styles.referIcon} />
        <Text style={styles.title}>Earn Rewards</Text>
        <Text style={styles.description}>
          Invite friends to join and you'll both get a reward when they make their first transaction.
        </Text>

        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCodeText}>{referralCode}</Text>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="copy-outline" size={24} color={theme.text} style={styles.copyIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share-social-outline" size={24} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share Your Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
