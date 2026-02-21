import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, description }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <Inbox className="w-7 h-7 text-gray-400" />
    </div>
    <p className="text-base font-semibold text-gray-600">{message}</p>
    {description && (
      <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>
    )}
  </div>
);
