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
      className={`relative z-0 overflow-hidden rounded-b-[32px] bg-gradient-to-br px-4 pb-7 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white shadow-md sm:px-5 sm:pb-10 sm:pt-7 ${
        isAdmin
          ? 'from-[#2B6A47] via-[#3A8B60] to-[#2F744E]'
          : 'from-[#236842] via-[#317F53] to-[#255e3c]'
      }`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#5BC28B]/10 rounded-full blur-3xl opacity-20" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
          <h1 className="truncate text-[1.35rem] font-black tracking-tight drop-shadow-sm sm:text-2xl">{t('title')}</h1>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider opacity-80 sm:text-xs">
            {currentRole === 'superadmin'
              ? t('subtitleSuperadmin')
              : currentRole === 'admin'
                ? t('subtitleAdmin')
                : isTeacher
                  ? t('subtitleTeacher')
                  : t('subtitleStudent')}
          </p>
          </div>
          <div className="app-touch flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition-all group hover:bg-white/20">
            <User size={22} className="text-white group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:justify-end">
          <LanguageSwitcher className="border-white/20 bg-white/10 text-white backdrop-blur" />
          <ThemeToggle className="border-white/20 bg-white/10 text-white backdrop-blur" />
        </div>
      </div>

      {isStudent && (
        <>
          <div className="relative z-10 mt-6 sm:mt-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-80 sm:text-[11px]">{t('progress')}</p>
            <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden border border-white/20">
              <div className="h-full bg-gradient-to-r from-[#83D1A5] to-[#5BC28B] w-1/5 rounded-full shadow-[0_0_15px_rgba(131,209,165,0.5)]" />
            </div>
            <div className="flex justify-between items-center mt-2.5">
               <span className="text-xs font-black sm:text-sm">20% {t('done')}</span>
               <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-lg border border-white/5 uppercase">Level A2</span>
            </div>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg">
              <p className="text-lg font-black sm:text-xl">1/5</p>
              <p className="mt-1 text-[9px] font-bold uppercase opacity-70 sm:text-[10px]">{t('tasks')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg">
              <p className="text-lg font-black text-amber-300 sm:text-xl">3</p>
              <p className="mt-1 text-[9px] font-bold uppercase opacity-70 sm:text-[10px]">{t('daysLeft')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-lg">
              <p className="text-lg font-black sm:text-xl">0</p>
              <p className="mt-1 text-[9px] font-bold uppercase opacity-70 sm:text-[10px]">{t('errors')}</p>
            </div>
          </div>
        </>
      )}

      {isTeacher && (
        <div className="flex gap-2.5 mt-8 relative z-10">
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl"><Layers size={20} /></div>
            <div>
              <p className="text-lg font-black leading-none">3 ta</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">GURUH</p>
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
             <div className="p-2 bg-white/15 rounded-xl"><Users size={20} /></div>
             <div>
              <p className="text-lg font-black leading-none">35 ta</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">O&apos;QUVCHI</p>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex gap-2.5 mt-8 relative z-10">
           <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
             <div className="p-2 bg-emerald-500/30 rounded-xl"><Activity size={20} /></div>
             <div>
               <p className="text-lg font-black leading-none">100%</p>
               <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">UPTIME</p>
             </div>
           </div>
           <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/30 rounded-xl"><TrendingUp size={20} /></div>
              <div>
               <p className="text-lg font-black leading-none">+12.5%</p>
               <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">O&apos;SISH</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
