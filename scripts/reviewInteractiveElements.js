/**
 * Interactive Elements Review Script
 * This script verifies that all interactive elements in the app work correctly
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

// Check if a file contains specific patterns
function checkFileForPatterns(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    patterns.forEach(({ name, pattern, required = true }) => {
      const found = pattern.test(content);
      results[name] = { found, required };
    });
    
    return results;
  } catch (error) {
    return null;
  }
}

// Review UI Components
function reviewUIComponents() {
  log.info('\n=== Reviewing UI Components ===\n');
  
  const components = [
    {
      name: 'Button',
      path: 'components/ui/Button.jsx',
      checks: [
        { name: 'onPress handler', pattern: /onPress\s*=\s*{onPress}/, required: true },
        { name: 'Press animations', pattern: /Animated\.(timing|spring)/, required: true },
        { name: 'Disabled state', pattern: /disabled\s*=/, required: true },
        { name: 'Loading state', pattern: /loading\s*=/, required: true },
        { name: 'Accessibility', pattern: /accessibilityRole/, required: true },
        { name: 'Min touch target', pattern: /minHeight:\s*44/, required: true },
      ],
    },
    {
      name: 'Input',
      path: 'components/ui/Input.jsx',
      checks: [
        { name: 'onChangeText handler', pattern: /onChangeText\s*=/, required: true },
        { name: 'Focus state', pattern: /onFocus|isFocused/, required: true },
        { name: 'Clear button', pattern: /clearable/, required: true },
        { name: 'Error state', pattern: /error\s*=/, required: true },
        { name: 'Accessibility', pattern: /accessibilityLabel/, required: true },
      ],
    },
    {
      name: 'Card',
      path: 'components/ui/Card.jsx',
      checks: [
        { name: 'Pressable support', pattern: /pressable|onPress/, required: true },
        { name: 'Press animations', pattern: /Animated/, required: true },
        { name: 'Accessibility', pattern: /accessibilityRole/, required: true },
      ],
    },
  ];
  
  components.forEach(({ name, path: componentPath, checks }) => {
    const fullPath = path.join(__dirname, '..', componentPath);
    const results = checkFileForPatterns(fullPath, checks);
    
    if (!results) {
      log.error(`${name}: File not found`);
      return;
    }
    
    let allPassed = true;
    checks.forEach(({ name: checkName, required }) => {
      const result = results[checkName];
      if (result.found) {
        log.success(`${name}: ${checkName}`);
      } else if (required) {
        log.error(`${name}: ${checkName} - MISSING`);
        allPassed = false;
      } else {
        log.warning(`${name}: ${checkName} - Optional, not found`);
      }
    });
    
    if (allPassed) {
      log.success(`${name}: All checks passed\n`);
    } else {
      log.error(`${name}: Some checks failed\n`);
    }
  });
}

// Review Navigation Links
function reviewNavigationLinks() {
  log.info('\n=== Reviewing Navigation Links ===\n');
  
  const screens = [
    {
      name: 'Home (Matches)',
      path: 'app/(tabs)/index.jsx',
      checks: [
        { name: 'Match detail navigation', pattern: /router\.push\(['"`]\/match\//, required: true },
        { name: 'Search navigation', pattern: /router\.push\(['"`]\/player\/|router\.push\(['"`]\/team\//, required: true },
      ],
    },
    {
      name: 'MatchCard',
      path: 'components/MatchCard.jsx',
      checks: [
        { name: 'Match detail navigation', pattern: /router\.push\(['"`]\/match\//, required: true },
        { name: 'onPress handler', pattern: /onPress\s*=/, required: true },
      ],
    },
    {
      name: 'Leagues',
      path: 'app/(tabs)/leagues.jsx',
      checks: [
        { name: 'League detail navigation', pattern: /router\.push\(['"`]\/league\//, required: true },
        { name: 'Player detail navigation', pattern: /router\.push\(['"`]\/player\//, required: true },
        { name: 'Team detail navigation', pattern: /router\.push\(['"`]\/team\//, required: true },
      ],
    },
  ];
  
  screens.forEach(({ name, path: screenPath, checks }) => {
    const fullPath = path.join(__dirname, '..', screenPath);
    const results = checkFileForPatterns(fullPath, checks);
    
    if (!results) {
      log.error(`${name}: File not found`);
      return;
    }
    
    let allPassed = true;
    checks.forEach(({ name: checkName, required }) => {
      const result = results[checkName];
      if (result.found) {
        log.success(`${name}: ${checkName}`);
      } else if (required) {
        log.error(`${name}: ${checkName} - MISSING`);
        allPassed = false;
      } else {
        log.warning(`${name}: ${checkName} - Optional, not found`);
      }
    });
    
    if (allPassed) {
      log.success(`${name}: All navigation links verified\n`);
    } else {
      log.error(`${name}: Some navigation links missing\n`);
    }
  });
}

// Review Press Animations
function reviewPressAnimations() {
  log.info('\n=== Reviewing Press Animations ===\n');
  
  const components = [
    'components/ui/Button.jsx',
    'components/ui/Card.jsx',
    'components/MatchCard.jsx',
  ];
  
  components.forEach((componentPath) => {
    const fullPath = path.join(__dirname, '..', componentPath);
    const results = checkFileForPatterns(fullPath, [
      { name: 'Animated.Value', pattern: /new Animated\.Value/, required: true },
      { name: 'onPressIn', pattern: /onPressIn/, required: true },
      { name: 'onPressOut', pattern: /onPressOut/, required: true },
      { name: 'Animated.timing', pattern: /Animated\.timing/, required: true },
      { name: 'useNativeDriver', pattern: /useNativeDriver:\s*true/, required: true },
    ]);
    
    if (!results) {
      log.error(`${componentPath}: File not found`);
      return;
    }
    
    const allFound = Object.values(results).every(r => r.found);
    if (allFound) {
      log.success(`${componentPath}: Press animations implemented correctly`);
    } else {
      log.warning(`${componentPath}: Some animation features missing`);
    }
  });
}

// Review Forms and Inputs
function reviewFormsAndInputs() {
  log.info('\n=== Reviewing Forms and Inputs ===\n');
  
  const screens = [
    {
      name: 'Home Search',
      path: 'app/(tabs)/index.jsx',
      checks: [
        { name: 'Input component', pattern: /<Input/, required: true },
        { name: 'Search query state', pattern: /searchQuery/, required: true },
        { name: 'onChangeText handler', pattern: /onChangeText/, required: true },
        { name: 'Clear functionality', pattern: /clearable/, required: true },
      ],
    },
    {
      name: 'Search Screen',
      path: 'app/(tabs)/search.jsx',
      checks: [
        { name: 'Input component', pattern: /<Input/, required: true },
        { name: 'Search functionality', pattern: /searchQuery|onChangeText/, required: true },
      ],
    },
  ];
  
  screens.forEach(({ name, path: screenPath, checks }) => {
    const fullPath = path.join(__dirname, '..', screenPath);
    const results = checkFileForPatterns(fullPath, checks);
    
    if (!results) {
      log.error(`${name}: File not found`);
      return;
    }
    
    let allPassed = true;
    checks.forEach(({ name: checkName, required }) => {
      const result = results[checkName];
      if (result.found) {
        log.success(`${name}: ${checkName}`);
      } else if (required) {
        log.error(`${name}: ${checkName} - MISSING`);
        allPassed = false;
      } else {
        log.warning(`${name}: ${checkName} - Optional, not found`);
      }
    });
    
    if (allPassed) {
      log.success(`${name}: All form checks passed\n`);
    } else {
      log.error(`${name}: Some form checks failed\n`);
    }
  });
}

// Main execution
function main() {
  console.log('\n' + '='.repeat(60));
  console.log('Interactive Elements Review');
  console.log('='.repeat(60));
  
  reviewUIComponents();
  reviewNavigationLinks();
  reviewPressAnimations();
  reviewFormsAndInputs();
  
  console.log('\n' + '='.repeat(60));
  log.info('Review Complete');
  console.log('='.repeat(60) + '\n');
}

main();
