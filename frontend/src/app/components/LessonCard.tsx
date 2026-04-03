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
      className={`w-full text-left bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-start gap-4 transition-all ${isDone ? 'active:scale-[0.98] cursor-pointer hover:border-gray-200' : 'opacity-75 cursor-not-allowed'}`}
    >
      {/* Icon */}
      <div className={`p-3 rounded-[14px] shrink-0 border ${
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
            <h4 className="font-extrabold text-gray-900 text-base leading-tight tracking-tight">Unit {unit}</h4>
            <p className="text-[13px] text-gray-500 mt-1 font-medium">{title}</p>
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
