'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  GraduationCap,
  Headphones,
  HelpCircle,
  Info,
  LogIn,
  MapPin,
  MessageCircle,
  PenTool,
  PhoneCall,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { PublicLeadQuestion } from '@/lib/backend-api';
import { usePublishedLeadQuestions } from '@/hooks/usePublishedLeadQuestions';
import { localizePath } from '@/i18n/localizedPath';
import { useCenterBranding } from './branding/CenterBrandingProvider';

const LandingContactForm = dynamic(
  () => import('./landing/LandingContactForm').then((mod) => mod.LandingContactForm),
  {
    ssr: false,
    loading: () => <ContactFormSkeleton />,
  },
);

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type CourseTrack = {
  title: string;
  level: string;
  desc: string;
};

type AddressItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ProcessStep = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const NAV_LINKS = [
  { href: '#about', label: 'Biz haqimizda' },
  { href: '#features', label: 'Imkoniyatlar' },
  { href: '#courses', label: 'Kurslar' },
  { href: '#process', label: 'Jarayon' },
  { href: '#questions', label: 'Savollar' },
  { href: '#contact', label: "Bog'lanish" },
];

const HERO_STATS = [
  { value: 'CEFR', label: "daraja bo'yicha reja" },
  { value: 'Live', label: 'progress nazorati' },
  { value: 'Hybrid', label: 'online/offline format' },
];

const ABOUT_BULLETS = [
  "Daraja bo'yicha moslashgan o'quv reja",
  'Online, offline va hybrid guruhlar',
  'Vazifalar, testlar va natijalar nazorati',
  "O'quvchi va mentor uchun tezkor feedback",
];

const FEATURE_ITEMS: FeatureItem[] = [
  {
    icon: BookOpen,
    title: 'Grammar',
    desc: "Darajaga mos darslar va tartibli mavzular",
  },
  {
    icon: Headphones,
    title: 'Listening',
    desc: 'Audio, video va tushunish mashqlari',
  },
  {
    icon: PenTool,
    title: 'Writing',
    desc: "Yozma topshiriqlar va tekshiruv jarayoni",
  },
  {
    icon: MessageCircle,
    title: 'Vocabulary',
    desc: "So'zlarni takrorlash va mustahkamlash",
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
    title: 'Exams',
    desc: 'Test, imtihon va natijalar oqimi',
  },
  {
    icon: GraduationCap,
    title: 'Progress',
    desc: 'Real-time natijalar tahlili',
  },
];

const COURSE_TRACKS: CourseTrack[] = [
  {
    title: "Boshlang'ich yo'nalish",
    level: 'Start',
    desc: "Darajani aniqlash, asosiy mavzular va mustahkam o'quv ritmi.",
  },
  {
    title: 'Imtihon tayyorgarligi',
    level: 'Exam',
    desc: "Test formati, vazifalar, natija tahlili va individual tavsiyalar.",
  },
  {
    title: 'Amaliy mashgulotlar',
    level: 'Practice',
    desc: "Speaking, writing, vocabulary va real vaziyatlarda qo'llash.",
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: Info,
    title: 'Daraja aniqlanadi',
    desc: "Boshlanish nuqtasi aniqlanib, o'quvchi uchun mos yo'nalish tanlanadi.",
  },
  {
    icon: BookOpen,
    title: 'Reja tuziladi',
    desc: "Darslar, vazifalar va testlar bitta aniq yo'l xaritasiga joylanadi.",
  },
  {
    icon: GraduationCap,
    title: 'Progress kuzatiladi',
    desc: "Natijalar real vaqtga yaqin ko'rinadi va keyingi qadamlar aniqlashadi.",
  },
  {
    icon: Trophy,
    title: 'Natija mustahkamlanadi',
    desc: "Takrorlash, amaliyot va feedback orqali bilim uzoqroq saqlanadi.",
  },
];

const ADDRESS_ITEMS: AddressItem[] = [
  {
    icon: MapPin,
    label: 'Manzil',
    value: "Filial yoki online format admin bilan kelishiladi",
  },
  {
    icon: PhoneCall,
    label: 'Aloqa',
    value: 'Landing form orqali',
  },
  {
    icon: Clock3,
    label: 'Ish vaqti',
    value: 'Dushanba - Shanba, 09:00 - 20:00',
  },
  {
    icon: Building2,
    label: 'Format',
    value: 'Offline, online yoki hybrid guruhlar',
  },
];

