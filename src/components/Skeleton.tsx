import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Skeleton - Loading placeholder component
 * @param variant - Type of skeleton (text, circular, rectangular, rounded)
 * @param width - Width of the skeleton
 * @param height - Height of the skeleton
 * @param className - Additional CSS classes
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * DashboardSkeleton - Loading state for dashboard page
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton width={200} height={28} />
        <Skeleton width={150} height={16} />
      </div>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton width={100} height={16} />
              <Skeleton width={60} height={32} />
            </div>
            <Skeleton width={44} height={44} variant="rounded" />
          </div>
        </div>
      ))}
    </div>

    {/* Content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="card">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width={150} height={20} />
            <Skeleton width={80} height={16} />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton width={32} height={32} variant="rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton width="80%" height={16} />
                  <Skeleton width="60%" height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * TableSkeleton - Loading state for table views
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => (
  <div className="card p-0 overflow-hidden">
    {/* Table header skeleton */}
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <Skeleton width={150} height={16} />
    </div>

    {/* Table body skeleton */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} width={`${100 / columns}%`} height={16} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * CardSkeleton - Loading state for card grids
 */
interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton width={44} height={44} variant="rounded" />
          <Skeleton width={80} height={24} />
        </div>
        <div className="space-y-2">
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={16} />
          <Skeleton width="60%" height={16} />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton width={100} height={16} />
          <Skeleton width={60} height={24} />
        </div>
      </div>
    ))}
  </div>
);

/**
 * FormSkeleton - Loading state for forms
 */
export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="space-y-1">
      <Skeleton width={100} height={16} />
      <Skeleton width="100%" height={44} variant="rounded" />
    </div>
    <div className="space-y-1">
      <Skeleton width={100} height={16} />
      <Skeleton width="100%" height={44} variant="rounded" />
    </div>
    <div className="space-y-1">
      <Skeleton width={100} height={16} />
      <Skeleton width="100%" height={100} variant="rounded" />
    </div>
    <Skeleton width="100%" height={44} variant="rounded" />
  </div>
);
