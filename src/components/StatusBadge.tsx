import React from 'react';

export type Status =
  | 'NORMAL' | 'WARNING' | 'CRITICAL'
  | 'normal' | 'warning' | 'critical'
  | 'high' | 'medium' | 'low';

interface StatusBadgeProps {
  status: Status | string;
  size?: 'sm' | 'md' | 'lg';
}

const normalize = (s: string): 'NORMAL' | 'WARNING' | 'CRITICAL' => {
  const u = s?.toUpperCase();
  if (u === 'CRITICAL' || u === 'HIGH') return 'CRITICAL';
  if (u === 'WARNING' || u === 'MEDIUM') return 'WARNING';
  return 'NORMAL';
};

const statusConfig = {
  NORMAL: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    label: 'Normal',
  },
  WARNING: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    label: 'Warning',
  },
  CRITICAL: {
    dot: 'bg-red-500 badge-pulse',
    badge: 'bg-red-50 text-red-700 border border-red-200',
    label: 'Critical',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const dotSizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const key = normalize(status ?? 'NORMAL');
  const config = statusConfig[key];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${config.badge} ${sizeClasses[size]}`}
    >
      <span className={`rounded-full flex-shrink-0 ${config.dot} ${dotSizeClasses[size]}`} />
      {config.label}
    </span>
  );
};
