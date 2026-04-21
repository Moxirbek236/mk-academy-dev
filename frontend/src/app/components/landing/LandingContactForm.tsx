'use client';

import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Send } from 'lucide-react';
import { createLead, type LeadPayload } from '@/lib/backend-api';

const EMPTY_FORM: LeadPayload = {
  fullName: '',
  phone: '',
  message: '',
};

type LeadField = keyof LeadPayload;

export function LandingContactForm() {
  const [formData, setFormData] = useState<LeadPayload>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const updateField = useCallback(
    (field: LeadField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((current) => ({
          ...current,
          [field]: event.target.value,
        }));
      },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        setStatus('loading');
        await createLead(formData);
        setFormData(EMPTY_FORM);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    },
    [formData],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="app-card motion-section bg-white/72 p-6 text-left shadow-xl shadow-slate-900/5 backdrop-blur-md sm:p-10"
    >
      <div className="space-y-5">
        <FieldLabel label="To'liq ism">
          <input
            required
            value={formData.fullName}
            onChange={updateField('fullName')}
            type="text"
            className="motion-input w-full rounded-2xl border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm outline-none focus:border-[var(--app-primary)]"
            placeholder="Ali Valiyev"
            autoComplete="name"
          />
        </FieldLabel>

        <FieldLabel label="Telefon raqam">
          <input
            required
            value={formData.phone}
            onChange={updateField('phone')}
            type="tel"
            className="motion-input w-full rounded-2xl border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm outline-none focus:border-[var(--app-primary)]"
            placeholder="+998 90 123 45 67"
            autoComplete="tel"
          />
        </FieldLabel>

        <FieldLabel label="Kurs haqida savol">
          <textarea
            required
            value={formData.message}
            onChange={updateField('message')}
            rows={3}
            className="motion-input w-full resize-none rounded-2xl border border-[var(--app-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm outline-none focus:border-[var(--app-primary)]"
            placeholder="IELTS kursi qachon boshlanadi?"
          />
        </FieldLabel>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-premium motion-button mt-2 w-full border-none bg-[var(--app-primary)] py-5 text-white shadow-xl shadow-[var(--app-primary)]/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={18} className="mr-2" />
          {status === 'loading' ? 'Yuborilmoqda...' : 'Savol yuborish'}
        </button>
      </div>

      {status === 'success' && (
        <p className="mt-6 text-center text-xs font-black uppercase text-blue-500">
          Savolingiz adminga yuborildi!
        </p>
      )}
      {status === 'error' && (
        <p className="mt-6 text-center text-xs font-black uppercase text-red-500">
          Xatolik yuz berdi!
        </p>
      )}
    </form>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[10px] font-black uppercase text-[var(--app-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
