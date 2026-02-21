import React, { useState } from 'react';
import { useGetFieldsQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';
import { MapPin, Layers, ArrowRight } from 'lucide-react';
import type { Field } from '../../types';

const MOCK_FIELDS: Field[] = [
  { id: '1', name: 'Field A1', cropType: 'Sugarcane', status: 'NORMAL', area: 120, location: 'North Block' },
  { id: '2', name: 'Field B3', cropType: 'Sugarcane', status: 'WARNING', area: 95, location: 'East Block' },
  { id: '3', name: 'Field C2', cropType: 'Sugarcane', status: 'CRITICAL', area: 80, location: 'South Block' },
  { id: '4', name: 'Field D1', cropType: 'Sugarcane', status: 'NORMAL', area: 140, location: 'West Block' },
  { id: '5', name: 'Field E4', cropType: 'Sugarcane', status: 'WARNING', area: 110, location: 'Central Block' },
  { id: '6', name: 'Field F2', cropType: 'Sugarcane', status: 'NORMAL', area: 130, location: 'North Block' },
];

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
  const [useMockData, setUseMockData] = useState(false);

  const fields = useMockData ? MOCK_FIELDS : apiFields;

  if (isLoading && !useMockData) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error && !useMockData) {
    return (
      <Layout>
        <div className="space-y-4 p-2">
          <ErrorMessage message="Failed to load fields" onRetry={() => window.location.reload()} />
          <button
            onClick={() => setUseMockData(true)}
            className="text-sm text-forest-600 hover:text-forest-700 font-medium underline underline-offset-2"
          >
            Use mock data for demo →
          </button>
        </div>
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
            {/* Mock toggle */}
            <button
              onClick={() => setUseMockData(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${useMockData
                  ? 'bg-forest-50 border-forest-200 text-forest-700'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {useMockData ? '✓ Mock Data' : 'Use Mock Data'}
            </button>
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
