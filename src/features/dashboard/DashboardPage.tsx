import { useGetDashboardSummaryQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

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
        <ErrorMessage message="Failed to load dashboard data" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <EmptyState message="No dashboard data available" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Incidents Today</p>
            <p className="text-3xl font-bold text-gray-800">{data.totalIncidentsToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Open Incidents</p>
            <p className="text-3xl font-bold text-red-600">{data.openIncidents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Critical Fields</p>
            <p className="text-3xl font-bold text-red-600">{data.criticalFieldsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <p className="text-3xl font-bold text-yellow-600">{data.pendingTasksCount}</p>
          </div>
        </div>

        {/* Latest Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Incidents</h2>
          {data.latestIncidents.length === 0 ? (
            <EmptyState message="No incidents reported today" />
          ) : (
            <div className="space-y-3">
              {data.latestIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{incident.type}</p>
                    <p className="text-sm text-gray-600">{incident.fieldName || incident.fieldId}</p>
                  </div>
                  <StatusBadge status={incident.severity} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Tasks</h2>
          {data.latestTasks.length === 0 ? (
            <EmptyState message="No tasks available" />
          ) : (
            <div className="space-y-3">
              {data.latestTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.fieldName || task.fieldId}</p>
                  </div>
                  <StatusBadge status={task.priority} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
