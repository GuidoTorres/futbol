# Performance Optimization Guide

## Overview

This document outlines performance optimization strategies implemented in the app to ensure smooth operation across all devices, including lower-end hardware.

## Key Performance Metrics

### Target Performance

- **Frame Rate**: 60 FPS for animations and scrolling
- **Time to Interactive**: < 3 seconds
- **Image Load Time**: < 1 second
- **API Response Handling**: < 500ms to show loading state

## Optimization Strategies

### 1. Image Optimization

#### Lazy Loading

Images are loaded on-demand with placeholders:

```javascript
// TeamLogo and PlayerAvatar components
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

<Image
  source={{ uri }}
  onLoadStart={() => setLoading(true)}
  onLoadEnd={() => setLoading(false)}
  onError={() => setError(true)}
/>;
```

#### Image Caching

React Native automatically caches images, but we can optimize:

```javascript
// Use appropriate image sizes
const getImageSize = (size) => {
  switch (size) {
    case 'sm':
      return 32;
    case 'md':
      return 48;
    case 'lg':
      return 64;
    case 'xl':
      return 80;
  }
};

// Request appropriately sized images from API
const imageUrl = `${baseUrl}/image?size=${getImageSize(size)}`;
```

#### Fallback Strategy

Always provide fallbacks to avoid broken images:

```javascript
// TeamLogo fallback
if (error || !uri) {
  return <Shield size={size} color={colors.text.tertiary} />;
}

// PlayerAvatar fallback
if (error || !uri) {
  return initials ? (
    <Text>{initials}</Text>
  ) : (
    <User size={size} color={colors.text.tertiary} />
  );
}
```

### 2. List Optimization

#### Use FlatList for Long Lists

FlatList provides built-in virtualization:

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  // Performance optimizations
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

#### Memoize List Items

Prevent unnecessary re-renders:

```javascript
const MemoizedMatchCard = React.memo(MatchCard, (prevProps, nextProps) => {
  return (
    prevProps.match.id === nextProps.match.id &&
    prevProps.match.status === nextProps.match.status
  );
});
```

### 3. Component Optimization

#### Use React.memo

Memoize components that don't need frequent updates:

```javascript
const TeamLogo = React.memo(
  ({ uri, size, teamName }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    return prevProps.uri === nextProps.uri && prevProps.size === nextProps.size;
  }
);

export default TeamLogo;
```

#### Optimize Re-renders

Use useCallback and useMemo:

```javascript
// Memoize callbacks
const handlePress = useCallback(() => {
  router.push(`/match/${match.id}`);
}, [match.id, router]);

// Memoize computed values
const formattedDate = useMemo(() => {
  return formatDate(match.date);
}, [match.date]);
```

### 4. State Management

#### Avoid Unnecessary State Updates

Only update state when values actually change:

```javascript
// Bad
setData(newData);

// Good
if (JSON.stringify(data) !== JSON.stringify(newData)) {
  setData(newData);
}
```

#### Batch State Updates

Group related state updates:

```javascript
// Use a single state object for related data
const [matchState, setMatchState] = useState({
  loading: true,
  error: null,
  data: null,
});

// Update all at once
setMatchState({
  loading: false,
  error: null,
  data: matches,
});
```

### 5. Animation Performance

#### Use Native Driver

Always use native driver for transform and opacity:

```javascript
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true, // ✓ Essential for performance
}).start();
```

#### Avoid Layout Animations

Don't animate width, height, padding, or margin:

```javascript
// Bad - causes layout recalculation
Animated.timing(width, {
  toValue: 200,
  useNativeDriver: false,
}).start();

// Good - uses transform
Animated.timing(scaleX, {
  toValue: 1,
  useNativeDriver: true,
}).start();
```

### 6. Network Optimization

#### Request Debouncing

Debounce search and filter requests:

```javascript
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
    }
  }, 300); // Wait 300ms after user stops typing

  return () => clearTimeout(debounceTimer);
}, [searchQuery]);
```

#### Request Cancellation

Cancel pending requests when component unmounts:

```javascript
useEffect(() => {
  const abortController = new AbortController();

  fetch(url, { signal: abortController.signal })
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    });

  return () => abortController.abort();
}, [url]);
```

#### Caching Strategy

Implement simple caching for frequently accessed data:

