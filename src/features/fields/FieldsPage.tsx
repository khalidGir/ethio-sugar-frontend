import { useGetFieldsQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { Link } from 'react-router-dom';

export const FieldsPage: React.FC = () => {
  const { data: fields, isLoading, error } = useGetFieldsQuery();

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
        <ErrorMessage message="Failed to load fields" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  if (!fields || fields.length === 0) {
    return (
      <Layout>
        <EmptyState message="No fields available" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Fields</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field) => (
            <Link
              key={field.id}
              to={`/fields/${field.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{field.name}</h3>
                <StatusBadge status={field.status} size="sm" />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Crop:</span> {field.cropType}
                </p>
                {field.area && (
                  <p>
                    <span className="font-medium">Area:</span> {field.area} ha
                  </p>
                )}
                {field.location && (
                  <p>
                    <span className="font-medium">Location:</span> {field.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};
