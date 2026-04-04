'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Trophy, Sparkles, ChevronRight, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LessonCard } from '../components/LessonCard';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function LearningPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/my-learning');
        setCourses(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
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
        ) : courses.length > 0 ? (
           courses.map((course, idx) => (
             <div 
               key={course.id}
               onClick={() => course.isActive && router.push(`/course/${course.id}`)}
               className={`bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group overflow-hidden cursor-pointer ${!course.isActive ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
             >
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl transition-all shadow-inner bg-[#F2F8F5] text-[#3D855A] group-hover:bg-[#3D855A] group-hover:text-white group-hover:rotate-6`}>
                  {course.isActive ? <BookOpen size={24} strokeWidth={2.5} /> : <Lock size={24} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 truncate">
                  <h3 className="font-extrabold text-[#111827] text-lg tracking-tight truncate">{course.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md text-gray-500">{course.level}</span>
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md text-[#3D855A]">{(course._count?.tasks || 0) + (course._count?.tests || 0)} Units</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
             </div>
           ))
        ) : (
          <div className="p-16 text-center bg-gray-50 rounded-[46px] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BookOpen size={30} className="text-gray-200" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Hali hech qanday darsga a&apos;zo bo&apos;lmagansiz</p>
          </div>
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
