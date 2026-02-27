import React from 'react';
import { CropPlan } from '../../../types';
import { Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface CropPlanTimelineProps {
  plans: CropPlan[];
}

export const CropPlanTimeline: React.FC<CropPlanTimelineProps> = ({ plans }) => {
  // Sort by planting date
  const sortedPlans = [...plans].sort(
    (a, b) => new Date(a.plantingDate).getTime() - new Date(b.plantingDate).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateProgress = (plan: CropPlan) => {
    const now = new Date();
    const start = new Date(plan.plantingDate);
    const end = new Date(plan.expectedHarvestDate);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;
    return Math.round((elapsed / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-amber-500';
      case 'COMPLETED':
        return 'bg-emerald-500';
      case 'CANCELLED':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No crop plans scheduled</p>
        <p className="text-sm text-gray-400 mt-1">
          Create a crop plan to start tracking your planting schedule
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {sortedPlans.map((plan) => {
          const progress = calculateProgress(plan);
          const statusColor = getStatusColor(plan.status);

          return (
            <div key={plan.id} className="relative pl-20">
              {/* Timeline Dot */}
              <div
                className={`absolute left-6 top-0 w-5 h-5 rounded-full border-4 border-white shadow ${statusColor}`}
              />

              {/* Plan Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{plan.cropType}</h3>
                    {plan.cropVariety && (
                      <p className="text-sm text-gray-500">{plan.cropVariety}</p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-700'
                        : plan.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {plan.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Field and Season */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  {plan.fieldName && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {plan.fieldName}
                    </div>
                  )}
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    {plan.season.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress (if in progress) */}
                {plan.status === 'IN_PROGRESS' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Timeline Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Plant: {formatDate(plan.plantingDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Harvest: {formatDate(plan.expectedHarvestDate)}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-forest-500" />
                    <span className="font-medium text-gray-900">{plan.plannedYield} tons</span>
                    <span className="text-gray-500">target</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-900">{plan.budget.toLocaleString()}</span>
                    <span className="text-gray-500">ETB budget</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
