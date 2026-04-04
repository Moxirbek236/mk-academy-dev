'use client';
import { BookOpen, PlusCircle, Search, Filter, Trash2, Edit3, ChevronRight, Layers, MoreVertical, LayoutGrid, ListTodo } from 'lucide-react';

export default function CoursesPage() {
  const courses = [
    { title: 'Essential Grammar', level: 'A1-A2', lessons: 12, students: 45, status: 'Active' },
    { title: 'IELTS Intensive', level: 'B2-C1', lessons: 30, students: 12, status: 'Active' },
    { title: 'Business English', level: 'B1-B2', lessons: 24, students: 0, status: 'Draft' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kurslar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Jami: {courses.length} ta</p>
        </div>
        <button className="bg-[#3D855A] text-white p-3 rounded-2xl shadow-lg shadow-[#3D855A]/20 active:scale-90 transition-all">
          <PlusCircle size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Kurslarni qidirish..." 
            className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
          />
        </div>
        <button className="p-4 bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-gray-900 transition-all shadow-sm">
           <Filter size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {courses.map((course, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group overflow-hidden">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl transition-all shadow-inner ${
               course.status === 'Draft' ? 'bg-gray-100 text-gray-400' : 'bg-[#F2F8F5] text-[#3D855A] group-hover:bg-[#3D855A] group-hover:text-white group-hover:rotate-6'
            }`}>
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-extrabold text-[#111827] text-lg tracking-tight truncate">{course.title}</h3>
              <div className="flex items-center gap-3 mt-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md text-gray-500">{course.level}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md text-[#3D855A]">{course.lessons} units</span>
                <span className="text-[9px] font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md text-blue-500">{course.students} students</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <button className="p-2.5 rounded-xl bg-gray-50 text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <MoreVertical size={18} strokeWidth={2.5} />
               </button>
               {course.status === 'Draft' && <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Draft</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center pb-8 border-t border-gray-100/50 pt-8">
         <div className="grid grid-cols-2 gap-4 w-full">
            <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-[24px] font-black text-[11px] text-gray-400 hover:text-[#3D855A] transition-all">
               <Layers size={18} /> Unit Library
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-[24px] font-black text-[11px] text-gray-400 hover:text-[#C78736] transition-all">
               <ListTodo size={18} /> Master Tasks
            </button>
         </div>
      </div>
    </div>
  );
}
