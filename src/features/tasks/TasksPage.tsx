import React, { useState } from 'react';
import { useGetTasksQuery, useUpdateTaskStatusMutation, useGetMyTasksQuery, useGetFieldsQuery, useCreateTaskMutation, useGetUsersQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { TaskCard } from '../../components/TaskCard';
import { Layout } from '../../components/Layout';
import { CheckSquare, ChevronDown, Plus, X, CheckCheck, Search } from 'lucide-react';

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
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { data: allTasks, isLoading, error, refetch } = useGetTasksQuery(undefined);
  const { data: myTasks } = useGetMyTasksQuery(undefined);
  const { data: fields } = useGetFieldsQuery();
  const { data: users } = useGetUsersQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [createTask] = useCreateTaskMutation();
  const [filter, setFilter] = useState<PriorityFilter>('ALL');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    fieldId: '',
    assignedToId: '',
    priority: 'NORMAL' as 'NORMAL' | 'WARNING' | 'CRITICAL',
  });

  const tasks = user?.role === 'WORKER' ? myTasks : allTasks;
  const isSupervisorOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';
  const workers = users?.filter(u => u.role === 'WORKER');

  const toggleTaskSelection = (id: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTasks(newSelected);
  };

  const selectAll = () => {
    if (selectedTasks.size === filteredTasks?.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks?.map(t => t.id) || []));
    }
  };

  const handleBulkComplete = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map(id => updateTaskStatus({ id, status: 'COMPLETED' }).unwrap())
      );
      setSelectedTasks(new Set());
      refetch();
    } catch (err) {
      console.error('Failed to complete tasks:', err);
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

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const filteredTasks = tasks?.filter((t) => {
    const matchesFilter = filter === 'ALL' || t.priority?.toUpperCase() === filter;
    const matchesSearch = search === '' || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.fieldName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Tasks' }]} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="page-header">Tasks</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px] w-48 lg:w-64"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSupervisorOrAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-forest-500 text-white shadow-glow-green hover:bg-forest-600 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Task</span>
              </button>
            )}
            {priorityFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${filter === value
                    ? 'bg-forest-500 text-white shadow-glow-green'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
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
        ) : isMobile ? (
          // Mobile card view
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <CheckSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {filter === 'ALL' ? 'All Tasks' : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Tasks`}
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                {filteredTasks.length}
              </span>
            </div>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={isSupervisorOrAdmin ? handleStatusUpdate : undefined}
              />
            ))}
          </div>
        ) : (
          // Desktop table view
          <div className="card p-0 overflow-hidden">
            {/* Bulk actions bar */}
            {selectedTasks.size > 0 && (
              <div className="px-6 py-3 bg-forest-50 border-b border-forest-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-forest-800">
                  {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkComplete}
                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => setSelectedTasks(new Set())}
                    className="px-3 py-1.5 text-forest-700 hover:bg-forest-100 rounded-lg text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              {isSupervisorOrAdmin && (
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks?.length && filteredTasks?.length! > 0}
                  onChange={selectAll}
                  className="w-4 h-4 rounded border-gray-300 text-forest-500 focus:ring-forest-400"
                />
              )}
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
                    {isSupervisorOrAdmin && <th className="table-header w-10"></th>}
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
                    const isSelected = selectedTasks.has(task.id);

                    return (
                      <tr key={task.id} className={`table-row hover:bg-gray-50 ${rowClass} ${isSelected ? 'bg-forest-50' : ''}`}>
                        {isSupervisorOrAdmin && (
                          <td className="table-cell">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTaskSelection(task.id)}
                              className="w-4 h-4 rounded border-gray-300 text-forest-500 focus:ring-forest-400"
                            />
                          </td>
                        )}
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

            {/* Quick priority selector */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'NORMAL', label: 'Normal', color: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
                  { value: 'WARNING', label: 'Warning', color: 'bg-amber-50 border-amber-300 text-amber-700' },
                  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-50 border-red-300 text-red-700' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewTask({ ...newTask, priority: opt.value as any })}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      newTask.priority === opt.value
                        ? `border-2 ${opt.color} ring-2 ring-offset-1 ring-${opt.value === 'CRITICAL' ? 'red' : opt.value === 'WARNING' ? 'amber' : 'emerald'}-400`
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.value === 'CRITICAL' ? '🔴' : opt.value === 'WARNING' ? '🟡' : '🟢'} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px] text-base"
                  placeholder="e.g., Spray pesticides"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field *</label>
                <select
                  value={newTask.fieldId}
                  onChange={(e) => setNewTask({ ...newTask, fieldId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px] text-base"
                >
                  <option value="">Select field</option>
                  {fields?.map((field) => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Worker</label>
                <select
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px] text-base"
                >
                  <option value="">Unassigned</option>
                  {workers?.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[80px] text-base"
                  placeholder="Add details..."
                  rows={2}
                />
              </div>

              <button
                onClick={handleCreateTask}
                disabled={!newTask.title || !newTask.fieldId}
                className="w-full py-3 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
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
