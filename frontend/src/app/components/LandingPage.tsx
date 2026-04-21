'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  memo,
  useCallback,
  useMemo,
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
  Star,
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

type TeamMember = {
  name: string;
  role: string;
  image: string;
  focus: string;
};

type AddressItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const NAV_LINKS = [
  { href: '#about', label: 'Biz haqimizda' },
  { href: '#features', label: 'Imkoniyatlar' },
  { href: '#team', label: 'Jamoa' },
  { href: '#questions', label: 'Savollar' },
  { href: '#address', label: 'Manzil' },
  { href: '#contact', label: "Bog'lanish" },
];

const HERO_STATS = [
  { value: 'A1-C2', label: 'CEFR yo‘nalish' },
  { value: '3', label: 'asosiy kurs' },
  { value: '24/7', label: 'platforma' },
];

const ABOUT_BULLETS = [
  'CEFR darajalariga moslashgan darslar',
  'IELTS va General English tayyorgarlik',
  "So'z boyligini SM-2 algoritmi bilan mustahkamlash",
  "Guruh ichida do'stlar bilan raqobatlashish",
];

const FEATURE_ITEMS: FeatureItem[] = [
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
];

const COURSE_TRACKS: CourseTrack[] = [
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

const TEAM_MEMBERS: TeamMember[] = [
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
    focus: "Guruhlar, natijalar va o'quv reja",
  },
];

const ADDRESS_ITEMS: AddressItem[] = [
  {
    icon: MapPin,
    label: 'Manzil',
    value: "Toshkent shahri, O'zbekiston",
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
    value: 'Offline, online va hybrid guruhlar',
  },
];

const DEFAULT_PUBLIC_QUESTIONS: PublicLeadQuestion[] = [
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
    message: 'IELTS kursi qancha davom etadi?',
    answer:
      "Odatda 3-6 oy davom etadi. Aniq muddat boshlang'ich darajangiz va maqsad ballingizga bog'liq.",
  },
  {
    id: 3,
    fullName: 'MK Academy',
    message: 'Darslar online ham bormi?',
    answer:
      'Ha, ayrim guruhlar online va hybrid formatda ochiladi. Jadval admin bilan kelishiladi.',
  },
];

function motionOrder(index: number): CSSProperties {
  return { '--motion-order': index } as CSSProperties;
}

