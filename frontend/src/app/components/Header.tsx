'use client';

import { User, Layers, Activity, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  role?: string | null;
}

export function Header({ role }: HeaderProps) {
  const t = useTranslations('Header');
  const currentRole = role?.toLowerCase();
  const isStudent = currentRole === 'student' || !currentRole;
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';
  const isAdmin = currentRole === 'admin' || currentRole === 'superadmin';

  return (
    <div
      className={`relative z-0 overflow-hidden border-b border-[var(--app-border)] px-safe pb-6 pt-[calc(1rem+var(--app-safe-top))] shadow-sm sm:px-6 sm:pt-7 ${
        isAdmin
          ? 'bg-[linear-gradient(180deg,rgba(37,99,235,0.12),rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(19,32,44,0.98))]'
          : 'bg-[linear-gradient(180deg,rgba(37,99,235,0.10),rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.16),rgba(19,32,44,0.98))]'
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
          <h1 className="truncate text-[1.35rem] font-black tracking-tight text-[var(--app-text)] sm:text-2xl">{t('title')}</h1>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] sm:text-xs">
            {currentRole === 'superadmin'
              ? t('subtitleSuperadmin')
              : currentRole === 'admin'
                ? t('subtitleAdmin')
              : isTeacher
                  ? t('subtitleTeacher')
                  : t('subtitleStudent')}
          </p>
          </div>
          <div className="app-touch flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-primary)] shadow-sm transition-all group">
            <User size={20} className="transition-transform group-hover:scale-105" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:justify-end">
          <LanguageSwitcher className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
          <ThemeToggle className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
        </div>
      </div>

      {isStudent && (
        <>
          <div className="relative z-10 mt-6 sm:mt-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)] sm:text-[11px]">{t('progress')}</p>
            <div className="h-3 w-full overflow-hidden rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)]">
              <div className="h-full w-1/5 rounded-full bg-[var(--app-primary)]" />
            </div>
            <div className="flex justify-between items-center mt-3">
               <span className="text-xs font-black tracking-tight text-[var(--app-text)] sm:text-sm">20% {t('done')}</span>
               <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">Level A2</span>
            </div>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm">
              <p className="text-lg font-black text-[var(--app-text)] sm:text-xl">1/5</p>
              <p className="mt-1 text-[9px] font-bold uppercase text-[var(--app-muted)] sm:text-[10px]">{t('tasks')}</p>
            </div>
            <div className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm">
              <p className="text-lg font-black text-[var(--app-accent)] sm:text-xl">3</p>
              <p className="mt-1 text-[9px] font-bold uppercase text-[var(--app-muted)] sm:text-[10px]">{t('daysLeft')}</p>
            </div>
            <div className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm">
              <p className="text-lg font-black text-[var(--app-text)] sm:text-xl">0</p>
              <p className="mt-1 text-[9px] font-bold uppercase text-[var(--app-muted)] sm:text-[10px]">{t('errors')}</p>
            </div>
          </div>
        </>
      )}

      {isTeacher && (
        <div className="flex gap-2.5 mt-8 relative z-10">
          <div className="flex flex-1 items-center gap-3 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
            <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]"><Layers size={20} /></div>
            <div>
              <p className="text-lg font-black leading-none text-[var(--app-text)]">3 ta</p>
              <p className="text-[10px] font-bold text-[var(--app-muted)] mt-1 uppercase">GURUH</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
             <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]"><Users size={20} /></div>
             <div>
              <p className="text-lg font-black leading-none text-[var(--app-text)]">35 ta</p>
              <p className="text-[10px] font-bold text-[var(--app-muted)] mt-1 uppercase">O&apos;QUVCHI</p>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex gap-2.5 mt-8 relative z-10">
           <div className="flex flex-1 items-center gap-3 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
             <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]"><Activity size={20} /></div>
             <div>
               <p className="text-lg font-black leading-none text-[var(--app-text)]">100%</p>
               <p className="text-[10px] font-bold text-[var(--app-muted)] mt-1 uppercase">UPTIME</p>
             </div>
           </div>
           <div className="flex flex-1 items-center gap-3 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
              <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]"><TrendingUp size={20} /></div>
              <div>
               <p className="text-lg font-black leading-none text-[var(--app-text)]">+12.5%</p>
               <p className="text-[10px] font-bold text-[var(--app-muted)] mt-1 uppercase">O&apos;SISH</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
