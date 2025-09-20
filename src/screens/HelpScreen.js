import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

// Mock data for the FAQ section to demonstrate a dynamic list.
// In a real application, this data might be fetched from an API.
const faqData = [
  {
    id: "1",
    question: "How do I change my profile picture?",
    answer: "Go to 'Settings' and tap on your current profile image to select a new one.",
    icon: "person-circle-outline",
  },
  {
    id: "2",
    question: "Why can't I send a message?",
    answer: "Please check your internet connection. If the issue persists, try restarting the app or logging out and back in.",
    icon: "chatbox-outline",
  },
  {
    id: "3",
    question: "How do I report a user?",
    answer: "Navigate to the user's profile and tap the three-dot menu, then select 'Report User'.",
    icon: "flag-outline",
  },
  {
    id: "4",
    question: "How do I update my app?",
    answer: "Check the App Store or Google Play Store for the latest version and update the app from there.",
    icon: "arrow-up-circle-outline",
  },
];

// Define styles as a function that takes the theme object,
// ensuring styles are created with the correct theme colors.
const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  cardContainer: {
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
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  faqIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    textDecorationLine: "none",
  },
  faqAnswer: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Use a theme-defined primary color for the button background.
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  contactButtonText: {
    // Use theme text color on the primary background for contrast.
    color: theme.textOnPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default function HelpScreen() {
  const { theme } = useTheme();
  // Call the styles function to get a themed stylesheet.
  const themedStyles = styles(theme);

  // A reusable component to render each FAQ item.
  const renderFAQItem = ({ item }) => (
    <View style={themedStyles.faqItem}>
      <Icon name={item.icon} size={24} color={theme.text} style={themedStyles.faqIcon} />
      <View style={{ flex: 1 }}>
        <Text style={themedStyles.faqQuestion}>{item.question}</Text>
        <Text style={themedStyles.faqAnswer}>{item.answer}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <FlatList
        data={[{ type: 'intro' }, { type: 'faq', data: faqData }, { type: 'contact' }]}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          if (item.type === 'intro') {
            return (
              <View style={themedStyles.cardContainer}>
                <Text style={themedStyles.sectionTitle}>Welcome</Text>
                <Text style={themedStyles.sectionText}>
                  We're here to help you get the most out of our app. Find answers
                  to common questions below or contact our support team.
                </Text>
              </View>
            );
          } else if (item.type === 'faq') {
            return (
              <View style={themedStyles.cardContainer}>
                <Text style={themedStyles.sectionTitle}>Frequently Asked Questions</Text>
                <FlatList
                  data={item.data}
                  keyExtractor={(faqItem) => faqItem.id}
                  renderItem={renderFAQItem}
                  scrollEnabled={false} // Disable scrolling within this card
                />
              </View>
            );
          } else if (item.type === 'contact') {
            return (
              <View style={themedStyles.cardContainer}>
                <Text style={themedStyles.sectionTitle}>Need More Help?</Text>
                <Text style={themedStyles.sectionText}>
                  If you can't find the answer you're looking for, our team is
                  ready to assist you.
                </Text>
                <TouchableOpacity
                  style={themedStyles.contactButton}
                  onPress={() => {
                    // In a real app, this would open a support chat, email, or web form.
                    // Example using Linking to open an email client:
                    // Linking.openURL('mailto:support@ourapp.com?subject=Support Request');
                    console.log("Contact support button pressed!");
                  }}
                >
                  {/* Use theme-defined color for the icon. */}
                  <Icon name="mail-outline" size={24} color={theme.textOnPrimary} />
                  <Text style={themedStyles.contactButtonText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
      />
    </SafeAreaView>
  );
}
