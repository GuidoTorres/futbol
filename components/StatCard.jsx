import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";

/**
 * StatCard Component
 * Displays a statistic with label, value, optional icon, and trend indicator
 */
const StatCard = ({
  label,
  value,
  icon = null,
  trend = null,
  variant = "default",
  style,
  ...props
}) => {
  const getTrendIcon = () => {
    const iconSize = 16;
    switch (trend) {
      case "up":
        return <TrendingUp size={iconSize} color={colors.success} strokeWidth={2} />;
      case "down":
        return <TrendingDown size={iconSize} color={colors.error} strokeWidth={2} />;
      case "neutral":
        return <Minus size={iconSize} color={colors.text.tertiary} strokeWidth={2} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return colors.success;
      case "down":
        return colors.error;
      case "neutral":
        return colors.text.tertiary;
      default:
        return colors.text.primary;
    }
  };

  const isHighlighted = variant === "highlighted";

  return (
    <View
      style={[
        styles.container,
        isHighlighted && styles.highlightedContainer,
        style,
      ]}
      {...props}
    >
      {/* Icon and Label Row */}
      <View style={styles.headerRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.label,
            isHighlighted && styles.highlightedLabel,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      {/* Value and Trend Row */}
      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            isHighlighted && styles.highlightedValue,
            trend && { color: getTrendColor() },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
        {trend && <View style={styles.trendContainer}>{getTrendIcon()}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    ...shadows.sm,
    minWidth: 100,
  },

  highlightedContainer: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.md,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },

  iconContainer: {
    marginRight: spacing.xs,
  },

  label: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },

  highlightedLabel: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  value: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    flex: 1,
  },

  highlightedValue: {
    color: colors.primary,
  },

  trendContainer: {
    marginLeft: spacing.xs,
  },
});

export default StatCard;
