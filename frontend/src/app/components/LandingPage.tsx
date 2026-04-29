"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
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
  Zap,
  Shield,
  Target,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Instagram,
  Youtube,
} from "lucide-react";
import { createLead, getPublicCenterSettings } from "@/lib/backend-api";
import { usePublishedLeadQuestions } from "@/hooks/usePublishedLeadQuestions";
import { localizePath } from "@/i18n/localizedPath";
import type { AppLocale } from "@/i18n/config";
import { useCenterBranding } from "./branding/CenterBrandingProvider";
import {
  normalizeCenterBranding,
  type CenterBranding,
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_COURSE_TRACKS,
  DEFAULT_ABOUT_POINTS,
} from "@/lib/branding";

const LANDING_COPY: Record<
  AppLocale,
  {
    nav: string[];
    login: string;
    badge: string;
    heroLead: string;
    start: string;
    details: string;
    openExam: string;
    scroll: string;
    stats: string[];
    aboutEyebrow: string;
    aboutTitle: string;
    platformMeta: string;
    miniStats: string[];
    featuresEyebrow: string;
    featuresTitle: string;
    enroll: string;
    teamEyebrow: string;
    teamTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    faqCount: string;
    question: string;
    answer: string;
    addressEyebrow: string;
    addressTitle: string;
    addressText: string;
    addressLabels: string[];
    defaultAddress: string;
    defaultHours: string;
    formatValue: string;
    contactTitle: string;
    contactText: string;
    fullName: string;
    phone: string;
    message: string;
    sending: string;
    sendQuestion: string;
    sent: string;
    sendError: string;
    settingsNotice: string;
    validationErrors: {
      fullName: string;
      phone: string;
      message: string;
    };
    featureIntro: string;
    featureOutro: string;
    features: Array<{ title: string; desc: string }>;
    coursesEyebrow: string;
    coursesTitle: string;
    askQuestion: string;
    platformTitle: string;
    socialLabels: string[];
    rights: string;
    faq: Array<{ id: number; fullName: string; message: string; answer: string }>;
  }
