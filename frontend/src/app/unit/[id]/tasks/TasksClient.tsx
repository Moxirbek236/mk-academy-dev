'use client';
import { ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, RefreshCcw, Loader2, Trophy, Star, Sparkles } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { localizePath } from '@/i18n/localizedPath';
import { useExamSecurity } from '@/hooks/useExamSecurity';

export default function TasksClient() {
  const router = useRouter();
  const locale = useLocale();
  const { id } = useParams();
  const { role, loading: authLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const { privacyVisible, watermarkText } = useExamSecurity({
    enabled: !authLoading && role === 'student' && !showResult,
    watermarkLabel: `MK Academy Exam | Unit ${String(id)}`,
  });

  const questions = [
    {
      type: 'multiple_choice',
      q: 'Choose the correct synonym for "Accomplish".',
      options: ['Fail', 'Achieve', 'Destroy', 'Delay'],
      correct: 1,
      fact: '"Accomplish" means to complete something successfully.'
    },
    {
      type: 'fill_in_blank',
      q: 'She tried to _______ him to join the team.',
      options: ['Determine', 'Hypothesis', 'Persuade', 'Generate'],
      correct: 2,
      fact: '"Persuade" means to convince someone.'
    },
    {
      type: 'multiple_choice',
      q: 'Which word means "very important"?',
      options: ['Fascinating', 'Significant', 'Accomplish', 'Hypothesis'],
      correct: 1,
      fact: '"Significant" often refers to importance or meaning.'
    }
  ];

  const handleNext = () => {
    if (selected === questions[currentStep].correct) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelected(null);
        setIsWrong(false);
      } else {
        setShowResult(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3D855A', '#10B981', '#ffffff']
        });
      }
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  if (authLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  if (role !== 'student') {
    return (
      <div className="pb-8 h-full flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in-95 duration-500">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-red-100 text-red-600 rounded-[32px] flex items-center justify-center shadow-lg border-4 border-white mb-6"
        >
          <Lock size={40} strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Ruxsat Taqiqlangan</h2>
        <p className="text-gray-500 font-bold px-12 mb-10 leading-relaxed text-sm">
          Tests va vazifalar faqat <span className="text-[#3D855A]">Student</span> hisobiga ega foydalanuvchilar uchun mo&apos;ljallangan.
        </p>
        <button 
          onClick={() => router.push(localizePath(locale, '/'))}
          className="bg-[#3D855A] text-white font-black py-4 px-10 rounded-[28px] shadow-xl shadow-[#3D855A]/20 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-[11px]"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Portalga Qaytish
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="pb-8 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[48px] flex items-center justify-center shadow-2xl shadow-emerald-500/20 border-4 border-white mb-8 relative"
        >
          <Trophy size={64} strokeWidth={2.5} className="z-10" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-4 border-dashed border-emerald-200 rounded-[48px]" />
        </motion.div>
        
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Perfect Score!</h2>
        <p className="text-gray-500 font-bold max-w-xs mb-10 leading-relaxed">
          Tabriklaymiz! Siz <span className="text-[#3D855A]">Unit {id}</span> bo&apos;yicha barcha vazifalarni 100% natija bilan yakunladingiz. +50 XP kiritildi.
        </p>

        <div className="flex flex-col w-full gap-4 max-w-xs">
          <button 
            onClick={() => router.push(localizePath(locale, '/'))}
            className="w-full bg-[#3D855A] text-white font-black py-5 rounded-[32px] shadow-xl shadow-[#3D855A]/30 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            Darslarga qaytish <ChevronRight size={18} strokeWidth={3} />
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 text-gray-500 font-black py-4 rounded-[32px] active:scale-95 transition-all uppercase tracking-widest text-[10px]"
          >
            Takrorlash <RefreshCcw size={14} className="inline ml-1" />
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;
  const isCorrect = selected === questions[currentStep].correct;

  return (
    <div className="mx-auto max-w-2xl px-1 pb-[calc(14rem+env(safe-area-inset-bottom))] lg:pt-6">
      <div className="pointer-events-none fixed inset-0 z-[70] opacity-[0.18] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]">
        <div className="absolute inset-x-[-20%] top-[18%] -rotate-[18deg] text-center text-[18px] font-black uppercase tracking-[0.45em] text-emerald-900/70">
          {watermarkText}
        </div>
        <div className="absolute inset-x-[-20%] top-[58%] rotate-[16deg] text-center text-[18px] font-black uppercase tracking-[0.45em] text-emerald-900/60">
          {watermarkText}
        </div>
      </div>

      <AnimatePresence>
        {privacyVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/96 px-6 text-center text-white backdrop-blur-md"
          >
            <div className="max-w-md rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-300">
                Privacy Shield
              </p>
              <h3 className="mt-4 text-3xl font-black tracking-tight">
                Exam content vaqtincha yashirildi
              </h3>
              <p className="mt-4 text-sm font-bold leading-relaxed text-slate-300">
                Fokus boshqa oynaga o&apos;tgani uchun sahifa yopildi. Examga qaytsangiz kontent yana ko&apos;rinadi.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Gamified Header */}
      <div className="flex items-center gap-5 mb-10">
        <button 
          onClick={() => router.back()} 
          className="shrink-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl shadow-gray-200/50 transition-all hover:text-gray-900 active:scale-90 text-gray-400 sm:p-4"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex-1">
           <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-[0.1em] flex items-center gap-1.5">
                <Sparkles size={12} fill="currentColor" /> Quiz Mode
              </span>
              <span className="text-[12px] font-black text-gray-300 tracking-tighter">PROGRESS: {Math.round(progressPercentage)}%</span>
           </div>
           <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-[#3D855A] rounded-full shadow-[0_0_15px_rgba(61,133,90,0.4)]"
              />
           </div>
        </div>
      </div>

      {/* Ultra-Realism: Question Context */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-7 sm:mb-8"
        >
          <div className="group relative mb-6 rounded-[34px] border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-200/50 sm:mb-8 sm:rounded-[48px] sm:p-10">
            <div className="absolute right-6 top-5 text-amber-500 transition-transform group-hover:rotate-12 sm:right-10 sm:top-8"><Star size={24} fill="currentColor" /></div>
            <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
               <div className="w-12 h-12 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl shadow-inner">
                  {currentStep + 1}
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 sm:text-[11px] sm:tracking-[0.2em]">
                 {questions[currentStep].type === 'fill_in_blank' ? 'Gapni To\'ldiring' : 'Sinonim Tanlang'}
               </span>
            </div>
            <h3 className="px-1 text-[24px] font-extrabold leading-tight tracking-tight text-[#111827] sm:text-[28px] md:text-[32px]">
              {questions[currentStep].q.split('"').map((part, i) => (
                i % 2 === 1 
                  ? <span key={i} className="text-[#3D855A] border-b-4 border-emerald-100 pb-1 rounded-sm">"{part}"</span> 
                  : <span key={i}>{part}</span>
              ))}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-5">
            {questions[currentStep].options.map((option, idx) => {
              const isSelected = selected === idx;
              const isCorrectOption = idx === questions[currentStep].correct;

              return (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => {
                    setSelected(idx);
                    setIsWrong(idx !== questions[currentStep].correct);
                  }}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-[30px] border-[3px] p-5 text-left transition-all sm:rounded-[38px] sm:p-7
                    ${isSelected && isCorrectOption ? 'border-emerald-500 bg-emerald-50/50 shadow-xl shadow-emerald-500/10' : ''}
                    ${isSelected && !isCorrectOption ? 'border-red-400 bg-red-50 text-red-600 shadow-xl shadow-red-500/10 animate-shake' : ''}
                    ${!isSelected ? 'border-gray-100 bg-white text-gray-800 hover:border-[#3D855A]/30 hover:bg-emerald-50/20 active:scale-95' : ''}
                  `}
                >
                  <div className="flex items-center gap-5 relative z-10">
                     <span className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 text-sm font-black transition-all ${isSelected ? 'border-transparent bg-white' : 'border-gray-100 bg-gray-50 group-hover:bg-white'}`}>{idx + 1}</span>
                     <span className={`text-base font-black md:text-lg ${isSelected && isCorrectOption ? 'text-emerald-700' : ''}`}>{option}</span>
                  </div>
                  
                  <div className="relative z-10 shrink-0">
                    {isSelected && isCorrectOption && <CheckCircle2 size={28} strokeWidth={3.5} className="text-emerald-500" />}
                    {isSelected && !isCorrectOption && <AlertCircle size={28} strokeWidth={3.5} className="text-red-400" />}
                    {!isSelected && <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 group-hover:border-emerald-200 transition-colors bg-gray-50" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>

      {/* Fact & Action Area - Responsive Bottom Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-gradient-to-t from-gray-50/90 to-transparent px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm sm:p-6">
         <AnimatePresence>
            {selected !== null && (
               <motion.div 
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 100 }}
                 className={`relative flex w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-[34px] border-b-2 border-t-4 bg-white/95 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.15)] backdrop-blur-3xl sm:gap-6 sm:rounded-[48px] sm:p-7 ${
                    isCorrect ? 'bg-white/95 border-emerald-500 border-b-emerald-50' : 'bg-white/95 border-red-500 border-b-red-50'
                 }`}
               >
                  {/* Decorative blur */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-10 ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  
                  <div className="relative z-10 flex items-center gap-3 sm:gap-5">
                     <div className={`rounded-[20px] p-3.5 shadow-inner sm:rounded-[26px] sm:p-5 ${isCorrect ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        {isCorrect ? <Sparkles size={26} strokeWidth={2.5} /> : <AlertCircle size={26} strokeWidth={2.5} />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className={`text-lg font-black tracking-tight sm:text-xl ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                           {isCorrect ? 'Barakalla! To&apos;g&apos;ri javob.' : 'Xato! Diqqatli bo&apos;ling.'}
                        </p>
                        <p className="text-[13px] font-bold text-gray-500 line-clamp-1">{questions[currentStep].fact}</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleNext}
                    disabled={!isCorrect}
                    className={`group relative w-full rounded-[28px] py-4 text-[11px] font-black uppercase tracking-[0.22em] transition-all shadow-2xl sm:rounded-[32px] sm:py-5 sm:text-sm sm:tracking-[0.25em] ${
                       isCorrect ? 'bg-[#3D855A] text-white shadow-[#3D855A]/30 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                     <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                     KEYINGISI <ChevronRight size={22} className="inline ml-1" strokeWidth={3.5} />
                  </button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="mt-12 text-center opacity-30 pb-32">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-400">MK ACADEMY AI ENGINE â€¢ PREMIUM ASSESSMENT</p>
      </div>
    </div>
  );
}

