import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      // Using OpenWeatherMap API - you can replace with your preferred weather service
      // For demo purposes, we'll use Jerusalem coordinates
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!API_KEY) {
        // Fallback to mock data if no API key is provided
        setWeather({
          temperature: 24,
          condition: 'Clear',
          humidity: 45,
          windSpeed: 8,
          visibility: 10,
          location: 'Jerusalem'
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=31.7683&lon=35.2137&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data unavailable');
      }

      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        location: data.name
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Weather unavailable');
      // Fallback to mock data
      setWeather({
        temperature: 24,
        condition: 'Clear',
        humidity: 45,
        windSpeed: 8,
        visibility: 10,
        location: 'Jerusalem'
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-10 h-10 text-yellow-300" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="w-10 h-10 text-gray-300" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-10 h-10 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="w-10 h-10 text-white" />;
      default:
        return <Sun className="w-10 h-10 text-yellow-300" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 min-w-[200px]">
        <div className="animate-pulse">
          <div className="h-4 bg-white bg-opacity-20 rounded mb-2"></div>
          <div className="h-8 bg-white bg-opacity-20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 min-w-[200px]">
        <p className="text-blue-100 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3">
        {getWeatherIcon(weather?.condition || 'clear')}
        <div>
          <div className="text-2xl font-body font-light text-luxury-dark tabular-nums">
            {weather?.temperature}°C
          </div>
          <div className="text-sm font-body text-luxury-muted">
            {weather?.condition}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-xs text-luxury-muted">
        <div className="flex items-center space-x-1">
          <Droplets className="w-3 h-3" />
          <span>{weather?.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{weather?.windSpeed}</span>
        </div>
      </div>
      
      <div className="text-xs font-body text-luxury-gold font-medium">
        {weather?.location}
      </div>
    </div>
  );
};