# Responsive Design Testing Guide

This guide outlines how to test the responsive design implementation across different screen sizes.

## Test Devices

### Small Phones (iPhone SE)

- **Screen Size**: 375 x 667 px
- **Breakpoint**: `sm` (375px)
- **Expected Behavior**:
  - Single column layouts
  - Compact spacing (base values)
  - Full-width cards
  - Smaller font sizes

### Large Phones (iPhone Pro Max)

- **Screen Size**: 428 x 926 px
- **Breakpoint**: `sm` (375px)
- **Expected Behavior**:
  - Single column layouts
  - Standard spacing
  - Full-width cards
  - Standard font sizes

### Tablets (iPad)

- **Screen Size**: 768 x 1024 px (portrait) / 1024 x 768 px (landscape)
- **Breakpoint**: `md` (768px) or `lg` (1024px)
- **Expected Behavior**:
  - Multi-column layouts (2-3 columns)
  - Increased spacing (xl values)
  - Grid layouts for cards
  - Optimized use of horizontal space

## Testing Checklist

### 1. Home Screen (Matches)

- [ ] Calendar scrolls horizontally on all devices
- [ ] Match cards display correctly
- [ ] Search functionality works
- [ ] Date picker modal displays properly
- [ ] Loading/empty/error states render correctly

### 2. Leagues Screen

- [ ] **Small phones**: Single column league cards
- [ ] **Tablets**: 2-column grid layout (md) or 3-column (lg)
- [ ] League cards maintain proper aspect ratio
- [ ] Top scorer section displays correctly
- [ ] Standings table is readable
- [ ] "View Full Table" button works

### 3. News Screen

- [ ] **Small phones**: Single column news cards
- [ ] **Tablets**: 2-column grid layout (md) or 3-column (lg)
- [ ] News images load properly
- [ ] Category filters scroll horizontally
- [ ] Pull-to-refresh works
- [ ] Empty state displays correctly

### 4. Favorites Screen

- [ ] **Small phones**: Single column favorite cards
- [ ] **Tablets**: 2-column grid layout (md) or 3-column (lg)
- [ ] Filter buttons display correctly
- [ ] Stats section is readable
- [ ] Remove button works on all cards
- [ ] Empty state displays correctly

### 5. Players Screen

- [ ] **Small phones**: Single column player cards
- [ ] **Tablets**: 2-3 column grid layout
- [ ] Player avatars display correctly
- [ ] Search input is accessible
- [ ] Filter panel opens properly

### 6. Predictions Screen

- [ ] Tabs display correctly on all devices
- [ ] Prediction cards are readable
- [ ] Charts render properly
- [ ] Confidence badges display correctly

### 7. Comparison Screen

- [ ] Side-by-side layout works on tablets
- [ ] Entity selectors are accessible
- [ ] Comparison charts render correctly
- [ ] Stats display properly

### 8. Search Screen

- [ ] Search input is prominent
- [ ] Results display in appropriate columns
- [ ] Recent searches display correctly
- [ ] Type filters work properly

## Testing Methods

### Method 1: Expo Go with Physical Devices

```bash
cd futbol-front
npm start
# Scan QR code with Expo Go app on different devices
```

### Method 2: iOS Simulator (macOS only)

```bash
# Start with iPhone SE
npx expo start --ios

# Change simulator:
# Hardware > Device > iOS [version] > iPhone SE (3rd generation)
# Hardware > Device > iOS [version] > iPhone 14 Pro Max
# Hardware > Device > iOS [version] > iPad Pro (12.9-inch)
```

### Method 3: Android Emulator

```bash
# Start with different AVDs
npx expo start --android

# Create AVDs with different screen sizes in Android Studio:
# - Pixel 3a (small phone)
# - Pixel 7 Pro (large phone)
# - Pixel Tablet
```

### Method 4: Web Browser (for quick testing)

```bash
npx expo start --web

# Use browser DevTools to test different screen sizes:
# - Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
# - Select different devices from dropdown
# - Or set custom dimensions
```

## Responsive Utilities Usage

The following utilities are available for responsive design:

### Hooks

```javascript
import {
  useScreenDimensions,
  useBreakpoint,
  useResponsiveValue,
  useIsTablet,
  useGridColumns,
} from '../../utils/responsive';

// Get current screen dimensions
const { width, height } = useScreenDimensions();

// Get current breakpoint ('xs', 'sm', 'md', 'lg', 'xl')
const breakpoint = useBreakpoint();

// Get responsive value based on breakpoint
const padding = useResponsiveValue({
  base: 16, // default
  md: 24, // tablets
  lg: 32, // large tablets
});

// Check if device is tablet
const isTablet = useIsTablet();

// Get number of columns for grid (1, 2, 3, or 4)
const numColumns = useGridColumns();
```

### Functions

```javascript
import {
  getScreenDimensions,
  getCurrentBreakpoint,
  getResponsiveValue,
  isTablet,
  getGridColumns,
} from '../../utils/responsive';

// Use these for non-hook contexts (StyleSheet, etc.)
```

## Common Issues and Solutions

### Issue: FlatList not updating columns

**Solution**: Use `key` prop with breakpoint to force re-render

```javascript
<FlatList
  numColumns={isTablet ? numColumns : 1}
  key={isTablet ? `grid-${numColumns}` : 'list'}
  // ...
/>
```

### Issue: Cards not sizing correctly in grid

**Solution**: Use wrapper View with responsive width

```javascript
<View
  style={[
    styles.cardWrapper,
    isTablet && { width: numColumns === 2 ? '48%' : '31%' },
  ]}
>
  <Card />
</View>
```

### Issue: Spacing inconsistent across devices

**Solution**: Use responsive values from theme

```javascript
const containerPadding = useResponsiveValue({
  base: spacing.base,
  md: spacing.xl,
});
```

## Verification Steps

1. **Visual Inspection**

   - Check alignment and spacing
   - Verify text is readable
   - Ensure images load properly
   - Confirm buttons are accessible (44x44 minimum)

2. **Interaction Testing**

   - Tap all buttons and links
   - Test scroll behavior
   - Verify navigation works
   - Check pull-to-refresh

3. **Orientation Testing**

   - Rotate device/simulator
   - Verify layout adapts
   - Check that content remains accessible

4. **Performance Testing**
   - Monitor frame rate (should be 60fps)
   - Check for layout shifts
   - Verify smooth animations

## Success Criteria

- ✅ All screens display correctly on small phones (375px)
- ✅ All screens display correctly on large phones (428px)
- ✅ All screens adapt to tablet layouts (768px+)
- ✅ Multi-column grids work on tablets
- ✅ Spacing scales appropriately
- ✅ All interactive elements are accessible
- ✅ No layout breaks or overlaps
- ✅ Smooth transitions between breakpoints

## Notes

- The responsive system uses a mobile-first approach (base values for mobile)
- Breakpoints are defined in `utils/responsive.js`
- Theme values are in `styles/theme.js`
- All measurements use logical pixels (not physical pixels)
