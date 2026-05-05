'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Award, Loader2, Medal, Plus, RefreshCcw, Star, Trash2, Trophy } from 'lucide-react';
import {
  addXp,
  createRating,
  deleteRating,
  getCurrentProfile,
  getLeaderboard,
  getRatingsByTarget,
  getStudentAchievements,
  getXpRank,
  listAchievements,
  listRatings,
} from '@/lib/backend-api';
import { PageErrorState, PageLoadingState, PageShell } from '@/app/components/ui/PagePrimitives';

type AnyRecord = Record<string, any>;

const inputClass =
  'w-full border border-[var(--app-border)] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-primary)]';
const buttonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-primary)] bg-[var(--app-primary)] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95 disabled:opacity-60';
const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-border)] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-colors hover:bg-[var(--app-secondary)] disabled:opacity-60';

function getId(item: AnyRecord) {
  return Number(item?.id ?? item?.userId ?? item?.studentId ?? 0);
}

function getTitle(item: AnyRecord, fallback: string) {
  return item?.title ?? item?.name ?? item?.fullName ?? item?.student?.fullName ?? item?.user?.fullName ?? fallback;
}

function getProfileId(profile: AnyRecord | null) {
  const direct = Number(profile?.id ?? profile?.userId ?? profile?.studentId);
  return Number.isFinite(direct) && direct > 0 ? direct : null;
}

