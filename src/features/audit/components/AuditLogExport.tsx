import React, { useState } from 'react';
import { AuditLog } from '../../../types';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';

interface AuditLogExportProps {
  logs: AuditLog[];
  onClose: () => void;
}

export const AuditLogExport: React.FC<AuditLogExportProps> = ({ logs, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const filteredLogs = logs.filter((log) => {
    if (!dateRange.startDate && !dateRange.endDate) return true;
    const logDate = new Date(log.createdAt);
    if (dateRange.startDate && logDate < new Date(dateRange.startDate)) return false;
    if (dateRange.endDate && logDate > new Date(dateRange.endDate)) return false;
    return true;
  });

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      const headers = [
        'Timestamp',
        'User',
        'Role',
        'Action',
        'Entity',
        'Entity ID',
        'IP Address',
        'Changes',
      ];

      const rows = filteredLogs.map((log) => [
        new Date(log.createdAt).toLocaleString(),
        log.userName,
        log.userRole,
        log.action,
        log.entity,
        log.entityId,
        log.ipAddress || 'N/A',
        log.changes ? JSON.stringify(log.changes) : 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((cell) => {
              const escaped = String(cell).replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(',')
        ),
      ].join('\n');

      downloadFile(csvContent, 'audit-logs.csv', 'text/csv');
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);

    try {
      const jsonContent = JSON.stringify(filteredLogs, null, 2);
      downloadFile(jsonContent, 'audit-logs.json', 'application/json');
    } catch (error) {
      console.error('Failed to export JSON:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Export Audit Logs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('csv')}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                  format === 'csv'
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileSpreadsheet
                  className={`w-6 h-6 ${
                    format === 'csv' ? 'text-forest-600' : 'text-gray-400'
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`font-medium ${
                      format === 'csv' ? 'text-forest-700' : 'text-gray-700'
                    }`}
                  >
                    CSV
                  </p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>

              <button
                onClick={() => setFormat('json')}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                  format === 'json'
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText
                  className={`w-6 h-6 ${
                    format === 'json' ? 'text-forest-600' : 'text-gray-400'
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`font-medium ${
                      format === 'json' ? 'text-forest-700' : 'text-gray-700'
                    }`}
                  >
                    JSON
                  </p>
                  <p className="text-xs text-gray-500">Structured data</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Leave both empty to export all logs
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Logs to export:</span>
              <span className="text-lg font-bold text-gray-900">
                {filteredLogs.length}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredLogs.length === 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};
