import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../styles/theme";

/**
 * Button Component
 * Reusable button with multiple variants, sizes, and states
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
      case "secondary":
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
        };
      case "outline":
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
        };
      case "ghost":
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          container: styles.smContainer,
          text: styles.smText,
        };
      case "md":
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
      case "lg":
        return {
          container: styles.lgContainer,
          text: styles.lgText,
        };
      default:
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.container,
          variantStyles.container,
          sizeStyles.container,
          isDisabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#000" : colors.primary}
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            {typeof children === "string" ? (
              <Text
                style={[
                  styles.text,
                  variantStyles.text,
                  sizeStyles.text,
                  icon && styles.textWithIcon,
                  textStyle,
                ]}
              >
                {children}
              </Text>
            ) : (
              children
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.base,
    minHeight: 44,
  },

  // Variant styles
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: "#000000",
    fontFamily: typography.fontFamily.semiBold,
  },

  secondaryContainer: {
    backgroundColor: colors.background.tertiary,
  },
  secondaryText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
  },

  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },

  ghostContainer: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },

  // Size styles
  smContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },

  mdContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },

  lgContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  lgText: {
    fontSize: typography.fontSize.md,
  },

  // State styles
  disabled: {
    opacity: 0.5,
  },

  text: {
    textAlign: "center",
  },

  textWithIcon: {
    marginLeft: spacing.xs,
  },
});

export default Button;
