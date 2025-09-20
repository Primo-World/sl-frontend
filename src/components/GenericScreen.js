import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function GenericScreen({ title, children }) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, padding: 20 },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
