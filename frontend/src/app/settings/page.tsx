'use client';
import { useState, useEffect } from 'react';
import { User, Shield, Bell, Globe, LogOut, ChevronRight, Moon, Key, Mail, Phone, Crown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { fetchCurrentUserProfile } from '@/lib/api-compat';
import { localizePath } from '@/i18n/localizedPath';
import { clearStoredAuth } from '@/lib/auth-storage';

type SettingsItem = {
  icon: typeof User;
  label: string;
  value: string;
  path?: string;
  action?: () => void;
};

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const router = useRouter();
  const locale = useLocale();
  const { role } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchCurrentUserProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    void clearStoredAuth().finally(() => {
      router.push(localizePath(locale, '/landing'));
    });
  };

  const sections: Array<{ title: string; items: SettingsItem[] }> = [
    {
      title: t('personal'),
      items: [
        { icon: User, label: t('profileSettings'), value: profile?.fullName || t('loading'), path: '/settings/profile' },
        { icon: Mail, label: t('emailAddress'), value: profile?.email || t('loading'), path: '/settings/email' },
        { icon: Phone, label: t('phoneNumber'), value: profile?.phone || '+998 -- --- -- --', path: '/settings/phone' },
      ]
    },
    {
      title: t('security'),
      items: [
        { icon: Key, label: t('changePassword'), value: t('passwordUpdated'), path: '/settings/password' },
        { icon: Shield, label: t('twoFactor'), value: t('disabled'), path: '/settings/2fa' },
      ]
    },
    {
      title: t('system'),
      items: [
        { icon: Bell, label: t('notifications'), value: t('notificationsEnabled'), path: '/settings/notifications' },
        { icon: Globe, label: t('language'), value: profile?.language === 'RU' ? t('languages.ru') : profile?.language === 'EN' ? t('languages.en') : t('languages.uz'), path: '/settings/language' },
        {
          icon: Moon,
          label: t('themeMode'),
          value: resolvedTheme === 'dark' ? t('themeEnabled') : t('themeDisabled'),
          action: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
        },
      ]
    }
  ];

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('title')}</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em] ${
                role === 'superadmin' ? 'bg-[#FFEBEC] text-[#E54D2E]' : 
                role === 'teacher' ? 'bg-[#F2F8F5] text-[#3D855A]' : 
                'bg-blue-50 text-blue-600'
             }`}>
               {t('roleLabel', { role: role || 'student' })}
             </span>
             {role === 'superadmin' && <Crown size={12} className="text-amber-500" />}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border-2 border-white bg-gradient-to-tr from-[#3D855A] to-[#83D1A5] text-white shadow-xl shadow-[#3D855A]/20 sm:h-14 sm:w-14 sm:rounded-[22px] sm:border-4">
           <User size={28} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-[11px] font-black text-gray-400 tracking-[0.15em] uppercase mb-4 px-2">{section.title}</h2>
            <div className="overflow-hidden rounded-[30px] border border-gray-100 bg-white p-2.5 shadow-sm sm:rounded-[36px] sm:p-3">
              {section.items.map((item, iIdx) => (
                <button 
                  key={iIdx} 
                  onClick={item.action ? item.action : () => router.push(localizePath(locale, item.path || '/'))}
                  className="group flex w-full items-center gap-3 rounded-2xl p-3.5 transition-colors active:scale-[0.98] hover:bg-[#F2F8F5] sm:gap-4 sm:rounded-3xl sm:p-4"
                >
                  <div className="shrink-0 rounded-[16px] bg-[#F2F8F5] p-3 text-[#3D855A] transition-transform group-hover:scale-105 sm:rounded-[18px] sm:p-3.5">
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
          className="group mb-10 mt-4 flex w-full items-center gap-3 rounded-[28px] border border-red-100/50 bg-red-50 p-4 text-red-600 shadow-sm shadow-red-100/50 transition-all hover:bg-red-100 active:scale-[0.98] sm:gap-4 sm:rounded-[36px] sm:p-6"
        >
          <div className="p-3.5 bg-white rounded-2xl text-red-500 shadow-sm transition-transform group-hover:rotate-12">
             <LogOut size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left">
             <p className="text-[15px] font-black tracking-tight uppercase">{t('logout')}</p>
             <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest">{t('logoutDescription')}</p>
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
