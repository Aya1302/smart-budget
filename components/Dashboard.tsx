
import React, { useMemo } from 'react';
import { UserProfile, Language } from '../types';
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
  Coffee,
  Utensils,
  Stethoscope,
  Plane,
  PlusCircle,
  ShoppingBag
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
  onUpdate: (profile: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, lang, theme, onUpdate }) => {
  const t = translations[lang];
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [expenseInputs, setExpenseInputs] = React.useState({
    foodDrink: '',
    cafe: '',
    medical: '',
    travel: ''
  });

  const handleAddExpense = (category: keyof NonNullable<UserProfile['dailyExpenses']>) => {
    const amountStr = expenseInputs[category as keyof typeof expenseInputs];
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const currentExpenses = profile.dailyExpenses || {
      foodDrink: 0,
      cafe: 0,
      medical: 0,
      travel: 0
    };

    const prevValue = (currentExpenses[category] as number) || 0;

    const updatedProfile: UserProfile = {
      ...profile,
      dailyExpenses: {
        ...currentExpenses,
        [category]: prevValue + amount
      }
    };

    onUpdate(updatedProfile);
    setExpenseInputs(prev => ({ ...prev, [category]: '' }));
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

  const totalDaily = useMemo(() => 
    profile.dailyExpenses ? (Object.values(profile.dailyExpenses) as number[]).reduce((a, b) => a + b, 0) : 0
  , [profile]);

  const totalIncome = profile.monthlySalary;
  const availableIncome = totalIncome - totalFixed - totalDaily;

  const mockChartData = [
    { name: 'Jan', expenses: 3200, savings: 800 },
    { name: 'Feb', expenses: 2900, savings: 1100 },
    { name: 'Mar', expenses: 3500, savings: 500 },
    { name: 'Apr', expenses: totalFixed, savings: availableIncome },
  ];

  const pieData = [
    { name: t.fixedCosts, value: totalFixed, color: '#10b981' },
    { name: t.dailyExpenses, value: totalDaily, color: '#f59e0b' },
    { name: t.availableCash, value: availableIncome, color: '#94a3b8' },
  ];

  const stats = [
    { label: t.totalIncome, value: `${totalIncome} ${t.currency}`, icon: Wallet, color: 'emerald' },
    { label: t.fixedCosts, value: `${totalFixed} ${t.currency}`, icon: TrendingDown, color: 'rose' },
    { label: t.dailyExpenses, value: `${totalDaily} ${t.currency}`, icon: ShoppingBag, color: 'amber' },
    { label: t.availableCash, value: `${availableIncome} ${t.currency}`, icon: TrendingUp, color: 'blue' },
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

      {/* Daily Expenses Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-cairo flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-500" />
            {t.dailyExpenses}
          </h3>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
            {t.totalIncome}: {totalDaily} {t.currency}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'foodDrink', label: t.foodDrink, icon: Utensils, color: 'orange' },
            { id: 'cafe', label: t.cafe, icon: Coffee, color: 'amber' },
            { id: 'medical', label: t.medicalExpense, icon: Stethoscope, color: 'rose' },
            { id: 'travel', label: t.travel, icon: Plane, color: 'blue' }
          ].map((cat) => (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-2 rounded-lg bg-${cat.color}-50 dark:bg-${cat.color}-500/10 text-${cat.color}-600 dark:text-${cat.color}-400`}>
                  <cat.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-cairo">{cat.label}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t.amount}
                  value={expenseInputs[cat.id as keyof typeof expenseInputs]}
                  onChange={(e) => setExpenseInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors text-slate-800 dark:text-white"
                />
                <button
                  onClick={() => handleAddExpense(cat.id as any)}
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.actual}</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  {profile.dailyExpenses?.[cat.id as keyof NonNullable<UserProfile['dailyExpenses']>] || 0} {t.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
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
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200" /> {t.dailyExpenses}
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">{totalDaily} {t.currency}</span>
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
    </div>
  );
};

export default Dashboard;
