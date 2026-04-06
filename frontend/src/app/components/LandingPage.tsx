'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  LogIn,
  Info,
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  Globe,
  Headphones,
  PenTool,
  MessageCircle,
} from 'lucide-react';
import api from '@/lib/api';

export function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const [formData, setFormData] = useState({ fullName: '', phone: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const localized = (path: string) => `/${locale}${path === '/' ? '' : path}`;

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
    <div className="min-h-screen-safe overflow-x-clip bg-[#F6FBF8] text-gray-900 selection:bg-[#3D855A] selection:text-white dark:bg-slate-950 dark:text-slate-100">
      <nav className="fixed top-0 z-50 w-full border-b border-[#DCEEE3] bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-safe sm:h-20 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-xl shadow-[0_0_20px_rgba(61,133,90,0.5)]">
              <img
                src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg"
                alt="Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-wide sm:text-xl">Academy</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-gray-500 dark:text-slate-300 md:flex">
            <a href="#about" className="transition-colors hover:text-[#3D855A]">Biz haqimizda</a>
            <a href="#features" className="transition-colors hover:text-[#3D855A]">Imkoniyatlar</a>
            <a href="#contact" className="transition-colors hover:text-[#3D855A]">Bog&apos;lanish</a>
            <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
            <button
              onClick={() => router.push(localized('/login'))}
              className="flex items-center gap-2 rounded-full bg-[#3D855A] px-5 py-2.5 font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600"
            >
              <LogIn size={16} /> Tizimga kirish
            </button>
          </div>

          <button
            onClick={() => router.push(localized('/login'))}
            className="app-touch inline-flex items-center gap-2 rounded-full bg-[#3D855A] px-4 py-2 text-xs font-black uppercase tracking-wide text-white md:hidden"
          >
            <LogIn size={14} />
            Kirish
          </button>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col items-center justify-center px-safe pb-16 pt-28 text-center sm:min-h-[86svh] sm:px-6 sm:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3D855A] opacity-20 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[150px]" />

        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DCEEE3] bg-white px-3 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:mb-8 sm:px-4 sm:py-2">
          <Sparkles size={16} className="text-emerald-400" />
          <span className="text-xs font-medium text-[#2D7B50] sm:text-sm">Ingliz tilini professional darajada o&apos;rganing</span>
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:mb-8 sm:text-6xl md:text-8xl">
          English <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-[#3D855A] bg-clip-text text-transparent">Mastery</span>
        </h1>

        <p className="mb-10 max-w-2xl text-sm text-gray-500 dark:text-slate-300 sm:mb-12 sm:text-lg md:text-xl">
          MK Academy - ingliz tilini CEFR standarti (A1 - C2) bo&apos;yicha o&apos;rganish uchun mo&apos;ljallangan zamonaviy platforma.
          Grammar, Vocabulary, Reading, Listening - hammasi bir joyda.
        </p>

        <div className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
          <button
            onClick={() => router.push(localized('/login'))}
            className="app-touch flex w-full items-center justify-center gap-2 rounded-full bg-[#3D855A] px-7 py-3.5 text-base font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(61,133,90,0.6)] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            Tizimga kirish <ArrowRight size={20} />
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="app-touch flex w-full items-center justify-center rounded-full border border-[#DCEEE3] bg-white px-7 py-3.5 text-base font-bold text-gray-900 transition-all hover:bg-[#EEF7F1] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            Batafsil ma&apos;lumot
          </button>
        </div>
      </section>

      <section id="about" className="border-y border-[#DCEEE3] bg-[#EEF7F1] px-safe py-16 dark:border-slate-700 dark:bg-slate-900/60 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold md:text-5xl">
              <Info className="text-[#3D855A]" size={36} /> Biz Haqimizda
            </h2>
            <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-slate-300 sm:text-lg">
              MK Academy - ingliz tilini noldan C2 darajagacha o&apos;rgatishga ixtisoslashgan ta&apos;lim platformasi.
              Biz CEFR standartiga asoslangan darsliklar, interaktiv testlar va so&apos;z boyligini oshirish tizimi
              orqali har bir o&apos;quvchiga individual yondashamiz.
            </p>
            <ul className="space-y-4">
              {[
                'CEFR darajalariga moslashgan darslar (A1 - C2)',
                'IELTS va General English tayyorgarlik',
                "So'z boyligini SM-2 algoritmi bilan mustahkamlash",
                "Guruh ichida do'stlar bilan raqobatlashish",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-slate-300">
                  <ShieldCheck className="shrink-0 text-[#3D855A]" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 scale-105 rotate-3 rounded-3xl bg-gradient-to-tr from-[#3D855A] to-emerald-500 opacity-50 blur-xl" />
            <div className="relative rounded-3xl border border-[#DCEEE3] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-[#EAF4EE] pb-6 dark:border-slate-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3D855A]/20 text-[#3D855A]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">CEFR English Platform</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">A1 dan C2 gacha - professional daraja</p>
                </div>
              </div>
              <p className="text-sm italic text-gray-500 dark:text-slate-400">
                &quot;Har bir o&apos;quvchi o&apos;z darajasiga mos darslarni oladi, testlar orqali bilimini tekshiradi va so&apos;z boyligini
                kundalik mashqlar bilan mustahkamlaydi.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-safe py-16 sm:px-6 sm:py-24">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">Platforma imkoniyatlari</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500 dark:text-slate-300 sm:text-lg">
            Ingliz tilini o&apos;rganishning eng samarali usullari bir joyda jamlangan
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: 'Grammar & Reading', desc: "CEFR darajasiga mos grammatika darslari va o'qish mashqlari" },
            { icon: Headphones, title: 'Listening', desc: 'Audio materiallar va tinglab tushunish mashqlari' },
            { icon: PenTool, title: 'Writing & Speaking', desc: "Yozma va og'zaki nutqni rivojlantirish vazifalari" },
            { icon: MessageCircle, title: 'Vocabulary', desc: "SM-2 algoritmi asosida so'z boyligini mustahkamlash" },
            { icon: Trophy, title: 'Gamification', desc: 'XP, yutuqlar va leaderboard orqali motivatsiya' },
            { icon: Users, title: 'Guruhlar', desc: "O'qituvchi bilan guruhda birga o'rganish" },
            { icon: Globe, title: 'IELTS & Exams', desc: 'Mock exam va placement test imkoniyatlari' },
            { icon: GraduationCap, title: 'Progress Tracking', desc: "Shaxsiy rivojlanishni real-time kuzatish" },
          ].map((feature, i) => (
            <div
              key={i}
              className="group cursor-default rounded-2xl border border-[#DCEEE3] bg-white p-5 shadow-sm transition-all hover:scale-[1.02] hover:bg-[#EEF7F1] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 sm:p-6"
            >
              <feature.icon className="mb-4 text-[#3D855A] transition-transform group-hover:scale-110" size={32} />
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-safe py-16 text-center sm:px-6 sm:py-24">
        <Mail size={48} className="mx-auto mb-6 text-[#3D855A]" />
        <h2 className="mb-4 text-4xl font-bold">O&apos;qish uchun so&apos;rov qoldirish</h2>
        <p className="mb-10 text-gray-500 dark:text-slate-300">
          Akademiyamizda o&apos;qishni hohlaysizmi? Ma&apos;lumotlaringizni qoldiring va biz siz bilan bog&apos;lanamiz.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[#DCEEE3] bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:space-y-6 sm:p-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-slate-300">To&apos;liq ismingiz</label>
            <input
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              type="text"
              className="w-full rounded-xl border border-[#DCEEE3] bg-[#F7FBF8] px-4 py-3 text-gray-900 transition-colors focus:border-[#3D855A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Ali Valiyev"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-slate-300">Telefon raqamingiz</label>
            <input
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              type="tel"
              className="w-full rounded-xl border border-[#DCEEE3] bg-[#F7FBF8] px-4 py-3 text-gray-900 transition-colors focus:border-[#3D855A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="+998 90 123 45 67"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-slate-300">Xabaringiz (ixtiyoriy)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#DCEEE3] bg-[#F7FBF8] px-4 py-3 text-gray-900 transition-colors focus:border-[#3D855A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Qaysi kursga qiziqyapsiz? (IELTS, General English va h.k.)"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-[#3D855A] py-4 font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-emerald-600"
          >
            {status === 'loading' ? 'Yuborilmoqda...' : "So'rov yuborish"}
          </button>

          {status === 'success' && (
            <p className="my-2 text-center text-sm font-medium text-emerald-500">Muvaffaqiyatli yuborildi! Adminlarimiz tez orada bog&apos;lanishadi.</p>
          )}
          {status === 'error' && (
            <p className="my-2 text-center text-sm font-medium text-red-500">Xatolik yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.</p>
          )}
        </form>
      </section>

      <footer className="mt-12 border-t border-[#DCEEE3] px-safe py-8 text-center text-sm text-gray-500 dark:border-slate-700 dark:text-slate-400">
        <p>© 2026 MK Academy - Ingliz tili o&apos;rganish platformasi. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}

