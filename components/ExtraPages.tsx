
import React from 'react';
import { BrainCircuit, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';
import { Language } from '../translations';

interface ExtraPagesProps {
  type: 'how' | 'privacy' | 'help';
  lang: Language;
}

const ExtraPages: React.FC<ExtraPagesProps> = ({ type, lang }) => {
  if (type === 'how') {
    const items = lang === 'en' ? [
      { title: "Market Price Prediction", desc: "Our engine analyzes historical datasets and real-time signals.", icon: "01" },
      { title: "Neural Budget Distribution", desc: "Custom optimization model that adjusts to family size.", icon: "02" },
      { title: "Risk-Adaptive Investing", desc: "Filters thousands of assets to show safe products.", icon: "03" },
      { title: "Behavioral Analysis", desc: "Detecting waste patterns through anonymized data.", icon: "04" }
    ] : [
      { title: "توقع أسعار السوق", desc: "يحلل محركنا مجموعات البيانات التاريخية والإشارات الحية.", icon: "٠١" },
      { title: "التوزيع العصبي للميزانية", desc: "نموذج تحسين مخصص يتكيف مع حجم الأسرة.", icon: "٠٢" },
      { title: "استثمار متكيف مع المخاطر", desc: "يصفي آلاف الأصول لعرض المنتجات الآمنة فقط.", icon: "٠٣" },
      { title: "التحليل السلوكي", desc: "كشف أنماط الهدر من خلال مقارنة البيانات مجهولة المصدر.", icon: "٠٤" }
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 font-Cairo">
            {lang === 'en' ? 'How Modaber Works' : 'كيف يعمل مُدَبَّر'}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-all">
              <span className="text-5xl font-black text-slate-100 dark:text-slate-800 block">{item.icon}</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-Cairo">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'help') {
    const faqs = lang === 'en' ? [
      { q: "How do I update my salary?", a: "Go to the Profile section and click 'Edit Profile' to update your financial details." },
      { q: "Is my data shared with anyone?", a: "No, your data is processed locally and only used to generate your personal financial roadmap." },
      { q: "How often should I recalculate?", a: "We recommend recalculating whenever your income or fixed expenses change significantly." },
      { q: "What is the Financial IQ?", a: "It's a score based on your savings rate, expense management, and adherence to AI suggestions." }
    ] : [
      { q: "كيف يمكنني تحديث راتبي؟", a: "اذهب إلى قسم الملف الشخصي وانقر على 'تعديل الملف' لتحديث بياناتك المالية." },
      { q: "هل تتم مشاركة بياناتي مع أي شخص؟", a: "لا، يتم معالجة بياناتك محلياً وتستخدم فقط لإنشاء خارطة الطريق المالية الخاصة بك." },
      { q: "كم مرة يجب علي إعادة الحساب؟", a: "نوصي بإعادة الحساب كلما تغير دخلك أو مصاريفك الثابتة بشكل كبير." },
      { q: "ما هو معدل الذكاء المالي؟", a: "هو تقييم يعتمد على معدل ادخارك، وإدارة مصاريفك، ومدى التزامك باقتراحات النظام." }
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 font-Cairo">
            {lang === 'en' ? 'Help & Support' : 'المساعدة والدعم'}
          </h1>
        </div>

        <div className="grid gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-Cairo flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                {faq.q}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm pl-5 rtl:pl-0 rtl:pr-5">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 dark:bg-emerald-900/20 p-10 rounded-[3rem] text-white text-center space-y-6">
          <h3 className="text-2xl font-black font-Cairo">{lang === 'en' ? 'Still need help?' : 'هل ما زلت بحاجة للمساعدة؟'}</h3>
          <p className="text-slate-400">
            {lang === 'en' ? 'Contact our support team anytime at:' : 'تواصل مع فريق الدعم في أي وقت على:'}
            <br />
            <span className="text-emerald-400 font-bold">support@modaber.ai</span>
          </p>
          <a 
            href="mailto:support@modaber.ai"
            className="inline-block px-8 py-4 bg-emerald-600 rounded-2xl font-bold hover:bg-emerald-500 transition-all"
          >
            {lang === 'en' ? 'Contact Support' : 'تواصل معنا'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="bg-emerald-600 p-12 rounded-[48px] text-white">
        <ShieldCheck className="w-16 h-16 mb-6 opacity-80" />
        <h1 className="text-4xl font-black mb-4 font-Cairo">
          {lang === 'en' ? 'Privacy & Data Security' : 'الخصوصية وأمن البيانات'}
        </h1>
        <p className="text-emerald-100 leading-relaxed max-w-lg">
          {lang === 'en' ? 'Your financial data is private. We use bank-grade encryption.' : 'بياناتك المالية خاصة. نحن نستخدم تشفيراً بمستوى البنوك.'}
        </p>
      </div>

      <div className="space-y-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </div>
            <p className="font-bold text-slate-700 dark:text-slate-300 font-Cairo">
              {lang === 'en' ? 'Bank-grade security protocol active.' : 'بروتوكول أمان بمستوى بنكي نشط.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraPages;
