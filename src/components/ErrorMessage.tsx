import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
    <p className="text-red-800">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-red-600 hover:text-red-800 font-medium"
      >
        Retry
      </button>
    )}
  </div>
);
