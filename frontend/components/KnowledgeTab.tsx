"use client";

import React, { useState } from "react";
import { Search, BookOpen, ExternalLink, ShoppingCart, Tag, Edit3, Check, Star, Sparkles } from "lucide-react";

export const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userNote, setUserNote] = useState("Моя заметить: поливать калатею только кипяченой или фильтрованной водой.");
  const [isEditingNote, setIsEditingNote] = useState(false);

  const articles = [
    {
      id: "a1",
      title: "Паутинный клещ: первые симптомы и методы борьбы",
      category: "Вредители и Болезни",
      symptoms: ["Желтые точки", "Паутина", "Сухие листья"],
      snippet: "При обнаружении мелких точек и тонкой паутины немедленно изолируйте растение в карантин...",
    },
    {
      id: "a2",
      title: "Как правильно измерять и подбирать освещенность (Lux)",
      category: "Уход и Свет",
      symptoms: ["Вытягивание стеблей", "Потеря вариегатности"],
      snippet: "Различным группам растений требуется от 500 до 5000 Lux. В этой статье разбираем нормы...",
    },
    {
      id: "a3",
      title: "Особенности ухода за Monstera Deliciosa",
      category: "Энциклопедия Видов",
      symptoms: ["Чернеют листья", "Нет резных листьев"],
      snippet: "Монстера любит яркий рассеянный свет и высокий уровень влажности воздуха...",
    },
  ];

  const products = [
    {
      id: "p1",
      title: "Биопрепарат Фитоверм КЭ 4 мл",
      category: "Защита от вредителей",
      price: "180 ₽",
      marketplace: "Ozon",
      url: "https://www.ozon.ru/search/?text=фитоверм+для+растений",
      rating: "4.9",
    },
    {
      id: "p2",
      title: "Японское органо-минеральное удобрение 350мл",
      category: "Удобрения",
      price: "520 ₽",
      marketplace: "Wildberries",
      url: "https://www.wildberries.ru/catalog/0/search.aspx?search=удобрение+для+комнатных+растений",
      rating: "4.8",
    },
    {
      id: "p3",
      title: "Фитолампа светодиодная 30W полноватная",
      category: "Оборудование",
      price: "1 450 ₽",
      marketplace: "Ozon",
      url: "https://www.ozon.ru/search/?text=фитолампа+для+растений",
      rating: "4.95",
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-emerald-200 text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Энциклопедия & Маркетплейс
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">База Знаний</h1>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Поиск по симптомам (например: желтеют листья)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-emerald-950/60 border border-emerald-600/50 rounded-2xl text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-3" />
        </div>
      </div>

      {/* User Personal Notes Section */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between items-center text-amber-900 font-bold text-xs">
          <span className="flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-amber-600" />
            Мои личные заметки садовода
          </span>
          <button
            onClick={() => setIsEditingNote(!isEditingNote)}
            className="text-amber-700 hover:text-amber-900 text-[11px] font-semibold"
          >
            {isEditingNote ? "Сохранить" : "Изменить"}
          </button>
        </div>
        {isEditingNote ? (
          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-800 focus:outline-none"
            rows={2}
          />
        ) : (
          <p className="text-xs text-slate-700 italic leading-relaxed">{userNote}</p>
        )}
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Рекомендуемые статьи</h2>
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {article.category}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{article.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{article.snippet}</p>

              {/* Symptom Tags */}
              <div className="flex gap-1.5 pt-1">
                {article.symptoms.map((symptom) => (
                  <span key={symptom} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    #{symptom}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Marketplace Products */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Подборка товаров для сада</span>
          <span className="text-[10px] text-emerald-600 font-normal">Ozon & Wildberries</span>
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      product.marketplace === "Ozon"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {product.marketplace}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {product.rating}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs truncate">{product.title}</h4>
                <div className="text-xs font-black text-emerald-700 mt-0.5">{product.price}</div>
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-200 flex-shrink-0"
              >
                Купить <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
