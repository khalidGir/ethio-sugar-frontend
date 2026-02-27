import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  error?: any;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, error, onRetry }) => {
  const getHelpfulMessage = (err: any): { title: string; description: string } => {
    if (!err) {
      return {
        title: 'Something went wrong',
        description: message,
      };
    }

    // API errors
    if (err?.status === 401) {
      return {
        title: 'Session expired',
        description: 'Your session has expired. Please log in again.',
      };
    }
    if (err?.status === 403) {
      return {
        title: 'Access denied',
        description: 'You do not have permission to access this resource.',
      };
    }
    if (err?.status === 404) {
      return {
        title: 'Not found',
        description: 'The requested resource was not found.',
      };
    }
    if (err?.status === 500) {
      return {
        title: 'Server error',
        description: 'A server error occurred. Please try again later.',
      };
    }

    // Network errors
    if (err?.name === 'TypeError' && err?.message === 'Failed to fetch') {
      return {
        title: 'Network error',
        description: 'Please check your internet connection and try again.',
      };
    }

    // Default
    return {
      title: 'Error',
      description: message,
    };
  };

  const { title, description } = getHelpfulMessage(error);
  const isNetworkError = title === 'Network error';

  return (
    <div
      className="card bg-red-50 border border-red-200"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          {isNetworkError ? (
            <WifiOff className="w-5 h-5 text-red-600" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-900">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{description}</p>

          {error?.message && import.meta.env.DEV && (
            <details className="mt-2">
              <summary className="text-xs text-red-600 cursor-pointer hover:text-red-700">
                Technical details
              </summary>
              <pre className="mt-1 text-xs text-red-600 overflow-auto bg-red-100/50 p-2 rounded">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 btn-danger text-sm inline-flex items-center gap-2"
              aria-label="Try again"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
