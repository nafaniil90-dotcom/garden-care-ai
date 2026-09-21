"use client";

import React, { useState } from "react";
import { X, Camera, Sparkles, Loader2, CheckCircle2, HelpCircle } from "lucide-react";
import { diagnosePlantPhoto } from "../lib/api";

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlantAdded: (plant: any) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onPlantAdded }) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [zone, setZone] = useState("Плодовый сад");
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("шт.");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhoto(base64);

      // AI auto-identify
      setIsAiAnalyzing(true);
      const res = await diagnosePlantPhoto(base64);
      setIsAiAnalyzing(false);

      if (res) {
        setAiSuggestions(res);
        if (!name) setName(res.species.split(" ")[0]);
        setSpecies(res.species);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newPlant = {
      id: "p_" + Date.now(),
      name,
      species: species || "Сорт не определен",
      zone,
      isOutdoor,
      quantity: Number(quantity) || 1,
      unit: unit || "шт.",
      status: "healthy",
      photo: photo || "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80",
      tags: ["Новое на участке"],
      wateringIntervalDays: 4,
      lastWateredDaysAgo: 0,
      heightCm: 50,
      requiredLux: aiSuggestions?.care_recommendations?.light || "Прямое солнце",
    };

    onPlantAdded(newPlant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Добавить растение на участок</h2>
              <p className="text-[11px] text-slate-400">Учет количества и авто-определение сорта</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Photo & Auto-Identify trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Фотография посадки</label>
            <div className="relative border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl p-3 text-center hover:bg-emerald-50 transition-colors">
              {photo ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setAiSuggestions(null);
                    }}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block py-2">
                  <Camera className="w-7 h-7 text-emerald-600 mx-auto mb-1 animate-bounce" />
                  <span className="text-xs font-bold text-emerald-900 block">Загрузить фото из галереи или с камеры</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> ✨ Определить сорт по фото
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}

              {isAiAnalyzing && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-1.5">
                  <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> AI определяем вид и сорт...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions Badge */}
          {aiSuggestions && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 space-y-0.5">
              <div className="font-extrabold flex items-center gap-1 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Распознано: {aiSuggestions.species}
              </div>
            </div>
          )}

          {/* Fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Название культуры</label>
            <input
              type="text"
              required
              placeholder="Например: Яблоня 'Антоновка' или Малина"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Вид / Сорт</label>
              <button
                type="button"
                onClick={() => setSpecies("Сорт не определен")}
                className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
              >
                <HelpCircle className="w-3 h-3" /> Не знаю сорт
              </button>
            </div>
            <input
              type="text"
              placeholder="Например: Malus domestica 'Antonovka' (или опустите)"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quantity & Unit Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Количество</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ед. измерения</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              >
                <option value="шт.">шт.</option>
                <option value="кустов">кустов</option>
                <option value="деревьев">деревьев</option>
                <option value="вазонов">вазонов</option>
                <option value="грядок">грядок</option>
                <option value="кв.м">кв.м</option>
              </select>
            </div>
          </div>

          {/* Sub-zone select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Зона участка</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Плодовый сад">Плодовый сад</option>
              <option value="Клумбы & Альпинарий">Клумбы & Альпинарий</option>
              <option value="Теплица & Грядки">Теплица & Грядки</option>
              <option value="Газон & Изгородь">Газон & Изгородь</option>
              <option value="Подоконник">Подоконник (Дома)</option>
              <option value="Гостиная">Гостиная (Дома)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-200 transition-all active:scale-98"
          >
            Сохранить в инвентарь участка
          </button>
        </form>
      </div>
    </div>
  );
};
