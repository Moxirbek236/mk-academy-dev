"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock,
  GraduationCap,
  LogIn,
  MailQuestion,
  MapPin,
  Menu,
  Monitor,
  Phone,
  Send,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { createLead, getPublicCenterSettings } from "@/lib/backend-api";
import {
  DEFAULT_ABOUT_POINTS,
  DEFAULT_CENTER_BRANDING,
  DEFAULT_COURSE_TRACKS,
  DEFAULT_TEAM_MEMBERS,
  normalizeCenterBranding,
  type CenterBranding,
} from "@/lib/branding";
import { useCenterBranding } from "./branding/CenterBrandingProvider";
import "./landing.css";

const navLinks = [
  { label: "Biz haqimizda", href: "#about" },
  { label: "Imkoniyatlar", href: "#features" },
  { label: "Kurslar", href: "#courses" },
  { label: "Jamoa", href: "#team" },
  { label: "Savollar", href: "#faq" },
  { label: "Bog'lanish", href: "#contact" },
];

const features = [
  {
    icon: BookOpen,
    title: "CEFR yo'nalishi",
    desc: "A1 dan C2 gacha bosqichma-bosqich o'quv rejasi.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    desc: "XP, reyting va natijalar orqali doimiy motivatsiya.",
  },
  {
    icon: Users,
    title: "Mentor nazorati",
    desc: "Guruhlar, topshiriqlar va fikr-mulohaza bitta platformada.",
  },
];

const faqItems = [
  {
    question: "Qaysi darajadan boshlashim kerak?",
    answer:
      "Avval qisqa placement test topshirasiz. Natijaga qarab sizga mos kurs va guruh tavsiya qilinadi.",
  },
  {
    question: "IELTS kursi qancha davom etadi?",
    answer:
      "Odatda 3-6 oy. Aniq muddat boshlang'ich daraja va target ballga bog'liq.",
  },
  {
    question: "Online o'qish mumkinmi?",
    answer:
      "Ha, markaz sozlamalariga qarab offline, online yoki hybrid formatdagi guruhlar mavjud bo'lishi mumkin.",
  },
];

const courseColors = [
  "from-blue-500 to-blue-700",
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-rose-500 to-rose-700",
  "from-cyan-500 to-cyan-700",
  "from-amber-500 to-amber-700",
];

function usePublicLandingSettings() {
  const { centerBranding } = useCenterBranding();
  const [settings, setSettings] = useState<CenterBranding>(
    normalizeCenterBranding(centerBranding),
  );

  useEffect(() => {
    let active = true;

    getPublicCenterSettings()
      .then((data) => {
        if (active) {
          setSettings(normalizeCenterBranding(data));
        }
      })
      .catch(() => {
        if (active) {
          setSettings(normalizeCenterBranding(centerBranding));
        }
      });

    return () => {
      active = false;
    };
  }, [centerBranding]);

  return settings;
}

