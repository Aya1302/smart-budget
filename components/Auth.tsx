
import React, { useState, useEffect } from 'react';
import { Wallet, Mail, Lock, User, ArrowRight, Facebook, Chrome, Eye, EyeOff, Sun, Moon, Globe, Loader2, ChevronLeft, AlertCircle, CheckCircle2, X, PlusCircle } from 'lucide-react';
import { UserAccount, Language } from '../types';
import { translations } from '../translations';

interface AuthProps {
  onLogin: (account: UserAccount) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const USERS_STORAGE_KEY = 'modaber_mock_users';

const Auth: React.FC<AuthProps> = ({ onLogin, lang, setLang, theme, setTheme }) => {
  const t = translations[lang];
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [showAccountPicker, setShowAccountPicker] = useState<'Google' | 'Facebook' | null>(null);
  const [isManualSocial, setIsManualSocial] = useState(false);
  const [manualSocialData, setManualSocialData] = useState({ name: '', email: '' });
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [view]);

  const getStoredUsers = () => {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  };

  const saveUser = (user: any) => {
    const users = getStoredUsers();
    users[user.email] = user;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (view === 'forgot') {
      setIsSocialLoading('reset');
      setTimeout(() => {
        setIsResetSent(true);
        setIsSocialLoading(null);
      }, 1000);
      return;
    }

    const users = getStoredUsers();

    if (view === 'register') {
      if (users[formData.email]) {
        setError(t.errorEmailExists);
        return;
      }
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=10b981&color=fff`
      };
      
      saveUser(newUser);
      setSuccess(t.successRegister);
      setTimeout(() => setView('login'), 1500);
    } else if (view === 'login') {
      const user = users[formData.email];
      
      if (!user) {
        setError(t.errorUserNotFound);
        return;
      }
      
      if (user.password !== formData.password) {
        setError(t.errorWrongPassword);
        return;
      }

      onLogin({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
    }
  };

  const startSocialAuth = (provider: 'Google' | 'Facebook') => {
    setIsSocialLoading(provider);
    setTimeout(() => {
      setIsSocialLoading(null);
      setShowAccountPicker(provider);
      setIsManualSocial(false);
    }, 600);
  };

  const finalizeSocialLogin = (selectedEmail: string, selectedName: string) => {
    const users = getStoredUsers();
    
    // Auto-register if not exists
    if (!users[selectedEmail]) {
      const newUser = {
        name: selectedName,
        email: selectedEmail,
        password: `social-${Math.random().toString(36).substring(7)}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedName)}&background=${showAccountPicker === 'Google' ? '4285F4' : '333'}&color=fff`
      };
      saveUser(newUser);
    }

    const user = getStoredUsers()[selectedEmail];
    onLogin({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
    setShowAccountPicker(null);
  };

  const handleManualSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSocialData.email && manualSocialData.name) {
      finalizeSocialLogin(manualSocialData.email, manualSocialData.name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
      {/* Account Picker Overlay (Simulated OAuth) */}
      {showAccountPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {showAccountPicker === 'Google' ? <Chrome className="w-5 h-5 text-blue-500" /> : <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {isManualSocial ? 'Sign in with different email' : `Sign in with ${showAccountPicker}`}
                </span>
              </div>
              <button onClick={() => setShowAccountPicker(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {!isManualSocial ? (
                <>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-2">Choose an account</p>
                  {[
                    { name: 'Sami Al-Farsi', email: 'sami.farsi@gmail.com' },
                    { name: 'Noura Ahmed', email: 'noura.a@outlook.com' },
                    { name: 'Guest User', email: `guest.${showAccountPicker.toLowerCase()}@example.com` }
                  ].map((acc, i) => (
                    <button
                      key={i}
                      onClick={() => finalizeSocialLogin(acc.email, acc.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                        {acc.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{acc.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{acc.email}</p>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={() => setIsManualSocial(true)}
                    className="w-full p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Use another account
                  </button>
                </>
              ) : (
                <form onSubmit={handleManualSocialSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      value={manualSocialData.name}
                      onChange={(e) => setManualSocialData({...manualSocialData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@provider.com"
                      value={manualSocialData.email}
                      onChange={(e) => setManualSocialData({...manualSocialData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsManualSocial(false)}
                      className="flex-1 py-3 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-400 text-center leading-relaxed">
              To continue, {showAccountPicker} will share your name, email address, and profile picture with {t.appName}.
            </div>
          </div>
        </div>
      )}

      {/* Pre-auth Toggles */}
      <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-3 z-50`}>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <button 
            type="button"
            onClick={() => setTheme('light')}
            className={`p-2 rounded-xl transition-all duration-200 ${theme === 'light' ? 'bg-slate-100 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Sun className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Moon className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          type="button"
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-tighter font-cairo">{lang === 'en' ? 'AR' : 'EN'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100 dark:border-slate-800">
        <div className="md:w-1/2 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-xl">
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="text-2xl font-black tracking-tight">{t.appName}</span>
            </div>
            <h1 className="text-4xl font-black leading-tight mb-4 font-cairo">
              {t.heroTitle}
            </h1>
            <p className="text-emerald-100 text-lg">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-2xl font-black">98%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">{t.accuracy}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-2xl font-black">2.4k</p>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">{t.avgSavings} ({t.currency})</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 font-cairo">
              {view === 'login' ? t.authWelcomeBack : view === 'register' ? t.authCreateAccount : t.forgotPassword}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {view === 'login' ? t.authLoginDesc : view === 'register' ? t.authRegisterDesc : t.resetInstructions}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {view === 'forgot' && isResetSent ? (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 text-center animate-in zoom-in duration-300">
              <p className="text-emerald-800 dark:text-emerald-400 font-bold mb-4">{t.resetSent}</p>
              <button 
                onClick={() => { setView('login'); setIsResetSent(false); }}
                className="text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center gap-2 mx-auto hover:underline"
              >
                <ChevronLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.backToLogin}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {view === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                    <input 
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.emailAddress}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                  <input 
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium dark:text-white"
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.password}</label>
                    {view === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => setView('forgot')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        {t.forgot}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium dark:text-white"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSocialLoading !== null}
                className="w-full bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-xl shadow-slate-100 dark:shadow-none mt-4 group"
              >
                {isSocialLoading === 'reset' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   <>
                     {view === 'login' ? t.signIn : view === 'register' ? t.authCreateAccount : t.sendResetLink}
                     <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                   </>
                )}
              </button>

              {view === 'forgot' && (
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {t.backToLogin}
                </button>
              )}
            </form>
          )}

          {view !== 'forgot' && (
            <>
              <div className="my-8 flex items-center gap-4 text-slate-300 dark:text-slate-700">
                <hr className="flex-1 border-slate-100 dark:border-slate-800" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.orContinueWith}</span>
                <hr className="flex-1 border-slate-100 dark:border-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  type="button"
                  disabled={isSocialLoading !== null}
                  onClick={() => startSocialAuth('Google')}
                  className={`flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-600 dark:text-slate-400 ${isSocialLoading === 'Google' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  {isSocialLoading === 'Google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />} 
                  Google
                </button>
                <button 
                  type="button"
                  disabled={isSocialLoading !== null}
                  onClick={() => startSocialAuth('Facebook')}
                  className={`flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-600 dark:text-slate-400 ${isSocialLoading === 'Facebook' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  {isSocialLoading === 'Facebook' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-400" />} 
                  Facebook
                </button>
              </div>

              <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
                {view === 'login' ? t.noAccount : t.hasAccount}
                <button 
                  type="button"
                  onClick={() => setView(view === 'login' ? 'register' : 'login')}
                  className="ml-2 text-emerald-600 dark:text-emerald-400 font-black hover:underline"
                >
                  {view === 'login' ? t.createOne : t.signInHere}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