> = {
  uz: {
    nav: ["Biz haqimizda", "Imkoniyatlar", "Jamoa", "Savollar", "Manzil", "Bog'lanish"],
    login: "Kirish",
    badge: "Ingliz tilini biz bilan o'rganing",
    heroLead: "shu yerdan boshlanadi",
    start: "Boshlash",
    details: "Batafsil",
    openExam: "Ochiq imtihon",
    scroll: "Pastga scroll qiling",
    stats: ["O'quvchilar", "Kurslar", "Muvaffaqiyat", "IELTS o'rtacha", "Guruhlar", "O'qituvchilar"],
    aboutEyebrow: "Biz haqimizda",
    aboutTitle: "Bizning missiya",
    platformMeta: "A1 dan C2 gacha · Production quality",
    miniStats: ["O'quvchi", "Natija", "Reyting"],
    featuresEyebrow: "Imkoniyatlar",
    featuresTitle: "Platforma nimalarni beradi",
    enroll: "Kursga yozilish",
    teamEyebrow: "Professional jamoa",
    teamTitle: "Mentorlar va jamoa",
    faqEyebrow: "Ko'p so'raladigan savollar",
    faqTitle: "Admin javob bergan savollar",
    faqCount: "ta javob",
    question: "Savol",
    answer: "Admin javobi",
    addressEyebrow: "Bizning joylashuv",
    addressTitle: "Biz bilan yaqinroq tanishing",
    addressText: "Filialga kelib kurslar, guruhlar jadvali va daraja aniqlash testi haqida administrator bilan gaplashishingiz mumkin.",
    addressLabels: ["Manzil", "Aloqa", "Ish vaqti", "Format"],
    defaultAddress: "Toshkent shahri, O'zbekiston",
    defaultHours: "Dushanba - Shanba, 09:00 - 20:00",
    formatValue: "Offline, online va hybrid guruhlar",
    contactTitle: "Savolingizni yuboring",
    contactText: "Kurs, guruh yoki jadval haqida yozing, admin javob beradi",
    fullName: "To'liq ism",
    phone: "Telefon raqam",
    message: "Savol yoki xabar",
    sending: "Yuborilmoqda...",
    sendQuestion: "Savol yuborish",
    sent: "Savolingiz adminga yuborildi!",
    sendError: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    settingsNotice: "Ayrim ma'lumotlar vaqtincha standart ko'rinishda ko'rsatilmoqda.",
    validationErrors: {
      fullName: "Ism kamida 3 ta belgidan iborat bo'lishi kerak.",
      phone: "Telefon raqamni to'liq kiriting.",
      message: "Xabar kamida 10 ta belgidan iborat bo'lishi kerak.",
    },
    featureIntro: "Nima taklif qilamiz",
    featureOutro: "Eng samarali o'rganish tizimi",
    features: [
      { title: "Grammar", desc: "CEFR darajasiga mos grammatika darslari" },
      { title: "Listening", desc: "Audio materiallar va tushunish mashqlari" },
      { title: "Writing", desc: "Yozma ko'nikmani rivojlantirish vazifalari" },
      { title: "Vocabulary", desc: "SM-2 algoritmi bilan mustahkamlash" },
      { title: "Gamification", desc: "XP va leaderboard tizimi" },
      { title: "Guruhlar", desc: "O'qituvchi bilan birga o'rganish" },
      { title: "IELTS Exams", desc: "Mock exam imkoniyatlari" },
      { title: "Progress", desc: "Real-time natijalar tahlili" },
    ],
    coursesEyebrow: "Yo'nalishlar",
    coursesTitle: "Sizga mos kurs",
    askQuestion: "Savol berish",
    platformTitle: "CEFR English Platform",
    socialLabels: ["Telegram", "Instagram", "YouTube"],
    rights: "Barcha huquqlar himoyalangan",
    faq: [
      { id: 1, fullName: "MK Academy", message: "Qaysi darajadan boshlashimni qanday bilaman?", answer: "Avval qisqa placement test topshirasiz. Natijaga qarab sizga mos guruh va kurs tavsiya qilinadi." },
      { id: 2, fullName: "MK Academy", message: "IELTS kursi qancha davom etadi?", answer: "Odatda 3-6 oy davom etadi. Aniq muddat boshlang'ich darajangiz va maqsad ballingizga bog'liq." },
      { id: 3, fullName: "MK Academy", message: "Darslar online ham bormi?", answer: "Ha, ayrim guruhlar online va hybrid formatda ochiladi. Jadval admin bilan kelishiladi." },
    ],
  },
  en: {
    nav: ["About", "Features", "Team", "Questions", "Location", "Contact"],
    login: "Log in",
    badge: "Learn English with us",
    heroLead: "nachinaetsya zdes",
    start: "Get started",
    details: "Learn more",
    openExam: "Open exam",
    scroll: "Scroll down",
    stats: ["Students", "Courses", "Success rate", "Average IELTS", "Groups", "Teachers"],
    aboutEyebrow: "About us",
    aboutTitle: "Our mission",
    platformMeta: "From A1 to C2 · Production quality",
    miniStats: ["Students", "Results", "Rating"],
    featuresEyebrow: "Features",
    featuresTitle: "What the platform delivers",
    enroll: "Join this course",
    teamEyebrow: "Professional team",
    teamTitle: "Mentors and team",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Questions answered by admin",
    faqCount: "answers",
    question: "Question",
    answer: "Admin answer",
    addressEyebrow: "Our location",
    addressTitle: "Get closer to the center",
    addressText: "Visit the center to discuss courses, group schedules, and placement testing with an administrator.",
    addressLabels: ["Address", "Contact", "Working hours", "Format"],
    defaultAddress: "Tashkent, Uzbekistan",
    defaultHours: "Monday - Saturday, 09:00 - 20:00",
    formatValue: "Offline, online and hybrid groups",
    contactTitle: "Send your question",
    contactText: "Ask about a course, group, or schedule and our admin will reply.",
    fullName: "Full name",
    phone: "Phone number",
    message: "Question or message",
    sending: "Sending...",
    sendQuestion: "Send question",
    sent: "Your question was sent to the admin!",
    sendError: "Something went wrong. Please try again.",
    settingsNotice: "Some details are temporarily shown from the default public profile.",
    validationErrors: {
      fullName: "Full name should contain at least 3 characters.",
      phone: "Enter a complete phone number.",
      message: "Your message should contain at least 10 characters.",
    },
    featureIntro: "What we offer",
    featureOutro: "A focused English learning system",
    features: [
      { title: "Grammar", desc: "CEFR-aligned grammar lessons for each level" },
      { title: "Listening", desc: "Audio materials and comprehension practice" },
      { title: "Writing", desc: "Tasks that strengthen written expression" },
      { title: "Vocabulary", desc: "Retention powered by the SM-2 algorithm" },
      { title: "Gamification", desc: "XP and leaderboard motivation system" },
      { title: "Groups", desc: "Learn alongside a guided teacher group" },
      { title: "IELTS Exams", desc: "Mock exam opportunities and readiness checks" },
      { title: "Progress", desc: "Real-time learning performance insights" },
    ],
    coursesEyebrow: "Tracks",
    coursesTitle: "Courses matched to your goal",
    askQuestion: "Ask a question",
    platformTitle: "CEFR English Platform",
    socialLabels: ["Telegram", "Instagram", "YouTube"],
    rights: "All rights reserved",
    faq: [
      { id: 1, fullName: "MK Academy", message: "How do I know which level to start from?", answer: "You first take a short placement test. Based on the result, we recommend the right course and group." },
      { id: 2, fullName: "MK Academy", message: "How long does the IELTS course last?", answer: "Usually 3-6 months. The exact duration depends on your starting level and target score." },
      { id: 3, fullName: "MK Academy", message: "Are online classes available?", answer: "Yes, some groups are available online and in hybrid format depending on the schedule." },
    ],
  },
  ru: {
    nav: ["O nas", "Vozmozhnosti", "Komanda", "Voprosy", "Adres", "Kontakt"],
    login: "Voyti",
    badge: "Izuchayte angliyskiy s nami",
    heroLead: "starts here",
    start: "Nachat",
    details: "Podrobnee",
    openExam: "Otkrytyy ekzamen",
    scroll: "Prokrutite vniz",
    stats: ["Studenty", "Kursy", "Rezultat", "Sredniy IELTS", "Gruppy", "Prepodavateli"],
    aboutEyebrow: "O nas",
    aboutTitle: "Nasha missiya",
    platformMeta: "Ot A1 do C2 · Production quality",
    miniStats: ["Studenty", "Rezultat", "Reyting"],
    featuresEyebrow: "Vozmozhnosti",
    featuresTitle: "Chto daet platforma",
    enroll: "Zapisatsya na kurs",
    teamEyebrow: "Professionalnaya komanda",
    teamTitle: "Mentory i komanda",
    faqEyebrow: "Chasto zadavaemye voprosy",
    faqTitle: "Otvety administratora",
    faqCount: "otvetov",
    question: "Vopros",
    answer: "Otvet administratora",
    addressEyebrow: "Nashe raspolozhenie",
    addressTitle: "Poznakomtes s nami blizhe",
    addressText: "Prikhodite v filial, chtoby obsudit kursy, raspisanie grupp i placement test s administratorom.",
    addressLabels: ["Adres", "Kontakt", "Grafik", "Format"],
    defaultAddress: "Tashkent, Uzbekistan",
    defaultHours: "Ponedelnik - Subbota, 09:00 - 20:00",
    formatValue: "Offline, online i gibridnye gruppy",
    contactTitle: "Otpravte svoy vopros",
    contactText: "Zadayte vopros o kurse, gruppe ili raspisanii, i administrator otvetit vam.",
    fullName: "Polnoe imya",
    phone: "Telefon",
    message: "Vopros ili soobshchenie",
    sending: "Otpravlyaetsya...",
    sendQuestion: "Otpravit vopros",
    sent: "Vash vopros otpravlen administratoru!",
    sendError: "Proizoshla oshibka. Poprobuyte eshche raz.",
    settingsNotice: "Chast dannykh vremmenno pokazana iz publichnogo profilya po umolchaniyu.",
    validationErrors: {
      fullName: "Imya dolzhno soderzhat minimum 3 simvola.",
      phone: "Ukazhite polnyy nomer telefona.",
      message: "Soobshchenie dolzhno soderzhat minimum 10 simvolov.",
    },
    featureIntro: "Chto my predlagaem",
    featureOutro: "Sistemnyy podkhod k izucheniyu angliyskogo",
    features: [
      { title: "Grammar", desc: "Uroki grammatiki po standartam CEFR" },
      { title: "Listening", desc: "Audiomaterialy i zadaniya na ponimanie" },
      { title: "Writing", desc: "Zadaniya dlya razvitiya pis'mennoy rechi" },
      { title: "Vocabulary", desc: "Zakreplenie slov po algoritmu SM-2" },
      { title: "Gamification", desc: "Sistema XP i leaderboard" },
      { title: "Gruppy", desc: "Obuchenie vmeste s prepodavatelem" },
      { title: "IELTS Exams", desc: "Probnyye ekzameny i proverka gotovnosti" },
      { title: "Progress", desc: "Analitika rezul'tatov v real'nom vremeni" },
    ],
    coursesEyebrow: "Napravleniya",
    coursesTitle: "Kurs pod vashu tsel'",
    askQuestion: "Zadat vopros",
    platformTitle: "CEFR English Platform",
    socialLabels: ["Telegram", "Instagram", "YouTube"],
    rights: "Vse prava zashchishcheny",
    faq: [
      { id: 1, fullName: "MK Academy", message: "Kak ponyat, s kakogo urovnya nachat?", answer: "Snachala vy prokhodite korotkiy placement test. Po rezultatu my rekomenduem podkhodyashchuyu gruppu i kurs." },
      { id: 2, fullName: "MK Academy", message: "Skolko dlitsya kurs IELTS?", answer: "Obychno 3-6 mesyatsev. Tochnyy srok zavisit ot vashego startovogo urovnya i tselevogo balla." },
      { id: 3, fullName: "MK Academy", message: "Est li onlayn zanyatiya?", answer: "Da, chast grupp dostupna onlayn i v gibridnom formate v zavisimosti ot raspisaniya." },
    ],
  },
};

