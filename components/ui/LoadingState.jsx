import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../styles/theme";

/**
 * LoadingState Component
 * Displays a loading spinner with optional message
 */
const LoadingState = ({
  message = "Cargando...",
  size = "md",
  style,
  ...props
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case "sm":
        return "small";
      case "md":
        return "large";
      case "lg":
        return "large";
      default:
        return "large";
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <ActivityIndicator
        size={getSpinnerSize()}
        color={colors.primary}
      />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },

  message: {
    marginTop: spacing.base,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default LoadingState;
