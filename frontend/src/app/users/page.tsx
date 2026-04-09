'use client';

import { useState } from 'react';
import { Filter, MoreVertical, Search, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { isRoleAllowedForPath } from '@/lib/role-access';
import { useUsers } from '@/hooks/useUsers';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
} from '@/app/components/ui/PagePrimitives';

export default function UsersPage() {
  const t = useTranslations('UsersPage');
  const uiT = useTranslations('UiStates');
  const { role, loading: authLoading } = useAuth();
  const canAccess = isRoleAllowedForPath('/users', role);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, loading, error, refetch } = useUsers(role, searchTerm, canAccess && !authLoading);

  if (!authLoading && !canAccess) return null;

  return (
    <PageShell
      title={t('title')}
      subtitle={t('total', { count: users.length })}
      action={
        <button className="rounded-[16px] bg-[var(--app-primary)] p-3 text-white shadow-lg shadow-black/10 transition-transform active:scale-95">
          <UserPlus size={20} strokeWidth={2.5} />
        </button>
      }
    >
      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
          />
        </div>
        <button className="rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3.5 text-[var(--app-muted)] shadow-sm transition-colors hover:text-[var(--app-text)]">
          <Filter size={18} />
        </button>
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
      ) : users.length === 0 ? (
        <PageEmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20 md:grid-cols-2">
          {users.map((user: any, index: number) => (
            <div key={user.id || index} className="app-card flex items-center gap-5 overflow-hidden p-6 transition-all active:scale-[0.98]">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] text-xl font-black shadow-inner ${
                  user.role === 'SUPERADMIN'
                    ? 'bg-[#FFEBEC] text-[#E54D2E]'
                    : user.role === 'TEACHER'
                      ? 'bg-[#F2F8F5] text-[#3D855A]'
                      : 'bg-blue-50 text-blue-600'
                }`}
              >
                {user.fullName?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold tracking-tight text-[var(--app-text)]">
                  {user.fullName || t('newUser')}
                </h3>
                <div className="mt-1.5 flex items-center gap-3 overflow-hidden">
                  <span className="whitespace-nowrap rounded-md border border-[var(--app-border)] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {user.role}
                  </span>
                  {user.cefrLevel ? (
                    <>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--app-border)]" />
                      <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-[var(--app-primary)]">
                        {user.cefrLevel}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <button className="shrink-0 p-3 text-[var(--app-muted)] transition-colors hover:text-[var(--app-text)]">
                <MoreVertical size={20} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
