/**
 * Navigation Loading Bar
 * Shows a loading indicator at the top of the screen during navigation
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { colors } from '../styles/theme';

export default function NavigationLoadingBar() {
  const pathname = usePathname();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start loading animation
    opacityAnim.setValue(1);
    progressAnim.setValue(0);

    const animation = Animated.sequence([
      // Quick progress to 70%
      Animated.timing(progressAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: false,
      }),
      // Slow progress to 90%
      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: false,
      }),
    ]);

    animation.start();

    // Complete animation after route change
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          delay: 100,
          useNativeDriver: false,
        }),
      ]).start(() => {
        progressAnim.setValue(0);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [pathname]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.bar, { width }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 9999,
    backgroundColor: 'transparent',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
