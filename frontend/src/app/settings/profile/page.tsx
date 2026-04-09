'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { updateCurrentProfile } from '@/lib/backend-api';
import { PageErrorState, PageLoadingState } from '@/app/components/ui/PagePrimitives';
import { disableSecureScreen, enableSecureScreen } from '@/lib/screen-security';

export default function ProfileSettingsPage() {
  const router = useRouter();
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
      <div className="mb-8 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <button onClick={() => router.back()} className="app-touch rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Profil sozlamalari</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">MK Academy Profile</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-8 rounded-[34px] border border-[#E8F3ED] bg-white p-5 shadow-sm shadow-[#F2F8F5] sm:rounded-[42px] sm:p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#3D855A] to-[#83D1A5] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg shadow-[#3D855A]/20">
            {(fullName || normalizedProfile.fullName || 'U').charAt(0)}
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black text-[#3D855A] uppercase tracking-widest px-2">TO&apos;LIQ ISM</label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full bg-[#F2F8F5]/50 border border-[#D5EAE0] rounded-[24px] py-4 px-6 text-sm sm:text-base font-black text-gray-900 focus:outline-none focus:border-[#3D855A] focus:ring-4 focus:ring-[#3D855A]/10 transition-all placeholder:text-gray-400"
              placeholder="Ismingizni kiriting"
            />
          </div>
          <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">EMAIL MANZIL (READ-ONLY)</label>
            <div className="w-full bg-gray-50 border border-gray-100 rounded-[24px] py-4 px-6 text-sm sm:text-base font-black text-gray-500 overflow-hidden text-ellipsis">
              {normalizedProfile.email || '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">TELEFON (READ-ONLY)</label>
            <div className="w-full bg-gray-50 border border-gray-100 rounded-[24px] py-4 px-6 text-sm sm:text-base font-black text-gray-500 overflow-hidden text-ellipsis">
              {normalizedProfile.phone || '-'}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className={`mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-[30px] p-4 font-black tracking-tight text-white shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] sm:rounded-[34px] sm:p-5 ${
          success ? 'bg-[#10B981] shadow-[#10B981]/20' : 'bg-[#3D855A] hover:bg-[#2A6642] shadow-[#3D855A]/30'
        }`}
      >
        {saving ? <Save size={20} className="animate-pulse" /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
        <span className="uppercase text-sm sm:text-base">{success ? 'SAQLANDI' : saving ? 'SAQLANMOQDA...' : "O'ZGARISHNI SAQLASH"}</span>
      </button>
    </div>
  );
}