export function LandingPage() {
  const settings = usePublicLandingSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    message: "",
  });

  const aboutPoints = settings.aboutPoints?.length
    ? settings.aboutPoints
    : DEFAULT_ABOUT_POINTS;
  const courses = settings.courseTracks?.length
    ? settings.courseTracks
    : DEFAULT_COURSE_TRACKS;
  const team = settings.teamMembers?.length
    ? settings.teamMembers
    : DEFAULT_TEAM_MEMBERS;

  const stats = useMemo(
    () => [
      { value: "500+", label: "O'quvchilar" },
      { value: `${Math.max(courses.length, 3)}+`, label: "Kurslar" },
      { value: "94%", label: "Muvaffaqiyat" },
      { value: "7.5", label: "IELTS o'rtacha" },
      { value: "48+", label: "Guruhlar" },
      { value: `${Math.max(team.length, 3)}+`, label: "Mentorlar" },
    ],
    [courses.length, team.length],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    setLoading(true);
    try {
      await createLead({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      toast.success("Yuborildi!", {
        description: "Admin tez orada siz bilan bog'lanadi.",
      });
      setForm({ fullName: "", phone: "", message: "" });
    } catch {
      toast.error("Xabar yuborilmadi", {
        description: "Aloqani tekshirib, qayta urinib ko'ring.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-v2 min-h-screen">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="#hero" className="flex min-w-0 items-center gap-2 text-xl font-bold text-foreground">
            <img
              src={settings.logoUrl || DEFAULT_CENTER_BRANDING.logoUrl}
              alt={settings.shortName}
              className="h-9 w-9 rounded-md object-cover"
            />
            <span className="truncate">{settings.shortName}</span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button asChild className="hidden gap-2 md:inline-flex">
            <Link href="/login">
              <LogIn className="h-4 w-4" /> Kirish
            </Link>
          </Button>
          <button
            type="button"
            aria-label="Menyuni ochish"
            className="md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="space-y-3 border-t border-border bg-background px-4 pb-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-muted-foreground"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="w-full gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" /> Kirish
              </Link>
            </Button>
          </div>
        )}
      </nav>

      <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(224_76%_48%/0.12),transparent_36%),radial-gradient(circle_at_bottom_left,hsl(162_69%_42%/0.10),transparent_30%)]" />
        <div className="mx-auto w-full max-w-4xl space-y-8 px-4 pb-24 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Ingliz tilini biz bilan o'rganing
          </div>
          <h1 className="text-5xl font-extrabold tracking-normal md:text-7xl">
            {settings.name}
            <br />
            <span className="text-gradient text-3xl font-semibold md:text-5xl">
              English mastery shu yerdan boshlanadi
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {settings.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-8 text-base">
              <a href="#contact">
                Boshlash <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 px-8 text-base">
              <a href="#about">
                Batafsil <ChevronDown className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="px-8 text-base">
              <Link href="/public-exam">Ochiq imtihon</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/70 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24">
        <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Biz haqimizda</p>
            <h2 className="mb-5 text-3xl font-bold md:text-4xl">Har bir o'quvchi uchun aniq o'sish yo'li</h2>
            <p className="text-muted-foreground">{settings.aboutText}</p>
          </div>
          <div className="grid gap-3">
            {aboutPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
                <Star className="mt-0.5 h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section-alt py-24">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary">Imkoniyatlar</p>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Ta'lim jarayoni bitta tizimda</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-md border border-border bg-card p-6">
                <div className="hero-gradient mb-5 flex h-11 w-11 items-center justify-center rounded-md">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-24">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary">Yo'nalishlar</p>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Sizga mos kurs</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {courses.map((course, index) => (
              <div key={`${course.title}-${index}`} className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
                <div className={`h-2 bg-gradient-to-r ${courseColors[index % courseColors.length]}`} />
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-4 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {course.level}
                  </span>
                  <h3 className="mb-2 text-xl font-bold">{course.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{course.desc}</p>
                  <Button asChild className="mt-6 w-full gap-2">
                    <a href="#contact">
                      Kursga yozilish <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section-alt py-24">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary">Jamoa</p>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Siz bilan ishlaydigan mentorlar</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="overflow-hidden rounded-md border border-border bg-card">
                <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary">Savollar</p>
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Ko'p so'raladigan savollar</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-md border border-border bg-card p-5">
                <h3 className="font-bold">{item.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-alt py-24">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-primary">Bog'lanish</p>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Biz bilan yaqinroq tanishing</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Kurs, guruh yoki jadval haqida yozing, admin javob beradi.
          </p>
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Manzil", value: settings.address },
                { icon: Phone, label: "Aloqa", value: settings.phoneNumber },
                { icon: Clock, label: "Ish vaqti", value: settings.workingHours },
                { icon: Monitor, label: "Format", value: "Offline, online va hybrid guruhlar" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="hero-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <MailQuestion className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Savolingizni yuboring</h3>
              </div>
              <Input
                placeholder="To'liq ism"
                value={form.fullName}
                onChange={(event) => setForm((value) => ({ ...value, fullName: event.target.value }))}
                required
              />
              <Input
                placeholder="Telefon raqam"
                value={form.phone}
                onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
                required
              />
              <Textarea
                placeholder="Savol yoki xabar"
                rows={4}
                value={form.message}
                onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))}
                required
              />
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="h-4 w-4" /> {loading ? "Yuborilmoqda..." : "Yuborish"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <GraduationCap className="h-5 w-5 text-primary" />
            {settings.name}
          </div>
          <div>© 2026 {settings.name}. Barcha huquqlar himoyalangan.</div>
        </div>
      </footer>
    </div>
  );
}
