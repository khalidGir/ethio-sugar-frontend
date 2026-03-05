import React, { useState } from 'react';
import { useGetWeatherForecastQuery } from '../../../services/api';
import { CloudRain, Sun, Wind, Thermometer, AlertTriangle, Droplets, Eye, Navigation } from 'lucide-react';

interface WeatherAlertsProps {
  fieldId?: string;
  compact?: boolean;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ fieldId, compact = false }) => {
  const { data: forecast, isLoading } = useGetWeatherForecastQuery({ days: 7 });
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // Generate alerts based on forecast data (mock logic for now)
  const generateAlerts = () => {
    if (!forecast) return [];

    const alerts: any[] = [];

    forecast.forEach((day: any) => {
      // Heavy rain alert
      if (day.rainfall > 20) {
        alerts.push({
          id: `rain-${day.date}`,
          type: 'HEAVY_RAIN',
          severity: day.rainfall > 50 ? 'CRITICAL' : 'WARNING',
          message: `Heavy rainfall of ${day.rainfall}mm expected on ${new Date(day.date).toLocaleDateString()}. Delay fertilization activities.`,
          date: day.date,
          icon: CloudRain,
        });
      }

      // High wind alert
      if (day.windSpeed > 50) {
        alerts.push({
          id: `wind-${day.date}`,
          type: 'HIGH_WIND',
          severity: 'WARNING',
          message: `High winds (${day.windSpeed} km/h) expected. Secure equipment and avoid spraying.`,
          date: day.date,
          icon: Wind,
        });
      }

      // Heat wave alert
      if (day.tempMax > 35) {
        alerts.push({
          id: `heat-${day.date}`,
          type: 'HEAT_WAVE',
          severity: day.tempMax > 40 ? 'CRITICAL' : 'WARNING',
          message: `Extreme heat (${day.tempMax}°C) expected. Increase irrigation frequency.`,
          date: day.date,
          icon: Sun,
        });
      }
    });

    return alerts;
  };

  const alerts = generateAlerts();

  const getAlertColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-50 border-red-200 text-red-800';
    if (severity === 'WARNING') return 'bg-amber-50 border-amber-200 text-amber-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'HEAVY_RAIN': return CloudRain;
      case 'HIGH_WIND': return Wind;
      case 'HEAT_WAVE': return Sun;
      case 'DROUGHT': return Sun;
      case 'FROST': return Thermometer;
      default: return AlertTriangle;
    }
  };

  // Compact widget view (for dashboard)
  if (compact) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <h2 className="section-title">Weather Alerts</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Loading alerts...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, idx) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border-2 ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{alert.type.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-sm mt-1 line-clamp-2">{alert.message}</p>
                </div>
              );
            })}
            {alerts.length > 3 && (
              <p className="text-xs text-center text-gray-500">
                +{alerts.length - 3} more alerts
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No weather alerts</p>
          </div>
        )}
      </div>
    );
  }

  // Full page view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather Alerts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay informed about weather conditions affecting your fields
          </p>
        </div>
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
          {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Loading weather data...</p>
          </div>
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`card border-2 ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/50">
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getAlertColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800">{alert.message}</p>
                    
                    {/* Recommended Actions */}
                    <div className="mt-3 flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Recommended Action:</p>
                        <p className="text-gray-600">
                          {alert.type === 'HEAVY_RAIN' && 'Delay fertilization and irrigation. Ensure drainage systems are clear.'}
                          {alert.type === 'HIGH_WIND' && 'Secure loose equipment. Avoid pesticide spraying.'}
                          {alert.type === 'HEAT_WAVE' && 'Increase irrigation frequency. Schedule work during cooler hours.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <Sun className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Weather Alerts</h3>
            <p className="text-sm text-gray-500 mt-2">
              Weather conditions are favorable for farm activities
            </p>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {!isLoading && forecast && (
        <div className="card">
          <h2 className="section-title mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day: any, idx: number) => (
              <div
                key={idx}
                className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs font-medium text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                {day.rainfall > 10 ? (
                  <CloudRain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                ) : day.tempMax > 30 ? (
                  <Sun className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                ) : (
                  <CloudRain className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm font-bold text-gray-900">
                  {Math.round(day.tempMax)}°
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round(day.tempMin)}°
                </p>
                {day.rainfall > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {day.rainfall}mm
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
