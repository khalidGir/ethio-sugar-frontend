import React, { useState } from 'react';
import { X, Download, FileText, Table, Calendar, Filter } from 'lucide-react';

interface ExportModalProps {
  resourceType: 'daily-logs' | 'fertilizer-logs' | 'crop-plans' | 'soil-data';
  onClose: () => void;
  onSuccess: (downloadUrl: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  resourceType,
  onClose,
  onSuccess,
}) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [fieldId, setFieldId] = useState('');
  const [season, setSeason] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const resourceLabels = {
    'daily-logs': 'Daily Logs',
    'fertilizer-logs': 'Fertilizer Logs',
    'crop-plans': 'Crop Plans',
    'soil-data': 'Soil Data',
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (fieldId) params.append('fieldId', fieldId);
      if (season) params.append('season', season);

      // In production, this would trigger actual download
      // For now, simulate with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulated download URL
      const downloadUrl = `/api/v1/${resourceType}/export?${params.toString()}`;
      
      // In production:
      // const response = await fetch(downloadUrl, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${resourceType}-${dateRange.startDate}.csv`;
      // link.click();

      onSuccess(downloadUrl);
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export {resourceLabels[resourceType]}</h2>
            <p className="text-sm text-gray-500 mt-1">Download your data in CSV or PDF format</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="label">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`
                  p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${format === 'csv'
                    ? 'border-forest-400 bg-forest-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <Table className={`w-6 h-6 ${format === 'csv' ? 'text-forest-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">CSV</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`
                  p-4 rounded-xl border-2 transition-all flex items-center gap-3
                  ${format === 'pdf'
                    ? 'border-forest-400 bg-forest-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <FileText className={`w-6 h-6 ${format === 'pdf' ? 'text-forest-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">PDF</p>
                  <p className="text-xs text-gray-500">Document format</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Date Range</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="label text-xs">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="label text-xs">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          </div>

          {/* Field Filter */}
          <div>
            <label className="label">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                Filter by Field <span className="text-gray-400">(optional)</span>
              </div>
            </label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Fields</option>
              <option value="field-1">Field 1 - Sector A</option>
              <option value="field-2">Field 2 - Sector B</option>
              <option value="field-3">Field 3 - North Block</option>
              {/* Add more fields as needed */}
            </select>
          </div>

          {/* Season Filter (for crop plans) */}
          {resourceType === 'crop-plans' && (
            <div>
              <label className="label">
                Season <span className="text-gray-400">(optional)</span>
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Seasons</option>
                <option value="BELG">Belg</option>
                <option value="MEHER">Meher</option>
                <option value="BEGA">Bega</option>
                <option value="YEAR_ROUND">Year Round</option>
              </select>
            </div>
          )}

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Export Preview</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>📄 Format: <strong>{format.toUpperCase()}</strong></p>
              <p>📅 Date Range: <strong>{dateRange.startDate} to {dateRange.endDate}</strong></p>
              {fieldId && <p>📍 Field: <strong>{fieldId}</strong></p>}
              {season && <p>🌾 Season: <strong>{season}</strong></p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 justify-end p-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-6 py-2.5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary px-6 py-2.5 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
