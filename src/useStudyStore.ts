import { useState, useEffect, useCallback } from 'react';
import { Subject, StudySession, UserStats } from './types';
import { format, isSameDay, subDays, parseISO } from 'date-fns';

const STORAGE_KEY = 'studyflow_data';

export function useStudyStore() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<UserStats>({ streak: 0, totalStudySeconds: 0 });
  const [dailyGoalSeconds, setDailyGoalSeconds] = useState(3 * 3600); // Default 3 hours

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setSubjects(data.subjects || []);
      setSessions(data.sessions || []);
      setStats(data.stats || { streak: 0, totalStudySeconds: 0 });
      setDailyGoalSeconds(data.dailyGoalSeconds || 3 * 3600);
    } else {
      // Initial default subjects
      const initialSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', color: '#3b82f6', icon: 'Calculator' },
        { id: '2', name: 'Science', color: '#10b981', icon: 'Beaker' },
        { id: '3', name: 'English', color: '#f59e0b', icon: 'Book' },
        { id: '4', name: 'History', color: '#8b5cf6', icon: 'Scroll' },
      ];
      setSubjects(initialSubjects);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (subjects.length > 0 || sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        subjects,
        sessions,
        stats,
        dailyGoalSeconds
      }));
    }
  }, [subjects, sessions, stats, dailyGoalSeconds]);

  const addSession = useCallback((session: Omit<StudySession, 'id' | 'timestamp'>) => {
    const newSession: StudySession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setSessions(prev => [newSession, ...prev]);
    
    // Update stats
    setStats(prev => {
      const today = format(new Date(), 'yyyy-MM-dd');
      let newStreak = prev.streak;
      
      if (!prev.lastStudyDate) {
        newStreak = 1;
      } else if (!isSameDay(parseISO(prev.lastStudyDate), new Date())) {
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        if (prev.lastStudyDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        streak: newStreak,
        lastStudyDate: today,
        totalStudySeconds: prev.totalStudySeconds + session.duration
      };
    });
  }, []);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  return {
    subjects,
    sessions,
    stats,
    dailyGoalSeconds,
    setDailyGoalSeconds,
    addSession,
    addSubject,
    deleteSubject
  };
}
