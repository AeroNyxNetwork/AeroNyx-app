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
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);
    
    // Create a handler to update the state when the match changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
}
