import React, { useState } from 'react';
import {
  useGetPendingVerificationsQuery,
  useBatchVerifyLogsMutation,
  useGetPendingApprovalsQuery,
  useDecideApprovalMutation,
  useGetApprovalHistoryQuery,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import {
  CheckCircle, XCircle, Clock, Users, Calendar, MapPin,
  Brain, FlaskConical, Sprout, Droplets, AlertTriangle,
  ThumbsUp, ThumbsDown, Zap, ChevronRight, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import type { Approval } from '../../types';

// ─── AI Recommendation Colors & Icons per type ─────────────────────────────
const typeConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType; label: string }> = {
  FERTILIZER:       { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Sprout, label: 'Fertilizer Plan' },
  CROP_PLAN:        { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Calendar, label: 'Crop Plan' },
  IRRIGATION:       { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Droplets, label: 'Irrigation Schedule' },
  DISEASE_ALERT:    { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, label: 'Disease Alert' },
  SOIL_DATA:        { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: FlaskConical, label: 'Soil Analysis' },
  AI_RECOMMENDATION:{ color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Brain, label: 'AI Recommendation' },
  BUDGET:           { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: BarChart3, label: 'Budget Request' },
};

const getTypeConfig = (type: string) =>
  typeConfig[type] ?? { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: Brain, label: type };

// ─── AI Approvals (Agronomist view) ────────────────────────────────────────
const AIApprovalsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: pendingData, isLoading, error, refetch } = useGetPendingApprovalsQuery(undefined);
  const { data: historyData } = useGetApprovalHistoryQuery({});
  const [decide, { isLoading: isDeciding }] = useDecideApprovalMutation();

  const pending: Approval[] = pendingData?.approvals ?? [];
  const history: Approval[] = historyData?.approvals ?? [];

  const handleDecide = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await decide({ id, decision: { status, reason: decisionNotes[id] || undefined } }).unwrap();
      refetch();
    } catch (err) {
      console.error('Decision failed:', err);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message="Failed to load AI recommendations" onRetry={refetch} />;

  const displayList = activeTab === 'pending' ? pending : history;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border-2 border-amber-100 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{pending.length}</p>
            <p className="text-xs text-gray-500 font-medium">Awaiting Review</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-emerald-100 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {history.filter((h: any) => h.status === 'APPROVED').length}
            </p>
            <p className="text-xs text-gray-500 font-medium">Approved</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-red-100 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {history.filter((h: any) => h.status === 'REJECTED').length}
            </p>
            <p className="text-xs text-gray-500 font-medium">Rejected</p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="bg-white border border-gray-200 rounded-xl p-1 flex w-fit">
        {(['pending', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
              activeTab === tab
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab === 'pending' ? `⏳ Pending (${pending.length})` : `📋 History (${history.length})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      {displayList.length === 0 ? (
        <EmptyState
          message={activeTab === 'pending' ? 'No pending AI recommendations' : 'No review history yet'}
          description={activeTab === 'pending'
            ? 'The AI has no pending recommendations for your review right now'
            : 'Approvals and rejections you make will appear here'}
          icon={Brain}
        />
      ) : (
        <div className="space-y-4">
          {displayList.map((item: Approval) => {
            const cfg = getTypeConfig(item.type);
            const Icon = cfg.icon;
            const isExpanded = expandedId === item.id;
            const isPending = item.status === 'PENDING';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border-2 shadow-sm transition-all overflow-hidden ${cfg.border} ${
                  isExpanded ? 'shadow-md' : 'hover:shadow-md'
                }`}
              >
                {/* Card Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {cfg.label}
                          </span>
                          {item.confidenceScore && (
                            <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              <Zap className="w-3 h-3" />
                              AI Confidence: {item.confidenceScore}%
                            </span>
                          )}
                          {!isPending && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {item.status === 'APPROVED' ? '✓ Approved' : '✗ Rejected'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Requested by <span className="font-semibold text-gray-700">{item.requestedBy?.fullName ?? 'AI System'}</span>
                          {' · '}
                          {format(new Date(item.createdAt), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform mt-0.5 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                  {item.reason && (
                    <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 text-left line-clamp-2">
                      {item.reason}
                    </p>
                  )}
                </button>

                {/* Expanded Detail + Actions */}
                {isExpanded && isPending && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        Add Review Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={decisionNotes[item.id] ?? ''}
                        onChange={e => setDecisionNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="e.g., Adjusted fertilizer rate based on last field visit..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-forest-400 focus:border-forest-400 outline-none resize-none bg-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDecide(item.id, 'APPROVED')}
                        disabled={isDeciding}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve & Schedule
                      </button>
                      <button
                        onClick={() => handleDecide(item.id, 'REJECTED')}
                        disabled={isDeciding}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* History detail */}
                {isExpanded && !isPending && item.approvedBy && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50 text-sm text-gray-600 space-y-2">
                    <p>
                      <span className="font-semibold text-gray-800">{item.status === 'APPROVED' ? '✓ Approved' : '✗ Rejected'}</span>
                      {' by '}
                      <span className="font-semibold">{item.approvedBy.fullName}</span>
                      {item.approvedAt && ` · ${format(new Date(item.approvedAt), 'MMM d, yyyy HH:mm')}`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Worker Log Verifications (Manager / Admin view) ───────────────────────
const WorkerVerificationView: React.FC = () => {
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: verificationData, isLoading, error, refetch } = useGetPendingVerificationsQuery({ page: 1, limit: 50 });
  const [batchVerify, { isLoading: isVerifying }] = useBatchVerifyLogsMutation();

  const logs = verificationData?.data?.logs || [];
  const pagination = verificationData?.data?.pagination;

  const handleSelectLog = (logId: string) =>
    setSelectedLogIds(prev => prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]);

  const handleSelectAll = () =>
    setSelectedLogIds(selectedLogIds.length === logs.length ? [] : logs.map((l) => l.id));

  const handleBatchAction = async (status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    if (!selectedLogIds.length) return;
    try {
      const result = await batchVerify({ logIds: selectedLogIds, status, reason: reason ?? (status === 'VERIFIED' ? 'Batch approved' : 'Rejected') }).unwrap();
      const count = result.data.verified.length;
      alert(`✓ ${status === 'VERIFIED' ? 'Verified' : 'Rejected'} ${count} log(s)`);
      setSelectedLogIds([]);
      setShowRejectModal(false);
      setRejectionReason('');
      refetch();
    } catch (err: any) { alert(`✗ Failed: ${err.data?.message || err.message}`); }
  };

  const handleQuick = async (logId: string, status: 'VERIFIED' | 'REJECTED') => {
    try { await batchVerify({ logIds: [logId], status, reason: status === 'VERIFIED' ? 'Quick approved' : 'Rejected' }).unwrap(); refetch(); }
    catch { alert('Action failed'); }
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message="Failed to load pending verifications" onRetry={refetch} />;

  return (
    <div className="space-y-5">
      {/* Sticky Batch Bar */}
      {selectedLogIds.length > 0 && (
        <div className="sticky top-4 z-40 bg-white rounded-xl shadow-lg border-2 border-forest-400 p-4 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selectedLogIds.length === logs.length} onChange={handleSelectAll}
                className="w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-400" />
              <span className="text-sm font-semibold">{selectedLogIds.length} log(s) selected</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleBatchAction('VERIFIED')} disabled={isVerifying}
                className="btn-primary flex items-center gap-2 px-4 py-2">
                <CheckCircle className="w-4 h-4" /> Approve All
              </button>
              <button onClick={() => setShowRejectModal(true)} disabled={isVerifying}
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-red-600 border-red-300 hover:bg-red-50">
                <XCircle className="w-4 h-4" /> Reject All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Cards */}
      {logs.length === 0 ? (
        <EmptyState message="No pending verifications" description="All worker logs have been reviewed" icon={CheckCircle} />
      ) : (
        logs.map((log) => (
          <div key={log.id} className={`card transition-all ${selectedLogIds.includes(log.id) ? 'ring-2 ring-forest-400 bg-forest-50' : ''}`}>
            <div className="flex items-start gap-4">
              <input type="checkbox" checked={selectedLogIds.includes(log.id)} onChange={() => handleSelectLog(log.id)}
                className="w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-400 mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{log.activity}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{log.activityType}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.observations}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleQuick(log.id, 'VERIFIED')}
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleQuick(log.id, 'REJECTED')}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors" title="Reject">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{log.worker?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{log.field?.name}</span>
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
                {log.photos?.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">📎 {log.photos.length} photo(s)</span>
                    {log.photos.slice(0, 3).map((photo: string, idx: number) => (
                      <img key={idx} src={photo} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200 hover:scale-110 transition-transform cursor-pointer" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={!pagination.hasPrev} className="btn-secondary px-4 py-2">Previous</button>
          <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={!pagination.hasNext} className="btn-secondary px-4 py-2">Next</button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Reject {selectedLogIds.length} Log(s)?</h2>
            <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)" className="input-field w-full h-32 mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowRejectModal(false); setRejectionReason(''); }} className="btn-secondary px-4 py-2">Cancel</button>
              <button onClick={() => handleBatchAction('REJECTED', rejectionReason)} disabled={isVerifying}
                className="btn-primary bg-red-600 hover:bg-red-700 px-4 py-2">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page (role-aware router) ─────────────────────────────────────────
export const ApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const isAgronomist = user?.role === 'AGRONOMIST';

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs items={[{ label: 'Approvals' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {isAgronomist
                ? <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Brain className="w-5 h-5 text-blue-600" /></div>
                : <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-forest-600" /></div>
              }
              <h1 className="page-header">
                {isAgronomist ? 'AI Recommendations' : 'Pending Approvals'}
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-[52px]">
              {isAgronomist
                ? 'Review and approve AI-generated recommendations for soil, fertilizer, crop, and irrigation plans.'
                : 'Review and verify worker daily log submissions before they are recorded.'}
            </p>
          </div>
        </div>

        {/* Role-Aware Content */}
        {isAgronomist ? <AIApprovalsView /> : <WorkerVerificationView />}
      </div>
    </Layout>
  );
};
