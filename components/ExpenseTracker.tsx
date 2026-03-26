
import React, { useState, useEffect } from 'react';
import { Language, DailyExpense } from '../types';
import { translations } from '../translations';
import { 
  Utensils, 
  Coffee, 
  Pill, 
  Plane, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ExpenseTrackerProps {
  email: string;
  lang: Language;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ email, lang }) => {
  const t = translations[lang];
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: 'food' as DailyExpense['category'],
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`/api/expenses/${email}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [email]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    setAdding(true);
    setError(null);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...formData
        })
      });

      if (res.ok) {
        const newExpense = await res.json();
        setExpenses([newExpense, ...expenses]);
        setFormData({
          category: 'food',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        setError(lang === 'en' ? 'Failed to add expense' : 'فشل في إضافة المصروف');
      }
    } catch (err) {
      setError(lang === 'en' ? 'Connection error' : 'خطأ في الاتصال');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'cafe': return <Coffee className="w-5 h-5" />;
      case 'medicine': return <Pill className="w-5 h-5" />;
      case 'travel': return <Plane className="w-5 h-5" />;
      default: return <Plus className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'food': return t.foodAndDrink;
      case 'cafe': return t.cafes;
      case 'medicine': return t.medicine;
      case 'travel': return t.travel;
      default: return category;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-cairo flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl text-white">
            <Plus className="w-6 h-6" />
          </div>
          {t.expenseTracker}
        </h3>
      </div>

      <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.category}</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all font-bold"
          >
            <option value="food">{t.foodAndDrink}</option>
            <option value="cafe">{t.cafes}</option>
            <option value="medicine">{t.medicine}</option>
            <option value="travel">{t.travel}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.amount}</label>
          <input 
            type="number"
            required
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.date}</label>
          <input 
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all font-bold"
          />
        </div>

        <div className="flex items-end">
          <button 
            type="submit"
            disabled={adding}
            className="w-full bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl py-3 font-black flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {t.addExpense}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{t.recentExpenses}</h4>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 font-bold">{lang === 'en' ? 'No expenses logged yet' : 'لا يوجد مصاريف مسجلة بعد'}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm`}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{getCategoryLabel(expense.category)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" /> {new Date(expense.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    {expense.amount} <span className="text-xs text-slate-400">{t.currency}</span>
                  </span>
                  <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
