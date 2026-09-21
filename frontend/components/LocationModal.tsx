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
    { name: "Полоцк", country: "Беларусь", lat: 55.4856, lon: 28.7681 },

    // Россия
    { name: "Москва (Центр)", country: "Россия", lat: 55.7558, lon: 37.6173 },
    { name: "Подмосковье (Истра)", country: "Россия", lat: 55.9142, lon: 36.8594 },
    { name: "Подмосковье (Дмитров)", country: "Россия", lat: 56.3440, lon: 37.5197 },
    { name: "Санкт-Петербург", country: "Россия", lat: 59.9343, lon: 30.3351 },
    { name: "Смоленск", country: "Россия", lat: 54.7818, lon: 32.0401 },
    { name: "Брянск", country: "Россия", lat: 53.2521, lon: 34.3717 },
    { name: "Калуга", country: "Россия", lat: 54.5293, lon: 36.2754 },

    // Украина
    { name: "Киев", country: "Украина", lat: 50.4501, lon: 30.5234 },
    { name: "Харьков", country: "Украина", lat: 49.9935, lon: 36.2304 },
    { name: "Одесса", country: "Украина", lat: 46.4825, lon: 30.7233 },
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

        {/* Tab Switcher */}
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
            📍 Карта с меткой
          </button>
        </div>

        {mode === "city" ? (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
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
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Navigation className="w-4 h-4 text-emerald-600" /> Отметьте участок на карте
              </span>
              <p className="text-[11px] text-emerald-700">
                Запрос погоды вычисляется точно по координатам {pinCoords.lat.toFixed(4)}, {pinCoords.lon.toFixed(4)}
              </p>
            </div>

            {/* Real Interactive OpenStreetMap Iframe View */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-300 shadow-md">
              <iframe
                title="OpenStreetMap Picker"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${pinCoords.lon - 0.03}%2C${pinCoords.lat - 0.02}%2C${pinCoords.lon + 0.03}%2C${pinCoords.lat + 0.02}&layer=mapnik&marker=${pinCoords.lat}%2C${pinCoords.lon}`}
              />
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-mono">
                Lat: {pinCoords.lat.toFixed(3)} | Lon: {pinCoords.lon.toFixed(3)}
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
