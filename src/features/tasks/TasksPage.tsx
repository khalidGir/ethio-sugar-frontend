import React, { useState } from 'react';
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { CheckSquare, ChevronDown } from 'lucide-react';
import type { Task } from '../../types';

type PriorityFilter = 'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL';

const MOCK_TASKS: Task[] = [
  {
    id: '1', title: 'Irrigation Check', fieldId: '1', fieldName: 'Field A1',
    priority: 'CRITICAL', status: 'PENDING', dueDate: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString(),
  },
  {
    id: '2', title: 'Pesticide Application', fieldId: '2', fieldName: 'Field B3',
    priority: 'WARNING', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 172800000).toISOString(), createdAt: new Date().toISOString(),
  },
  {
    id: '3', title: 'Soil Testing', fieldId: '3', fieldName: 'Field C2',
    priority: 'NORMAL', status: 'PENDING', dueDate: new Date(Date.now() + 259200000).toISOString(), createdAt: new Date().toISOString(),
  },
  {
    id: '4', title: 'Equipment Inspection', fieldId: '4', fieldName: 'Field D1',
    priority: 'CRITICAL', status: 'PENDING', dueDate: new Date(Date.now() + 43200000).toISOString(), createdAt: new Date().toISOString(),
  },
  {
    id: '5', title: 'Weekly Field Review', fieldId: '1', fieldName: 'Field A1',
    priority: 'WARNING', status: 'COMPLETED', dueDate: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString(),
  },
  {
    id: '6', title: 'Drainage Maintenance', fieldId: '2', fieldName: 'Field B3',
    priority: 'NORMAL', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 345600000).toISOString(), createdAt: new Date().toISOString(),
  },
];

const taskStatusBadge: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
};

const rowBorderByPriority: Record<string, string> = {
  CRITICAL: 'border-l-4 border-l-red-500 bg-red-50/40',
  WARNING: 'border-l-4 border-l-amber-400 bg-amber-50/30',
  NORMAL: 'border-l-4 border-l-gray-200',
};

const priorityFilters: { label: string; value: PriorityFilter }[] = [
  { label: 'All Tasks', value: 'ALL' },
  { label: '🔴 Critical', value: 'CRITICAL' },
  { label: '🟡 Warning', value: 'WARNING' },
  { label: '🟢 Normal', value: 'NORMAL' },
];

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { data: apiTasks, isLoading, error, refetch } = useGetTasksQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [filter, setFilter] = useState<PriorityFilter>('ALL');
  const [useMockData, setUseMockData] = useState(false);

  const tasks = useMockData ? MOCK_TASKS : apiTasks;
  const isSupervisorOrAdmin = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';

  const handleStatusUpdate = async (id: string, status: string) => {
    if (useMockData) return;
    try {
      await updateTaskStatus({ id, status }).unwrap();
      refetch();
    } catch { }
  };

  const filteredTasks = tasks?.filter((t) =>
    filter === 'ALL' ? true : (t.priority?.toUpperCase() === filter)
  );

  if (isLoading && !useMockData) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error && !useMockData) {
    return (
      <Layout>
        <div className="space-y-4 p-2">
          <ErrorMessage message="Failed to load tasks" onRetry={() => window.location.reload()} />
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

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header + filter tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="page-header">Tasks</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setUseMockData(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${useMockData
                  ? 'bg-forest-50 border-forest-200 text-forest-700'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {useMockData ? '✓ Mock Data' : 'Use Mock Data'}
            </button>
            {priorityFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === value
                    ? 'bg-forest-500 text-white shadow-glow-green'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {!filteredTasks || filteredTasks.length === 0 ? (
          <div className="card">
            <EmptyState message="No tasks found" description="Try a different filter or check back later." />
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-gray-400" />
              <span className="section-title">
                {filter === 'ALL' ? 'All Tasks' : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Tasks`}
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                {filteredTasks.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Task</th>
                    <th className="table-header">Field</th>
                    <th className="table-header">Priority</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Due Date</th>
                    {isSupervisorOrAdmin && !useMockData && <th className="table-header">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const priorityKey = task.priority?.toUpperCase() ?? 'NORMAL';
                    const rowClass = rowBorderByPriority[priorityKey] ?? rowBorderByPriority.NORMAL;

                    return (
                      <tr key={task.id} className={`table-row hover:bg-gray-50 ${rowClass}`}>
                        <td className="table-cell font-semibold text-gray-900">{task.title}</td>
                        <td className="table-cell text-gray-600">{task.fieldName || task.fieldId}</td>
                        <td className="table-cell">
                          <StatusBadge status={task.priority} size="sm" />
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${taskStatusBadge[task.status] ?? 'bg-gray-100 text-gray-600'
                            }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="table-cell text-gray-500">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })
                            : '—'}
                        </td>
                        {isSupervisorOrAdmin && !useMockData && (
                          <td className="table-cell">
                            <div className="relative inline-block">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg pl-2 pr-7 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest-400 cursor-pointer appearance-none"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