// в”Ђв”Ђ IntersectionObserver hook в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function useInView(opts?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: opts?.threshold ?? 0.08,
        rootMargin: opts?.rootMargin ?? "0px 0px -50px 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [opts?.threshold, opts?.rootMargin]);

  return [ref, visible] as const;
}

// в”Ђв”Ђ Reveal wrapper в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const [ref, visible] = useInView();
  const dirClass =
    direction === "left"
      ? "reveal reveal-left"
      : direction === "right"
      ? "reveal reveal-right"
      : direction === "scale"
      ? "reveal reveal-scale"
      : "reveal";

  return (
    <div
      ref={ref}
      className={`${dirClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

// в”Ђв”Ђ Stat counter в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function StatCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();

  useEffect(() => {
    if (!visible) return;
    let frameId = 0;
    let startTs: number | null = null;
    const duration = 900;

    const tick = (ts: number) => {
      if (startTs === null) {
        startTs = ts;
      }

      const progress = Math.min((ts - startTs) / duration, 1);
      setCount(Math.round(target * progress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// в”Ђв”Ђ Default FAQ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const DEFAULT_FAQ = [
  {
    id: 1,
    fullName: "MK Academy",
    message: "Qaysi darajadan boshlashimni qanday bilaman?",
    answer:
      "Avval qisqa placement test topshirasiz. Natijaga qarab sizga mos guruh va kurs tavsiya qilinadi.",
  },
  {
    id: 2,
    fullName: "MK Academy",
    message: "IELTS kursi qancha davom etadi?",
    answer:
      "Odatda 3-6 oy davom etadi. Aniq muddat boshlang'ich darajangiz va maqsad ballingizga bog'liq.",
  },
  {
    id: 3,
    fullName: "MK Academy",
    message: "Darslar online ham bormi?",
    answer:
      "Ha, ayrim guruhlar online va hybrid formatda ochiladi. Jadval admin bilan kelishiladi.",
  },
];

// в”Ђв”Ђ Feature list в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const FEATURE_META = [
  {
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Headphones,
    color: "text-[var(--app-secondary)]",
    bg: "bg-[var(--app-secondary)]/10",
  },
  {
    icon: PenTool,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: MessageCircle,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Trophy,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: Globe,
    color: "text-[var(--app-accent)]",
    bg: "bg-[var(--app-accent)]/10",
  },
  {
    icon: TrendingUp,
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
];

// в”Ђв”Ђ Main component в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
export function LandingPage() {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const copy = LANDING_COPY[locale] ?? LANDING_COPY.uz;
  const { centerBranding: ctxBranding } = useCenterBranding();

  // Live settings from API (enriched with landing data)
  const [settings, setSettings] = useState<CenterBranding>(ctxBranding);
  const [settingsFallbackNotice, setSettingsFallbackNotice] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getPublicCenterSettings()
      .then((raw) => {
        if (raw) {
          setSettings(normalizeCenterBranding(raw));
          setSettingsFallbackNotice(false);
        } else {
          setSettingsFallbackNotice(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load public center settings", error);
        setSettingsFallbackNotice(true);
      });
  }, []);

  const teamMembers = settings.teamMembers?.length
    ? settings.teamMembers
    : DEFAULT_TEAM_MEMBERS;
  const courseTracks = settings.courseTracks?.length
    ? settings.courseTracks
    : DEFAULT_COURSE_TRACKS;
  const aboutPoints = settings.aboutPoints?.length
    ? settings.aboutPoints
    : DEFAULT_ABOUT_POINTS;

  const { data: publishedFaq } = usePublishedLeadQuestions();
  const visibleFaq = publishedFaq.length > 0 ? publishedFaq : copy.faq;
  const renderedFaq = useMemo(() => visibleFaq.slice(0, 6), [visibleFaq]);
  const renderedTeamMembers = useMemo(
    () => teamMembers.slice(0, 6),
    [teamMembers]
  );
  const renderedCourseTracks = useMemo(
    () => courseTracks.slice(0, 6),
    [courseTracks]
  );
  const localizedFeatures = useMemo(
    () =>
      FEATURE_META.map((feature, index) => ({
        ...feature,
        ...copy.features[index],
      })),
    [copy.features]
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    null | "loading" | "success" | "error"
  >(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    if (formData.fullName.trim().length < 3) {
      nextErrors.fullName = copy.validationErrors.fullName;
    }
    if (!/^\+?[0-9\s()-]{9,}$/.test(formData.phone.trim())) {
      nextErrors.phone = copy.validationErrors.phone;
    }
    if (formData.message.trim().length < 10) {
      nextErrors.message = copy.validationErrors.message;
    }
    return nextErrors;
  }, [copy.validationErrors, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const nextErrors = validateForm();
      setFieldErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        setFormStatus("error");
        return;
      }
      setFormStatus("loading");
      try {
        await createLead({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        });
        setFormStatus("success");
        setFormData({ fullName: "", phone: "", message: "" });
        setFieldErrors({});
      } catch {
        setFormStatus("error");
      }
    },
    [formData, validateForm]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const NAV_LINKS = [
    { id: "about", label: copy.nav[0] },
    { id: "features", label: copy.nav[1] },
    { id: "team", label: copy.nav[2] },
    { id: "questions", label: copy.nav[3] },
    { id: "address", label: copy.nav[4] },
    { id: "contact", label: copy.nav[5] },
  ];
  const sectionFrame = "mx-auto w-full max-w-[1180px] px-6 sm:px-8 lg:px-10";

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--app-bg)] pt-16 text-[var(--app-text)] selection:bg-[var(--app-primary)] selection:text-white sm:pt-20">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-[var(--app-primary)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[var(--app-primary)]"
      >
        Skip to content
      </a>
      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ NAVBAR в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <nav
        className={`fixed inset-x-0 top-0 z-[90] border-b border-[var(--app-border)] bg-[var(--app-bg)]/96 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-none" : ""
        }`}
      >
        <div className={`${sectionFrame} flex h-16 items-center justify-between sm:h-20`}>
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="group flex items-center gap-3"
          >
            <div className="relative h-10 w-10 overflow-hidden border-2 border-white/50 transition-transform group-hover:scale-105">
              <Image
                src={settings.logoUrl}
                alt={settings.shortName}
                fill
                unoptimized
                sizes="40px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 ring-2 ring-inset ring-white/20" />
            </div>
            <span className="text-xl font-black tracking-tighter sm:text-2xl">
              {settings.shortName}
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)] lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="transition-colors hover:text-[var(--app-primary)]"
              >
                {link.label}
              </button>
            ))}
            <div className="h-4 w-px bg-[var(--app-border)]" />
            <button
              onClick={() => router.push(localizePath(locale, "/login"))}
              className="btn-premium border-none bg-[var(--app-secondary)] px-5 py-2.5 text-white"
            >
              <LogIn size={15} className="mr-2" />
              {copy.login}
            </button>
          </div>

          {/* Mobile login */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-mobile-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span
                className={`block h-0.5 w-6 bg-[var(--app-text)] transition-all ${
                  mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--app-text)] transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--app-text)] transition-all ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
            <button
              onClick={() => router.push(localizePath(locale, "/login"))}
              className="flex items-center gap-1.5 bg-[var(--app-secondary)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
            >
              <LogIn size={13} />
              {copy.login}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="landing-mobile-menu"
          className={`overflow-hidden border-b border-[var(--app-border)] bg-[var(--app-bg)]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex flex-col gap-1 px-5 pt-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-primary)]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ HERO в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section
        id="hero"
        className="relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16"
      >
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute left-1/2 top-[14%] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[var(--app-primary)] opacity-[0.06] blur-[80px] sm:h-[360px] sm:w-[360px]" />
          <div
            className="animate-float absolute right-[8%] top-[36%] hidden h-[220px] w-[220px] rounded-full bg-[var(--app-accent)] opacity-[0.07] blur-[70px] md:block"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="animate-float-slow absolute bottom-[8%] left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-[var(--app-secondary)] opacity-[0.05] blur-[70px] sm:h-[280px] sm:w-[280px]"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative left-1/2 flex min-h-[calc(100svh-4rem)] w-[min(100vw,980px)] -translate-x-1/2 flex-col items-center justify-start px-5 text-center sm:min-h-[calc(100svh-5rem)] sm:justify-center sm:px-8">
          <div className="mb-5 inline-flex max-w-full cursor-default items-center gap-2 border border-[var(--app-border)] bg-[var(--app-surface)]/88 px-3 py-2 backdrop-blur-sm sm:mb-7 sm:px-4">
            <Sparkles
              size={15}
              className="shrink-0 animate-pulse text-[var(--app-primary)]"
            />
            <span className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-[var(--app-primary)] sm:text-[10px] sm:tracking-[0.2em]">
              {copy.badge}
            </span>
          </div>

          <h1 className="mb-5 w-full max-w-[920px] text-5xl font-black leading-[0.95] tracking-normal text-[var(--app-primary-dark)] sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block sm:inline">English</span>{" "}
            <span className="block animate-gradient-x bg-gradient-to-r from-[var(--app-primary)] via-[var(--app-accent)] to-[var(--app-primary-dark)] bg-clip-text text-transparent sm:inline">
              Mastery
            </span>
            <span className="mt-3 block text-3xl font-black leading-tight text-[var(--app-muted)] sm:mt-4 sm:text-4xl lg:text-5xl">
              {copy.heroLead}
            </span>
          </h1>

          <p className="mb-7 max-w-2xl text-sm font-bold leading-relaxed text-[var(--app-muted)] sm:mb-9 sm:text-base lg:text-lg">
            {settings.description}
          </p>

          <div className="grid w-full max-w-sm grid-cols-1 gap-3 sm:max-w-2xl sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3">
            <button
              onClick={() => router.push(localizePath(locale, "/login"))}
              className="btn-premium group relative w-full border-none bg-[var(--app-secondary)] px-6 py-3.5 text-sm text-white sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {copy.start}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
              <span className="animate-pulse-ring absolute inset-0 bg-[var(--app-secondary)]" />
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="flex w-full items-center justify-center gap-2 border border-[var(--app-border)] bg-[var(--app-surface)]/88 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-[var(--app-text)] backdrop-blur-sm transition-all hover:border-[var(--app-primary)]/40 hover:bg-[var(--app-surface)] active:scale-95 sm:px-8 sm:py-4 sm:text-base"
            >
              {copy.details} <ChevronDown size={16} className="animate-bounce" />
            </button>
            <button
              onClick={() => router.push(localizePath(locale, "/public-exam"))}
              className="app-touch app-card flex w-full items-center justify-center border-none bg-[var(--app-surface)] px-6 py-4 text-sm font-black uppercase tracking-wide text-[var(--app-primary)] transition-all hover:bg-[var(--app-surface-soft)] active:scale-95 sm:col-span-2 sm:px-8 sm:py-4 sm:text-base lg:col-span-1"
            >
              {copy.openExam}
            </button>
          </div>

          <button
            onClick={() => scrollTo("about")}
            className="mt-9 hidden flex-col items-center gap-2 text-[var(--app-muted)] transition-colors hover:text-[var(--app-primary)] sm:flex lg:mt-12"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              {copy.scroll}
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-[var(--app-primary)]/40 to-transparent" />
          </button>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ STATS TICKER в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <div className="relative overflow-hidden border-y border-[var(--app-border)] bg-[linear-gradient(90deg,var(--app-primary-dark),var(--app-secondary),var(--app-primary))] py-4">
        <div className="animate-ticker flex w-max items-center gap-12 whitespace-nowrap">
          {[
            { label: copy.stats[0], value: 500, suffix: "+" },
            { label: copy.stats[1], value: 12, suffix: "+" },
            { label: copy.stats[2], value: 94, suffix: "%" },
            { label: copy.stats[3], value: 7, suffix: ".5" },
            { label: copy.stats[4], value: 48, suffix: "+" },
            { label: copy.stats[5], value: 15, suffix: "+" },
            { label: copy.stats[0], value: 500, suffix: "+" },
            { label: copy.stats[1], value: 12, suffix: "+" },
            { label: copy.stats[2], value: 94, suffix: "%" },
            { label: copy.stats[3], value: 7, suffix: ".5" },
            { label: copy.stats[4], value: 48, suffix: "+" },
            { label: copy.stats[5], value: 15, suffix: "+" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Zap size={14} className="text-white/60" />
              <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                {item.label}
              </span>
              <span className="text-lg font-black text-white">
                {item.value}
                {item.suffix}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ ABOUT в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section
        id="about"
        className="border-b border-[var(--app-border)] bg-[var(--app-surface-soft)]/40 py-20 sm:py-32"
      >
        <div className={`${sectionFrame} grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14`}>
          {/* Left */}
          <Reveal direction="left" className="w-full">
            <div className="mx-auto w-full max-w-[34rem] lg:mx-0">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                {copy.aboutEyebrow}
              </p>
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-5xl">
                <Info
                  className="shrink-0 text-[var(--app-primary)]"
                  size={32}
                />
                {copy.aboutTitle}
              </h2>
              <p className="mb-8 text-base font-semibold leading-relaxed text-[var(--app-muted)] sm:text-lg">
                {settings.aboutText}
              </p>
              <ul className="space-y-4">
                {aboutPoints.map((point, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <li className="flex items-start gap-3 text-sm font-semibold text-[var(--app-primary-dark)]">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--app-primary)]"
                      />
                      {point}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right glass card */}
          <Reveal direction="right" delay={100} className="w-full">
            <div className="relative mx-auto w-full max-w-[34rem] lg:ml-auto lg:mr-0">
              <div className="absolute inset-0 scale-105 rotate-1 bg-gradient-to-tr from-[var(--app-primary)]/18 to-[var(--app-accent)]/10 blur-3xl" />
              <div className="glass-card relative p-7 sm:p-8">
                <div className="mb-8 flex items-center gap-5 border-b border-[var(--app-border)] pb-8">
                  <div className="flex h-14 w-14 items-center justify-center bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-[var(--app-primary-dark)]">
                      {copy.platformTitle}
                    </h3>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                      {copy.platformMeta}
                    </p>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: Users, val: "500+", label: copy.miniStats[0] },
                    { icon: Trophy, val: "94%", label: copy.miniStats[1] },
                    { icon: Star, val: "4.9", label: copy.miniStats[2] },
                  ].map(({ icon: Icon, val, label }, i) => (
                    <div
                      key={i}
                      className="border border-[var(--app-border)] bg-[color:color-mix(in_srgb,var(--app-primary)_6%,white)] py-4"
                    >
                      <Icon
                        size={18}
                        className="mx-auto mb-2 text-[var(--app-primary)]"
                      />
                      <p className="text-lg font-extrabold text-[var(--app-primary-dark)]">
                        {val}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {settingsFallbackNotice && (
                  <p className="mt-6 border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-xs font-bold text-[var(--app-muted)]">
                    {copy.settingsNotice}
                  </p>
                )}
                <p className="mt-6 text-sm font-semibold italic leading-relaxed text-[var(--app-muted)]">
                  &ldquo;Har bir o&apos;quvchi o&apos;z darajasiga mos darslarni
                  oladi, testlar orqali bilimini tekshiradi va so&apos;z
                  boyligini kundalik mashqlar bilan mustahkamlaydi.&rdquo;
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ FEATURES в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section id="features" className="py-20 sm:py-32">
        <div className={sectionFrame}>
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
              {copy.featureIntro}
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-6xl">
              {copy.featuresTitle}
            </h2>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.25em] text-[var(--app-muted)]">
              {copy.featureOutro}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localizedFeatures.map((feat, i) => (
            <Reveal key={feat.title} delay={i * 55} direction="up">
              <div className="app-card group cursor-default p-7 transition-all hover:-translate-y-1">
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center ${feat.bg} ${feat.color} transition-all group-hover:rotate-6 group-hover:scale-110`}
                >
                  <feat.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="mb-2 text-base font-extrabold tracking-tight text-[var(--app-primary-dark)]">
                  {feat.title}
                </h3>
                <p className="text-xs font-bold leading-relaxed text-[var(--app-muted)]">
                  {feat.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ COURSES в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section
        id="courses"
        className="border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/40 px-5 py-20 sm:py-28"
      >
        <div className={sectionFrame}>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Reveal direction="left">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                  {copy.coursesEyebrow}
                </p>
                <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-5xl">
                  {copy.coursesTitle}
                </h2>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <button
                onClick={() => scrollTo("contact")}
                className="btn-premium border-none bg-[var(--app-secondary)] px-6 py-3 text-white"
              >
                {copy.askQuestion} <ArrowRight size={16} className="ml-2" />
              </button>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {renderedCourseTracks.map((course, i) => (
              <Reveal key={course.title} delay={i * 100} direction="up">
                <div className="app-card group relative overflow-hidden p-7 transition-all hover:-translate-y-1.5 hover:border-[var(--app-primary)]/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--app-primary)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="bg-[var(--app-primary)]/10 p-3 text-[var(--app-primary)] transition-transform group-hover:rotate-6 group-hover:scale-105">
                        <BookOpen size={22} strokeWidth={2.5} />
                      </div>
                      <span className="border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-extrabold tracking-tight text-[var(--app-primary-dark)]">
                      {course.title}
                    </h3>
                    <p className="text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
                      {course.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                      <Target size={12} />
                      {copy.enroll}
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ TEAM в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section id="team" className="py-20 sm:py-32">
        <div className={sectionFrame}>
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                {copy.teamEyebrow}
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-6xl">
              {copy.teamTitle}
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-7 md:grid-cols-3">
          {renderedTeamMembers.map((member, i) => (
            <Reveal key={member.name} delay={i * 120} direction="up">
              <article className="app-card group overflow-hidden p-0 transition-all hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-primary)]/70 via-[var(--app-primary)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-4 px-5 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-bold text-white/80">
                      {member.focus}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="bg-[var(--app-primary)]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-primary)]">
                      {member.role}
                    </span>
                    <Star
                      size={16}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight text-[var(--app-primary-dark)]">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
                    {member.focus}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ FAQ в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section
        id="questions"
        className="border-y border-[var(--app-border)] bg-[var(--app-surface-soft)]/40 py-20 sm:py-28"
      >
        <div className={sectionFrame}>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Reveal direction="left">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                  {copy.faqEyebrow}
                </p>
                <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-5xl">
                  {copy.faqTitle}
                </h2>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <div className="inline-flex items-center gap-2 border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                <HelpCircle size={14} className="text-[var(--app-primary)]" />
                {renderedFaq.length} {copy.faqCount}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {renderedFaq.map((item, i) => (
              <Reveal key={item.id} delay={i * 70}>
                <article className="app-card group p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--app-primary)]/25">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--app-primary)]">
                    {copy.question}
                  </p>
                  <h3 className="text-base font-extrabold leading-snug text-[var(--app-primary-dark)]">
                    {item.message}
                  </h3>
                  <div className="mt-4 bg-[var(--app-surface-soft)] p-4">
                    <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
                      {copy.answer}
                    </p>
                    <p className="text-sm font-semibold leading-relaxed text-[var(--app-text)]">
                      {item.answer}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ ADDRESS в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section id="address" className="py-20 sm:py-32">
        <div className={`${sectionFrame} grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14`}>
          <Reveal direction="left" className="w-full">
            <div className="mx-auto w-full max-w-[34rem] lg:mx-0">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--app-primary)]">
                {copy.addressEyebrow}
              </p>
              <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-5xl">
                {copy.addressTitle}
              </h2>
              <p className="mt-5 max-w-md text-base font-bold leading-relaxed text-[var(--app-muted)]">
                {copy.addressText}
              </p>

              {/* Social links */}
              {settings.socialLinks && (
                <div className="mt-8 flex items-center gap-3">
                  {settings.socialLinks.telegram && (
                    <a
                      href={settings.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center bg-[var(--app-primary)]/10 text-[var(--app-primary)] transition-all hover:bg-[var(--app-primary)] hover:text-white active:scale-95"
                      title="Telegram"
                      aria-label={copy.socialLabels[0]}
                    >
                      <Send size={18} />
                    </a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center bg-[var(--app-accent)]/10 text-[var(--app-accent)] transition-all hover:bg-[var(--app-accent)] hover:text-white active:scale-95"
                      title="Instagram"
                      aria-label={copy.socialLabels[1]}
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {settings.socialLinks.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center bg-[var(--app-primary-dark)]/10 text-[var(--app-primary-dark)] transition-all hover:bg-[var(--app-primary-dark)] hover:text-white active:scale-95"
                      title="YouTube"
                      aria-label={copy.socialLabels[2]}
                    >
                      <Youtube size={18} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <div className="mx-auto w-full max-w-[34rem] lg:ml-auto lg:mr-0">
            <div className="grid w-full gap-4 sm:grid-cols-2">
            {[
              {
                icon: MapPin,
                label: copy.addressLabels[0],
                value: settings.address || copy.defaultAddress,
                color: "text-[var(--app-primary)]",
                bg: "bg-[var(--app-primary)]/10",
              },
              {
                icon: PhoneCall,
                label: copy.addressLabels[1],
                value: settings.phoneNumber || "+998 90 000 00 00",
                color: "text-[var(--app-accent)]",
                bg: "bg-[var(--app-accent)]/10",
              },
              {
                icon: Clock3,
                label: copy.addressLabels[2],
                value: settings.workingHours || copy.defaultHours,
                color: "text-[var(--app-primary-dark)]",
                bg: "bg-[var(--app-primary-dark)]/10",
              },
              {
                icon: Building2,
                label: copy.addressLabels[3],
                value: copy.formatValue,
                color: "text-[var(--app-secondary)]",
                bg: "bg-[var(--app-secondary)]/10",
              },
            ].map(({ icon: Icon, label, value, color, bg }, i) => (
              <Reveal key={label} delay={i * 80} direction="up">
                <div className="app-card group p-6 transition-all hover:-translate-y-1">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center ${bg} ${color} transition-transform group-hover:rotate-6 group-hover:scale-105`}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-extrabold leading-snug text-[var(--app-primary-dark)]">
                    {value}
                  </p>
                </div>
              </Reveal>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ CONTACT FORM в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <section
        id="contact"
        className="border-t border-[var(--app-border)] bg-[var(--app-surface-soft)]/30 py-20 sm:py-32"
      >
        <div className="mx-auto w-full max-w-[920px] px-6 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                <Send size={32} />
              </div>
              <h2 className="mb-3 text-4xl font-extrabold uppercase tracking-tighter text-[var(--app-primary-dark)] md:text-6xl">
                {copy.contactTitle}
              </h2>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--app-muted)]">
                {copy.contactText}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="glass-card p-7 sm:p-10" noValidate>
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {formStatus === "success"
                  ? copy.sent
                  : formStatus === "error"
                  ? copy.sendError
                  : ""}
              </div>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {copy.fullName}
                  </label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (fieldErrors.fullName) {
                        setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                      }
                    }}
                    type="text"
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? "landing-fullName-error" : undefined}
                    className="w-full border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all placeholder:text-[var(--app-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20"
                    placeholder="Ali Valiyev"
                  />
                  {fieldErrors.fullName && (
                    <p id="landing-fullName-error" className="mt-2 text-xs font-bold text-red-500">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {copy.phone}
                  </label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                    type="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "landing-phone-error" : undefined}
                    className="w-full border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all placeholder:text-[var(--app-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20"
                    placeholder="+998 90 123 45 67"
                  />
                  {fieldErrors.phone && (
                    <p id="landing-phone-error" className="mt-2 text-xs font-bold text-red-500">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {copy.message}
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (fieldErrors.message) {
                        setFieldErrors((prev) => ({ ...prev, message: "" }));
                      }
                    }}
                    rows={4}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? "landing-message-error" : undefined}
                    className="w-full resize-none border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 text-sm font-bold text-[var(--app-text)] transition-all placeholder:text-[var(--app-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20"
                    placeholder="IELTS kursi qachon boshlanadi?"
                  />
                  {fieldErrors.message && (
                    <p id="landing-message-error" className="mt-2 text-xs font-bold text-red-500">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="btn-premium mt-2 w-full border-none bg-[var(--app-secondary)] py-5 text-base text-white disabled:opacity-60"
                >
                  {formStatus === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {copy.sending}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send size={18} />
                      {copy.sendQuestion}
                    </span>
                  )}
                </button>
              </div>

              {formStatus === "success" && (
                <div className="mt-5 flex items-center gap-2 border border-[#9cd7be] bg-[#eefaf4] px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-[#1e6c4d]">
                  <CheckCircle2 size={16} />
                  {copy.sent}
                </div>
              )}
              {formStatus === "error" && (
                <p className="mt-5 text-center text-xs font-black uppercase tracking-widest text-red-500">
                  {copy.sendError}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      {/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ FOOTER в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */}
      <footer className="border-t border-[var(--app-border)] bg-[var(--app-surface)]/60 py-10">
        <div className={`${sectionFrame} grid gap-5 text-center lg:grid-cols-3 lg:items-center`}>
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="relative h-8 w-8 overflow-hidden border border-[var(--app-border)]">
              <Image
                src={settings.logoUrl}
                alt={settings.shortName}
                fill
                unoptimized
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-black tracking-tight">
              {settings.name}
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)] lg:text-center">
            © 2026 {settings.name} · {copy.rights}
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)] lg:justify-end">
            <button
              onClick={() => scrollTo("about")}
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              {copy.nav[0]}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              {copy.nav[5]}
            </button>
            <button
              onClick={() => scrollTo("questions")}
              className="transition-colors hover:text-[var(--app-primary)]"
            >
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

