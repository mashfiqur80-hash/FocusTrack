import React, { useState } from 'react';
import { Plus, Trash2, Palette, Target, Download } from 'lucide-react';
import { Subject } from '../types';
import { cn } from '../lib/utils';

interface SettingsProps {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;
  dailyGoalSeconds: number;
  setDailyGoalSeconds: (seconds: number) => void;
  sessions: any[];
}

export function Settings({ 
  subjects, 
  addSubject, 
  deleteSubject, 
  dailyGoalSeconds, 
  setDailyGoalSeconds,
  sessions
}: SettingsProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#3b82f6');

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject({
      name: newSubjectName,
      color: newSubjectColor,
      icon: 'Book'
    });
    setNewSubjectName('');
  };

  const exportData = () => {
    const data = {
      subjects,
      sessions,
      dailyGoalSeconds,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyflow-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your subjects and goals</p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-900">
          <Target size={20} />
          <h3 className="font-bold">Daily Study Goal</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Target Hours</span>
            <span className="text-lg font-bold text-blue-600">{dailyGoalSeconds / 3600}h</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            step="0.5"
            value={dailyGoalSeconds / 3600}
            onChange={(e) => setDailyGoalSeconds(parseFloat(e.target.value) * 3600)}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>1 Hour</span>
            <span>12 Hours</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-900">
          <Palette size={20} />
          <h3 className="font-bold">Subjects</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="New Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 p-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewSubjectColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all transform active:scale-90 border-2",
                    newSubjectColor === c ? "border-gray-900 scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </form>

          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                </div>
                <button
                  onClick={() => deleteSubject(s.id)}
                  className="text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-900">
          <Download size={20} />
          <h3 className="font-bold">Data Management</h3>
        </div>
        <button
          onClick={exportData}
          className="w-full p-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all"
        >
          <Download size={20} />
          <span>Export Study Data</span>
        </button>
      </section>
    </div>
  );
}
