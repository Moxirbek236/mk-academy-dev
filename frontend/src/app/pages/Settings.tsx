import { User, Bell, Shield, Moon, LogOut, ChevronRight } from 'lucide-react';

export function Settings() {
  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <h2 className="text-[22px] font-extrabold text-gray-900 mb-6 tracking-tight">Sozlamalar</h2>

      <div className="bg-white p-5 rounded-[28px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 mb-8">
        <div className="w-[60px] h-[60px] rounded-[22px] bg-[#E5F3FF] flex items-center justify-center text-[#007AFF] shadow-inner border border-[#D1E8FF]">
          <User size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-extrabold text-gray-900 text-[18px] leading-tight">Muhammad</h3>
          <p className="text-[13px] text-gray-500 font-medium mt-0.5">Boshlang'ich daraja</p>
        </div>
        <button className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-2xl text-[13px] font-extrabold hover:bg-gray-200 active:scale-95 transition-all">
          Tahrir
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {[
          { icon: Bell, title: 'Bildirishnomalar', color: 'text-[#E88B13]', bg: 'bg-[#FFF4E5]' },
          { icon: Shield, title: 'Xavfsizlik va Parol', color: 'text-[#3D855A]', bg: 'bg-[#F2F8F5]' },
          { icon: Moon, title: 'Qorong\'u rejim', color: 'text-[#8A2BE2]', bg: 'bg-[#F3E8FF]', rightText: 'O\'chiq' },
        ].map((item, idx) => (
          <button 
            key={idx} 
            className="bg-white p-4.5 rounded-[24px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 hover:border-gray-200 active:scale-[0.98] transition-all text-left group"
          >
            <div className={`${item.bg} ${item.color} p-3 rounded-[18px] group-hover:scale-110 transition-transform`}>
              <item.icon size={22} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-gray-900 flex-1 text-[15px]">{item.title}</span>
            {item.rightText && <span className="text-[13px] font-bold text-gray-400 mr-2 bg-gray-50 px-2 py-1 rounded-lg">{item.rightText}</span>}
            <ChevronRight size={18} strokeWidth={3} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200/60 pt-6">
        <button className="w-full bg-[#FFF0F0] text-[#FF3B30] p-4.5 rounded-[24px] shadow-sm border border-[#FFE5E5] flex items-center justify-center gap-2 font-extrabold hover:bg-[#FFE5E5] active:scale-[0.98] transition-all text-[15px]">
          <LogOut size={20} strokeWidth={3} /> Profildan chiqish
        </button>
      </div>
    </div>
  );
}