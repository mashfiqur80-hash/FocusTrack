/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStudyStore } from './useStudyStore';
import { Dashboard } from './components/Dashboard';
import { Timer } from './components/Timer';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    subjects, 
    sessions, 
    stats, 
    dailyGoalSeconds, 
    setDailyGoalSeconds, 
    addSession, 
    addSubject, 
    deleteSubject 
  } = useStudyStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard sessions={sessions} subjects={subjects} stats={stats} dailyGoalSeconds={dailyGoalSeconds} />;
      case 'timer':
        return <Timer subjects={subjects} onComplete={addSession} />;
      case 'analytics':
        return <Analytics sessions={sessions} subjects={subjects} />;
      case 'settings':
        return (
          <Settings 
            subjects={subjects} 
            addSubject={addSubject} 
            deleteSubject={deleteSubject} 
            dailyGoalSeconds={dailyGoalSeconds}
            setDailyGoalSeconds={setDailyGoalSeconds}
            sessions={sessions}
          />
        );
      default:
        return <Dashboard sessions={sessions} subjects={subjects} stats={stats} dailyGoalSeconds={dailyGoalSeconds} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-md mx-auto px-6 pt-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

