import { ArrowLeft, Volume2, Search, PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

export function Vocabulary() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    setTimeout(() => setPlaying(null), 1000); // Fake play audio duration
  };

  return (
    <div className="pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Action Bar */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Unit {id} Words</h2>
          <p className="text-xs font-bold text-[#3D855A] uppercase tracking-wider mt-0.5">{words.length} ta so'z</p>
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
      <div className="flex flex-col gap-3.5">
        {words.map((word, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-4 rounded-3xl shadow-[0_4px_16px_-8px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 hover:border-gray-200 transition-colors"
          >
            {/* Play Button */}
            <button 
              onClick={() => handlePlay(idx)}
              className={`p-3.5 rounded-[18px] shrink-0 transition-all active:scale-90 ${
                playing === idx 
                  ? 'bg-[#3D855A] text-white shadow-md scale-110' 
                  : 'bg-[#F2F8F5] text-[#3D855A] group-hover:bg-[#E3EFE8]'
              }`}
            >
              <Volume2 size={20} strokeWidth={2.5} className={playing === idx ? 'animate-pulse' : ''} />
            </button>

            {/* Word Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-extrabold text-gray-900 text-base truncate">{word.en}</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 bg-gray-100 text-gray-500 font-bold uppercase tracking-widest">
                  {word.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium truncate">{word.uz}</p>
            </div>

            {/* Add to favorites */}
            <button className="text-gray-300 hover:text-[#C78736] transition-colors p-2">
              <PlusCircle size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}