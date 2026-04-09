'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Lock, Search, Sparkles, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
} from '@/app/components/ui/PagePrimitives';

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data, loading, error, refetch } = useCourses({
    search: searchTerm,
    page: 1,
    limit: 24,
  });

  const courses = useMemo(() => data.items || [], [data.items]);

  return (
    <PageShell title="Darslar" subtitle="Sizning kurslaringiz">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 tracking-tight flex items-center gap-2">
            <Sparkles size={12} className="text-[#2563eb]" /> Sizning kurslaringiz
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
          <Trophy size={18} strokeWidth={2.5} />
          <span className="text-[14px] font-black tracking-tighter">LVL 2</span>
        </div>
      </div>

      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Mavzu yoki dars bo'yicha qidirish..."
          className="w-full bg-white border border-gray-100 rounded-[24px] py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#2563eb] transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <PageLoadingState title="Kurslar yuklanmoqda" description="Sizga tegishli kurslar olinmoqda" />
      ) : error ? (
        <PageErrorState
          title="Kurslarni olishda xatolik"
          description={error}
          retryLabel="Qayta urinish"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => course.isActive !== false && router.push(`/course/${course.id}`)}
                className={`bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#2563eb]/30 hover:shadow-xl active:scale-[0.98] transition-all group overflow-hidden cursor-pointer ${
                  course.isActive === false ? 'opacity-60 grayscale cursor-not-allowed' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl transition-all shadow-inner bg-[#eff6ff] text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white group-hover:rotate-6 shrink-0">
                  {course.isActive === false ? <Lock size={24} strokeWidth={2.5} /> : <BookOpen size={24} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-[#111827] text-lg tracking-tight truncate">{course.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md text-gray-500 whitespace-nowrap">
                      {course.level || 'NO LEVEL'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md text-[#2563eb] whitespace-nowrap">
                      {course.isActive === false ? 'Locked' : 'Open'}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <PageEmptyState
                title="Kurslar topilmadi"
                description="Hozircha sizga tegishli kurslar yoki qidiruvga mos natija yo'q."
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-center text-center pb-12">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest tracking-tighter opacity-80">
          MK ACADEMY LEARNING PATHWAY
        </p>
      </div>
    </PageShell>
  );
}
