import React, { useState } from 'react';
import {
  useGetFertilizerApplicationsQuery,
  useGetFertilizerSummaryQuery,
  useGetFertilizerRecommendationsQuery,
  useCreateFertilizerApplicationMutation,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { FertilizerApplicationForm } from './components/FertilizerApplicationForm';
import { FertilizerHistoryTable } from './components/FertilizerHistoryTable';
import { FertilizerCostChart } from './components/FertilizerCostChart';
import { NutrientSummaryChart } from './components/NutrientSummaryChart';
import { FertilizerApplicationFormData } from '../../schemas';
import { Sprout, DollarSign, TrendingUp, AlertCircle, Calendar } from 'lucide-react';

export const FertilizerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('all');

  const { data: applications = [], isLoading, error, refetch } = useGetFertilizerApplicationsQuery();
  const { data: summaries } = useGetFertilizerSummaryQuery();
  const { data: recommendations } = useGetFertilizerRecommendationsQuery();
  const [createFertilizerApplication] = useCreateFertilizerApplicationMutation();

  const canApply = user?.role === 'ADMIN' || user?.role === 'AGRONOMIST' || user?.role === 'MANAGER';

  // Extract unique fields
  const uniqueFields = Array.from(new Set(applications.map((a) => a.fieldName).filter(Boolean)));

  // Filter applications
  const filteredApplications =
    selectedFieldFilter === 'all'
      ? applications
      : applications.filter((a) => a.fieldName === selectedFieldFilter);

  const handleCreateApplication = async (data: FertilizerApplicationFormData) => {
    try {
      await createFertilizerApplication(data).unwrap();
      setShowApplicationForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create fertilizer application:', err);
      throw err;
    }
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const totalQuantity = applications.reduce((sum, app) => sum + app.quantity, 0);
  const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);
  const uniqueFertilizers = new Set(applications.map((a) => a.fertilizerType)).size;

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load fertilizer data"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Fertilizer Management' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Fertilizer Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track fertilizer applications and nutrient management
            </p>
          </div>
          {canApply && (
            <button
              onClick={() => setShowApplicationForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              Log Application
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                <p className="text-xs text-gray-500">Applications</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Total kg</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Total Cost (ETB)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{uniqueFertilizers}</p>
                <p className="text-xs text-gray-500">Fertilizer Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {applications.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <NutrientSummaryChart applications={applications} />
            </div>
            <div className="card">
              <FertilizerCostChart applications={applications} />
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="card">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              AI Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">{rec.fieldName}</p>
                      <p className="text-sm text-amber-700 mt-1">{rec.reason}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          {rec.recommendedFertilizer}
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          {rec.recommendedQuantity} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application History */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Application History</h2>
            {uniqueFields.length > 0 && (
              <select
                value={selectedFieldFilter}
                onChange={(e) => setSelectedFieldFilter(e.target.value)}
                className="input-field py-2 px-3 text-sm"
              >
                <option value="all">All Fields</option>
                {uniqueFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            )}
          </div>
          {filteredApplications.length > 0 ? (
            <FertilizerHistoryTable
              applications={filteredApplications}
              onViewDetails={(id) => console.log('View details:', id)}
            />
          ) : (
            <EmptyState
              message="No fertilizer applications"
              description={
                canApply
                  ? 'Log your first fertilizer application to track nutrient management'
                  : 'No applications have been logged yet'
              }
              actionLabel={canApply ? 'Log Application' : undefined}
              onAction={() => setShowApplicationForm(true)}
            />
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && canApply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <FertilizerApplicationForm
              onSubmit={handleCreateApplication}
              onCancel={() => setShowApplicationForm(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};
