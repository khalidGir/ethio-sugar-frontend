import React from 'react';
import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { Layout } from '../../components/Layout';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'COMPLETED';
  priority: 'NORMAL' | 'WARNING' | 'CRITICAL';
  dueDate?: string;
  fieldName?: string;
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: '🔴 Critical', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  WARNING: { label: '🟡 Warning', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  NORMAL: { label: '🟢 Normal', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error, refetch } = useGetMyTasksQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleComplete = async (id: string) => {
    try {
      await updateTaskStatus({ id, status: 'COMPLETED' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load tasks" onRetry={() => window.location.reload()} /></Layout>;

  const openTasks = tasks?.filter(t => t.status === 'OPEN') || [];
  const completedTasks = tasks?.filter(t => t.status === 'COMPLETED') || [];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const criticalTasks = openTasks.filter(t => t.priority === 'CRITICAL');
  const warningTasks = openTasks.filter(t => t.priority === 'WARNING');
  const normalTasks = openTasks.filter(t => t.priority === 'NORMAL');

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">My Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-forest-600">{completedTasks.length}/{tasks?.length || 0}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="card py-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-forest-500" />
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forest-500 to-forest-400 rounded-full transition-all duration-500"
                style={{ width: `${tasks && tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {tasks && tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Critical Tasks */}
        {criticalTasks.length > 0 && (
          <div>
            <h2 className="section-title flex items-center gap-2 mb-3">
              <span className="text-red-500">🔴</span> Critical Priority
              <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{criticalTasks.length}</span>
            </h2>
            <div className="space-y-2">
              {criticalTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} isCritical />
              ))}
            </div>
          </div>
        )}

        {/* Warning Tasks */}
        {warningTasks.length > 0 && (
          <div>
            <h2 className="section-title flex items-center gap-2 mb-3">
              <span className="text-amber-500">🟡</span> Warning Priority
              <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">{warningTasks.length}</span>
            </h2>
            <div className="space-y-2">
              {warningTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} />
              ))}
            </div>
          </div>
        )}

        {/* Normal Tasks */}
        {normalTasks.length > 0 && (
          <div>
            <h2 className="section-title flex items-center gap-2 mb-3">
              <span className="text-emerald-500">🟢</span> Normal Priority
              <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{normalTasks.length}</span>
            </h2>
            <div className="space-y-2">
              {normalTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="section-title flex items-center gap-2 mb-3 text-gray-500">
              <CheckCircle className="w-4 h-4" /> Completed
              <span className="ml-auto px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">{completedTasks.length}</span>
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onComplete={handleComplete} isCompleted />
              ))}
            </div>
          </div>
        )}

        {!tasks || tasks.length === 0 ? (
          <div className="card">
            <EmptyState
              message="No tasks assigned"
              description="Check back later or contact your supervisor."
            />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

type TaskCardProps = {
  task: Task;
  onComplete: (id: string) => void;
  isCritical?: boolean;
  isCompleted?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, isCritical, isCompleted }) => {
  const config = priorityConfig[task.priority];

  return (
    <div className={`card border-l-4 ${isCritical ? 'border-l-red-500 bg-red-50/30' : 'border-l-forest-300'} ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through' : ''}`}>{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {task.fieldName && (
              <span className="flex items-center gap-1">
                <ClipboardList className="w-3 h-3" />
                {task.fieldName}
              </span>
            )}
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${isCompleted ? 'text-gray-400' : 'text-forest-600 font-medium'}`}>
                <Clock className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        {!isCompleted && task.status === 'OPEN' && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-shrink-0 px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors min-h-[44px] min-w-[100px] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Done
          </button>
        )}
        {isCompleted && (
          <span className="flex-shrink-0 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Done
          </span>
        )}
      </div>
    </div>
  );
};
