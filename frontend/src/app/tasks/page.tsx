'use client';
import { ListTodo, CheckCircle2, Clock, AlertCircle, Search, Filter, MoreVertical, MessageSquarePlus, ChevronRight, Users, BookOpen } from 'lucide-react';

export default function TeacherTasksPage() {
  const tasks = [
    { title: 'Essential Grammar - Homework', group: 'IELTS Intensive - 01', pending: 8, total: 12, dueDate: 'Bugun, 18:00' },
    { title: 'Daily Conversation - Quiz', group: 'CEFR B2 - Master', pending: 2, total: 8, dueDate: 'Ertaga, 12:00' },
    { title: 'Vocabulary Test - Unit 1', group: 'General English - A2', pending: 0, total: 15, dueDate: '2 kun oldin' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Topshiriqlar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review & Assignment Management</p>
        </div>
        <button className="bg-[#3D855A] text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-all">
          <MessageSquarePlus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Topshiriqlarni qidirish..." 
            className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {tasks.map((task, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group cursor-pointer focus:ring-2 ring-[#3D855A]/10 overflow-hidden">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl transition-all shadow-inner ${
               task.pending > 0 ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white group-hover:rotate-6' : 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-6'
            }`}>
              <ListTodo size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-extrabold text-[#111827] text-lg leading-tight tracking-tight truncate mb-1 group-hover:translate-x-1 transition-transform">{task.title}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2 truncate flex items-center gap-2">
                 <Users size={12} /> {task.group}
              </p>
              <div className="flex items-center gap-3">
                 <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${
                   task.pending > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                 }`}>
                   {task.pending} ta pending
                 </span>
                 <span className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md text-gray-400">Total: {task.total}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
               <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                 task.pending > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-50 text-gray-400'
               }`}>
                  {task.dueDate}
               </span>
               <div className="p-3 rounded-2xl bg-gray-50 text-gray-300 group-hover:bg-[#3D855A] group-hover:text-white transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center pb-8 opacity-80">
         <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest tracking-tighter">
            <BookOpen size={16} className="inline mr-2" /> Global Tasks Repository
         </p>
      </div>
    </div>
  );
}
