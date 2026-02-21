import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; fullPage?: boolean }> = ({
  size = 'md',
  fullPage = false,
}) => {
  const ringSize = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  const borderSize = { sm: 'border-2', md: 'border-2', lg: 'border-3' }[size];

  const spinner = (
    <div
      className={`${ringSize} ${borderSize} border-gray-200 border-t-forest-500 rounded-full animate-spin`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {spinner}
        <p className="text-sm text-gray-400 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};
