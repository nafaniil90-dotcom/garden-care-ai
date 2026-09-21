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

  // User Geolocation State (City or Map Pin coordinates)
  const [currentLocation, setCurrentLocation] = useState<UserLocation>({
    name: "Брест (Участок)",
    lat: 52.0976,
    lon: 23.7341,
    isCustomPin: true,
  });

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
            currentLocation={currentLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenQuarantineModal={(plant) => setQuarantinePlant(plant)}
            onOpenGrowthLogModal={(plant) => setGrowthLogPlant(plant)}
          />
        )}
        {activeTab === "photometer" && <PhotometerTab />}
        {activeTab === "calendar" && <CalendarTab currentLocation={currentLocation} />}
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
        onPlantAdded={() => {}}
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
