'use client';
import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, ListTodo, X, Loader2, Sparkles, Trophy, Zap, Clock, ChevronRight, Target, BrainCircuit, Users, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExamCard } from '../ExamCard';
import { LessonCard } from '../LessonCard';
import api from '@/lib/api';

export function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Gamification / Progress Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {stats.map((stat, idx) => (
            <div key={idx} className="app-card p-5 flex items-center gap-4 active:scale-[0.98]">
               <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-sm font-black text-[var(--app-text)] mt-1 tracking-tight">{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="mb-10 px-1 animate-in fade-in slide-in-from-right-4 duration-1000">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
            <Users size={14} className="text-[var(--app-primary)]" /> MENING GURUHLARIM
         </h2>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[1, 2].map((_, i) => (
               <div key={i} onClick={() => router.push('/groups')} className="min-w-[260px] app-card p-6 flex items-center gap-4 cursor-pointer group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--app-surface-soft)] text-[var(--app-primary)] flex items-center justify-center font-black text-lg group-hover:bg-[var(--app-primary)] group-hover:text-white transition-all shadow-sm">
                     G{i+1}
                  </div>
                  <div className="min-w-0 flex-1">
                     <h4 className="font-extrabold text-[var(--app-text)] text-sm tracking-tight truncate">IELTS Foundation</h4>
                     <p className="text-[10px] font-bold text-[var(--app-muted)] uppercase tracking-widest mt-0.5">Mentor: Maqsud</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--app-surface-soft)] text-gray-300 group-hover:text-[var(--app-primary)] group-hover:bg-[var(--app-primary)]/10 transition-all">
                     <ChevronRight size={18} strokeWidth={3} />
                  </div>
               </div>
            ))}
            <button className="min-w-[160px] border-2 border-dashed border-[var(--app-border)] rounded-[var(--radius-premium)] flex flex-col items-center justify-center gap-2 text-[var(--app-muted)] hover:border-[var(--app-primary)]/30 hover:text-[var(--app-primary)] transition-all group active:scale-95 bg-white/40">
               <PlusCircle size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">YANGI GURUH</span>
            </button>
         </div>
      </div>

      <div className="mb-10">
        <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase mb-4 px-2 flex items-center gap-2 font-black">
           <Sparkles size={14} className="text-[var(--app-primary)]" /> KEYINGI IMTIHON
        </h2>
        <ExamCard />
      </div>

      <div className="mt-10 mb-6 flex items-center justify-between px-2">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase px-1">O&apos;QUV REJANGIZ</h2>
         <button className="text-[10px] font-black text-[var(--app-primary)] uppercase tracking-widest flex items-center gap-1 group bg-[var(--app-primary)]/10 px-3 py-1.5 rounded-full hover:bg-[var(--app-primary)]/20 transition-all">
            All Units <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {loading ? (
           <div className="flex justify-center p-10 col-span-full"><Loader2 className="animate-spin text-[var(--app-primary)] opacity-50" size={32} /></div>
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
          </>
        )}
      </div>

      <div className="mt-12 bg-mesh app-card p-8 text-[var(--app-text)] relative overflow-hidden group mb-10">
         <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-[var(--app-primary)]/10 rounded-full blur-[60px] opacity-60" />
         <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">Practice Vocabulary</h3>
            <p className="text-sm font-bold text-[var(--app-muted)] mb-8 leading-relaxed max-w-sm">Spaced Repetition (SM-2) orqali yanada tezroq eslab qoling va so&apos;z boyligingizni oshiring.</p>
            <button 
               onClick={() => router.push('/vocabulary-practice')}
               className="btn-premium bg-[var(--app-primary)] text-white shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] border-none"
            >
               <Clock size={16} strokeWidth={2.5} className="mr-2" /> Train Now
            </button>
         </div>
      </div>

      <Dialog.Root open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[92%] max-w-[360px] bg-white rounded-[42px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.25)] z-50 focus:outline-none animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden border border-gray-100">
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
                onClick={() => router.push(`/unit/${selectedUnit}/vocabulary`)}
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
                onClick={() => router.push(`/unit/${selectedUnit}/tasks`)}
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
