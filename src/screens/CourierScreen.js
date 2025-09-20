// src/screens/CourierScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Data for the package types in the Send mode
const packageTypes = [
  { id: 1, name: "Small Bag", icon: "shopping-outline", description: "Up to 5kg" },
  { id: 2, name: "Medium Box", icon: "archive-outline", description: "5kg - 15kg" },
  { id: 4, name: "Other", icon: "help-circle-outline", description: "Specify below" },
  { id: 6, name: "Fragile Items", icon: "glass-fragile", description: "Handle with care, up to 10kg" },
];

// Data for the receive options in the Receive mode
const receiveOptions = [
  { id: 1, name: "Track a package", icon: "map-search-outline", description: "Using a tracking ID" },
  { id: 2, name: "Request a pickup", icon: "package-variant-closed", description: "Ask someone to send you a package" },
];

const OptionCard = ({ item, isSelected, onPress, theme }) => (
  <TouchableOpacity
    style={[
      styles.optionCard,
      { backgroundColor: isSelected ? theme.tabBarActive : theme.tabBarBackground },
    ]}
    onPress={() => onPress(item)}
  >
    <MaterialCommunityIcons
      name={item.icon}
      size={30}
      color={isSelected ? theme.background : theme.text}
    />
    <Text style={[styles.optionCardTitle, { color: isSelected ? theme.background : theme.text }]}>
      {item.name}
    </Text>
    <Text style={[styles.optionCardDescription, { color: isSelected ? theme.background : theme.tabBarInactive }]}>
      {item.description}
    </Text>
  </TouchableOpacity>
);

export default function CourierScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [mode, setMode] = useState("send");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedReceiveOption, setSelectedReceiveOption] = useState(null);
  const [itemDescription, setItemDescription] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const showToast = (message) =>
    Platform.OS === "android" ? ToastAndroid.show(message, ToastAndroid.SHORT) : Alert.alert(message);

  const handleSendNext = () => {
    if (!selectedPackage) {
      Alert.alert("Validation", "Please select a package type.");
      return;
    }
    if (selectedPackage.id === 4 && !itemDescription.trim()) {
      Alert.alert("Validation", "Please enter item description.");
      return;
    }
    showToast("Preparing your courier request...");
    setTimeout(() => {
      // CHANGED: actionType -> mode
      navigation.navigate("Map", { mode: "send" });
    }, 800);
  };

  const handleReceiveNext = () => {
    if (!selectedReceiveOption) {
      Alert.alert("Validation", "Please select an option.");
      return;
    }
    if (selectedReceiveOption.id === 1 && !trackingId.trim()) {
      Alert.alert("Validation", "Please enter a tracking ID.");
      return;
    }
    showToast("Preparing your courier request...");
    setTimeout(() => {
      // CHANGED: send proper mode values MapScreen expects
      if (selectedReceiveOption.id === 1) {
        navigation.navigate("Map", { mode: "track" });
      } else {
        navigation.navigate("Map", { mode: "receive" });
      }
    }, 800);
  };

  const renderSendUI = () => (
    <>
      <Text style={[styles.mainTitle, { color: theme.text }]}>What are you sending?</Text>
      <Text style={[styles.sectionHeader, { color: theme.text }]}>Package type</Text>
      <View style={styles.optionGrid}>
        {packageTypes.map((item) => (
          <OptionCard
            key={item.id}
            item={item}
            isSelected={selectedPackage?.id === item.id}
            onPress={setSelectedPackage}
            theme={theme}
          />
        ))}
      </View>
      <Text style={[styles.sectionHeader, { color: theme.text }]}>Item description</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.tabBarBackground,
            color: theme.text,
            borderColor: theme.tabBarInactive,
          },
        ]}
        placeholder="e.g., A textbook and a pair of earphones"
        placeholderTextColor={theme.tabBarInactive}
        value={itemDescription}
        onChangeText={setItemDescription}
        multiline
      />
      <Text style={[styles.noteText, { color: theme.tabBarInactive }]}>
        Note: Fragile items may require special handling during delivery.
      </Text>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: theme.tabBarActive }]}
        onPress={handleSendNext}
      >
        <Text style={[styles.nextButtonText, { color: theme.background }]}>Next</Text>
      </TouchableOpacity>
    </>
  );

  const renderReceiveUI = () => (
    <>
      <Text style={[styles.mainTitle, { color: theme.text }]}>How would you like to receive?</Text>
      <Text style={[styles.sectionHeader, { color: theme.text }]}>Select an option</Text>
      <View style={styles.optionGrid}>
        {receiveOptions.map((item) => (
          <OptionCard
            key={item.id}
            item={item}
            isSelected={selectedReceiveOption?.id === item.id}
            onPress={setSelectedReceiveOption}
            theme={theme}
          />
        ))}
      </View>

      {selectedReceiveOption?.id === 1 && (
        <>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>Tracking ID</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.tabBarBackground,
                color: theme.text,
                borderColor: theme.tabBarInactive,
              },
            ]}
            placeholder="Enter tracking ID"
            placeholderTextColor={theme.tabBarInactive}
            value={trackingId}
            onChangeText={setTrackingId}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: theme.tabBarActive }]}
        onPress={handleReceiveNext}
      >
        <Text style={[styles.nextButtonText, { color: theme.background }]}>
          {selectedReceiveOption?.id === 1 ? "Track" : "Request"}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Courier</Text>
      </View>

      {/* Mode toggle with visual separation */}
      <View
        style={[
          styles.modeToggleWrapper,
          { backgroundColor: theme.tabBarBackground, borderColor: theme.tabBarInactive },
        ]}
      >
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              { backgroundColor: mode === "send" ? theme.tabBarActive : theme.tabBarBackground },
            ]}
            onPress={() => setMode("send")}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: mode === "send" ? theme.background : theme.text },
              ]}
            >
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              { backgroundColor: mode === "receive" ? theme.tabBarActive : theme.tabBarBackground },
            ]}
            onPress={() => setMode("receive")}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: mode === "receive" ? theme.background : theme.text },
              ]}
            >
              Receive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {mode === "send" ? renderSendUI() : renderReceiveUI()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  modeToggleWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  modeToggleContainer: { flexDirection: "row" },
  modeButton: { flex: 1, paddingVertical: 15, alignItems: "center" },
  modeButtonText: { fontSize: 16, fontWeight: "bold" },
  container: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 },
  mainTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 10, textTransform: "uppercase" },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  optionCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionCardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  optionCardDescription: { fontSize: 12, textAlign: "center" },
  input: { borderRadius: 12, borderWidth: 1, padding: 16, fontSize: 16, minHeight: 50, textAlignVertical: "top" },
  noteText: { fontSize: 14, marginTop: 20 },
  nextButton: { borderRadius: 12, padding: 18, alignItems: "center", marginHorizontal: 16, marginBottom: 20, marginTop: "auto" },
  nextButtonText: { fontSize: 18, fontWeight: "bold" },
});
