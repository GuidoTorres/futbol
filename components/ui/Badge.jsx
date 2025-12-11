import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../styles/theme";

/**
 * Badge Component
 * Small status indicator with color variants
 */
const Badge = ({
  children,
  variant = "default",
  size = "md",
  rounded = false,
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          container: styles.successContainer,
          text: styles.successText,
        };
      case "warning":
        return {
          container: styles.warningContainer,
          text: styles.warningText,
        };
      case "error":
        return {
          container: styles.errorContainer,
          text: styles.errorText,
        };
      case "info":
        return {
          container: styles.infoContainer,
          text: styles.infoText,
        };
      case "default":
        return {
          container: styles.defaultContainer,
          text: styles.defaultText,
        };
      default:
        return {
          container: styles.defaultContainer,
          text: styles.defaultText,
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
      default:
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        rounded && styles.rounded,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },

  text: {
    fontFamily: typography.fontFamily.semiBold,
    textAlign: "center",
  },

  // Variant styles
  successContainer: {
    backgroundColor: colors.success,
  },
  successText: {
    color: "#ffffff",
  },

  warningContainer: {
    backgroundColor: colors.warning,
  },
  warningText: {
    color: "#000000",
  },

  errorContainer: {
    backgroundColor: colors.error,
  },
  errorText: {
    color: "#ffffff",
  },

  infoContainer: {
    backgroundColor: colors.info,
  },
  infoText: {
    color: "#ffffff",
  },

  defaultContainer: {
    backgroundColor: colors.background.tertiary,
  },
  defaultText: {
    color: colors.text.secondary,
  },

  // Size styles
  smContainer: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  smText: {
    fontSize: typography.fontSize.xs,
  },

  mdContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mdText: {
    fontSize: typography.fontSize.sm,
  },

  // Rounded style
  rounded: {
    borderRadius: borderRadius.full,
  },
});

export default Badge;
