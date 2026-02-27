import React, { useState } from 'react';
import { useGetCurrentWeatherQuery, useGetWeatherForecastQuery, useGetWeatherHistoryQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherForecast } from './components/WeatherForecast';
import { WeatherHistoryChart } from './components/WeatherHistoryChart';
import { RainfallTrendChart } from './components/RainfallTrendChart';
import { Cloud, Download, Calendar } from 'lucide-react';

export const WeatherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const { data: currentWeather, isLoading: weatherLoading, error: weatherError } = useGetCurrentWeatherQuery();
  const { data: forecast, isLoading: forecastLoading } = useGetWeatherForecastQuery({ days: 7 });
  const { data: history, isLoading: historyLoading } = useGetWeatherHistoryQuery(undefined);

  const isLoading = weatherLoading || forecastLoading || historyLoading;

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (weatherError) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load weather data"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  const handleExport = () => {
    // Implement CSV export
    console.log('Export weather data');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Weather' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Weather Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time weather monitoring and forecasts for your fields
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="btn-ghost flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Current Weather & Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          {currentWeather && (
            <div className="lg:col-span-1">
              <CurrentWeatherCard weather={currentWeather} />
            </div>
          )}

          {/* 7-Day Forecast */}
          <div className="lg:col-span-2">
            {forecast && <WeatherForecast forecast={forecast} />}
          </div>
        </div>

        {/* Weather Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Temperature Trends</h2>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            {history && <WeatherHistoryChart data={history} />}
          </div>

          {/* Rainfall Trends */}
          <div className="card">
            <h2 className="section-title mb-4">Rainfall Analysis</h2>
            {history && <RainfallTrendChart data={history} />}
          </div>
        </div>

        {/* Weather Alerts */}
        {currentWeather && (currentWeather.uvIndex || 0) > 8 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Cloud className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">High UV Index Alert</h3>
                <p className="text-sm text-amber-700 mt-1">
                  UV index is {currentWeather.uvIndex}. Consider protective measures for outdoor workers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
