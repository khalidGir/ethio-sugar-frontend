import React from 'react';
import { CropPlan } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface YieldComparisonChartProps {
  plans: CropPlan[];
}

export const YieldComparisonChart: React.FC<YieldComparisonChartProps> = ({ plans }) => {
  // Filter plans that have actual yield
  const plansWithYield = plans.filter((p) => p.actualYield && p.actualYield > 0);

  const data = plansWithYield.map((plan) => ({
    name: plan.cropType,
    field: plan.fieldName,
    planned: plan.plannedYield,
    actual: plan.actualYield || 0,
    variance: Math.round(((plan.actualYield! - plan.plannedYield) / plan.plannedYield) * 100),
  }));

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No yield data available</p>
        <p className="text-sm text-gray-400 mt-1">
          Yield comparison will appear once harvest data is recorded
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Planned vs Actual Yield</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} label={{ value: 'tons', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'planned') return [`${value} tons`, 'Planned'];
                if (name === 'actual') return [`${value} tons`, 'Actual'];
                return [`${value}%`, 'Variance'];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            />
            <Bar dataKey="planned" fill="#059669" radius={[4, 4, 0, 0]} name="Planned" />
            <Bar dataKey="actual" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Planned</p>
          <p className="text-xl font-bold text-forest-600">
            {(data.reduce((sum, d) => sum + d.planned, 0) / data.length).toFixed(1)} tons
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Actual</p>
          <p className="text-xl font-bold text-amber-600">
            {(data.reduce((sum, d) => sum + d.actual, 0) / data.length).toFixed(1)} tons
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Success Rate</p>
          <p className="text-xl font-bold text-blue-600">
            {Math.round(
              (data.filter((d) => d.actual >= d.planned).length / data.length) * 100
            )}%
          </p>
        </div>
      </div>
    </div>
  );
};
