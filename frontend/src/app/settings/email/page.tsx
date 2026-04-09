'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, ChevronRight, Loader2, Save, Globe, Moon, Bell, Lock } from 'lucide-react';
import { useState } from 'react';

export default function GenericSettingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.push('/settings')} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Sozlama (Demo)</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Ushbu sahifa ishlab chiqish holatida</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[46px] border border-gray-100 shadow-sm mb-12 flex flex-col items-center text-center gap-8">
         <div className="p-8 bg-[#eff6ff] rounded-[38px] text-[#2563eb] shadow-inner shadow-blue-500/5">
            <Lock size={44} strokeWidth={2.5} className="animate-pulse" />
         </div>
         <div className="max-w-[80%]">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-8 mb-4">Ushbu funksiya hozircha mavjud emas</h2>
            <p className="text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">Kelgusidagi yangilanishlarda ushbu sahifa to&apos;liq funksional holatga keltiriladi. Hozirda asosiy profil sozlamalaridan foydalaning.</p>
         </div>
      </div>

      <button 
        onClick={() => router.push('/settings')}
        className="w-full p-6 bg-[#2563eb] rounded-[34px] font-black tracking-tight text-white shadow-xl shadow-[#2563eb]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase"
      >
        ORQAGA QAYTISH
      </button>
    </div>
  );
}
