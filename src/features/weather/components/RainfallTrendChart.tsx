import React from 'react';
import { WeatherRecord } from '../../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RainfallTrendChartProps {
  data: WeatherRecord[];
}

export const RainfallTrendChart: React.FC<RainfallTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No rainfall data available
      </div>
    );
  }

  const chartData = (data || []).slice(0, 30).map((record) => ({
    date: new Date(record.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rainfall: record.rainfall || 0,
  }));

  const totalRainfall = (data || []).reduce((sum, r) => sum + (r.rainfall || 0), 0);
  const avgRainfall = data.length > 0 ? totalRainfall / data.length : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">{totalRainfall.toFixed(1)}mm</p>
          <p className="text-xs text-gray-500">Total rainfall ({data.length} days)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{avgRainfall.toFixed(1)}mm</p>
          <p className="text-xs text-gray-500">Daily average</p>
        </div>
      </div>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 7)} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}mm`, 'Rainfall']}
            />
            <Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
