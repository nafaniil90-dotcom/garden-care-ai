"use client";

import React, { useState, useEffect } from "react";
import { Plus, HeartPulse, AlertTriangle, ShieldCheck, Camera, MapPin, Trees, Home, Trash2, RefreshCw } from "lucide-react";
import { UserLocation } from "./LocationModal";

export interface Plant {
  id: string;
  name: string;
  species: string;
  zone: string;
  isOutdoor: boolean;
  quantity: number;
  unit: string;
  status: "healthy" | "quarantine";
  photo: string;
  tags: string[];
  wateringIntervalDays: number;
  lastWateredDaysAgo: number;
  heightCm: number;
  requiredLux: string;
}

interface GardenTabProps {
  currentLocation: UserLocation;
  onOpenLocationModal: () => void;
  onOpenAddModal: () => void;
  onOpenQuarantineModal: (plant: Plant) => void;
  onOpenGrowthLogModal: (plant: Plant) => void;
}

export const GardenTab: React.FC<GardenTabProps> = ({
  currentLocation,
  onOpenLocationModal,
  onOpenAddModal,
  onOpenQuarantineModal,
  onOpenGrowthLogModal,
}) => {
  const [mainCategory, setMainCategory] = useState<"outdoor" | "indoor">("outdoor");
  const [selectedSubZone, setSelectedSubZone] = useState<string>("Все на участке");

  // Default seed list for fresh demonstration
  const defaultPlants: Plant[] = [
    {
      id: "p1",
      name: "Яблоня 'Антоновка'",
      species: "Malus domestica 'Antonovka'",
      zone: "Плодовый сад",
      isOutdoor: true,
      quantity: 5,
      unit: "деревьев",
      status: "healthy",
      photo: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80",
      tags: ["Плодовое"],
      wateringIntervalDays: 7,
      lastWateredDaysAgo: 2,
      heightCm: 210,
      requiredLux: "Прямое солнце",
    },
    {
      id: "p2",
      name: "Гортензия метельчатая",
      species: "Hydrangea paniculata",
      zone: "Клумбы & Альпинарий",
      isOutdoor: true,
      quantity: 3,
      unit: "куста",
      status: "healthy",
      photo: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&q=80",
      tags: ["Цветущее"],
      wateringIntervalDays: 2,
      lastWateredDaysAgo: 1,
      heightCm: 90,
      requiredLux: "Рассеянный свет",
    },
  ];

  // Load user plants from localStorage so every user manages their own garden
  const [plants, setPlants] = useState<Plant[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_garden_plants");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return defaultPlants;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_garden_plants", JSON.stringify(plants));
    }
  }, [plants]);

  const handleDeletePlant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlants(plants.filter((p) => p.id !== id));
  };

  const handleClearGarden = () => {
    if (confirm("Очистить текущие растения и начать свой собственный сад с нуля?")) {
      setPlants([]);
    }
  };

  const handleResetDemo = () => {
    setPlants(defaultPlants);
  };

  const outdoorZones = ["Все на участке", "Плодовый сад", "Клумбы & Альпинарий", "Теплица & Грядки", "Газон & Изгородь", "Карантин"];
  const indoorZones = ["Все домашние", "Подоконник", "Гостиная", "Карантин"];

  const displayedPlants = plants.filter((p) => {
    const matchesCategory = mainCategory === "outdoor" ? p.isOutdoor : !p.isOutdoor;
    if (!matchesCategory) return false;

    if (selectedSubZone === "Все на участке" || selectedSubZone === "Все домашние") return true;
    if (selectedSubZone === "Карантин") return p.status === "quarantine";
    return p.zone === selectedSubZone;
  });

  const healthyCount = plants.filter((p) => p.isOutdoor === (mainCategory === "outdoor") && p.status === "healthy").length;
  const currentTotal = plants.filter((p) => p.isOutdoor === (mainCategory === "outdoor")).length;
  const healthPercent = currentTotal > 0 ? Math.round((healthyCount / currentTotal) * 100) : 100;

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Geolocation Bar */}
      <div className="flex justify-between items-center bg-white px-3.5 py-2 rounded-2xl shadow-sm border border-slate-100 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
          <span className="font-bold text-slate-800 truncate">
            {currentLocation.name || "Брест (Участок)"}
          </span>
        </div>
        <button
          onClick={onOpenLocationModal}
          className="text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors flex-shrink-0 text-[11px]"
        >
          Сменить гео-метку
        </button>
      </div>

      {/* Main Switcher */}
      <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => {
            setMainCategory("outdoor");
            setSelectedSubZone("Все на участке");
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            mainCategory === "outdoor"
              ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Trees className="w-4 h-4" />
          🌳 Участок и Сад ({plants.filter((p) => p.isOutdoor).length})
        </button>

        <button
          onClick={() => {
            setMainCategory("indoor");
            setSelectedSubZone("Все домашние");
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            mainCategory === "indoor"
              ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Home className="w-4 h-4" />
          🪴 Домашние ({plants.filter((p) => !p.isOutdoor).length})
        </button>
      </div>

      {/* Header Container */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
              {mainCategory === "outdoor" ? "Загородный участок" : "Домашняя коллекция"}
            </span>
            <h1 className="text-2xl font-black">
              {mainCategory === "outdoor" ? "Мой Сад & Дача" : "Комнатные Цветы"}
            </h1>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={handleClearGarden}
              className="bg-emerald-900/80 hover:bg-rose-700 text-white px-2.5 py-2.5 rounded-2xl border border-emerald-600/50 shadow flex items-center gap-1 text-[11px] font-semibold transition-colors"
              title="Очистить сад"
            >
              <Trash2 className="w-4 h-4 text-rose-300" />
            </button>
            <button
              onClick={onOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-2.5 rounded-2xl shadow-lg flex items-center gap-1 text-xs font-bold transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </div>
        </div>

        {/* Dynamic Category AI-Control Button */}
        <button
          onClick={() => onOpenQuarantineModal(displayedPlants[0] || null)}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all transform active:scale-98 border border-amber-300/50"
        >
          <Camera className="w-5 h-5 text-slate-950 animate-pulse" />
          <span>
            {mainCategory === "outdoor"
              ? "Пройти по саду с AI-Контролем"
              : "Пройти по дому с AI-Контролем"}
          </span>
        </button>

        {/* Health Score Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-100 flex items-center gap-1 font-medium">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Индекс здоровья посадок
            </span>
            <span className="font-extrabold text-emerald-300">{healthPercent}%</span>
          </div>
          <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-emerald-700/50">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center text-[11px] px-1 text-slate-500">
        <span>Показано: {displayedPlants.length} из {plants.length}</span>
        {plants.length === 0 && (
          <button onClick={handleResetDemo} className="text-emerald-700 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Загрузить демо-сад
          </button>
        )}
      </div>

      {/* Sub-Zones Pill Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(mainCategory === "outdoor" ? outdoorZones : indoorZones).map((zone) => {
          const isSelected = selectedSubZone === zone;
          const isQuarantinePill = zone === "Карантин";
          return (
            <button
              key={zone}
              onClick={() => setSelectedSubZone(zone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? isQuarantinePill
                    ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                    : "bg-emerald-700 text-white shadow-md shadow-emerald-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {zone}
            </button>
          );
        })}
      </div>

      {/* Plant Cards List */}
      <div className="space-y-3">
        {displayedPlants.length > 0 ? (
          displayedPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex gap-3.5 items-center hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={plant.photo} alt={plant.name} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-slate-700">
                  {plant.quantity} {plant.unit}
                </div>
                {plant.status === "quarantine" && (
                  <div className="absolute inset-0 bg-rose-950/50 backdrop-blur-[1px] flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-rose-400 animate-bounce" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{plant.name}</h3>
                  <div className="flex items-center gap-1">
                    {plant.status === "quarantine" ? (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> В Карантине
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Норма
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDeletePlant(plant.id, e)}
                      className="text-slate-300 hover:text-rose-600 p-1"
                      title="Удалить растение"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic truncate">{plant.species}</p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                    📍 {plant.zone}
                  </span>
                  <span className="text-slate-400">• {plant.heightCm} см</span>
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenGrowthLogModal(plant)}
                    className="flex-1 py-1 text-[10px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-center"
                  >
                    📈 Динамика
                  </button>
                  <button
                    onClick={() => onOpenQuarantineModal(plant)}
                    className="flex-1 py-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-emerald-600" />
                    AI-Контроль
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Ваш сад пока пуст</h3>
              <p className="text-xs text-slate-400 mt-1">
                Нажмите кнопку ниже, чтобы сфотографировать и добавить первое растение в свой личный сад!
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200"
            >
              + Добавить свое первое растение
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
