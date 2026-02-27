import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SoilHealthCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'amber';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    iconBg: 'bg-red-100',
    gradient: 'from-red-500 to-red-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100',
    gradient: 'from-amber-500 to-amber-600',
  },
};

export const SoilHealthCard: React.FC<SoilHealthCardProps> = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  color,
}) => {
  const colors = colorClasses[color];

  return (
    <div className={`card ${colors.bg} border border-${color}-100`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text} opacity-80`}>{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mt-2`}>
            {value.toLocaleString()}{suffix && <span className="text-lg ml-1">{suffix}</span>}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};
