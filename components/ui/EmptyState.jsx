import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../styles/theme";

/**
 * EmptyState Component
 * Displays when there's no data to show
 */
const EmptyState = ({
  icon = null,
  title = "No hay datos",
  message = "No se encontró información para mostrar",
  action = null,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
      
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
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

  iconContainer: {
    marginBottom: spacing.base,
    opacity: 0.5,
  },

  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  message: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    maxWidth: 280,
  },

  actionContainer: {
    marginTop: spacing.base,
  },
});

export default EmptyState;
