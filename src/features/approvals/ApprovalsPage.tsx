import React, { useState } from 'react';
import {
  useGetPendingVerificationsQuery,
  useBatchVerifyLogsMutation,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { CheckCircle, XCircle, Clock, Users, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface VerificationFilters {
  fieldId?: string;
  workerId?: string;
  dateRange?: { start: string; end: string };
  sortBy?: 'loggedAt' | 'hoursSpent' | 'workerName';
  order?: 'asc' | 'desc';
}

export const ApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState<VerificationFilters>({});

  const {
    data: verificationData,
    isLoading,
    error,
    refetch,
  } = useGetPendingVerificationsQuery({
    ...filters,
    page: 1,
    limit: 50,
  });

  const [batchVerify, { isLoading: isVerifying }] = useBatchVerifyLogsMutation();

  const logs = verificationData?.data?.logs || [];
  const pagination = verificationData?.data?.pagination;

  const handleSelectLog = (logId: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogIds.length === logs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(logs.map((log) => log.id));
    }
  };

  const handleBatchApprove = async () => {
    if (selectedLogIds.length === 0) return;

    try {
      const result = await batchVerify({
        logIds: selectedLogIds,
        status: 'VERIFIED',
        reason: 'Batch approved by supervisor',
      }).unwrap();

      // Show success toast
      const successCount = result.data.verified.length;
      const notFoundCount = result.data.notFound.length;

      if (successCount > 0) {
        alert(`✓ Successfully verified ${successCount} log(s)`);
      }
      if (notFoundCount > 0) {
        alert(`⚠ ${notFoundCount} log(s) not found (may have been already verified)`);
      }

      setSelectedLogIds([]);
      refetch();
    } catch (err: any) {
      alert(`✗ Failed to verify logs: ${err.data?.message || err.message}`);
    }
  };

  const handleBatchReject = async () => {
    if (selectedLogIds.length === 0) return;

    try {
      const result = await batchVerify({
        logIds: selectedLogIds,
        status: 'REJECTED',
        reason: rejectionReason || 'Rejected by supervisor',
      }).unwrap();

      alert(`✓ Successfully rejected ${result.data.verified.length} log(s)`);
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedLogIds([]);
      refetch();
    } catch (err: any) {
      alert(`✗ Failed to reject logs: ${err.data?.message || err.message}`);
    }
  };

  const handleQuickApprove = async (logId: string) => {
    try {
      await batchVerify({
        logIds: [logId],
        status: 'VERIFIED',
        reason: 'Quick approved',
      }).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to approve log');
    }
  };

  const handleQuickReject = async (logId: string) => {
    try {
      await batchVerify({
        logIds: [logId],
        status: 'REJECTED',
        reason: 'Rejected by supervisor',
      }).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to reject log');
    }
  };

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load pending verifications"
          onRetry={() => refetch()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Approvals' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Pending Approvals</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and verify worker daily logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              {logs.length} pending
            </span>
          </div>
        </div>

        {/* Batch Action Bar */}
        {selectedLogIds.length > 0 && (
          <div className="sticky top-4 z-40 bg-white rounded-xl shadow-lg border-2 border-forest-400 p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedLogIds.length === logs.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-400"
                />
                <span className="text-sm font-semibold text-gray-900">
                  {selectedLogIds.length} log(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBatchApprove}
                  disabled={isVerifying}
                  className="btn-primary flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve All
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isVerifying}
                  className="btn-secondary flex items-center gap-2 px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (Optional - can be expanded) */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="label">Filter by Field</label>
              <select
                className="input-field"
                onChange={(e) =>
                  setFilters({ ...filters, fieldId: e.target.value || undefined })
                }
              >
                <option value="">All Fields</option>
                {/* Add field options */}
              </select>
            </div>
            <div className="flex-1">
              <label className="label">Sort By</label>
              <select
                className="input-field"
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-');
                  setFilters({
                    ...filters,
                    sortBy: sortBy as any,
                    order: order as 'asc' | 'desc',
                  });
                }}
              >
                <option value="loggedAt-desc">Newest First</option>
                <option value="loggedAt-asc">Oldest First</option>
                <option value="hoursSpent-desc">Most Hours</option>
                <option value="hoursSpent-asc">Least Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Verification Queue */}
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <VerificationCard
                key={log.id}
                log={log}
                isSelected={selectedLogIds.includes(log.id)}
                onSelect={() => handleSelectLog(log.id)}
                onQuickApprove={() => handleQuickApprove(log.id)}
                onQuickReject={() => handleQuickReject(log.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No pending verifications"
            description="All worker logs have been reviewed"
            icon={CheckCircle}
          />
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={!pagination.hasPrev}
              className="btn-secondary px-4 py-2"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNext}
              className="btn-secondary px-4 py-2"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Reject {selectedLogIds.length} Log(s)?
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)"
              className="input-field w-full h-32 mb-4"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchReject}
                disabled={isVerifying}
                className="btn-primary bg-red-600 hover:bg-red-700 px-4 py-2"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Verification Card Component
interface VerificationCardProps {
  log: any;
  isSelected: boolean;
  onSelect: () => void;
  onQuickApprove: () => void;
  onQuickReject: () => void;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  log,
  isSelected,
  onSelect,
  onQuickApprove,
  onQuickReject,
}) => {
  return (
    <div
      className={`card transition-all ${
        isSelected ? 'ring-2 ring-forest-400 bg-forest-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-400 mt-1"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{log.activity}</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {log.activityType}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{log.observations}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onQuickApprove}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                title="Quick Approve"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onQuickReject}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Quick Reject"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{log.worker.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{log.field.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{log.hoursSpent} hrs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{format(new Date(log.loggedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Photos */}
          {log.photos && log.photos.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                📎 {log.photos.length} photo(s) attached
              </span>
              {log.photos.slice(0, 3).map((photo: string, idx: number) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Work proof ${idx + 1}`}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
