'use client';
import { CheckSquare, Clock } from 'lucide-react';

export function ExamCard() {
  return (
    <div className="relative mt-3 flex items-center justify-between overflow-hidden rounded-[20px] border border-[#FDEBCE] bg-[#FFF9ED] p-3 shadow-sm sm:p-4 dark:border-[#5f4b2a] dark:bg-[#2b2418]">
      {/* Decorative gradient glow (optional, for realism) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDEBCE]/40 rounded-full blur-3xl -translate-y-10 translate-x-10" />

      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#FCE9C5] bg-[#FFF1D7] p-2.5 text-[#C78736] shadow-inner sm:p-3 dark:border-[#6e5a36] dark:bg-[#3a2f1c]">
          <CheckSquare size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-[#111827] sm:text-lg dark:text-slate-100">Exam</h3>
          <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#C78736] sm:gap-1.5 sm:text-sm">
            <span className="min-w-[24px] rounded border border-b border-l border-r border-t-0 border-[#F3DEB4] bg-white px-1.5 py-0.5 text-center shadow-sm sm:min-w-[28px] sm:px-2 dark:border-[#6e5a36] dark:bg-[#2b2418] dark:text-amber-200">
              3
            </span>{' '}
            kun
            <span className="ml-1 min-w-[26px] rounded border border-b border-l border-r border-t-0 border-[#F3DEB4] bg-white px-1.5 py-0.5 text-center shadow-sm sm:ml-1.5 sm:min-w-[32px] sm:px-2 dark:border-[#6e5a36] dark:bg-[#2b2418] dark:text-amber-200">
              00
            </span>{' '}
            soat
          </div>
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-1 rounded-full border border-[#FDD0C1] bg-[#FEECE5] px-2 py-1.5 text-[11px] font-bold text-[#D2613B] shadow-sm sm:gap-1.5 sm:px-2.5 sm:text-xs dark:border-[#7a4535] dark:bg-[#3b2320] dark:text-[#f2a58f]">
        <Clock size={14} strokeWidth={2.5} /> Tez!
      </div>
    </div>
  );
}
