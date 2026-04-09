'use client';
import { useState, useEffect } from 'react';
import { Brain, ChevronLeft, Volume2, CheckCircle2, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function VocabularyPracticePage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await api.get('/vocabularies'); // Or a specialized endpoint
        setWords(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  const handleNext = (quality: number) => {
    // Ideally, send progress to backend here (SM-2 quality 0-5)
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#2563eb]" size={40} /></div>;

  if (words.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Brain className="text-gray-200 mb-4" size={60} />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No words to practice yet</p>
      <button onClick={() => router.back()} className="mt-6 text-[#2563eb] font-black text-[10px] uppercase tracking-widest">Orqaga qaytish</button>
    </div>
  );

  if (finished) return (
    <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-blue-50 text-[#2563eb] rounded-[32px] flex items-center justify-center mb-6">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Mashq tugadi!</h1>
      <p className="text-gray-400 font-bold text-sm mb-10">Barcha so&apos;zlarni takrorlab bo&apos;ldingiz.</p>
      <div className="flex flex-col gap-4 w-full max-w-[240px]">
        <button 
          onClick={() => { setFinished(false); setCurrentIndex(0); }}
          className="bg-[#2563eb] text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#2563eb]/20"
        >
          <RotateCcw size={16} strokeWidth={2.5} /> Qayta boshlash
        </button>
        <button 
          onClick={() => router.push('/')}
          className="bg-white border border-gray-100 text-[#2563eb] py-4 rounded-2xl font-black text-xs tracking-widest uppercase active:scale-95 transition-all"
        >
          Dashboardga qaytish
        </button>
      </div>
    </div>
  );

  const word = words[currentIndex];

  return (
    <div className="max-w-md mx-auto h-[80vh] flex flex-col pt-10 px-4">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2563eb] rounded-full transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{currentIndex + 1}/{words.length}</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col">
        <div 
          className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[360px] transition-all duration-500 group"
          onClick={() => setShowTranslation(!showTranslation)}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#2563eb]/10" />
          
          <div className="mb-8">
            <div className="w-16 h-16 bg-[#eff6ff] text-[#2563eb] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all">
              <Brain size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">{word.word}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">{word.pronunciation || '/.../'}</p>
          </div>

          <div className={`transition-all duration-500 flex flex-col items-center ${showTranslation ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="h-px w-12 bg-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-[#2563eb] tracking-tight mb-4">{word.translation}</h3>
            <p className="text-[11px] font-bold text-gray-400 max-w-[240px] leading-relaxed italic">&quot;{word.exampleSentence || 'No example available'}&quot;</p>
          </div>

          {!showTranslation && (
            <p className="absolute bottom-10 text-[9px] font-black text-gray-300 uppercase tracking-widest animate-pulse mt-4">Tarbimasini ko&apos;rish uchun bosing</p>
          )}
          
          <button className="absolute top-6 right-6 p-2 rounded-lg text-gray-200 hover:text-[#2563eb] transition-colors">
            <Volume2 size={20} />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 pb-10">
          <button 
             onClick={(e) => { e.stopPropagation(); handleNext(1); }}
             className="bg-red-50 text-red-500 p-6 rounded-[32px] flex flex-col items-center gap-2 border border-red-100 active:scale-95 transition-all group"
          >
             <XCircle size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Unutdim</span>
          </button>
          <button 
             onClick={(e) => { e.stopPropagation(); handleNext(5); }}
             className="bg-blue-50 text-[#2563eb] p-6 rounded-[32px] flex flex-col items-center gap-2 border border-blue-100 active:scale-95 transition-all group"
          >
             <CheckCircle2 size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Bilaman</span>
          </button>
        </div>
      </div>
    </div>
  );
}
