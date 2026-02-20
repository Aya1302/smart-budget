
import React, { useState, useEffect } from 'react';
import { UserProfile, ShoppingItem } from '../types';
import { generateShoppingList } from '../geminiService';
import { translations, Language } from '../translations';
import { CheckCircle2, Circle, Share2, Printer, AlertCircle, Loader2, Sparkles, PartyPopper } from 'lucide-react';

interface ShoppingListProps {
  profile: UserProfile;
  lang: Language;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      const suggestBudget = profile.familyMembers * 150;
      const data = await generateShoppingList(profile, suggestBudget);
      setItems(data);
      setLoading(false);
    };
    fetchList();
  }, [profile]);

  const toggleComplete = (idx: number) => {
    if (isCheckingOut) return;
    const next = new Set(completed);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompleted(next);
  };

  const handleCheckout = () => {
    if (completed.size === 0) return;
    
    setIsCheckingOut(true);
    
    // Simulate API logging and processing
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        // Clear completed items from the list after successful "log"
        setItems(prev => prev.filter((_, idx) => !completed.has(idx)));
        setCompleted(new Set());
      }, 3000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-slate-900 dark:border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium font-Cairo">
          {lang === 'en' ? 'Curating your smart grocery list...' : 'جاري تحضير قائمة تسوقك الذكية...'}
        </p>
      </div>
    );
  }

  const totalCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const completedCost = items.reduce((sum, item, idx) => completed.has(idx) ? sum + item.estimatedCost : sum, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 relative">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100 dark:border-slate-800 space-y-4 max-w-sm mx-4">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce">
              <PartyPopper className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-Cairo">
              {lang === 'en' ? 'Logged Successfully!' : 'تم التسجيل بنجاح!'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'en' 
                ? `Expense of ${completedCost.toFixed(2)} ${t.currency} has been added to your monthly log.` 
                : `تمت إضافة مصاريف بقيمة ${completedCost.toFixed(2)} ${t.currency} إلى سجلك الشهري.`}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-Cairo">{t.shoppingAssistant}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {t.optimizedFor.replace('{count}', profile.familyMembers.toString())}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-4">
          {items.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-medium">
                {lang === 'en' ? 'All items logged or list empty.' : 'تم تسجيل جميع الأصناف أو القائمة فارغة.'}
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleComplete(idx)}
                className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 group ${
                  completed.has(idx) ? 'border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/50'
                }`}
              >
                <button className="flex-shrink-0">
                  {completed.has(idx) ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in duration-200" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-200 dark:text-slate-700 group-hover:text-slate-300 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg transition-all ${completed.has(idx) ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {item.name}
                    </span>
                    {item.isPriority && (
                      <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase rounded tracking-wider">High Priority</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${completed.has(idx) ? 'text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {item.estimatedCost.toFixed(2)} {t.currency}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-[32px] text-white space-y-6 sticky top-24 shadow-2xl transition-colors overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            
            <h3 className="font-bold text-lg font-Cairo relative z-10">{t.listSummary}</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t.items}</span>
                <span className="text-white font-bold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t.completed}</span>
                <span className="text-emerald-400 font-bold">{completed.size}</span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">{t.totalEst}</span>
                <span className="text-3xl font-black text-emerald-400">{totalCost.toFixed(0)} {t.currency}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={completed.size === 0 || isCheckingOut}
              className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isCheckingOut ? 'bg-emerald-700 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
              }`}
            >
              {isCheckingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.checkoutLog}
                </>
              )}
            </button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="text-sm uppercase tracking-wider font-Cairo">{t.aiGuard}</h4>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
              {lang === 'en' 
                ? `This list represents ${Math.round((totalCost / (profile.monthlySalary || 1)) * 100)}% of your monthly income. Sticking to these quantities is key.`
                : `تمثل هذه القائمة ${Math.round((totalCost / (profile.monthlySalary || 1)) * 100)}% من دخلك الشهري. الالتزام بهذه الكميات هو مفتاح النجاح.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon for placeholder
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

export default ShoppingList;
