# 🌿 Мой Персональный Садовник (Garden Care AI)

Полная экосистема **Telegram Mini App (TMA)** + **Telegram-бота (Aiogram 3)** + **FastAPI бэкенда** с поддержкой **Vision AI**, AI-Фотометра, динамического календаря и интеграции с маркетплейсами.

---

## 📱 Функциональные возможности

1. **Сердце Сада & Инвентаризация:**
   - Индикатор индекса здоровья сада.
   - Фильтрация по зонам (Подоконник, Гостиная, Дачный участок, Теплица, Карантин).
   - Быстрое добавление растений с авто-определением вида через AI.
2. **AI-Фотометр (Lux Meter):**
   - Замер освещенности (Lux) в реальном времени через видеопоток камеры смартфона.
   - Рекомендации по оптимизации расположения цветов.
3. **AI-Диагностика & Карантин:**
   - Анализ снимков пораженных листьев/побегов с помощью Gemini Flash Vision API.
   - Перевод в «Карантин» и генерация схемы лечения.
4. **Динамический Календарь:**
   - Лунный календарь с фазами и рекомендациями по садово-огородным работам.
   - Автоматическая отмена полива уличных культур при осадках (OpenWeatherMap).
   - Push-уведомления с интерактивными кнопками (`[✅ Полил]`, `[⏰ Отложить]`).
5. **Энциклопедия & Маркетплейс:**
   - Поиск по симптомам болезней и видам.
   - Персональные пользовательские заметки к статьям.
   - Карточки товаров со ссылками на Ozon и Wildberries.

---

## 🚀 Запуск и Разворачивание

### 1. Запуск Backend (FastAPI + Bot)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Документация OpenAPI будет доступна по адресу: `http://localhost:8000/docs`

### 2. Запуск Frontend (Telegram Mini App)

```bash
cd frontend
npm install
npm run dev
```

Приложение доступно по адресу: `http://localhost:3000`

---

## 🛠 Стек технологий

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@twa-dev/sdk`, Lucide Icons.
- **Backend:** Python 3.13, FastAPI, Aiogram 3, Async SQLAlchemy, SQLite.
- **AI Core:** Google Gemini Flash Vision API.
- **External Services:** OpenWeatherMap API, Telegram WebApp API.
