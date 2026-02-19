import { useGetTasksQuery, useUpdateTaskStatusMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error, refetch } = useGetTasksQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const isSupervisorOrAdmin = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateTaskStatus({ id, status }).unwrap();
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

  if (error) {
    return (
      <Layout>
        <ErrorMessage message="Failed to load tasks" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>

        {!tasks || tasks.length === 0 ? (
          <EmptyState message="No tasks available" />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Field</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Due Date</th>
                    {isSupervisorOrAdmin && (
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-800">{task.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {task.fieldName || task.fieldId}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={task.priority} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center font-medium rounded-full px-2 py-0.5 text-xs ${
                            task.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </td>
                      {isSupervisorOrAdmin && (
                        <td className="py-3 px-4">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
