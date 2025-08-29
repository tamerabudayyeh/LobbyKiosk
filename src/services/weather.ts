interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const JERUSALEM_LAT = 31.7683;
const JERUSALEM_LON = 35.2137;

export async function fetchWeatherData(): Promise<WeatherData | null> {
  try {
    // Using a free weather API that doesn't require API key
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${JERUSALEM_LAT}&longitude=${JERUSALEM_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Jerusalem`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    // Map weather codes to conditions
    const weatherCode = data.current.weather_code;
    let condition = 'Clear';
    let icon = 'sun';
    
    if (weatherCode === 0) {
      condition = 'Clear';
      icon = 'sun';
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      condition = 'Partly Cloudy';
      icon = 'cloud-sun';
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      condition = 'Foggy';
      icon = 'cloud-fog';
    } else if (weatherCode >= 51 && weatherCode <= 57) {
      condition = 'Drizzle';
      icon = 'cloud-drizzle';
    } else if (weatherCode >= 61 && weatherCode <= 67) {
      condition = 'Rainy';
      icon = 'cloud-rain';
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      condition = 'Snowy';
      icon = 'cloud-snow';
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      condition = 'Showers';
      icon = 'cloud-rain';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      condition = 'Stormy';
      icon = 'cloud-lightning';
    }

    return {
      temperature: Math.round(data.current.temperature_2m),
      condition,
      icon,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m)
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    // Return fallback data
    return {
      temperature: 24,
      condition: 'Clear',
      icon: 'sun',
      humidity: 50,
      windSpeed: 10
    };
  }
}