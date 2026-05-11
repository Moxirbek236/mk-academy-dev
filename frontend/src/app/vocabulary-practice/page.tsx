'use client';

import { useEffect, useMemo, useState } from 'react';
import { Brain, CheckCircle2, ChevronLeft, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { listVocabularies } from '@/lib/backend-api';
import { PageLoadingState, PageShell } from '@/app/components/ui/PagePrimitives';
import {
  Badge,
  EmptyBlock,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/app/components/ui/DataDisplay';

export default function VocabularyPracticePage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await listVocabularies({ limit: 100 });
        setWords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchWords();
  }, []);

  const progress = useMemo(() => {
    if (!words.length) return 0;
    return ((currentIndex + 1) / words.length) * 100;
  }, [currentIndex, words.length]);

  const handleNext = (_quality: number) => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <PageShell title="Vocabulary practice" subtitle="Mashq yuklanmoqda">
        <PageLoadingState title="So'zlar yuklanmoqda" description="Takrorlash kartalari tayyorlanmoqda" />
      </PageShell>
    );
  }

  if (words.length === 0) {
    return (
      <PageShell
        title="Vocabulary practice"
        subtitle="Mashq uchun so'z topilmadi"
        action={
          <button onClick={() => router.back()} className={secondaryButtonClass}>
            <ChevronLeft size={14} />
            Orqaga
          </button>
        }
      >
        <EmptyBlock
          title="Mashq uchun so'z yo'q"
          description="Vocabulary bazasiga so'z qo'shilgandan keyin bu yerda kartalar paydo bo'ladi."
          icon={Brain}
        />
      </PageShell>
    );
  }

  if (finished) {
    return (
      <PageShell title="Vocabulary practice" subtitle="Mashq yakunlandi">
        <div className="app-card mx-auto max-w-lg px-6 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={34} strokeWidth={2.5} />
          </div>
          <h1 className="mt-5 text-2xl font-black tracking-tight text-[var(--app-text)]">Mashq tugadi</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
            Barcha so'zlarni takrorlab bo'ldingiz. Natijani mustahkamlash uchun mashqni yana boshlashingiz mumkin.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                setFinished(false);
                setCurrentIndex(0);
                setShowTranslation(false);
              }}
              className={primaryButtonClass}
            >
              <RotateCcw size={15} />
              Qayta boshlash
            </button>
            <button onClick={() => router.push('/')} className={secondaryButtonClass}>
              Dashboard
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const word = words[currentIndex];

  return (
    <PageShell
      title="Vocabulary practice"
      subtitle={`${currentIndex + 1}/${words.length} karta`}
      action={
        <button onClick={() => router.back()} className={secondaryButtonClass}>
          <ChevronLeft size={14} />
          Orqaga
        </button>
      }
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 rounded-lg border border-[var(--app-border)] bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Badge tone="primary">Progress</Badge>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--app-surface-soft)]">
            <div
              className="h-full rounded-full bg-[var(--app-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranslation((current) => !current)}
          className="app-card relative min-h-[320px] w-full px-6 py-8 text-center transition-all active:scale-[0.99] sm:min-h-[380px] sm:px-10"
          aria-pressed={showTranslation}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-primary)]">
            <Brain size={32} strokeWidth={2.5} />
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
            Tarjimani ko'rish uchun kartani bosing
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--app-text)] sm:text-5xl">
            {word.word}
          </h2>
          <p className="mt-3 text-xs font-black uppercase tracking-widest text-[var(--app-muted)]">
            {word.pronunciation || '/.../'}
          </p>

          <div
            className={`mx-auto mt-8 max-w-md transition-all duration-300 ${
              showTranslation ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <div className="mx-auto mb-5 h-px w-20 bg-[var(--app-border)]" />
            <h3 className="text-2xl font-black tracking-tight text-[var(--app-primary)]">
              {word.translation}
            </h3>
            <p className="mt-4 text-sm font-semibold italic leading-relaxed text-[var(--app-muted)]">
              &quot;{word.exampleSentence || 'Misol gap hozircha mavjud emas'}&quot;
            </p>
          </div>

          <span className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--app-border)] bg-white text-[var(--app-muted)]">
            <Volume2 size={18} />
          </span>
        </button>

        <div className="mt-5 grid grid-cols-2 gap-3 pb-10">
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleNext(1);
            }}
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-4 text-rose-600 transition-all active:scale-95"
          >
            <XCircle size={25} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Unutdim</span>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleNext(5);
            }}
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 transition-all active:scale-95"
          >
            <CheckCircle2 size={25} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Bilaman</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
