'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';

export default function GenericSettingPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 app-page pb-nav-safe pt-4 sm:pt-6">
      <div className="mb-10 flex items-center gap-4">
        <button onClick={() => router.push('/settings')} className="border border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-[var(--app-text)] active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-[var(--app-primary-dark)]">Sozlama (Demo)</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest leading-none text-[var(--app-muted)]">Ushbu sahifa ishlab chiqish holatida</p>
        </div>
      </div>

      <div className="mb-12 flex flex-col items-center gap-8 border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center sm:p-12">
         <div className="border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8 text-[var(--app-primary)]">
            <Lock size={44} strokeWidth={2.5} className="animate-pulse" />
         </div>
         <div className="max-w-[80%]">
            <h2 className="mb-4 text-2xl font-black leading-8 tracking-tight text-[var(--app-primary-dark)]">Ushbu funksiya hozircha mavjud emas</h2>
            <p className="text-sm font-bold uppercase tracking-tighter text-[var(--app-muted)]">Kelgusidagi yangilanishlarda ushbu sahifa to&apos;liq funksional holatga keltiriladi. Hozirda asosiy profil sozlamalaridan foydalaning.</p>
         </div>
      </div>

      <button 
        onClick={() => router.push('/settings')}
        className="flex w-full items-center justify-center gap-3 border border-[var(--app-primary)] bg-[var(--app-primary)] p-6 font-black tracking-tight text-white uppercase transition-all active:scale-[0.98]"
      >
        ORQAGA QAYTISH
      </button>
    </div>
  );
}
