import React, { useState } from 'react';
import { useGetPendingApprovalsQuery, useDecideApprovalMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Approval } from '../../types';
import { CheckCircle, XCircle, Clock, AlertTriangle, Leaf, Sprout, Droplets, DollarSign, Bug } from 'lucide-react';

const approvalTypeLabels: Record<string, string> = {
  CROP_PLAN: 'Crop Plan',
  FERTILIZER: 'Fertilizer Application',
  IRRIGATION: 'Irrigation',
  BUDGET: 'Budget',
  DISEASE_ALERT: 'Disease Alert',
  SOIL_DATA: 'Soil Data',
  AI_RECOMMENDATION: 'AI Recommendation',
};

const approvalTypeIcons: Record<string, React.ElementType> = {
  CROP_PLAN: Leaf,
  FERTILIZER: Sprout,
  IRRIGATION: Droplets,
  BUDGET: DollarSign,
  DISEASE_ALERT: Bug,
  SOIL_DATA: Leaf,
  AI_RECOMMENDATION: AlertTriangle,
};

export const ApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: approvalsData, isLoading, error, refetch } = useGetPendingApprovalsQuery(undefined);
  const [decideApproval] = useDecideApprovalMutation();
  const [filterType, setFilterType] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const approvals = approvalsData?.approvals || [];

  const filteredApprovals = filterType === 'all' 
    ? approvals 
    : approvals.filter((a) => a.type === filterType);

  const handleDecide = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;
    
    setProcessingId(id);
    try {
      await decideApproval({ id, decision: { status } }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to process approval:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load approvals" onRetry={() => window.location.reload()} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs items={[{ label: 'Pending Approvals' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">Pending Approvals</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {approvals.length} request{approvals.length !== 1 ? 's' : ''} waiting for your review
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'CROP_PLAN', 'FERTILIZER', 'DISEASE_ALERT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                filterType === type
                  ? 'bg-forest-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All Requests' : approvalTypeLabels[type] || type}
            </button>
          ))}
        </div>

        {/* Approvals List */}
        {filteredApprovals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No pending approvals</h3>
            <p className="text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApprovals.map((approval) => {
              const Icon = approvalTypeIcons[approval.type] || AlertTriangle;
              
              return (
                <div
                  key={approval.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {approvalTypeLabels[approval.type] || approval.type}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {approval.reference?.field?.name || approval.referenceId}
                        </p>
                        {approval.reason && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                            {approval.reason}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>Requested by: {approval.requestedBy?.fullName || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(approval.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecide(approval.id, 'REJECTED')}
                        disabled={processingId === approval.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 disabled:opacity-50 min-h-[44px]"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleDecide(approval.id, 'APPROVED')}
                        disabled={processingId === approval.id}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 disabled:opacity-50 min-h-[44px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
