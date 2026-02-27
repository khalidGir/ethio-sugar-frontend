import React from 'react';
import { FertilizerApplication } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NutrientSummaryChartProps {
  applications: FertilizerApplication[];
}

export const NutrientSummaryChart: React.FC<NutrientSummaryChartProps> = ({ applications }) => {
  // Calculate total NPK applied
  const nutrientContent: Record<string, { n: number; p: number; k: number }> = {
    UREA: { n: 46, p: 0, k: 0 },
    DAP: { n: 18, p: 46, k: 0 },
    NPS: { n: 19, p: 38, k: 0 },
    COMPOST: { n: 1, p: 0.5, k: 1 },
    MANURE: { n: 0.5, p: 0.3, k: 0.5 },
    UREA_46: { n: 46, p: 0, k: 0 },
    CAN: { n: 27, p: 0, k: 0 },
    OTHER: { n: 0, p: 0, k: 0 },
  };

  const nutrients = applications.reduce(
    (acc, app) => {
      const content = nutrientContent[app.fertilizerType] || { n: 0, p: 0, k: 0 };
      const multiplier = app.quantity / 100; // Convert kg to percentage

      acc.nitrogen += content.n * multiplier;
      acc.phosphorus += content.p * multiplier;
      acc.potassium += content.k * multiplier;

      return acc;
    },
    { nitrogen: 0, phosphorus: 0, potassium: 0 }
  );

  const data = [
    { name: 'Nitrogen (N)', amount: Math.round(nutrients.nitrogen * 10) / 10, color: '#059669' },
    { name: 'Phosphorus (P)', amount: Math.round(nutrients.phosphorus * 10) / 10, color: '#f59e0b' },
    { name: 'Potassium (K)', amount: Math.round(nutrients.potassium * 10) / 10, color: '#3b82f6' },
  ];

  const totalNPK = nutrients.nitrogen + nutrients.phosphorus + nutrients.potassium;

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-medium">No nutrient data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Total Nutrients Applied</h3>
        <div className="text-sm text-gray-500">
          Total NPK: <span className="font-semibold text-gray-900">{totalNPK.toFixed(1)} kg</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number) => [`${value} kg`, 'Amount']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((nutrient) => (
          <div key={nutrient.name} className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{nutrient.name}</p>
            <p className="text-2xl font-bold" style={{ color: nutrient.color }}>
              {nutrient.amount} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
