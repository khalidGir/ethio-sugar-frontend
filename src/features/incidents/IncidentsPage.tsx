import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetIncidentsQuery, useCreateIncidentMutation, useUpdateIncidentStatusMutation,
} from '../../services/api';
import { useGetFieldsQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { AlertTriangle, Plus, ChevronDown } from 'lucide-react';

const incidentSchema = z.object({
  fieldId: z.string().min(1, 'Field is required'),
  type: z.string().min(1, 'Type is required'),
  severity: z.enum(['NORMAL', 'WARNING', 'CRITICAL']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

const incidentStatusStyle: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-800 border border-red-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border border-amber-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
};

const rowBgBySeverity: Record<string, string> = {
  CRITICAL: 'bg-red-50/60',
  WARNING: 'bg-amber-50/40',
  NORMAL: '',
};

const SelectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    {children}
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

export const IncidentsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: fields } = useGetFieldsQuery();
  const { data: incidents, isLoading, error, refetch } = useGetIncidentsQuery(undefined);
  const [createIncident] = useCreateIncidentMutation();
  const [updateIncidentStatus] = useUpdateIncidentStatusMutation();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<IncidentFormData>({ resolver: zodResolver(incidentSchema) });

  const onSubmit = async (data: IncidentFormData) => {
    try {
      await createIncident(data).unwrap();
      reset();
      refetch();
    } catch { }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateIncidentStatus({ id, status }).unwrap();
      refetch();
    } catch { }
  };

  const isSupervisorOrAdmin = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const isWorker = user?.role === 'WORKER';

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error) {
    return (
      <Layout>
        <div className="p-2">
          <ErrorMessage message="Failed to load incidents" onRetry={() => window.location.reload()} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="page-header">Incidents</h1>

        {/* Report Form */}
        <div className="card border-l-4 border-l-forest-500">
          <h2 className="section-title flex items-center gap-2 mb-5">
            <Plus className="w-4 h-4 text-forest-500" />
            {isWorker ? 'Report Incident' : 'Create Incident'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Field */}
              <div>
                <label htmlFor="fieldId" className="label">Field</label>
                <SelectWrapper>
                  <select id="fieldId" {...register('fieldId')} className="select-field">
                    <option value="">Select a field</option>
                    {fields?.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </SelectWrapper>
                {errors.fieldId && <p className="field-error">⚠ {errors.fieldId.message}</p>}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="label">Type</label>
                <SelectWrapper>
                  <select id="type" {...register('type')} className="select-field">
                    <option value="">Select type</option>
                    <option value="Pest Infestation">Pest Infestation</option>
                    <option value="Disease Outbreak">Disease Outbreak</option>
                    <option value="Irrigation Issue">Irrigation Issue</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Other">Other</option>
                  </select>
                </SelectWrapper>
                {errors.type && <p className="field-error">⚠ {errors.type.message}</p>}
              </div>

              {/* Severity */}
              <div>
                <label htmlFor="severity" className="label">Severity</label>
                <SelectWrapper>
                  <select id="severity" {...register('severity')} className="select-field">
                    <option value="">Select severity</option>
                    <option value="NORMAL">Normal</option>
                    <option value="WARNING">Warning</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </SelectWrapper>
                {errors.severity && <p className="field-error">⚠ {errors.severity.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="input-field resize-none"
                placeholder="Describe the incident in detail..."
              />
              {errors.description && <p className="field-error">⚠ {errors.description.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Plus className="w-4 h-4" />
              }
              Submit Incident
            </button>
          </form>
        </div>

        {/* Incidents Table */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            {isWorker ? 'My Incidents' : 'All Incidents'}
          </h2>

          {!incidents || incidents.length === 0 ? (
            <EmptyState message="No incidents reported" description="Reports you file will appear here" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Field</th>
                    <th className="table-header">Type</th>
                    <th className="table-header">Severity</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Date</th>
                    {isSupervisorOrAdmin && <th className="table-header">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => {
                    const rowBg = rowBgBySeverity[incident.severity] ?? '';
                    return (
                      <tr key={incident.id} className={`table-row ${rowBg}`}>
                        <td className="table-cell font-medium">{incident.fieldName || incident.fieldId}</td>
                        <td className="table-cell">{incident.type}</td>
                        <td className="table-cell"><StatusBadge status={incident.severity} size="sm" /></td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${incidentStatusStyle[incident.status] ?? 'bg-gray-100 text-gray-700'
                            }`}>
                            {incident.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="table-cell text-gray-500">
                          {new Date(incident.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        {isSupervisorOrAdmin && (
                          <td className="table-cell">
                            <select
                              value={incident.status}
                              onChange={(e) => handleStatusUpdate(incident.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest-400 cursor-pointer"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
