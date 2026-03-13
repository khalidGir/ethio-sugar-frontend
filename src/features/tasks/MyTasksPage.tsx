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
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  fieldName?: string;
  fieldId?: string;
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  HIGH: { label: '🔴 High', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  MEDIUM: { label: '🟡 Medium', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  LOW: { label: '🟢 Low', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading, error, refetch } = useGetMyTasksQuery(undefined);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleStatusChange = async (id: string, newStatus: Task['status']) => {
    try {
      await updateTaskStatus({ id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load tasks" onRetry={() => window.location.reload()} /></Layout>;

  const openTasks = tasks?.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS') || [];
  const completedTasks = tasks?.filter(t => t.status === 'COMPLETED') || [];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const highPriorityTasks = openTasks.filter(t => t.priority === 'HIGH');
  const mediumPriorityTasks = openTasks.filter(t => t.priority === 'MEDIUM');
  const lowPriorityTasks = openTasks.filter(t => t.priority === 'LOW');

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

        {/* High Priority Tasks */}
        {highPriorityTasks.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center justify-between px-1">
              <span>High Priority Tasks</span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{highPriorityTasks.length}</span>
            </h2>
            <div className="space-y-3">
              {highPriorityTasks.map((task) => (
                <WorkerTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} isCritical />
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority */}
        {mediumPriorityTasks.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center justify-between px-1 mt-6">
              <span>Medium Priority Tasks</span>
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{mediumPriorityTasks.length}</span>
            </h2>
            <div className="space-y-3">
              {mediumPriorityTasks.map((task) => (
                <WorkerTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        )}

        {/* Low Priority */}
        {lowPriorityTasks.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center justify-between px-1 mt-6">
              <span>Standard Tasks</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{lowPriorityTasks.length}</span>
            </h2>
            <div className="space-y-3">
              {lowPriorityTasks.map((task) => (
                <WorkerTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between px-1 mt-8">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <WorkerTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} isCompleted />
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

type WorkerTaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  isCritical?: boolean;
  isCompleted?: boolean;
};

const WorkerTaskCard: React.FC<WorkerTaskCardProps> = ({ task, onStatusChange, isCritical, isCompleted }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border-2 transition-all ${
      isCompleted ? 'bg-gray-50 border-emerald-100/50 opacity-75' 
      : task.status === 'IN_PROGRESS' ? 'bg-white border-amber-300 shadow-md'
      : isCritical ? 'bg-white border-red-300 shadow-sm'
      : 'bg-white border-gray-200 shadow-sm hover:border-forest-300'
    }`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold text-gray-900 leading-tight ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.fieldName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold mt-2">
                <ClipboardList className="w-3.5 h-3.5 text-gray-500" />
                {task.fieldName}
              </span>
            )}
          </div>
          
          {/* Status Pillar Badge */}
          {isCompleted ? (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wide">
              🟢 Done
            </span>
          ) : task.status === 'IN_PROGRESS' ? (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wide animate-pulse">
              🟡 Doing
            </span>
          ) : (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-extrabold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wide">
              ⚪ To Do
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed hidden sm:block">
            {task.description}
          </p>
        )}
      </div>

      {/* Massive Mobile-First Action Area */}
      {!isCompleted && (
        <div className="grid grid-cols-2 bg-gray-50 border-t border-gray-100">
          {task.status !== 'IN_PROGRESS' ? (
            <button
              onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
              className="col-span-2 sm:col-span-1 p-4 font-bold text-amber-700 hover:bg-amber-100 text-center transition-colors min-h-[60px] flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              Start Working
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(task.id, 'PENDING')}
              className="col-span-2 sm:col-span-1 p-4 font-bold text-gray-600 hover:bg-gray-200 border-b sm:border-b-0 sm:border-r border-gray-200 text-center transition-colors min-h-[60px]"
            >
              Pause
            </button>
          )}

          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task.id, 'COMPLETED')}
              className="col-span-2 sm:col-span-1 p-4 font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 text-center transition-colors min-h-[60px] flex items-center justify-center gap-2 text-lg"
            >
              <CheckCircle className="w-6 h-6" />
              Complete Task
            </button>
          )}

          {task.status !== 'IN_PROGRESS' && (
            <a
              href={`/report-issue?fieldId=${task.fieldId || ''}&taskTitle=${encodeURIComponent(task.title)}`}
              className="col-span-2 sm:col-span-1 p-4 font-bold text-red-600 hover:bg-red-50 sm:border-l border-gray-200 text-center transition-colors min-h-[60px] flex items-center justify-center border-t sm:border-t-0"
            >
              Report Delayed / Issue
            </a>
          )}
        </div>
      )}
    </div>
  );
};
