import React, { useState } from 'react';
import { useGetReportsQuery, useGenerateReportMutation, useGetScheduledReportsQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { ReportGenerator } from './components/ReportGenerator';
import { ReportViewer } from './components/ReportViewer';
import { DailyReport } from './components/DailyReport';
import { GenerateReportFormData } from '../../schemas';
import { FileText, Plus, Download, Clock, Calendar, BarChart3 } from 'lucide-react';

export const ReportsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');

  const { data: reports = [], isLoading, error, refetch } = useGetReportsQuery();
  const { data: scheduledReports } = useGetScheduledReportsQuery();
  const [generateReport] = useGenerateReportMutation();

  const canGenerate = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.role === 'MANAGER';

  // Filter reports
  const filteredReports =
    reportTypeFilter === 'all'
      ? reports
      : reports.filter((r) => r.type === reportTypeFilter);

  const uniqueTypes = Array.from(new Set(reports.map((r) => r.type)));

  const handleGenerate = async (data: GenerateReportFormData) => {
    try {
      await generateReport(data).unwrap();
      setShowGenerator(false);
      refetch();
    } catch (err) {
      console.error('Failed to generate report:', err);
      throw err;
    }
  };

  const handleDownload = (id: string) => {
    console.log('Download report:', id);
    // Implement download logic
  };

  const formatType = (type: string) => {
    return type.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load reports"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Reports' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Generate and view farm performance reports
            </p>
          </div>
          {canGenerate && (
            <button
              onClick={() => setShowGenerator(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Report
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                <p className="text-xs text-gray-500">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter((r) => r.status === 'COMPLETED').length}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter((r) => r.status === 'PENDING').length}
                </p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledReports?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Scheduled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        {scheduledReports && scheduledReports.length > 0 && (
          <div className="card">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Scheduled Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      {report.frequency}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${report.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {formatType(report.type)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Next: {new Date(report.nextScheduled).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        {uniqueTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
              className="input-field py-2 px-3 text-sm"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {formatType(type)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reports List */}
        <div className="card">
          <h2 className="section-title mb-4">Generated Reports</h2>
          {filteredReports.length > 0 ? (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-forest-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatType(report.type)} •{' '}
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                    {report.status === 'COMPLETED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report.id);
                        }}
                        className="p-2 text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                        aria-label="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message="No reports available"
              description={
                canGenerate
                  ? 'Generate your first report to view farm analytics'
                  : 'No reports have been generated yet'
              }
              actionLabel={canGenerate ? 'Generate Report' : undefined}
              onAction={() => setShowGenerator(true)}
            />
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerator && canGenerate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ReportGenerator
              onSubmit={handleGenerate}
              onCancel={() => setShowGenerator(false)}
            />
          </div>
        </div>
      )}

      {/* Report Viewer Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <ReportViewer
              report={selectedReport}
              onDownload={handleDownload}
              onClose={() => setSelectedReport(null)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

// CheckCircle needs to be imported
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
