'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Volume2, Search, PlusCircle, Lock, Loader2 } from 'lucide-react';

export default function VocabularyClient() {
  const router = useRouter();
  const { id } = useParams();
  const { role, loading: authLoading } = useAuth();
  const [playing, setPlaying] = useState<number | null>(null);

  const words = [
    { en: 'Accomplish', uz: 'Bajarmoq, erishmoq', type: 'verb' },
    { en: 'Determine', uz: 'Aniqlamoq, qaror qilmoq', type: 'verb' },
    { en: 'Essential', uz: 'Zaruriy, muhim', type: 'adj' },
    { en: 'Fascinating', uz: 'Maftunkor, qiziqarli', type: 'adj' },
    { en: 'Generate', uz: 'Ishlab chiqarmoq, yaratmoq', type: 'verb' },
    { en: 'Hypothesis', uz: 'Faraz, gipoteza', type: 'noun' },
    { en: 'Persuade', uz: 'Ko\'ndirmoq', type: 'verb' },
    { en: 'Significant', uz: 'Muhim, ahamiyatli', type: 'adj' },
  ];

  const handlePlay = (idx: number) => {
    setPlaying(idx);
    setTimeout(() => setPlaying(null), 1000);
  };

  if (authLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  if (role !== 'student') {
    return (
      <div className="pb-8 h-full flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-[32px] flex items-center justify-center shadow-lg border-4 border-white mb-6">
          <Lock size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Ruxsat Taqiqlangan</h2>
        <p className="text-gray-500 font-bold px-12 mb-10 leading-relaxed text-sm">
          Leksika va darsliklar faqat <span className="text-[#3D855A]">Student</span> hisobiga ega foydalanuvchilar uchun mo&apos;ljallangan.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-900 text-white font-black py-4 px-10 rounded-[24px] shadow-xl active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-[11px]"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Portalga Qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Action Bar */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2.5 rounded-full bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Unit {id} Words</h2>
          <p className="text-xs font-bold text-[#3D855A] uppercase tracking-wider mt-0.5">{words.length} ta so&apos;z</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={18} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Qidirish..." 
          className="w-full bg-white border border-gray-200 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] focus:ring-4 focus:ring-[#3D855A]/10 transition-all shadow-sm"
        />
      </div>

      {/* Word List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pb-12">
        {words.map((word, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            {/* Play Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); handlePlay(idx); }}
              className={`p-4 rounded-[22px] shrink-0 transition-all active:scale-90 shadow-inner ${
                playing === idx 
                  ? 'bg-[#3D855A] text-white shadow-xl scale-110 rotate-6' 
                  : 'bg-[#F2F8F5] text-[#3D855A] group-hover:bg-[#3D855A] group-hover:text-white'
              }`}
            >
              <Volume2 size={24} strokeWidth={2.5} className={playing === idx ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            </button>

            {/* Word Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-extrabold text-[#111827] text-lg tracking-tight truncate">{word.en}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-md flex-shrink-0 bg-gray-50 text-gray-400 font-black uppercase tracking-widest border border-gray-100">
                  {word.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-bold truncate tracking-tight">{word.uz}</p>
            </div>

            {/* Add to favorites */}
            <button className="text-gray-200 hover:text-amber-500 transition-all p-2 group-hover:scale-110 active:scale-90 shrink-0">
               <PlusCircle size={24} strokeWidth={2.5} className="drop-shadow-sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
