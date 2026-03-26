
import React, { useState } from 'react';
import { Wallet, Chrome, Sun, Moon, Globe, Loader2, AlertCircle } from 'lucide-react';
import { UserAccount, Language } from '../types';
import { translations } from '../translations';
import { auth, googleProvider, signInWithPopup } from '../firebase';

interface AuthProps {
  onLogin: (account: UserAccount) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, lang, setLang, theme, setTheme }) => {
  const t = translations[lang];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin({
        name: user.displayName || 'User',
        email: user.email || '',
        avatar: user.photoURL || undefined
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(lang === 'en' ? 'Login failed. Please try again.' : 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
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
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-emerald-900/40">
                <Wallet className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-4xl font-bold leading-none text-white font-cairo" style={{ letterSpacing: 'normal' }}>مُدَبِّر</span>
                <span className="text-sm font-bold text-white tracking-[0.3em] uppercase">Modaber</span>
              </div>
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
              {t.authWelcomeBack}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.authLoginDesc}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-black text-slate-700 dark:text-slate-100 shadow-xl shadow-slate-100 dark:shadow-none group"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Chrome className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />} 
              <span className="font-cairo text-lg">{lang === 'en' ? 'Continue with Google' : 'المتابعة باستخدام جوجل'}</span>
            </button>
            
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed px-4">
              {lang === 'en' 
                ? 'By continuing, you agree to our Terms of Service and Privacy Policy.' 
                : 'بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
