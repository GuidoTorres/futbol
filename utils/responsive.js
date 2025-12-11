/**
 * Responsive Utilities
 * Utilities for handling different screen sizes and responsive values
 */

import { Dimensions, PixelRatio, Platform } from "react-native";
import { useState, useEffect } from "react";

// Breakpoints for different device sizes
export const breakpoints = {
  sm: 375, // Small phones
  md: 768, // Tablets
  lg: 1024, // Large tablets
  xl: 1280, // Desktop
};

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => {
  return {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    scale: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
  };
};

/**
 * Hook to get current screen dimensions with updates on resize
 */
export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(getScreenDimensions());

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: PixelRatio.get(),
        fontScale: PixelRatio.getFontScale(),
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

/**
 * Get current breakpoint based on screen width
 */
export const getCurrentBreakpoint = (width) => {
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
};

/**
 * Hook to get current breakpoint
 */
export const useBreakpoint = () => {
  const { width } = useScreenDimensions();
  return getCurrentBreakpoint(width);
};

/**
 * Check if current screen matches a breakpoint
 */
export const isBreakpoint = (breakpoint, width) => {
  const currentWidth = width || Dimensions.get("window").width;
  return currentWidth >= breakpoints[breakpoint];
};

/**
 * Get responsive value based on current screen size
 * @param {Object} values - Object with breakpoint keys and values
 * @param {*} values.base - Base value (required)
 * @param {*} values.sm - Small breakpoint value
 * @param {*} values.md - Medium breakpoint value
 * @param {*} values.lg - Large breakpoint value
 * @param {*} values.xl - Extra large breakpoint value
 * @returns {*} The appropriate value for current screen size
 */
export const getResponsiveValue = (values, width) => {
  const currentWidth = width || Dimensions.get("window").width;
  const breakpoint = getCurrentBreakpoint(currentWidth);

  // Return the most specific value available
  if (breakpoint === "xl" && values.xl !== undefined) return values.xl;
  if (breakpoint === "lg" && values.lg !== undefined) return values.lg;
  if (breakpoint === "md" && values.md !== undefined) return values.md;
  if (breakpoint === "sm" && values.sm !== undefined) return values.sm;

  return values.base;
};

/**
 * Hook to get responsive value that updates on screen resize
 */
export const useResponsiveValue = (values) => {
  const { width } = useScreenDimensions();
  return getResponsiveValue(values, width);
};

/**
 * Scale size based on screen width (useful for consistent sizing across devices)
 */
export const scaleSize = (size, baseWidth = 375) => {
  const { width } = getScreenDimensions();
  return (width / baseWidth) * size;
};

/**
 * Hook to scale size based on screen width
 */
export const useScaledSize = (size, baseWidth = 375) => {
  const { width } = useScreenDimensions();
  return (width / baseWidth) * size;
};

/**
 * Check if device is a tablet
 */
export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = height / width;
  return Math.min(width, height) >= breakpoints.md && aspectRatio < 1.6;
};

/**
 * Hook to check if device is a tablet
 */
export const useIsTablet = () => {
  const { width, height } = useScreenDimensions();
  const aspectRatio = height / width;
  return Math.min(width, height) >= breakpoints.md && aspectRatio < 1.6;
};

/**
 * Get number of columns for grid layout based on screen size
 */
export const getGridColumns = (width) => {
  const currentWidth = width || Dimensions.get("window").width;
  if (currentWidth >= breakpoints.xl) return 4;
  if (currentWidth >= breakpoints.lg) return 3;
  if (currentWidth >= breakpoints.md) return 2;
  return 1;
};

/**
 * Hook to get number of columns for grid layout
 */
export const useGridColumns = () => {
  const { width } = useScreenDimensions();
  return getGridColumns(width);
};

/**
 * Check if platform is web
 */
export const isWeb = Platform.OS === "web";

/**
 * Check if platform is iOS
 */
export const isIOS = Platform.OS === "ios";

/**
 * Check if platform is Android
 */
export const isAndroid = Platform.OS === "android";
