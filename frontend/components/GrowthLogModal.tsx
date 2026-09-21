"use client";

import React, { useState } from "react";
import { X, Activity, Plus, Calendar, TrendingUp, Image as ImageIcon } from "lucide-react";
import { Plant } from "./GardenTab";

interface GrowthLogModalProps {
  plant: Plant | null;
  onClose: () => void;
}

export const GrowthLogModal: React.FC<GrowthLogModalProps> = ({ plant, onClose }) => {
  const [logs, setLogs] = useState([
    {
      id: "l1",
      date: "10 сентября 2026",
      heightCm: 45,
      photo: plant?.photo || "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&q=80",
      note: "Появился новый молодой лист после внесенных удобрений.",
    },
    {
      id: "l2",
      date: "01 августа 2026",
      heightCm: 38,
      photo: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80",
      note: "Пересадка в свежий субстрат с перлитом.",
    },
    {
      id: "l3",
      date: "15 июня 2026",
      heightCm: 30,
      photo: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=400&q=80",
      note: "Покупка черенка.",
    },
  ]);

  const [newHeight, setNewHeight] = useState("");
  const [newNote, setNewNote] = useState("");

  if (!plant) return null;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeight) return;

    const newEntry = {
      id: "l_" + Date.now(),
      date: "Сегодня",
      heightCm: Number(newHeight),
      photo: plant.photo,
      note: newNote || "Замер роста",
    };

    setLogs([newEntry, ...logs]);
    setNewHeight("");
    setNewNote("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Дневник Роста & Галерея</h2>
              <p className="text-[11px] text-slate-400">{plant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Growth Stats Overview */}
        <div className="bg-emerald-800 text-white rounded-2xl p-4 flex justify-around items-center">
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block">Начальный рост</span>
            <span className="text-lg font-bold">30 см</span>
          </div>
          <div className="text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block">Текущий рост</span>
            <span className="text-lg font-bold text-emerald-300">{logs[0]?.heightCm || plant.heightCm} см</span>
          </div>
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAddLog} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Зафиксировать новый прирост</span>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Высота (см)"
              value={newHeight}
              onChange={(e) => setNewHeight(e.target.value)}
              className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Заметка к фото..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Timeline Photo History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">История снимков</h3>
          <div className="space-y-3 relative pl-4 border-l-2 border-emerald-100">
            {logs.map((log) => (
              <div key={log.id} className="relative space-y-1.5">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {log.date}
                  </span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {log.heightCm} см
                  </span>
                </div>
                <div className="flex gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 items-center">
                  <img src={log.photo} alt="Timeline photo" className="w-14 h-14 rounded-lg object-cover" />
                  <p className="text-xs text-slate-600 italic leading-relaxed flex-1">{log.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
