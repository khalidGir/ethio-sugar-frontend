import React from 'react';
import { WeatherForecast as WeatherForecastType } from '../../../types';
import { Sun, Cloud, CloudRain, CloudDrizzle } from 'lucide-react';

interface WeatherForecastProps {
  forecast: WeatherForecastType[];
}

const getWeatherIcon = (icon: string) => {
  switch (icon.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return Sun;
    case 'cloudy':
    case 'partly-cloudy':
      return Cloud;
    case 'rainy':
    case 'rain':
      return CloudRain;
    case 'drizzle':
      return CloudDrizzle;
    default:
      return Cloud;
  }
};

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  return (
    <div className="card h-full">
      <h2 className="section-title mb-4">7-Day Forecast</h2>
      
      <div className="space-y-3">
        {forecast.map((day, idx) => {
          const WeatherIcon = getWeatherIcon(day.icon);
          const date = new Date(day.date);
          
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <WeatherIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{day.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{day.tempMax.toFixed(0)}°</p>
                  <p className="text-xs text-gray-500">{day.tempMin.toFixed(0)}°</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <CloudRain className="w-3 h-3" />
                  {day.rainfall.toFixed(1)}mm
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {day.humidity}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
