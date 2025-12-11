# Animation Optimization Guide

## Overview

This document outlines the animation optimization strategies implemented in the app to ensure smooth 60fps performance across all devices.

## Key Principles

### 1. Use Native Driver

Always use `useNativeDriver: true` for animations that only affect:

- `transform` properties (scale, rotate, translate)
- `opacity`

**DO:**

```javascript
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true, // ✓ Good
}).start();
```

**DON'T:**

```javascript
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 200,
  useNativeDriver: false, // ✗ Avoid unless necessary
}).start();
```

### 2. Optimal Animation Durations

Use appropriate durations for different interaction types:

- **Instant (100ms)**: Immediate feedback (rare)
- **Fast (150ms)**: Button presses, quick interactions
- **Normal (200ms)**: Standard transitions, tab switches
- **Medium (300ms)**: Modal/screen transitions
- **Slow (400ms)**: Complex animations (use sparingly)

### 3. Avoid Layout Animations

Layout animations (width, height, padding, margin) are expensive and can cause jank.

**DO:**

```javascript
// Use transform instead of changing width/height
transform: [{ scaleX: animatedValue }];
```

**DON'T:**

```javascript
// Avoid animating layout properties
width: animatedValue;
```

### 4. Minimize Simultaneous Animations

Limit the number of animations running at the same time:

- Maximum 3-4 simultaneous animations on screen
- Use `Animated.stagger()` for list animations
- Avoid animating large lists all at once

### 5. Optimize Easing Functions

Choose appropriate easing for the animation type:

- **easeOut**: For entrances and user-initiated actions
- **easeIn**: For exits and dismissals
- **easeInOut**: For continuous transitions
- **linear**: For loading spinners and continuous animations

## Animation Checklist

### Button Press Animation

```javascript
✓ Duration: 150ms (fast)
✓ Scale: 0.95
✓ Opacity: 0.7
✓ Easing: easeOut
✓ useNativeDriver: true
```

### Card Press Animation

```javascript
✓ Duration: 150ms (fast)
✓ Scale: 0.98
✓ Easing: easeOut
✓ useNativeDriver: true
```

### Modal Transitions

```javascript
✓ Enter Duration: 300ms (medium)
✓ Exit Duration: 200ms (normal)
✓ Easing: easeOut (enter), easeIn (exit)
✓ useNativeDriver: true
```

### Tab Transitions

```javascript
✓ Duration: 200ms (normal)
✓ Easing: easeInOut
✓ useNativeDriver: true
```

## Performance Testing

### Testing on Lower-End Devices

1. **Enable Performance Monitor**

   - In development, shake device and enable "Show Perf Monitor"
   - Target: 60fps for all animations
   - Acceptable: 55-60fps on lower-end devices

2. **Test Scenarios**

   - Rapid button presses
   - Quick tab switching
   - Scrolling with animations
   - Multiple cards animating simultaneously

3. **Optimization Strategies**
   - Reduce animation duration if fps drops below 55
   - Simplify animations (remove unnecessary transforms)
   - Use `shouldRasterizeIOS` for complex views
   - Implement `removeClippedSubviews` for long lists

## Common Issues and Solutions

### Issue: Janky Animations

**Causes:**

- Too many simultaneous animations
- Animating layout properties
- Not using native driver
- Complex component re-renders during animation

**Solutions:**

- Reduce number of simultaneous animations
- Use transform instead of layout properties
- Enable native driver
- Use `React.memo()` for animated components

### Issue: Slow Animation Start

**Causes:**

- Heavy computation before animation
- Large component tree re-render
- Synchronous operations blocking animation

**Solutions:**

- Move heavy computation to `useEffect` or background
- Optimize component tree with `React.memo()`
- Use `InteractionManager.runAfterInteractions()`

### Issue: Animation Stuttering

**Causes:**

- Animating non-native properties
- Too long animation duration
- Complex easing functions

**Solutions:**

- Only animate transform and opacity
- Reduce duration to 150-300ms
- Use simple easing (easeOut, easeIn)

## Best Practices

1. **Keep It Simple**: Fewer animations = better performance
2. **Test on Real Devices**: Simulators don't reflect real performance
3. **Profile Regularly**: Use React DevTools Profiler
4. **Measure FPS**: Monitor frame rate during animations
5. **Progressive Enhancement**: Add animations only where they add value

## Animation Audit

Run this checklist periodically:

- [ ] All animations use `useNativeDriver: true` (where possible)
- [ ] Animation durations are 100-300ms (avoid 400ms+)
- [ ] No more than 3-4 simultaneous animations
- [ ] No layout property animations (width, height, etc.)
- [ ] Appropriate easing functions used
- [ ] Animations tested on lower-end devices
- [ ] FPS stays above 55 during animations
- [ ] No unnecessary animations (remove if no value added)

## Resources

- [React Native Animation Performance](https://reactnative.dev/docs/performance#using-nativedriver)
- [Animated API Documentation](https://reactnative.dev/docs/animated)
- [Performance Optimization](https://reactnative.dev/docs/performance)
