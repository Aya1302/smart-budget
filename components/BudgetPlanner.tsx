
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, BudgetAllocation } from '../types';
import { getBudgetOptimization } from '../geminiService';
import { translations, Language } from '../translations';
import { Sparkles, Save, RotateCcw, Loader2 } from 'lucide-react';

interface BudgetPlannerProps {
  profile: UserProfile;
  lang: Language;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBudget = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await getBudgetOptimization(profile);
      setAllocations(data);
    } catch (error) {
      console.error("Failed to fetch budget:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const totalIncome = profile.monthlySalary;
  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);
  const totalFixed = (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0);
  const remainingCash = totalIncome - totalFixed - totalAllocated;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium font-cairo">
          {lang === 'en' ? 'AI is balancing your sheets...' : 'جاري معالجة الميزانية بالذكاء الاصطناعي...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.smartDistribution}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {lang === 'en' ? `AI optimizes your remaining $${totalIncome - totalFixed} after bills.` : `الذكاء الاصطناعي يحسن توزيع الـ $${totalIncome - totalFixed} المتبقية.`}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-emerald-900/20 hover:scale-105 transition-all">
            <Save className="w-4 h-4" /> {t.savePlan}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 relative">
          {isRefreshing && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[2rem]">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{lang === 'en' ? 'Optimizing...' : 'جاري التحسين...'}</span>
              </div>
            </div>
          )}
          
          {allocations.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group transition-all hover:border-emerald-200 dark:hover:border-emerald-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                    {item.category[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.category}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{item.percentage}% {lang === 'en' ? 'of available funds' : 'من المتاح'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-100">${item.amount.toFixed(0)}</p>
                  <p className="text-xs text-slate-400">{lang === 'en' ? 'Target Monthly' : 'المستهدف الشهري'}</p>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-800">
                  <div 
                    style={{ width: `${item.percentage}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000`}
                  ></div>
                </div>
              </div>

              {item.advice && (
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight italic">"{item.advice}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden transition-all border dark:border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="font-bold text-lg relative z-10">{t.allocationSummary}</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t.totalIncome}</span>
                <span className="text-white font-bold">${totalIncome}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t.fixedCosts}</span>
                <span className="text-rose-400 font-bold">-${totalFixed}</span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.bufferFund}</span>
                <span className={`text-2xl font-black ${remainingCash < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                  ${remainingCash.toFixed(0)}
                </span>
              </div>
            </div>

            <button 
              onClick={() => fetchBudget(true)}
              disabled={isRefreshing}
              className="w-full py-4 bg-emerald-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} /> 
              {t.recalculate}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
