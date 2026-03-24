import React from 'react';
import { Trophy, Flame, Clock, Target, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { StudySession, Subject, UserStats } from '../types';
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { cn } from '../lib/utils';

import { Achievements } from './Achievements';

interface DashboardProps {
  sessions: StudySession[];
  subjects: Subject[];
  stats: UserStats;
  dailyGoalSeconds: number;
}

export function Dashboard({ sessions, subjects, stats, dailyGoalSeconds }: DashboardProps) {
  const todaySessions = sessions.filter(s => isToday(new Date(s.timestamp)));
  const todaySeconds = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekSessions = sessions.filter(s => 
    isWithinInterval(new Date(s.timestamp), { start: weekStart, end: weekEnd })
  );
  const weekSeconds = weekSessions.reduce((acc, s) => acc + s.duration, 0);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const progress = Math.min(100, (todaySeconds / dailyGoalSeconds) * 100);

  const getMotivationalMessage = () => {
    if (progress >= 100) return "Goal achieved! You're a superstar! 🌟";
    if (progress >= 75) return "Almost there, keep pushing! 💪";
    if (progress >= 50) return "Halfway done, you're doing great! ✨";
    if (progress > 0) return "Great start, keep focusing! 🚀";
    return "Ready to start your first session? 📚";
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, Student!</h1>
          <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
        <div className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100">
          <Flame size={18} fill="currentColor" />
          <span className="font-bold">{stats.streak}</span>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Today's Progress</p>
              <h2 className="text-4xl font-bold mt-1">{formatDuration(todaySeconds)}</h2>
            </div>
            <Target className="text-blue-300/50" size={40} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>{Math.round(progress)}% of daily goal</span>
              <span>{formatDuration(dailyGoalSeconds)}</span>
            </div>
            <div className="h-2 bg-blue-400/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-blue-50 italic opacity-90">
            "{getMotivationalMessage()}"
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-50" />
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Weekly Total</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{formatDuration(weekSeconds)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
            <Trophy size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Study</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{formatDuration(stats.totalStudySeconds)}</p>
        </div>
      </div>

      <Achievements sessions={sessions} stats={stats} />

      <section className="space-y-4">

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Sessions</h3>
          <button className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {todaySessions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No sessions today yet. Time to study!</p>
            </div>
          ) : (
            todaySessions.slice(0, 3).map(session => {
              const subject = subjects.find(s => s.id === session.subjectId);
              return (
                <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: subject?.color || '#ccc' }}
                    >
                      {subject?.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{subject?.name}</p>
                      <p className="text-xs text-gray-500">{format(session.timestamp, 'h:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatDuration(session.duration)}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{session.type}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
