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
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Mentor Welcome Card */}
      <div className="bg-[#3D855A] p-8 rounded-[40px] text-white mb-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-1000" />
         <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-[#236842]/30 rounded-full blur-3xl opacity-50" />
         
         <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse shadow-sm shadow-emerald-400" />
                 <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Live Session Active</p>
               </div>
               <h2 className="text-2xl font-black tracking-tight leading-tight">Mirasror Ali</h2>
               <p className="text-xs font-bold text-white/60 mt-1 uppercase tracking-wider">Senior English Instructor</p>
            </div>
            <div className="p-4 bg-white/20 rounded-[22px] backdrop-blur-md border border-white/10 shadow-lg group-hover:rotate-12 transition-all">
               <GraduationCap size={28} className="drop-shadow-md" />
            </div>
         </div>
         
         <div className="flex gap-4 relative z-10">
            <div className="flex-1 bg-white/15 p-5 rounded-[28px] backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
               <p className="text-[9px] font-black text-white/50 mb-2 uppercase tracking-widest leading-none">FAOL GURUHLAR</p>
               <p className="text-2xl font-black tracking-tighter">{data?.activeGroups || 0} ta</p>
            </div>
            <div className="flex-1 bg-white/15 p-5 rounded-[28px] backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-default">
               <p className="text-[9px] font-black text-white/50 mb-2 uppercase tracking-widest leading-none">PENDING HW</p>
               <p className="text-2xl font-black tracking-tighter">{data?.pendingHomeworks || 0} ta</p>
            </div>
         </div>
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[#1A1A1A]/40 tracking-[0.15em] uppercase px-1 flex items-center gap-2">
            <Calendar size={14} className="text-[#3D855A]" /> GURUHLARINGIZ
         </h2>
         <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group cursor-pointer focus:ring-2 ring-[#3D855A]/10">
            <div className="w-16 h-16 rounded-[24px] bg-[#F2F8F5] text-[#3D855A] flex items-center justify-center font-black text-xl group-hover:bg-[#3D855A] group-hover:text-white transition-all shadow-inner group-hover:rotate-3">
              {group.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-[#111827] text-base leading-tight tracking-tight">{group.name}</h3>
              <div className="flex items-center gap-3 mt-2.5">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">
                   <Users size={12} strokeWidth={2.5} /> {group.students} students
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-[#3D855A] uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md">
                   <BookOpen size={12} strokeWidth={2.5} /> {group.lessons}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
               <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest">{group.nextLesson}</span>
               <div className="p-2.5 rounded-xl bg-gray-50 text-gray-300 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} strokeWidth={3} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <button className="bg-white p-8 rounded-[42px] border border-gray-100 shadow-sm flex flex-col items-center gap-5 text-center active:scale-95 transition-all group hover:border-red-100 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1">
               {data?.pendingHomeworks > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping opacity-75" />}
            </div>
            <div className="p-5 rounded-[24px] bg-red-50 text-red-500 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
               <AlertCircle size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[#111827] leading-tight uppercase tracking-tight">Tekshirilmagan<br/>vazifalar ({data?.pendingHomeworks || 0})</span>
         </button>
         <button className="bg-white p-8 rounded-[42px] border border-gray-100 shadow-sm flex flex-col items-center gap-5 text-center active:scale-95 transition-all group hover:border-blue-100">
            <div className="p-5 rounded-[24px] bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-inner">
               <BarChart3 size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[#111827] leading-tight uppercase tracking-tight">Guruxlar<br/>analitikasi</span>
         </button>
      </div>
      
      <button className="w-full bg-[#1A1A1A] hover:bg-black text-white p-6 rounded-[36px] font-black flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-2xl shadow-gray-200/50 mb-8 overflow-hidden relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
         <MessageSquarePlus size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
         <span className="tracking-tight">YANGI TOPSHIRIQ QO&apos;SHISH</span>
      </button>
    </div>
  );
}
