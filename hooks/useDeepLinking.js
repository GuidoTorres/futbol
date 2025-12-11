/**
 * Hook to handle deep linking
 * Listens for deep link events and navigates accordingly
 */

import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { navigateToDeepLink, parseDeepLink, getRouteName } from '../utils/deepLinking';

export function useDeepLinking() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Handle initial URL when app is opened from a deep link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Initial URL:', initialUrl);
          
          // Ignore Expo development URLs
          if (initialUrl.startsWith('exp://') || initialUrl.startsWith('http://localhost')) {
            console.log('Ignoring development URL');
            return;
          }
          
          navigateToDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    handleInitialURL();

    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      
      // Ignore Expo development URLs
      if (url.startsWith('exp://') || url.startsWith('http://localhost')) {
        console.log('Ignoring development URL');
        return;
      }
      
      navigateToDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Validate current route (disabled to prevent loops)
  // useEffect(() => {
  //   const parsed = parseDeepLink(pathname);
  //   if (parsed && !parsed.isValid) {
  //     console.warn('Invalid route detected:', pathname);
  //   }
  // }, [pathname]);

  return {
    currentRoute: pathname,
    routeName: getRouteName(pathname),
  };
}

/**
 * Hook to get current route information
 */
export function useRouteInfo() {
  const pathname = usePathname();
  
  return {
    path: pathname,
    name: getRouteName(pathname),
    isValid: parseDeepLink(pathname)?.isValid ?? false,
  };
}
