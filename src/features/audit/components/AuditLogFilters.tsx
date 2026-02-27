import React from 'react';
import { AuditLog, AuditAction, EntityType } from '../../../types';
import { Search, Filter, User, Shield, Calendar, Activity } from 'lucide-react';

interface AuditLogFiltersProps {
  logs: AuditLog[];
  onFilterChange: (filters: AuditFilters) => void;
}

export interface AuditFilters {
  search: string;
  userId: string;
  action: string;
  entity: string;
  startDate: string;
  endDate: string;
}

const ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'VIEW', label: 'View' },
  { value: 'EXPORT', label: 'Export' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
];

const ENTITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'USER', label: 'User' },
  { value: 'FIELD', label: 'Field' },
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'TASK', label: 'Task' },
  { value: 'IRRIGATION', label: 'Irrigation' },
  { value: 'SOIL_DATA', label: 'Soil Data' },
  { value: 'FERTILIZER', label: 'Fertilizer' },
  { value: 'CROP_PLAN', label: 'Crop Plan' },
  { value: 'DAILY_LOG', label: 'Daily Log' },
  { value: 'REPORT', label: 'Report' },
];

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  logs,
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState<AuditFilters>({
    search: '',
    userId: 'all',
    action: 'all',
    entity: 'all',
    startDate: '',
    endDate: '',
  });

  const [showFilters, setShowFilters] = React.useState(false);

  // Extract unique users from logs
  const uniqueUsers = Array.from(
    new Set(logs.map((log) => log.userId))
  ).map((userId) => {
    const log = logs.find((l) => l.userId === userId);
    return {
      id: userId,
      name: log?.userName || userId,
    };
  });

  const handleFilterChange = (key: keyof AuditFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      userId: 'all',
      action: 'all',
      entity: 'all',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.userId !== 'all' ||
    filters.action !== 'all' ||
    filters.entity !== 'all' ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="space-y-4">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, entity, or action..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-forest-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                User
              </label>
              <select
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="input-field"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="inline w-4 h-4 mr-1" />
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="input-field"
              >
                <option value="all">All Actions</option>
                {ACTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Entity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="inline w-4 h-4 mr-1" />
                Entity
              </label>
              <select
                value={filters.entity}
                onChange={(e) => handleFilterChange('entity', e.target.value)}
                className="input-field"
              >
                <option value="all">All Entities</option>
                {ENTITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
