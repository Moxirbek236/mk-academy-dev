'use client';
import { Users, GraduationCap, ChevronRight, Search, PlusCircle, Filter, MoreVertical, Calendar, Globe, BookOpen } from 'lucide-react';

export default function GroupsPage() {
  const groups = [
    { name: 'IELTS Intensive - 01', students: 12, lessons: '24/40', schedule: 'Dush-Chor-Jum', time: '14:30' },
    { name: 'CEFR B2 - Master', students: 8, lessons: '15/30', schedule: 'Sesh-Pay-Shan', time: '18:00' },
    { name: 'General English - A2', students: 15, lessons: '5/24', schedule: 'Dush-Chor-Jum', time: '10:00' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Guruhlar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sizga biriktirilgan guruhlar</p>
        </div>
        <button className="bg-[#3D855A] text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-all">
          <PlusCircle size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Guruh nomini qidirish..." 
            className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group cursor-pointer focus:ring-2 ring-[#3D855A]/10">
            <div className="w-16 h-16 rounded-[24px] bg-[#F2F8F5] text-[#3D855A] flex items-center justify-center font-black text-xl group-hover:bg-[#3D855A] group-hover:text-white transition-all shadow-inner group-hover:scale-105 group-hover:rotate-3 shadow-sm shadow-[#3D855A]/10">
              {group.name.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-extrabold text-[#111827] text-lg leading-tight tracking-tight mb-2 group-hover:translate-x-1 transition-transform truncate">{group.name}</h3>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2.5 py-1 rounded-md">
                   <Users size={12} strokeWidth={2.5} /> {group.students} st.
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-[#3D855A] uppercase tracking-tighter bg-emerald-50 px-2.5 py-1 rounded-md">
                   <BookOpen size={12} strokeWidth={2.5} /> {group.lessons} units
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
               <span className="text-[10px] font-black text-[#111827] bg-gray-50 px-2 py-1 rounded-full uppercase tracking-widest">{group.time}</span>
               <div className="p-3 rounded-2xl bg-gray-50 text-gray-300 group-hover:bg-[#3D855A] group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={18} strokeWidth={3} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center pb-8">
         <button className="flex items-center gap-3 text-[11px] font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest tracking-tighter">
            <Calendar size={16} /> To&apos;liq Dars Jadvali
         </button>
      </div>
    </div>
  );
}
