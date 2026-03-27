
import React, { useState, useRef } from 'react';
import { UserProfile, Language, DailyExpense } from '../types';
import { translations } from '../translations';
import { 
  Plus, 
  Receipt, 
  Utensils, 
  Coffee, 
  Stethoscope, 
  Plane, 
  Mic, 
  Camera, 
  Upload, 
  Loader2,
  Trash2,
  ArrowLeft,
  Edit3,
  XCircle
} from 'lucide-react';
import { processExpenseInput } from '../geminiService';

interface ExpensesProps {
  profile: UserProfile;
  lang: Language;
  onUpdate: (profile: UserProfile) => void;
}

type InputMethod = 'manual' | 'voice' | 'upload' | 'camera' | null;

const Expenses: React.FC<ExpensesProps> = ({ profile, lang, onUpdate }) => {
  const t = translations[lang];
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'food' | 'cafe' | 'medical' | 'travel' | 'other'>('food');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleAddExpense = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!expenseAmount || isNaN(Number(expenseAmount))) return;

    const newExpense: DailyExpense = {
      id: Date.now().toString(),
      amount: Number(expenseAmount),
      category: expenseCategory,
      description: expenseDesc,
      date: expenseDate,
    };

    const updatedProfile = {
      ...profile,
      dailyExpenses: [newExpense, ...(profile.dailyExpenses || [])]
    };

    onUpdate(updatedProfile);
    setExpenseAmount('');
    setExpenseDesc('');
    setInputMethod(null);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedProfile = {
      ...profile,
      dailyExpenses: (profile.dailyExpenses || []).filter(e => e.id !== id)
    };
    onUpdate(updatedProfile);
  };

  const categoryIcons = {
    food: Utensils,
    cafe: Coffee,
    medical: Stethoscope,
    travel: Plane,
    other: Receipt
  };

  const categoryLabels = {
    food: t.foodAndDrinks,
    cafe: t.cafe,
    medical: t.medicalExpense,
    travel: t.travelExpense,
    other: t.otherExpense
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await processExpenseInput({
        type: 'image',
        data: base64.split(',')[1],
        mimeType: file.type
      }, lang);

      if (result) {
        setExpenseAmount(result.amount.toString());
        setExpenseCategory(result.category as any);
        setExpenseDesc(result.description);
        setInputMethod('manual');
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        try {
          const base64 = await fileToBase64(audioBlob);
          const result = await processExpenseInput({
            type: 'audio',
            data: base64.split(',')[1],
            mimeType: 'audio/webm'
          }, lang);

          if (result) {
            setExpenseAmount(result.amount.toString());
            setExpenseCategory(result.category as any);
            setExpenseDesc(result.description);
            setInputMethod('manual');
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          setErrorMessage(lang === 'en' ? 'Failed to process audio. Please try again.' : 'فشل في معالجة الصوت. يرجى المحاولة مرة أخرى.');
        } finally {
          setIsProcessing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error("Error starting recording:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMessage(lang === 'en' ? 'Microphone permission denied. Please enable it in your browser settings.' : 'تم رفض إذن الميكروفون. يرجى تفعيله من إعدادات المتصفح.');
      } else {
        setErrorMessage(lang === 'en' ? 'Could not start recording. Please check your microphone.' : 'تعذر بدء التسجيل. يرجى التحقق من الميكروفون.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-cairo">
            {t.expenses}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Manage and track your daily spending with AI assistance.' : 'إدارة وتتبع مصروفاتك اليومية بمساعدة الذكاء الاصطناعي.'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            {!inputMethod ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 font-cairo">{t.chooseInputMethod}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setInputMethod('manual')}
                    className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 transition-all flex flex-col items-center gap-3 group"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Edit3 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t.manualEntry}</span>
                  </button>

                  <button 
                    onClick={() => setInputMethod('voice')}
                    className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 transition-all flex flex-col items-center gap-3 group"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Mic className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t.recordVoice}</span>
                  </button>

                  <label className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 transition-all flex flex-col items-center gap-3 group cursor-pointer">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Camera className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t.takePhoto}</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { setInputMethod('camera'); handleFileUpload(e); }} />
                  </label>

                  <label className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 transition-all flex flex-col items-center gap-3 group cursor-pointer">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Upload className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t.uploadFile}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { setInputMethod('upload'); handleFileUpload(e); }} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-cairo">{t.addExpense}</h3>
                  <button 
                    onClick={() => setInputMethod(null)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    {t.backToSelection}
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-bold">{errorMessage}</span>
                  </div>
                )}

                {inputMethod === 'voice' && !isProcessing && (
                  <div className="mb-6">
                    <button 
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-full p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                        isRecording 
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <div className={`p-4 rounded-full ${isRecording ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                        <Mic className={`w-8 h-8 ${isRecording ? 'animate-pulse' : ''}`} />
                      </div>
                      <span className="font-bold uppercase tracking-widest">{isRecording ? t.stopRecording : t.startRecording}</span>
                    </button>
                  </div>
                )}

                {isProcessing && (
                  <div className="mb-6 p-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{t.aiProcessing}</span>
                  </div>
                )}

                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseAmount}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 font-bold outline-none focus:border-emerald-500 transition-colors"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{t.currency}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseCategory}</label>
                    <select 
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 font-bold outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="food">{t.foodAndDrinks}</option>
                      <option value="cafe">{t.cafe}</option>
                      <option value="medical">{t.medicalExpense}</option>
                      <option value="travel">{t.travelExpense}</option>
                      <option value="other">{t.otherExpense}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseDesc}</label>
                    <input 
                      type="text" 
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                      placeholder="..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t.expenseDate}</label>
                    <input 
                      type="date" 
                      required
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> {t.addExpense}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 font-cairo">{t.recentExpenses}</h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {profile.dailyExpenses && profile.dailyExpenses.length > 0 ? (
              profile.dailyExpenses.map((expense) => {
                const Icon = categoryIcons[expense.category] || Receipt;
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{categoryLabels[expense.category]}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>{expense.date}</span>
                          {expense.description && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                              <span>{expense.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-black text-lg text-slate-800 dark:text-slate-100">
                          {expense.amount} <span className="text-sm text-slate-500 dark:text-slate-400">{t.currency}</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                <Receipt className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">{t.noRecentExpenses}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
