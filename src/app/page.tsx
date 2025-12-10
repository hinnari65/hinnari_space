'use client';

import Clock from '@/components/Clock';
import Weather from '@/components/Weather';
import TodoList from '@/components/TodoList';
import LanguageStudy from '@/components/LanguageStudy';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 overflow-hidden flex flex-col">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex-shrink-0"
      >
        <h1 className="text-3xl font-bold text-center tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
            HINNARI SPACE
          </span>
        </h1>
      </motion.header>

      <motion.div
        className="flex-1 grid grid-cols-12 gap-6 min-h-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Utilities & Todo */}
        <div className="col-span-4 flex flex-col gap-6 min-h-0">
          <div className="grid grid-cols-2 gap-6 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-700 h-40 flex items-center justify-center"
            >
              <Clock />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700 h-40 overflow-hidden"
            >
              <Weather />
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700 overflow-hidden min-h-0"
          >
            <TodoList />
          </motion.div>
        </div>

        {/* Right Column: Language Study */}
        <motion.div
          variants={itemVariants}
          className="col-span-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700 overflow-hidden min-h-0"
        >
          <LanguageStudy />
        </motion.div>
      </motion.div>
    </main>
  );
}
