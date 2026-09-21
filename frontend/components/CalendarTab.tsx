"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, CloudRain, Moon, CheckCircle2, Thermometer, Umbrella, Sparkles } from "lucide-react";
import { UserLocation } from "./LocationModal";

interface CalendarTabProps {
  currentLocation: UserLocation;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ currentLocation }) => {
  const [tasks, setTasks] = useState([
    {
      id: "t1",
      plant: "Яблоня 'Антоновка' (5 деревьев)",
      action: "Осенняя фосфорно-калийная подкормка под перекопку",
      due: "Завтра (до 18:00)",
      completed: false,
      isOutdoor: true,
      weatherReason: "🍂 Осенняя подготовка к зимовке",
    },
    {
      id: "t2",
      plant: "Петуния ампельная (12 вазонов)",
      action: "Полив уличных вазонов отменен из-за осенних осадков",
      due: "Сегодня",
      completed: true,
      isOutdoor: true,
      weatherReason: "🌧️ Влажность почвы в норме после дождей",
    },
    {
      id: "t3",
      plant: "Томаты 'Бычье сердце' (Теплица)",
      action: "Сбор финального урожая и зачистка ботвы",
      due: "Сегодня",
      completed: false,
      isOutdoor: true,
      weatherReason: null,
    },
    {
      id: "t4",
      plant: "Гортензия метельчатая (Карантин)",
      action: "Мульчирование приствольного круга сосновой корой",
      due: "Через 2 дня",
      completed: false,
      isOutdoor: true,
      weatherReason: null,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white rounded-3xl p-5 shadow-xl space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-teal-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              Погода & Осенний Календарь
            </span>
            <h1 className="text-2xl font-black">Умные Напоминания</h1>
          </div>
          <span className="bg-teal-700/60 px-2.5 py-1 rounded-xl text-xs font-semibold border border-teal-500/40">
            📍 {currentLocation.name}
          </span>
        </div>
        <p className="text-xs text-teal-100">
          Сезонный уход и погодная подстройка задач на участке
        </p>
      </div>

      {/* Weather Rules Widgets Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Осенний погодный свод участка
        </h2>

        {/* Rain Postponement Rule Alert */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start gap-3 text-xs text-sky-950 shadow-sm">
          <CloudRain className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold block text-sky-900">🌧️ Осенние осадки (+11.5°C)</span>
            <p className="text-[11px] text-sky-800 leading-snug">
              Полив уличного газона и кустарников временно отменен. Грунт оптимально увлежнен.
            </p>
          </div>
        </div>

        {/* Pre-Frost Shelter Rule Alert */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 flex items-start gap-3 text-xs text-indigo-950 shadow-sm">
          <Thermometer className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold block text-indigo-900">❄️ Подготовка к ночным заморозкам</span>
            <p className="text-[11px] text-indigo-800 leading-snug">
              Температура ночью опускается до +3°C. Проверьте укрытие теплолюбивых многолетников.
            </p>
          </div>
        </div>
      </div>

      {/* Lunar Phase Widget */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950 p-2.5 rounded-xl border border-indigo-800">
            <Moon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Лунный календарь</div>
            <div className="text-sm font-black text-white">Убывающая Луна 🌒</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Оптимально для перекопки и внесения осенних удобрений</div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Задачи на участке</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                task.completed
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`p-1 rounded-full transition-colors ${
                    task.completed ? "text-emerald-600" : "text-slate-300 hover:text-emerald-500"
                  }`}
                >
                  <CheckCircle2 className={`w-6 h-6 ${task.completed ? "fill-emerald-100 stroke-emerald-600" : ""}`} />
                </button>

                <div className="min-w-0">
                  <div className={`font-bold text-xs ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                    {task.plant}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{task.action}</div>
                  
                  {task.weatherReason && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-bold mt-1">
                      {task.weatherReason}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                  {task.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
