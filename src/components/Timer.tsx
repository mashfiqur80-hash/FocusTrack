import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject } from '../types';
import { cn } from '../lib/utils';

interface TimerProps {
  subjects: Subject[];
  onComplete: (subjectId: string, duration: number, type: 'focus' | 'pomodoro' | 'break') => void;
}

export function Timer({ subjects, onComplete }: TimerProps) {
  const [mode, setMode] = useState<'focus' | 'pomodoro' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    onComplete(selectedSubjectId, sessionDuration, mode);
    setSessionDuration(0);
    
    // Auto-switch modes for Pomodoro
    if (mode === 'pomodoro') {
      setMode('break');
      setTimeLeft(5 * 60);
    } else if (mode === 'break') {
      setMode('pomodoro');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSessionDuration(0);
    if (mode === 'focus') setTimeLeft(0);
    else setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="flex flex-col items-center space-y-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-xs">
        {(['focus', 'pomodoro', 'break'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setIsActive(false);
              setTimeLeft(m === 'break' ? 5 * 60 : m === 'pomodoro' ? 25 * 60 : 0);
              setSessionDuration(0);
            }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize",
              mode === m ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
            animate={{ 
              strokeDashoffset: mode === 'focus' 
                ? 0 
                : (2 * Math.PI * 120) * (1 - timeLeft / (mode === 'break' ? 5 * 60 : 25 * 60)) 
            }}
            className={cn(
              "transition-all duration-1000",
              mode === 'break' ? "text-green-500" : "text-blue-500"
            )}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-mono font-bold tracking-tighter text-gray-900">
            {mode === 'focus' ? formatTime(sessionDuration) : formatTime(timeLeft)}
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mt-2">
            {isActive ? 'Focusing...' : 'Ready?'}
          </span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isActive}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "p-6 rounded-3xl shadow-lg transition-all transform active:scale-95",
              isActive 
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
            )}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          {mode === 'focus' && isActive && (
             <button
             onClick={handleComplete}
             className="p-4 rounded-2xl bg-green-100 text-green-600 hover:bg-green-200 transition-all"
           >
             <TimerIcon size={24} />
           </button>
          )}
        </div>
      </div>
    </div>
  );
}
