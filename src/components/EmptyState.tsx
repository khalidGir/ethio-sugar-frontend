import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => (
  <div className="text-center py-12">
    {icon && <div className="text-gray-400 mb-4">{icon}</div>}
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);
