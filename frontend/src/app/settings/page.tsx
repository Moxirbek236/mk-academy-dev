'use client';
import { useState, useEffect } from 'react';
import { User, Shield, Bell, Globe, LogOut, ChevronRight, Moon, LogIn, Key, Mail, Phone, BookOpen, Crown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/landing');
  };

  const sections = [
    {
      title: 'SHAXSIY MA\'LUMOTLAR',
      items: [
        { icon: User, label: 'Profil sozlamalari', value: profile?.fullName || 'Yuklanmoqda...', path: '/settings/profile' },
        { icon: Mail, label: 'Email manzil', value: profile?.email || 'Yuklanmoqda...', path: '/settings/email' },
        { icon: Phone, label: 'Telefon raqam', value: profile?.profile?.phone || '+998 -- --- -- --', path: '/settings/phone' },
      ]
    },
    {
      title: 'XAVFSIZLIK',
      items: [
        { icon: Key, label: 'Parolni o\'zgartirish', value: 'Ohirgi marta 2 oy oldin', path: '/settings/password' },
        { icon: Shield, label: 'Ikki bosqichli autentifikatsiya', value: 'O\'chirilgan', path: '/settings/2fa' },
      ]
    },
    {
      title: 'TIZIM',
      items: [
        { icon: Bell, label: 'Bildirishnomalar', value: 'Hammasi yoqilgan', path: '/settings/notifications' },
        { icon: Globe, label: 'Til (Language)', value: profile?.profile?.language === 'UZ' ? "O'zbekcha" : profile?.profile?.language || "O'zbekcha", path: '/settings/language' },
        { icon: Moon, label: 'Tungi rejim', value: darkMode ? 'Yoqilgan' : 'O\'chirilgan', action: () => setDarkMode(!darkMode) },
      ]
    }
  ];

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-8 lg:px-12 w-full max-w-3xl mx-auto bg-white min-h-screen pt-6 sm:pt-10">
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
            <h2 className="text-[11px] font-black text-gray-400 tracking-[0.15em] uppercase mb-4 px-2" dangerouslySetInnerHTML={{ __html: section.title }} />
            <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm overflow-hidden p-3 flex flex-col gap-1">
              {section.items.map((item, iIdx) => (
                <button 
                  key={iIdx} 
                  onClick={item.action ? item.action : () => router.push(item.path || '/')}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-[#F2F8F5] transition-colors group active:scale-[0.98]"
                >
                  <div className="p-3.5 bg-[#F2F8F5] rounded-[18px] text-[#3D855A] flex-shrink-0 transition-transform group-hover:scale-105">
                     <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                     <p className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 group-hover:text-[#3D855A] transition-colors truncate">{item.label}</p>
                     <p className="text-[11px] sm:text-[12px] font-bold text-gray-400 mt-0.5 truncate">{item.value}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#3D855A] group-hover:translate-x-1 transition-all flex-shrink-0" />
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