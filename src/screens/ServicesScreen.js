import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";

const services = [
  {
    id: 1,
    name: "Shuttle",
    description: "Get a real time update on shuttle arrivals.",
    image: require("../../assets/images/shuttle.jpg"),
  },
  {
    id: 2,
    name: "Ride",
    description: "Get a private ride to your destination quickly.",
    image: require("../../assets/images/ride.png"),
  },
  {
    id: 3,
    name: "Courier",
    description: "Send and receive packages easily.",
    image: require("../../assets/images/courier.jpg"),
  },
];

export default function ServicesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings } = useAccessibility();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      accessible
      accessibilityLabel="Services screen"
    >
      {/* Header */}
      <Text
        style={[
          styles.header,
          {
            color: theme.text,
            fontSize: settings.largeText ? 30 : 26,
          },
        ]}
        accessibilityRole="header"
      >
        Services
      </Text>
      <Text
        style={[
          styles.tagline,
          {
            color: theme.subText,
            fontSize: settings.largeText ? 18 : 16,
          },
        ]}
        accessibilityLabel="Track, Ride and Deliver in One App"
      >
        Track, Ride & Deliver in One App
      </Text>

      {/* Big promo banner */}
      <View
        style={[styles.banner, { backgroundColor: theme.cardBackground }]}
        accessible
        accessibilityLabel="Promotional banner"
      >
        <Image
          source={require("../../assets/images/banner-placeholder.png")}
          style={styles.bannerImage}
          accessibilityIgnoresInvertColors
          accessibilityLabel="Banner image placeholder"
        />
      </View>

      {/* Shuttle + Ride grid */}
      <View style={styles.gridRow}>
        {services.slice(0, 2).map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() => {
              if (service.name === "Shuttle") {
                navigation.navigate("Map");
              } else if (service.name === "Ride") {
                navigation.navigate("Map", { mode: "ride" });
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={`${service.name} service`}
            accessibilityHint={`Opens the ${service.name} service screen`}
          >
            <ImageBackground
              source={service.image}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 10 }}
            >
              {/* Gradient overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.overlay}
              />
              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: "#fff",
                      fontSize: settings.largeText ? 20 : 18,
                    },
                  ]}
                >
                  {service.name}
                </Text>
                <Text
                  style={[
                    styles.description,
                    {
                      color: "#f0f0f0",
                      fontSize: settings.largeText ? 16 : 14,
                    },
                  ]}
                >
                  {service.description}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>

      {/* Courier section */}
      <Text
        style={[
          styles.courierHeader,
          { color: theme.text, fontSize: settings.largeText ? 22 : 20 },
        ]}
        accessibilityRole="header"
      >
        Get anything with Courier
      </Text>
      <TouchableOpacity
        style={styles.cardFull}
        onPress={() => navigation.navigate("Courier")}
        accessibilityRole="button"
        accessibilityLabel="Courier service"
        accessibilityHint="Opens the Courier service screen"
      >
        <ImageBackground
          source={services[2].image}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 10 }}
        >
          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.overlay}
          />
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.title,
                {
                  color: "#fff",
                  fontSize: settings.largeText ? 20 : 18,
                },
              ]}
            >
              {services[2].name}
            </Text>
            <Text
              style={[
                styles.description,
                {
                  color: "#f0f0f0",
                  fontSize: settings.largeText ? 16 : 14,
                },
              ]}
            >
              {services[2].description}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 16,
  },
  banner: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    width: "48%",
    height: 160,
  },
  cardFull: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 12,
    height: 160,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  courierHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});
