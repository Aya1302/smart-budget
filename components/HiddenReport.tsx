
import React from 'react';
import { UserProfile, Language } from '../types';
import { translations } from '../translations';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  BarChart3, 
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Info
} from 'lucide-react';

interface HiddenReportProps {
  profile: UserProfile;
  lang: Language;
}

const HiddenReport: React.FC<HiddenReportProps> = ({ profile, lang }) => {
  const t = translations[lang];
  const totalFixed = (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0);
  const totalOptional = (Object.values(profile.optionalExpenses) as number[]).reduce((a, b) => a + b, 0);
  const totalDebts = profile.debts.reduce((sum, d) => sum + d.monthlyAmount, 0);
  const availableIncome = profile.monthlySalary - totalFixed - totalDebts;
  
  const savingsTarget = (availableIncome * (profile.preferences.emergencyFundPercentage / 100)).toFixed(0);

  return (
    <div id="full-report-template" className="p-16 bg-white text-slate-900 w-[1000px] font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Page 1: Executive Summary */}
      <div className="min-h-[1300px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-8 border-emerald-600 pb-10 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
              <Wallet className="text-white w-12 h-12" />
            </div>
            <div>
              <h1 className="text-6xl font-bold text-slate-800 font-cairo" style={{ letterSpacing: 'normal' }}>مُدَبِّر</h1>
              <p className="text-sm font-black text-emerald-600 tracking-[0.4em] uppercase">AI Financial Intelligence Report</p>
            </div>
          </div>
          <div className="text-right rtl:text-left">
            <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
              Confidential Analysis
            </div>
            <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">{t.smartDashboard}</p>
            <p className="text-sm text-slate-400 font-medium">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'full' })}</p>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t.totalIncome}</p>
            <h2 className="text-5xl font-black flex items-baseline gap-2">
              {profile.monthlySalary.toLocaleString()} 
              <span className="text-lg font-medium text-slate-500">{t.currency}</span>
            </h2>
            <div className="mt-8 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <ArrowUpRight className="w-4 h-4" /> {t.healthy} Status
            </div>
          </div>
          <div className="p-10 bg-emerald-50 rounded-[3rem] border-2 border-emerald-100 shadow-sm">
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-4">{t.availableCash}</p>
            <h2 className="text-5xl font-black text-emerald-700 flex items-baseline gap-2">
              {availableIncome.toLocaleString()} 
              <span className="text-lg font-medium text-emerald-600/50">{t.currency}</span>
            </h2>
            <p className="mt-8 text-[10px] text-emerald-600 font-black uppercase tracking-widest">Net Liquidity</p>
          </div>
          <div className="p-10 bg-rose-50 rounded-[3rem] border-2 border-rose-100 shadow-sm">
            <p className="text-[10px] font-black text-rose-600/60 uppercase tracking-[0.2em] mb-4">{t.fixedCosts}</p>
            <h2 className="text-5xl font-black text-rose-700 flex items-baseline gap-2">
              {(totalFixed + totalDebts).toLocaleString()} 
              <span className="text-lg font-medium text-rose-600/50">{t.currency}</span>
            </h2>
            <p className="mt-8 text-[10px] text-rose-600 font-black uppercase tracking-widest">
              {((totalFixed + totalDebts) / profile.monthlySalary * 100).toFixed(0)}% Burden Ratio
            </p>
          </div>
        </div>

        {/* Section: Profile & Context */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl">
                <Users className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.basicInfo}</h3>
            </div>
            <div className="bg-slate-50 rounded-[2rem] p-8 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">{lang === 'en' ? 'Account Holder' : 'صاحب الحساب'}</span>
                <span className="font-black text-slate-800">{profile.account.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">{t.familyMembers}</span>
                <span className="font-black text-slate-800">{profile.familyMembers} {t.persons}</span>
              </div>
              {profile.age && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">{t.age}</span>
                  <span className="font-black text-slate-800">{profile.age} {lang === 'en' ? 'Years' : 'سنة'}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">{t.maritalStatus}</span>
                <span className="font-black text-slate-800 capitalize">{t[profile.maritalStatus as keyof typeof t] || profile.maritalStatus}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-bold">{t.incomeStability}</span>
                <span className="font-black text-slate-800">{profile.incomeStability}</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.aiLogic}</h3>
            </div>
            <div className="bg-emerald-50/30 rounded-[2rem] p-8 border-2 border-emerald-50 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                <span className="text-emerald-600/70 font-bold">{t.savingPriority}</span>
                <span className="font-black text-emerald-700">{profile.preferences.savingPriority}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                <span className="text-emerald-600/70 font-bold">{t.riskTolerance}</span>
                <span className="font-black text-emerald-700">{profile.preferences.riskTolerance}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-emerald-600/70 font-bold">{t.emergencyTarget}</span>
                <span className="font-black text-emerald-700">{profile.preferences.emergencyFundPercentage}%</span>
              </div>
            </div>
          </section>
        </div>

        {/* Section: Financial Health Score */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex items-center gap-12 mb-12">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 * (1 - 0.84)} className="text-emerald-500" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">84</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-black font-cairo">تحليل الصحة المالية الذكي</h3>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'en' 
                ? 'Your financial standing is excellent. You maintain a low debt-to-income ratio and have clear saving priorities. Our AI recommends increasing your emergency fund to cover 6 months of expenses.' 
                : 'وضعك المالي ممتاز. أنت تحافظ على نسبة منخفضة من الدين إلى الدخل ولديك أولويات ادخار واضحة. يوصي ذكاؤنا الاصطناعي بزيادة صندوق الطوارئ الخاص بك لتغطية 6 أشهر من النفقات.'}
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Low Risk
              </div>
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Growth Potential
              </div>
            </div>
          </div>
        </div>

        {/* Footer Page 1 */}
        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-bold">
          <span>MODABER FINANCIAL INTELLIGENCE UNIT</span>
          <span>PAGE 01 / 02</span>
        </div>
      </div>

      {/* Page 2: Detailed Breakdown */}
      <div className="min-h-[1300px] flex flex-col mt-20 pt-20 border-t-8 border-slate-100">
        <div className="grid grid-cols-2 gap-12 mb-12">
          {/* Detailed Expenses */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <TrendingDown className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.fixedExpenses}</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(profile.fixedExpenses).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-slate-600 font-bold capitalize">{t[key as keyof typeof t] || key}</span>
                  </div>
                  <span className="font-black text-slate-800">{value.toLocaleString()} {t.currency}</span>
                </div>
              ))}
              <div className="p-8 bg-rose-600 text-white rounded-[3rem] flex justify-between items-center shadow-2xl shadow-rose-900/20 mt-8">
                <div className="flex flex-col">
                  <span className="font-black uppercase tracking-[0.2em] text-[10px] opacity-70">Monthly Commitment</span>
                  <span className="text-sm font-bold">Total Fixed Costs</span>
                </div>
                <span className="text-4xl font-black">{totalFixed.toLocaleString()} {t.currency}</span>
              </div>
            </div>
          </section>

          {/* Debts & Obligations */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.debts} & {t.annualExpenses}</h3>
            </div>
            <div className="space-y-4">
              {profile.debts.length > 0 ? profile.debts.map(debt => (
                <div key={debt.id} className="p-5 border-2 border-amber-100 bg-amber-50/30 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800">{debt.description}</h4>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[8px] font-black rounded uppercase">{debt.priority}</span>
                  </div>
                  <p className="text-xl font-black text-amber-700">{debt.monthlyAmount} {t.currency} <span className="text-[10px] font-bold text-amber-600/50 uppercase">/ Month</span></p>
                </div>
              )) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold italic">
                  No active debts detected.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Section: Smart Budget Allocation */}
        <section className="mb-12 space-y-6">
          <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.smartBudget}</h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-500 font-medium leading-relaxed italic">
                {lang === 'en' 
                  ? 'Based on your priorities, we have allocated the remaining funds to maximize your financial security and lifestyle quality.' 
                  : 'بناءً على أولوياتك، قمنا بتخصيص الأموال المتبقية لتعزيز أمنك المالي وجودة حياتك.'}
              </p>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Priority Ranking</p>
                <div className="space-y-3">
                  {profile.preferences.monthlyPriorities.map((p, i) => (
                    <div key={p} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                      <span className="font-bold text-sm capitalize">{t[p as keyof typeof t] || p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">Allocation Targets</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Emergency Fund</span>
                    <span className="text-emerald-600">{savingsTarget} {t.currency}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${profile.preferences.emergencyFundPercentage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Optional Lifestyle</span>
                    <span className="text-slate-800">{totalOptional} {t.currency}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: AI Insights & Predictions */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.smartShopping}</h3>
            </div>
            <div className="bg-blue-50/30 border-2 border-blue-50 rounded-[2.5rem] p-8">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Bulk buy non-perishables this week.
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Switch to local brands for dairy products.
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Monitor fuel prices for early refill.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 font-cairo">{t.safeInvestments}</h3>
            </div>
            <div className="bg-indigo-50/30 border-2 border-indigo-50 rounded-[2.5rem] p-8">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-100">
                  <h5 className="font-black text-indigo-900 text-xs uppercase mb-1">Recommended</h5>
                  <p className="text-sm font-bold text-slate-800">High-Yield Savings Certificates (EGP)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Expected Return: 19-22% Annually</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-100">
                  <h5 className="font-black text-indigo-900 text-xs uppercase mb-1">Diversification</h5>
                  <p className="text-sm font-bold text-slate-800">Gold Bullion (Long-term hedge)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Risk Level: Moderate</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Disclaimer & Final Note */}
        <div className="mt-auto bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex gap-8 items-start">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Financial Disclaimer</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              This report is generated by an AI assistant for informational purposes only and does not constitute professional financial advice. 
              Actual market conditions may vary. Please consult with a certified financial planner for significant investment decisions. 
              Modaber AI uses historical data and current market trends to provide these estimates.
            </p>
          </div>
        </div>

        {/* Footer Page 2 */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-bold">
          <span>© {new Date().getFullYear()} MODABER AI • ALL RIGHTS RESERVED</span>
          <span>PAGE 02 / 02</span>
        </div>
      </div>
    </div>
  );
};

export default HiddenReport;
