import React from 'react';
import { CurrentWeather } from '../../../types';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
}

const getWeatherIcon = (icon?: string) => {
  if (!icon) return Cloud;
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
    default:
      return Cloud;
  }
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-blue-100 text-sm font-medium">Current Weather</p>
          <h2 className="text-4xl font-bold mt-2">{weather.temperature?.toFixed(1) || '--'}°C</h2>
          <p className="text-blue-100 mt-1 capitalize">{weather.condition || 'Unknown'}</p>
        </div>
        <WeatherIcon className="w-16 h-16 text-blue-100" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-400/30 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <p className="text-xs text-blue-200">Humidity</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-400/30 flex items-center justify-center">
            <Wind className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <p className="text-xs text-blue-200">Wind</p>
            <p className="font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-400/30 flex items-center justify-center">
            <Thermometer className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <p className="text-xs text-blue-200">Feels Like</p>
            <p className="font-semibold">{weather.feelsLike.toFixed(1)}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-400/30 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <p className="text-xs text-blue-200">Updated</p>
            <p className="font-semibold text-xs">
              {new Date(weather.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
