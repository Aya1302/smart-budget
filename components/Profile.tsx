
import React, { useState } from 'react';
import { UserProfile, MaritalStatus, Language, LivingCostLevel, IncomeStability, SavingPreference, RiskTolerance, Debt, AnnualExpense } from '../types';
import { translations } from '../translations';
import { User, Wallet, Home, Shield, Edit2, Save, X, CheckCircle2, Coffee, ChevronUp, ChevronDown, Plus, Trash2, CreditCard, Calendar } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  lang: Language;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, lang, onUpdate }) => {
  const t = translations[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...profile });
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSave = () => {
    if (!editedProfile.monthlySalary || !editedProfile.familyMembers) {
      alert(lang === 'en' ? 'Salary and Family Members are required' : 'الراتب وعدد أفراد الأسرة حقول مطلوبة');
      return;
    }
    onUpdate(editedProfile);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateRootField = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateFixedExpense = (field: keyof typeof editedProfile.fixedExpenses, value: number) => {
    setEditedProfile(prev => ({
      ...prev,
      fixedExpenses: { ...prev.fixedExpenses, [field]: value }
    }));
  };

  const updateOptionalExpense = (field: keyof typeof editedProfile.optionalExpenses, value: number) => {
    setEditedProfile(prev => ({
      ...prev,
      optionalExpenses: { ...prev.optionalExpenses, [field]: value }
    }));
  };

  const updatePreference = (field: keyof typeof editedProfile.preferences, value: any) => {
    setEditedProfile(prev => ({
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
    updateRootField('debts', [...editedProfile.debts, debt]);
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
    updateRootField('annualExpenses', [...editedProfile.annualExpenses, annual]);
    setNewAnnual({ description: '', totalAmount: 0, priority: 'Medium' });
    setShowAnnualForm(false);
  };

  const removeDebt = (id: string) => {
    updateRootField('debts', editedProfile.debts.filter(d => d.id !== id));
  };

  const removeAnnual = (id: string) => {
    updateRootField('annualExpenses', editedProfile.annualExpenses.filter(e => e.id !== id));
  };

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newPriorities = [...editedProfile.preferences.monthlyPriorities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newPriorities.length) {
      [newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]];
      updatePreference('monthlyPriorities', newPriorities);
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-cairo">{t.profile}</h2>
          <p className="text-slate-500 dark:text-slate-400">{lang === 'en' ? 'Manage your financial parameters and AI preferences.' : 'إدارة المعايير المالية وتفضيلات الذكاء الاصطناعي.'}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
            >
              <Edit2 className="w-4 h-4" /> {t.editProfile}
            </button>
          ) : (
            <>
              <button 
                onClick={() => { setIsEditing(false); setEditedProfile({ ...profile }); }}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                <X className="w-4 h-4" /> {t.cancel}
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all"
              >
                <Save className="w-4 h-4" /> {t.saveChanges}
              </button>
            </>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" /> {t.profileUpdated}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Account Info */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-emerald-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.basicInfo}</h3>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <img src={profile.account.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" />
            <div>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">{profile.account.name}</p>
              <p className="text-sm text-slate-400">{profile.account.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.monthlySalary} <span className="text-rose-500">*</span></label>
              {isEditing ? (
                <input 
                  type="number" 
                  required
                  value={editedProfile.monthlySalary}
                  onChange={(e) => updateRootField('monthlySalary', Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              ) : (
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">${profile.monthlySalary}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.familyMembers} <span className="text-rose-500">*</span></label>
              {isEditing ? (
                <input 
                  type="number" 
                  required
                  value={editedProfile.familyMembers}
                  onChange={(e) => updateRootField('familyMembers', Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              ) : (
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{profile.familyMembers}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.maritalStatus}</label>
              {isEditing ? (
                <select 
                  value={editedProfile.maritalStatus}
                  onChange={(e) => updateRootField('maritalStatus', e.target.value as MaritalStatus)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  <option value="not_specified">{t.not_specified}</option>
                  <option value="single">{t.single}</option>
                  <option value="married">{t.married}</option>
                </select>
              ) : (
                <p className="text-xl font-black text-slate-800 dark:text-slate-100 capitalize">{t[profile.maritalStatus as keyof typeof t] || profile.maritalStatus}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.livingCostLevel}</label>
              {isEditing ? (
                <select 
                  value={editedProfile.livingCostLevel}
                  onChange={(e) => updateRootField('livingCostLevel', e.target.value as LivingCostLevel)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  <option value="High">{t.high}</option>
                  <option value="Medium">{t.medium}</option>
                  <option value="Low">{t.low}</option>
                </select>
              ) : (
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{t[profile.livingCostLevel.toLowerCase() as keyof typeof t] || profile.livingCostLevel}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.incomeStability}</label>
              {isEditing ? (
                <select 
                  value={editedProfile.incomeStability}
                  onChange={(e) => updateRootField('incomeStability', e.target.value as IncomeStability)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  <option value="Full-time">{t.full_time}</option>
                  <option value="Freelance">{t.freelance}</option>
                  <option value="Seasonal">{t.seasonal}</option>
                  <option value="Mixed">{t.mixed}</option>
                </select>
              ) : (
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{t[profile.incomeStability.toLowerCase().replace('-', '_') as keyof typeof t] || profile.incomeStability}</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-emerald-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.aiLogic}</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.savingPriority}</label>
                {isEditing ? (
                  <select 
                    value={editedProfile.preferences.savingPriority}
                    onChange={(e) => updatePreference('savingPriority', e.target.value as SavingPreference)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs dark:text-white"
                  >
                    <option value="not_specified">{t.not_specified}</option>
                    <option value="Low">{t.low}</option>
                    <option value="Medium">{t.medium}</option>
                    <option value="High">{t.high}</option>
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold inline-block border border-emerald-100 dark:border-emerald-500/20 text-xs">
                    {t[profile.preferences.savingPriority.toLowerCase() as keyof typeof t] || profile.preferences.savingPriority}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.riskTolerance}</label>
                {isEditing ? (
                  <select 
                    value={editedProfile.preferences.riskTolerance}
                    onChange={(e) => updatePreference('riskTolerance', e.target.value as RiskTolerance)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs dark:text-white"
                  >
                    <option value="not_specified">{t.not_specified}</option>
                    <option value="Low">{t.low}</option>
                    <option value="Medium">{t.medium}</option>
                    <option value="High">{t.high}</option>
                  </select>
                ) : (
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold inline-block border border-slate-100 dark:border-slate-700 text-xs">
                    {t[profile.preferences.riskTolerance.toLowerCase() as keyof typeof t] || profile.preferences.riskTolerance}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.emergencyTarget}</label>
              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="range" min="0" max="50" step="5"
                    value={editedProfile.preferences.emergencyFundPercentage}
                    onChange={(e) => updatePreference('emergencyFundPercentage', Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>0%</span>
                    <span className="text-emerald-600">{editedProfile.preferences.emergencyFundPercentage}%</span>
                    <span>50%</span>
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profile.preferences.emergencyFundPercentage}%</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.monthlyPriorities}</label>
              <div className="space-y-2">
                {(isEditing ? editedProfile : profile).preferences.monthlyPriorities.map((p, idx) => (
                  <div key={p} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] flex items-center justify-center text-slate-500">{idx + 1}</span>
                      {t[p as keyof typeof t] || p}
                    </span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <button 
                          disabled={idx === 0}
                          onClick={() => movePriority(idx, 'up')}
                          className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-20"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button 
                          disabled={idx === (isEditing ? editedProfile : profile).preferences.monthlyPriorities.length - 1}
                          onClick={() => movePriority(idx, 'down')}
                          className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 disabled:opacity-20"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Expenses */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Home className="text-emerald-600 w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.fixedExpenses}</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            {fixedFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">
                  {t[field.id as keyof typeof t] || field.id}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    required={field.required}
                    value={(editedProfile.fixedExpenses as any)[field.id] || 0}
                    onChange={(e) => updateFixedExpense(field.id as any, Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm focus:ring-1 focus:ring-emerald-500 dark:text-white"
                  />
                ) : (
                  <p className="font-bold text-slate-800 dark:text-slate-100">${(profile.fixedExpenses as any)[field.id] || 0}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Debts management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> {t.debts}
                </h4>
                {isEditing && (
                  <button onClick={() => setShowDebtForm(true)} className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    <Plus className="w-3 h-3" /> {t.addDebt}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(isEditing ? editedProfile : profile).debts.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{d.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${d.monthlyAmount}/mo • {d.priority}</p>
                    </div>
                    {isEditing && (
                      <button onClick={() => removeDebt(d.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && showDebtForm && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 space-y-4 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder={t.debtName}
                      value={newDebt.description} onChange={e => setNewDebt({...newDebt, description: e.target.value})}
                      className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                    <input 
                      type="number" placeholder={t.monthlyAmount}
                      value={newDebt.monthlyAmount} onChange={e => setNewDebt({...newDebt, monthlyAmount: Number(e.target.value)})}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                    <select 
                      value={newDebt.priority} onChange={e => setNewDebt({...newDebt, priority: e.target.value as any})}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <option value="Low">{t.low}</option>
                      <option value="Medium">{t.medium}</option>
                      <option value="High">{t.high}</option>
                    </select>
                    <input 
                      type="month"
                      value={newDebt.dueDate} onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})}
                      className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowDebtForm(false)} className="flex-1 text-[10px] font-bold text-slate-400">{t.cancel}</button>
                    <button onClick={addDebt} className="flex-2 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{t.addDebt}</button>
                  </div>
                </div>
              )}
            </div>

            {/* Annual expenses management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> {t.annualExpenses}
                </h4>
                {isEditing && (
                  <button onClick={() => setShowAnnualForm(true)} className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    <Plus className="w-3 h-3" /> {t.addAnnual}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(isEditing ? editedProfile : profile).annualExpenses.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{e.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${e.totalAmount}/yr • {e.expectedMonth || 'No month'}</p>
                    </div>
                    {isEditing && (
                      <button onClick={() => removeAnnual(e.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && showAnnualForm && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 space-y-4 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder={t.debtName}
                      value={newAnnual.description} onChange={e => setNewAnnual({...newAnnual, description: e.target.value})}
                      className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                    <input 
                      type="number" placeholder={t.totalAmount}
                      value={newAnnual.totalAmount} onChange={e => setNewAnnual({...newAnnual, totalAmount: Number(e.target.value)})}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                    <select 
                      value={newAnnual.priority} onChange={e => setNewAnnual({...newAnnual, priority: e.target.value as any})}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <option value="Low">{t.low}</option>
                      <option value="Medium">{t.medium}</option>
                      <option value="High">{t.high}</option>
                    </select>
                    <input 
                      type="month"
                      value={newAnnual.expectedMonth} onChange={e => setNewAnnual({...newAnnual, expectedMonth: e.target.value})}
                      className="col-span-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAnnualForm(false)} className="flex-1 text-[10px] font-bold text-slate-400">{t.cancel}</button>
                    <button onClick={addAnnual} className="flex-2 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{t.addAnnual}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional Expenses */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Coffee className="text-emerald-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.optionalExpenses}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {optionalFields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">
                  {t[field.id as keyof typeof t] || field.id}
                </label>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={(editedProfile.optionalExpenses as any)[field.id] || 0}
                    onChange={(e) => updateOptionalExpense(field.id as any, Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm focus:ring-1 focus:ring-emerald-500 dark:text-white"
                  />
                ) : (
                  <p className="font-bold text-slate-800 dark:text-slate-100">${(profile.optionalExpenses as any)[field.id] || 0}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
