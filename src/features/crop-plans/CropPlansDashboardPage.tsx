import React, { useState } from 'react';
import {
  useGetCropPlansQuery,
  useGetCropPlanProgressQuery,
  useCreateCropPlanMutation,
  useUpdateCropPlanMutation,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { CropPlanForm } from './components/CropPlanForm';
import { CropPlanCard } from './components/CropPlanCard';
import { CropPlanTimeline } from './components/CropPlanTimeline';
import { YieldComparisonChart } from './components/YieldComparisonChart';
import { BudgetVarianceChart } from './components/BudgetVarianceChart';
import { CropPlanFormData } from '../../schemas';
import { Calendar, Sprout, TrendingUp, Target, DollarSign, BarChart3 } from 'lucide-react';

export const CropPlansDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'analytics'>('cards');

  const { data: plans = [], isLoading, error, refetch } = useGetCropPlansQuery();
  const { data: progress } = useGetCropPlanProgressQuery();
  const [createCropPlan] = useCreateCropPlanMutation();
  const [updateCropPlan] = useUpdateCropPlanMutation();

  const canCreate = user?.role === 'ADMIN' || user?.role === 'AGRONOMIST' || user?.role === 'MANAGER';

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSeason = selectedSeason === 'all' || plan.season === selectedSeason;
    const matchesStatus = selectedStatus === 'all' || plan.status === selectedStatus;
    return matchesSeason && matchesStatus;
  });

  const handleCreatePlan = async (data: CropPlanFormData) => {
    try {
      await createCropPlan(data).unwrap();
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create crop plan:', err);
      throw err;
    }
  };

  // Calculate statistics
  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => p.status === 'IN_PROGRESS').length;
  const completedPlans = plans.filter((p) => p.status === 'COMPLETED').length;
  const totalBudget = plans.reduce((sum, p) => sum + p.budget, 0);
  const totalTargetYield = plans.reduce((sum, p) => sum + p.plannedYield, 0);

  const uniqueSeasons = Array.from(new Set(plans.map((p) => p.season)));
  const uniqueStatuses = Array.from(new Set(plans.map((p) => p.status)));

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load crop plans"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Crop Planning' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Crop Planning</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Plan and track seasonal crop production
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              Create Crop Plan
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
                <p className="text-xs text-gray-500">Total Plans</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activePlans}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedPlans}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTargetYield.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Target Yield (tons)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(totalBudget / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">Total Budget</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="input-field py-2 px-3 text-sm"
            >
              <option value="all">All Seasons</option>
              {uniqueSeasons.map((season) => (
                <option key={season} value={season}>
                  {season.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field py-2 px-3 text-sm"
            >
              <option value="all">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-forest-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-forest-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-forest-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline" />
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <CropPlanCard key={plan.id} plan={plan} onViewDetails={(id) => console.log(id)} />
            ))}
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="card">
            <h2 className="section-title mb-4">Planting Schedule</h2>
            <CropPlanTimeline plans={filteredPlans} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <YieldComparisonChart plans={plans} />
            </div>
            <div className="card">
              <BudgetVarianceChart plans={plans} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPlans.length === 0 && plans.length > 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No plans match your filters</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your season or status filters
            </p>
          </div>
        )}

        {plans.length === 0 && (
          <div className="card">
            <EmptyState
              message="No crop plans yet"
              description={
                canCreate
                  ? 'Create your first crop plan to start tracking seasonal production'
                  : 'No crop plans have been created yet'
              }
              actionLabel={canCreate ? 'Create Plan' : undefined}
              onAction={() => setShowCreateForm(true)}
            />
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && canCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CropPlanForm onSubmit={handleCreatePlan} onCancel={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </Layout>
  );
};
