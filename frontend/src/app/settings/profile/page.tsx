'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { updateCurrentProfile } from '@/lib/backend-api';
import { PageErrorState, PageLoadingState } from '@/app/components/ui/PagePrimitives';
import { disableSecureScreen, enableSecureScreen } from '@/lib/screen-security';
import { useCenterBranding } from '@/app/components/branding/CenterBrandingProvider';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { centerBranding } = useCenterBranding();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: profile, loading, error, refetch } = useProfile();

  useEffect(() => {
    void enableSecureScreen();

    return () => {
      void disableSecureScreen();
    };
  }, []);

  const normalizedProfile = useMemo(() => {
    const user = profile?.user || {};

    return {
      fullName: user.fullName || profile?.fullName || '',
      email: profile?.email || '',
      phone: user.phone || profile?.phone || '',
    };
  }, [profile]);

  useEffect(() => {
    setFullName(normalizedProfile.fullName);
  }, [normalizedProfile.fullName]);

  async function handleSave() {
    try {
      setSaving(true);
      await updateCurrentProfile({ fullName });
      await refetch();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (profileError) {
      console.error(profileError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
        <PageLoadingState title="Profil yuklanmoqda" description="Foydalanuvchi ma'lumotlari olinmoqda" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
        <PageErrorState
          title="Profilni olishda xatolik"
          description={error}
          retryLabel="Qayta urinish"
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <button onClick={() => router.back()} className="app-touch rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Profil sozlamalari</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {centerBranding.shortName} Profile
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-6 rounded-[24px] border border-[#dbeafe] bg-white p-4 shadow-sm shadow-[#eff6ff] sm:gap-8 sm:rounded-[42px] sm:p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] text-3xl font-black text-white shadow-lg shadow-[#2563eb]/20 sm:h-28 sm:w-28 sm:text-4xl">
            {(fullName || normalizedProfile.fullName || 'U').charAt(0)}
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest px-2">TO&apos;LIQ ISM</label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-[18px] border border-[#bfdbfe] bg-[#eff6ff]/50 px-4 py-3.5 text-sm font-black text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#2563eb]/10 sm:rounded-[24px] sm:px-6 sm:py-4 sm:text-base"
              placeholder="Ismingizni kiriting"
            />
          </div>
          <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">EMAIL MANZIL (READ-ONLY)</label>
            <div className="w-full overflow-hidden text-ellipsis rounded-[18px] border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm font-black text-gray-500 sm:rounded-[24px] sm:px-6 sm:py-4 sm:text-base">
              {normalizedProfile.email || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">TELEFON (READ-ONLY)</label>
            <div className="w-full overflow-hidden text-ellipsis rounded-[18px] border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm font-black text-gray-500 sm:rounded-[24px] sm:px-6 sm:py-4 sm:text-base">
              {normalizedProfile.phone || '-'}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className={`mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-[22px] p-3.5 font-black tracking-tight text-white shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] sm:rounded-[34px] sm:p-5 ${
          success ? 'bg-[#2563eb] shadow-[#2563eb]/20' : 'bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[#2563eb]/30'
        }`}
      >
        {saving ? <Save size={20} className="animate-pulse" /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
        <span className="uppercase text-sm sm:text-base">{success ? 'SAQLANDI' : saving ? 'SAQLANMOQDA...' : "O'ZGARISHNI SAQLASH"}</span>
      </button>
    </div>
  );
}
