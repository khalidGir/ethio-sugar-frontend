import React, { useState } from 'react';
import { useGetTasksQuery, useUpdateTaskStatusMutation, useGetMyTasksQuery, useGetFieldsQuery, useCreateTaskMutation, useGetUsersQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import { CheckSquare, ChevronDown, Plus, X } from 'lucide-react';
import type { Task } from '../../types';

type PriorityFilter = 'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL';

const taskStatusBadge: Record<string, string> = {
  OPEN: 'bg-amber-100 text-amber-800 border border-amber-200',
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
  const { data: allTasks, isLoading, error, refetch } = useGetTasksQuery(undefined);
  const { data: myTasks } = useGetMyTasksQuery(undefined);
  const { data: fields } = useGetFieldsQuery();
  const { data: users } = useGetUsersQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [createTask] = useCreateTaskMutation();
  const [filter, setFilter] = useState<PriorityFilter>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    fieldId: '',
    assignedToId: '',
    priority: 'NORMAL' as 'NORMAL' | 'WARNING' | 'CRITICAL',
  });

  const tasks = user?.role === 'WORKER' ? myTasks : allTasks;
  const isSupervisorOrAdmin = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const workers = users?.filter(u => u.role === 'WORKER');

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateTaskStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.fieldId) return;
    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        fieldId: newTask.fieldId,
        assignedToId: newTask.assignedToId || undefined,
        priority: newTask.priority,
      }).unwrap();
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', fieldId: '', assignedToId: '', priority: 'NORMAL' });
      refetch();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const filteredTasks = tasks?.filter((t) =>
    filter === 'ALL' ? true : (t.priority?.toUpperCase() === filter)
  );

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error) {
    return (
      <Layout>
        <ErrorMessage message="Failed to load tasks" onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="page-header">Tasks</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {isSupervisorOrAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-500 text-white shadow-glow-green hover:bg-forest-600"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            )}
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
                    {isSupervisorOrAdmin && <th className="table-header">Action</th>}
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
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${taskStatusBadge[task.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="table-cell text-gray-500">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })
                            : '—'}
                        </td>
                        {isSupervisorOrAdmin && (
                          <td className="table-cell">
                            <div className="relative inline-block">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg pl-2 pr-7 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest-400 cursor-pointer appearance-none"
                              >
                                <option value="OPEN">Open</option>
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Task</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <select
                  value={newTask.fieldId}
                  onChange={(e) => setNewTask({ ...newTask, fieldId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400"
                >
                  <option value="">Select field</option>
                  {fields?.map((field) => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Worker (optional)</label>
                <select
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400"
                >
                  <option value="">Unassigned</option>
                  {workers?.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="WARNING">Warning</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <button
                onClick={handleCreateTask}
                className="w-full py-2 bg-forest-500 text-white rounded-lg font-semibold hover:bg-forest-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