function motionOrder(index: number): CSSProperties {
  return { '--motion-order': index } as CSSProperties;
}

export function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const { centerBranding } = useCenterBranding();
  const [questionsEnabled, setQuestionsEnabled] = useState(false);
  const { data: publishedQuestions, loading: questionsLoading } =
    usePublishedLeadQuestions(questionsEnabled);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuestionsEnabled(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const loginPath = useMemo(() => localizePath(locale, '/login'), [locale]);
  const goLogin = useCallback(() => router.push(loginPath), [loginPath, router]);
  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const visibleQuestions = useMemo(
    () => publishedQuestions.slice(0, 4),
    [publishedQuestions],
  );

  return (
    <div className="landing-shell motion-page min-h-screen-safe overflow-x-clip text-[var(--app-text)] selection:bg-[var(--app-primary)] selection:text-white">
      <nav className="landing-nav fixed top-0 z-50 w-full border-b border-[var(--app-border)] bg-white/78 backdrop-blur-xl dark:bg-slate-950/78">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6">
          <button
            type="button"
            onClick={goLogin}
            className="landing-brand motion-link group flex items-center gap-3 text-left"
            aria-label={`${centerBranding.shortName} login`}
          >
            <span className="landing-brand-mark relative h-11 w-11 overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-[var(--app-primary)]/14">
              <Image
                src={centerBranding.logoUrl}
                alt={centerBranding.shortName}
                fill
                priority
                sizes="44px"
                className="landing-media object-cover"
              />
            </span>
            <span className="landing-brand-text text-xl font-black sm:text-2xl">
              {centerBranding.shortName}
            </span>
          </button>

          <div className="landing-nav-list hidden items-center gap-5 text-xs font-black uppercase text-[var(--app-muted)] md:flex">
            {NAV_LINKS.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="landing-nav-link motion-link hover:text-[var(--app-primary)]"
                style={motionOrder(index)}
              >
                {item.label}
              </a>
            ))}
            <div className="h-5 w-px bg-[var(--app-border)]" />
            <button
              onClick={goLogin}
              className="btn-premium motion-button border-none bg-[var(--app-primary)] px-6 py-2.5 text-white shadow-lg shadow-[var(--app-primary)]/20"
            >
              <LogIn size={16} className="mr-2" /> Tizimga kirish
            </button>
          </div>

          <button
            onClick={goLogin}
            className="landing-primary-cta motion-button flex items-center justify-center rounded-2xl bg-[var(--app-primary)] px-5 py-2 text-xs font-black uppercase text-white shadow-lg shadow-[var(--app-primary)]/20 md:hidden"
          >
            <LogIn size={14} className="mr-2" />
            Kirish
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero mx-auto grid min-h-[88svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20">
          <div className="motion-section motion-stagger text-center lg:text-left">
            <div className="landing-pill mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/84 px-4 py-2 text-[var(--app-primary-dark)] shadow-sm" style={motionOrder(0)}>
              <Sparkles size={16} className="landing-icon-pulse text-blue-500" />
              <span className="text-xs font-black uppercase">
                Zamonaviy ta'lim tajribasi
              </span>
            </div>

            <h1 className="landing-title text-5xl font-black leading-[0.96] sm:text-6xl md:text-7xl" style={motionOrder(1)}>
              {centerBranding.shortName}
              <span className="landing-title-accent block bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-dark)] bg-clip-text text-transparent">
                Ta'lim platformasi
              </span>
            </h1>

            <p className="landing-copy mx-auto mt-7 max-w-2xl text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg lg:mx-0" style={motionOrder(2)}>
              {centerBranding.description}
            </p>

            <div className="landing-cta-row mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start" style={motionOrder(3)}>
              <button
                onClick={goLogin}
                className="landing-primary-cta btn-premium motion-button group border-none bg-[var(--app-primary)] px-9 py-4 text-base text-white shadow-xl shadow-[var(--app-primary)]/25"
              >
                Boshlash
                <ArrowRight
                  size={20}
                  className="ml-2 transition-transform duration-150 group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={scrollToContact}
                className="landing-secondary-cta app-card motion-button flex items-center justify-center border-none bg-white px-9 py-4 text-base font-black uppercase text-[var(--app-text)]"
              >
                Savol berish
              </button>
            </div>

            <div className="motion-stagger mt-10 grid grid-cols-3 gap-3" style={motionOrder(4)}>
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="landing-stat-card rounded-2xl border border-[var(--app-border)] bg-white/74 p-4 text-left shadow-sm"
                  style={motionOrder(index)}
                >
                  <p className="text-xl font-black text-[var(--app-text)] sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-[var(--app-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="motion-section hidden lg:block">
            <div className="landing-visual-card app-card motion-card relative overflow-hidden bg-white/82 p-6 shadow-2xl shadow-slate-900/10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="landing-brand-mark relative h-14 w-14 overflow-hidden rounded-2xl bg-[var(--app-surface-soft)]">
                    <Image
                      src={centerBranding.logoUrl}
                      alt={centerBranding.name}
                      fill
                      sizes="56px"
                      className="landing-media object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black">{centerBranding.name}</p>
                    <p className="mt-1 text-xs font-bold text-[var(--app-muted)]">
                      Learning workspace
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                  Online
                </span>
              </div>

              <div className="motion-stagger grid gap-3">
                {[
                  ["O'quv reja", 'Ready'],
                  ['Vazifalar', 'Active'],
                  ['Natijalar', 'Live'],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="landing-visual-row rounded-2xl border border-slate-100 bg-white p-4"
                    style={motionOrder(index)}
                  >
                    <div className="mb-3 flex items-center justify-between text-sm font-black">
                      <span>{label}</span>
                      <span className="text-[var(--app-primary)]">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="landing-progress-fill h-full rounded-full bg-[var(--app-primary)]"
                        style={{ width: index === 0 ? '78%' : index === 1 ? '58%' : '70%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="landing-metric-tile rounded-2xl bg-[var(--app-surface-soft)] p-4">
                  <p className="text-2xl font-black">Plan</p>
                  <p className="text-xs font-bold text-[var(--app-muted)]">
                    tartibli dars oqimi
                  </p>
                </div>
                <div className="landing-metric-tile rounded-2xl bg-[var(--app-primary)] p-4 text-white">
                  <p className="text-2xl font-black">Flow</p>
                  <p className="text-xs font-bold text-white/78">
                    tezkor feedback
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="landing-section content-auto border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/52 px-5 py-16 sm:px-6 sm:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 lg:gap-20">
            <div className="motion-section">
              <SectionEyebrow icon={Info}>Biz haqimizda</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-black uppercase md:text-5xl">
                Tizimli, o'lchovli va aniq reja bilan o'qiting
              </h2>
              <p className="mt-6 text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg">
                {centerBranding.name} darslar, testlar, guruhlar va progress
                nazoratini bitta oqimga jamlaydi. O'quvchi ham, mentor ham
                keyingi qadamni tez ko'radi.
              </p>
            </div>

            <div className="motion-stagger grid gap-3">
              {ABOUT_BULLETS.map((item, index) => (
                <div
                  key={item}
                  className="landing-list-item app-card motion-card flex items-center gap-4 p-4"
                  style={motionOrder(index)}
                >
                  <CheckCircle2 className="landing-icon-pulse h-5 w-5 shrink-0 text-[var(--app-primary)]" />
                  <p className="text-sm font-black text-[var(--app-text)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="landing-section content-auto mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"
        >
          <SectionHeader
            title="Imkoniyatlar"
            subtitle="Eng samarali o'rganish tizimi"
          />

          <div className="motion-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_ITEMS.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        <section
          id="courses"
          className="landing-section content-auto border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/52 px-5 py-16 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="motion-section">
                <SectionEyebrow icon={BookOpen}>Kurslar</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-black uppercase md:text-5xl">
                  Sizga mos yo'nalish
                </h2>
              </div>
              <button
                onClick={scrollToContact}
                className="landing-primary-cta btn-premium motion-button w-full border-none bg-[var(--app-primary)] px-6 py-3 text-white shadow-lg shadow-[var(--app-primary)]/20 md:w-auto"
              >
                Savol berish <ArrowRight size={18} className="ml-2" />
              </button>
            </div>

            <div className="motion-stagger grid gap-5 md:grid-cols-3">
              {COURSE_TRACKS.map((course, index) => (
                <CourseCard key={course.title} course={course} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="process"
          className="landing-section content-auto mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"
        >
          <SectionHeader
            title="Qanday ishlaydi"
            subtitle="Universal o'quv jarayoni"
          />

          <div className="motion-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </section>

        <section
          id="questions"
          className="landing-section content-auto border-y border-[var(--app-border)] bg-white/66 px-5 py-16 dark:bg-slate-950/44 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="motion-section">
                <SectionEyebrow icon={HelpCircle}>
                  Kurs haqida savollar
                </SectionEyebrow>
                <h2 className="mt-4 text-3xl font-black uppercase md:text-5xl">
                  Admin javob bergan savollar
                </h2>
              </div>
              <div className="landing-pill inline-flex w-fit items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-xs font-black uppercase text-[var(--app-muted)]">
                <HelpCircle size={15} className="landing-icon-pulse text-[var(--app-primary)]" />
                {questionsLoading ? 'Yuklanmoqda' : `${visibleQuestions.length} ta javob`}
              </div>
            </div>

            <div className="motion-stagger grid gap-5 md:grid-cols-2">
              {visibleQuestions.length > 0 ? (
                visibleQuestions.map((item, index) => (
                  <QuestionCard
                    key={item.id}
                    item={item}
                    index={index}
                    fallbackName={centerBranding.shortName}
                  />
                ))
              ) : (
                <QuestionsEmptyCard
                  loading={questionsLoading}
                  onContact={scrollToContact}
                />
              )}
            </div>
          </div>
        </section>

        <section
          id="address"
          className="landing-section content-auto mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="motion-section">
              <SectionEyebrow icon={MapPin}>O'quv markaz manzili</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-black uppercase md:text-5xl">
                Biz bilan yaqinroq tanishing
              </h2>
              <p className="mt-5 max-w-xl text-base font-bold leading-relaxed text-[var(--app-muted)]">
                Kurslar, guruhlar jadvali, format va boshlash shartlari haqida
                administrator bilan tez bog'lanishingiz mumkin.
              </p>
            </div>

            <div className="motion-stagger grid gap-4 sm:grid-cols-2">
              {ADDRESS_ITEMS.map((item, index) => (
                <AddressCard key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="landing-section content-auto mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-24"
        >
          <div className="motion-section mb-10">
            <div className="landing-contact-icon mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
              <MessageCircle size={30} />
            </div>
            <h2 className="text-4xl font-black uppercase md:text-6xl">
              Savolingizni yuboring
            </h2>
            <p className="mt-4 text-base font-bold text-[var(--app-muted)]">
              Kurs, guruh yoki jadval haqida yozing, admin javob beradi
            </p>
          </div>

          <div className="landing-contact-shell">
            <LandingContactForm />
          </div>
        </section>
      </main>

      <footer className="landing-footer border-t border-[var(--app-border)] bg-white/54 px-6 py-10 text-center">
        <p className="text-xs font-black uppercase text-[var(--app-muted)]">
          {`(c) 2026 ${centerBranding.name}. Barcha huquqlar himoyalangan.`}
        </p>
      </footer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="landing-section-heading motion-section mb-12 text-center">
      <p className="landing-eyebrow-text text-xs font-black uppercase text-[var(--app-primary)]">
        {subtitle}
      </p>
      <h2 className="landing-heading-text mt-4 text-3xl font-black uppercase md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

function SectionEyebrow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p className="landing-eyebrow inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--app-primary)]">
      <Icon className="landing-icon-pulse" size={16} />
      {children}
    </p>
  );
}

const FeatureCard = memo(function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureItem;
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <article
      className="landing-card app-card motion-card group cursor-default p-6"
      style={motionOrder(index)}
    >
      <div className="landing-icon-tile mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-soft)] text-[var(--app-primary)] transition-colors duration-150 group-hover:bg-[var(--app-primary)] group-hover:text-white">
        <Icon size={25} strokeWidth={2.5} />
      </div>
      <h3 className="mb-2 text-lg font-black">{feature.title}</h3>
      <p className="text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
        {feature.desc}
      </p>
    </article>
  );
});

const CourseCard = memo(function CourseCard({
  course,
  index,
}: {
  course: CourseTrack;
  index: number;
}) {
  return (
    <article className="landing-card app-card motion-card p-6" style={motionOrder(index)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="landing-icon-tile rounded-2xl bg-[var(--app-primary)]/10 p-3 text-[var(--app-primary)]">
          <BookOpen size={24} strokeWidth={2.5} />
        </div>
        <span className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-xs font-black uppercase text-[var(--app-muted)]">
          {course.level}
        </span>
      </div>
      <h3 className="text-xl font-black text-[var(--app-text)]">
        {course.title}
      </h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
        {course.desc}
      </p>
    </article>
  );
});

const ProcessCard = memo(function ProcessCard({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  const Icon = step.icon;

  return (
    <article
      className="landing-card app-card motion-card p-6"
      style={motionOrder(index)}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="landing-icon-tile inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xs font-black text-[var(--app-muted)]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="text-lg font-black text-[var(--app-text)]">
        {step.title}
      </h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
        {step.desc}
      </p>
    </article>
  );
});

const QuestionCard = memo(function QuestionCard({
  item,
  index,
  fallbackName,
}: {
  item: PublicLeadQuestion;
  index: number;
  fallbackName: string;
}) {
  return (
    <article className="landing-card app-card motion-card p-6" style={motionOrder(index)}>
      <p className="text-xs font-black uppercase text-[var(--app-primary)]">
        {item.fullName || fallbackName}
      </p>
      <h3 className="mt-3 text-lg font-black leading-snug text-[var(--app-text)]">
        {item.message || 'Savol'}
      </h3>
      <div className="landing-answer-box mt-5 rounded-2xl bg-[var(--app-surface-soft)] p-5">
        <p className="text-xs font-black uppercase text-[var(--app-muted)]">
          Admin javobi
        </p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--app-text)]">
          {item.answer || 'Tez orada javob beriladi.'}
        </p>
      </div>
    </article>
  );
});

function QuestionsEmptyCard({
  loading,
  onContact,
}: {
  loading: boolean;
  onContact: () => void;
}) {
  return (
    <article className="landing-card app-card motion-card p-6 md:col-span-2">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-[var(--app-primary)]">
            {loading ? 'Savollar yuklanmoqda' : 'Savollar'}
          </p>
          <h3 className="mt-3 text-xl font-black text-[var(--app-text)]">
            {loading
              ? "Admin javoblari tekshirilmoqda"
              : "Hozircha ommaviy savollar yo'q"}
          </h3>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
            Kurs yoki guruh bo'yicha savolingiz bo'lsa, formani yuboring.
            Admin javob bergan savollar shu yerda ko'rinadi.
          </p>
        </div>
        <button
          type="button"
          onClick={onContact}
          className="landing-primary-cta btn-premium motion-button w-full border-none bg-[var(--app-primary)] px-6 py-3 text-white md:w-auto"
        >
          Savol berish
        </button>
      </div>
    </article>
  );
}

const AddressCard = memo(function AddressCard({
  item,
  index,
}: {
  item: AddressItem;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <article className="landing-card app-card motion-card p-6" style={motionOrder(index)}>
      <Icon className="landing-icon-pulse mb-5 text-[var(--app-primary)]" size={28} />
      <p className="text-xs font-black uppercase text-[var(--app-muted)]">
        {item.label}
      </p>
      <p className="mt-2 text-base font-black leading-snug text-[var(--app-text)]">
        {item.value}
      </p>
    </article>
  );
});

function ContactFormSkeleton() {
  return (
    <div className="landing-card app-card bg-white/70 p-6 text-left shadow-xl shadow-slate-900/5 sm:p-10">
      <div className="space-y-5">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <div className="mb-2.5 h-3 w-28 rounded-full bg-slate-200" />
            <div className="h-14 rounded-2xl bg-slate-100" />
          </div>
        ))}
        <div className="h-14 rounded-2xl bg-[var(--app-primary)]/18" />
      </div>
    </div>
  );
}
