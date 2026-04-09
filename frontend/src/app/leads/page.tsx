'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Loader2, MessageSquare, RefreshCw, Search, Trash2, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { deleteLead, type LeadStatus, updateLeadStatus } from '@/lib/backend-api';
import { hasRoleCapability, isRoleAllowedForPath } from '@/lib/role-access';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
} from '@/app/components/ui/PagePrimitives';

const LEAD_FILTERS: Array<LeadStatus | 'ALL'> = ['ALL', 'NEW', 'CONTACTED', 'ENROLLED', 'REJECTED'];

export default function LeadsPage() {
  const { role, loading: authLoading } = useAuth();
  const canAccess = isRoleAllowedForPath('/leads', role);
  const canManageLeads = hasRoleCapability(role, 'manage_leads');
  const [filter, setFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [mutationError, setMutationError] = useState<string | null>(null);
  const { data: leads, loading, error, refetch } = useLeads(canAccess && !authLoading);

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead: any) => {
        const matchesStatus = filter === 'ALL' || lead.status === filter;
        const matchesSearch =
          !search.trim() ||
          `${lead.fullName} ${lead.phone} ${lead.message || ''}`.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [filter, leads, search],
  );

  if (!authLoading && !canAccess) return null;

  async function handleStatusChange(id: number, status: LeadStatus) {
    try {
      setMutationError(null);
      await updateLeadStatus(id, status);
      await refetch();
    } catch (leadError) {
      setMutationError(leadError instanceof Error ? leadError.message : "Lead statusini yangilab bo'lmadi");
    }
  }

  async function handleDelete(id: number) {
    try {
      setMutationError(null);
      await deleteLead(id);
      await refetch();
    } catch (leadError) {
      setMutationError(leadError instanceof Error ? leadError.message : "Leadni o'chirib bo'lmadi");
    }
  }

  return (
    <PageShell
      title="Leads"
      subtitle={`Jami murojaat: ${filteredLeads.length} ta`}
      action={
        <button
          onClick={() => {
            void refetch();
          }}
          className="rounded-[16px] bg-[var(--app-primary)] p-3 text-white shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          <RefreshCw size={20} strokeWidth={2.5} />
        </button>
      }
    >
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Lead qidirish..."
            className="w-full rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {LEAD_FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${filter === item ? 'bg-[var(--app-primary)] text-white' : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {mutationError ? (
        <div className="mb-4 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {mutationError}
        </div>
      ) : null}

      {loading ? (
        <PageLoadingState title="Leadlar yuklanmoqda" description="Landing orqali kelgan murojaatlar olinmoqda" />
      ) : error ? (
        <PageErrorState
          title="Leadlarni olishda xatolik"
          description={error}
          retryLabel="Qayta urinish"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : filteredLeads.length === 0 ? (
        <PageEmptyState title="Leadlar topilmadi" description="Hozircha filterga mos murojaat yo'q." />
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20">
          {filteredLeads.map((lead: any) => (
            <div key={lead.id} className="app-card flex flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[var(--app-surface-soft)] text-lg font-black text-[var(--app-primary)]">
                  {lead.fullName?.charAt(0) || 'L'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-extrabold tracking-tight text-[var(--app-text)]">{lead.fullName}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[var(--app-surface-soft)] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                      {lead.phone}
                    </span>
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-700">
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>

              {lead.message ? (
                <div className="rounded-[16px] bg-[var(--app-surface-soft)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    <MessageSquare size={12} className="text-[var(--app-primary)]" />
                    Message
                  </p>
                  <p className="text-sm font-semibold leading-relaxed text-[var(--app-text)]">{lead.message}</p>
                </div>
              ) : null}

              <div className={`grid gap-2 ${canManageLeads ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                <button
                  onClick={() => void handleStatusChange(lead.id, 'CONTACTED')}
                  className="flex items-center justify-center gap-2 rounded-[14px] bg-amber-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                >
                  <Clock size={14} />
                  Contacted
                </button>
                <button
                  onClick={() => void handleStatusChange(lead.id, 'ENROLLED')}
                  className="flex items-center justify-center gap-2 rounded-[14px] bg-blue-600 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                >
                  <CheckCircle2 size={14} />
                  Enrolled
                </button>
                <button
                  onClick={() => void handleStatusChange(lead.id, 'REJECTED')}
                  className="flex items-center justify-center gap-2 rounded-[14px] bg-slate-700 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                >
                  <XCircle size={14} />
                  Rejected
                </button>
                <button
                  onClick={() => void handleDelete(lead.id)}
                  className="flex items-center justify-center gap-2 rounded-[14px] bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
