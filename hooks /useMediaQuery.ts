'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting media query matches
 * 
 * @param query CSS media query string to match
 * @returns boolean indicating whether the query matches
 * 
 * @example
 * // Check if the screen is at least medium size (768px)
 * const isMediumScreen = useMediaQuery('(min-width: 768px)');
 * 
 * @example
 * // Check if the user prefers dark mode
 * const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with a default value to avoid hydration issues
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Set initial value on client side to avoid SSR mismatch
    setMatches(window.matchMedia(query).matches);
    
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Create a handler to update the state
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Add the listener
    if (media.addEventListener) {
      media.addEventListener('change', updateMatches);
    } else {
      // For older browsers
      media.addListener(updateMatches);
    }
    
    // Clean up
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', updateMatches);
      } else {
        // For older browsers
        media.removeListener(updateMatches);
      }
    };
  }, [query]);
  
  return matches;
}
