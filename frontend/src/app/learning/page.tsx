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
  RefreshButton,
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
    <PageShell
      title="Darslar"
      subtitle="Sizning kurslaringiz"
      action={<RefreshButton onRefresh={refetch} disabled={loading} />}
    >
      <div className="mb-6 flex flex-col gap-3 px-1 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 tracking-tight flex items-center gap-2">
            <Sparkles size={12} className="text-[#2563eb]" /> Sizning kurslaringiz
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2 text-amber-600 shadow-sm">
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
          className="w-full rounded-[18px] border border-gray-100 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold shadow-sm transition-all focus:border-[#2563eb] focus:outline-none sm:rounded-[24px] sm:py-4"
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
        <div className="grid grid-cols-1 gap-4 pb-20 md:grid-cols-2 lg:grid-cols-2 sm:gap-6">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => course.isActive !== false && router.push(`/course/${course.id}`)}
                className={`group flex cursor-pointer items-center gap-3 overflow-hidden rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#2563eb]/30 hover:shadow-xl active:scale-[0.98] sm:gap-5 sm:rounded-[38px] sm:p-6 ${
                  course.isActive === false ? 'opacity-60 grayscale cursor-not-allowed' : ''
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#eff6ff] text-lg font-black text-[#2563eb] shadow-inner transition-all group-hover:rotate-6 group-hover:bg-[#2563eb] group-hover:text-white sm:h-16 sm:w-16 sm:rounded-[24px] sm:text-xl">
                  {course.isActive === false ? <Lock size={24} strokeWidth={2.5} /> : <BookOpen size={24} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-base font-extrabold tracking-tight text-[#111827] sm:text-lg">{course.title}</h3>
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

      <div className="mt-4 flex justify-center pb-10 text-center sm:mt-6 sm:pb-12">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest tracking-tighter opacity-80">
          MK ACADEMY LEARNING PATHWAY
        </p>
      </div>
    </PageShell>
  );
}
