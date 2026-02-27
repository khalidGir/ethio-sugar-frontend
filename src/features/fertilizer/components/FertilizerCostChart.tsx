import React from 'react';
import { FertilizerApplication } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign } from 'lucide-react';

interface FertilizerCostChartProps {
  applications: FertilizerApplication[];
}

export const FertilizerCostChart: React.FC<FertilizerCostChartProps> = ({ applications }) => {
  // Group costs by fertilizer type
  const costByType = applications.reduce((acc, app) => {
    const type = app.fertilizerType;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += app.cost;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(costByType).map(([type, cost]) => ({
    name: type.replace('_', ' '),
    cost,
  }));

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#fbbf24', '#f59e0b'];

  const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No cost data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Cost by Fertilizer Type</h3>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{totalCost.toFixed(2)} ETB</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value} ETB`} />
            <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={100} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} ETB`, 'Cost']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
