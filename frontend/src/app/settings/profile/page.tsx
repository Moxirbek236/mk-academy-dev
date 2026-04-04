'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield, CheckCircle2, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

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
        const res = await api.get('/auth/profile');
        const data = res.data?.data || res.data;
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
      await api.patch('/auth/profile', { fullName });
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Profil sozlmalari</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">MK Academy Profile</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[42px] border border-gray-100 shadow-sm mb-8 flex flex-col gap-8">
         <div className="flex flex-col items-center gap-5">
            <div className="w-24 h-24 rounded-[36px] bg-gradient-to-tr from-[#3D855A] to-[#83D1A5] flex items-center justify-center text-white text-3xl font-black">
               {fullName.charAt(0)}
            </div>
            <button className="text-[10px] font-black text-[#3D855A] uppercase tracking-[0.2em] bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
               Rasmni yangilash
            </button>
         </div>

         <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">TO&apos;LIQ ISM</label>
               <input 
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 rounded-[24px] py-4 px-6 text-sm font-black focus:outline-none focus:border-[#3D855A] focus:ring-4 focus:ring-[#3D855A]/5 transition-all"
               />
            </div>
            <div className="flex flex-col gap-2.5 opacity-60 grayscale cursor-not-allowed">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">EMAIL MANZIL (READ-ONLY)</label>
               <div className="w-full bg-gray-100 border border-transparent rounded-[24px] py-4 px-6 text-sm font-black text-gray-500">
                  {profile.email}
               </div>
            </div>
         </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className={`w-full p-6 rounded-[34px] font-black tracking-tight text-white shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
           success ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gray-900 shadow-gray-900/20'
        }`}
      >
        {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
        <span className="uppercase">{success ? 'SAQLANDI' : saving ? 'SAQLANMOQDA...' : 'O&apos;ZGARISHI SAQLASH'}</span>
      </button>
    </div>
  );
}
