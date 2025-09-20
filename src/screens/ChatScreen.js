import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

export default function ChatScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef(null);

  const isDarkMode = theme.isDark;

  const handleSend = () => {
    if (input.trim().length > 0) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: input, sender: "me" },
      ]);
      setInput("");
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: "flex-end",
      padding: 16,
    },
    messageBubble: {
      maxWidth: "70%",
      padding: 12,
      borderRadius: 16,
      marginVertical: 6,
    },
    myMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#3277FE",
    },
    otherMessage: {
      alignSelf: "flex-start",
      backgroundColor: isDarkMode ? "#1C1C1E" : "#E5E5EA",
    },
    myMessageText: {
      color: "#fff",
      fontSize: 16,
    },
    otherMessageText: {
      color: theme.text,
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.tabBarInactive,
      backgroundColor: theme.background,
    },
    input: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 12 : 8,
      backgroundColor: "#E5E5EA",
      color: "#000",
      fontSize: 16,
    },
    sendButton: {
      marginLeft: 8,
      padding: 10,
      backgroundColor: "#3277FE",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // tweak this number if using a tab bar/header
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={
                msg.sender === "me"
                  ? styles.myMessageText
                  : styles.otherMessageText
              }
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
