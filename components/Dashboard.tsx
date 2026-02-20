
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
  Target
} from 'lucide-react';
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
}

const Dashboard: React.FC<DashboardProps> = ({ profile, lang, theme }) => {
  const t = translations[lang];
  
  const totalFixed = useMemo(() => 
    (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0)
  , [profile]);

  const totalIncome = profile.monthlySalary;
  const availableIncome = totalIncome - totalFixed;

  const mockChartData = [
    { name: 'Jan', expenses: 3200, savings: 800 },
    { name: 'Feb', expenses: 2900, savings: 1100 },
    { name: 'Mar', expenses: 3500, savings: 500 },
    { name: 'Apr', expenses: totalFixed, savings: availableIncome },
  ];

  const pieData = [
    { name: t.fixedCosts, value: totalFixed, color: '#10b981' },
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
