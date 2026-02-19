
import React, { useState, useEffect } from 'react';
import { UserProfile, PricePrediction } from '../types';
import { getPricePredictions } from '../geminiService';
import { translations, Language } from '../translations';
import { TrendingUp, TrendingDown, Minus, Clock, ShoppingCart, Percent, ChevronRight } from 'lucide-react';

interface PriceForecasterProps {
  profile: UserProfile;
  lang: Language;
}

const PriceForecaster: React.FC<PriceForecasterProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      const data = await getPricePredictions();
      setPredictions(data);
      setLoading(false);
    };
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-Cairo">{t.scanningMarkets}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-Cairo">{t.priceForecasting}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t.nextMonthMarket}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4" /> {t.updatedHourly}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.map((p, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-all">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  p.trend === 'up' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : p.trend === 'down' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {p.trend}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{p.item}</h3>
              <div className="flex items-end gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.currentPrice}</p>
                  <p className="font-bold text-slate-500 dark:text-slate-400">${p.currentPrice.toFixed(2)}</p>
                </div>
                <div className={`pb-1 text-slate-300 dark:text-slate-700 ${lang === 'ar' ? 'rotate-180' : ''}`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{t.nextMonth}</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100">${p.predictedPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                  <Percent className="w-3 h-3" /> {t.confidence}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{Math.round(p.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${p.confidence * 100}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                "{p.advice}"
              </p>
              {p.trend === 'up' && (
                <button className="w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all">
                  {t.suggestBuy}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceForecaster;
