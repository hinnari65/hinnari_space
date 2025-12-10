'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WeatherData {
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&lang=kr`
        );

        if (!response.ok) {
          throw new Error('날씨 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-red-400 text-sm"
      >
        {error}
      </motion.div>
    );
  }

  if (!weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-gray-400"
      >
        <div className="animate-pulse flex items-center gap-4 h-full">
          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-5 h-full flex flex-col justify-center"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
            <Image
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              fill
              className="filter brightness-125 object-contain"
            />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {Math.round(weatherData.main.temp)}°
            </p>
            <p className="text-[10px] md:text-xs text-gray-400 truncate max-w-[60px] md:max-w-none">
              {weatherData.name}
            </p>
          </div>
        </div>

        <div className="text-right space-y-1 flex-shrink-0">
          <div className="bg-gray-800/50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-gray-400">습도</p>
            <p className="text-xs md:text-sm font-medium">{weatherData.main.humidity}%</p>
          </div>
          <div className="bg-gray-800/50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-gray-400">풍속</p>
            <p className="text-xs md:text-sm font-medium">{weatherData.wind.speed}m/s</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}