```javascript
const cache = new Map();

const fetchWithCache = async (key, fetcher) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetcher();
  cache.set(key, data);

  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);

  return data;
};
```

### 7. Bundle Size Optimization

#### Code Splitting

Split code by routes (already done with Expo Router):

```javascript
// Each route is automatically code-split
app / tabs / index.jsx; // Loaded only when needed
leagues.jsx; // Loaded only when needed
```

#### Tree Shaking

Import only what you need:

```javascript
// Bad
import * as Icons from 'lucide-react-native';

// Good
import { Heart, Search, Calendar } from 'lucide-react-native';
```

### 8. Memory Management

#### Clean Up Subscriptions

Always clean up event listeners and subscriptions:

```javascript
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);

  return () => {
    subscription.remove();
  };
}, []);
```

#### Avoid Memory Leaks

Don't update state after unmount:

```javascript
useEffect(() => {
  let isMounted = true;

  fetchData().then((data) => {
    if (isMounted) {
      setData(data);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);
```

## Performance Testing

### Development Tools

#### React DevTools Profiler

1. Install React DevTools
2. Open Profiler tab
3. Record interaction
4. Analyze render times

#### Performance Monitor

```javascript
// Enable in development
import { enableScreens } from 'react-native-screens';
enableScreens();

// Show performance overlay
// Shake device > Show Perf Monitor
```

### Testing Checklist

- [ ] Test on low-end device (e.g., iPhone 8, Android mid-range)
- [ ] Monitor FPS during animations
- [ ] Check memory usage over time
- [ ] Test with slow network (3G simulation)
- [ ] Verify image loading performance
- [ ] Test list scrolling with 100+ items
- [ ] Check app startup time
- [ ] Monitor bundle size

### Performance Benchmarks

#### Acceptable Performance Targets

| Metric              | Target  | Acceptable |
| ------------------- | ------- | ---------- |
| FPS (animations)    | 60      | 55+        |
| Time to Interactive | < 2s    | < 3s       |
| Image Load          | < 500ms | < 1s       |
| List Scroll         | 60 FPS  | 55+ FPS    |
| Memory Usage        | < 150MB | < 200MB    |
| Bundle Size         | < 5MB   | < 10MB     |

## Common Performance Issues

### Issue: Slow List Scrolling

**Symptoms:**

- Janky scrolling
- Low FPS
- Delayed rendering

**Solutions:**

1. Use FlatList instead of ScrollView
2. Implement getItemLayout
3. Reduce initialNumToRender
4. Memoize list items
5. Use removeClippedSubviews

### Issue: Slow Image Loading

**Symptoms:**

- Long loading times
- Blank spaces
- Poor user experience

**Solutions:**

1. Implement progressive loading
2. Use appropriate image sizes
3. Add loading placeholders
4. Implement image caching
5. Use CDN for images

### Issue: Slow Navigation

**Symptoms:**

- Delay when switching screens
- Blank screen during transition
- Poor responsiveness

**Solutions:**

1. Preload next screen data
2. Use InteractionManager
3. Optimize component mounting
4. Reduce initial render complexity
5. Use React.lazy for heavy components

### Issue: High Memory Usage

**Symptoms:**

- App crashes
- Slow performance over time
- Device heating

**Solutions:**

1. Clean up subscriptions
2. Avoid memory leaks
3. Limit cached data
4. Optimize image sizes
5. Use pagination for large lists

## Monitoring and Profiling

### Production Monitoring

Consider implementing:

- Performance monitoring (e.g., Firebase Performance)
- Crash reporting (e.g., Sentry)
- Analytics for user flows
- Network request monitoring

### Regular Audits

Schedule regular performance audits:

- Weekly: Check bundle size
- Monthly: Profile on real devices
- Quarterly: Full performance review
- Before releases: Complete performance testing

## Best Practices Summary

1. **Images**: Lazy load, cache, provide fallbacks
2. **Lists**: Use FlatList, memoize items, implement virtualization
3. **Components**: Use React.memo, useCallback, useMemo
4. **Animations**: Use native driver, avoid layout animations
5. **Network**: Debounce requests, implement caching
6. **Memory**: Clean up subscriptions, avoid leaks
7. **Testing**: Test on real devices, monitor metrics

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Optimizing Flatlist](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Profiling React Native](https://reactnative.dev/docs/profiling)
- [Memory Profiling](https://reactnative.dev/docs/ram-bundles-inline-requires)
