'use client';

import { User, Activity, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './notifications/NotificationBell';
import { useCenterBranding } from './branding/CenterBrandingProvider';

interface HeaderProps {
  role?: string | null;
}

export function Header({ role }: HeaderProps) {
  const t = useTranslations('Header');
  const { centerBranding } = useCenterBranding();
  const currentRole = role?.toLowerCase();
  const isAdmin = currentRole === 'admin' || currentRole === 'superadmin';
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';
  const summaryCards = isAdmin
    ? [
        { label: 'System uptime', value: '100%', icon: Activity },
        { label: 'Operations trend', value: '+12.5%', icon: TrendingUp },
      ]
    : [
        { label: 'Active users', value: '35', icon: Users },
        { label: 'Daily activity', value: '20%', icon: Activity },
      ];

  return (
    <div
      className="relative z-0 overflow-hidden border-b border-[var(--app-border)] bg-[var(--sidebar)] px-safe pb-4 pt-[calc(0.85rem+var(--app-safe-top))] sm:px-6 sm:pb-6 sm:pt-7"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0">
          <h1 className="truncate text-[1.2rem] font-black tracking-tight text-[var(--app-text)] sm:text-2xl">
            {centerBranding.shortName}
          </h1>
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
          <div className="app-touch flex h-10 w-10 items-center justify-center border border-[var(--app-border)] bg-white text-[var(--app-primary)] transition-all group sm:h-11 sm:w-11">
            <User size={20} className="transition-transform group-hover:scale-105" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:justify-end">
          <NotificationBell />
          <LanguageSwitcher className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="flex flex-1 items-center gap-3 border border-[var(--app-border)] bg-white p-4">
              <div className="bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]"><Icon size={20} /></div>
              <div>
                <p className="text-lg font-black leading-none text-[var(--app-text)]">{card.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase text-[var(--app-muted)]">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
