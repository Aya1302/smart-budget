
import React, { useState } from 'react';
import { UserProfile, MaritalStatus, Language, LivingCostLevel, IncomeStability, SavingPreference, RiskTolerance, Debt, AnnualExpense } from '../types';
import { translations } from '../translations';
import { Wallet, Home, Shield, ChevronRight, ChevronLeft, Sun, Moon, Globe, Coffee, ChevronUp, ChevronDown, Plus, Trash2, CreditCard, Calendar } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Omit<UserProfile, 'account'>) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, lang, setLang, theme, setTheme }) => {
  const t = translations[lang];
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Omit<UserProfile, 'account'>>({
    monthlySalary: 6000,
    age: undefined,
    familyMembers: 1,
    maritalStatus: 'not_specified',
    livingCostLevel: 'Medium',
    incomeStability: 'Full-time',
    fixedExpenses: {
      rent: 1000,
      electricity: 100,
      water: 50,
      gas: 50,
      transportation: 150,
      internet: 50,
      mobile: 30
    },
    debts: [],
    annualExpenses: [],
    optionalExpenses: {
      streaming: 0,
      education: 0,
      medical: 0
    },
    preferences: {
      savingPriority: 'not_specified',
      riskTolerance: 'not_specified',
      emergencyFundPercentage: 10,
      monthlyPriorities: ['cat_food', 'cat_transport', 'cat_emergency', 'cat_savings', 'cat_invest', 'cat_personal']
    }
  });

  const [showDebtForm, setShowDebtForm] = useState(false);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    description: '',
    monthlyAmount: 0,
    priority: 'Medium'
  });

  const [showAnnualForm, setShowAnnualForm] = useState(false);
  const [newAnnual, setNewAnnual] = useState<Partial<AnnualExpense>>({
    description: '',
    totalAmount: 0,
    priority: 'Medium'
  });

  const updateRootField = (field: keyof Omit<UserProfile, 'account'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFixedExpense = (field: keyof typeof formData.fixedExpenses, value: number) => {
    setFormData(prev => ({
      ...prev,
      fixedExpenses: { ...prev.fixedExpenses, [field]: value }
    }));
  };

  const updateOptionalExpense = (field: keyof typeof formData.optionalExpenses, value: number) => {
    setFormData(prev => ({
      ...prev,
      optionalExpenses: { ...prev.optionalExpenses, [field]: value }
    }));
  };

  const updatePreference = (field: keyof typeof formData.preferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const addDebt = () => {
    if (!newDebt.description || !newDebt.monthlyAmount) return;
    const debt: Debt = {
      id: Math.random().toString(36).substring(7),
      description: newDebt.description!,
      monthlyAmount: newDebt.monthlyAmount!,
      priority: newDebt.priority as any,
      dueDate: newDebt.dueDate
    };
    updateRootField('debts', [...formData.debts, debt]);
    setNewDebt({ description: '', monthlyAmount: 0, priority: 'Medium' });
    setShowDebtForm(false);
  };

  const addAnnual = () => {
    if (!newAnnual.description || !newAnnual.totalAmount) return;
    const annual: AnnualExpense = {
      id: Math.random().toString(36).substring(7),
      description: newAnnual.description!,
      totalAmount: newAnnual.totalAmount!,
      priority: newAnnual.priority as any,
      expectedMonth: newAnnual.expectedMonth
    };
    updateRootField('annualExpenses', [...formData.annualExpenses, annual]);
    setNewAnnual({ description: '', totalAmount: 0, priority: 'Medium' });
    setShowAnnualForm(false);
  };

  const removeDebt = (id: string) => {
    updateRootField('debts', formData.debts.filter(d => d.id !== id));
  };

  const removeAnnual = (id: string) => {
    updateRootField('annualExpenses', formData.annualExpenses.filter(e => e.id !== id));
  };

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newPriorities = [...formData.preferences.monthlyPriorities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newPriorities.length) {
      [newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]];
      updatePreference('monthlyPriorities', newPriorities);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.monthlySalary || !formData.familyMembers) {
        alert(lang === 'en' ? 'Salary and Family Members are required' : 'الراتب وعدد أفراد الأسرة حقول مطلوبة');
        return;
      }
    }
    if (step === 2) {
      const { rent, electricity, water, gas, transportation } = formData.fixedExpenses;
      if (rent === undefined || electricity === undefined || water === undefined || gas === undefined || transportation === undefined) {
         alert(lang === 'en' ? 'Required fixed expenses must be filled' : 'يجب ملء المصاريف الثابتة المطلوبة');
         return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const fixedFields = [
    { id: 'rent', required: true },
    { id: 'electricity', required: true },
    { id: 'water', required: true },
    { id: 'gas', required: true },
    { id: 'transportation', required: true },
    { id: 'internet', required: false },
    { id: 'mobile', required: false },
  ];

  const optionalFields = [
    { id: 'streaming', required: false },
    { id: 'education', required: false },
    { id: 'medical', required: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
      <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-3 z-50`}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:scale-105 transition-all"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-emerald-400" />}
        </button>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-xs shadow-sm hover:scale-105 transition-all"
        >
          <Globe className="w-5 h-5 mr-1 inline-block" /> {lang === 'en' ? 'AR' : 'EN'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h1 className="text-2xl font-bold font-cairo">{t.financialProfile}</h1>
            <span className="text-emerald-100 font-medium">{t.step} {step} {t.of} 5</span>
          </div>
          <div className="flex gap-1.5 relative z-10">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-white' : 'bg-emerald-800/50'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600"><Wallet className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100">{t.basicInfo}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">{t.monthlySalary} <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    value={formData.monthlySalary || ''}
                    onChange={(e) => updateRootField('monthlySalary', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">{t.familyMembers} <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    required
                    value={formData.familyMembers || ''}
                    onChange={(e) => updateRootField('familyMembers', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">{t.maritalStatus} ({t.optional})</label>
                  <select 
                    value={formData.maritalStatus}
                    onChange={(e) => updateRootField('maritalStatus', e.target.value as MaritalStatus)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  >
                    <option value="not_specified">{t.not_specified}</option>
                    <option value="single">{t.single}</option>
                    <option value="married">{t.married}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">{t.livingCostLevel}</label>
                  <select 
                    value={formData.livingCostLevel}
                    onChange={(e) => updateRootField('livingCostLevel', e.target.value as LivingCostLevel)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  >
                    <option value="High">{t.high}</option>
                    <option value="Medium">{t.medium}</option>
                    <option value="Low">{t.low}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500 mb-2">{t.incomeStability}</label>
                  <select 
                    value={formData.incomeStability}
                    onChange={(e) => updateRootField('incomeStability', e.target.value as IncomeStability)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  >
                    <option value="Full-time">{t.full_time}</option>
                    <option value="Freelance">{t.freelance}</option>
                    <option value="Seasonal">{t.seasonal}</option>
                    <option value="Mixed">{t.mixed}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto custom-scrollbar max-h-[60vh] px-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600"><Home className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100">{t.fixedExpenses}</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fixedFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                      {t[field.id as keyof typeof t] || field.id}
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    <input 
                      type="number" 
                      required={field.required}
                      value={(formData.fixedExpenses as any)[field.id] || 0}
                      onChange={(e) => updateFixedExpense(field.id as any, Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Debts Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> {t.debts}
                  </h4>
                  <button 
                    onClick={() => setShowDebtForm(true)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> {t.addDebt}
                  </button>
                </div>
                
                {formData.debts.length > 0 && (
                  <div className="space-y-2">
                    {formData.debts.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{d.description}</p>
                          <p className="text-xs text-slate-400">{d.monthlyAmount} {t.currency}/mo • {d.priority}</p>
                        </div>
                        <button onClick={() => removeDebt(d.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showDebtForm && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 space-y-4 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.debtName}</label>
                        <input 
                          type="text"
                          value={newDebt.description}
                          onChange={e => setNewDebt({...newDebt, description: e.target.value})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.monthlyAmount}</label>
                        <input 
                          type="number"
                          value={newDebt.monthlyAmount}
                          onChange={e => setNewDebt({...newDebt, monthlyAmount: Number(e.target.value)})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.priority}</label>
                        <select 
                          value={newDebt.priority}
                          onChange={e => setNewDebt({...newDebt, priority: e.target.value as any})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        >
                          <option value="Low">{t.low}</option>
                          <option value="Medium">{t.medium}</option>
                          <option value="High">{t.high}</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.dueDate} ({t.optional})</label>
                        <input 
                          type="month"
                          value={newDebt.dueDate}
                          onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowDebtForm(false)} className="flex-1 py-2 text-xs font-bold text-slate-400">{t.cancel}</button>
                      <button onClick={addDebt} className="flex-2 py-2 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold">{t.addDebt}</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Annual Expenses Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" /> {t.annualExpenses}
                  </h4>
                  <button 
                    onClick={() => setShowAnnualForm(true)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> {t.addAnnual}
                  </button>
                </div>
                
                {formData.annualExpenses.length > 0 && (
                  <div className="space-y-2">
                    {formData.annualExpenses.map(e => (
                      <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{e.description}</p>
                          <p className="text-xs text-slate-400">{e.totalAmount} {t.currency}/yr • {e.expectedMonth || 'No month set'}</p>
                        </div>
                        <button onClick={() => removeAnnual(e.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showAnnualForm && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 space-y-4 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.debtName}</label>
                        <input 
                          type="text"
                          value={newAnnual.description}
                          onChange={e => setNewAnnual({...newAnnual, description: e.target.value})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.totalAmount}</label>
                        <input 
                          type="number"
                          value={newAnnual.totalAmount}
                          onChange={e => setNewAnnual({...newAnnual, totalAmount: Number(e.target.value)})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.priority}</label>
                        <select 
                          value={newAnnual.priority}
                          onChange={e => setNewAnnual({...newAnnual, priority: e.target.value as any})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        >
                          <option value="Low">{t.low}</option>
                          <option value="Medium">{t.medium}</option>
                          <option value="High">{t.high}</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.expectedMonth} ({t.optional})</label>
                        <input 
                          type="month"
                          value={newAnnual.expectedMonth}
                          onChange={e => setNewAnnual({...newAnnual, expectedMonth: e.target.value})}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowAnnualForm(false)} className="flex-1 py-2 text-xs font-bold text-slate-400">{t.cancel}</button>
                      <button onClick={addAnnual} className="flex-2 py-2 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold">{t.addAnnual}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600"><Coffee className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100">{t.optionalExpenses}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {optionalFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                      {t[field.id as keyof typeof t] || field.id}
                      <span className="text-[9px] text-slate-400 ml-1 italic font-normal">({t.optional})</span>
                    </label>
                    <input 
                      type="number" 
                      value={(formData.optionalExpenses as any)[field.id] || 0}
                      onChange={(e) => updateOptionalExpense(field.id as any, Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600"><Shield className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100">{t.aiLogic}</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-3">{t.savingPriority} ({t.optional})</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Medium', 'High', 'not_specified'].map((p) => (
                      <button
                        key={p}
                        onClick={() => updatePreference('savingPriority', p)}
                        className={`py-2 rounded-xl border-2 transition-all font-bold text-xs ${formData.preferences.savingPriority === p ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        {t[p.toLowerCase() as keyof typeof t] || p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-3">{t.riskTolerance} ({t.optional})</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Medium', 'High', 'not_specified'].map((p) => (
                      <button
                        key={p}
                        onClick={() => updatePreference('riskTolerance', p)}
                        className={`py-2 rounded-xl border-2 transition-all font-bold text-xs ${formData.preferences.riskTolerance === p ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        {t[p.toLowerCase() as keyof typeof t] || p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-3">{t.monthlyPriorities}</label>
                  <div className="space-y-2">
                    {formData.preferences.monthlyPriorities.map((p, idx) => (
                      <div key={p} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center text-slate-500">{idx + 1}</span>
                          {t[p as keyof typeof t] || p}
                        </span>
                        <div className="flex gap-1">
                          <button 
                            disabled={idx === 0}
                            onClick={() => movePriority(idx, 'up')}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-20"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={idx === formData.preferences.monthlyPriorities.length - 1}
                            onClick={() => movePriority(idx, 'down')}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-20"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl shadow-emerald-900/10">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-cairo text-slate-800 dark:text-slate-100">{t.profileInitialized}</h3>
              <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                {t.readyRoadmap}
              </p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex gap-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 px-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.back}
            </button>
          )}
          <button 
            onClick={step === 5 ? () => onComplete(formData) : nextStep}
            className="flex-[2] px-6 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            {step === 5 ? t.launchDashboard : t.continue} <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
