# Accessibility Guidelines

## Overview

This document outlines the accessibility standards and best practices implemented in the app to ensure it's usable by everyone, including people with disabilities.

## WCAG 2.1 Compliance

We aim for WCAG 2.1 Level AA compliance across the app.

## Key Accessibility Features

### 1. Touch Target Sizes

**Minimum Size: 44x44 points**

All interactive elements (buttons, links, inputs) must meet the minimum touch target size of 44x44 points.

```javascript
// ✓ Good
const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    padding: 8,
  },
});

// ✗ Bad
const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
  },
});
```

### 2. Color Contrast

**Minimum Ratios:**

- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Our Color Palette:**

- Primary (#00ff87) on dark background: ✓ Passes
- White (#ffffff) on dark background: ✓ Passes
- Secondary text (#cccccc) on dark background: ✓ Passes
- Tertiary text (#999999) on dark background: ⚠ Use for non-essential text only

### 3. Accessibility Labels

All interactive elements and images must have descriptive accessibility labels.

```javascript
// Buttons
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Add to favorites"
  accessibilityHint="Double tap to add this team to your favorites"
>
  <Heart />
</TouchableOpacity>

// Images
<Image
  source={{ uri }}
  accessible={true}
  accessibilityRole="image"
  accessibilityLabel="Real Madrid team logo"
/>

// Text Inputs
<TextInput
  accessible={true}
  accessibilityLabel="Search for teams, players, or leagues"
  accessibilityHint="Enter text to search"
/>
```

### 4. Accessibility Roles

Define semantic roles for all interactive elements:

- `button`: Buttons and pressable elements
- `link`: Navigation links
- `search`: Search inputs
- `image`: Images and icons
- `text`: Static text
- `header`: Section headers
- `adjustable`: Sliders and pickers

```javascript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="View match details"
>
  <MatchCard match={match} />
</TouchableOpacity>
```

### 5. Accessibility States

Communicate element states to screen readers:

```javascript
<Button
  disabled={isLoading}
  accessibilityState={{
    disabled: isLoading,
    busy: isLoading,
  }}
>
  Submit
</Button>

<TouchableOpacity
  accessibilityState={{
    selected: isActive,
    checked: isChecked,
  }}
>
  <Tab />
</TouchableOpacity>
```

### 6. Screen Reader Support

#### VoiceOver (iOS) and TalkBack (Android)

Test all screens with screen readers enabled:

**iOS:**

1. Settings > Accessibility > VoiceOver
2. Triple-click home button to toggle

**Android:**

1. Settings > Accessibility > TalkBack
2. Volume keys to toggle

#### Best Practices:

- Group related elements with `accessible={true}` on parent
- Use `accessibilityLabel` for custom descriptions
- Hide decorative elements with `accessible={false}`
- Provide context with `accessibilityHint`

```javascript
// Group related content
<View accessible={true} accessibilityLabel="Match score: Real Madrid 2, Barcelona 1">
  <Text>Real Madrid</Text>
  <Text>2 - 1</Text>
  <Text>Barcelona</Text>
</View>

// Hide decorative elements
<View accessible={false}>
  <Divider />
</View>
```

### 7. Focus Management

Ensure logical focus order and visible focus indicators:

```javascript
// Set focus order with importantForAccessibility
<View importantForAccessibility="yes">
  <Text>Important content</Text>
</View>

<View importantForAccessibility="no-hide-descendants">
  <Text>Hidden from screen readers</Text>
</View>
```

### 8. Dynamic Content

Announce dynamic content changes to screen readers:

```javascript
import { AccessibilityInfo } from 'react-native';

// Announce updates
AccessibilityInfo.announceForAccessibility('Match score updated');

// Check if screen reader is enabled
const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);

  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    setScreenReaderEnabled
  );

  return () => subscription.remove();
}, []);
```

## Component Accessibility Checklist

### Button Component

- [x] Minimum 44x44 touch target
- [x] accessibilityRole="button"
- [x] accessibilityLabel describing action
- [x] accessibilityState for disabled
- [x] Visual focus indicator
- [x] Sufficient color contrast

### Input Component

- [x] Minimum 44x44 touch target
- [x] accessibilityLabel for purpose
- [x] accessibilityHint for instructions
- [x] accessibilityState for disabled
- [x] Error messages announced
- [x] Clear button accessible

### Card Component

- [x] Minimum 44x44 touch target (when pressable)
- [x] accessibilityRole="button" (when pressable)
- [x] accessibilityLabel describing content
- [x] Grouped content with single label

### Image Components

- [x] accessibilityRole="image"
- [x] accessibilityLabel describing image
- [x] Fallback for failed loads
- [x] Loading state communicated

## Testing Checklist

### Manual Testing

- [ ] Navigate entire app using screen reader
- [ ] Verify all interactive elements are reachable
- [ ] Check all labels are descriptive and clear
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify focus order is logical
- [ ] Check color contrast with tools
- [ ] Test with large text sizes
- [ ] Verify touch targets are adequate
- [ ] Test with reduced motion enabled

### Automated Testing

```javascript
// Example accessibility test
import { render } from '@testing-library/react-native';

test('Button has accessibility label', () => {
  const { getByLabelText } = render(<Button onPress={() => {}}>Submit</Button>);

  expect(getByLabelText('Submit')).toBeTruthy();
});

test('Button has correct role', () => {
  const { getByRole } = render(<Button onPress={() => {}}>Submit</Button>);

  expect(getByRole('button')).toBeTruthy();
});
```

## Common Issues and Solutions

### Issue: Element not announced by screen reader

**Solution:**

- Add `accessible={true}`
- Add `accessibilityLabel`
- Check if parent has `accessible={false}`

### Issue: Wrong reading order

**Solution:**

- Restructure component hierarchy
- Use `importantForAccessibility`
- Group related elements

### Issue: Button too small to tap

**Solution:**

- Add `minWidth: 44` and `minHeight: 44`
- Increase padding
- Use hitSlop for small visual elements

### Issue: Low color contrast

**Solution:**

- Use theme colors that meet WCAG standards
- Test with contrast checker tools
- Provide alternative visual indicators

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Accessibility Statement

We are committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

If you encounter any accessibility barriers, please contact us with details so we can address them promptly.
