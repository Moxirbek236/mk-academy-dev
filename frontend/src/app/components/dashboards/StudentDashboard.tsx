'use client';
import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, ListTodo, X, Loader2, Sparkles, Trophy, Zap, Clock, ChevronRight, Target, BrainCircuit, Users, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ExamCard } from '../ExamCard';
import { LessonCard } from '../LessonCard';
import api from '@/lib/api';

export function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const localized = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard/stats');
        setData(statsRes.data?.data || statsRes.data);
        
        const tasksRes = await api.get('/tasks');
        setTasks(tasksRes.data?.data || tasksRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Ranking', value: data?.rank || 'Top 10%', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', trend: '+2%' },
    { label: 'Streak', value: `${data?.streak || 0} Days`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', trend: 'Active' },
    { label: 'Accuracy', value: '94%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+5%' },
    { label: 'Mastery', value: '12/40', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-50', trend: 'Good' },
  ];

  if (loading) return <div className="flex justify-center p-16 sm:p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-3 sm:pb-6">
      {/* Gamification / Progress Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
         {stats.map((stat, idx) => (
            <div key={idx} className="group flex items-center gap-3 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#3D855A]/30 hover:shadow-md active:scale-[0.98] sm:gap-4 sm:rounded-[32px] sm:p-5 dark:border-slate-700 dark:bg-slate-900">
               <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="mt-1 text-xs font-black tracking-tight text-[#111827] sm:text-sm dark:text-slate-100">{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="mb-10 px-2 animate-in fade-in slide-in-from-right-4 duration-1000">
         <h2 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#1A1A1A]/40 sm:text-[12px] sm:tracking-[0.15em]">
            <Users size={14} className="text-[#3D855A]" /> MENING GURUHLARIM
         </h2>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
            {[1, 2].map((_, i) => (
               <div key={i} onClick={() => router.push(localized('/groups'))} className="group flex min-w-[220px] cursor-pointer items-center gap-3 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#3D855A]/30 hover:shadow-md active:scale-95 sm:min-w-[240px] sm:gap-4 sm:rounded-[32px] sm:p-6 dark:border-slate-700 dark:bg-slate-900">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2F8F5] text-[#3D855A] flex items-center justify-center font-black text-lg group-hover:bg-[#3D855A] group-hover:text-white transition-all shadow-sm">
                     G{i+1}
                  </div>
                  <div>
                     <h4 className="text-sm font-extrabold tracking-tight text-[#111827] dark:text-slate-100">IELTS Foundation</h4>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Mentor: Maqsud</p>
                  </div>
                  <div className="ml-auto p-2 bg-gray-50 rounded-xl text-gray-300 group-hover:text-[#3D855A] group-hover:bg-[#3D855A]/5 transition-all">
                     <ChevronRight size={16} strokeWidth={3} />
                  </div>
               </div>
            ))}
            <button className="group flex min-w-[132px] flex-col items-center justify-center gap-2 rounded-[28px] border-2 border-dashed border-gray-200 text-gray-400 transition-all hover:border-[#3D855A]/30 hover:text-[#3D855A] sm:min-w-[140px] sm:rounded-[32px] dark:border-slate-700 dark:text-slate-400">
               <PlusCircle size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">YANGI GURUH</span>
            </button>
         </div>
      </div>

      <h2 className="text-[12px] font-black text-[#1A1A1A]/30 tracking-[0.15em] uppercase mb-4 px-2 flex items-center gap-2">
         <Sparkles size={14} className="text-[#3D855A]" /> KEYINGI IMTIHON
      </h2>
      <ExamCard />

      <div className="mt-10 mb-6 flex items-center justify-between px-2">
         <h2 className="text-[12px] font-black text-[#1A1A1A]/30 tracking-[0.15em] uppercase px-1">O&apos;QUV REJANGIZ</h2>
         <button className="text-[10px] font-black text-[#3D855A] uppercase tracking-widest flex items-center gap-1 group">
            All Units <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {loading ? (
           <div className="flex justify-center p-10 col-span-full"><Loader2 className="animate-spin text-[#3D855A] opacity-50" size={32} /></div>
        ) : tasks.length > 0 ? (
           tasks.map((task: any, idx: number) => (
             <LessonCard 
                key={task.id}
                unit={(idx + 1).toString()} 
                title={task.title} 
                status={idx === 0 ? "done" : idx === 1 ? "done" : "locked"} 
                progress={idx === 0 ? 100 : idx === 1 ? 40 : 0} 
                onClick={() => setSelectedUnit((idx + 1).toString())}
             />
           ))
        ) : (
          <>
            <LessonCard 
              unit="1" 
              title="Essential Grammar - 8 Lessons" 
              status="done" 
              progress={100} 
              onClick={() => setSelectedUnit("1")}
            />
            <LessonCard 
              unit="2" 
              title="Daily Conversation - 10 Lessons" 
              status="done" 
              progress={40} 
              onClick={() => setSelectedUnit("2")}
            />
            <LessonCard 
              unit="3" 
              title="Business English - 12 Lessons" 
              status="locked" 
              progress={0} 
            />
            <LessonCard 
              unit="4" 
              title="IELTS Prep - 6 Lessons" 
              status="locked" 
              progress={0} 
            />
          </>
        )}
      </div>

      <div className="group relative mb-6 mt-12 overflow-hidden rounded-[30px] border border-[#DCEEE3] bg-gradient-to-br from-[#ECF8F1] via-[#F8FCF9] to-white p-5 text-gray-900 shadow-sm sm:rounded-[40px] sm:p-8 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
         <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#3D855A]/15 rounded-full blur-[40px] opacity-60" />
         <div className="relative z-10">
            <h3 className="mb-2 text-lg font-black leading-tight tracking-tight sm:text-xl">Practice Vocabulary</h3>
            <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">Spaced Repetition (SM-2) orqali yanada tezroq eslab qoling.</p>
            <button 
               onClick={() => router.push(localized('/vocabulary-practice'))}
               className="bg-[#3D855A] hover:bg-[#4ea873] text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl shadow-[#3D855A]/20 active:scale-95 flex items-center gap-3 w-fit"
            >
               <Clock size={16} strokeWidth={2.5} /> Train Now
            </button>
         </div>
      </div>

      <Dialog.Root open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[92%] max-w-[360px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-[34px] border border-gray-100 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_25px_60px_rgba(0,0,0,0.25)] outline-none animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 sm:rounded-[42px] sm:p-8 dark:border-slate-700 dark:bg-slate-900">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#3D855A]/5 rounded-full blur-[30px]" />
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <Dialog.Title className="text-2xl font-black text-[#111827] tracking-tighter">Unit {selectedUnit}</Dialog.Title>
                <Dialog.Description className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Select Your Focus</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-3 rounded-[20px] bg-gray-50 text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition-all active:scale-90">
                  <X size={20} strokeWidth={3} />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <button 
                onClick={() => router.push(localized(`/unit/${selectedUnit}/vocabulary`))}
                className="flex items-center gap-5 bg-[#F4F7F5] p-5 rounded-[28px] hover:bg-[#E8ECE9] active:scale-[0.98] transition-all text-left group border border-transparent hover:border-[#3D855A]/20 shadow-sm"
              >
                <div className="bg-white p-4 rounded-[20px] shadow-sm text-[#3D855A] group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-white/10 group-hover:bg-[#3D855A] group-hover:text-white">
                  <BookOpen size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111827] text-lg tracking-tight">Vocabulary</h4>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5 tracking-tight">Expand your word base</p>
                </div>
              </button>

              <button 
                onClick={() => router.push(localized(`/unit/${selectedUnit}/tasks`))}
                className="flex items-center gap-5 bg-[#FFF9ED] p-5 rounded-[28px] hover:bg-[#FCEECC] active:scale-[0.98] transition-all text-left group border border-transparent hover:border-[#C78736]/20 shadow-sm"
              >
                <div className="bg-white p-4 rounded-[20px] shadow-sm text-[#C78736] group-hover:scale-110 group-hover:-rotate-6 transition-all ring-4 ring-white/10 group-hover:bg-[#C78736] group-hover:text-white">
                  <ListTodo size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111827] text-lg tracking-tight">Practice</h4>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5 tracking-tight">Apply what you learned</p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 flex justify-center pb-2">
               <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] opacity-80">MK Academy Learning Engine</p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
