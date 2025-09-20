import React, { useState, useCallback, useEffect, useContext } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Vibration,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";

// Socket server URL
const SOCKET_URL = "https://sl-backend-td4y.onrender.com"; // replace with your backend socket URL

const ActivityItem = ({ item, theme, settings }) => {
  const getStatusColor = (status) => {
    if (settings.highContrast) {
      switch (status) {
        case "completed": return "#00ff00";
        case "inTransit": return "#ffff00";
        case "upcoming": return "#00ffff";
        case "cancelled": return "#ff0000";
        default: return "#ffffff";
      }
    }
    switch (status) {
      case "completed": return "#4cd964";
      case "inTransit": return "#ffcc00";
      case "upcoming": return "#007aff";
      case "cancelled": return "#ef4444";
      default: return theme.text;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: settings.highContrast ? "#000" : theme.tabBarBackground }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, status ${item.status}`}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor || "#007aff" }]}>
          <Icon name={item.iconName || "time-outline"} size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.statusLabel, { color: getStatusColor(item.status), fontSize: settings.largeText ? 18 : 12 }]}>
            {item.status}
          </Text>
          <Text style={[styles.title, { color: settings.highContrast ? "#fff" : theme.text, fontSize: settings.largeText ? 20 : 16 }]}>
            {item.title}
          </Text>
          <Text style={[styles.location, { color: settings.highContrast ? "#ffff00" : theme.tabBarInactive, fontSize: settings.largeText ? 18 : 14 }]}>
            {item.location}
          </Text>
          <Text style={[styles.date, { color: settings.highContrast ? "#00ffff" : theme.tabBarInactive, fontSize: settings.largeText ? 16 : 12 }]}>
            {item.date}
          </Text>
          {item.details && (
            <Text style={[styles.details, { color: settings.highContrast ? "#fff" : theme.text, fontSize: settings.largeText ? 18 : 14 }]}>
              {item.details}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        {item.actions?.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton} onPress={() => { if (settings.vibration) Vibration.vibrate(40); }}>
            <Text style={[styles.actionButtonText, { color: settings.highContrast ? "#00ff00" : theme.tabBarActive, fontSize: settings.largeText ? 18 : 14 }]}>
              {action}
            </Text>
          </TouchableOpacity>
        ))}
        <Icon name="chevron-forward-outline" size={24} color={settings.highContrast ? "#fff" : theme.tabBarInactive} />
      </View>
    </TouchableOpacity>
  );
};

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { settings } = useAccessibility();
  const { user } = useContext(AuthContext);

  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filterHeight = useSharedValue(0);

  const animatedFilterStyle = useAnimatedStyle(() => ({
    height: filterHeight.value,
    opacity: filterHeight.value > 0 ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 150 }),
  }));

  useEffect(() => {
    if (showFilters) filterHeight.value = withTiming(100, { duration: 300, easing: Easing.inOut(Easing.ease) });
    else filterHeight.value = withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) });
  }, [showFilters]);

  // Fetch activity from backend
  const fetchActivity = async () => {
    try {
      if (!user?._id) return;
      const response = await fetch(`${SOCKET_URL}/api/activity?userId=${user._id}`);
      const result = await response.json();
      const mapped = result.map((item) => ({
        id: item._id,
        title: item.title,
        status: item.status,
        location: item.location || item.address || "",
        date: new Date(item.createdAt).toLocaleString(),
        details: item.details,
        iconName: item.type === "ride" ? "car-outline" : item.type === "shuttle" ? "bus-outline" : "cube-outline",
        iconBgColor: item.type === "ride" ? "#007aff" : item.type === "shuttle" ? "#ff9500" : "#34c759",
        actions: item.actions || [],
        type: item.type,
      }));
      setData(mapped);
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  };

  useEffect(() => {
    fetchActivity();

    // --- Socket.IO connection ---
    const socket = io(SOCKET_URL, { transports: ["websocket"], query: { userId: user?._id } });

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("activityUpdated", (updatedItem) => {
      setData((prev) => {
        const exists = prev.find((i) => i.id === updatedItem._id);
        const mappedItem = {
          id: updatedItem._id,
          title: updatedItem.title,
          status: updatedItem.status,
          location: updatedItem.location || updatedItem.address || "",
          date: new Date(updatedItem.createdAt).toLocaleString(),
          details: updatedItem.details,
          iconName: updatedItem.type === "ride" ? "car-outline" : updatedItem.type === "shuttle" ? "bus-outline" : "cube-outline",
          iconBgColor: updatedItem.type === "ride" ? "#007aff" : updatedItem.type === "shuttle" ? "#ff9500" : "#34c759",
          actions: updatedItem.actions || [],
          type: updatedItem.type,
        };
        if (exists) {
          return prev.map((i) => (i.id === updatedItem._id ? mappedItem : i));
        } else {
          return [mappedItem, ...prev]; // add new activity
        }
      });
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => socket.disconnect();
  }, [user]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await fetchActivity(); setRefreshing(false); }, [user]);
  const toggleFilter = () => { if (settings.vibration) Vibration.vibrate(40); setShowFilters(!showFilters); };
  const handleFilterPress = (filter) => { if (settings.vibration) Vibration.vibrate(40); setActiveFilter(filter); toggleFilter(); };

  const filteredData = data.filter((item) => activeFilter === "All" ? true : item.type === activeFilter.toLowerCase());

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: settings.highContrast ? "#000" : theme.background }]}>
      <View style={[styles.header, { backgroundColor: settings.highContrast ? "#000" : theme.background }]}>
        <Text style={[styles.headerText, { color: settings.highContrast ? "#fff" : theme.text, fontSize: settings.largeText ? 26 : 22 }]}>Your Activity</Text>
        <TouchableOpacity onPress={toggleFilter} style={styles.filterToggle} accessibilityLabel="Filter options">
          <Icon name="options-outline" size={28} color={settings.highContrast ? "#fff" : theme.text} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.filterSection, animatedFilterStyle]}>
        <Text style={[styles.filterByText, { color: settings.highContrast ? "#fff" : theme.tabBarInactive, fontSize: settings.largeText ? 16 : 12 }]}>FILTER BY</Text>
        <View style={styles.filterContainer}>
          {["All", "Rides", "Courier", "Shuttles"].map((filter) => (
            <TouchableOpacity key={filter} style={[styles.filterButton, activeFilter === filter && { backgroundColor: settings.highContrast ? "#fff" : theme.tabBarActive }]} onPress={() => handleFilterPress(filter)} accessibilityRole="button" accessibilityLabel={`Filter by ${filter}`}>
              <Text style={[styles.filterButtonText, { color: activeFilter === filter ? (settings.highContrast ? "#000" : theme.background) : settings.highContrast ? "#fff" : theme.text, fontSize: settings.largeText ? 16 : 12 }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem item={item} theme={theme} settings={settings} />}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={settings.highContrast ? "#fff" : theme.text} colors={[settings.highContrast ? "#fff" : theme.text]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: settings.highContrast ? "#fff" : theme.text, fontSize: settings.largeText ? 18 : 16 }]}>
            No {activeFilter.toLowerCase()} history found.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontWeight: "bold" },
  filterToggle: { padding: 8 },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
    overflow: "hidden",
  },
  filterByText: { fontWeight: "bold", marginBottom: 8 },
  filterContainer: { flexDirection: "row", justifyContent: "space-between" },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  filterButtonText: { fontWeight: "bold" },
  listContainer: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  statusLabel: { fontWeight: "bold" },
  title: { fontWeight: "bold" },
  location: { marginTop: 2 },
  date: { marginTop: 2 },
  details: { marginTop: 4 },
  cardActions: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  actionButton: { paddingHorizontal: 8, paddingVertical: 4 },
  actionButtonText: { marginRight: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {},
});
