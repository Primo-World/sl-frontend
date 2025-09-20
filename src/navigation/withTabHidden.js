import React, { useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

/**
 * HOC to hide bottom tab bar whenever this screen (or another wrapped screen)
 * is focused inside a nested stack like AccountStack.
 */
export default function withTabHidden(Component) {
  if (!Component) {
    // fallback if component is undefined
    return () => null;
  }

  return function Wrapper(props) {
    const navigation = useNavigation();

    useFocusEffect(
      useCallback(() => {
        const parent = navigation.getParent(); // Tab navigator
        if (!parent) return;

        // Always hide tab bar when focused
        parent.setOptions({ tabBarStyle: { display: "none" } });

        return () => {
          const state = navigation.getState();
          const focusedRoute = state.routes[state.index];

          // If leaving to AccountMain, restore tab bar
          if (focusedRoute.name === "AccountMain") {
            parent.setOptions({ tabBarStyle: undefined });
          }
        };
      }, [navigation])
    );

    return <Component {...props} />;
  };
}
