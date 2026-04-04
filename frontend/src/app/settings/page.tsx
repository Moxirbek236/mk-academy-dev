'use client';
import { useState } from 'react';
import { User, Shield, Bell, Globe, LogOut, ChevronRight, Moon, LogIn, Key, Mail, Phone, BookOpen, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/landing');
  };

  const sections = [
    {
      title: 'SHAXSIY MA&apos;LUMOTLAR',
      items: [
        { icon: User, label: 'Profil sozlamalari', value: 'Ism, Familiya', path: '/settings/profile' },
        { icon: Mail, label: 'Email manzil', value: 'moxirbek@mk.uz', path: '/settings/email' },
        { icon: Phone, label: 'Telefon raqam', value: '+998 90 123 45 67', path: '/settings/phone' },
      ]
    },
    {
      title: 'XAVFSIZLIK',
      items: [
        { icon: Key, label: 'Parolni o&apos;zgartirish', value: 'Ohirgi marta 2 oy oldin', path: '/settings/password' },
        { icon: Shield, label: 'Ikki bosqichli autentifikatsiya', value: 'O&apos;chirilgan', path: '/settings/2fa' },
      ]
    },
    {
      title: 'TIZIM',
      items: [
        { icon: Bell, label: 'Bildirishnomalar', value: 'Hammasi yoqilgan', path: '/settings/notifications' },
        { icon: Globe, label: 'Til (Language)', value: "O'zbekcha", path: '/settings/language' },
        { icon: Moon, label: 'Tungi rejim', value: darkMode ? 'Yoqilgan' : 'O&apos;chirilgan', action: () => setDarkMode(!darkMode) },
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sozlamalar</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em] ${
               role === 'superadmin' ? 'bg-[#FFEBEC] text-[#E54D2E]' : 
               role === 'teacher' ? 'bg-[#F2F8F5] text-[#3D855A]' : 
               'bg-blue-50 text-blue-600'
             }`}>
               {role || 'Student'} ROLE
             </span>
             {role === 'superadmin' && <Crown size={12} className="text-amber-500" />}
          </div>
        </div>
        <div className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-[#3D855A] to-[#83D1A5] flex items-center justify-center text-white shadow-xl shadow-[#3D855A]/20 border-4 border-white">
           <User size={28} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-[11px] font-black text-gray-400 tracking-[0.15em] uppercase mb-4 px-2">{section.title}</h2>
            <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm overflow-hidden p-3 flex flex-col gap-1">
              {section.items.map((item, iIdx) => (
                <button 
                  key={iIdx} 
                  onClick={item.action ? item.action : () => router.push(item.path || '/')}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-all group active:scale-[0.98]"
                >
                  <div className="p-3.5 bg-gray-50 rounded-[18px] text-gray-400 group-hover:bg-[#F2F8F5] group-hover:text-[#3D855A] transition-all">
                     <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="text-[13px] font-extrabold text-gray-900">{item.label}</p>
                     <p className="text-[10px] font-bold text-gray-400 mt-1">{item.value}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center gap-4 p-6 bg-red-50 rounded-[36px] border border-red-100/50 hover:bg-red-100 transition-all text-red-600 group active:scale-[0.98] shadow-sm shadow-red-100/50 mb-10"
        >
          <div className="p-3.5 bg-white rounded-2xl text-red-500 shadow-sm transition-transform group-hover:rotate-12">
             <LogOut size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left">
             <p className="text-[15px] font-black tracking-tight uppercase">Tizimdan chiqish</p>
             <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest">Logout from MK Academy</p>
          </div>
          <ChevronRight size={20} strokeWidth={3} className="opacity-30 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
      
      <div className="mt-6 text-center opacity-30 pb-10">
         <p className="text-[9px] font-black uppercase tracking-[0.3em]">APP VERSION 2.4.0 • REV 102</p>
      </div>
    </div>
  );
}