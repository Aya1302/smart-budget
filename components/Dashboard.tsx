
import React, { useMemo } from 'react';
import { UserProfile, Language, DailyExpense } from '../types';
import { translations } from '../translations';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  ArrowUpRight, 
  AlertCircle, 
  ShieldCheck, 
  Target,
  Download,
  Loader2,
  Plus,
  Coffee,
  Utensils,
  Stethoscope,
  Plane,
  Receipt
} from 'lucide-react';
import { generateFullReport } from '../utils/pdfGenerator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  lang: Language;
  theme: 'light' | 'dark';
  onUpdate?: (profile: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, lang, theme, onUpdate }) => {
  const t = translations[lang];
  const [isGenerating, setIsGenerating] = React.useState(false);

  const [expenseAmount, setExpenseAmount] = React.useState('');
  const [expenseCategory, setExpenseCategory] = React.useState<'food' | 'cafe' | 'medical' | 'travel' | 'other'>('food');
  const [expenseDesc, setExpenseDesc] = React.useState('');
  const [expenseDate, setExpenseDate] = React.useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || isNaN(Number(expenseAmount))) return;

    const newExpense: DailyExpense = {
      id: Date.now().toString(),
      amount: Number(expenseAmount),
      category: expenseCategory,
      description: expenseDesc,
      date: expenseDate,
    };

    const updatedProfile = {
      ...profile,
      dailyExpenses: [newExpense, ...(profile.dailyExpenses || [])]
    };

    if (onUpdate) {
      onUpdate(updatedProfile);
    }

    setExpenseAmount('');
    setExpenseDesc('');
  };

  const categoryIcons = {
    food: Utensils,
    cafe: Coffee,
    medical: Stethoscope,
    travel: Plane,
    other: Receipt
  };

  const categoryLabels = {
    food: t.foodAndDrinks,
    cafe: t.cafe,
    medical: t.medicalExpense,
    travel: t.travelExpense,
    other: t.otherExpense
  };

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      await generateFullReport('full-report-template', `Modaber_Report_${new Date().getTime()}`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const totalFixed = useMemo(() => 
    (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0)
  , [profile]);

  const totalDailyExpenses = useMemo(() => {
    if (!profile.dailyExpenses) return 0;
    return profile.dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [profile.dailyExpenses]);

  const totalIncome = profile.monthlySalary;
  const availableIncome = totalIncome - totalFixed - totalDailyExpenses;

  const mockChartData = [
    { name: 'Jan', expenses: 3200, savings: 800 },
    { name: 'Feb', expenses: 2900, savings: 1100 },
    { name: 'Mar', expenses: 3500, savings: 500 },
    { name: 'Apr', expenses: totalFixed + totalDailyExpenses, savings: availableIncome },
  ];

  const pieData = [
    { name: t.fixedCosts, value: totalFixed, color: '#10b981' },
    { name: t.recentExpenses, value: totalDailyExpenses, color: '#f59e0b' },
    { name: t.availableCash, value: availableIncome, color: '#94a3b8' },
  ];

  const stats = [
    { label: t.totalIncome, value: `${totalIncome} ${t.currency}`, icon: Wallet, color: 'emerald' },
    { label: t.fixedCosts, value: `${totalFixed} ${t.currency}`, icon: TrendingDown, color: 'rose' },
    { label: t.availableCash, value: `${availableIncome} ${t.currency}`, icon: TrendingUp, color: 'blue' },
    { label: t.financialScore, value: `84/100`, icon: Target, color: 'amber' },
  ];

  const monthName = new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-cairo">
            {t.smartDashboard}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t.aiEngine}: {t.analyzingFor} {monthName}...
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> {t.secureProfile}
          </div>
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold flex items-center gap-2">
            <Users className="w-4 h-4" /> {profile.familyMembers} {t.persons}
          </div>
          <button 
            onClick={handleDownloadReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {lang === 'en' ? 'Download PDF' : 'تحميل PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:rotate-6 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> {t.healthy}
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.incomeUsage}</h3>
            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-xl outline-none text-slate-600 dark:text-slate-400">
              <option>{t.last6Months}</option>
              <option>{t.fullYear}</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} orientation={lang === 'ar' ? 'right' : 'left'} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    backgroundColor: '#1e293b', 
                    color: '#fff',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Bar dataKey="expenses" fill="#10b981" radius={[8, 8, 0, 0]} name="Expenses" />
                <Bar dataKey="savings" fill="#334155" radius={[8, 8, 0, 0]} name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 self-start font-cairo">{t.walletStatus}</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-4 w-full">
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" /> {t.fixedCosts}
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">{totalFixed} {t.currency}</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200" /> {t.recentExpenses}
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">{totalDailyExpenses} {t.currency}</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold">
                <div className="w-3 h-3 rounded-full bg-slate-400" /> {t.availableCash}
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">{availableIncome} {t.currency}</span>
            </div>
          </div>
          <div className="mt-8 bg-amber-50 dark:bg-amber-500/10 p-5 rounded-3xl w-full border border-amber-100 dark:border-amber-500/20 flex gap-4 animate-pulse">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="space-y-1 text-left rtl:text-right">
              <p className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase">{t.overspendingAlert}</p>
              <p className="text-[11px] text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
                {lang === 'en' ? 'Subscription costs increased by 15% this month.' : 'زادت تكاليف الاشتراكات بنسبة 15٪ هذا الشهر.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 font-cairo">{t.addExpense}</h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseAmount}</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 font-bold outline-none focus:border-emerald-500 transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{t.currency}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseCategory}</label>
              <select 
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 font-bold outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="food">{t.foodAndDrinks}</option>
                <option value="cafe">{t.cafe}</option>
                <option value="medical">{t.medicalExpense}</option>
                <option value="travel">{t.travelExpense}</option>
                <option value="other">{t.otherExpense}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseDesc}</label>
              <input 
                type="text" 
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                placeholder="..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseDate}</label>
              <input 
                type="date" 
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> {t.addExpense}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 font-cairo">{t.recentExpenses}</h3>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {profile.dailyExpenses && profile.dailyExpenses.length > 0 ? (
              profile.dailyExpenses.map((expense) => {
                const Icon = categoryIcons[expense.category] || Receipt;
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{categoryLabels[expense.category]}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>{expense.date}</span>
                          {expense.description && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                              <span>{expense.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-lg text-slate-800 dark:text-slate-100">
                        {expense.amount} <span className="text-sm text-slate-500 dark:text-slate-400">{t.currency}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t.noRecentExpenses}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
