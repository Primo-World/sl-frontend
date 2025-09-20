import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const mockMessages = [
  {
    id: "1",
    sender: "Support",
    preview: "Your package is on the way 🚚",
    time: "2h ago",
    type: "notification"
  },
  {
    id: "2",
    sender: "Driver Mike",
    preview: "I’ve arrived at the pickup location.",
    time: "5h ago",
    type: "chat"
  },
  {
    id: "3",
    sender: "Promo",
    preview: "Get 20% off your next delivery!",
    time: "Yesterday",
    type: "notification"
  },
];

export default function MessagesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    messageCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.tabBarBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    icon: { marginRight: 12 },
    textContainer: { flex: 1 },
    sender: { fontSize: 16, fontWeight: "bold", color: theme.text },
    preview: { fontSize: 14, color: theme.tabBarInactive, marginTop: 2 },
    time: { fontSize: 12, color: theme.tabBarInactive },
    fab: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: theme.tabBarActive,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
  });

  const handleMessagePress = (item) => {
    if (item.type === "chat") {
      navigation.navigate("Chat", { chatData: item });
    } else {
      // Logic for handling notifications can go here.
      // For now, we will use a console log instead of an alert.
      console.log(`Notification from ${item.sender}: ${item.preview}`);
    }
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      style={dynamicStyles.messageCard}
      onPress={() => handleMessagePress(item)}
    >
      <Icon
        name="chatbubble-ellipses-outline"
        size={28}
        color={theme.text}
        style={dynamicStyles.icon}
      />
      <View style={dynamicStyles.textContainer}>
        <Text style={dynamicStyles.sender}>{item.sender}</Text>
        <Text style={dynamicStyles.preview}>{item.preview}</Text>
      </View>
      <Text style={dynamicStyles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <View style={dynamicStyles.container}>
        <FlatList
          data={mockMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
        />
        {/* Floating Action Button */}
        <TouchableOpacity style={dynamicStyles.fab}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