export default function GamificationPage() {
  const [achievements, setAchievements] = useState<AnyRecord[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<AnyRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<AnyRecord[]>([]);
  const [ratings, setRatings] = useState<AnyRecord[]>([]);
  const [targetRatings, setTargetRatings] = useState<AnyRecord[]>([]);
  const [xpRank, setXpRank] = useState<AnyRecord | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [ratingForm, setRatingForm] = useState({ targetType: 'course', targetId: '', score: '5', reviewText: '' });
  const [targetForm, setTargetForm] = useState({ targetType: 'course', targetId: '' });
  const [xpForm, setXpForm] = useState({ userId: '', amount: '10', reason: 'manual_adjustment' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const stats = useMemo(
    () => [
      { label: 'Achievements', value: achievements.length, icon: Award },
      { label: 'Mening yutuqlarim', value: studentAchievements.length, icon: Medal },
      { label: 'Leaderboard', value: leaderboard.length, icon: Trophy },
      { label: 'Ratings', value: ratings.length, icon: Star },
    ],
    [achievements.length, leaderboard.length, ratings.length, studentAchievements.length],
  );

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      setNotice(null);

      const profile = await getCurrentProfile().catch(() => null);
      const currentProfileId = getProfileId(profile);
      setProfileId(currentProfileId);
      if (currentProfileId) {
        setXpForm((current) => ({ ...current, userId: current.userId || String(currentProfileId) }));
      }

      const [achievementRes, leaderboardRes, ratingsRes, studentAchievementRes, xpRankRes] = await Promise.allSettled([
        listAchievements(),
        getLeaderboard(20),
        listRatings(),
        currentProfileId ? getStudentAchievements(currentProfileId) : Promise.resolve([]),
        currentProfileId ? getXpRank(currentProfileId) : Promise.resolve(null),
      ]);

      if (achievementRes.status === 'fulfilled') setAchievements(achievementRes.value);
      if (leaderboardRes.status === 'fulfilled') setLeaderboard(leaderboardRes.value);
      if (ratingsRes.status === 'fulfilled') setRatings(ratingsRes.value);
      if (studentAchievementRes.status === 'fulfilled') setStudentAchievements(studentAchievementRes.value);
      if (xpRankRes.status === 'fulfilled') setXpRank(xpRankRes.value);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gamification ma'lumotlarini yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreateRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setNotice(null);
      await createRating({
        targetType: ratingForm.targetType,
        targetId: ratingForm.targetId,
        score: Number(ratingForm.score),
        reviewText: ratingForm.reviewText || undefined,
      });
      setRatingForm((current) => ({ ...current, reviewText: '' }));
      setRatings(await listRatings());
      setNotice('Rating saqlandi');
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : "Rating saqlanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRating(id: number) {
    try {
      setSaving(true);
      await deleteRating(id);
      setRatings(await listRatings());
      setNotice("Rating o'chirildi");
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : "Rating o'chirilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleTargetRatings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setTargetRatings(await getRatingsByTarget(targetForm.targetType, targetForm.targetId));
      setNotice("Target ratinglari yuklandi");
    } catch (targetError) {
      setNotice(targetError instanceof Error ? targetError.message : "Target ratinglari yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddXp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setNotice(null);
      await addXp(Number(xpForm.userId), { amount: Number(xpForm.amount), reason: xpForm.reason || undefined });
      setXpRank(await getXpRank(Number(xpForm.userId)));
      setLeaderboard(await getLeaderboard(20));
      setNotice("XP so'rovi yuborildi");
    } catch (xpError) {
      setNotice(xpError instanceof Error ? xpError.message : "XP qo'shish backendda xatolik qaytardi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell title="Gamification" subtitle="Achievements, leaderboard va ratinglar">
        <PageLoadingState title="Gamification yuklanmoqda" description="Backend APIlardan ma'lumotlar olinmoqda" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Gamification" subtitle="Xatolik">
        <PageErrorState title="Ma'lumot yuklanmadi" description={error} retryLabel="Qayta urinish" onRetry={() => void loadData()} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Gamification"
      subtitle="Achievements, leaderboard, rating va XP boshqaruvi"
      action={
        <button onClick={() => void loadData()} className={ghostButtonClass}>
          <RefreshCcw size={14} />
          Yangilash
        </button>
      }
    >
      {notice ? (
        <div className="mb-4 border border-[var(--app-border)] bg-[var(--app-secondary)] px-4 py-3 text-sm font-bold text-[var(--app-primary)]">
          {notice}
        </div>
      ) : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="app-card p-4">
            <Icon className="text-[var(--app-primary)]" size={22} />
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-black text-[var(--app-text)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Leaderboard</h2>
            <div className="mt-4 space-y-2">
              {leaderboard.map((item, index) => (
                <div key={`${getId(item)}-${index}`} className="flex items-center justify-between border border-[var(--app-border)] bg-white px-4 py-3">
                  <div>
                    <p className="font-black text-[var(--app-text)]">#{index + 1} {getTitle(item, 'User')}</p>
                    <p className="text-xs font-semibold text-[var(--app-muted)]">ID: {getId(item) || '-'}</p>
                  </div>
                  <p className="text-lg font-black text-[var(--app-primary)]">{item?.xp ?? item?.points ?? item?.score ?? 0}</p>
                </div>
              ))}
              {!leaderboard.length ? <p className="text-sm font-semibold text-[var(--app-muted)]">Leaderboard bo'sh.</p> : null}
            </div>
          </div>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Achievements</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {achievements.map((item, index) => (
                <div key={`${item?.id ?? index}`} className="border border-[var(--app-border)] bg-white p-4">
                  <p className="font-black text-[var(--app-text)]">{getTitle(item, 'Achievement')}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--app-muted)]">{item?.description ?? item?.condition ?? 'Tavsif yoq'}</p>
                </div>
              ))}
              {!achievements.length ? <p className="text-sm font-semibold text-[var(--app-muted)]">Achievementlar topilmadi.</p> : null}
            </div>
          </div>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Mening rankim</h2>
            <pre className="mt-4 overflow-auto border border-[var(--app-border)] bg-white p-4 text-xs font-semibold text-[var(--app-text)]">
              {JSON.stringify({ profileId, xpRank, studentAchievements }, null, 2)}
            </pre>
          </div>
        </section>

        <section className="space-y-5">
          <form onSubmit={handleCreateRating} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Rating yaratish</h2>
            <div className="mt-4 grid gap-3">
              <input className={inputClass} value={ratingForm.targetType} onChange={(e) => setRatingForm({ ...ratingForm, targetType: e.target.value })} placeholder="targetType" required />
              <input className={inputClass} value={ratingForm.targetId} onChange={(e) => setRatingForm({ ...ratingForm, targetId: e.target.value })} placeholder="targetId" required />
              <input className={inputClass} type="number" min="1" max="5" value={ratingForm.score} onChange={(e) => setRatingForm({ ...ratingForm, score: e.target.value })} placeholder="score" required />
              <textarea className={`${inputClass} min-h-24`} value={ratingForm.reviewText} onChange={(e) => setRatingForm({ ...ratingForm, reviewText: e.target.value })} placeholder="Review text" />
              <button className={buttonClass} disabled={saving}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Saqlash
              </button>
            </div>
          </form>

          <form onSubmit={handleTargetRatings} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Target ratinglarini ko'rish</h2>
            <div className="mt-4 grid gap-3">
              <input className={inputClass} value={targetForm.targetType} onChange={(e) => setTargetForm({ ...targetForm, targetType: e.target.value })} placeholder="targetType" required />
              <input className={inputClass} value={targetForm.targetId} onChange={(e) => setTargetForm({ ...targetForm, targetId: e.target.value })} placeholder="targetId" required />
              <button className={ghostButtonClass} disabled={saving}>Yuklash</button>
            </div>
            {targetRatings.length ? <pre className="mt-4 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(targetRatings, null, 2)}</pre> : null}
          </form>

          <form onSubmit={handleAddXp} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">XP qo'shish</h2>
            <div className="mt-4 grid gap-3">
              <input className={inputClass} type="number" value={xpForm.userId} onChange={(e) => setXpForm({ ...xpForm, userId: e.target.value })} placeholder="userId" required />
              <input className={inputClass} type="number" value={xpForm.amount} onChange={(e) => setXpForm({ ...xpForm, amount: e.target.value })} placeholder="amount" required />
              <input className={inputClass} value={xpForm.reason} onChange={(e) => setXpForm({ ...xpForm, reason: e.target.value })} placeholder="reason" />
              <button className={buttonClass} disabled={saving}>XP yuborish</button>
            </div>
          </form>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Ratinglar</h2>
            <div className="mt-4 space-y-2">
              {ratings.map((item, index) => (
                <div key={`${item?.id ?? index}`} className="flex items-center justify-between gap-3 border border-[var(--app-border)] bg-white p-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--app-text)]">{item?.targetType ?? 'target'} #{item?.targetId ?? '-'}</p>
                    <p className="text-xs font-semibold text-[var(--app-muted)]">Score: {item?.score ?? '-'}</p>
                  </div>
                  {item?.id ? (
                    <button onClick={() => void handleDeleteRating(Number(item.id))} className={ghostButtonClass} disabled={saving}>
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
