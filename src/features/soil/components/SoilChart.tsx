import React from 'react';
import { SoilData } from '../../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SoilChartProps {
  soilData: SoilData[];
}

export const SoilChart: React.FC<SoilChartProps> = ({ soilData }) => {
  const chartData = soilData.slice(0, 10).map((record) => ({
    name: record.fieldName || `Field ${record.id.slice(0, 4)}`,
    nitrogen: record.nitrogen,
    phosphorus: record.phosphorus,
    potassium: record.potassium / 10, // Scale down for better visualization
    pH: record.pH * 10, // Scale up for better visualization
  }));

  const optimalRanges = {
    nitrogen: { min: 20, max: 50 },
    phosphorus: { min: 10, max: 30 },
    potassium: { min: 100, max: 200 },
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
            height={80}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 'NPK (ppm)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'pH', angle: 90, position: 'insideRight' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Potassium') return [value * 10, 'Potassium (ppm)'];
              if (name === 'pH') return [(value / 10).toFixed(1), 'pH'];
              return [value, `${name} (ppm)`];
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="nitrogen" fill="#16a34a" name="Nitrogen" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="phosphorus" fill="#d97706" name="Phosphorus" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="potassium" fill="#2563eb" name="Potassium" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Optimal Ranges Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Optimal Ranges:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-gray-600">Nitrogen: 20-50 ppm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-500" />
            <span className="text-gray-600">Phosphorus: 10-30 ppm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-gray-600">Potassium: 100-200 ppm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-purple-500" />
            <span className="text-gray-600">pH: 6.0-7.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
