import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Image,
  Vibration,
  Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { io } from "socket.io-client";
import * as Location from "expo-location";
import { useAccessibility } from "../context/AccessibilityContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/useAuth";
import { CommunicationContext } from "../context/CommunicationContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';

// Environment variables (requires react-native-dotenv or similar Babel plugin)
import { API_BASE_URL, SOCKET_URL, GOOGLE_MAPS_API_KEY } from "@env";

const { height } = Dimensions.get("window");

const rideOption1Image = require("../../assets/images/ride_option_1.png");
const rideOption2Image = require("../../assets/images/ride_option_2.png");
const rideOption3Image = require("../../assets/images/ride_option_3.png");
const rideOption4Image = require("../../assets/images/ride_option_4.png");
const driverCarMarkerImage = require("../../assets/images/driver_car_marker.png");

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const SAVED_LOCATIONS = [
  { id: "1", name: "Work", address: "1455 Market Street", icon: "briefcase-outline", coords: { latitude: 37.777095, longitude: -122.418466 } },
  { id: "2", name: "Home", address: "1600 Michigan Street, San Francisco", icon: "home-outline", coords: { latitude: 37.765476, longitude: -122.392686 } },
  { id: "3", name: "Gym", address: "789 Fitness Ave", icon: "barbell-outline", coords: { latitude: 37.794691, longitude: -122.399564 } },
];

const RIDE_OPTIONS = [
  { id: '1', name: 'Standard', eta: '11 min', passengers: 4, price: 89, promo: '10% promo applied', image: rideOption1Image },
  { id: '2', name: 'Taxi', eta: '19 min', passengers: 4, price: 80, image: rideOption2Image },
  { id: '3', name: 'Economy', eta: '11 min', passengers: 4, price: 81, image: rideOption3Image },
  { id: '4', name: 'Comfort', eta: '15 min', passengers: 4, price: 104, image: rideOption4Image },
];

