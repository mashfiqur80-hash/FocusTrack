import React from 'react';
import { LayoutDashboard, Timer as TimerIcon, BarChart3, Settings, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'timer', icon: TimerIcon, label: 'Timer' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center space-y-1 transition-all",
              activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-blue-50" : "bg-transparent"
            )}>
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
