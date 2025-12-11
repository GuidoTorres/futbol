/**
 * Animation Audit Script
 * Checks components for animation performance issues
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

    // Check for useNativeDriver
    const hasAnimatedTiming = /Animated\.timing/.test(content);
    const hasAnimatedSpring = /Animated\.spring/.test(content);
    
    if (hasAnimatedTiming || hasAnimatedSpring) {
      const hasNativeDriver = /useNativeDriver:\s*true/.test(content);
      const hasNativeDriverFalse = /useNativeDriver:\s*false/.test(content);
      
      if (hasNativeDriver) {
        successes.push('Uses native driver');
      }
      if (hasNativeDriverFalse) {
        issues.push('Has useNativeDriver: false (performance impact)');
      }
      if (!hasNativeDriver && !hasNativeDriverFalse) {
        warnings.push('Missing useNativeDriver specification');
      }
    }

    // Check animation durations
    const durationMatches = content.match(/duration:\s*(\d+)/g);
    if (durationMatches) {
      durationMatches.forEach(match => {
        const duration = parseInt(match.match(/\d+/)[0]);
        if (duration > 400) {
          warnings.push(`Long animation duration: ${duration}ms (consider reducing)`);
        } else if (duration >= 100 && duration <= 300) {
          successes.push(`Optimal duration: ${duration}ms`);
        }
      });
    }

    // Check for layout animations (bad for performance)
    const layoutAnimations = [
      { prop: 'width', pattern: /width:\s*animat/i },
      { prop: 'height', pattern: /height:\s*animat/i },
      { prop: 'padding', pattern: /padding:\s*animat/i },
      { prop: 'margin', pattern: /margin:\s*animat/i },
    ];

    layoutAnimations.forEach(({ prop, pattern }) => {
      if (pattern.test(content)) {
        issues.push(`Animating ${prop} (use transform instead)`);
      }
    });

    // Check for transform animations (good)
    if (/transform:\s*\[/.test(content)) {
      successes.push('Uses transform animations');
    }

    // Check for opacity animations (good)
    if (/opacity:\s*animat/i.test(content)) {
      successes.push('Uses opacity animations');
    }

    // Check for excessive simultaneous animations
    const animatedViewCount = (content.match(/Animated\.View/g) || []).length;
    if (animatedViewCount > 4) {
      warnings.push(`Multiple Animated.View components (${animatedViewCount}) - may impact performance`);
    }

    return { issues, warnings, successes };
  } catch (error) {
    return null;
  }
}

function auditComponents() {
  log.info('\n=== Animation Performance Audit ===\n');

  const componentsToAudit = [
    'components/ui/Button.jsx',
    'components/ui/Card.jsx',
    'components/MatchCard.jsx',
    'components/ui/LoadingState.jsx',
    'app/(tabs)/index.jsx',
  ];

  let totalIssues = 0;
  let totalWarnings = 0;

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
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => log.warning(warning));
      totalWarnings += result.warnings.length;
    }

    if (result.issues.length > 0) {
      result.issues.forEach(issue => log.error(issue));
      totalIssues += result.issues.length;
    }

    if (result.issues.length === 0 && result.warnings.length === 0) {
      log.success('No issues found');
    }
  });

  console.log('\n' + '='.repeat(60));
  log.info(`Audit Complete: ${totalIssues} issues, ${totalWarnings} warnings`);
  console.log('='.repeat(60) + '\n');

  if (totalIssues === 0 && totalWarnings === 0) {
    log.success('All animations are optimized! 🎉');
  } else if (totalIssues === 0) {
    log.info('No critical issues, but some optimizations possible');
  } else {
    log.warning('Please address the issues above for better performance');
  }
}

auditComponents();
