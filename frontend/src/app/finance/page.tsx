'use client';

import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, Loader2, PlusCircle, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFinance } from '@/hooks/useFinance';
import { createFinanceTransaction, TRANSACTION_TYPES, type TransactionType } from '@/lib/backend-api';
import { hasRoleCapability, isRoleAllowedForPath } from '@/lib/role-access';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
} from '@/app/components/ui/PagePrimitives';

const EMPTY_FORM = {
  userId: '',
  amount: '',
  type: 'INCOME' as TransactionType,
  reason: '',
};

export default function FinancePage() {
  const { role, loading: authLoading } = useAuth();
  const canAccess = isRoleAllowedForPath('/finance', role);
  const canManageFinance = hasRoleCapability(role, 'manage_finance');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const { data, loading, error, refetch } = useFinance(canAccess && !authLoading);

  if (!authLoading && !canAccess) return null;

  async function handleCreateTransaction() {
    try {
      setSubmitting(true);
      setMutationError(null);

      await createFinanceTransaction({
        userId: Number(form.userId),
        amount: Number(form.amount),
        type: form.type,
        reason: form.reason,
      });

      setForm(EMPTY_FORM);
      setIsFormOpen(false);
      await refetch();
    } catch (financeError) {
      setMutationError(financeError instanceof Error ? financeError.message : "Tranzaksiyani yaratib bo'lmadi");
    } finally {
      setSubmitting(false);
    }
  }

  const summary = data.summary || { income: 0, expense: 0, balance: 0 };
  const transactions = data.transactions || [];

  return (
    <PageShell
      title="Finance"
      subtitle={`Jami tranzaksiya: ${transactions.length} ta`}
      action={
        canManageFinance ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="rounded-[16px] bg-[var(--app-primary)] p-3 text-white shadow-lg shadow-black/10 transition-transform active:scale-95"
          >
            <PlusCircle size={20} strokeWidth={2.5} />
          </button>
        ) : undefined
      }
    >
      {mutationError ? (
        <div className="mb-4 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {mutationError}
        </div>
      ) : null}

      {loading ? (
        <PageLoadingState title="Finance ma'lumotlari yuklanmoqda" description="Summary va transactionlar olinmoqda" />
      ) : error ? (
        <PageErrorState
          title="Finance sahifasida xatolik"
          description={error}
          retryLabel="Qayta urinish"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="app-card p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--app-surface-soft)] text-[var(--app-primary)]">
                <Wallet size={22} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">Balance</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-[var(--app-text)]">
                {Number(summary.balance || 0).toLocaleString()}
              </p>
            </div>
            <div className="app-card p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-emerald-50 text-emerald-600">
                <ArrowUpRight size={22} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">Income</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-[var(--app-text)]">
                {Number(summary.income || 0).toLocaleString()}
              </p>
            </div>
            <div className="app-card p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-red-50 text-red-600">
                <ArrowDownRight size={22} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">Expense</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-[var(--app-text)]">
                {Number(summary.expense || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <PageEmptyState title="Tranzaksiyalar topilmadi" description="Hali finance yozuvlari mavjud emas." />
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-20">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="app-card flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${transaction.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {transaction.type === 'INCOME' ? (
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight size={20} strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-extrabold tracking-tight text-[var(--app-text)]">
                      {transaction.user?.fullName || transaction.reason || 'System transaction'}
                    </h3>
                    <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">
                      {transaction.reason || 'No reason'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black tracking-tight text-[var(--app-text)]">
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {Number(transaction.amount || 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-[26px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[var(--app-text)]">Yangi tranzaksiya</h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                  CreateTransactionDto
                </p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="rounded-[14px] bg-[var(--app-surface-soft)] p-3 text-[var(--app-muted)]">
                <DollarSign size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={form.userId}
                onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))}
                placeholder="User ID"
                className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <input
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Amount"
                type="number"
                className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as TransactionType }))}
                className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              >
                {TRANSACTION_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                value={form.reason}
                onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Reason"
                className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 rounded-[16px] border border-[var(--app-border)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)]"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => void handleCreateTransaction()}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[var(--app-primary)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-60"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                Saqlash
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
