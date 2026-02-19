
import React, { useState } from 'react';
import { UserProfile, InvestmentOption } from '../types';
import { translations, Language } from '../translations';
import { ShieldCheck, Info, TrendingUp, Lock, ArrowRight, ToggleLeft as Toggle, ToggleRight } from 'lucide-react';

interface InvestmentsProps {
  profile: UserProfile;
  lang: Language;
}

const Investments: React.FC<InvestmentsProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const [enabled, setEnabled] = useState(true);
  
  const options: InvestmentOption[] = [
    {
      type: 'Bank',
      title: lang === 'en' ? 'Fixed Deposit Certificates' : 'شهادات الادخار الثابتة',
      expectedReturn: '12% - 15% Annual',
      riskLevel: lang === 'en' ? 'Zero Risk' : 'عديم المخاطر',
      description: lang === 'en' ? 'Capital-guaranteed certificates from top-tier national banks.' : 'شهادات مضمونة رأس المال من البنوك الوطنية الكبرى.',
      safetyReason: lang === 'en' ? 'Insured by Central Bank regulations with fixed guaranteed returns.' : 'مؤمنة من البنك المركزي بعوائد مضمونة ثابتة.'
    },
    {
      type: 'Asset',
      title: lang === 'en' ? 'Physical Gold (Bullion)' : 'الذهب المادي (سبائك)',
      expectedReturn: 'Variable (Value Store)',
      riskLevel: lang === 'en' ? 'Low Risk' : 'مخاطر منخفضة',
      description: lang === 'en' ? 'Long-term wealth preservation through high-purity gold bars.' : 'الحفاظ على الثروة على المدى الطويل من خلال سبائك الذهب عالية النقاء.',
      safetyReason: lang === 'en' ? 'Historical hedge against inflation with no counterparty risk.' : 'تحوط تاريخي ضد التضخم دون مخاطر الطرف الآخر.'
    },
    {
      type: 'Fund',
      title: lang === 'en' ? 'Islamic Treasury Fund' : 'صندوق الخزينة الإسلامي',
      expectedReturn: '10% - 14% Annual',
      riskLevel: lang === 'en' ? 'Low Risk' : 'مخاطر منخفضة',
      description: lang === 'en' ? 'Sharia-compliant fund investing in short-term government bonds.' : 'صندوق متوافق مع الشريعة يستثمر في السندات الحكومية قصيرة الأجل.',
      safetyReason: lang === 'en' ? 'Professionally managed with high liquidity and diversification.' : 'مُدار باحترافية مع سيولة عالية وتنوع كبير.'
    }
  ];

  // Fix: Removed reference to monthlySubsidies which doesn't exist on UserProfile
  const totalIncome = profile.monthlySalary;
  const totalFixed = (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0);
  const stability = (totalIncome - totalFixed) / totalIncome > 0.2;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-[24px] ${enabled ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-Cairo">{t.investmentEngine}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t.curatingLowRisk}</p>
          </div>
        </div>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black transition-all ${
            enabled ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          }`}
        >
          {enabled ? <ToggleRight className="w-8 h-8" /> : <Toggle className="w-8 h-8" />}
          {enabled ? t.systemLive : t.disabled}
        </button>
      </div>

      {!stability && (
        <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20 flex items-start gap-4 animate-in slide-in-from-top-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-amber-900 dark:text-amber-400 uppercase text-xs tracking-widest font-Cairo">{t.stabilityCaution}</h4>
            <p className="text-sm text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
              {t.emergencyReserve}
            </p>
          </div>
        </div>
      )}

      <div className={`grid md:grid-cols-3 gap-8 transition-all duration-500 ${!enabled ? 'opacity-30 pointer-events-none grayscale blur-sm' : ''}`}>
        {options.map((opt, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl dark:hover:shadow-emerald-900/10 transition-all hover:-translate-y-2">
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 dark:border-slate-700">{opt.type}</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-black text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {opt.expectedReturn.split(' ')[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-Cairo">{opt.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{opt.description}</p>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" /> {t.whySafe}
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 italic leading-snug font-medium">"{opt.safetyReason}"</p>
              </div>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors shadow-lg">
                {lang === 'en' ? 'Investment Portal' : 'بوابة الاستثمار'} <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {enabled && (
        <div className="bg-slate-900 dark:bg-emerald-900/20 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl border dark:border-emerald-500/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left rtl:md:text-right">
            <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
              <Info className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-black font-Cairo">{t.investmentMasterclass}</h3>
              <p className="text-slate-400 dark:text-emerald-100/60 font-medium">{t.learnGrowing}</p>
            </div>
            <button className="px-10 py-5 bg-white dark:bg-emerald-500 text-slate-900 dark:text-white rounded-3xl font-black hover:bg-emerald-50 dark:hover:bg-emerald-400 transition-all shadow-xl hover:scale-105 active:scale-95">
              {t.investmentVault}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
