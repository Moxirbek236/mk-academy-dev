'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Sparkles,
  ArrowRight,
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
  MapPin,
  PhoneCall,
  Clock3,
  Send,
  HelpCircle,
  Building2,
  Star,
} from 'lucide-react';
import { createLead } from '@/lib/backend-api';
import { usePublishedLeadQuestions } from '@/hooks/usePublishedLeadQuestions';
import { localizePath } from '@/i18n/localizedPath';
import { useCenterBranding } from './branding/CenterBrandingProvider';

const TEAM_MEMBERS = [
  {
    name: 'Maqsud Aliyev',
    role: 'IELTS Mentor',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    focus: 'Reading va Writing strategiyalari',
  },
  {
    name: 'Nigina Tursunova',
    role: 'Speaking Coach',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80',
    focus: 'Fluency, pronunciation va confidence',
  },
  {
    name: 'Dilshod Karimov',
    role: 'Academic Coordinator',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    focus: 'Guruhlar, natijalar va o\'quv reja',
  },
];

const COURSE_TRACKS = [
  {
    title: 'General English',
    level: 'A1 - B2',
    desc: "Noldan boshlab mustahkam grammatika, so'z boyligi va speaking asoslari.",
  },
  {
    title: 'IELTS Preparation',
    level: 'B1 - C1',
    desc: "IELTS reading, listening, writing va speaking bo'yicha intensiv tayyorgarlik.",
  },
  {
    title: 'Speaking Club Pro',
    level: 'B1+',
    desc: 'Real suhbat, debate, presentation va IELTS speaking formatlari.',
  },
];

const DEFAULT_PUBLIC_QUESTIONS = [
  {
    id: 1,
    fullName: 'MK Academy',
    message: "Qaysi darajadan boshlashimni qanday bilaman?",
    answer:
      'Avval qisqa placement test topshirasiz. Natijaga qarab sizga mos guruh va kurs tavsiya qilinadi.',
  },
  {
    id: 2,
    fullName: 'MK Academy',
    message: "IELTS kursi qancha davom etadi?",
    answer:
      "Odatda 3-6 oy davom etadi. Aniq muddat boshlang'ich darajangiz va maqsad ballingizga bog'liq.",
  },
  {
    id: 3,
    fullName: 'MK Academy',
    message: "Darslar online ham bormi?",
    answer:
      'Ha, ayrim guruhlar online va hybrid formatda ochiladi. Jadval admin bilan kelishiladi.',
  },
];

