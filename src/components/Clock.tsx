'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Clock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700/50 rounded w-32 mx-auto"></div>
        <div className="h-16 bg-gray-700/50 rounded w-48 mx-auto"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-1 text-center"
    >
      <motion.div
        className="text-2xl text-gray-400 font-light tracking-wider"
      >
        {currentTime.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </motion.div>
      <motion.div
        className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
      >
        {currentTime.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })}
      </motion.div>
    </motion.div>
  );
}