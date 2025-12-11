/**
 * Deep Linking Utilities
 * Handle deep links and route validation
 */

import { router } from 'expo-router';

/**
 * Valid route patterns for the app
 */
const VALID_ROUTES = {
  // Tab routes
  home: /^\/(index)?$/,
  leagues: /^\/leagues$/,
  predictions: /^\/predictions$/,
  favorites: /^\/favorites$/,
  comparison: /^\/comparison(\/index)?$/,
  news: /^\/news$/,
  players: /^\/players$/,
  search: /^\/search$/,
  
  // Detail routes
  match: /^\/match\/\d+$/,
  team: /^\/team\/\d+$/,
  player: /^\/player\/\d+$/,
  league: /^\/league\/\d+$/,
  
  // Comparison results
  comparisonResults: /^\/comparison\/results$/,
};

/**
 * Check if a route is valid
 */
export function isValidRoute(path) {
  if (!path) return false;
  
  // Normalize path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Check against all valid patterns
  return Object.values(VALID_ROUTES).some(pattern => pattern.test(normalizedPath));
}

/**
 * Parse deep link URL and extract route information
 */
export function parseDeepLink(url) {
  if (!url) return null;

  try {
    // Handle different URL formats
    let path = '';
    
    if (url.startsWith('futbolapp://')) {
      // Custom scheme: futbolapp://match/123
      path = url.replace('futbolapp://', '/');
    } else if (url.startsWith('https://') || url.startsWith('http://')) {
      // Universal link: https://futbolapp.com/match/123
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } else {
      // Already a path: /match/123
      path = url;
    }

    // Normalize path
    path = path.startsWith('/') ? path : `/${path}`;
    
    // Remove trailing slash
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return {
      path,
      isValid: isValidRoute(path),
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

/**
 * Navigate to a deep link URL
 */
export function navigateToDeepLink(url) {
  // Ignore development URLs
  if (!url || url.startsWith('exp://') || url.startsWith('http://localhost')) {
    console.log('Ignoring development/invalid URL:', url);
    return false;
  }

  const parsed = parseDeepLink(url);
  
  if (!parsed) {
    console.warn('Could not parse deep link URL:', url);
    return false;
  }

  if (!parsed.isValid) {
    console.warn('Invalid route:', parsed.path);
    return false;
  }

  try {
    router.push(parsed.path);
    return true;
  } catch (error) {
    console.error('Error navigating to deep link:', error);
    return false;
  }
}

/**
 * Generate deep link URL for a route
 */
export function generateDeepLink(path, scheme = 'futbolapp') {
  if (!path) return null;
  
  // Normalize path
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${scheme}://${normalizedPath}`;
}

/**
 * Generate universal link URL for a route
 */
export function generateUniversalLink(path, domain = 'futbolapp.com') {
  if (!path) return null;
  
  // Normalize path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `https://${domain}${normalizedPath}`;
}

/**
 * Extract entity ID from path
 */
export function extractEntityId(path) {
  const match = path.match(/\/(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Build route paths
 */
export const routes = {
  home: () => '/',
  leagues: () => '/leagues',
  predictions: () => '/predictions',
  favorites: () => '/favorites',
  comparison: () => '/comparison',
  news: () => '/news',
  players: () => '/players',
  search: () => '/search',
  match: (id) => `/match/${id}`,
  team: (id) => `/team/${id}`,
  player: (id) => `/player/${id}`,
  league: (id) => `/league/${id}`,
  comparisonResults: () => '/comparison/results',
};

/**
 * Route names for analytics and tracking
 */
export const routeNames = {
  '/': 'Home',
  '/leagues': 'Leagues',
  '/predictions': 'Predictions',
  '/favorites': 'Favorites',
  '/comparison': 'Comparison',
  '/news': 'News',
  '/players': 'Players',
  '/search': 'Search',
  '/match': 'Match Detail',
  '/team': 'Team Detail',
  '/player': 'Player Detail',
  '/league': 'League Detail',
  '/comparison/results': 'Comparison Results',
};

/**
 * Get route name from path
 */
export function getRouteName(path) {
  if (!path) return 'Unknown';
  
  // Exact match
  if (routeNames[path]) {
    return routeNames[path];
  }
  
  // Pattern match for detail routes
  if (path.startsWith('/match/')) return routeNames['/match'];
  if (path.startsWith('/team/')) return routeNames['/team'];
  if (path.startsWith('/player/')) return routeNames['/player'];
  if (path.startsWith('/league/')) return routeNames['/league'];
  
  return 'Unknown';
}
