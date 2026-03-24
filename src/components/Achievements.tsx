import React from 'react';
import { Award, Star, Zap, Target, Clock, Calendar, Flame } from 'lucide-react';
import { StudySession, UserStats } from '../types';
import { cn } from '../lib/utils';

interface AchievementsProps {
  sessions: StudySession[];
  stats: UserStats;
}

export function Achievements({ sessions, stats }: AchievementsProps) {
  const achievements = [
    {
      id: 'first-session',
      title: 'First Step',
      description: 'Complete your first study session',
      icon: Star,
      unlocked: sessions.length > 0,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      id: 'streak-3',
      title: 'Consistent',
      description: 'Maintain a 3-day study streak',
      icon: Flame, // I need to import Flame or use Zap
      unlocked: stats.streak >= 3,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      id: 'study-10h',
      title: 'Deep Diver',
      description: 'Study for a total of 10 hours',
      icon: Clock,
      unlocked: stats.totalStudySeconds >= 10 * 3600,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete a session before 8 AM',
      icon: Zap,
      unlocked: sessions.some(s => new Date(s.timestamp).getHours() < 8),
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 px-1">Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-500",
              achievement.unlocked 
                ? "bg-white border-gray-100 shadow-sm opacity-100" 
                : "bg-gray-50 border-transparent opacity-50 grayscale"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
              achievement.unlocked ? achievement.bg : "bg-gray-200",
              achievement.unlocked ? achievement.color : "text-gray-400"
            )}>
              <achievement.icon size={20} />
            </div>
            <p className="text-sm font-bold text-gray-900">{achievement.title}</p>
            <p className="text-[10px] text-gray-500 font-medium leading-tight mt-1">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
