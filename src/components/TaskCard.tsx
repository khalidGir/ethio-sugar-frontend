import React from 'react';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, status: string) => void;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onClick }) => {
  const formatDueDate = (dateString?: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id, 'COMPLETED');
    }
  };

  const handleReopen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task.id, 'OPEN');
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</h3>
        <StatusBadge status={task.priority} size="sm" />
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <span>{task.fieldName || task.fieldId || 'Unknown Field'}</span>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <span>Due: {formatDueDate(task.dueDate)}</span>
        </div>
      </div>

      {onStatusChange && (
        <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100">
          {task.status === 'COMPLETED' ? (
            <button
              onClick={handleReopen}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors min-h-[44px]"
              aria-label={`Reopen task: ${task.title}`}
            >
              Reopen
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors min-h-[44px]"
              aria-label={`Mark task complete: ${task.title}`}
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
