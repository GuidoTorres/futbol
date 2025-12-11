import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { colors, typography, spacing } from "../../styles/theme";
import Button from "./Button";

/**
 * ErrorState Component
 * Displays error message with retry functionality
 */
const ErrorState = ({
  title = "Error",
  message = "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
  onRetry,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.iconContainer}>
        <AlertCircle size={64} color={colors.error} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onPress={onRetry}
          style={styles.retryButton}
        >
          Reintentar
        </Button>
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
    opacity: 0.8,
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

  retryButton: {
    marginTop: spacing.base,
    minWidth: 140,
  },
});

export default ErrorState;
