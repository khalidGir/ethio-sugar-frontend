import React from 'react';
import { useGetFieldsQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';
import { MapPin, Layers, ArrowRight } from 'lucide-react';

const statusBorderColor: Record<string, string> = {
  NORMAL: 'border-t-emerald-500',
  WARNING: 'border-t-amber-500',
  CRITICAL: 'border-t-red-500',
};

const statusBg: Record<string, string> = {
  NORMAL: '',
  WARNING: '',
  CRITICAL: 'shadow-glow-red',
};

export const FieldsPage: React.FC = () => {
  const { data: apiFields, isLoading, error } = useGetFieldsQuery();

  const fields = apiFields;

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error) {
    return (
      <Layout>
        <ErrorMessage message="Failed to load fields" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <Layout>
        <EmptyState message="No fields available" description="Fields will appear here once added to the system." />
      </Layout>
    );
  }

  const normalCount = fields.filter(f => f.status === 'NORMAL').length;
  const warningCount = fields.filter(f => f.status === 'WARNING').length;
  const criticalCount = fields.filter(f => f.status === 'CRITICAL').length;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="page-header">Fields</h1>
            <p className="text-sm text-gray-500 mt-0.5">{fields.length} fields monitored</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Summary pills */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{normalCount} Normal
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{warningCount} Warning
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{criticalCount} Critical
              </span>
            </div>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields.map((field) => {
            const borderClass = statusBorderColor[field.status] ?? statusBorderColor.NORMAL;
            const bgClass = statusBg[field.status] ?? '';
            const isCritical = field.status === 'CRITICAL';

            return (
              <Link
                key={field.id}
                to={`/fields/${field.id}`}
                className={`
                  card-hover bg-white rounded-2xl border-t-4 shadow-card
                  ${borderClass} ${bgClass}
                  ${isCritical ? 'ring-1 ring-red-200' : ''}
                  block transition-all duration-200
                `}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-red-100' : 'bg-forest-50'
                        }`}>
                        <MapPin className={`w-4.5 h-4.5 ${isCritical ? 'text-red-500' : 'text-forest-500'}`} size={18} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900">{field.name}</h3>
                    </div>
                    <StatusBadge status={field.status} size="sm" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Layers className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-500 text-xs">Crop:</span>
                      <span className="text-gray-800 font-medium">{field.cropType}</span>
                    </div>
                    {field.area && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium text-gray-500 text-xs ml-5">Area:</span>
                        <span className="text-gray-800 font-medium">{field.area} ha</span>
                      </div>
                    )}
                    {field.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium text-gray-500 text-xs ml-5">Location:</span>
                        <span className="text-gray-700 truncate">{field.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end text-xs text-forest-600 font-semibold gap-1">
                    View details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
