
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  BarChart3, 
  Info, 
  ShieldCheck, 
  Menu, 
  LogOut,
  Sun,
  Moon,
  Globe,
  X,
  User
} from 'lucide-react';
import { UserProfile, UserAccount, Language } from './types';
import { translations } from './translations';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BudgetPlanner from './components/BudgetPlanner';
import PriceForecaster from './components/PriceForecaster';
import ShoppingList from './components/ShoppingList';
import Investments from './components/Investments';
import Analytics from './components/Analytics';
import ExtraPages from './components/ExtraPages';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    // If we haven't explicitly set a language yet, or to force Arabic for this transition
    if (!saved) return 'ar';
    return saved as Language;
  });

  // Force Arabic on first load if not already set to 'ar' to ensure user sees the change
  useEffect(() => {
    const hasForcedAr = localStorage.getItem('modaber_forced_ar');
    if (!hasForcedAr) {
      setLang('ar');
      localStorage.setItem('modaber_forced_ar', 'true');
    }
  }, []);

  const t = translations[lang];

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const handleLogin = (userAccount: UserAccount) => setAccount(userAccount);
  const handleLogout = () => {
    setAccount(null);
    setProfile(null);
    setActiveTab('dashboard');
    setIsMobileMenuOpen(false);
  };
  
  const handleOnboardingComplete = (p: Omit<UserProfile, 'account'>) => {
    if (account) setProfile({ ...p, account } as UserProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'budget', label: t.smartBudget, icon: Wallet },
    { id: 'prices', label: t.pricePredictions, icon: TrendingUp },
    { id: 'shopping', label: t.smartShopping, icon: ShoppingBag },
    { id: 'investments', label: t.safeInvestments, icon: ShieldCheck },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const extraNavItems = [
    { id: 'how-it-works', label: t.howItWorks, icon: Info },
    { id: 'privacy', label: t.privacy, icon: ShieldCheck },
  ];

  if (!account) return <Auth onLogin={handleLogin} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />;
  if (!profile) return <Onboarding onComplete={handleOnboardingComplete} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />;

  const renderContent = () => {
    const props = { profile, lang };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} theme={theme} />;
      case 'budget': return <BudgetPlanner {...props} />;
      case 'prices': return <PriceForecaster {...props} />;
      case 'shopping': return <ShoppingList {...props} />;
      case 'investments': return <Investments {...props} />;
      case 'analytics': return <Analytics {...props} />;
      case 'profile': return <Profile {...props} onUpdate={handleUpdateProfile} />;
      case 'how-it-works': return <ExtraPages type="how" lang={lang} />;
      case 'privacy': return <ExtraPages type="privacy" lang={lang} />;
      default: return <Dashboard {...props} theme={theme} />;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <span className="font-black text-xl text-slate-800 dark:text-white tracking-tight">{t.appName}</span>
          )}
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === item.id 
              ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xl' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${lang === 'ar' ? 'ml-0' : ''}`} />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-cairo">{item.label}</span>}
          </button>
        ))}
        
        <div className="pt-8 pb-4">
          <div className={`h-px bg-slate-100 dark:bg-slate-800 ${(isSidebarOpen || isMobileMenuOpen) ? 'mx-4' : 'mx-2'}`} />
        </div>

        {extraNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === item.id 
              ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xl' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-cairo">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-cairo">{t.signOut}</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300 relative z-30`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-slate-900 flex flex-col shadow-2xl transition-transform duration-300`}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-20 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl md:hidden"
            >
              <Menu className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl hidden md:flex"
            >
              <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
               <h2 className="font-black text-lg text-slate-800 dark:text-white capitalize font-cairo tracking-tight">
                 {t[activeTab as keyof typeof t] || activeTab.replace('-', ' ')}
               </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 rounded-xl transition-all duration-200 ${theme === 'light' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Light Mode"
              >
                <Sun className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'bg-slate-700 text-emerald-400 shadow-md scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                title="Dark Mode"
              >
                <Moon className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-tighter hidden xs:block font-cairo">{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2 hidden md:block" />

            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('profile')}
            >
              <div className={`text-right hidden sm:block ${lang === 'ar' ? 'order-2' : ''}`}>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-emerald-600 transition-colors">{account.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-cairo">{t[profile.maritalStatus as keyof typeof t] || profile.maritalStatus}</p>
              </div>
              <img 
                src={account.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-2xl border-2 border-white dark:border-slate-800 shadow-lg object-cover group-hover:scale-110 group-hover:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 transition-colors duration-300 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
