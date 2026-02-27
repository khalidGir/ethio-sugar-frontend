import React, { useState } from 'react';
import {
  useGetDailyLogsQuery,
  useCreateDailyLogMutation,
  useVerifyDailyLogMutation,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { DailyLogForm } from './components/DailyLogForm';
import { DailyLogList } from './components/DailyLogList';
import { DailyLogVerification } from './components/DailyLogVerification';
import { FieldActivityTimeline } from './components/FieldActivityTimeline';
import { DailyLogFormData } from '../../schemas';
import { ClipboardCheck, Plus, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const DailyLogsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const { data: logs = [], isLoading, error, refetch } = useGetDailyLogsQuery();
  const [createDailyLog] = useCreateDailyLogMutation();
  const [verifyDailyLog] = useVerifyDailyLogMutation();

  const canSubmitLog = user?.role === 'WORKER' || user?.role === 'MANAGER' || user?.role === 'ADMIN';
  const canVerify = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const handleCreateLog = async (data: DailyLogFormData) => {
    try {
      await createDailyLog(data).unwrap();
      setShowLogForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create daily log:', err);
      throw err;
    }
  };

  const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    try {
      await verifyDailyLog({
        id,
        data: {
          status,
          rejectionReason: reason,
        },
      }).unwrap();
      setShowVerification(false);
      setSelectedLog(null);
      refetch();
    } catch (err) {
      console.error('Failed to verify log:', err);
      throw err;
    }
  };

  const handleViewDetails = (id: string) => {
    const log = logs.find((l) => l.id === id);
    if (log && canVerify) {
      setSelectedLog(log);
      setShowVerification(true);
    }
  };

  // Calculate statistics
  const totalLogs = logs.length;
  const pendingLogs = logs.filter((l) => l.status === 'PENDING').length;
  const verifiedLogs = logs.filter((l) => l.status === 'VERIFIED').length;
  const rejectedLogs = logs.filter((l) => l.status === 'REJECTED').length;
  const totalHours = logs.reduce((sum, log) => sum + log.hoursWorked, 0);

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load daily logs"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Daily Logs' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Daily Logs</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track and verify daily work activities
            </p>
          </div>
          {canSubmitLog && (
            <button
              onClick={() => setShowLogForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Daily Log
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                <p className="text-xs text-gray-500">Total Logs</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingLogs}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{verifiedLogs}</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedLogs}</p>
                <p className="text-xs text-gray-500">Rejected</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Total Hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-forest-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-forest-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Timeline View
          </button>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="card">
            <h2 className="section-title mb-4">Work Logs</h2>
            {logs.length > 0 ? (
              <DailyLogList
                logs={logs}
                onViewDetails={handleViewDetails}
                onVerify={canVerify ? handleVerify : undefined}
                showVerification={canVerify}
              />
            ) : (
              <EmptyState
                message="No daily logs yet"
                description={
                  canSubmitLog
                    ? 'Submit your first daily log to track work activities'
                    : 'No logs have been submitted yet'
                }
                actionLabel={canSubmitLog ? 'Submit Log' : undefined}
                onAction={() => setShowLogForm(true)}
              />
            )}
          </div>
        ) : (
          <div className="card">
            <h2 className="section-title mb-4">Activity Timeline</h2>
            <FieldActivityTimeline logs={logs} />
          </div>
        )}
      </div>

      {/* Submit Log Modal */}
      {showLogForm && canSubmitLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DailyLogForm onSubmit={handleCreateLog} onCancel={() => setShowLogForm(false)} />
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerification && selectedLog && (
        <DailyLogVerification
          log={selectedLog}
          onVerify={handleVerify}
          onCancel={() => {
            setShowVerification(false);
            setSelectedLog(null);
          }}
        />
      )}
    </Layout>
  );
};
