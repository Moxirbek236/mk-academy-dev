'use client';
import { ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, RefreshCcw, Loader2, Trophy, Star, Sparkles, Command } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Tasks() {
  const router = useRouter();
  const { id } = useParams();
  const { role, loading: authLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

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
          onClick={() => router.push('/')}
          className="bg-gray-900 text-white font-black py-4 px-10 rounded-[28px] shadow-xl active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-[11px]"
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
            onClick={() => router.push('/')}
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
    <div className="pb-32 px-1">
      {/* Premium Gamified Header */}
      <div className="flex items-center gap-5 mb-10">
        <button 
          onClick={() => router.back()} 
          className="p-3.5 rounded-2xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 text-gray-400 hover:text-gray-900 active:scale-90 transition-all shrink-0"
        >
          <ArrowLeft size={22} strokeWidth={3} />
        </button>
        <div className="flex-1">
           <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-[0.1em]">
                <Sparkles size={12} className="inline mr-1" /> Quiz Mode
              </span>
              <span className="text-[12px] font-black text-gray-300 tracking-tighter">PROGRESS: {Math.round(progressPercentage)}%</span>
           </div>
           <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 relative">
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
          className="mb-8"
        >
          <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-8 relative">
            <div className="absolute top-6 right-8 text-amber-500"><Star size={24} fill="currentColor" /></div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  Q{currentStep + 1}
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 {questions[currentStep].type === 'fill_in_blank' ? 'Gapni To\'ldiring' : 'Sinonim Tanlang'}
               </span>
            </div>
            <h3 className="font-extrabold text-[#111827] text-[24px] leading-tight tracking-tight px-1">
              {questions[currentStep].q.split('"').map((part, i) => (
                i % 2 === 1 
                  ? <span key={i} className="text-emerald-550 border-b-2 border-emerald-100">"{part}"</span> 
                  : <span key={i}>{part}</span>
              ))}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
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
                  className={`p-6 rounded-[32px] border-3 text-left transition-all flex justify-between items-center group relative overflow-hidden
                    ${isSelected && isCorrectOption ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' : ''}
                    ${isSelected && !isCorrectOption ? 'border-red-400 bg-red-50 text-red-600 shadow-lg shadow-red-500/10 animate-shake' : ''}
                    ${!isSelected ? 'border-gray-100 bg-white text-gray-800 hover:border-[#3D855A]/30 hover:bg-emerald-50/20' : ''}
                  `}
                >
                  <span className={`font-black text-lg relative z-10 ${isSelected && isCorrectOption ? 'text-emerald-600' : ''}`}>{option}</span>
                  
                  <div className="relative z-10">
                    {isSelected && isCorrectOption && <CheckCircle2 size={24} strokeWidth={3} className="text-emerald-500" />}
                    {isSelected && !isCorrectOption && <AlertCircle size={24} strokeWidth={3} className="text-red-400" />}
                    {!isSelected && <div className="w-6 h-6 rounded-full border-3 border-gray-100 group-hover:border-emerald-200 transition-colors" />}
                  </div>
                  
                  <style jsx>{`
                    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                    @keyframes shake {
                      10%, 90% { transform: translate3d(-1px, 0, 0); }
                      20%, 80% { transform: translate3d(2px, 0, 0); }
                      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                      40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
                  `}</style>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Fact & Action Area */}
      <div className="fixed bottom-10 left-6 right-6 z-50">
         <AnimatePresence>
            {selected !== null && (
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 50 }}
                 className={`p-6 rounded-[40px] shadow-3xl flex flex-col gap-5 border-t-4 mb-2 backdrop-blur-xl ${
                    isCorrect ? 'bg-white/95 border-emerald-500' : 'bg-white/95 border-red-500'
                 }`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`p-4 rounded-3xl ${isCorrect ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        {isCorrect ? <Sparkles size={28} strokeWidth={2.5} /> : <AlertCircle size={28} strokeWidth={2.5} />}
                     </div>
                     <div className="flex-1">
                        <p className={`text-base font-black tracking-tight ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                           {isCorrect ? 'Superb job!' : 'Almost there!'}
                        </p>
                        <p className="text-[12px] font-bold text-gray-500">{questions[currentStep].fact}</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleNext}
                    disabled={!isCorrect}
                    className={`w-full py-5 rounded-3xl font-black transition-all text-sm uppercase tracking-[0.2em] shadow-xl ${
                       isCorrect ? 'bg-[#3D855A] text-white shadow-[#3D855A]/30 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                     CONTINUE <ChevronRight size={20} className="inline ml-1" strokeWidth={3} />
                  </button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="mt-12 text-center opacity-20 pb-20">
         <p className="text-[10px] font-black uppercase tracking-[0.5em]">MK ACADEMY • AI ASSESSMENT ENGINE</p>
      </div>
    </div>
  );
}