'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Translation {
  english: string;
  korean: string;
  chinese: string;
}

export default function LanguageStudy() {
  const [translations, setTranslations] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateTranslation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate translation');
      }

      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error generating translation:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text: string, language: string) => {
    try {
      setPlayingAudio(language);
      
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const { audio } = await response.json();
      const audioUrl = `data:audio/mp3;base64,${audio}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setPlayingAudio(null);
    }
  };

  return (
    <div className="p-4">
      <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} className="hidden" />
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Language Study
        </h2>
        <button
          onClick={generateTranslation}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 text-sm"
        >
          {loading ? 'Generating...' : '오늘의 시사 문장'}
        </button>
      </div>

      {translations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-400">English</p>
              <button
                onClick={() => playAudio(translations.english, 'english')}
                disabled={playingAudio !== null}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {playingAudio === 'english' ? (
                  <WaveformIcon className="w-4 h-4 animate-pulse" />
                ) : (
                  <SpeakerIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-base">{translations.english}</p>
          </div>
          <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-400">Korean</p>
              <button
                onClick={() => playAudio(translations.korean, 'korean')}
                disabled={playingAudio !== null}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {playingAudio === 'korean' ? (
                  <WaveformIcon className="w-4 h-4 animate-pulse" />
                ) : (
                  <SpeakerIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-base">{translations.korean}</p>
          </div>
          <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-400">Chinese</p>
              <button
                onClick={() => playAudio(translations.chinese, 'chinese')}
                disabled={playingAudio !== null}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {playingAudio === 'chinese' ? (
                  <WaveformIcon className="w-4 h-4 animate-pulse" />
                ) : (
                  <SpeakerIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-base">{translations.chinese}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SpeakerIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
}

function WaveformIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
} 