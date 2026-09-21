"use client";

import React from "react";
import { Sprout, SunMedium, Calendar, BookOpen } from "lucide-react";

export type TabType = "garden" | "photometer" | "calendar" | "knowledge";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "garden", label: "Сад", icon: Sprout },
    { id: "photometer", label: "Люксметр", icon: SunMedium },
    { id: "calendar", label: "Календарь", icon: Calendar },
    { id: "knowledge", label: "Знания", icon: BookOpen },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 px-4 py-2 flex justify-around items-center z-40 shadow-lg max-w-md mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-emerald-700 bg-emerald-50 scale-105 font-medium"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[11px] mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
