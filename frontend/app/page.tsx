"use client";

import React, { useState, useEffect } from "react";
import { initTelegramApp } from "../lib/telegram";
import { BottomNav, TabType } from "../components/BottomNav";
import { GardenTab, Plant } from "../components/GardenTab";
import { PhotometerTab } from "../components/PhotometerTab";
import { CalendarTab } from "../components/CalendarTab";
import { KnowledgeTab } from "../components/KnowledgeTab";
import { AddPlantModal } from "../components/AddPlantModal";
import { QuarantineModal } from "../components/QuarantineModal";
import { GrowthLogModal } from "../components/GrowthLogModal";
import { LocationModal, UserLocation } from "../components/LocationModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("garden");

  // User Geolocation State
  const [currentLocation, setCurrentLocation] = useState<UserLocation>({
    name: "Брест (Участок)",
    lat: 52.0976,
    lon: 23.7341,
    isCustomPin: true,
  });

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

  const sanitizePlant = (p: any): Plant => ({
    id: p.id || "p_" + Math.random().toString(36).substr(2, 9),
    name: p.name || "Растение",
    species: p.species || "Сорт не определен",
    zone: p.zone || "Плодовый сад",
    isOutdoor: typeof p.isOutdoor === "boolean" ? p.isOutdoor : true,
    quantity: Number(p.quantity) || 1,
    unit: p.unit || "шт.",
    status: p.status === "quarantine" ? "quarantine" : "healthy",
    photo: p.photo || "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80",
    tags: Array.isArray(p.tags) ? p.tags : ["Моя посадка"],
    wateringIntervalDays: Number(p.wateringIntervalDays) || 4,
    lastWateredDaysAgo: Number(p.lastWateredDaysAgo) || 0,
    heightCm: Number(p.heightCm) || 40,
    requiredLux: p.requiredLux || "Прямое солнце",
  });

  // User Garden Plants State with localStorage persistence and safe sanitizer
  const [plants, setPlants] = useState<Plant[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_garden_plants");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.map(sanitizePlant);
          }
        } catch (e) {}
      }
    }
    return defaultPlants;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_garden_plants", JSON.stringify(plants));
      } catch (err) {
        console.warn("Could not save garden plants to localStorage (Quota exceeded or restricted):", err);
        // Fallback: strip heavy base64 photos if quota exceeded
        try {
          const lightPlants = plants.map((p) => ({
            ...p,
            photo: p.photo.startsWith("data:") ? "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80" : p.photo,
          }));
          localStorage.setItem("user_garden_plants", JSON.stringify(lightPlants));
        } catch (e) {
          console.warn("Failed to store even stripped plants:", e);
        }
      }
    }
  }, [plants]);

  const handleAddPlant = (newPlant: Plant) => {
    const cleanPlant = sanitizePlant(newPlant);
    setPlants((prev) => [cleanPlant, ...prev]);
  };

  const handleDeletePlant = (id: string) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearGarden = () => {
    if (confirm("Очистить текущие растения и начать свой собственный сад с нуля?")) {
      setPlants([]);
    }
  };

  const handleResetDemo = () => {
    setPlants(defaultPlants);
  };

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quarantinePlant, setQuarantinePlant] = useState<Plant | null>(null);
  const [growthLogPlant, setGrowthLogPlant] = useState<Plant | null>(null);

  useEffect(() => {
    initTelegramApp();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f7f4] text-slate-800">
      {/* Tab Screen Renderer */}
      <main>
        {activeTab === "garden" && (
          <GardenTab
            plants={plants}
            onDeletePlant={handleDeletePlant}
            onClearGarden={handleClearGarden}
            onResetDemo={handleResetDemo}
            currentLocation={currentLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenQuarantineModal={(plant) => setQuarantinePlant(plant)}
            onOpenGrowthLogModal={(plant) => setGrowthLogPlant(plant)}
          />
        )}
        {activeTab === "photometer" && <PhotometerTab />}
        {activeTab === "calendar" && (
          <CalendarTab currentLocation={currentLocation} plants={plants} />
        )}
        {activeTab === "knowledge" && <KnowledgeTab />}
      </main>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        currentLocation={currentLocation}
        onClose={() => setIsLocationModalOpen(false)}
        onSaveLocation={(newLoc) => setCurrentLocation(newLoc)}
      />

      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPlantAdded={handleAddPlant}
      />

      <QuarantineModal
        plant={quarantinePlant}
        onClose={() => setQuarantinePlant(null)}
      />

      <GrowthLogModal
        plant={growthLogPlant}
        onClose={() => setGrowthLogPlant(null)}
      />

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
