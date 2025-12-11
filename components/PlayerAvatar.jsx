import React, { useState } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { User } from "lucide-react-native";
import { colors, typography, borderRadius } from "../styles/theme";

/**
 * PlayerAvatar Component
 * Displays player photo with circular design, loading placeholder, and initials fallback
 */
const PlayerAvatar = ({
  uri,
  name = "",
  size = "md",
  border = false,
  fallback = null,
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

  const getInitials = () => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
      borderRadius: sizeValue / 2,
      borderWidth: border ? 2 : 0,
      borderColor: border ? colors.primary : "transparent",
    },
    style,
  ];

  const initials = getInitials();

  // Show fallback if error or no URI
  if (error || !uri) {
    return (
      <View style={containerStyle}>
        {fallback ? (
          fallback
        ) : initials ? (
          <Text
            style={[
              styles.initialsText,
              {
                fontSize: sizeValue * 0.4,
              },
            ]}
          >
            {initials}
          </Text>
        ) : (
          <User
            size={sizeValue * 0.5}
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
            borderRadius: sizeValue / 2,
          },
        ]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="cover"
        accessible={true}
        accessibilityLabel={name ? `${name} photo` : 'Player photo'}
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

  initialsText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
    textAlign: "center",
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(PlayerAvatar, (prevProps, nextProps) => {
  return (
    prevProps.uri === nextProps.uri &&
    prevProps.name === nextProps.name &&
    prevProps.size === nextProps.size &&
    prevProps.border === nextProps.border
  );
});
