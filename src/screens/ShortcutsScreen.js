import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

// A mock data array to simulate user shortcuts
const initialShortcuts = [
  { id: "1", name: "Home", address: "123 Main St, Anytown USA", icon: "home-outline" },
  { id: "2", name: "Work", address: "456 Corporate Blvd, Metropolis", icon: "briefcase-outline" },
];

// A reusable component for a single shortcut item.
const ShortcutItem = ({ item, theme, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => (
  <View style={styles(theme).shortcutItem}>
    <Icon name={item.icon} size={24} color={theme.text} style={styles(theme).itemIcon} />
    <View style={styles(theme).itemTextContainer}>
      <Text style={styles(theme).itemTitle}>{item.name}</Text>
      <Text style={styles(theme).itemAddress}>{item.address}</Text>
    </View>
    <View style={styles(theme).actionButtonsContainer}>
      {/* Fix: Set icon color for move buttons to be visible in dark mode */}
      <TouchableOpacity
        onPress={() => onMoveUp(item.id)}
        style={[styles(theme).moveButton, isFirst && styles(theme).hiddenButton]}
        disabled={isFirst}
      >
        <Icon name="chevron-up-outline" size={22} color={theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onMoveDown(item.id)}
        style={[styles(theme).moveButton, isLast && styles(theme).hiddenButton]}
        disabled={isLast}
      >
        <Icon name="chevron-down-outline" size={22} color={theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary} />
      </TouchableOpacity>
      {/* Fix: Set icon color for edit button to be visible in dark mode */}
      <TouchableOpacity onPress={() => onEdit(item.id)} style={styles(theme).actionButton}>
        <Icon name="create-outline" size={22} color={theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles(theme).actionButton}>
        <Icon name="trash-outline" size={22} color={theme.danger} />
      </TouchableOpacity>
    </View>
  </View>
);

// Centralized stylesheet function to handle dynamic theming.
const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Align items to the right
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Using theme.border for consistency
    borderBottomColor: theme.border,
    backgroundColor: theme.background,
  },
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  listEmptyText: {
    fontSize: 16,
    color: theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary,
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  shortcutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Using theme.border for consistency
    borderBottomColor: theme.border,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "600",
  },
  itemAddress: {
    fontSize: 14,
    color: theme.mode === 'dark' ? '#A0A0A0' : theme.textSecondary,
    marginTop: 2,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 10,
  },
  moveButton: {
    paddingHorizontal: 5,
    marginRight: 5,
  },
  hiddenButton: {
    opacity: 0.2, // Make the button semi-transparent and non-interactive
  },
  saveLocationContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  saveLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    // Using theme.cardBackground for proper contrast
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
  },
  saveLocationText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text,
    fontWeight: "600",
  },
});

export default function ShortcutsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [shortcuts, setShortcuts] = useState(initialShortcuts);

  // Function to handle editing a shortcut
  const handleEditShortcut = (id) => {
    console.log(`Editing shortcut with ID: ${id}`);
    // In a real app, you would navigate to an edit screen with this shortcut's data
  };

  // Function to handle deleting a shortcut
  const handleDeleteShortcut = (id) => {
    setShortcuts(shortcuts.filter(s => s.id !== id));
    console.log(`Deleted shortcut with ID: ${id}`);
  };

  // Function to add a new shortcut
  const handleAddShortcut = () => {
    console.log("Navigating to Add New Shortcut screen");
    // In a real app, you would navigate to a screen for adding a new location
  };

  // Function to simulate saving the current location
  const handleSaveCurrentLocation = () => {
    const newShortcut = {
      id: String(Date.now()),
      name: "Current Location",
      address: "123 Anywhere Street", // Mock address
      icon: "pin-outline",
    };
    setShortcuts([...shortcuts, newShortcut]);
    console.log("Saved current location.");
  };

  // Function to move a shortcut up in the list
  const handleMoveUp = (id) => {
    const index = shortcuts.findIndex(s => s.id === id);
    if (index > 0) {
      const newShortcuts = [...shortcuts];
      const [itemToMove] = newShortcuts.splice(index, 1);
      newShortcuts.splice(index - 1, 0, itemToMove);
      setShortcuts(newShortcuts);
    }
  };

  // Function to move a shortcut down in the list
  const handleMoveDown = (id) => {
    const index = shortcuts.findIndex(s => s.id === id);
    if (index < shortcuts.length - 1) {
      const newShortcuts = [...shortcuts];
      const [itemToMove] = newShortcuts.splice(index, 1);
      newShortcuts.splice(index + 1, 0, itemToMove);
      setShortcuts(newShortcuts);
    }
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={handleAddShortcut} style={styles(theme).addButton}>
          {/* Fix: Set icon color to be visible in dark mode */}
          <Icon name="add-circle-outline" size={30} color={theme.mode === 'dark' ? '#007AFF' : theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles(theme).content}>
        <Text style={styles(theme).listHeader}>My Shortcuts</Text>
        <FlatList
          data={shortcuts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ShortcutItem
              item={item}
              theme={theme}
              onEdit={handleEditShortcut}
              onDelete={handleDeleteShortcut}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isFirst={index === 0}
              isLast={index === shortcuts.length - 1}
            />
          )}
          ListEmptyComponent={
            <Text style={styles(theme).listEmptyText}>
              You don't have any shortcuts yet.
            </Text>
          }
        />
        <View style={styles(theme).saveLocationContainer}>
          <TouchableOpacity onPress={handleSaveCurrentLocation} style={styles(theme).saveLocationButton}>
            <Icon name="compass-outline" size={24} color={theme.text} />
            <Text style={styles(theme).saveLocationText}>Save Current Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
