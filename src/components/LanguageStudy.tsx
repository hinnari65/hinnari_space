'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sentence {
  text: string;
  translation: string;
  pinyin?: string;
}

interface StudyData {
  english: Sentence[];
  chinese: Sentence[];
}

export default function LanguageStudy() {
  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'english' | 'chinese'>('english');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateStudyList = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate study list');
      }

      const data = await response.json();
      setStudyData(data);
    } catch (error) {
      console.error('Error generating study list:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text: string, id: string) => {
    try {
      setPlayingAudio(id);

      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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
    <div className="h-full flex flex-col p-6">
      <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} className="hidden" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Daily Language Study
        </h2>
        <button
          onClick={generateStudyList}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Generating...' : '오늘의 학습 생성'}
        </button>
      </div>

      {studyData && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('english')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'english'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50'
                }`}
            >
              English (Intermediate)
            </button>
            <button
              onClick={() => setActiveTab('chinese')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'chinese'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50'
                }`}
            >
              Chinese (Advanced)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {studyData[activeTab].map((item, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <p className={`text-gray-100 font-medium leading-relaxed ${activeTab === 'chinese' ? 'font-chinese text-xl' : 'text-lg'}`}>
                          {item.text}
                        </p>
                        {item.pinyin && (
                          <p className="text-sm text-purple-400 font-mono">
                            {item.pinyin}
                          </p>
                        )}
                        <p className="text-gray-400">
                          {item.translation}
                        </p>
                      </div>
                      <button
                        onClick={() => playAudio(item.text, `${activeTab}-${index}`)}
                        disabled={playingAudio !== null}
                        aria-label={`Listen to sentence ${index + 1}`}
                        className="p-3 rounded-full bg-gray-700/50 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 transition-all flex-shrink-0"
                      >
                        {playingAudio === `${activeTab}-${index}` ? (
                          <WaveformIcon className="w-5 h-5 animate-pulse" />
                        ) : (
                          <SpeakerIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {!studyData && !loading && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>버튼을 눌러 오늘의 학습을 시작하세요</p>
        </div>
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