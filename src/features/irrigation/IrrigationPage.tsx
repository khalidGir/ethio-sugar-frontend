import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateIrrigationLogMutation, useGetIrrigationLogsQuery, useGetFieldsQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';

const irrigationSchema = z.object({
  fieldId: z.string().min(1, 'Field is required'),
  moistureDeficit: z.number().positive('Moisture deficit must be a positive number'),
});

type IrrigationFormData = z.infer<typeof irrigationSchema>;

export const IrrigationPage: React.FC = () => {
  const { data: fields } = useGetFieldsQuery();
  const { data: logs, isLoading, refetch } = useGetIrrigationLogsQuery(undefined);
  const [createIrrigationLog, { isLoading: isSubmitting }] = useCreateIrrigationLogMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IrrigationFormData>({
    resolver: zodResolver(irrigationSchema),
    defaultValues: {
      fieldId: '',
      moistureDeficit: 0,
    },
  });

  const onSubmit = async (data: IrrigationFormData) => {
    try {
      await createIrrigationLog(data).unwrap();
      reset();
      refetch();
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Irrigation Logs</h1>

        {/* Irrigation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Log Irrigation</h2>
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
              <label htmlFor="moistureDeficit" className="block text-sm font-medium text-gray-700 mb-1">
                Moisture Deficit (%)
              </label>
              <input
                id="moistureDeficit"
                type="number"
                step="0.1"
                {...register('moistureDeficit', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter moisture deficit"
              />
              {errors.moistureDeficit && (
                <p className="mt-1 text-sm text-red-600">{errors.moistureDeficit.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <LoadingSpinner /> : 'Submit Log'}
            </button>
          </form>
        </div>

        {/* Irrigation Logs List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Logs</h2>

          {!logs || logs.length === 0 ? (
            <EmptyState message="No irrigation logs yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Field</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Moisture Deficit</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {log.fieldName || log.fieldId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">{log.moistureDeficit}%</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={log.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleDateString()}
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
