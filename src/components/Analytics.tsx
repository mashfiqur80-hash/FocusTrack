import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { StudySession, Subject } from '../types';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

interface AnalyticsProps {
  sessions: StudySession[];
  subjects: Subject[];
}

export function Analytics({ sessions, subjects }: AnalyticsProps) {
  // Last 7 days data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const dailyData = last7Days.map(day => {
    const daySessions = sessions.filter(s => 
      format(new Date(s.timestamp), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return {
      name: format(day, 'EEE'),
      minutes: totalMinutes,
    };
  });

  // Subject distribution
  const subjectData = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const totalMinutes = Math.round(subjectSessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return {
      name: subject.name,
      value: totalMinutes,
      color: subject.color,
    };
  }).filter(d => d.value > 0);

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  const mostStudied = [...subjectData].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Your study performance over time</p>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900">Study Time (Last 7 Days)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900">Subject Focus</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {subjectData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-bold text-gray-900">{Math.round((d.value / totalMinutes) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col justify-center items-center text-center space-y-2">
          <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Top Subject</p>
          {mostStudied ? (
            <>
              <h2 className="text-3xl font-bold text-blue-900">{mostStudied.name}</h2>
              <p className="text-blue-700 font-medium">
                You've spent {Math.round(mostStudied.value / 60)} hours focusing on this!
              </p>
            </>
          ) : (
            <p className="text-blue-700">Start studying to see your top subject!</p>
          )}
        </div>
      </div>
    </div>
  );
}
