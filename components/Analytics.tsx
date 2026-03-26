
import React from 'react';
import { UserProfile } from '../types';
import { translations, Language } from '../translations';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Target, Trophy, TrendingUp, History, X } from 'lucide-react';

interface AnalyticsProps {
  profile: UserProfile;
  lang: Language;
}

const Analytics: React.FC<AnalyticsProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const [showAchievements, setShowAchievements] = React.useState(false);

  const data = [
    { month: 'Jan', savings: 400, target: 800, score: 65 },
    { month: 'Feb', savings: 650, target: 800, score: 72 },
    { month: 'Mar', savings: 500, target: 800, score: 68 },
    { month: 'Apr', savings: 850, target: 800, score: 82 },
    { month: 'May', savings: 900, target: 800, score: 85 },
    { month: 'Jun', savings: 1100, target: 800, score: 91 },
  ];

  const achievements = lang === 'en' ? [
    { title: "Savings Master", desc: "Saved more than 20% of income for 3 months.", icon: "💰" },
    { title: "Budget Ninja", desc: "Kept fixed expenses below target for 6 months.", icon: "🥷" },
    { title: "Smart Shopper", desc: "Reduced grocery spending by 15% using AI list.", icon: "🛒" },
  ] : [
    { title: "سيد الادخار", desc: "ادخرت أكثر من 20٪ من الدخل لمدة 3 أشهر.", icon: "💰" },
    { title: "نينجا الميزانية", desc: "حافظت على المصاريف الثابتة أقل من المستهدف لمدة 6 أشهر.", icon: "🥷" },
    { title: "المتسوق الذكي", desc: "خفضت الإنفاق على البقالة بنسبة 15٪ باستخدام القائمة الذكية.", icon: "🛒" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {showAchievements && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in zoom-in duration-300 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-w-2xl w-full relative">
            <button 
              onClick={() => setShowAchievements(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-4">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-cairo">
                {lang === 'en' ? 'Your Achievements' : 'إنجازاتك'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'en' ? 'Track your financial milestones and progress.' : 'تتبع معالم تقدمك المالي.'}
              </p>
            </div>
            <div className="grid gap-4">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <span className="text-3xl">{a.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{a.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.savingsProgression}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.trackingGrowth}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-400">{t.actual}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-bold text-slate-400">{t.target}</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lang === 'ar' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} orientation={lang === 'ar' ? 'right' : 'left'} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    backgroundColor: '#1e293b', 
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-600 dark:bg-emerald-700 p-8 rounded-[32px] text-white space-y-6 shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t.milestoneAchieved}</p>
              <h4 className="text-2xl font-bold font-cairo">15% {t.savingsRate}</h4>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              {lang === 'en' 
                ? `You saved 300 ${t.currency} more than last month. This covers 40% of your next year's medical fund!`
                : `لقد ادخرت 300 ${t.currency} أكثر من الشهر الماضي. هذا يغطي 40٪ من صندوقك الطبي للعام المقبل!`}
            </p>
            <button 
              onClick={() => setShowAchievements(true)}
              className="w-full py-3 bg-white text-emerald-600 dark:text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-colors"
            >
              {lang === 'en' ? 'View Achievements' : 'عرض الإنجازات'}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.financialIQ}</h4>
              <span className="text-emerald-500 font-bold">{t.high}</span>
            </div>
            <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.iqDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 font-cairo">
          <History className="w-5 h-5 text-emerald-500" /> {t.expenseReductionHistory}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { category: t.utilities, reduction: '12%', status: t.stable, color: 'emerald' },
            { category: t.food, reduction: '8%', status: t.improving, color: 'emerald' },
            { category: t.transportation, reduction: '2%', status: t.warning, color: 'amber' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.category}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">-{item.reduction}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full bg-${item.color}-50 dark:bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