export function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const { centerBranding } = useCenterBranding();
  const { data: publishedQuestions } = usePublishedLeadQuestions();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    message: '',
  });
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

  const visibleQuestions = publishedQuestions.length > 0 ? publishedQuestions : DEFAULT_PUBLIC_QUESTIONS;

  return (
    <div className="min-h-screen-safe overflow-x-clip bg-mesh bg-[var(--app-bg)] text-[var(--app-text)] selection:bg-[var(--app-primary)] selection:text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--app-border)] bg-white/70 backdrop-blur-xl dark:bg-slate-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20">
          <div className="group flex cursor-pointer items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-2xl border-2 border-white shadow-xl shadow-[var(--app-primary)]/20 transition-transform group-hover:scale-105">
              <img
                src={centerBranding.logoUrl}
                alt={centerBranding.shortName}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-black tracking-tighter sm:text-2xl">
              {centerBranding.shortName}
            </span>
          </div>

          <div className="hidden items-center gap-5 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)] md:flex">
            <a
              href="#about"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Biz haqimizda
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Imkoniyatlar
            </a>
            <a
              href="#team"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Jamoa
            </a>
            <a
              href="#questions"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Savollar
            </a>
            <a
              href="#address"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Manzil
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              Bog&apos;lanish
            </a>
            <div className="h-4 w-px bg-[var(--app-border)]" />
            <button
              onClick={() => router.push(localizePath(locale, '/login'))}
              className="btn-premium border-none bg-[var(--app-primary)] px-6 py-2.5 text-white shadow-lg shadow-[var(--app-primary)]/20"
            >
              <LogIn size={16} className="mr-2" /> Tizimga kirish
            </button>
          </div>

          <button
            onClick={() => router.push(localizePath(locale, '/login'))}
            className="app-touch flex items-center justify-center rounded-2xl bg-[var(--app-primary)] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--app-primary)]/20 md:hidden"
          >
            <LogIn size={14} className="mr-2" />
            Kirish
          </button>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[85svh] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center sm:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--app-primary)] opacity-10 blur-[120px] sm:h-[700px] sm:w-[700px]" />

        <div className="mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-2 shadow-sm transition-all hover:border-[var(--app-primary)]/20">
          <Sparkles size={16} className="animate-pulse text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--app-primary-dark)]">
            Ingliz tilini biz bilan o&apos;rganing
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-black leading-none tracking-tighter sm:text-7xl md:text-9xl">
          English <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-dark)] bg-clip-text text-transparent">
            Mastery
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg md:text-xl">
          {centerBranding.description}
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push(localizePath(locale, '/login'))}
            className="btn-premium group border-none bg-[var(--app-primary)] px-10 py-5 text-base text-white shadow-2xl shadow-[var(--app-primary)]/30"
          >
            Boshlash{' '}
            <ArrowRight
              size={20}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={() =>
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="app-touch app-card flex items-center justify-center border-none bg-white px-10 py-5 text-base font-black uppercase tracking-widest text-[var(--app-text)] transition-all hover:bg-gray-50 active:scale-95"
          >
            Batafsil
          </button>
          <button
            onClick={() => router.push(localizePath(locale, '/public-exam'))}
            className="app-touch app-card flex items-center justify-center border-none bg-[var(--app-surface)] px-10 py-5 text-base font-black uppercase tracking-widest text-[var(--app-primary)] transition-all hover:bg-[var(--app-surface-soft)] active:scale-95"
          >
            Open Exam
          </button>
        </div>
      </section>

      <section
        id="about"
        className="border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/50 px-6 py-20 sm:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-24">
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <h2 className="mb-8 flex items-center gap-4 text-3xl font-black uppercase tracking-tighter md:text-5xl">
              <Info className="text-[var(--app-primary)]" size={36} /> Biz
              Haqimizda
            </h2>
            <p className="mb-8 text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg">
              {centerBranding.name} - ingliz tilini noldan C2 darajagacha
              o&apos;rgatishga ixtisoslashgan ta&apos;lim platformasi. Biz CEFR
              standartiga asoslangan darsliklar va interaktiv testlar orqali har
              bir o&apos;quvchiga individual yondashamiz.
            </p>
            <ul className="space-y-5">
              {[
                'CEFR darajalariga moslashgan darslar (A1 - C2)',
                'IELTS va General English tayyorgarlik',
                "So'z boyligini SM-2 algoritmi bilan mustahkamlash",
                "Guruh ichida do'stlar bilan raqobatlashish",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-sm font-black uppercase tracking-tight text-[var(--app-text)]"
                >
                  <div className="h-2 w-2 rounded-full bg-[var(--app-primary)]" />{' '}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative animate-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 scale-105 rotate-3 rounded-[3.5rem] bg-gradient-to-tr from-[var(--app-primary)] to-[var(--app-primary-dark)] opacity-20 blur-2xl" />
            <div className="relative app-card border-white bg-white/80 p-8 backdrop-blur-xl sm:p-10">
              <div className="mb-8 flex items-center gap-5 border-b border-gray-100 pb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">
                    CEFR English Platform
                  </h3>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    A1 dan C2 gacha - High Quality
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold italic leading-relaxed text-[var(--app-muted)]">
                &quot;Har bir o&apos;quvchi o&apos;z darajasiga mos darslarni
                oladi, testlar orqali bilimini tekshiradi va so&apos;z boyligini
                kundalik mashqlar bilan mustahkamlaydi.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-20 sm:py-32"
      >
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter md:text-6xl">
            Imkoniyatlar
          </h2>
          <p className="mx-auto max-w-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-muted)]">
            Eng samarali o&apos;rganish tizimi
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              title: 'Grammar',
              desc: "CEFR darajasiga mos grammatika darslari",
            },
            {
              icon: Headphones,
              title: 'Listening',
              desc: 'Audio materiallar va tushunish mashqlari',
            },
            {
              icon: PenTool,
              title: 'Writing',
              desc: "Nutqni rivojlantirish vazifalari",
            },
            {
              icon: MessageCircle,
              title: 'Vocabulary',
              desc: "SM-2 algoritmi bilan mustahkamlash",
            },
            {
              icon: Trophy,
              title: 'Gamification',
              desc: 'XP va leaderboard tizimi',
            },
            {
              icon: Users,
              title: 'Guruhlar',
              desc: "O'qituvchi bilan birga o'rganish",
            },
            {
              icon: Globe,
              title: 'IELTS Exams',
              desc: 'Mock exam imkoniyatlari',
            },
            {
              icon: GraduationCap,
              title: 'Progress',
              desc: 'Real-time natijalar tahlili',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="app-card group cursor-default p-8 active:scale-[0.98]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-soft)] text-[var(--app-primary)] transition-all group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[var(--app-primary)] group-hover:text-white">
                <feature.icon size={26} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-lg font-black tracking-tight">
                {feature.title}
              </h3>
              <p className="text-xs font-bold leading-relaxed text-[var(--app-muted)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="courses"
        className="border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/50 px-6 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                Kurslar
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">
                Sizga mos yo&apos;nalish
              </h2>
            </div>
            <button
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-premium border-none bg-[var(--app-primary)] px-6 py-3 text-white shadow-lg shadow-[var(--app-primary)]/20"
            >
              Savol berish <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {COURSE_TRACKS.map((course) => (
              <div key={course.title} className="app-card p-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="rounded-[18px] bg-[var(--app-primary)]/10 p-3 text-[var(--app-primary)]">
                    <BookOpen size={24} strokeWidth={2.5} />
                  </div>
                  <span className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[var(--app-text)]">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="mx-auto max-w-7xl px-6 py-20 sm:py-32">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
            O&apos;quv markaz jamoasi
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tighter md:text-6xl">
            Mentorlar va jamoa
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <article key={member.name} className="app-card overflow-hidden p-0">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[var(--app-primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)]">
                    {member.role}
                  </span>
                  <Star size={18} className="text-amber-400" fill="currentColor" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-[var(--app-text)]">
                  {member.name}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
                  {member.focus}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="questions"
        className="border-y border-[var(--app-border)] bg-white/60 px-6 py-20 dark:bg-slate-900/40 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                Kurs haqida savollar
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">
                Admin javob bergan savollar
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
              <HelpCircle size={15} className="text-[var(--app-primary)]" />
              {visibleQuestions.length} ta javob
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {visibleQuestions.map((item) => (
              <article key={item.id} className="app-card p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--app-primary)]">
                  Savol
                </p>
                <h3 className="mt-3 text-lg font-black leading-snug text-[var(--app-text)]">
                  {item.message}
                </h3>
                <div className="mt-5 rounded-[20px] bg-[var(--app-surface-soft)] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
                    Admin javobi
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--app-text)]">
                    {item.answer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="address" className="mx-auto max-w-7xl px-6 py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
              O&apos;quv markaz manzili
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tighter md:text-5xl">
              Biz bilan yaqinroq tanishing
            </h2>
            <p className="mt-5 max-w-xl text-base font-bold leading-relaxed text-[var(--app-muted)]">
              Filialga kelib kurslar, guruhlar jadvali va daraja aniqlash testi
              haqida administrator bilan gaplashishingiz mumkin.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="app-card p-6">
              <MapPin className="mb-5 text-[var(--app-primary)]" size={28} />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Manzil
              </p>
              <p className="mt-2 text-base font-black leading-snug text-[var(--app-text)]">
                Toshkent shahri, O&apos;zbekiston
              </p>
            </div>
            <div className="app-card p-6">
              <PhoneCall className="mb-5 text-[var(--app-primary)]" size={28} />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Aloqa
              </p>
              <p className="mt-2 text-base font-black leading-snug text-[var(--app-text)]">
                Landing form orqali
              </p>
            </div>
            <div className="app-card p-6">
              <Clock3 className="mb-5 text-[var(--app-primary)]" size={28} />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Ish vaqti
              </p>
              <p className="mt-2 text-base font-black leading-snug text-[var(--app-text)]">
                Dushanba - Shanba, 09:00 - 20:00
              </p>
            </div>
            <div className="app-card p-6">
              <Building2 className="mb-5 text-[var(--app-primary)]" size={28} />
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Format
              </p>
              <p className="mt-2 text-base font-black leading-snug text-[var(--app-text)]">
                Offline, online va hybrid guruhlar
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-32"
      >
        <div className="mb-12">
          <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
            <Send size={36} />
          </div>
          <h2 className="mb-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            Savolingizni yuboring
          </h2>
          <p className="text-base font-bold uppercase tracking-tight text-[var(--app-muted)]">
            Kurs, guruh yoki jadval haqida yozing, admin javob beradi
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card bg-white/60 p-8 text-left backdrop-blur-xl sm:p-12"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                To&apos;liq ism
              </label>
              <input
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                type="text"
                className="w-full rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
                placeholder="Ali Valiyev"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Telefon raqam
              </label>
              <input
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                type="tel"
                className="w-full rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                Kurs haqida savol
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={3}
                className="w-full resize-none rounded-[20px] border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
                placeholder="IELTS kursi qachon boshlanadi?"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-premium mt-4 w-full border-none bg-[var(--app-primary)] py-5 text-white shadow-2xl shadow-[var(--app-primary)]/30"
            >
              {status === 'loading' ? 'Yuborilmoqda...' : "Savol yuborish"}
            </button>
          </div>

          {status === 'success' && (
            <p className="mt-6 text-center text-xs font-black uppercase tracking-widest text-blue-500">
              Savolingiz adminga yuborildi!
            </p>
          )}
          {status === 'error' && (
            <p className="mt-6 text-center text-xs font-black uppercase tracking-widest text-red-500">
              Xatolik yuz berdi!
            </p>
          )}
        </form>
      </section>

      <footer className="border-t border-[var(--app-border)] bg-white/50 px-6 py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
          {`(c) 2026 ${centerBranding.name}. Barcha huquqlar himoyalangan.`}
        </p>
      </footer>
    </div>
  );
}
