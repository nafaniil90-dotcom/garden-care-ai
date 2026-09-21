"use client";

import React, { useState } from "react";
import { X, AlertTriangle, ShieldCheck, Sparkles, Loader2, ExternalLink, CheckCircle2, Pill, Camera, Image as ImageIcon } from "lucide-react";
import { Plant } from "./GardenTab";
import { diagnosePlantPhoto } from "../lib/api";

interface QuarantineModalProps {
  plant: Plant | null;
  onClose: () => void;
}

export const QuarantineModal: React.FC<QuarantineModalProps> = ({ plant, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);

  if (!plant) return null;

  const handlePhotoSelected = async (base64Img: string) => {
    setSelectedImage(base64Img);
    setIsDiagnosing(true);
    setDiagnosisData(null);

    const res = await diagnosePlantPhoto(base64Img);
    setIsDiagnosing(false);
    setDiagnosisData(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handlePhotoSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDiagnosisData(null);
    setIsDiagnosing(false);
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
              <h2 className="font-bold text-slate-800 text-sm">AI-Контроль Растения</h2>
              <p className="text-[11px] text-slate-400">{plant.name} ({plant.quantity} {plant.unit})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Photo Selection Screen (When no image is chosen yet) */}
        {!selectedImage && !isDiagnosing && (
          <div className="space-y-4 py-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Выберите способ проверки листа</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Сделайте свежий снимок прямо во время прогулки по саду или загрузите ране сделанную фотографию из галереи.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Camera Trigger */}
              <label className="cursor-pointer w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all">
                <Camera className="w-4 h-4" />
                <span>📷 Сделать фото на камеру</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Gallery File Picker */}
              <label className="cursor-pointer w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>🖼️ Выбрать фото из галереи</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: AI Processing Loader */}
        {isDiagnosing && (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI-Контроль анализирует растение...
              </h3>
              <p className="text-xs text-slate-400">Сверка состояния листьев, симптомов болезней и вредителей</p>
            </div>
          </div>
        )}

        {/* STEP 3: Display Findings & Care Scheme (Only AFTER Photo Processing) */}
        {diagnosisData && !isDiagnosing && (
          <div className="space-y-3 pt-1">
            {/* Selected Image Preview */}
            <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <img src={selectedImage || plant.photo} alt="Scanned plant" className="w-full h-full object-cover" />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                🔄 Сделать другой снимок
              </button>
            </div>

            {/* Findings Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Результат AI-Контроля</span>
                <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Здоровье: {diagnosisData.health_score}%
                </span>
              </div>
              <h4 className="font-extrabold text-emerald-900 text-sm">{diagnosisData.diagnosis}</h4>
              
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Обнаружено на фото:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                  {diagnosisData.symptoms?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Care & Treatment Scheme */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                Схема ухода и обработки
              </h4>
              <ol className="list-decimal list-inside text-xs text-emerald-950 space-y-1.5 leading-relaxed">
                {diagnosisData.treatment_plan?.map((step: string, idx: number) => (
                  <li key={idx} className="font-medium">{step}</li>
                ))}
              </ol>
            </div>

            {/* Recommended Products */}
            {diagnosisData.recommended_products && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Рекомендуемые средства ухода
                </span>
                {diagnosisData.recommended_products.map((prod: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs text-slate-800">{prod.title}</div>
                      <div className="text-[10px] text-slate-400">{prod.marketplace} • {prod.price}</div>
                    </div>
                    <a
                      href={prod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      Купить <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