export function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const { centerBranding } = useCenterBranding();
  const { data: publishedQuestions } = usePublishedLeadQuestions();

  const loginPath = useMemo(() => localizePath(locale, '/login'), [locale]);
  const goLogin = useCallback(() => router.push(loginPath), [loginPath, router]);
  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const visibleQuestions = useMemo(
    () =>
      publishedQuestions.length > 0
        ? publishedQuestions
        : DEFAULT_PUBLIC_QUESTIONS,
    [publishedQuestions],
  );

  return (
    <div className="landing-shell motion-page min-h-screen-safe overflow-x-clip text-[var(--app-text)] selection:bg-[var(--app-primary)] selection:text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--app-border)] bg-white/78 backdrop-blur-xl dark:bg-slate-950/78">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6">
          <button
            type="button"
            onClick={goLogin}
            className="motion-link group flex items-center gap-3 text-left"
            aria-label={`${centerBranding.shortName} login`}
          >
            <span className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-[var(--app-primary)]/14">
              <Image
                src={centerBranding.logoUrl}
                alt={centerBranding.shortName}
                fill
                priority
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="text-xl font-black sm:text-2xl">
              {centerBranding.shortName}
            </span>
          </button>

          <div className="hidden items-center gap-5 text-xs font-black uppercase text-[var(--app-muted)] md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="motion-link hover:text-[var(--app-primary)]"
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
            className="motion-button flex items-center justify-center rounded-2xl bg-[var(--app-primary)] px-5 py-2 text-xs font-black uppercase text-white shadow-lg shadow-[var(--app-primary)]/20 md:hidden"
          >
            <LogIn size={14} className="mr-2" />
            Kirish
          </button>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid min-h-[88svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20">
          <div className="motion-section text-center lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/84 px-4 py-2 text-[var(--app-primary-dark)] shadow-sm">
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-xs font-black uppercase">
                Ingliz tilini biz bilan o'rganing
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[0.96] sm:text-6xl md:text-7xl">
              {centerBranding.shortName}
              <span className="block bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-dark)] bg-clip-text text-transparent">
                English Platform
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg lg:mx-0">
              {centerBranding.description}
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={goLogin}
                className="btn-premium motion-button group border-none bg-[var(--app-primary)] px-9 py-4 text-base text-white shadow-xl shadow-[var(--app-primary)]/25"
              >
                Boshlash
                <ArrowRight
                  size={20}
                  className="ml-2 transition-transform duration-150 group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={scrollToContact}
                className="app-card motion-button flex items-center justify-center border-none bg-white px-9 py-4 text-base font-black uppercase text-[var(--app-text)]"
              >
                Savol berish
              </button>
            </div>

            <div className="motion-stagger mt-10 grid grid-cols-3 gap-3">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--app-border)] bg-white/74 p-4 text-left shadow-sm"
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
            <div className="app-card motion-card relative overflow-hidden bg-white/82 p-6 shadow-2xl shadow-slate-900/10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[var(--app-surface-soft)]">
                    <Image
                      src={centerBranding.logoUrl}
                      alt={centerBranding.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black">{centerBranding.name}</p>
                    <p className="mt-1 text-xs font-bold text-[var(--app-muted)]">
                      Live learning dashboard
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                  Online
                </span>
              </div>

              <div className="grid gap-3">
                {[
                  ['Grammar progress', '82%'],
                  ['Speaking practice', '64%'],
                  ['IELTS practice score', '7.0'],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-100 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between text-sm font-black">
                      <span>{label}</span>
                      <span className="text-[var(--app-primary)]">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[var(--app-primary)]"
                        style={{ width: index === 0 ? '82%' : index === 1 ? '64%' : '74%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[var(--app-surface-soft)] p-4">
                  <p className="text-2xl font-black">128</p>
                  <p className="text-xs font-bold text-[var(--app-muted)]">
                    active tasks
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--app-primary)] p-4 text-white">
                  <p className="text-2xl font-black">+18%</p>
                  <p className="text-xs font-bold text-white/78">
                    weekly growth
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
                Ingliz tilini tizimli, o‘lchovli va aniq reja bilan
              </h2>
              <p className="mt-6 text-base font-bold leading-relaxed text-[var(--app-muted)] sm:text-lg">
                {centerBranding.name} ingliz tilini noldan C2 darajagacha
                o'rgatishga ixtisoslashgan ta'lim platformasi. Darslar, testlar
                va progress nazorati bitta oqimda ishlaydi.
              </p>
            </div>

            <div className="motion-stagger grid gap-3">
              {ABOUT_BULLETS.map((item, index) => (
                <div
                  key={item}
                  className="app-card motion-card flex items-center gap-4 p-4"
                  style={motionOrder(index)}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--app-primary)]" />
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
                className="btn-premium motion-button w-full border-none bg-[var(--app-primary)] px-6 py-3 text-white shadow-lg shadow-[var(--app-primary)]/20 md:w-auto"
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
          id="team"
          className="landing-section content-auto mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24"
        >
          <SectionHeader
            title="Mentorlar va jamoa"
            subtitle="O'quv markaz jamoasi"
          />

          <div className="motion-stagger grid gap-5 md:grid-cols-3">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
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
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-xs font-black uppercase text-[var(--app-muted)]">
                <HelpCircle size={15} className="text-[var(--app-primary)]" />
                {visibleQuestions.length} ta javob
              </div>
            </div>

            <div className="motion-stagger grid gap-5 md:grid-cols-2">
              {visibleQuestions.map((item, index) => (
                <QuestionCard
                  key={item.id}
                  item={item}
                  index={index}
                  fallbackName={centerBranding.shortName}
                />
              ))}
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
                Filialga kelib kurslar, guruhlar jadvali va daraja aniqlash
                testi haqida administrator bilan gaplashishingiz mumkin.
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
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--app-primary)]/10 text-[var(--app-primary)] shadow-inner">
              <MessageCircle size={30} />
            </div>
            <h2 className="text-4xl font-black uppercase md:text-6xl">
              Savolingizni yuboring
            </h2>
            <p className="mt-4 text-base font-bold text-[var(--app-muted)]">
              Kurs, guruh yoki jadval haqida yozing, admin javob beradi
            </p>
          </div>

          <LandingContactForm />
        </section>
      </main>

      <footer className="border-t border-[var(--app-border)] bg-white/54 px-6 py-10 text-center">
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
    <div className="motion-section mb-12 text-center">
      <p className="text-xs font-black uppercase text-[var(--app-primary)]">
        {subtitle}
      </p>
      <h2 className="mt-4 text-3xl font-black uppercase md:text-6xl">
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
    <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--app-primary)]">
      <Icon size={16} />
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
      className="app-card motion-card group cursor-default p-6"
      style={motionOrder(index)}
    >
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-soft)] text-[var(--app-primary)] transition-colors duration-150 group-hover:bg-[var(--app-primary)] group-hover:text-white">
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
    <article className="app-card motion-card p-6" style={motionOrder(index)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-[var(--app-primary)]/10 p-3 text-[var(--app-primary)]">
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

const TeamCard = memo(function TeamCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <article
      className="app-card motion-card overflow-hidden p-0"
      style={motionOrder(index)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--app-surface-soft)]">
        <Image
          src={member.image}
          alt={member.name}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--app-primary)]/10 px-3 py-1 text-xs font-black uppercase text-[var(--app-primary)]">
            {member.role}
          </span>
          <Star size={18} className="text-amber-400" fill="currentColor" />
        </div>
        <h3 className="text-xl font-black text-[var(--app-text)]">
          {member.name}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
          {member.focus}
        </p>
      </div>
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
    <article className="app-card motion-card p-6" style={motionOrder(index)}>
      <p className="text-xs font-black uppercase text-[var(--app-primary)]">
        {item.fullName || fallbackName}
      </p>
      <h3 className="mt-3 text-lg font-black leading-snug text-[var(--app-text)]">
        {item.message || 'Savol'}
      </h3>
      <div className="mt-5 rounded-2xl bg-[var(--app-surface-soft)] p-5">
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

const AddressCard = memo(function AddressCard({
  item,
  index,
}: {
  item: AddressItem;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <article className="app-card motion-card p-6" style={motionOrder(index)}>
      <Icon className="mb-5 text-[var(--app-primary)]" size={28} />
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
    <div className="app-card bg-white/70 p-6 text-left shadow-xl shadow-slate-900/5 sm:p-10">
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
