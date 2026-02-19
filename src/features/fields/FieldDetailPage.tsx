import { useParams } from 'react-router-dom';
import { useGetFieldDetailQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';

export const FieldDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: field, isLoading, error } = useGetFieldDetailQuery(id!);

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
        <ErrorMessage message="Failed to load field details" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  if (!field) {
    return (
      <Layout>
        <ErrorMessage message="Field not found" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/fields" className="text-blue-600 hover:underline">
            ← Back to Fields
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{field.name}</h1>
            <StatusBadge status={field.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Field Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Crop Type</dt>
                  <dd className="text-gray-800">{field.cropType}</dd>
                </div>
                {field.area && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Area</dt>
                    <dd className="text-gray-800">{field.area} ha</dd>
                  </div>
                )}
                {field.location && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Location</dt>
                    <dd className="text-gray-800">{field.location}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thresholds</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Moisture Min</dt>
                  <dd className="text-gray-800">{field.thresholds.moistureMin}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Moisture Max</dt>
                  <dd className="text-gray-800">{field.thresholds.moistureMax}%</dd>
                </div>
              </dl>
            </div>
          </div>

          {field.openIncidentsCount > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                <span className="font-semibold">{field.openIncidentsCount}</span> open incident(s) for this field
              </p>
            </div>
          )}

          {field.lastIrrigation && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Last Irrigation</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Moisture Deficit: {field.lastIrrigation.moistureDeficit}%
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(field.lastIrrigation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
