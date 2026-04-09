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
import { createLead } from '@/lib/backend-api';
import { localizePath } from '@/i18n/localizedPath';

export function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const [formData, setFormData] = useState({ fullName: '', phone: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus('loading');
      await createLead(formData);
      setStatus('success');
      setFormData({ fullName: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen-safe overflow-x-clip bg-mesh bg-[var(--app-bg)] text-[var(--app-text)] selection:bg-[var(--app-primary)] selection:text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--app-border)] bg-white/70 backdrop-blur-xl dark:bg-slate-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="h-11 w-11 overflow-hidden rounded-2xl shadow-xl shadow-[var(--app-primary)]/20 border-2 border-white group-hover:scale-105 transition-transform">
              <img
                src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg"
                alt="Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-black tracking-tighter sm:text-2xl">MK Academy</span>
          </div>

          <div className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)] md:flex">
            <a href="#about" className="transition-colors hover:text-[var(--app-primary)]">Biz haqimizda</a>
            <a href="#features" className="transition-colors hover:text-[var(--app-primary)]">Imkoniyatlar</a>
            <a href="#contact" className="transition-colors hover:text-[var(--app-primary)]">Bog&apos;lanish</a>
            <div className="h-4 w-px bg-[var(--app-border)]" />
            <button
              onClick={() => router.push(localizePath(locale, '/login'))}
              className="btn-premium bg-[var(--app-primary)] px-6 py-2.5 text-white shadow-lg shadow-[var(--app-primary)]/20 border-none"
            >
              <LogIn size={16} className="mr-2" /> Tizimga kirish
            </button>
          </div>

          <button
            onClick={() => router.push(localizePath(locale, '/login'))}
            className="app-touch flex items-center justify-center rounded-2xl bg-[var(--app-primary)] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white md:hidden shadow-lg shadow-[var(--app-primary)]/20"
          >
            <LogIn size={14} className="mr-2" />
            Kirish
          </button>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[85svh] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center sm:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--app-primary)] opacity-10 blur-[120px] sm:h-[700px] sm:w-[700px]" />

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-2 shadow-sm transition-all hover:border-[var(--app-primary)]/20 cursor-default">
          <Sparkles size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--app-primary-dark)]">Ingliz tilini biz bilan o&apos;rganing</span>
        </div>

        <h1 className="mb-8 text-5xl font-black leading-none tracking-tighter sm:text-7xl md:text-9xl">
          English <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-dark)] bg-clip-text text-transparent">Mastery</span>
        </h1>

        <p className="mb-12 max-w-2xl text-base font-bold text-[var(--app-muted)] sm:text-lg md:text-xl leading-relaxed">
          MK Academy - CEFR standarti bo&apos;yicha ingliz tilini professional darajagacha o&apos;rganish uchun mo&apos;ljallangan premium platforma.
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push(localizePath(locale, '/login'))}
            className="btn-premium bg-[var(--app-primary)] text-white px-10 py-5 text-base shadow-2xl shadow-[var(--app-primary)]/30 group border-none"
          >
            Boshlash <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="app-touch app-card border-none bg-white flex items-center justify-center px-10 py-5 text-base font-black uppercase tracking-widest text-[var(--app-text)] transition-all hover:bg-gray-50 active:scale-95"
          >
            Batafsil
          </button>
        </div>
      </section>

      <section id="about" className="border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/50 px-6 py-20 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-24">
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <h2 className="mb-8 flex items-center gap-4 text-3xl font-black md:text-5xl tracking-tighter uppercase">
              <Info className="text-[var(--app-primary)]" size={36} /> Biz Haqimizda
            </h2>
            <p className="mb-8 text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg">
              MK Academy - ingliz tilini noldan C2 darajagacha o&apos;rgatishga ixtisoslashgan ta&apos;lim platformasi.
              Biz CEFR standartiga asoslangan darsliklar va interaktiv testlar orqali har bir o&apos;quvchiga individual yondashamiz.
            </p>
            <ul className="space-y-5">
              {[
                'CEFR darajalariga moslashgan darslar (A1 - C2)',
                'IELTS va General English tayyorgarlik',
                "So'z boyligini SM-2 algoritmi bilan mustahkamlash",
                "Guruh ichida do'stlar bilan raqobatlashish",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-black text-[var(--app-text)] uppercase tracking-tight">
                  <div className="h-2 w-2 rounded-full bg-[var(--app-primary)]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative animate-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 scale-105 rotate-3 rounded-[3.5rem] bg-gradient-to-tr from-[var(--app-primary)] to-[var(--app-primary-dark)] opacity-20 blur-2xl" />
            <div className="relative app-card p-8 sm:p-10 bg-white/80 backdrop-blur-xl border-white">
              <div className="mb-8 flex items-center gap-5 border-b border-gray-100 pb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">CEFR English Platform</h3>
                  <p className="text-[10px] font-black text-[var(--app-muted)] uppercase tracking-widest mt-1">A1 dan C2 gacha - High Quality</p>
                </div>
              </div>
              <p className="text-sm font-bold italic text-[var(--app-muted)] leading-relaxed">
                &quot;Har bir o&apos;quvchi o&apos;z darajasiga mos darslarni oladi, testlar orqali bilimini tekshiradi va so&apos;z boyligini
                kundalik mashqlar bilan mustahkamlaydi.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:py-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-6xl tracking-tighter uppercase">Imkoniyatlar</h2>
          <p className="mx-auto max-w-2xl text-[10px] font-black text-[var(--app-muted)] uppercase tracking-[0.3em]">
            Eng samarali o&apos;rganish tizimi
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: 'Grammar', desc: "CEFR darajasiga mos grammatika darslari" },
            { icon: Headphones, title: 'Listening', desc: 'Audio materiallar va tushunish mashqlari' },
            { icon: PenTool, title: 'Writing', desc: "Nutqni rivojlantirish vazifalari" },
            { icon: MessageCircle, title: 'Vocabulary', desc: "SM-2 algoritmi bilan mustahkamlash" },
            { icon: Trophy, title: 'Gamification', desc: 'XP va leaderboard tizimi' },
            { icon: Users, title: 'Guruhlar', desc: "O'qituvchi bilan birga o'rganish" },
            { icon: Globe, title: 'IELTS Exams', desc: 'Mock exam imkoniyatlari' },
            { icon: GraduationCap, title: 'Progress', desc: "Real-time natijalar tahlili" },
          ].map((feature, i) => (
            <div
              key={i}
              className="app-card p-8 group cursor-default active:scale-[0.98]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-soft)] text-[var(--app-primary)] transition-all group-hover:bg-[var(--app-primary)] group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
                <feature.icon size={26} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-lg font-black tracking-tight">{feature.title}</h3>
              <p className="text-xs font-bold text-[var(--app-muted)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-32">
        <div className="mb-12">
          <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
            <Mail size={36} />
          </div>
          <h2 className="mb-4 text-4xl font-black tracking-tight md:text-6xl uppercase">Sizni kutamiz</h2>
          <p className="text-base font-bold text-[var(--app-muted)] uppercase tracking-tight">
            Ma&apos;lumotlaringizni qoldiring va biz bog&apos;lanamiz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="app-card p-8 sm:p-12 text-left bg-white/60 backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">To&apos;liq ism</label>
              <input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                type="text"
                className="w-full rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all focus:border-[var(--app-primary)] focus:outline-none shadow-sm"
                placeholder="Ali Valiyev"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">Telefon raqam</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                type="tel"
                className="w-full rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all focus:border-[var(--app-primary)] focus:outline-none shadow-sm"
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">Xabar (ixtiyoriy)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all focus:border-[var(--app-primary)] focus:outline-none shadow-sm"
                placeholder="Qaysi kursga qiziqyapsiz?"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-premium w-full bg-[var(--app-primary)] py-5 text-white shadow-2xl shadow-[var(--app-primary)]/30 border-none mt-4"
            >
              {status === 'loading' ? 'Yuborilmoqda...' : "So'rov yuborish"}
            </button>
          </div>

          {status === 'success' && (
            <p className="mt-6 text-center text-xs font-black text-emerald-500 uppercase tracking-widest">Muvaffaqiyatli yuborildi!</p>
          )}
          {status === 'error' && (
            <p className="mt-6 text-center text-xs font-black text-red-500 uppercase tracking-widest">Xatolik yuz berdi!</p>
          )}
        </form>
      </section>

      <footer className="border-t border-[var(--app-border)] bg-white/50 px-6 py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">© 2026 MK Academy. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>

  );
}