const RideSearchAndSavedLocations = ({
  theme,
  userName,
  greeting,
  onSearchPress,
  isSearching,
  handleClearSearch,
  pickupLocation,
  destinationQuery,
  setDestinationQuery,
  destinationSearchResults,
  onSearchResultPress,
}) => {
  const listData = isSearching ? destinationSearchResults : SAVED_LOCATIONS;

  return (
    <BottomSheetView style={styles.rideContainer}>
      {isSearching ? (
        <View>
          <View style={styles.inputStack}>
            <View style={[styles.inputBox, { backgroundColor: theme.card }]}>
              <Ionicons name="location-sharp" size={16} color={theme.icon} style={styles.inputIcon} />
              <Text style={[styles.staticInputText, { color: theme.subText }]}>{pickupLocation}</Text>
            </View>
            <View style={[styles.inputBox, { backgroundColor: theme.card }]}>
              <Ionicons name="search" size={16} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: theme.text }]}
                placeholder="Where to?"
                placeholderTextColor={theme.subText}
                value={destinationQuery}
                onChangeText={setDestinationQuery}
                autoFocus={true}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={handleClearSearch}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={[styles.greetingText, { color: theme.text }]}>
            {greeting}, {userName}
          </Text>
          <View style={styles.inputStack}>
            <View style={[styles.inputBox, { backgroundColor: theme.card }]}>
              <Ionicons name="location-sharp" size={16} color={theme.icon} style={styles.inputIcon} />
              <Text style={[styles.staticInputText, { color: theme.subText }]}>{pickupLocation}</Text>
            </View>
            <TouchableOpacity style={[styles.inputBox, { backgroundColor: theme.card }]} onPress={onSearchPress}>
              <Ionicons name="search" size={16} color={theme.icon} style={styles.inputIcon} />
              <Text style={[styles.textInput, { color: theme.subText }]}>Where to?</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList
        data={listData}
        keyExtractor={(item, index) => item.id || `search-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.savedLocationItem, { borderBottomColor: theme.border }]}
            onPress={() => onSearchResultPress(item)}
          >
            <View style={[styles.locationIconContainer, { backgroundColor: theme.iconBackground }]}>
              <Ionicons name={item.icon || "location-outline"} size={20} color={theme.icon} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={[styles.locationName, { color: theme.text }]}>
                {item.name || item.street || "Unknown Location"}
              </Text>
              <Text style={[styles.locationAddress, { color: theme.subText }]}>
                {item.address || item.city || item.street || "No address available"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </BottomSheetView>
  );
};

const RideSelectionView = ({ theme, selectedItem, pickupLocation, onBack, onConfirmRide }) => {
  const [selectedRide, setSelectedRide] = useState(RIDE_OPTIONS[0]);

  return (
    <BottomSheetView style={styles.rideSelectionContainer}>
      <View style={styles.rideHeader}>
        <Ionicons name="arrow-back" size={24} color={theme.text} onPress={onBack} />
        <Text style={[styles.rideHeaderTitle, { color: theme.text }]}>{pickupLocation} → {selectedItem?.name}</Text>
        <Ionicons name="add" size={24} color={theme.text} />
      </View>
      
      <View style={styles.promoContainer}>
        <Ionicons name="pricetag-outline" size={20} color={theme.text} />
        <Text style={[styles.promoText, { color: theme.text }]}>10% promo applied</Text>
      </View>
      
      <FlatList
        data={RIDE_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.rideOptionItem,
              { borderColor: theme.border, backgroundColor: selectedRide.id === item.id ? theme.primary + '10' : 'transparent' }
            ]}
            onPress={() => setSelectedRide(item)}
          >
            <Image source={item.image} style={styles.rideOptionImage} />
            <View style={styles.rideOptionDetails}>
              <Text style={[styles.rideOptionName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.rideOptionEta, { color: theme.subText }]}>{item.eta}</Text>
              <Text style={[styles.rideOptionPassengers, { color: theme.subText }]}>
                <Ionicons name="person-outline" size={14} color={theme.subText} /> {item.passengers}
              </Text>
              {item.promo && <Text style={styles.rideOptionPromo}>{item.promo}</Text>}
            </View>
            <View style={styles.rideOptionPriceContainer}>
              <Text style={[styles.rideOptionPrice, { color: theme.text }]}>GHC{item.price}</Text>
              <Text style={[styles.rideOptionOldPrice, { color: theme.subText, textDecorationLine: 'line-through' }]}>GHC{item.price + 6}</Text>
              {selectedRide.id === item.id && <Ionicons name="checkmark-circle-outline" size={20} color={theme.primary} />}
            </View>
          </TouchableOpacity>
        )}
      />
      
      <View style={[styles.bottomActions, { justifyContent: 'center' }]}>
        <TouchableOpacity
          style={[styles.selectBoltButton, { backgroundColor: theme.primary, alignSelf: 'stretch' }]}
          onPress={() => onConfirmRide(selectedRide)}
        >
          <Text style={styles.selectBoltButtonText}>Select Ride</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};

const ShuttleOptionsView = ({ theme, onSelectRoute, searchQuery, setSearchQuery, shuttleRoutes, loading }) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }
    
    // Filter the fetched shuttleRoutes based on the search query
    const filteredRoutes = shuttleRoutes.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <BottomSheetView style={styles.shuttleContainer}>
            <View style={styles.shuttleHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Shuttle Routes</Text>
            </View>
            <BlurView intensity={theme.mode === "dark" ? 20 : 30} tint={theme.mode === "dark" ? "dark" : "light"} style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <Ionicons name="search" size={20} color={theme.icon} style={styles.searchIcon} />
                <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="Search for a route..."
                    placeholderTextColor={theme.mode === "dark" ? "#aaa" : "#555"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </BlurView>

            <BottomSheetFlatList
                data={filteredRoutes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.listItem, { borderColor: theme.border }]}
                        onPress={() => onSelectRoute(item)}
                    >
                        <Ionicons name="bus-outline" size={24} color={theme.primary} style={styles.listIcon} />
                        <View>
                            <Text style={[styles.itemTitle, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.itemDetail, { color: theme.subText }]}>ETA: {item.eta}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.subText }]}>
                        No routes found.
                    </Text>
                }
            />
        </BottomSheetView>
    );
};

const CourierOptionsView = ({
  theme,
  courierSubMode,
  setCourierSubMode,
  courierDestination,
  setCourierDestination,
  filteredData,
  setSelectedItem,
  triggerHaptic,
}) => {
  return (
    <BottomSheetView style={styles.courierContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text, paddingHorizontal: 20 }]}>
        Courier Service
      </Text>
      <View style={styles.subModeContainer}>
        {["send", "receive", "track"].map((subMode) => (
          <TouchableOpacity
            key={subMode}
            style={[
              styles.subModeButton,
              courierSubMode === subMode
                ? { backgroundColor: theme.primary }
                : { backgroundColor: theme.cardBackground },
            ]}
            onPress={() => setCourierSubMode(subMode)}
          >
            <Text
              style={[
                styles.subModeText,
                courierSubMode === subMode
                  ? { color: "#fff" }
                  : { color: theme.text },
              ]}
            >
              {subMode.charAt(0).toUpperCase() + subMode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {courierSubMode === "send" && (
        <View style={styles.courierActionContainer}>
          <Text style={[styles.courierActionTitle, { color: theme.text }]}>
            Send a Package
          </Text>
          <BlurView intensity={theme.mode === "dark" ? 20 : 30} tint={theme.mode === "dark" ? "dark" : "light"} style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Ionicons name="location-outline" size={20} color={theme.icon} style={styles.searchIcon} />
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Enter recipient's address"
              placeholderTextColor={theme.mode === "dark" ? "#aaa" : "#555"}
              value={courierDestination}
              onChangeText={setCourierDestination}
            />
          </BlurView>
        </View>
      )}

      {courierSubMode === "receive" && (
        <BottomSheetFlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { borderColor: theme.border }]}
              onPress={() => {
                setSelectedItem(item);
                triggerHaptic();
              }}
            >
              <Ionicons name="cube-outline" size={24} color={theme.primary} style={styles.listIcon} />
              <View>
                <Text style={[styles.itemTitle, { color: theme.text, fontSize: 16 }]}>
                  Package from: {item.sender || 'Unknown'}
                </Text>
                <Text style={[styles.itemDetail, { color: theme.subText }]}>
                  Status: {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              No incoming packages
            </Text>
          }
        />
      )}

      {courierSubMode === "track" && (
        <View style={styles.courierActionContainer}>
          <Text style={[styles.courierActionTitle, { color: theme.text }]}>
            Track Your Package
          </Text>
          <BlurView intensity={theme.mode === "dark" ? 20 : 30} tint={theme.mode === "dark" ? "dark" : "light"} style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
            <Ionicons name="search" size={20} color={theme.icon} style={styles.searchIcon} />
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Enter Tracking ID"
              placeholderTextColor={theme.mode === "dark" ? "#aaa" : "#555"}
            />
          </BlurView>
        </View>
      )}
    </BottomSheetView>
  );
};

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { settings } = useAccessibility();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { shuttleLocation } = useContext(CommunicationContext);

  const paramMode = route.params?.mode || "shuttle";
  const isCourierRelated = ["courier", "send", "receive", "track"].includes(paramMode);

  const initialMode = isCourierRelated ? "courier" : paramMode;
  const userName = user?.name?.split(' ')[0] || "Guest";

  const getTimeOfDayGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const greeting = getTimeOfDayGreeting();

  const [userLocation, setUserLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("Getting current location...");
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [courierSubMode, setCourierSubMode] = useState(
    isCourierRelated && paramMode !== "courier" ? paramMode : "send"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courierDestination, setCourierDestination] = useState("");
  
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSearchResults, setDestinationSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [pickupToDestinationRoute, setPickupToDestinationRoute] = useState([]);
  const [driverToPickupRoute, setDriverToPickupRoute] = useState([]);
  const [rideStatus, setRideStatus] = useState('initial');
  const [selectedShuttleRoute, setSelectedShuttleRoute] = useState(null);

  // New state variables for shuttle data
  const [shuttleRoutes, setShuttleRoutes] = useState([]);
  const [shuttleBusLocations, setShuttleBusLocations] = useState([]);

  const socketRef = useRef(null);
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["35%", "50%", "90%"], []);

  const handleRideSearchPress = () => {
    setIsSearching(true);
    bottomSheetRef.current?.snapToIndex(2);
    if (settings.vibration) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleClearSearch = () => {
    setDestinationQuery("");
    setIsSearching(false);
    setSelectedItem(null);
    setDriverToPickupRoute([]);
    setPickupToDestinationRoute([]);
    setRideStatus('initial');
    bottomSheetRef.current?.snapToIndex(1);
    if (settings.vibration) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const performGeocodeSearch = async (query) => {
    if (query.length < 3) {
      setDestinationSearchResults([]);
      return;
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        setDestinationSearchResults(data.results.map(loc => ({
          name: loc.formatted_address,
          address: loc.formatted_address,
          coords: {
            latitude: loc.geometry.location.lat,
            longitude: loc.geometry.location.lng,
          },
        })));
      } else {
        setDestinationSearchResults([]);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      setDestinationSearchResults([]);
    }
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (initialMode === 'ride') {
        performGeocodeSearch(destinationQuery);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [destinationQuery, initialMode]);
  
  const fetchRoute = async (origin, destination, routeSetter) => {
    if (!origin || !destination) return;
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decode(points);
        routeSetter(decodedPoints);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
    }
  };
  
  const decode = (t) => {
    let points = [];
    for (let index = 0, len = t.length; index < len;) {
      let b, shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      let lat = dlat / 1e5;
      let lng = dlng / 1e5;
      points.push({ latitude: lat, longitude: lng });
    }
    return points;
  };
  
  const handleSearchResultPress = async (item) => {
    setSelectedItem({
      name: item.name,
      address: item.address || item.city || item.street,
      coords: item.coords,
    });
    setRideStatus('selection');
    
    if (userLocation && item.coords) {
        await fetchRoute(userLocation, item.coords, setPickupToDestinationRoute);
        mapRef.current?.fitToCoordinates([userLocation, item.coords], {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
    }

    triggerHaptic();
    setDestinationQuery("");
    setIsSearching(false);
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleSelectRide = async (selectedRide) => {
    setRideStatus('confirmed');
    
    // We will use the shuttleLocation from the context, which is set by the driver
    if (userLocation && shuttleLocation) {
      await fetchRoute(shuttleLocation, userLocation, setDriverToPickupRoute);
      mapRef.current?.fitToCoordinates([shuttleLocation, userLocation, selectedItem.coords], {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  const handleCancelRide = () => {
    setRideStatus('initial');
    setSelectedItem(null);
    setDriverToPickupRoute([]);
    setPickupToDestinationRoute([]);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleSelectShuttleRoute = (route) => {
    setSelectedShuttleRoute(route);
    if (route.polyline) {
      mapRef.current?.fitToCoordinates(route.polyline, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  // Fetch real data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint;
        if (initialMode === "shuttle") {
            endpoint = "/api/shuttles/routes";
        } else if (initialMode === "ride") {
            endpoint = "/api/rides";
        } else {
            endpoint = "/api/couriers";
        }
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const jsonData = await res.json();
        
        if (initialMode === "shuttle") {
            setShuttleRoutes(jsonData.routes);
            setShuttleBusLocations(jsonData.buses);
        } else {
            setData(Array.isArray(jsonData) ? jsonData : []);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialMode]);

  // Listen for real-time shuttle location updates via Socket.IO
  useEffect(() => {
    if (initialMode !== "shuttle") return;
    
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
        console.log('Socket connected for shuttle updates');
    });

    socket.on('bus_location_update', (data) => {
        setShuttleBusLocations(prevLocations => {
            return prevLocations.map(bus => 
                bus.id === data.id ? { ...bus, coords: data.coords, nextStopEta: data.nextStopEta } : bus
            );
        });
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
  }, [initialMode]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is needed to show your position on the map.");
        return;
      }
      const initialLocation = await Location.getCurrentPositionAsync({});
      const initialCoords = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      };
      setUserLocation(initialCoords);
      const address = await Location.reverseGeocodeAsync(initialCoords);
      if (address.length > 0) {
        const { street, city, region } = address[0];
        setPickupLocation(street ? `${street}, ${city}` : `${city}, ${region}`);
      } else {
        setPickupLocation("Current Location");
      }

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          { ...initialCoords, latitudeDelta: 0.02, longitudeDelta: 0.02 },
          500
        );
      }
      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          const newCoords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(newCoords);
        }
      );
      return () => {
        if (sub) {
          sub.remove();
        }
      };
    })();
  }, []);

  const triggerHaptic = () => {
    if (settings.vibration && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const renderBottomSheetContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
        </View>
      );
    }
    
    if (initialMode === "ride" && rideStatus === 'confirmed') {
        return (
          <BottomSheetView style={styles.selectedItemContainer}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Driver on the Way!</Text>
            <Text style={[styles.itemDetail, { color: theme.subText }]}>
                Your driver is a few minutes away.
            </Text>
            <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border, marginTop: 15 }]}
                onPress={handleCancelRide}
            >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel Ride</Text>
            </TouchableOpacity>
          </BottomSheetView>
        );
    }
    
    if (initialMode === "ride" && rideStatus === 'selection' && selectedItem) {
        return (
            <RideSelectionView
                theme={theme}
                selectedItem={selectedItem}
                pickupLocation={pickupLocation}
                onBack={handleClearSearch}
                onConfirmRide={handleSelectRide}
            />
        );
    }
    
    if (initialMode === "ride") {
      return (
        <RideSearchAndSavedLocations
          theme={theme}
          setSelectedItem={setSelectedItem}
          triggerHaptic={triggerHaptic}
          userName={userName}
          greeting={greeting}
          onSearchPress={handleRideSearchPress}
          isSearching={isSearching}
          handleClearSearch={handleClearSearch}
          pickupLocation={pickupLocation}
          destinationQuery={destinationQuery}
          setDestinationQuery={setDestinationQuery}
          destinationSearchResults={destinationSearchResults}
          onSearchResultPress={handleSearchResultPress}
        />
      );
    }

    if (initialMode === "courier") {
      const filteredData = (data || []).filter((item) => {
        if (courierSubMode === "receive") return item.status === "incoming";
        return false;
      });

      return (
        <CourierOptionsView
          theme={theme}
          courierSubMode={courierSubMode}
          setCourierSubMode={setCourierSubMode}
          courierDestination={courierDestination}
          setCourierDestination={setCourierDestination}
          filteredData={filteredData}
          setSelectedItem={setSelectedItem}
          triggerHaptic={triggerHaptic}
        />
      );
    }

    if (initialMode === "shuttle") {
      return (
        <ShuttleOptionsView
          theme={theme}
          onSelectRoute={handleSelectShuttleRoute}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          shuttleRoutes={shuttleRoutes}
          loading={loading}
        />
      );
    }

    return null;
  };

  const translucent = (hex, alphaHex = "33") => {
    if (!hex) return "#00000033";
    if (hex.startsWith("rgb")) return "#00000033";
    if (hex.length === 7) return `${hex}${alphaHex}`;
    return hex;
  };

  const getOccupancyColor = (load) => {
    switch (load) {
        case 'High':
            return '#FF4444';
        case 'Medium':
            return '#FFB800';
        case 'Low':
            return '#4CAF50';
        default:
            return '#999999';
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        showsUserLocation
        region={
          userLocation
            ? { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 }
            : undefined
        }
        customMapStyle={theme.mode === "dark" ? darkMapStyle : []}
      >
        {shuttleLocation && (
          <Marker
            coordinate={shuttleLocation}
            title="Your Driver"
            image={driverCarMarkerImage}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}
        
        {selectedItem?.coords && (
          <Marker
            coordinate={selectedItem.coords}
            title={selectedItem.name}
            pinColor={"#FF4444"}
          />
        )}

        {driverToPickupRoute.length > 0 && rideStatus === 'confirmed' && (
          <>
            <Polyline
              coordinates={driverToPickupRoute}
              strokeColor={translucent(theme.primary, "33")}
              strokeWidth={14}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              coordinates={driverToPickupRoute}
              strokeColor={theme.primary}
              strokeWidth={6}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}
        
        {pickupToDestinationRoute.length > 0 && (rideStatus === 'selection' || rideStatus === 'confirmed') && (
          <>
            <Polyline
              coordinates={pickupToDestinationRoute}
              strokeColor={translucent(theme.primary, "22")}
              strokeWidth={12}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              coordinates={pickupToDestinationRoute}
              strokeColor={theme.primary}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              strokePattern={[{ type: 'dash', length: 18 }, { type: 'gap', length: 12 }]}
            />
          </>
        )}

        {selectedShuttleRoute?.polyline && (
          <Polyline
            coordinates={selectedShuttleRoute.polyline}
            strokeColor="#3498db"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
        
        {shuttleBusLocations.map(bus => (
            bus.coords && (
              <Marker
                  key={bus.id}
                  coordinate={bus.coords}
                  title={`Bus ${bus.id}`}
                  anchor={{ x: 0.5, y: 0.5 }}
              >
                  <View style={styles.shuttleBusMarkerContainer}>
                      <View style={styles.shuttleBusMarker}>
                          <Ionicons name="bus" size={20} color="#fff" />
                      </View>
                      <View style={[styles.shuttleBusStatus, { backgroundColor: getOccupancyColor(bus.load) }]}>
                          <Text style={styles.shuttleBusStatusText}>{bus.nextStopEta}</Text>
                      </View>
                  </View>
              </Marker>
            )
        ))}

      </MapView>
      
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu-outline" size={32} color={theme.text} />
      </TouchableOpacity>
      
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: theme.cardBackground }}
        handleIndicatorStyle={{ backgroundColor: theme.border }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        {renderBottomSheetContent()}
      </BottomSheet>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { textAlign: "center" },
  selectedItemContainer: { padding: 20 },
  itemTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  itemDetail: { fontSize: 16, marginBottom: 5 },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  subModeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subModeButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  subModeText: { fontSize: 16, fontWeight: "600" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  listIcon: { marginRight: 15 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  rideContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputStack: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  staticInputText: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  inputIcon: {
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: -50,
    left: 0,
    padding: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  inputButton: {
    flex: 1,
  },
  inputButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  shortcutButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  savedLocationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  locationAddress: {
    fontSize: 14,
  },
  shuttleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  courierContainer: {
    flex: 1,
  },
  courierActionContainer: {
    paddingHorizontal: 20,
  },
  courierActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
  confirmRideContainer: {
      flex: 1,
      padding: 20,
  },
  confirmTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
  },
  confirmationDetails: {
      marginBottom: 25,
  },
  detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
  },
  detailTextContainer: {
      marginLeft: 15,
  },
  detailLabel: {
      fontSize: 14,
      fontWeight: '600',
  },
  detailAddress: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  priceContainer: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 25,
  },
  priceText: {
      fontSize: 18,
      fontWeight: '600',
  },
  priceValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4caf50',
  },
  confirmButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
  },
  confirmButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  cancelButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
  },
  cancelButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  rideSelectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rideHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
  },
  promoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  rideOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  rideOptionImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
    marginRight: 15,
  },
  rideOptionDetails: {
    flex: 1,
  },
  rideOptionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideOptionEta: {
    fontSize: 14,
    fontWeight: '500',
  },
  rideOptionPassengers: {
    fontSize: 12,
  },
  rideOptionPromo: {
    color: '#3498db',
    fontSize: 12,
  },
  rideOptionPriceContainer: {
    alignItems: 'flex-end',
  },
  rideOptionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideOptionOldPrice: {
    fontSize: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  paymentText: {
    marginLeft: 5,
    marginRight: 5,
  },
  selectBoltButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  selectBoltButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shuttleBusMarkerContainer: {
      alignItems: 'center',
  },
  shuttleBusMarker: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#3498db',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderWidth: 2,
      borderColor: 'white',
  },
  shuttleBusStatus: {
      marginTop: -5,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      zIndex: 2,
      borderWidth: 1,
      borderColor: '#fff',
  },
  shuttleBusStatusText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
  },
});
