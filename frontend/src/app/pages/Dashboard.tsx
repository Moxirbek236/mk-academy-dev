import { useState } from 'react';
import { ExamCard } from '../components/ExamCard';
import { LessonCard } from '../components/LessonCard';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, ListTodo, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-[13px] font-bold text-[#3D855A] tracking-wider uppercase mb-3">IMTIHON</h2>
      <ExamCard />

      <h2 className="text-[13px] font-bold text-[#3D855A] tracking-wider uppercase mt-8 mb-4">DARSLAR</h2>
      
      <div className="flex flex-col gap-3.5">
        <LessonCard 
          unit="1" 
          title="Kirish - 8 dars" 
          status="done" 
          progress={100} 
          onClick={() => setSelectedUnit("1")}
        />
        <LessonCard 
          unit="2" 
          title="Asosiy mavzu - 10 dars" 
          status="done" 
          progress={40} 
          onClick={() => setSelectedUnit("2")}
        />
        <LessonCard 
          unit="3" 
          title="Amaliyot - 12 dars" 
          status="locked" 
          progress={0} 
        />
        <LessonCard 
          unit="4" 
          title="Yakuniy - 6 dars" 
          status="locked" 
          progress={0} 
        />
      </div>

      <Dialog.Root open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-[340px] bg-white rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Dialog.Title className="text-xl font-extrabold text-gray-900">Unit {selectedUnit}</Dialog.Title>
                <Dialog.Description className="text-sm font-medium text-gray-500 mt-1">Nimani o'rganishni xohlaysiz?</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate(`/unit/${selectedUnit}/vocabulary`)}
                className="flex items-center gap-4 bg-[#F4F7F5] p-4 rounded-2xl hover:bg-[#E8ECE9] active:scale-[0.98] transition-all text-left group border border-transparent hover:border-gray-200"
              >
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#3D855A] group-hover:scale-110 transition-transform">
                  <BookOpen size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Vocabulary</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Yangi so'zlarni o'rganish</p>
                </div>
              </button>

              <button 
                onClick={() => navigate(`/unit/${selectedUnit}/tasks`)}
                className="flex items-center gap-4 bg-[#F4F7F5] p-4 rounded-2xl hover:bg-[#E8ECE9] active:scale-[0.98] transition-all text-left group border border-transparent hover:border-gray-200"
              >
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#C78736] group-hover:scale-110 transition-transform">
                  <ListTodo size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Tasks</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Amaliy mashqlar va testlar</p>
                </div>
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}