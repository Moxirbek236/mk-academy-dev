'use client';
import { Clock, Lock, Check } from 'lucide-react';

interface LessonCardProps {
  unit: string;
  title: string;
  status: 'done' | 'locked';
  progress: number;
  onClick?: () => void;
}

export function LessonCard({ unit, title, status, progress, onClick }: LessonCardProps) {
  const isDone = status === 'done';

  return (
    <button 
      onClick={isDone ? onClick : undefined}
      className={`flex w-full items-start gap-3 rounded-2xl border border-gray-100/50 bg-white p-3 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all sm:gap-4 sm:p-4 dark:border-slate-700 dark:bg-slate-900 ${isDone ? 'cursor-pointer active:scale-[0.98] hover:border-gray-200' : 'cursor-not-allowed opacity-75'}`}
    >
      {/* Icon */}
      <div className={`shrink-0 rounded-[14px] border p-3 ${
        isDone 
          ? 'bg-[#F2F8F5] text-[#3D855A] border-[#DCEFE5]' 
          : 'bg-[#F4F6F5] text-[#8EA297] border-[#E8ECE9]'
      }`}>
        {isDone ? <Clock size={20} strokeWidth={2.5} /> : <Lock size={20} strokeWidth={2.5} />}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col pt-1">
        <div className="flex justify-between items-start w-full">
          <div>
            <h4 className="text-sm font-extrabold leading-tight tracking-tight text-gray-900 sm:text-base dark:text-slate-100">Unit {unit}</h4>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-[13px]">{title}</p>
          </div>
          {/* Badge */}
          <div className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border shrink-0 ml-2 shadow-sm ${
            isDone
              ? 'bg-[#F2F8F5] text-[#3D855A] border-[#DCEFE5]'
              : 'bg-[#F4F6F5] text-[#71877C] border-[#E5EAE7]'
          }`}>
            {isDone ? <Check size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={2.5} />}
            {isDone ? 'Tugadi' : 'Yopiq'}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3.5 h-[3px] w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-[#3D855A]' : 'bg-transparent'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </button>
  );
}
