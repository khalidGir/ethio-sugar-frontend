import React from 'react';
import { CropPlan } from '../../../types';
import { Calendar, MapPin, Sprout, Target, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface CropPlanCardProps {
  plan: CropPlan;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const CropPlanCard: React.FC<CropPlanCardProps> = ({
  plan,
  onViewDetails,
  onEdit,
}) => {
  const statusColors = {
    PLANNED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const seasonColors = {
    BELG: 'bg-sky-100 text-sky-800',
    MEHER: 'bg-green-100 text-green-800',
    BEGA: 'bg-amber-100 text-amber-800',
    YEAR_ROUND: 'bg-purple-100 text-purple-800',
  };

  // Calculate progress
  const calculateProgress = () => {
    const now = new Date();
    const start = new Date(plan.plantingDate);
    const end = new Date(plan.expectedHarvestDate);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;
    return Math.round((elapsed / total) * 100);
  };

  const calculateDaysRemaining = () => {
    const now = new Date();
    const end = new Date(plan.expectedHarvestDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const progress = calculateProgress();
  const daysRemaining = calculateDaysRemaining();

  const formatStatus = (status: string) => {
    return status.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-forest-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{plan.cropType}</h3>
            {plan.cropVariety && (
              <p className="text-sm text-gray-500">{plan.cropVariety}</p>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[plan.status]}`}
        >
          {formatStatus(plan.status)}
        </span>
      </div>

      {/* Field Info */}
      {plan.fieldName && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          {plan.fieldName}
        </div>
      )}

      {/* Season Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${seasonColors[plan.season]}`}
        >
          {plan.season.replace('_', ' ')}
        </span>
      </div>

      {/* Progress Bar */}
      {plan.status === 'IN_PROGRESS' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-500 to-forest-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {daysRemaining > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {daysRemaining} days remaining
            </div>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Planting Date</p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(plan.plantingDate).toLocaleDateString()}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Expected Harvest</p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(plan.expectedHarvestDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Target Yield</p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <Target className="w-4 h-4 text-forest-500" />
            {plan.plannedYield} tons
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Budget</p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <DollarSign className="w-4 h-4 text-amber-500" />
            {plan.budget.toLocaleString()} ETB
          </div>
        </div>
      </div>

      {/* Yield Variance (if actual yield exists) */}
      {plan.actualYield && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Actual Yield</p>
              <p className="text-sm font-semibold text-gray-900">{plan.actualYield} tons</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Variance</p>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  plan.actualYield >= plan.plannedYield
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${
                    plan.actualYield >= plan.plannedYield ? '' : 'rotate-180'
                  }`}
                />
                {Math.round(((plan.actualYield - plan.plannedYield) / plan.plannedYield) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(plan.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100 transition-colors"
          >
            View Details
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(plan.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
