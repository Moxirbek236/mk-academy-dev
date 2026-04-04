'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Trophy, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LessonCard } from '../components/LessonCard';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function LearningPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Darslar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 tracking-tight flex items-center gap-2">
            <Sparkles size={12} className="text-[#3D855A]" /> Sizning kurslaringiz
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
           <Trophy size={18} strokeWidth={2.5} />
           <span className="text-[14px] font-black tracking-tighter">LVL 2</span>
        </div>
      </div>

      {/* Course Search */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Mavzu yoki dars bo'yicha qidirish..." 
          className="w-full bg-white border border-gray-100 rounded-[24px] py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {loading ? (
           <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={36} /></div>
        ) : tasks.length > 0 ? (
           tasks.map((task, idx) => (
             <LessonCard 
                key={task.id}
                unit={(idx + 1).toString()} 
                title={task.title} 
                status={idx === 0 ? "done" : idx === 1 ? "done" : "locked"} 
                progress={idx === 0 ? 100 : idx === 1 ? 40 : 0} 
             />
           ))
        ) : (
          <>
            <LessonCard 
              unit="1" 
              title="Essential Grammar - 8 Lessons" 
              status="done" 
              progress={100} 
            />
            <LessonCard 
              unit="2" 
              title="Daily Conversation - 10 Lessons" 
              status="done" 
              progress={40} 
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

      <div className="mt-6 flex justify-center text-center pb-12">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest tracking-tighter opacity-80">
          MK ACADEMY LEARNING PATHWAY
        </p>
      </div>
    </div>
  );
}
