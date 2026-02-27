import React from 'react';
import { AuditLog } from '../../../types';
import { Calendar, User, Shield, Activity, Clock, ChevronRight, ChevronDown } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails?: (log: AuditLog) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  onViewDetails,
}) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof AuditLog;
    direction: 'asc' | 'desc';
  } | null>(null);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (key: keyof AuditLog) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Sort logs
  const sortedLogs = React.useMemo(() => {
    if (!sortConfig) return logs;

    return [...logs].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [logs, sortConfig]);

  const formatAction = (action: string) => {
    return action.charAt(0) + action.slice(1).toLowerCase();
  };

  const formatEntity = (entity: string) => {
    return entity.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700';
      case 'DELETE':
        return 'bg-red-50 text-red-700';
      case 'VIEW':
        return 'bg-gray-50 text-gray-700';
      case 'EXPORT':
        return 'bg-purple-50 text-purple-700';
      case 'LOGIN':
      case 'LOGOUT':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getSortIcon = (columnKey: keyof AuditLog) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No audit logs found</p>
        <p className="text-sm text-gray-400 mt-1">
          Audit logs will appear here as users interact with the system
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-10 py-3 px-4" />
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('createdAt')}
            >
              Timestamp{getSortIcon('createdAt')}
            </th>
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('userName')}
            >
              User{getSortIcon('userName')}
            </th>
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('action')}
            >
              Action{getSortIcon('action')}
            </th>
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort('entity')}
            >
              Entity{getSortIcon('entity')}
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Entity ID
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedLogs.map((log) => {
            const isExpanded = expandedRows.has(log.id);

            return (
              <React.Fragment key={log.id}>
                <tr
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetails?.(log)}
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(log.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{log.userName}</p>
                        <p className="text-xs text-gray-500">{log.userRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${getActionColor(
                        log.action
                      )}`}
                    >
                      {formatAction(log.action)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="w-4 h-4 text-gray-400" />
                      {formatEntity(log.entity)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                    {log.entityId.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(log.id);
                      }}
                      className="text-forest-600 hover:text-forest-700 text-sm font-medium"
                    >
                      {isExpanded ? 'Hide' : 'View'} Changes
                    </button>
                  </td>
                </tr>

                {/* Expanded Row with Changes */}
                {isExpanded && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 px-4 py-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Activity className="w-4 h-4" />
                          <span>Changes made to {formatEntity(log.entity)}</span>
                        </div>

                        {log.changes && log.changes.length > 0 ? (
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="text-left py-2 px-3 font-medium text-gray-700">
                                    Field
                                  </th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-700">
                                    Before
                                  </th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-700">
                                    After
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {log.changes.map((change, index) => (
                                  <tr key={index}>
                                    <td className="py-2 px-3 font-medium text-gray-900">
                                      {change.field}
                                    </td>
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
                        ) : (
                          <p className="text-sm text-gray-500 italic">No specific changes recorded</p>
                        )}

                        {/* Metadata */}
                        {(log.ipAddress || log.userAgent) && (
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                            {log.ipAddress && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">IP Address</p>
                                <p className="text-sm font-mono text-gray-700">{log.ipAddress}</p>
                              </div>
                            )}
                            {log.userAgent && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">User Agent</p>
                                <p className="text-sm text-gray-700 line-clamp-2">{log.userAgent}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
