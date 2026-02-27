import React from 'react';
import { Inbox, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  secondaryAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4 shadow-sm">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-lg font-semibold text-gray-700">{message}</p>
    {description && (
      <p className="text-sm text-gray-500 mt-2 max-w-md">{description}</p>
    )}
    <div className="flex gap-3 mt-6">
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  </div>
);
