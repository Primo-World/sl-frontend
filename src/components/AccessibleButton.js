import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Vibration,
  AccessibilityInfo,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibleButton({
  onPress,
  label,
  accessibilityLabel,
  style,
  textStyle,
  children,
}) {
  const { theme, highContrast } = useTheme();
  const { settings } = useAccessibility();

  const handlePress = () => {
    if (settings.vibration) {
      Vibration.vibrate(50);
    }
    if (accessibilityLabel || label) {
      AccessibilityInfo.announceForAccessibility(accessibilityLabel || label);
    }
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: highContrast ? theme.text : theme.tabBarActive, // ✅ contrast-friendly bg
          borderColor: theme.border,
        },
        style,
        pressed && { opacity: 0.7 },
      ]}
    >
      {children ? (
        children
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: highContrast ? theme.background : theme.background, // ✅ flips correctly
              fontSize: settings.largeText ? 20 : 16,
            },
            textStyle,
          ]}
          allowFontScaling={true}
          maxFontSizeMultiplier={2.0}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
  },
});
