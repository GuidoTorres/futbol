import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../../styles/theme";

/**
 * Input Component
 * Text input with focus states, clearable functionality, and error handling
 */
const Input = ({
  placeholder,
  value,
  onChangeText,
  icon = null,
  clearable = false,
  error = null,
  disabled = false,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onChangeText) {
      onChangeText("");
    }
  };

  const showClearButton = clearable && value && value.length > 0 && !disabled;

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          disabled && styles.containerDisabled,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          accessible={true}
          accessibilityLabel={placeholder}
          accessibilityState={{ disabled }}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            showClearButton && styles.inputWithClear,
            inputStyle,
          ]}
          {...props}
        />

        {showClearButton && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessible={true}
            accessibilityLabel="Clear input"
            accessibilityRole="button"
          >
            <X size={18} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: spacing.base,
    minHeight: 48,
  },

  containerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
  },

  containerError: {
    borderColor: colors.error,
  },

  containerDisabled: {
    opacity: 0.5,
  },

  iconContainer: {
    marginRight: spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },

  inputWithIcon: {
    marginLeft: 0,
  },

  inputWithClear: {
    paddingRight: spacing.xs,
  },

  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },

  errorText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.base,
  },
});

export default Input;
