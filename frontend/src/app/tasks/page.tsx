'use client';
import { useState, useEffect } from 'react';
import { ListTodo, CheckCircle2, Clock, AlertCircle, Search, Filter, MoreVertical, MessageSquarePlus, ChevronRight, Users, BookOpen, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function TeacherTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

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
        {tasks.length > 0 ? tasks.map((task, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group cursor-pointer focus:ring-2 ring-[#3D855A]/10 overflow-hidden">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl transition-all shadow-inner bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-6`}>
              <ListTodo size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-extrabold text-[#111827] text-lg leading-tight tracking-tight truncate mb-1 group-hover:translate-x-1 transition-transform">{task.title}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2 truncate flex items-center gap-2">
                 <BookOpen size={12} /> {task.course?.title || 'Umumiy'}
              </p>
              <div className="flex items-center gap-3">
                 <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600`}>
                    ACTIVE
                 </span>
                 <span className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md text-gray-400">Total: {task._count?.studentTasks || 0}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
               <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest bg-gray-50 text-gray-400`}>
                   No deadline
               </span>
               <div className="p-3 rounded-2xl bg-gray-50 text-gray-300 group-hover:bg-[#3D855A] group-hover:text-white transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
               </div>
            </div>
          </div>
        )) : (
          <div className="p-16 text-center bg-gray-50 rounded-[46px] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ListTodo size={30} className="text-gray-200" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Hali topshiriqlar yaratilmagan</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center pb-8 opacity-80 border-t border-gray-100/10 pt-8">
         <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest tracking-tighter">
            <BookOpen size={16} className="inline mr-2" /> Global Tasks Repository
         </p>
      </div>
    </div>
  );
}
