import React, { useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Shield } from "lucide-react-native";
import { colors, borderRadius } from "../styles/theme";

/**
 * TeamLogo Component
 * Displays team logo with loading placeholder and fallback
 */
const TeamLogo = ({
  uri,
  size = "md",
  rounded = false,
  fallback = null,
  teamName = "Team",
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getSizeValue = () => {
    switch (size) {
      case "sm":
        return 32;
      case "md":
        return 48;
      case "lg":
        return 64;
      case "xl":
        return 80;
      default:
        return 48;
    }
  };

  const sizeValue = getSizeValue();

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const containerStyle = [
    styles.container,
    {
      width: sizeValue,
      height: sizeValue,
      borderRadius: rounded ? borderRadius.base : 0,
    },
    style,
  ];

  // Show fallback if error or no URI
  if (error || !uri) {
    return (
      <View style={containerStyle}>
        {fallback || (
          <Shield
            size={sizeValue * 0.6}
            color={colors.text.tertiary}
            strokeWidth={1.5}
          />
        )}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius: rounded ? borderRadius.base : 0,
          },
        ]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel={`${teamName} logo`}
        accessibilityRole="image"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.tertiary,
    zIndex: 1,
  },

  image: {
    backgroundColor: "transparent",
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(TeamLogo, (prevProps, nextProps) => {
  return (
    prevProps.uri === nextProps.uri &&
    prevProps.size === nextProps.size &&
    prevProps.rounded === nextProps.rounded &&
    prevProps.teamName === nextProps.teamName
  );
});
