import { TrendingUp, CheckCircle, Clock } from 'lucide-react';

export function Results() {
  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <h2 className="text-[22px] font-extrabold text-gray-900 mb-6 tracking-tight">Sizning Natijalaringiz</h2>

      <div className="grid grid-cols-2 gap-3.5 mb-8">
        <div className="bg-[#F2F8F5] p-5 rounded-3xl shadow-sm border border-[#E3EFE8] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-[#3D855A]">
            <TrendingUp size={18} strokeWidth={3} />
            <span className="font-extrabold text-[13px] uppercase tracking-wider">O'rtacha ball</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">86%</p>
            <p className="text-xs text-[#3D855A] font-bold mt-1.5 flex items-center gap-1">
              <span className="bg-[#3D855A]/10 px-1.5 rounded">+4%</span> o'tgan haftadan
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-gray-500">
            <Clock size={18} strokeWidth={3} />
            <span className="font-extrabold text-[13px] uppercase tracking-wider">Vaqt</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">12<span className="text-xl">s</span></p>
            <p className="text-xs text-gray-500 font-bold mt-1.5">
              Umumiy sarflangan
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 mt-10">
        <h3 className="text-[13px] font-bold text-[#3D855A] tracking-wider uppercase">So'nggi testlar</h3>
        <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Barchasi</button>
      </div>
      
      <div className="flex flex-col gap-3.5">
        {[
          { name: 'Unit 1: Grammar Basics', score: 95, date: 'Bugun', isNew: true },
          { name: 'Unit 1: Vocabulary', score: 88, date: 'Kecha', isNew: false },
          { name: 'Placement Test', score: 72, date: '12 Okt', isNew: false },
        ].map((test, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-4.5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                test.isNew ? 'bg-[#E3EFE8] text-[#3D855A]' : 'bg-[#F4F7F5] text-gray-400 group-hover:text-[#3D855A]'
              }`}>
                <CheckCircle size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-[15px] leading-snug tracking-tight">{test.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 font-medium">{test.date}</p>
                  {test.isNew && <span className="w-1.5 h-1.5 bg-[#3D855A] rounded-full" />}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-black text-lg ${test.score >= 90 ? 'text-[#3D855A]' : 'text-gray-900'}`}>{test.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}