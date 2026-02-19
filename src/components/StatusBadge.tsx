import React from 'react';
import type { Status } from '../types';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  NORMAL: { bg: 'bg-green-100', text: 'text-green-800', label: 'Normal' },
  WARNING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Warning' },
  CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
};
