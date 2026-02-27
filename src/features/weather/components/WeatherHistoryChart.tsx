import React from 'react';
import { WeatherRecord } from '../../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeatherHistoryChartProps {
  data: WeatherRecord[];
}

export const WeatherHistoryChart: React.FC<WeatherHistoryChartProps> = ({ data }) => {
  const chartData = data.slice(0, 30).map((record) => ({
    date: new Date(record.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: record.temperature,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 7)} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
