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
        className="p-8 text-red-400"
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
        className="p-8 text-gray-400"
      >
        날씨 정보를 불러오는 중...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
      >
        {weatherData.name} 날씨
      </motion.h2>
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="relative w-[100px] h-[100px]"
        >
          <Image
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            fill
            className="filter brightness-125"
          />
        </motion.div>
        <div>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            {Math.round(weatherData.main.temp)}°C
          </motion.p>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-1"
          >
            체감 {Math.round(weatherData.main.feels_like)}°C
          </motion.p>
        </div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-2 gap-4"
      >
        <div className="bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <p className="text-gray-400 text-sm">습도</p>
          <p className="text-xl font-medium mt-1">{weatherData.main.humidity}%</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <p className="text-gray-400 text-sm">풍속</p>
          <p className="text-xl font-medium mt-1">{weatherData.wind.speed} m/s</p>
        </div>
      </motion.div>
    </motion.div>
  );
} 