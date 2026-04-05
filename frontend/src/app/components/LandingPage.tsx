'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Mail, LogIn, UserPlus, Info, BookOpen, GraduationCap, Trophy, Users, Globe, Headphones, PenTool, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

export function LandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', phone: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus('loading');
      await api.post('/leads', formData);
      setStatus('success');
      setFormData({ fullName: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#3D855A] selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3D855A] to-emerald-400 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(61,133,90,0.5)]">
              MK
            </div>
            <span className="font-bold text-xl tracking-wide">Academy</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#about" className="hover:text-white transition-colors">Biz haqimizda</a>
            <a href="#features" className="hover:text-white transition-colors">Imkoniyatlar</a>
            <a href="#contact" className="hover:text-white transition-colors">Bog&apos;lanish</a>
            <div className="w-px h-4 bg-white/20"></div>
            <button onClick={() => router.push('/login')} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 font-bold">
              <LogIn size={16} /> Tizimga kirish
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center min-h-[90vh] justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3D855A] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up">
          <Sparkles size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-100">Ingliz tilini professional darajada o&apos;rganing</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          English <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#3D855A]">
            Mastery
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          MK Academy — ingliz tilini CEFR standarti (A1 → C2) bo&apos;yicha o&apos;rganish uchun mo&apos;ljallangan 
          zamonaviy platforma. Grammar, Vocabulary, Reading, Listening — hammasi bir joyda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => router.push('/login')} className="flex items-center justify-center gap-2 bg-[#3D855A] hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(61,133,90,0.6)]">
            Tizimga kirish <ArrowRight size={20} />
          </button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
            Batafsil ma&apos;lumot
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center gap-4">
              <Info className="text-[#3D855A]" size={40} /> Biz Haqimizda
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              MK Academy — ingliz tilini noldan C2 darajagacha o&apos;rgatishga ixtisoslashgan ta&apos;lim platformasi. 
              Biz CEFR xalqaro standartiga asoslangan darsliklar, interaktiv testlar va so&apos;z boyligini 
              oshirish tizimi orqali har bir o&apos;quvchiga individual yondashamiz.
            </p>
            <ul className="space-y-4">
              {[
                "CEFR darajalariga moslashgan darslar (A1 → C2)",
                "IELTS & General English tayyorgarlik",
                "So'z boyligini SM-2 algoritmi bilan mustahkamlash",
                "Guruh ichida do'stlar bilan raqobatlashish",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-emerald-100">
                  <ShieldCheck className="text-[#3D855A] flex-shrink-0" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#3D855A] to-emerald-500 rounded-3xl transform rotate-3 scale-105 opacity-50 blur-xl"></div>
             <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
               <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                 <div className="w-12 h-12 rounded-full bg-[#3D855A]/20 flex items-center justify-center text-[#3D855A]">
                   <GraduationCap className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl">CEFR English Platform</h3>
                   <p className="text-sm text-gray-500">A1 dan C2 gacha — professional daraja</p>
                 </div>
               </div>
               <p className="text-sm text-gray-400 italic">
                 &quot;Har bir o&apos;quvchi o&apos;z darajasiga mos darslarni oladi, testlar orqali bilimini tekshiradi 
                 va so&apos;z boyligini kundalik mashqlar bilan mustahkamlaydi.&quot;
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Platforma imkoniyatlari</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Ingliz tilini o&apos;rganishning eng samarali usullari bir joyda jamlangan</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: "Grammar & Reading", desc: "CEFR darajasiga mos grammatika darslari va o'qish mashqlari" },
            { icon: Headphones, title: "Listening", desc: "Audio materiallar va tinglab tushunish mashqlari" },
            { icon: PenTool, title: "Writing & Speaking", desc: "Yozma va og'zaki nutqni rivojlantirish vazifalari" },
            { icon: MessageCircle, title: "Vocabulary", desc: "SM-2 algoritmi asosida so'z boyligini mustahkamlash" },
            { icon: Trophy, title: "Gamification", desc: "XP, yutuqlar va leaderboard orqali motivatsiya" },
            { icon: Users, title: "Guruhlar", desc: "O'qituvchi bilan guruhda birga o'rganish" },
            { icon: Globe, title: "IELTS & Exams", desc: "Mock exam va placement test imkoniyatlari" },
            { icon: GraduationCap, title: "Progress Tracking", desc: "Shaxsiy rivojlanishni real-time kuzatish" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-default group">
              <feature.icon className="text-[#3D855A] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <Mail size={48} className="mx-auto text-[#3D855A] mb-6" />
        <h2 className="text-4xl font-bold mb-4">O&apos;qish uchun so&apos;rov qoldirish</h2>
        <p className="text-gray-400 mb-10">Akademiyamizda o&apos;qishni hohlaysizmi? Ma&apos;lumotlaringizni qoldiring va biz siz bilan bog&apos;lanamiz.</p>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left space-y-6 backdrop-blur-sm">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To&apos;liq ismingiz</label>
            <input 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              type="text" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3D855A] transition-colors"
              placeholder="Ali Valiyev"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefon raqamingiz</label>
            <input 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              type="tel" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3D855A] transition-colors"
              placeholder="+998 90 123 45 67"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Xabaringiz (ixtiyoriy)</label>
            <textarea 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3D855A] transition-colors resize-none"
              placeholder="Qaysi kursga qiziqyapsiz? (IELTS, General English, va h.k.)"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full bg-[#3D855A] hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Yuborilmoqda...' : 'So\'rov yuborish'}
          </button>

          {status === 'success' && (
            <p className="text-emerald-400 text-sm text-center font-medium my-2">Muvaffaqiyatli yuborildi! Adminlarimiz tez orada bog&apos;lanishadi.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center font-medium my-2">Xatolik yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.</p>
          )}
        </form>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-12 mb-20 md:mb-0">
        <p>© 2026 MK Academy — Ingliz tili o&apos;rganish platformasi. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
