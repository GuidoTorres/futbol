/**
 * Hook to maintain scroll position when navigating back
 * Stores scroll position before navigation and restores it on return
 */

import { useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';

const scrollPositions = new Map();

export function useScrollRestoration(key) {
  const scrollRef = useRef(null);
  const pathname = usePathname();
  const scrollKey = key || pathname;

  useEffect(() => {
    // Restore scroll position when component mounts
    const savedPosition = scrollPositions.get(scrollKey);
    if (savedPosition && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: savedPosition,
          animated: false,
        });
      }, 100);
    }

    // Save scroll position when component unmounts
    return () => {
      if (scrollRef.current) {
        scrollRef.current.measure((x, y, width, height, pageX, pageY) => {
          scrollPositions.set(scrollKey, pageY);
        });
      }
    };
  }, [scrollKey]);

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    scrollPositions.set(scrollKey, yOffset);
  };

  return {
    scrollRef,
    handleScroll,
  };
}

/**
 * Hook for FlatList scroll restoration
 */
export function useFlatListScrollRestoration(key) {
  const listRef = useRef(null);
  const pathname = usePathname();
  const scrollKey = key || pathname;

  useEffect(() => {
    // Restore scroll position when component mounts
    const savedPosition = scrollPositions.get(scrollKey);
    if (savedPosition && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: savedPosition,
          animated: false,
        });
      }, 100);
    }

    // Save scroll position when component unmounts
    return () => {
      // Position is saved via handleScroll
    };
  }, [scrollKey]);

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    scrollPositions.set(scrollKey, yOffset);
  };

  return {
    listRef,
    handleScroll,
  };
}

/**
 * Clear all saved scroll positions
 */
export function clearScrollPositions() {
  scrollPositions.clear();
}

/**
 * Clear specific scroll position
 */
export function clearScrollPosition(key) {
  scrollPositions.delete(key);
}
