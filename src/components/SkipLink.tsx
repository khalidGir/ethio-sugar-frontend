import React from 'react';

/**
 * SkipLink - Accessibility component that allows keyboard users to skip to main content
 * Only visible when focused (Tab key)
 */
export const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="
      sr-only focus:not-sr-only
      focus:fixed focus:top-4 focus:left-4 focus:z-50
      focus:px-4 focus:py-2 focus:bg-white focus:rounded-lg
      focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-forest-400
      focus:text-gray-900 font-medium
    "
  >
    Skip to main content
  </a>
);
