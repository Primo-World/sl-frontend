// src/screens/HomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Dimensions, Image, SafeAreaView, Animated,
  AccessibilityInfo, Vibration, Easing,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const PROMO_CARD_WIDTH = width - 60;
const MORE_CARD_WIDTH = 222;

const colorMap = {
  Ride: "#4CAF50",
  Courier: "#3498db",
  Shuttle: "#e67e22",
  "Store Pickup": "#f39c12",
};

function SuggestionCard({ iconName, label, promo, accentColor, onPress }) {
  const { theme } = useTheme();
  const { settings } = useAccessibility();
  const defaultColor = colorMap[label] || theme.text;
  const color = accentColor || defaultColor;

  return (
    <TouchableOpacity
      style={[
        styles.sCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
        promo ? styles.sPromoCard : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} service`}
    >
      <View style={[styles.sIconCircle, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={iconName} size={30} color={color} />
      </View>
      <Text style={[styles.sLabel, { color: theme.text, fontSize: settings.largeText ? 16 : 14 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MoreWaysCard({ image, title }) {
  const { settings } = useAccessibility();
  const { theme } = useTheme();

  return (
    <View
      style={styles.mCard}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`More ways option: ${title}`}
    >
      <Image source={image} style={styles.mImage} />

      {/* Gradient overlay updated for dark mode */}
      <LinearGradient
        colors={theme.mode === "dark" ? ['rgba(0,0,0,0.5)', 'transparent'] : ['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.mOverlay}
      />

      <View style={styles.mTitleWrap}>
        <Text style={[styles.mTitle, { color: '#fff', fontSize: settings.largeText ? 18 : 15 }]}>
          {title}
        </Text>
      </View>
    </View>
  );
}

function Dot({ active, theme }) {
  const scale = useRef(new Animated.Value(active ? 1.3 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1.3 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [active, scale]);

  const backgroundColor = active ? theme.text : (theme.subtext || '#999');

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { settings } = useAccessibility();
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [moreIndex, setMoreIndex] = useState(0);

  const promoScrollRef = useRef(null);
  const moreScrollRef = useRef(null);

  const searchWidth = useRef(new Animated.Value(width - 110)).current;
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const resultsAnim = useRef(new Animated.Value(0)).current;

  const handleSearchChange = async (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`https://sl-backend-td4y.onrender.com/api/locations/search?q=${text}`);
      const data = await response.json();
      setSearchResults(data.locations || []);
    } catch (error) {
      console.error('Search API error:', error);
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
  };

  const handleBlur = () => {
    setIsFocused(false);
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
  };

  useEffect(() => {
    Animated.timing(resultsAnim, {
      toValue: searchText.trim() !== '' ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [searchText, searchResults]);

  useEffect(() => {
    if (isListening && !settings.reduceMotion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, settings.reduceMotion]);

  // FIX: This new useEffect hook handles the automatic scrolling.
  // We use the functional form of setState to avoid stale state.
  useEffect(() => {
    if (settings.reduceMotion) return;

    const promoInterval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % promos.length;
        if (promoScrollRef.current) {
          promoScrollRef.current.scrollTo({
            x: nextIndex * PROMO_CARD_WIDTH,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 5000); // Scrolls every 5 seconds

    const moreInterval = setInterval(() => {
      setMoreIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % (moreWays.length * 2);
        if (moreScrollRef.current) {
          moreScrollRef.current.scrollTo({
            x: nextIndex * MORE_CARD_WIDTH,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 4000); // Scrolls every 4 seconds

    // Clean up intervals when the component unmounts
    return () => {
      clearInterval(promoInterval);
      clearInterval(moreInterval);
    };
  }, [settings.reduceMotion]); // Remove currentIndex and moreIndex from dependencies

  const toggleMic = () => {
    setIsListening(!isListening);
    if (settings.vibration) Vibration.vibrate(50);
    if (settings.screenReader) AccessibilityInfo.announceForAccessibility(
      isListening ? "Stopped listening" : "Listening"
    );
  };

  const handleNavigation = (title) => {
    if (title === "Courier" || title === "Store Pickup") navigation.navigate("Courier");
  };

  const handleRidePress = () => navigation.navigate('Map', { mode: 'ride' });

  const promos = [
    { title: "Enjoy 50% off rides", sub: "Limited time — Terms apply", image: require('../../assets/images/promo1.png'), bg: "#1b5e20" },
    { title: "Shuttle Pass — Save daily", sub: "Monthly plans available", image: require('../../assets/images/promo2.png'), bg: "#2b2b86" },
  ];

  const moreWays = [
    { image: require('../../assets/images/more3.jpg'), title: "Deliveries" },
    { image: require("../../assets/images/courier.jpg"), title: "Courier" },
    { image: require('../../assets/images/more1.png'), title: "Store Pickup" },
  ];

  const onPromoMomentum = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / PROMO_CARD_WIDTH);
    setCurrentIndex(index);
  };

  // FIX: This function has been updated to handle the seamless loop.
  const onMoreMomentum = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / MORE_CARD_WIDTH);
    setMoreIndex(index);

    // Loop back to the start if the user scrolls to the end of the duplicated list.
    if (index >= moreWays.length) {
      moreScrollRef.current.scrollTo({ x: 0, animated: false });
      setMoreIndex(0);
    }
  };

  const goToPromo = (i) => {
    if (promoScrollRef.current) {
      promoScrollRef.current.scrollTo({ x: i * PROMO_CARD_WIDTH, animated: true });
      setCurrentIndex(i);
    }
  };

  const goToMore = (i) => {
    if (moreScrollRef.current) {
      moreScrollRef.current.scrollTo({ x: i * MORE_CARD_WIDTH, animated: true });
      setMoreIndex(i);
    }
  };

  const moreActiveIndex = moreIndex % moreWays.length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topRow}>
          <Text style={[styles.brand, { color: theme.text, fontSize: settings.largeText ? 42 : 36 }]} accessibilityRole="header" accessibilityLabel="SL Home">SL</Text>
        </View>

        <View style={styles.searchRow}>
          <Animated.View style={{ width: searchWidth }}>
            <BlurView intensity={theme.mode === "dark" ? 80 : 30} tint={theme.mode === "dark" ? "dark" : "light"} style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <Ionicons name="search" size={20} color={theme.text} />
              <TextInput
                placeholder="Search location"
                placeholderTextColor={theme.mode === "dark" ? "#aaa" : "#555"}
                style={[styles.searchInput, { color: theme.text, fontSize: settings.largeText ? 20 : 16 }]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={searchText}
                onChangeText={handleSearchChange}
                accessible
                accessibilityLabel="Search for a ride"
              />
              <TouchableOpacity onPress={toggleMic} style={styles.micBtn} accessibilityRole="button" accessibilityLabel={isListening ? "Stop voice input" : "Start voice input"}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Ionicons name={isListening ? "mic" : "mic-outline"} size={20} color={isListening ? "red" : theme.text} />
                </Animated.View>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
          {!isFocused && (
            <TouchableOpacity style={[styles.laterBtn, { backgroundColor: theme.cardAlt }]} accessibilityRole="button" accessibilityLabel="Schedule ride for later">
              <Ionicons name="calendar-outline" size={16} color={theme.text} />
              <Text style={[styles.laterText, { color: theme.text, fontSize: settings.largeText ? 16 : 14 }]}>Later</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        <Animated.View
          style={{
            paddingHorizontal: 15,
            marginBottom: 14,
            opacity: resultsAnim,
            transform: [{
              scaleY: resultsAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] })
            }],
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((loc, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: resultsAnim,
                  transform: [{
                    translateY: resultsAnim.interpolate({ inputRange: [0, 1], outputRange: [10 * (index + 1), 0] })
                  }],
                }}
              >
                <TouchableOpacity
                  style={[styles.locationCard, { backgroundColor: theme.card, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 }]}
                  onPress={handleRidePress}
                  accessibilityRole="button"
                  accessibilityLabel={`Ride ${loc.name}`}
                >
                  <View style={styles.locationLeft}>
                    <View style={[styles.locationClock, { backgroundColor: theme.cardAlt }]}>
                      <Ionicons name="time-outline" size={18} color={theme.text} />
                    </View>
                  </View>
                  <View style={styles.locationRight}>
                    <Text style={[styles.locTitle, { color: theme.text, fontSize: settings.largeText ? 20 : 16 }]}>{loc.name}</Text>
                    <Text style={[styles.locSub, { color: theme.subtext, fontSize: settings.largeText ? 16 : 13 }]}>{loc.route}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            searchText.trim() !== '' && (
              <Animated.Text style={{ color: theme.text, fontSize: settings.largeText ? 18 : 14, opacity: resultsAnim }}>
                No results found
              </Animated.Text>
            )
          )}
        </Animated.View>

        {/* Suggestions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: settings.largeText ? 18 : 16 }]}>Suggestions</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll} contentContainerStyle={{ paddingLeft: 15 }}>
          <SuggestionCard iconName="car" label="Ride" promo onPress={handleRidePress} />
          <SuggestionCard iconName="cube" label="Courier" onPress={() => navigation.navigate("Map", { mode: "track" })} />
          <SuggestionCard iconName="bus" label="Shuttle" onPress={() => navigation.navigate("Map", { mode: "shuttle" })} />
          <SuggestionCard iconName="storefront" label="Store Pickup" onPress={() => navigation.navigate("Map", { mode: "receive" })} />
        </ScrollView>

        {/* Promos */}
        <ScrollView
          ref={promoScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.promoScroll}
          contentContainerStyle={{ paddingLeft: 15 }}
          onMomentumScrollEnd={onPromoMomentum}
        >
          {promos.map((promo, index) => (
            <View key={index} style={[styles.promoCard, { backgroundColor: promo.bg }]}>
              {/* Dark-mode gradient for promo cards */}
              <LinearGradient
                colors={theme.mode === "dark" ? ['rgba(0,0,0,0.5)', 'transparent'] : ['rgba(0,0,0,0.45)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />

              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Text style={[styles.promoTitle, { fontSize: settings.largeText ? 26 : 22 }]}>
                  {promo.title}
                </Text>
                <Text style={[styles.promoSub, { fontSize: settings.largeText ? 16 : 13 }]}>
                  {promo.sub}
                </Text>
              </View>

              <Image source={promo.image} style={styles.promoImageLarge} />
            </View>
          ))}
        </ScrollView>

        {/* Promo dots */}
        <View style={styles.dotsContainer} accessible accessibilityRole="adjustable" accessibilityLabel={`Promos. Slide ${currentIndex + 1} of ${promos.length}`}>
          {promos.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (promoScrollRef.current) {
                  promoScrollRef.current.scrollTo({ x: i * PROMO_CARD_WIDTH, animated: true });
                  setCurrentIndex(i);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`Go to promo ${i + 1} of ${promos.length}`}
              style={styles.dotTouchable}
            >
              <Dot active={i === currentIndex} theme={theme} />
            </TouchableOpacity>
          ))}
        </View>

        {/* More Ways */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.moreHeader, { color: theme.text, fontSize: settings.largeText ? 22 : 20 }]} accessibilityRole="header">Get anything with Courier</Text>
        </View>
        <ScrollView
          ref={moreScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.moreScroll}
          contentContainerStyle={{ paddingLeft: 15 }}
          onMomentumScrollEnd={onMoreMomentum} // Updated handler
        >
          {moreWays.concat(moreWays).map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleNavigation(item.title)}>
              <MoreWaysCard image={item.image} title={item.title} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* More Ways dots */}
        <View style={styles.dotsContainer} accessible accessibilityRole="adjustable" accessibilityLabel={`More ways. Slide ${moreActiveIndex + 1} of ${moreWays.length}`}>
          {moreWays.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (moreScrollRef.current) {
                  moreScrollRef.current.scrollTo({ x: i * MORE_CARD_WIDTH, animated: true });
                  setMoreIndex(i);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`Go to More Ways ${i + 1} of ${moreWays.length}`}
              style={styles.dotTouchable}
            >
              <Dot active={i === moreActiveIndex} theme={theme} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, paddingTop: 10 },
  topRow: { paddingHorizontal: 16, marginBottom: 6 },
  brand: { fontWeight: '900', letterSpacing: 0.5 },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 12 },
  searchBox: { borderRadius: 25, height: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', overflow: "hidden" },
  searchInput: { marginLeft: 10, fontWeight: '600', flex: 1 },
  micBtn: { paddingLeft: 8, paddingRight: 2, height: "100%", justifyContent: "center" },
  laterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  laterText: { marginLeft: 6, fontWeight: '600' },
  locationCard: { marginHorizontal: 15, borderRadius: 12, height: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 14 },
  locationLeft: { width: 56, justifyContent: 'center', alignItems: 'center' },
  locationClock: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  locationRight: { marginLeft: 12 },
  locTitle: { fontWeight: '800' },
  locSub: { marginTop: 2 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 8 },
  sectionTitle: { fontWeight: '800' },
  suggestionsScroll: { paddingLeft: 15, marginBottom: 14 },
  promoScroll: { height: 280 },
  promoCard: {
    width: PROMO_CARD_WIDTH,
    height: 250,
    borderRadius: 14,
    marginRight: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  promoTitle: { fontWeight: '900', color: '#fff', marginBottom: 8 },
  promoSub: { color: '#f0f0f0', marginTop: 4 },
  promoImageLarge: { width: 150, height: 150, resizeMode: 'contain', marginLeft: 12, alignSelf: 'flex-end' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, marginBottom: 6 },
  dotTouchable: { paddingHorizontal: 6 },
  dot: { width: 8, height: 8, borderRadius: 8, marginHorizontal: 4 },
  dotActive: { width: 12, height: 12, borderRadius: 12 },
  sectionTitleRow: { paddingHorizontal: 15, marginBottom: 10 },
  moreTitle: { fontWeight: '800' },
  moreScroll: { marginBottom: 26 },
  sCard: { width: 120, height: 120, borderRadius: 16, marginRight: 12, alignItems: "center", justifyContent: "center", padding: 10, borderWidth: 1 },
  sPromoCard: { borderWidth: 2 },
  sIconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  sLabel: { fontWeight: "700" },
  mCard: { width: MORE_CARD_WIDTH, height: 140, borderRadius: 14, marginRight: 12, overflow: "hidden", borderWidth: 1 },
  mImage: { width: "100%", height: "100%", resizeMode: "cover" },
  mOverlay: { ...StyleSheet.absoluteFillObject },
  mTitleWrap: { position: "absolute", bottom: 8, left: 10 },
  mTitle: { fontWeight: "900" },
  moreHeader: { fontSize: 20, fontWeight: '800', marginTop: 20, marginBottom: 10 },
});