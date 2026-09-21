"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, CloudRain, Moon, CheckCircle2, Thermometer, Plus } from "lucide-react";
import { UserLocation } from "./LocationModal";
import { Plant } from "./GardenTab";

interface CalendarTabProps {
  currentLocation: UserLocation;
  plants: Plant[];
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ currentLocation, plants }) => {
  // Dynamically generate tasks based strictly on the user's actual garden plants
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const generatedTasks = plants.map((plant) => {
    let action = `Сезонный уход и осмотр`;
    let weatherReason = null;

    if (plant.name.toLowerCase().includes("яблоня") || plant.name.toLowerCase().includes("дерево")) {
      action = `Осеннее мульчирование приствольного круга`;
      weatherReason = `🍂 Подготовка к зимовке`;
    } else if (plant.name.toLowerCase().includes("гортензия") || plant.name.toLowerCase().includes("роза")) {
      action = `Проверка влажности грунта и укрытие на ночь`;
      weatherReason = `❄️ Осенняя прохлада +11.5°C`;
    } else if (plant.name.toLowerCase().includes("газон") || plant.name.toLowerCase().includes("петуния")) {
      action = `Полив отменен из-за осадков в районе участка`;
      weatherReason = `🌧️ Осадки на участке`;
    } else if (plant.name.toLowerCase().includes("томат") || plant.name.toLowerCase().includes("огурец")) {
      action = `Сбор урожая и проветривание теплицы`;
    }

    return {
      id: `task_${plant.id}`,
      plantName: `${plant.name} (${plant.quantity} ${plant.unit})`,
      action,
      due: "Сегодня",
      isCompleted: completedTaskIds.includes(`task_${plant.id}`),
      weatherReason,
    };
  });

  const toggleTask = (id: string) => {
    if (completedTaskIds.includes(id)) {
      setCompletedTaskIds(completedTaskIds.filter((tId) => tId !== id));
    } else {
      setCompletedTaskIds([...completedTaskIds, id]);
    }
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
              Полив уличного газона и кустарников временно отменен. Грунт оптимально увлажнен.
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

      {/* Dynamic Tasks List Tied strictly to user's actual garden plants */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
          <span>Задачи по вашим растениям ({generatedTasks.length})</span>
        </h2>

        {generatedTasks.length > 0 ? (
          <div className="space-y-2">
            {generatedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.isCompleted
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`p-1 rounded-full transition-colors ${
                      task.isCompleted ? "text-emerald-600" : "text-slate-300 hover:text-emerald-500"
                    }`}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${task.isCompleted ? "fill-emerald-100 stroke-emerald-600" : ""}`} />
                  </button>

                  <div className="min-w-0">
                    <div className={`font-bold text-xs ${task.isCompleted ? "line-through text-slate-500" : "text-slate-800"}`}>
                      {task.plantName}
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
        ) : (
          <div className="bg-white rounded-3xl p-6 text-center space-y-2 border border-slate-100 shadow-sm">
            <CalendarIcon className="w-8 h-8 text-teal-600 mx-auto opacity-80" />
            <h3 className="font-bold text-slate-800 text-xs">У вас пока нет задач в календаре</h3>
            <p className="text-[11px] text-slate-400">
              Добавьте свои первые растения во вкладке «Сад», чтобы сформировать персональный график ухода.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
