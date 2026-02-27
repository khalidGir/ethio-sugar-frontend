import { useState, useEffect } from 'react';

/**
 * useMediaQuery - Hook to check if a media query matches
 * @param query - Media query string (e.g., '(max-width: 768px)')
 * @returns boolean - true if query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
