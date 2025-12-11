/**
 * Final Testing Script
 * Comprehensive checks for all app features
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n`),
};

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  return fs.existsSync(fullPath);
}

function checkFileForPattern(filePath, pattern) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return pattern.test(content);
  } catch (error) {
    return false;
  }
}

// Test 1: Verify all screens exist
function testScreensExist() {
  log.section('1. Testing Screen Files');

  const screens = [
    'app/(tabs)/index.jsx',
    'app/(tabs)/leagues.jsx',
    'app/(tabs)/predictions.jsx',
    'app/(tabs)/favorites.jsx',
    'app/(tabs)/comparison.jsx',
    'app/(tabs)/news.jsx',
    'app/(tabs)/players.jsx',
    'app/(tabs)/search.jsx',
    'app/match/[id].jsx',
    'app/team/[id].jsx',
    'app/player/[id].jsx',
    'app/league/[id].jsx',
  ];

  let passed = 0;
  screens.forEach(screen => {
    if (checkFileExists(screen)) {
      log.success(`${screen} exists`);
      passed++;
    } else {
      log.error(`${screen} missing`);
    }
  });

  return { passed, total: screens.length };
}

// Test 2: Verify error handling
function testErrorHandling() {
  log.section('2. Testing Error Handling');

  const checks = [
    {
      name: 'Home screen has ErrorState',
      file: 'app/(tabs)/index.jsx',
      pattern: /<ErrorState/,
    },
    {
      name: 'Leagues screen has ErrorState',
      file: 'app/(tabs)/leagues.jsx',
      pattern: /<ErrorState/,
    },
    {
      name: 'Predictions screen has error handling',
      file: 'app/(tabs)/predictions.jsx',
      pattern: /error|ErrorState/,
    },
    {
      name: 'ErrorState component exists',
      file: 'components/ui/ErrorState.jsx',
      pattern: /export default/,
    },
  ];

  let passed = 0;
  checks.forEach(({ name, file, pattern }) => {
    if (checkFileForPattern(file, pattern)) {
      log.success(name);
      passed++;
    } else {
      log.warning(`${name} - not found`);
    }
  });

  return { passed, total: checks.length };
}

// Test 3: Verify pull-to-refresh
function testPullToRefresh() {
  log.section('3. Testing Pull-to-Refresh');

  const screens = [
    { name: 'Home (Matches)', file: 'app/(tabs)/index.jsx' },
    { name: 'Leagues', file: 'app/(tabs)/leagues.jsx' },
    { name: 'Predictions', file: 'app/(tabs)/predictions.jsx' },
    { name: 'Favorites', file: 'app/(tabs)/favorites.jsx' },
    { name: 'News', file: 'app/(tabs)/news.jsx' },
    { name: 'Players', file: 'app/(tabs)/players.jsx' },
  ];

  let passed = 0;
  screens.forEach(({ name, file }) => {
    const hasRefreshControl = checkFileForPattern(file, /RefreshControl/);
    const hasOnRefresh = checkFileForPattern(file, /onRefresh/);
    
    if (hasRefreshControl && hasOnRefresh) {
      log.success(`${name} has pull-to-refresh`);
      passed++;
    } else {
      log.warning(`${name} missing pull-to-refresh`);
    }
  });

  return { passed, total: screens.length };
}

// Test 4: Verify loading states
function testLoadingStates() {
  log.section('4. Testing Loading States');

  const checks = [
    {
      name: 'LoadingState component exists',
      file: 'components/ui/LoadingState.jsx',
      pattern: /export default/,
    },
    {
      name: 'Home uses LoadingState',
      file: 'app/(tabs)/index.jsx',
      pattern: /<LoadingState/,
    },
    {
      name: 'Leagues uses loading indicator',
      file: 'app/(tabs)/leagues.jsx',
      pattern: /loading|LoadingState/,
    },
    {
      name: 'Match detail has loading state',
      file: 'app/match/[id].jsx',
      pattern: /loading|LoadingState/,
    },
  ];

  let passed = 0;
  checks.forEach(({ name, file, pattern }) => {
    if (checkFileForPattern(file, pattern)) {
      log.success(name);
      passed++;
    } else {
      log.warning(`${name} - not found`);
    }
  });

  return { passed, total: checks.length };
}

// Test 5: Verify empty states
function testEmptyStates() {
  log.section('5. Testing Empty States');

  const checks = [
    {
      name: 'EmptyState component exists',
      file: 'components/ui/EmptyState.jsx',
      pattern: /export default/,
    },
    {
      name: 'Home uses EmptyState',
      file: 'app/(tabs)/index.jsx',
      pattern: /<EmptyState/,
    },
    {
      name: 'Favorites has EmptyState',
      file: 'app/(tabs)/favorites.jsx',
      pattern: /<EmptyState/,
    },
    {
      name: 'Search has empty state handling',
      file: 'app/(tabs)/search.jsx',
      pattern: /EmptyState|empty/,
    },
  ];

  let passed = 0;
  checks.forEach(({ name, file, pattern }) => {
    if (checkFileForPattern(file, pattern)) {
      log.success(name);
      passed++;
    } else {
      log.warning(`${name} - not found`);
    }
  });

  return { passed, total: checks.length };
}

// Test 6: Verify UI components
function testUIComponents() {
  log.section('6. Testing UI Components');

  const components = [
    'components/ui/Button.jsx',
    'components/ui/Card.jsx',
    'components/ui/Badge.jsx',
    'components/ui/Input.jsx',
    'components/ui/LoadingState.jsx',
    'components/ui/EmptyState.jsx',
    'components/ui/ErrorState.jsx',
  ];

  let passed = 0;
  components.forEach(component => {
    if (checkFileExists(component)) {
      log.success(`${component} exists`);
      passed++;
    } else {
      log.error(`${component} missing`);
    }
  });

  return { passed, total: components.length };
}

// Test 7: Verify shared components
function testSharedComponents() {
  log.section('7. Testing Shared Components');

  const components = [
    'components/TeamLogo.jsx',
    'components/PlayerAvatar.jsx',
    'components/MatchCard.jsx',
    'components/StatCard.jsx',
    'components/FavoriteButton.jsx',
  ];

  let passed = 0;
  components.forEach(component => {
    if (checkFileExists(component)) {
      log.success(`${component} exists`);
      passed++;
    } else {
      log.error(`${component} missing`);
    }
  });

  return { passed, total: components.length };
}

// Test 8: Verify theme and styles
function testThemeAndStyles() {
  log.section('8. Testing Theme and Styles');

  const files = [
    { name: 'Theme configuration', file: 'styles/theme.js' },
    { name: 'Animation utilities', file: 'styles/animations.js' },
    { name: 'Responsive utilities', file: 'utils/responsive.js' },
  ];

  let passed = 0;
  files.forEach(({ name, file }) => {
    if (checkFileExists(file)) {
      log.success(`${name} exists`);
      passed++;
    } else {
      log.error(`${name} missing`);
    }
  });

  return { passed, total: files.length };
}

// Test 9: Verify navigation
function testNavigation() {
  log.section('9. Testing Navigation');

  const checks = [
    {
      name: 'Tab layout exists',
      file: 'app/(tabs)/_layout.jsx',
      pattern: /export default/,
    },
    {
      name: 'Match navigation',
      file: 'components/MatchCard.jsx',
      pattern: /router\.push.*\/match\//,
    },
    {
      name: 'Team navigation',
      file: 'app/(tabs)/leagues.jsx',
      pattern: /router\.push.*\/team\//,
    },
    {
      name: 'Player navigation',
      file: 'app/(tabs)/leagues.jsx',
      pattern: /router\.push.*\/player\//,
    },
  ];

  let passed = 0;
  checks.forEach(({ name, file, pattern }) => {
    if (checkFileForPattern(file, pattern)) {
      log.success(name);
      passed++;
    } else {
      log.warning(`${name} - not found`);
    }
  });

  return { passed, total: checks.length };
}

// Main execution
function main() {
  console.log('\n' + '='.repeat(70));
  console.log(`${colors.cyan}Final Testing Suite${colors.reset}`);
  console.log('='.repeat(70));

  const results = [];

  results.push(testScreensExist());
  results.push(testErrorHandling());
  results.push(testPullToRefresh());
  results.push(testLoadingStates());
  results.push(testEmptyStates());
  results.push(testUIComponents());
  results.push(testSharedComponents());
  results.push(testThemeAndStyles());
  results.push(testNavigation());

  // Calculate totals
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const percentage = ((totalPassed / totalTests) * 100).toFixed(1);

  console.log('\n' + '='.repeat(70));
  log.section('Test Summary');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalTests - totalPassed}${colors.reset}`);
  console.log(`Success Rate: ${percentage}%`);
  console.log('='.repeat(70) + '\n');

  if (percentage >= 90) {
    log.success('Excellent! App is ready for production 🎉');
  } else if (percentage >= 75) {
    log.info('Good progress! Address remaining issues');
  } else {
    log.warning('More work needed to reach production quality');
  }

  console.log('\n' + colors.blue + 'Next Steps:' + colors.reset);
  console.log('1. Test on real device');
  console.log('2. Verify all user flows manually');
  console.log('3. Test with different screen sizes');
  console.log('4. Test with screen reader enabled');
  console.log('5. Performance test on lower-end devices\n');
}

main();
