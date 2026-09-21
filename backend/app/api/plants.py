from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import AsyncSessionLocal
from app.db.models import Plant
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/plants", tags=["Plants"])

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

class PlantCreate(BaseModel):
    name: str
    species: str
    zone_name: str = "Плодовый сад"
    is_outdoor: bool = True
    quantity: int = 1
    unit: str = "шт."
    photo_url: Optional[str] = None
    watering_interval_days: int = 5
    height_cm: float = 100.0
    required_lux: str = "Прямое солнце"

@router.get("/")
async def list_plants(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plant))
    plants = result.scalars().all()
    if not plants:
        # Seed 10 outdoor plants for CIS temperate climate (Belarus / Central Russia)
        return [
            {"id": 1, "name": "Яблоня 'Антоновка'", "species": "Malus domestica 'Antonovka'", "zone_name": "Плодовый сад", "is_outdoor": True, "quantity": 5, "unit": "деревьев", "status": "healthy", "height_cm": 210.0},
            {"id": 2, "name": "Малина 'Полка'", "species": "Rubus idaeus 'Polka'", "zone_name": "Плодовый сад", "is_outdoor": True, "quantity": 10, "unit": "кустов", "status": "healthy", "height_cm": 140.0},
            {"id": 3, "name": "Туя 'Смарагд'", "species": "Thuja occidentalis 'Smaragd'", "zone_name": "Газон & Изгородь", "is_outdoor": True, "quantity": 6, "unit": "шт.", "status": "healthy", "height_cm": 180.0},
            {"id": 4, "name": "Гортензия 'Фантом'", "species": "Hydrangea paniculata 'Phantom'", "zone_name": "Клумбы & Альпинарий", "is_outdoor": True, "quantity": 3, "unit": "куста", "status": "quarantine", "height_cm": 90.0},
            {"id": 5, "name": "Петуния ампельная", "species": "Petunia hybrida", "zone_name": "Клумбы & Альпинарий", "is_outdoor": True, "quantity": 12, "unit": "вазонов", "status": "healthy", "height_cm": 35.0},
            {"id": 6, "name": "Томаты 'Бычье сердце'", "species": "Solanum lycopersicum", "zone_name": "Теплица & Грядки", "is_outdoor": True, "quantity": 15, "unit": "кустов", "status": "healthy", "height_cm": 120.0},
            {"id": 7, "name": "Огурцы 'Кураж F1'", "species": "Cucumis sativus", "zone_name": "Теплица & Грядки", "is_outdoor": True, "quantity": 10, "unit": "кустов", "status": "healthy", "height_cm": 160.0},
            {"id": 8, "name": "Роза 'Фламентанц'", "species": "Rosa 'Flamentanz'", "zone_name": "Клумбы & Альпинарий", "is_outdoor": True, "quantity": 2, "unit": "куста", "status": "healthy", "height_cm": 220.0},
            {"id": 9, "name": "Смородина 'Добрыня'", "species": "Ribes nigrum", "zone_name": "Плодовый сад", "is_outdoor": True, "quantity": 4, "unit": "куста", "status": "healthy", "height_cm": 110.0},
            {"id": 10, "name": "Газон дачный", "species": "Lolium perenne & Poa pratensis", "zone_name": "Газон & Изгородь", "is_outdoor": True, "quantity": 150, "unit": "кв.м", "status": "healthy", "height_cm": 6.0},
        ]
    return plants

@router.post("/")
async def create_plant(plant_in: PlantCreate, db: AsyncSession = Depends(get_db)):
    plant = Plant(
        user_id=1,
        name=plant_in.name,
        species=plant_in.species,
        zone_name=plant_in.zone_name,
        is_outdoor=plant_in.is_outdoor,
        quantity=plant_in.quantity,
        unit=plant_in.unit,
        photo_url=plant_in.photo_url,
        watering_interval_days=plant_in.watering_interval_days,
        height_cm=plant_in.height_cm,
        required_lux=plant_in.required_lux
    )
    db.add(plant)
    await db.commit()
    await db.refresh(plant)
    return plant
