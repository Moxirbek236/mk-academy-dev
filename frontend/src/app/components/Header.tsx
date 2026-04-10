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
      className={`relative z-0 overflow-hidden rounded-b-[40px] bg-gradient-to-br px-4 pb-7 pt-[calc(1rem+env(safe-area-inset-top))] text-white shadow-2xl sm:px-6 sm:pb-12 sm:pt-8 ${
        isAdmin
          ? 'from-[#065f46] via-[#10b981] to-[#059669]'
          : 'from-[#064e3b] via-[#10b981] to-[#047857]'
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
            <div className="h-3 w-full bg-black/15 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-[#34d399] to-[#fbbf24] w-1/5 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.6)]" />
            </div>
            <div className="flex justify-between items-center mt-3">
               <span className="text-xs font-black sm:text-sm tracking-tight">20% {t('done')}</span>
               <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">Level A2</span>
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
