import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCreateIrrigationLogMutation,
  useGetIrrigationLogsQuery,
  useGetFieldsQuery,
} from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Droplets, ChevronDown } from 'lucide-react';

const irrigationSchema = z.object({
  fieldId: z.string().min(1, 'Field is required'),
  moistureDeficit: z.number().positive('Moisture deficit must be a positive number'),
});

type IrrigationFormData = z.infer<typeof irrigationSchema>;

const StatusRow: Record<string, string> = {
  NORMAL: '',
  WARNING: 'bg-amber-50/50',
  CRITICAL: 'bg-red-50/60',
};

const MoistureBar: React.FC<{ value: number }> = ({ value }) => {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 75 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const IrrigationPage: React.FC = () => {
  const { data: fields } = useGetFieldsQuery();
  const { data: logs, isLoading, refetch } = useGetIrrigationLogsQuery(undefined);
  const [createIrrigationLog, { isLoading: isBusy }] = useCreateIrrigationLogMutation();
  const [lastStatus, setLastStatus] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } =
    useForm<IrrigationFormData>({
      resolver: zodResolver(irrigationSchema),
      defaultValues: { fieldId: '', moistureDeficit: 0 },
    });

  const moistureValue = watch('moistureDeficit') || 0;

  const onSubmit = async (data: IrrigationFormData) => {
    try {
      const result: any = await createIrrigationLog(data).unwrap();
      setLastStatus(result?.status ?? null);
      reset();
      refetch();
    } catch { }
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="page-header">Irrigation Logs</h1>

        {/* Form */}
        <div className="card border-l-4 border-l-blue-500">
          <h2 className="section-title flex items-center gap-2 mb-5">
            <Droplets className="w-4 h-4 text-blue-500" />
            Log Irrigation
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field select */}
              <div>
                <label htmlFor="fieldId" className="label">Field</label>
                <div className="relative">
                  <select id="fieldId" {...register('fieldId')} className="select-field">
                    <option value="">Select a field</option>
                    {fields?.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.fieldId && <p className="field-error">⚠ {errors.fieldId.message}</p>}
              </div>

              {/* Moisture input with % badge */}
              <div>
                <label htmlFor="moistureDeficit" className="label">Moisture Deficit</label>
                <div className="relative">
                  <input
                    id="moistureDeficit"
                    type="number"
                    step="0.1"
                    {...register('moistureDeficit', { valueAsNumber: true })}
                    className="input-field pr-10"
                    placeholder="0.0"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
                    %
                  </span>
                </div>
                {/* Live moisture bar */}
                <div className="mt-2">
                  <MoistureBar value={moistureValue} />
                  <p className="text-xs text-gray-400 mt-1">
                    {moistureValue < 40 ? 'Adequate' : moistureValue < 75 ? 'Moderate — monitor closely' : 'High deficit — irrigation needed'}
                  </p>
                </div>
                {errors.moistureDeficit && <p className="field-error">⚠ {errors.moistureDeficit.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="btn-primary flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}
            >
              {isBusy
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Droplets className="w-4 h-4" />
              }
              Submit Log
            </button>
          </form>

          {/* Submission result banner */}
          {lastStatus && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 ${lastStatus === 'CRITICAL' ? 'bg-red-50 border border-red-200' :
                lastStatus === 'WARNING' ? 'bg-amber-50 border border-amber-200' :
                  'bg-emerald-50 border border-emerald-200'
              }`}>
              <StatusBadge status={lastStatus} size="md" />
              <p className={`text-sm font-medium ${lastStatus === 'CRITICAL' ? 'text-red-700' :
                  lastStatus === 'WARNING' ? 'text-amber-700' :
                    'text-emerald-700'
                }`}>
                {lastStatus === 'CRITICAL'
                  ? '⚠ Critical moisture deficit — immediate irrigation required!'
                  : lastStatus === 'WARNING'
                    ? 'Moderate moisture deficit detected — schedule irrigation soon.'
                    : 'Field moisture levels are within normal range.'}
              </p>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-5">
            <Droplets className="w-4 h-4 text-gray-400" />
            Recent Logs
          </h2>

          {!logs || logs.length === 0 ? (
            <EmptyState message="No irrigation logs yet" description="Submit your first log above." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Field</th>
                    <th className="table-header">Moisture Deficit</th>
                    <th className="table-header">Visual</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className={`table-row ${StatusRow[log.status] ?? ''}`}>
                      <td className="table-cell font-medium">{log.fieldName || log.fieldId}</td>
                      <td className="table-cell font-mono">{log.moistureDeficit}%</td>
                      <td className="table-cell w-36">
                        <MoistureBar value={log.moistureDeficit} />
                      </td>
                      <td className="table-cell"><StatusBadge status={log.status} size="sm" /></td>
                      <td className="table-cell text-gray-500">
                        {new Date(log.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
