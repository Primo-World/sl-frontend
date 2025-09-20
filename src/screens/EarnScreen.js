import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

/**
 * Renders the Earn screen, which displays a driver's earnings and incentives.
 * It includes an earnings summary, a 'Go Online' button, and a bonus progress tracker.
 */
export default function EarnScreen() {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // State to manage the online status
  const [isOnline, setIsOnline] = useState(false);
  const [bonusProgress] = useState(new Animated.Value(0));

  // Mock data for a driver's earnings and bonuses
  const currentEarnings = 125.50;
  const tripsCompleted = 15;
  const bonusGoal = 20;

  // Calculate bonus progress
  const progressPercentage = (tripsCompleted / bonusGoal) * 100;
  
  // Animate the bonus progress bar
  React.useEffect(() => {
    Animated.timing(bonusProgress, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  /**
   * Toggles the driver's online status.
   */
  const handleGoOnline = () => {
    setIsOnline(!isOnline);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 20,
    },
    goOnlineButton: {
      width: "100%",
      paddingVertical: 18,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    goOnlineButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    onlineIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    onlineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: isOnline ? "#28A745" : "#FF6347",
      marginRight: 8,
    },
    onlineText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    sectionContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    earningsText: {
      fontSize: 36,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    tripsText: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.7,
      marginBottom: 15,
    },
    bonusProgressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    bonusProgressText: {
      fontSize: 14,
      color: theme.text,
      marginRight: 10,
    },
    progressBarBackground: {
      flex: 1,
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
    },
    progressBarFill: {
      height: 8,
      backgroundColor: "#FFD700", // Gold color for bonus
      borderRadius: 4,
    },
    bonusInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    },
    bonusIcon: {
      marginRight: 10,
    },
    bonusDescription: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Go Online/Offline Button */}
        <TouchableOpacity 
          style={[styles.goOnlineButton, { backgroundColor: isOnline ? "#FF6347" : "#28A745" }]}
          onPress={handleGoOnline}
        >
          <Text style={styles.goOnlineButtonText}>{isOnline ? "Go Offline" : "Go Online"}</Text>
        </TouchableOpacity>

        {/* Current Earnings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Earnings</Text>
          <Text style={styles.earningsText}>${currentEarnings.toFixed(2)}</Text>
          <Text style={styles.tripsText}>{tripsCompleted} trips completed</Text>
        </View>

        {/* Bonus Tracker Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Current Bonus</Text>
          <View style={styles.bonusProgressContainer}>
            <Text style={styles.bonusProgressText}>{`${tripsCompleted}/${bonusGoal} Trips`}</Text>
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarFill, { width: bonusProgress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }) }]} />
            </View>
          </View>
          <View style={styles.bonusInfo}>
            <Icon name="trending-up-outline" size={20} color={theme.text} style={styles.bonusIcon} />
            <Text style={styles.bonusDescription}>
              Complete 5 more trips to earn a $50 weekend bonus!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
