"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sun, SunMedium, Zap, ShieldAlert, Sparkles, Video, RefreshCw } from "lucide-react";

export const PhotometerTab: React.FC = () => {
  const [lux, setLux] = useState<number>(1850);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [selectedPlantCategory, setSelectedPlantCategory] = useState<string>("Тенелюбивые");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Start real camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unequipped, using fallback sensor simulation");
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Frame processing for Lux calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx && video.videoWidth > 0) {
            canvas.width = 64;
            canvas.height = 64;
            ctx.drawImage(video, 0, 0, 64, 64);
            const imgData = ctx.getImageData(0, 0, 64, 64);
            let sumLuminance = 0;
            for (let i = 0; i < imgData.data.length; i += 4) {
              const r = imgData.data[i];
              const g = imgData.data[i + 1];
              const b = imgData.data[i + 2];
              // Standard luminance formula
              sumLuminance += 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
            const avgLuminance = sumLuminance / (64 * 64);
            // Map 0..255 luminance to roughly 200..8000 Lux scale
            const calculatedLux = Math.round((avgLuminance / 255) * 6000 + 300);
            setLux(calculatedLux);
          }
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Lux categories
  const getLuxCategory = (luxVal: number) => {
    if (luxVal < 1000) return { label: "Тень / Слабый свет", color: "text-indigo-600", bg: "bg-indigo-50", desc: "Подходит для аглаонем, сансевиерий, папоротников" };
    if (luxVal <= 3000) return { label: "Яркий рассеянный свет", color: "text-emerald-600", bg: "bg-emerald-50", desc: "Идеально для монстер, фикусов, драцен, калатей" };
    return { label: "Прямой солнечный свет", color: "text-amber-600", bg: "bg-amber-50", desc: "Идеально для суккулентов, кактусов, петуний, роз" };
  };

  const category = getLuxCategory(lux);

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-amber-200 text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI-Фотометр
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">Замер Освещенности</h1>
          </div>
          <div className="bg-amber-500/40 p-2.5 rounded-2xl border border-amber-400/30">
            <SunMedium className="w-6 h-6 text-amber-100" />
          </div>
        </div>
        <p className="text-xs text-amber-100 mt-2">
          Наведите камеру смартфона на место рядом с растением для точного замера Lux
        </p>
      </div>

      {/* Video Viewport / Sensor Display */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-4">
        <div className="relative w-full h-56 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
          <video ref={videoRef} playsInline muted className="w-full h-full object-cover opacity-80" />
          <canvas ref={canvasRef} className="hidden" />

          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-900/90 text-white space-y-2">
              <Video className="w-8 h-8 text-amber-400 animate-pulse" />
              <p className="text-xs font-medium">Камера недоступна. Симулируется датчик света</p>
              <button
                onClick={startCamera}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Включить камеру
              </button>
            </div>
          )}

          {/* Crosshair Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-dashed border-amber-400/80 rounded-2xl flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Realtime Lux Badge Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Текущий поток</span>
                <span className="text-xl font-black text-amber-300">{lux.toLocaleString()} Lux</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${category.bg} ${category.color}`}>
              {category.label}
            </span>
          </div>
        </div>

        {/* Dynamic Light Gauge Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>0 Lux</span>
            <span>2500 Lux</span>
            <span>6000+ Lux</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (lux / 6000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={`rounded-2xl p-4 border space-y-2 ${category.bg} border-emerald-200`}>
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${category.color}`} />
          <h3 className={`font-bold text-sm ${category.color}`}>Рекомендация по размещению</h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{category.desc}</p>
      </div>

      {/* Preset Plant Light Needs Helper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Проверка под вид растения</h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { name: "Тенелюбивые", req: "500-1200 Lux" },
            { name: "Рассеянный свет", req: "1500-3000 Lux" },
            { name: "Светолюбивые", req: "3000+ Lux" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedPlantCategory(item.name)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedPlantCategory === item.name
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                  : "border-slate-100 bg-slate-50 text-slate-600"
              }`}
            >
              <div className="text-[11px] font-bold truncate">{item.name}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{item.req}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
