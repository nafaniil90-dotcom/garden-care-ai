import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    telegram_id: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    username: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Брест")
    lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    plants = relationship("Plant", back_populates="owner")

class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(100))  # e.g. "Плодовый сад", "Клумбы", "Теплица"

class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    zone_name: Mapped[str] = mapped_column(String(100), default="Плодовый сад")
    name: Mapped[str] = mapped_column(String(100))
    species: Mapped[str] = mapped_column(String(150))
    is_outdoor: Mapped[bool] = mapped_column(Boolean, default=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit: Mapped[str] = mapped_column(String(50), default="шт.")
    photo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="healthy")  # healthy / quarantine
    watering_interval_days: Mapped[int] = mapped_column(Integer, default=5)
    last_watered_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    height_cm: Mapped[float] = mapped_column(Float, default=100.0)
    required_lux: Mapped[str] = mapped_column(String(100), default="Прямое солнце")
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="plants")
    growth_logs = relationship("GrowthLog", back_populates="plant")
    tasks = relationship("Task", back_populates="plant")

class GrowthLog(Base):
    __tablename__ = "growth_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    plant_id: Mapped[int] = mapped_column(Integer, ForeignKey("plants.id"))
    photo_url: Mapped[str] = mapped_column(Text)
    height_cm: Mapped[float] = mapped_column(Float)
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    plant = relationship("Plant", back_populates="growth_logs")

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    plant_id: Mapped[int] = mapped_column(Integer, ForeignKey("plants.id"))
    action: Mapped[str] = mapped_column(String(200))
    due_date: Mapped[datetime.datetime] = mapped_column(DateTime)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    weather_adjusted: Mapped[bool] = mapped_column(Boolean, default=False)

    plant = relationship("Plant", back_populates="tasks")

class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    symptoms_json: Mapped[dict] = mapped_column(JSON, default=list)
    content: Mapped[str] = mapped_column(Text)
