import React from 'react';
import { Beaker, TrendingUp, AlertTriangle, Sprout, DollarSign, ArrowRight } from 'lucide-react';

interface SoilRecommendationsProps {
  soilDataId: string;
  fieldId: string;
  fieldName: string;
  onClose: () => void;
  onCreateFertilizerPlan: (data: any) => void;
}

export const SoilRecommendations: React.FC<SoilRecommendationsProps> = ({
  soilDataId,
  fieldId,
  fieldName,
  onClose,
  onCreateFertilizerPlan,
}) => {
  // Mock recommendations - in production, fetch from API
  const recommendations = {
    deficiencies: [
      {
        nutrient: 'NITROGEN',
        level: 'LOW' as const,
        currentValue: 25,
        optimalValue: 50,
        recommendation: 'Apply 50kg Urea per hectare',
        fertilizerType: 'UREA',
        estimatedCost: 1500,
        expectedYieldIncrease: 15,
      },
      {
        nutrient: 'PHOSPHORUS',
        level: 'OPTIMAL' as const,
        currentValue: 35,
        optimalValue: 30,
        recommendation: null,
        fertilizerType: null,
        estimatedCost: 0,
        expectedYieldIncrease: 0,
      },
      {
        nutrient: 'POTASSIUM',
        level: 'LOW' as const,
        currentValue: 180,
        optimalValue: 200,
        recommendation: 'Apply 30kg Potassium per hectare',
        fertilizerType: 'MOP',
        estimatedCost: 1200,
        expectedYieldIncrease: 10,
      },
    ],
    pH: {
      currentValue: 6.2,
      status: 'OPTIMAL',
      recommendation: null,
    },
    suggestedActions: [
      {
        type: 'CREATE_FERTILIZER_APPLICATION',
        data: {
          fieldId,
          fertilizerType: 'UREA',
          quantity: 50,
          estimatedCost: 1500,
        },
      },
    ],
  };

  const getNutrientColor = (level: string) => {
    if (level === 'LOW') return 'text-red-600 bg-red-50';
    if (level === 'OPTIMAL') return 'text-emerald-600 bg-emerald-50';
    if (level === 'HIGH') return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getNutrientLabel = (level: string) => {
    if (level === 'LOW') return 'Low';
    if (level === 'OPTIMAL') return 'Optimal';
    if (level === 'HIGH') return 'High';
    return level;
  };

  const totalEstimatedCost = recommendations.deficiencies
    .filter(d => d.estimatedCost > 0)
    .reduce((sum, d) => sum + d.estimatedCost, 0);

  const totalYieldIncrease = Math.max(
    ...recommendations.deficiencies.map(d => d.expectedYieldIncrease)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Beaker className="w-6 h-6 text-forest-600" />
            Soil Recommendations
          </h2>
          <p className="text-sm text-gray-500 mt-1">{fieldName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Yield Increase</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">+{totalYieldIncrease}%</p>
          <p className="text-xs text-emerald-600">Expected</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Est. Cost</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalEstimatedCost}</p>
          <p className="text-xs text-blue-600">ETB per hectare</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <Sprout className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Actions</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {recommendations.deficiencies.filter(d => d.recommendation).length}
          </p>
          <p className="text-xs text-purple-600">Recommended</p>
        </div>
      </div>

      {/* Nutrient Analysis */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Nutrient Analysis</h3>
        {recommendations.deficiencies.map((deficiency, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNutrientColor(deficiency.level)}`}>
                  {getNutrientLabel(deficiency.level)}
                </span>
                <span className="font-semibold text-gray-900">{deficiency.nutrient}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{deficiency.currentValue}</span>
                <span className="text-gray-400"> / {deficiency.optimalValue} ppm</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  deficiency.level === 'LOW'
                    ? 'bg-red-500'
                    : deficiency.level === 'OPTIMAL'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min((deficiency.currentValue / deficiency.optimalValue) * 100, 100)}%` }}
              />
            </div>

            {/* Recommendation */}
            {deficiency.recommendation && (
              <div className="mt-3 flex items-start gap-2 text-sm">
                <Sprout className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{deficiency.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cost: {deficiency.estimatedCost} ETB • Expected yield: +{deficiency.expectedYieldIncrease}%
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* pH Status */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Soil pH</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNutrientColor(recommendations.pH.status)}`}>
            {recommendations.pH.status}
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{recommendations.pH.currentValue}</p>
        <p className="text-sm text-gray-500 mt-1">
          Optimal range: 6.0 - 7.0
        </p>
        {recommendations.pH.recommendation && (
          <p className="text-sm text-gray-700 mt-2">
            {recommendations.pH.recommendation}
          </p>
        )}
      </div>

      {/* Suggested Actions */}
      {recommendations.suggestedActions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Suggested Actions</h3>
          {recommendations.suggestedActions.map((action, idx) => (
            <div
              key={idx}
              className="p-4 bg-forest-50 border border-forest-200 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-forest-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {action.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {action.data.fertilizerType} - {action.data.quantity}kg
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onCreateFertilizerPlan(action.data)}
                  className="btn-primary flex items-center gap-2"
                >
                  Apply
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
