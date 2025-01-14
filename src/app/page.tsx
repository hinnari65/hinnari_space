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
      staggerChildren: 0.3
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

const titleVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <motion.h1
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
          HINNARI&apos;S TODOLIST
        </span>
      </motion.h1>
      
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-700"
          >
            <Clock />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700"
          >
            <Weather />
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700 mb-8"
        >
          <LanguageStudy />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700"
        >
          <TodoList />
        </motion.div>
      </motion.div>
    </main>
  );
}
