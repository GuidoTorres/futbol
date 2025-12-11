/**
 * Accessibility Audit Script
 * Checks components for accessibility compliance
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

    // Check for touch target sizes (minimum 44x44)
    const hasTouchableOpacity = /TouchableOpacity/.test(content);
    const hasTouchableWithoutFeedback = /TouchableWithoutFeedback/.test(content);
    const hasPressable = /Pressable/.test(content);
    
    if (hasTouchableOpacity || hasTouchableWithoutFeedback || hasPressable) {
      const hasMinHeight44 = /minHeight:\s*44/.test(content);
      const hasMinWidth44 = /minWidth:\s*44/.test(content);
      
      if (hasMinHeight44 && hasMinWidth44) {
        successes.push('Touch targets meet 44x44 minimum');
      } else if (hasMinHeight44 || hasMinWidth44) {
        warnings.push('Some touch targets may not meet 44x44 minimum');
      } else {
        warnings.push('Touch target sizes not explicitly set (should be min 44x44)');
      }
    }

    // Check for accessibility labels
    const hasAccessibilityLabel = /accessibilityLabel/.test(content);
    const hasAccessibilityHint = /accessibilityHint/.test(content);
    const hasAccessibilityRole = /accessibilityRole/.test(content);
    
    if (hasAccessibilityLabel) {
      successes.push('Has accessibility labels');
    } else if (hasTouchableOpacity || hasPressable) {
      warnings.push('Missing accessibility labels for interactive elements');
    }

    if (hasAccessibilityRole) {
      successes.push('Has accessibility roles defined');
    } else if (hasTouchableOpacity || hasPressable) {
      warnings.push('Missing accessibility roles');
    }

    // Check for accessible prop
    const hasAccessibleTrue = /accessible\s*=\s*{true}/.test(content);
    if (hasAccessibleTrue) {
      successes.push('Explicitly marked as accessible');
    }

    // Check for color contrast (basic check for color definitions)
    const colorDefinitions = content.match(/color:\s*['"]#[0-9a-fA-F]{6}['"]/g);
    if (colorDefinitions) {
      // Check for very light colors on light backgrounds (potential contrast issue)
      const lightColors = colorDefinitions.filter(def => {
        const hex = def.match(/#[0-9a-fA-F]{6}/)[0];
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.8;
      });
      
      if (lightColors.length > 0) {
        warnings.push('Contains light colors - verify contrast ratios');
      }
    }

    // Check for image alt text (via accessibilityLabel on Image)
    const hasImage = /<Image/.test(content);
    if (hasImage) {
      const imageHasAccessibility = /<Image[^>]*accessibilityLabel/.test(content);
      if (imageHasAccessibility) {
        successes.push('Images have accessibility labels');
      } else {
        warnings.push('Images may be missing accessibility labels');
      }
    }

    // Check for disabled state accessibility
    const hasDisabled = /disabled\s*=/.test(content);
    if (hasDisabled) {
      const hasAccessibilityState = /accessibilityState/.test(content);
      if (hasAccessibilityState) {
        successes.push('Disabled state communicated to screen readers');
      } else {
        warnings.push('Disabled state may not be communicated to screen readers');
      }
    }

    return { issues, warnings, successes };
  } catch (error) {
    return null;
  }
}

function auditComponents() {
  log.info('\n=== Accessibility Audit ===\n');

  const componentsToAudit = [
    'components/ui/Button.jsx',
    'components/ui/Input.jsx',
    'components/ui/Card.jsx',
    'components/MatchCard.jsx',
    'components/TeamLogo.jsx',
    'components/PlayerAvatar.jsx',
    'components/FavoriteButton.jsx',
    'app/(tabs)/index.jsx',
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
      log.info('No accessibility features detected');
    }
  });

  console.log('\n' + '='.repeat(60));
  log.info(`Audit Complete: ${totalSuccesses} successes, ${totalWarnings} warnings, ${totalIssues} issues`);
  console.log('='.repeat(60) + '\n');

  if (totalIssues === 0 && totalWarnings === 0) {
    log.success('Excellent accessibility implementation! ♿');
  } else if (totalIssues === 0) {
    log.info('Good accessibility, but some improvements possible');
  } else {
    log.warning('Please address the issues above for better accessibility');
  }

  console.log('\n' + colors.blue + 'Accessibility Guidelines:' + colors.reset);
  console.log('• Touch targets: Minimum 44x44 points');
  console.log('• Color contrast: Minimum 4.5:1 for text');
  console.log('• Labels: All interactive elements need accessibilityLabel');
  console.log('• Roles: Define accessibilityRole for semantic meaning');
  console.log('• States: Communicate disabled/selected states');
  console.log('• Images: Provide meaningful alt text\n');
}

auditComponents();
