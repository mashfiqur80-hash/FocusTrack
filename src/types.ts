export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  duration: number; // in seconds
  timestamp: number;
  type: 'focus' | 'pomodoro' | 'break';
  notes?: string;
}

export interface DailyGoal {
  targetSeconds: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserStats {
  streak: number;
  lastStudyDate?: string; // YYYY-MM-DD
  totalStudySeconds: number;
}
