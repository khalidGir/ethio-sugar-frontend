import React from 'react';
import { CropPlan } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign } from 'lucide-react';

interface BudgetVarianceChartProps {
  plans: CropPlan[];
}

export const BudgetVarianceChart: React.FC<BudgetVarianceChartProps> = ({ plans }) => {
  // Filter plans that have actual cost
  const plansWithCost = plans.filter((p) => p.actualCost && p.actualCost > 0);

  const data = plansWithCost.map((plan) => {
    const variance = plan.actualCost! - plan.budget;
    const variancePercent = Math.round((variance / plan.budget) * 100);
    return {
      name: plan.cropType,
      field: plan.fieldName,
      budget: plan.budget,
      actual: plan.actualCost || 0,
      variance,
      variancePercent,
    };
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No budget data available</p>
        <p className="text-sm text-gray-400 mt-1">
          Budget variance will appear once actual costs are recorded
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual Cost</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: 'ETB', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'budget') return [`${value.toLocaleString()} ETB`, 'Budget'];
                if (name === 'actual') return [`${value.toLocaleString()} ETB`, 'Actual'];
                if (name === 'variancePercent') return [`${value}%`, 'Variance'];
                return [`${value.toLocaleString()} ETB`, 'Variance'];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            />
            <Bar dataKey="budget" fill="#059669" radius={[4, 4, 0, 0]} name="Budget" />
            <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Variance Summary */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Budget</p>
          <p className="text-lg font-bold text-forest-600">
            {data.reduce((sum, d) => sum + d.budget, 0).toLocaleString()} ETB
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Actual</p>
          <p className="text-lg font-bold text-blue-600">
            {data.reduce((sum, d) => sum + d.actual, 0).toLocaleString()} ETB
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Variance</p>
          <p
            className={`text-lg font-bold ${
              data.reduce((sum, d) => sum + d.variancePercent, 0) / data.length > 0
                ? 'text-red-600'
                : 'text-emerald-600'
            }`}
          >
            {Math.round(data.reduce((sum, d) => sum + d.variancePercent, 0) / data.length)}%
          </p>
        </div>
      </div>
    </div>
  );
};
