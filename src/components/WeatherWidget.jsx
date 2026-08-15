import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      // Call backend API endpoint that fetches weather
      const response = await axios.get(`${API_BASE_URL}/weather`);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="h-5 w-5 text-slate-400" />;
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower')) return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (lower.includes('cloud')) return <Cloud className="h-5 w-5 text-slate-400" />;
    if (lower.includes('sun') || lower.includes('clear')) return <Sun className="h-5 w-5 text-amber-500" />;
    if (lower.includes('snow')) return <CloudSnow className="h-5 w-5 text-blue-300" />;
    return <Wind className="h-5 w-5 text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm animate-pulse">
        <div className="h-12 w-32 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs">Weather unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.condition)}
        <div>
          <p className="text-lg font-bold text-slate-950">{weather.temperature}°C</p>
          <p className="text-xs text-slate-500">{weather.condition}</p>
        </div>
      </div>
      <p className="mt-1 text-xs font-medium text-slate-600">{weather.location}</p>
    </div>
  );
}
