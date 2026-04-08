'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield, CheckCircle2, Loader2, Save } from 'lucide-react';
import { fetchCurrentUserProfile, updateCurrentUserProfile } from '@/lib/api-compat';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchCurrentUserProfile();
        setProfile(data);
        setFullName(data.fullName);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = await updateCurrentUserProfile({ fullName });
      setProfile(data);
      setFullName(data.fullName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
      <div className="mb-8 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <button onClick={() => router.back()} className="app-touch rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Profil sozlmalari</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">MK Academy Profile</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-8 rounded-[34px] border border-[#E8F3ED] bg-white p-5 shadow-sm shadow-[#F2F8F5] sm:rounded-[42px] sm:p-8">
         <div className="flex flex-col items-center gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#3D855A] to-[#83D1A5] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg shadow-[#3D855A]/20">
               {fullName.charAt(0)}
            </div>
            <button className="text-[10px] sm:text-[11px] font-black text-[#3D855A] hover:text-white uppercase tracking-[0.2em] bg-[#F2F8F5] hover:bg-[#3D855A] px-5 py-2.5 rounded-full border border-[#D5EAE0] hover:border-[#3D855A] transition-all">
               Rasmni yangilash
            </button>
         </div>

         <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2.5">
               <label className="text-[10px] font-black text-[#3D855A] uppercase tracking-widest px-2">TO&apos;LIQ ISM</label>
               <input 
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 className="w-full bg-[#F2F8F5]/50 border border-[#D5EAE0] rounded-[24px] py-4 px-6 text-sm sm:text-base font-black text-gray-900 focus:outline-none focus:border-[#3D855A] focus:ring-4 focus:ring-[#3D855A]/10 transition-all placeholder:text-gray-400"
                 placeholder="Ismingizni kiriting"
               />
            </div>
            <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">EMAIL MANZIL (READ-ONLY)</label>
               <div className="w-full bg-gray-50 border border-gray-100 rounded-[24px] py-4 px-6 text-sm sm:text-base font-black text-gray-500 overflow-hidden text-ellipsis">
                  {profile.email}
               </div>
            </div>
         </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className={`mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-[30px] p-4 font-black tracking-tight text-white shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] sm:rounded-[34px] sm:p-5 ${
           success ? 'bg-[#10B981] shadow-[#10B981]/20' : 'bg-[#3D855A] hover:bg-[#2A6642] shadow-[#3D855A]/30'
        }`}
      >
        {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
        <span className="uppercase text-sm sm:text-base">{success ? 'SAQLANDI' : saving ? 'SAQLANMOQDA...' : 'O\'ZGARISHNI SAQLASH'}</span>
      </button>
    </div>
  );
}
