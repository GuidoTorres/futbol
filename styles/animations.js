/**
 * Animation Utilities
 * Predefined animations and timing functions for consistent transitions
 */

import { Animated, Easing } from "react-native";

/**
 * Animation durations (in milliseconds)
 * Optimized for 60fps performance
 */
export const duration = {
  instant: 100,  // For immediate feedback
  fast: 150,     // For button presses and quick interactions
  normal: 200,   // For standard transitions
  medium: 300,   // For modal/screen transitions
  slow: 400,     // For complex animations (use sparingly)
};

/**
 * Easing functions
 */
export const easing = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  spring: Easing.elastic(1),
  bounce: Easing.bounce,
};

/**
 * Create a fade in animation
 */
export const fadeIn = (animatedValue, config = {}) => {
  const { duration: animDuration = duration.normal, easing: animEasing = easing.easeOut, useNativeDriver = true } = config;

  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: animDuration,
    easing: animEasing,
    useNativeDriver,
  });
};

/**
 * Create a fade out animation
 */
export const fadeOut = (animatedValue, config = {}) => {
  const { duration: animDuration = duration.normal, easing: animEasing = easing.easeIn, useNativeDriver = true } = config;

  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: animDuration,
    easing: animEasing,
    useNativeDriver,
  });
};

/**
 * Create a scale animation
 */
export const scale = (animatedValue, toValue, config = {}) => {
  const { duration: animDuration = duration.normal, easing: animEasing = easing.easeOut, useNativeDriver = true } = config;

  return Animated.timing(animatedValue, {
    toValue,
    duration: animDuration,
    easing: animEasing,
    useNativeDriver,
  });
};

/**
 * Create a slide animation
 */
export const slide = (animatedValue, toValue, config = {}) => {
  const { duration: animDuration = duration.normal, easing: animEasing = easing.easeOut, useNativeDriver = true } = config;

  return Animated.timing(animatedValue, {
    toValue,
    duration: animDuration,
    easing: animEasing,
    useNativeDriver,
  });
};

/**
 * Create a spring animation
 */
export const spring = (animatedValue, toValue, config = {}) => {
  const {
    tension = 40,
    friction = 7,
    useNativeDriver = true,
  } = config;

  return Animated.spring(animatedValue, {
    toValue,
    tension,
    friction,
    useNativeDriver,
  });
};

/**
 * Create a press animation (scale down and back)
 */
export const pressAnimation = (animatedValue, config = {}) => {
  const { scaleValue = 0.95, duration: animDuration = duration.fast } = config;

  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: scaleValue,
      duration: animDuration,
      easing: easing.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animDuration,
      easing: easing.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Create a pulse animation (scale up and down repeatedly)
 */
export const pulse = (animatedValue, config = {}) => {
  const { scaleValue = 1.05, duration: animDuration = duration.medium } = config;

  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: scaleValue,
        duration: animDuration,
        easing: easing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: animDuration,
        easing: easing.easeInOut,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Create a shake animation
 */
export const shake = (animatedValue, config = {}) => {
  const { distance = 10, duration: animDuration = duration.fast } = config;

  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: distance,
      duration: animDuration / 4,
      easing: easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -distance,
      duration: animDuration / 2,
      easing: easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: distance / 2,
      duration: animDuration / 4,
      easing: easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: animDuration / 4,
      easing: easing.linear,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Create a rotate animation
 */
export const rotate = (animatedValue, config = {}) => {
  const { duration: animDuration = duration.medium, easing: animEasing = easing.linear } = config;

  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animDuration,
      easing: animEasing,
      useNativeDriver: true,
    })
  );
};

/**
 * Interpolate rotation value (0 to 360 degrees)
 */
export const interpolateRotation = (animatedValue) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
};

/**
 * Create a stagger animation (animate multiple items with delay)
 */
export const stagger = (animations, delayBetween = 50) => {
  return Animated.stagger(delayBetween, animations);
};

/**
 * Create a parallel animation (animate multiple items simultaneously)
 */
export const parallel = (animations) => {
  return Animated.parallel(animations);
};

/**
 * Create a sequence animation (animate items one after another)
 */
export const sequence = (animations) => {
  return Animated.sequence(animations);
};

/**
 * Predefined animation configs for common use cases
 * Optimized for smooth 60fps performance
 */
export const animationPresets = {
  // Button press - Quick feedback for immediate response
  buttonPress: {
    scale: 0.95,
    opacity: 0.7,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Card press - Subtle feedback
  cardPress: {
    scale: 0.98,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Modal entrance - Smooth appearance
  modalEnter: {
    duration: duration.medium,
    easing: easing.easeOut,
  },

  // Modal exit - Quick dismissal
  modalExit: {
    duration: duration.normal,
    easing: easing.easeIn,
  },

  // Tab transition - Smooth switching
  tabTransition: {
    duration: duration.normal,
    easing: easing.easeInOut,
  },

  // Loading spinner - Consistent rotation
  spinner: {
    duration: 1000,
    easing: easing.linear,
  },

  // List item entrance - Staggered appearance
  listItemEnter: {
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Scroll reveal - Smooth reveal on scroll
  scrollReveal: {
    duration: duration.medium,
    easing: easing.easeOut,
  },
};

/**
 * Helper to create animated style for press effect
 */
export const createPressStyle = (scaleValue, opacityValue) => {
  return {
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
  };
};

/**
 * Helper to create animated style for slide effect
 */
export const createSlideStyle = (translateValue, direction = "x") => {
  return {
    transform: [
      direction === "x" ? { translateX: translateValue } : { translateY: translateValue },
    ],
  };
};

/**
 * Helper to create animated style for fade effect
 */
export const createFadeStyle = (opacityValue) => {
  return {
    opacity: opacityValue,
  };
};

export default {
  duration,
  easing,
  fadeIn,
  fadeOut,
  scale,
  slide,
  spring,
  pressAnimation,
  pulse,
  shake,
  rotate,
  interpolateRotation,
  stagger,
  parallel,
  sequence,
  animationPresets,
  createPressStyle,
  createSlideStyle,
  createFadeStyle,
};
