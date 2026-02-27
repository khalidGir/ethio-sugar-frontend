import React, { useState } from 'react';
import { DailyLog } from '../../../types';
import { DailyLogCard } from './DailyLogCard';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

interface DailyLogListProps {
  logs: DailyLog[];
  onViewDetails?: (id: string) => void;
  onVerify?: (id: string, status: 'VERIFIED' | 'REJECTED') => void;
  showVerification?: boolean;
}

export const DailyLogList: React.FC<DailyLogListProps> = ({
  logs,
  onViewDetails,
  onVerify,
  showVerification = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<string>('all');

  // Extract unique fields from logs
  const uniqueFields = Array.from(
    new Set(logs.map((log) => log.fieldName).filter(Boolean))
  );

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesField =
      fieldFilter === 'all' || log.fieldName === fieldFilter;

    return matchesSearch && matchesStatus && matchesField;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by worker or activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="relative sm:w-40">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Field Filter */}
        <div className="relative sm:w-48">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none"
          >
            <option value="all">All Fields</option>
            {uniqueFields.map((fieldName) => (
              <option key={fieldName} value={fieldName}>
                {fieldName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filteredLogs.length} of {logs.length} logs
      </p>

      {/* Logs Grid */}
      {filteredLogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLogs.map((log) => (
            <DailyLogCard
              key={log.id}
              log={log}
              onViewDetails={onViewDetails}
              onVerify={onVerify}
              showVerification={showVerification}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No logs found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
};
