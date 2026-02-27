import React, { useState } from 'react';
import { useGetAuditLogsQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { AuditLogFilters, AuditFilters } from './components/AuditLogFilters';
import { AuditLogTable } from './components/AuditLogTable';
import { AuditLogExport } from './components/AuditLogExport';
import { AuditLog } from '../../types';
import { Shield, Download, Activity, User, AlertTriangle } from 'lucide-react';

export const AuditLogsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    userId: 'all',
    action: 'all',
    entity: 'all',
    startDate: '',
    endDate: '',
  });

  const { data: logs = [], isLoading, error } = useGetAuditLogsQuery(filters as any);

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  // Apply search filter
  const filteredLogs = logs.filter((log) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      log.userName.toLowerCase().includes(searchLower) ||
      log.entity.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const totalLogs = filteredLogs.length;
  const uniqueUsers = new Set(filteredLogs.map((log) => log.userId)).size;
  const actionsCount = filteredLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const createCount = actionsCount['CREATE'] || 0;
  const updateCount = actionsCount['UPDATE'] || 0;
  const deleteCount = actionsCount['DELETE'] || 0;

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500">You don't have permission to view audit logs.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load audit logs"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Audit Logs' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Audit Logs</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              System activity trail and compliance tracking
            </p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-primary flex items-center gap-2"
            disabled={totalLogs === 0}
          >
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                <p className="text-xs text-gray-500">Total Logs</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
                <p className="text-xs text-gray-500">Active Users</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{createCount}</p>
                <p className="text-xs text-gray-500">Created</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{updateCount}</p>
                <p className="text-xs text-gray-500">Updated</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{deleteCount}</p>
                <p className="text-xs text-gray-500">Deleted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AuditLogFilters logs={logs} onFilterChange={setFilters} />

        {/* Audit Log Table */}
        <div className="card">
          <h2 className="section-title mb-4">Activity Log</h2>
          {filteredLogs.length > 0 ? (
            <AuditLogTable
              logs={filteredLogs}
              onViewDetails={(log) => setSelectedLog(log)}
            />
          ) : (
            <EmptyState
              message="No audit logs found"
              description="Try adjusting your filters or date range"
              icon={Shield}
            />
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <AuditLogExport
          logs={filteredLogs}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">User</p>
                    <p className="font-medium text-gray-900">{selectedLog.userName}</p>
                    <p className="text-xs text-gray-500">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Action</p>
                    <span className="inline-block px-2.5 py-1 bg-forest-50 text-forest-700 rounded-md text-sm font-medium">
                      {selectedLog.action}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Entity</p>
                    <p className="font-medium text-gray-900">{selectedLog.entity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Entity ID</p>
                    <p className="font-mono text-sm text-gray-700">{selectedLog.entityId}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Timestamp</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">IP Address</p>
                    <p className="font-mono text-sm text-gray-700">{selectedLog.ipAddress}</p>
                  </div>
                )}

                {selectedLog.changes && selectedLog.changes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Changes</p>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Field</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Before</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">After</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedLog.changes.map((change, index) => (
                            <tr key={index}>
                              <td className="py-2 px-3 font-medium text-gray-900">{change.field}</td>
                              <td className="py-2 px-3 text-gray-600">
                                {change.oldValue !== null && change.oldValue !== undefined
                                  ? String(change.oldValue)
                                  : '-'}
                              </td>
                              <td className="py-2 px-3 text-gray-900">
                                {change.newValue !== null && change.newValue !== undefined
                                  ? String(change.newValue)
                                  : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
