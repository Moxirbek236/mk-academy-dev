import { useState, useEffect } from 'react';
import { Users, GraduationCap, Clock, CheckCircle2, ChevronRight, BarChart3, MessageSquarePlus, Calendar, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export function MentorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  const groups = data?.myGroups || [
    { name: 'IELTS Intensive - 01', students: 12, lessons: '24/40', status: 'Active', nextLesson: '14:30' },
    { name: 'CEFR B2 - Master', students: 8, lessons: '15/30', status: 'Reviewing', nextLesson: 'Ertaga' },
    { name: 'General English - A2', students: 15, lessons: '5/24', status: 'Upcoming', nextLesson: 'Dushanba' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-3 sm:pb-6">
      {/* Mentor Welcome Card */}
      <div className="group relative mb-8 overflow-hidden rounded-[32px] bg-[#3D855A] p-5 text-white shadow-2xl sm:rounded-[40px] sm:p-8">
         <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-1000" />
         <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-[#236842]/30 rounded-full blur-3xl opacity-50" />
         
         <div className="relative z-10 mb-6 flex items-start justify-between sm:mb-8">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse shadow-sm shadow-emerald-400" />
                 <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Live Session Active</p>
               </div>
               <h2 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">Mirasror Ali</h2>
               <p className="text-xs font-bold text-white/60 mt-1 uppercase tracking-wider">Senior English Instructor</p>
            </div>
            <div className="p-4 bg-white/20 rounded-[22px] backdrop-blur-md border border-white/10 shadow-lg group-hover:rotate-12 transition-all">
               <GraduationCap size={28} className="drop-shadow-md" />
            </div>
         </div>
         
         <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="cursor-default rounded-[24px] border border-white/10 bg-white/15 p-4 backdrop-blur-sm transition-all hover:bg-white/20 sm:rounded-[28px] sm:p-5">
               <p className="text-[9px] font-black text-white/50 mb-2 uppercase tracking-widest leading-none">FAOL GURUHLAR</p>
               <p className="text-xl font-black tracking-tighter sm:text-2xl">{data?.activeGroups || 0} ta</p>
            </div>
            <div className="cursor-default rounded-[24px] border border-white/10 bg-white/15 p-4 backdrop-blur-sm transition-all hover:bg-white/20 sm:rounded-[28px] sm:p-5">
               <p className="text-[9px] font-black text-white/50 mb-2 uppercase tracking-widest leading-none">PENDING HW</p>
               <p className="text-xl font-black tracking-tighter sm:text-2xl">{data?.pendingHomeworks || 0} ta</p>
            </div>
         </div>
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[#1A1A1A]/40 tracking-[0.15em] uppercase px-1 flex items-center gap-2">
            <Calendar size={14} className="text-[#3D855A]" /> GURUHLARINGIZ
         </h2>
         <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {groups.map((group: any, idx: number) => (
          <div key={idx} className="group flex cursor-pointer items-center gap-3 rounded-[30px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] focus:ring-2 ring-[#3D855A]/10 sm:gap-5 sm:rounded-[38px] sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="w-16 h-16 rounded-[24px] bg-[#F2F8F5] text-[#3D855A] flex items-center justify-center font-black text-xl group-hover:bg-[#3D855A] group-hover:text-white transition-all shadow-inner group-hover:rotate-3 shrink-0">
              {(group.name || '?').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold leading-tight tracking-tight text-[#111827] truncate sm:text-base dark:text-slate-100">{group.name}</h3>
              <div className="flex items-center gap-3 mt-2.5">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">
                   <Users size={12} strokeWidth={2.5} /> {group.students} students
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-[#3D855A] uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md">
                   <BookOpen size={12} strokeWidth={2.5} /> {group.lessons}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
               <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest">{group.nextLesson}</span>
               <div className="p-2.5 rounded-xl bg-gray-50 text-gray-300 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} strokeWidth={3} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
         <button className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-[32px] border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:border-red-100 active:scale-95 sm:gap-5 sm:rounded-[42px] sm:p-8 dark:border-slate-700 dark:bg-slate-900">
            <div className="absolute top-2 right-2 flex gap-1">
               {data?.pendingHomeworks > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping opacity-75" />}
            </div>
            <div className="p-5 rounded-[24px] bg-red-50 text-red-500 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
               <AlertCircle size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black leading-tight tracking-tight text-[#111827] uppercase sm:text-[11px] dark:text-slate-100">Tekshirilmagan<br/>vazifalar ({data?.pendingHomeworks || 0})</span>
         </button>
         <button className="group flex flex-col items-center gap-4 rounded-[32px] border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:border-blue-100 active:scale-95 sm:gap-5 sm:rounded-[42px] sm:p-8 dark:border-slate-700 dark:bg-slate-900">
            <div className="p-5 rounded-[24px] bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-inner">
               <BarChart3 size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black leading-tight tracking-tight text-[#111827] uppercase sm:text-[11px] dark:text-slate-100">Guruxlar<br/>analitikasi</span>
         </button>
      </div>
      
      <button className="group relative mb-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-[30px] bg-[#3D855A] p-4 font-black text-white shadow-xl shadow-[#3D855A]/20 transition-all hover:bg-[#2F6A46] active:scale-[0.98] sm:gap-4 sm:rounded-[36px] sm:p-6">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
         <MessageSquarePlus size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
         <span className="tracking-tight">YANGI TOPSHIRIQ QO&apos;SHISH</span>
      </button>
    </div>
  );
}
