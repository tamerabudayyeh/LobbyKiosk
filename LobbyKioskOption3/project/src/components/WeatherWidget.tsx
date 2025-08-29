import React from 'react';
import { Sun, Cloud, CloudRain, SunSnow as Snow } from 'lucide-react';

export function WeatherWidget() {
  // Mock weather data - in a real app this would come from an API
  const weather = {
    temperature: 24,
    condition: 'sunny',
    description: 'Sunny',
    humidity: 45,
    windSpeed: 12
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={32} />;
      case 'cloudy':
        return <Cloud className="text-gray-400" size={32} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={32} />;
      case 'snowy':
        return <Snow className="text-blue-300" size={32} />;
      default:
        return <Sun className="text-yellow-500" size={32} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-lg p-4 border border-blue-100">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          {getWeatherIcon()}
        </div>
        <div className="text-2xl font-bold text-[#25407b] mb-1">{weather.temperature}°C</div>
        <p className="text-[#949699] font-medium">{weather.description}</p>
        <p className="text-[#949699] text-xs mt-1">Jerusalem Today</p>
      </div>
    </div>
  );
}