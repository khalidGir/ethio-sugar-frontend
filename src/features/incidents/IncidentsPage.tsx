import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetIncidentsQuery, useCreateIncidentMutation, useUpdateIncidentStatusMutation } from '../../services/api';
import { useGetFieldsQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';

const incidentSchema = z.object({
  fieldId: z.string().min(1, 'Field is required'),
  type: z.string().min(1, 'Type is required'),
  severity: z.enum(['NORMAL', 'WARNING', 'CRITICAL']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

export const IncidentsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: fields } = useGetFieldsQuery();
  const { data: incidents, isLoading, error, refetch } = useGetIncidentsQuery(undefined);
  const [createIncident] = useCreateIncidentMutation();
  const [updateIncidentStatus] = useUpdateIncidentStatusMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
  });

  const onSubmit = async (data: IncidentFormData) => {
    try {
      await createIncident(data).unwrap();
      reset();
      refetch();
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateIncidentStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  const isWorker = user?.role === 'WORKER';
  const isSupervisorOrAdmin = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message="Failed to load incidents" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Incidents</h1>

        {/* Create Incident Form - Worker & Supervisor & Admin */}
        {!isWorker || isWorker ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {isWorker ? 'Report New Incident' : 'Create New Incident'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="fieldId" className="block text-sm font-medium text-gray-700 mb-1">
                  Field
                </label>
                <select
                  id="fieldId"
                  {...register('fieldId')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a field</option>
                  {fields?.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
                {errors.fieldId && (
                  <p className="mt-1 text-sm text-red-600">{errors.fieldId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  {...register('type')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Pest Infestation">Pest Infestation</option>
                  <option value="Disease Outbreak">Disease Outbreak</option>
                  <option value="Irrigation Issue">Irrigation Issue</option>
                  <option value="Equipment Failure">Equipment Failure</option>
                  <option value="Other">Other</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  id="severity"
                  {...register('severity')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select severity</option>
                  <option value="NORMAL">Normal</option>
                  <option value="WARNING">Warning</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                {errors.severity && (
                  <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the incident..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Incident
              </button>
            </form>
          </div>
        ) : null}

        {/* Incidents List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isWorker ? 'My Incidents' : 'All Incidents'}
          </h2>

          {!incidents || incidents.length === 0 ? (
            <EmptyState message="No incidents reported" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Field</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    {isSupervisorOrAdmin && (
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {incident.fieldName || incident.fieldId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">{incident.type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={incident.severity} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center font-medium rounded-full px-2 py-0.5 text-xs ${
                            incident.status === 'OPEN'
                              ? 'bg-red-100 text-red-800'
                              : incident.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </td>
                      {isSupervisorOrAdmin && (
                        <td className="py-3 px-4">
                          <select
                            value={incident.status}
                            onChange={(e) =>
                              handleStatusUpdate(incident.id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                        </td>
                      )}
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
