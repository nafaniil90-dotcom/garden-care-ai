"use client";

import React, { useState } from "react";
import { X, Camera, Sparkles, Loader2 } from "lucide-react";
import { diagnosePlantPhoto } from "../lib/api";
import { compressImage } from "../lib/imageUtils";

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setAiStatusMessage(null);

    try {
      // Compress photo client-side to max 800px & ~80KB JPEG
      const compressedBase64 = await compressImage(file, 800, 0.7);
      setPhoto(compressedBase64);
    } catch (err) {
      console.warn("Image compression error:", err);
      // Fallback: read directly if canvas fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRecognizePhoto = async () => {
    if (!photo) return;
    setIsAiAnalyzing(true);
    setAiStatusMessage(null);

    try {
      const res = await diagnosePlantPhoto(photo);
      if (res && res.species && !res.species.includes("Ошибка")) {
        setName(res.species.split(" ")[0]);
        setSpecies(res.species);
        setAiStatusMessage(`Распознано AI: ${res.species}`);
      } else {
        setAiStatusMessage("Сорт не удалось распознать автоматически. Введите название вручную.");
      }
    } catch (e) {
      setAiStatusMessage("Не удалось связаться с AI-сервером. Заполните название вручную.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlant = {
      id: "p_" + Date.now(),
      name: name.trim(),
      species: species.trim() || "Сорт не определен",
      zone,
      isOutdoor,
      quantity: Number(quantity) || 1,
      unit: unit || "шт.",
      status: "healthy",
      photo: photo || "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80",
      tags: ["Моя посадка"],
      wateringIntervalDays: 4,
      lastWateredDaysAgo: 0,
      heightCm: 40,
      requiredLux: "Прямое солнце",
    };

    onPlantAdded(newPlant);
    
    // Reset form
    setName("");
    setSpecies("");
    setPhoto(null);
    setAiStatusMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Добавить растение на участок</h2>
              <p className="text-[11px] text-slate-400">Ручной ввод или AI-распознавание</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Photo container */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Фотография посадки</label>
            <div className="border border-slate-200 bg-slate-50 rounded-2xl p-3 text-center space-y-2">
              {isCompressing ? (
                <div className="py-6 text-center space-y-2">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-600 font-semibold">Оптимизация снимка...</p>
                </div>
              ) : photo ? (
                <div className="space-y-2">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setAiStatusMessage(null);
                      }}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Optional AI Recognition Trigger */}
                  <button
                    type="button"
                    onClick={handleRecognizePhoto}
                    disabled={isAiAnalyzing}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    {isAiAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Определение сорта AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" /> Распознать сорт по фото
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block py-3">
                  <Camera className="w-7 h-7 text-emerald-600 mx-auto mb-1 animate-bounce" />
                  <span className="text-xs font-bold text-slate-800 block">Загрузить фото растения</span>
                  <span className="text-[10px] text-slate-400">Сохраняется на вашем телефоне</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {aiStatusMessage && (
              <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-1.5">
                {aiStatusMessage}
              </p>
            )}
          </div>

          {/* Plant Name input with focus select-all */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Название культуры *</label>
            <input
              type="text"
              required
              placeholder="Например: Гортензия, Яблоня или Петуния"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Species / Variety input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Вид / Сорт</label>
              <button
                type="button"
                onClick={() => setSpecies("Сорт не определен")}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Не знаю сорт
              </button>
            </div>
            <input
              type="text"
              placeholder="Например: Hydrangea paniculata (необязательно)"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Количество</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                onFocus={(e) => e.target.select()}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ед. измерения</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
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

          {/* Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Зона участка</label>
            <select
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                setIsOutdoor(!["Подоконник", "Гостиная"].includes(e.target.value));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
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
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-200 transition-all active:scale-98"
          >
            + Добавить в мой сад
          </button>
        </form>
      </div>
    </div>
  );
};
