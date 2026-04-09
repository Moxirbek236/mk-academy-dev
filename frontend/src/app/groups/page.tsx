'use client';

import { useState } from 'react';
import { BookOpen, Calendar, ChevronRight, PlusCircle, Search, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useGroups } from '@/hooks/useGroups';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
} from '@/app/components/ui/PagePrimitives';

export default function GroupsPage() {
  const t = useTranslations('GroupsPage');
  const uiT = useTranslations('UiStates');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: groups, loading, error, refetch } = useGroups(searchTerm);

  return (
    <PageShell
      title={t('title')}
      subtitle={t('subtitle')}
      action={
        <button className="rounded-[16px] bg-[var(--app-primary)] p-3 text-white shadow-lg shadow-black/10 transition-transform active:scale-95">
          <PlusCircle size={20} strokeWidth={2.5} />
        </button>
      }
    >
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] py-4 pl-11 pr-4 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('invitePlaceholder')}
            className="flex-1 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-4 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
          />
          <button className="rounded-[18px] bg-[var(--app-primary)] px-6 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-transform active:scale-95">
            {t('join')}
          </button>
        </div>
      </div>

      {loading ? (
        <PageLoadingState title={uiT('loadingTitle')} description={uiT('loadingDescription')} />
      ) : error ? (
        <PageErrorState
          title={uiT('errorTitle')}
          description={error || uiT('errorDescription')}
          retryLabel={uiT('retry')}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : groups.length > 0 ? (
        <div className="flex flex-col gap-4 pb-20">
          {groups.map((group: any, index: number) => (
            <div key={index} className="app-card group flex items-center gap-5 p-6 transition-all active:scale-[0.98]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#F2F8F5] text-xl font-black text-[#3D855A] shadow-inner shadow-[#3D855A]/10 transition-all group-hover:scale-105 group-hover:rotate-3 group-hover:bg-[#3D855A] group-hover:text-white">
                {group.name.charAt(0)}
              </div>
              <div className="flex-1 truncate">
                <h3 className="mb-2 truncate text-lg font-extrabold leading-tight tracking-tight text-[var(--app-text)] transition-transform group-hover:translate-x-1">
                  {group.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 rounded-md bg-[var(--app-surface-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-[var(--app-muted)]">
                    <Users size={12} strokeWidth={2.5} /> {t('studentsShort', { count: group._count?.members || 0 })}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-md bg-[color:color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-[var(--app-primary)]">
                    <BookOpen size={12} strokeWidth={2.5} /> {t('active')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="rounded-full bg-[var(--app-surface-soft)] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                  {group.inviteCode}
                </span>
                <div className="rounded-2xl bg-[var(--app-surface-soft)] p-3 text-[var(--app-muted)] shadow-sm transition-all group-hover:bg-[var(--app-primary)] group-hover:text-white">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <PageEmptyState title={t('empty')} description={t('emptyDescription')} />
      )}

      <div className="mt-8 flex justify-center border-t border-gray-100/10 pb-8 pt-8">
        <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest tracking-tighter text-[var(--app-muted)] transition-colors hover:text-[var(--app-text)]">
          <Calendar size={16} /> {t('fullSchedule')}
        </button>
      </div>
    </PageShell>
  );
}
