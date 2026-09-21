const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchPlants() {
  try {
    const res = await fetch(`${API_BASE_URL}/plants/`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend unavailable, using local mock state");
  }
  return null;
}

export async function diagnosePlantPhoto(base64Image: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/vision/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: base64Image }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend offline, using local AI mock diagnosis");
  }
  
  // Mock response matching Vision API format
  return {
    species: "Монстера Деликатесная (Monstera deliciosa)",
    health_score: 82,
    status: "healthy",
    diagnosis: "Здоровое растение с легким дефицитом влажности",
    symptoms: ["Подсохшие кончики нижних листьев"],
    care_recommendations: {
      light: "1500-2500 Lux (Яркий рассеянный свет)",
      watering: "Полив каждые 5-7 дней после высыхания верхнего слоя",
      humidity: "60-70% (требуется опрыскивание)",
    },
    treatment_plan: [
      "Опрыскивать отстоянной водой 1 раз в 2 дня",
      "Протирать листья от пыли влажной салфеткой",
    ],
    recommended_products: [
      { title: "Увлажнитель воздуха для растений", price: "1 200 ₽", marketplace: "Ozon", url: "https://ozon.ru" },
      { title: "Японское удобрение для монстер", price: "450 ₽", marketplace: "Wildberries", url: "https://wildberries.ru" }
    ]
  };
}
