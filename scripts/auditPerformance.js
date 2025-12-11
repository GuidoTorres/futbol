/**
 * Performance Audit Script
 * Checks for common performance issues
 */

const fs = require('fs');
const path = require('path');

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

function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    const warnings = [];
    const successes = [];

    // Check for React.memo usage
    if (/export default/.test(content)) {
      if (/React\.memo/.test(content)) {
        successes.push('Uses React.memo for optimization');
      } else if (/Component|function.*\(.*props.*\)/.test(content)) {
        warnings.push('Consider using React.memo to prevent unnecessary re-renders');
      }
    }

    // Check for useCallback usage
    const hasCallbacks = /const.*=.*\(.*\).*=>/.test(content);
    if (hasCallbacks) {
      if (/useCallback/.test(content)) {
        successes.push('Uses useCallback for callback optimization');
      } else {
        warnings.push('Consider using useCallback for callback functions');
      }
    }

    // Check for useMemo usage
    const hasComputations = /const.*=.*\.(map|filter|reduce|sort)/.test(content);
    if (hasComputations) {
      if (/useMemo/.test(content)) {
        successes.push('Uses useMemo for computed values');
      } else {
        warnings.push('Consider using useMemo for expensive computations');
      }
    }

    // Check for FlatList optimization
    if (/<FlatList/.test(content)) {
      const hasInitialNumToRender = /initialNumToRender/.test(content);
      const hasMaxToRenderPerBatch = /maxToRenderPerBatch/.test(content);
      const hasWindowSize = /windowSize/.test(content);
      const hasRemoveClippedSubviews = /removeClippedSubviews/.test(content);
      const hasGetItemLayout = /getItemLayout/.test(content);

      if (hasInitialNumToRender) successes.push('FlatList: initialNumToRender set');
      else warnings.push('FlatList: Consider setting initialNumToRender');

      if (hasMaxToRenderPerBatch) successes.push('FlatList: maxToRenderPerBatch set');
      if (hasWindowSize) successes.push('FlatList: windowSize set');
      if (hasRemoveClippedSubviews) successes.push('FlatList: removeClippedSubviews enabled');
      if (hasGetItemLayout) successes.push('FlatList: getItemLayout implemented');
    }

    // Check for ScrollView with many children (should use FlatList)
    if (/<ScrollView/.test(content)) {
      const hasMap = /\.map\(/.test(content);
      if (hasMap) {
        warnings.push('ScrollView with .map() - consider using FlatList for better performance');
      }
    }

    // Check for image optimization
    if (/<Image/.test(content)) {
      const hasOnLoadStart = /onLoadStart/.test(content);
      const hasOnLoadEnd = /onLoadEnd/.test(content);
      const hasOnError = /onError/.test(content);
      const hasResizeMode = /resizeMode/.test(content);

      if (hasOnLoadStart && hasOnLoadEnd) {
        successes.push('Image: Loading states handled');
      } else {
        warnings.push('Image: Consider adding loading state handlers');
      }

      if (hasOnError) {
        successes.push('Image: Error handling implemented');
      } else {
        warnings.push('Image: Consider adding error handling');
      }

      if (hasResizeMode) {
        successes.push('Image: resizeMode specified');
      }
    }

    // Check for cleanup in useEffect
    if (/useEffect/.test(content)) {
      const hasReturn = /return\s*\(\s*\)\s*=>/.test(content);
      if (hasReturn) {
        successes.push('useEffect: Cleanup function implemented');
      } else {
        warnings.push('useEffect: Consider adding cleanup functions to prevent memory leaks');
      }
    }

    // Check for inline functions in render (performance issue)
    const hasInlineFunction = /onPress=\{.*=>/.test(content);
    if (hasInlineFunction) {
      warnings.push('Inline functions in render - consider extracting to useCallback');
    }

    // Check for console.log (should be removed in production)
    if (/console\.log/.test(content)) {
      warnings.push('console.log found - remove for production');
    }

    return { issues, warnings, successes };
  } catch (error) {
    return null;
  }
}

function auditComponents() {
  log.info('\n=== Performance Audit ===\n');

  const componentsToAudit = [
    'components/TeamLogo.jsx',
    'components/PlayerAvatar.jsx',
    'components/MatchCard.jsx',
    'components/ui/Button.jsx',
    'components/ui/Card.jsx',
    'app/(tabs)/index.jsx',
    'app/(tabs)/leagues.jsx',
  ];

  let totalIssues = 0;
  let totalWarnings = 0;
  let totalSuccesses = 0;

  componentsToAudit.forEach(componentPath => {
    const fullPath = path.join(__dirname, '..', componentPath);
    const result = auditFile(fullPath);

    if (!result) {
      log.error(`${componentPath}: File not found`);
      return;
    }

    console.log(`\n${colors.blue}${componentPath}${colors.reset}`);

    if (result.successes.length > 0) {
      result.successes.forEach(success => log.success(success));
      totalSuccesses += result.successes.length;
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => log.warning(warning));
      totalWarnings += result.warnings.length;
    }

    if (result.issues.length > 0) {
      result.issues.forEach(issue => log.error(issue));
      totalIssues += result.issues.length;
    }

    if (result.issues.length === 0 && result.warnings.length === 0 && result.successes.length === 0) {
      log.info('No performance optimizations detected');
    }
  });

  console.log('\n' + '='.repeat(60));
  log.info(`Audit Complete: ${totalSuccesses} optimizations, ${totalWarnings} suggestions, ${totalIssues} issues`);
  console.log('='.repeat(60) + '\n');

  if (totalIssues === 0 && totalWarnings < 5) {
    log.success('Excellent performance optimizations! 🚀');
  } else if (totalIssues === 0) {
    log.info('Good performance, but some improvements possible');
  } else {
    log.warning('Please address the issues above for better performance');
  }

  console.log('\n' + colors.blue + 'Performance Tips:' + colors.reset);
  console.log('• Use React.memo for components that render often');
  console.log('• Use useCallback for callback functions');
  console.log('• Use useMemo for expensive computations');
  console.log('• Use FlatList instead of ScrollView for long lists');
  console.log('• Implement image loading states and error handling');
  console.log('• Clean up subscriptions in useEffect');
  console.log('• Remove console.log statements in production\n');
}

auditComponents();
