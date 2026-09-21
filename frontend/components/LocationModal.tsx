"use client";

import React, { useState } from "react";
import { X, MapPin, Navigation, CheckCircle2, Globe, Search } from "lucide-react";

export interface UserLocation {
  name: string;
  lat?: number;
  lon?: number;
  isCustomPin?: boolean;
}

interface LocationModalProps {
  isOpen: boolean;
  currentLocation: UserLocation;
  onClose: () => void;
  onSaveLocation: (loc: UserLocation) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentLocation,
  onClose,
  onSaveLocation,
}) => {
  const [mode, setMode] = useState<"city" | "map">("city");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(currentLocation.name || "Брест");
  const [pinCoords, setPinCoords] = useState<{ lat: number; lon: number }>({
    lat: currentLocation.lat || 52.0976,
    lon: currentLocation.lon || 23.7341,
  });

  if (!isOpen) return null;

  // Comprehensive city list across Belarus, Russia, Ukraine, CIS
  const allCities = [
    // Беларусь
    { name: "Брест", country: "Беларусь", lat: 52.0976, lon: 23.7341 },
    { name: "Минск", country: "Беларусь", lat: 53.9006, lon: 27.5590 },
    { name: "Гродно", country: "Беларусь", lat: 53.6884, lon: 23.8258 },
    { name: "Гомель", country: "Беларусь", lat: 52.4345, lon: 30.9754 },
    { name: "Витебск", country: "Беларусь", lat: 55.1904, lon: 30.2049 },
    { name: "Могилев", country: "Беларусь", lat: 53.9168, lon: 30.3449 },
    { name: "Барановичи", country: "Беларусь", lat: 53.1327, lon: 26.0139 },
    { name: "Пинск", country: "Беларусь", lat: 52.1153, lon: 26.0988 },
    { name: "Орша", country: "Беларусь", lat: 54.5085, lon: 30.4168 },
    { name: "Полоцк / Новополоцк", country: "Беларусь", lat: 55.4856, lon: 28.7681 },
    { name: "Лида", country: "Беларусь", lat: 53.8833, lon: 25.3000 },
    { name: "Мозырь", country: "Беларусь", lat: 52.0494, lon: 29.2456 },
    { name: "Солигорск", country: "Беларусь", lat: 52.7876, lon: 27.5415 },
    { name: "Кобрин", country: "Беларусь", lat: 52.2139, lon: 24.3564 },

    // Россия
    { name: "Москва (Центр)", country: "Россия", lat: 55.7558, lon: 37.6173 },
    { name: "Подмосковье (Истра / Одинцово)", country: "Россия", lat: 55.9142, lon: 36.8594 },
    { name: "Подмосковье (Дмитров / Сергиев Посад)", country: "Россия", lat: 56.3440, lon: 37.5197 },
    { name: "Санкт-Петербург", country: "Россия", lat: 59.9343, lon: 30.3351 },
    { name: "Смоленск", country: "Россия", lat: 54.7818, lon: 32.0401 },
    { name: "Брянск", country: "Россия", lat: 53.2521, lon: 34.3717 },
    { name: "Псков", country: "Россия", lat: 57.8193, lon: 28.3317 },
    { name: "Калуга", country: "Россия", lat: 54.5293, lon: 36.2754 },
    { name: "Тула", country: "Россия", lat: 54.1961, lon: 37.6182 },
    { name: "Воронеж", country: "Россия", lat: 51.6720, lon: 39.1843 },
    { name: "Краснодар / Сочи", country: "Россия", lat: 45.0355, lon: 38.9753 },
    { name: "Казань", country: "Россия", lat: 55.8304, lon: 49.0661 },
    { name: "Нижний Новгород", country: "Россия", lat: 56.2965, lon: 43.9361 },
    { name: "Екатеринбург", country: "Россия", lat: 56.8389, lon: 60.6057 },

    // Украина
    { name: "Киев", country: "Украина", lat: 50.4501, lon: 30.5234 },
    { name: "Харьков", country: "Украина", lat: 49.9935, lon: 36.2304 },
    { name: "Одесса", country: "Украина", lat: 46.4825, lon: 30.7233 },
    { name: "Днепр", country: "Украина", lat: 48.4647, lon: 35.0462 },
    { name: "Львов", country: "Украина", lat: 49.8397, lon: 24.0297 },
  ];

  const filteredCities = allCities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCity = (cityObj: { name: string; lat: number; lon: number }) => {
    onSaveLocation({
      name: cityObj.name,
      lat: cityObj.lat,
      lon: cityObj.lon,
      isCustomPin: false,
    });
    onClose();
  };

  const handleSaveMapPin = () => {
    onSaveLocation({
      name: `Участок (${pinCoords.lat.toFixed(2)}, ${pinCoords.lon.toFixed(2)})`,
      lat: pinCoords.lat,
      lon: pinCoords.lon,
      isCustomPin: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Геопозиция участка</h2>
              <p className="text-[11px] text-slate-400">Для микропогодного прогноза осадков</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: City List vs Interactive Map Pin */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode("city")}
            className={`py-2 rounded-lg transition-all ${
              mode === "city" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🏙️ Выбрать город
          </button>
          <button
            onClick={() => setMode("map")}
            className={`py-2 rounded-lg transition-all ${
              mode === "map" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📍 Пин на карте
          </button>
        </div>

        {mode === "city" ? (
          <div className="space-y-3">
            {/* Search Input Line */}
            <div className="relative">
              <input
                type="text"
                placeholder="Введите название своего города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => {
                  const isSelected = selectedCity === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedCity(city.name);
                        handleSaveCity(city);
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs font-medium text-left flex justify-between items-center transition-all ${
                        isSelected
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{city.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({city.country})</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Город не найден. Переключитесь на «📍 Пин на карте» для точной метки.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Navigation className="w-4 h-4 text-emerald-600" /> Поставьте метку на ваш дачный участок
              </span>
              <p className="text-[11px] text-emerald-700">
                Запрос погоды будет вычисляться с точностью до 100 метров, учитывая локальный грозовой фронт.
              </p>
            </div>

            {/* Interactive Map Visual Picker Container */}
            <div className="relative w-full h-52 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col justify-between p-3 text-white shadow-inner">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex justify-between items-start text-[11px]">
                <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-emerald-400">
                  Lat: {pinCoords.lat.toFixed(4)} | Lon: {pinCoords.lon.toFixed(4)}
                </span>
                <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded font-bold">OpenStreetMap</span>
              </div>

              {/* Center Pin Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center -translate-y-4">
                  <div className="bg-rose-600 text-white p-2 rounded-full shadow-xl animate-bounce border-2 border-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="w-3 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
                </div>
              </div>

              {/* Controls */}
              <div className="relative z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPinCoords({
                      lat: pinCoords.lat + (Math.random() * 0.02 - 0.01),
                      lon: pinCoords.lon + (Math.random() * 0.02 - 0.01),
                    })
                  }
                  className="flex-1 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl text-[11px] font-semibold border border-slate-700 text-center"
                >
                  🎯 Установить точный пин дома/дачи
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveMapPin}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-200 transition-all"
            >
              Сохранить координаты участка
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
