import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../../styles/theme";

/**
 * Card Component
 * Reusable card container with variants and pressable state
 */
const Card = ({
  children,
  variant = "default",
  padding = "md",
  onPress,
  pressable = false,
  style,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return styles.defaultVariant;
      case "elevated":
        return styles.elevatedVariant;
      case "outlined":
        return styles.outlinedVariant;
      default:
        return styles.defaultVariant;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case "sm":
        return styles.smPadding;
      case "md":
        return styles.mdPadding;
      case "lg":
        return styles.lgPadding;
      default:
        return styles.mdPadding;
    }
  };

  const variantStyles = getVariantStyles();
  const paddingStyles = getPaddingStyles();
  const isInteractive = pressable || !!onPress;

  const cardContent = (
    <Animated.View
      style={[
        styles.container,
        variantStyles,
        paddingStyles,
        isInteractive && {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="button"
        {...props}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return <View {...props}>{cardContent}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },

  // Variant styles
  defaultVariant: {
    backgroundColor: colors.background.secondary,
  },

  elevatedVariant: {
    backgroundColor: colors.background.elevated,
    ...shadows.md,
  },

  outlinedVariant: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  // Padding styles
  smPadding: {
    padding: spacing.sm,
  },

  mdPadding: {
    padding: spacing.base,
  },

  lgPadding: {
    padding: spacing.lg,
  },
});

export default Card;
