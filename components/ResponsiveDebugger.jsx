/**
 * Responsive Debugger Component
 * 
 * A utility component to display current responsive values for testing.
 * Add this to any screen during development to see responsive behavior.
 * 
 * Usage:
 * import ResponsiveDebugger from '../../components/ResponsiveDebugger';
 * 
 * <ResponsiveDebugger />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  useScreenDimensions,
  useBreakpoint,
  useIsTablet,
  useGridColumns,
  breakpoints,
} from '../utils/responsive';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

export default function ResponsiveDebugger() {
  const { width, height, scale, fontScale } = useScreenDimensions();
  const breakpoint = useBreakpoint();
  const isTablet = useIsTablet();
  const numColumns = useGridColumns();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Responsive Debug Info</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Screen Dimensions</Text>
        <Text style={styles.value}>Width: {Math.round(width)}px</Text>
        <Text style={styles.value}>Height: {Math.round(height)}px</Text>
        <Text style={styles.value}>Scale: {scale.toFixed(2)}x</Text>
        <Text style={styles.value}>Font Scale: {fontScale.toFixed(2)}x</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Breakpoint</Text>
        <Text style={[styles.value, styles.highlight]}>
          Current: {breakpoint.toUpperCase()}
        </Text>
        <Text style={styles.value}>
          {breakpoint === 'xs' && '< 375px (Extra Small)'}
          {breakpoint === 'sm' && '≥ 375px (Small Phone)'}
          {breakpoint === 'md' && '≥ 768px (Tablet)'}
          {breakpoint === 'lg' && '≥ 1024px (Large Tablet)'}
          {breakpoint === 'xl' && '≥ 1280px (Desktop)'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Device Type</Text>
        <Text style={[styles.value, styles.highlight]}>
          {isTablet ? '📱 Tablet' : '📱 Phone'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Grid Columns</Text>
        <Text style={[styles.value, styles.highlight]}>{numColumns}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Breakpoint Thresholds</Text>
        {Object.entries(breakpoints).map(([key, value]) => (
          <Text key={key} style={styles.value}>
            {key.toUpperCase()}: {value}px
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    margin: spacing.base,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.xs,
  },
  highlight: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
  },
});
