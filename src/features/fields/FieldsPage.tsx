import React, { useState } from 'react';
import { useGetFieldsQuery, useCreateIrrigationLogMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';
import { MapPin, Layers, ArrowRight, Droplets, X } from 'lucide-react';

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
  const { user } = useAuth();
  const { data: apiFields, isLoading, error } = useGetFieldsQuery();
  const [createIrrigationLog] = useCreateIrrigationLogMutation();
  const [showIrrigationModal, setShowIrrigationModal] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [moistureDeficit, setMoistureDeficit] = useState<number>(0);

  const fields = apiFields;
  const isSupervisorOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

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

  const handleLogIrrigation = async (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setShowIrrigationModal(true);
  };

  const handleSubmitIrrigation = async () => {
    if (!selectedFieldId) return;
    try {
      await createIrrigationLog({ fieldId: selectedFieldId, moistureDeficit }).unwrap();
      setShowIrrigationModal(false);
      setMoistureDeficit(0);
    } catch (err) {
      console.error('Failed to log irrigation:', err);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Fields' }]} />

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
              <div
                key={field.id}
                className={`
                  bg-white rounded-2xl border-t-4 shadow-card
                  ${borderClass} ${bgClass}
                  ${isCritical ? 'ring-1 ring-red-200' : ''}
                  transition-all duration-200
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

                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/fields/${field.id}`}
                      className="flex items-center text-xs text-forest-600 font-semibold gap-1 hover:underline"
                    >
                      View details <ArrowRight className="w-3 h-3" />
                    </Link>
                    {isSupervisorOrAdmin && (
                      <button
                        onClick={() => handleLogIrrigation(field.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors min-h-[36px]"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        Log Water
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Irrigation Log Modal */}
      {showIrrigationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Log Irrigation
              </h2>
              <button onClick={() => setShowIrrigationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedField && (
              <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">Field: {selectedField.name}</p>
                <p className="text-xs text-blue-600 mt-0.5">Crop: {selectedField.cropType}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moisture Deficit (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={moistureDeficit}
                    onChange={(e) => setMoistureDeficit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[44px] pr-10"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    %
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      moistureDeficit >= 75 ? 'bg-red-500' : moistureDeficit >= 40 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, moistureDeficit)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {moistureDeficit < 40 ? 'Adequate moisture' : moistureDeficit < 75 ? 'Moderate deficit' : 'Critical - irrigate now'}
                </p>
              </div>

              <button
                onClick={handleSubmitIrrigation}
                className="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <Droplets className="w-4 h-4" />
                Submit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
