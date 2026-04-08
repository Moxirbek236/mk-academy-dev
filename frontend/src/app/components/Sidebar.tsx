'use client';
import { Home, Book, Settings as SettingsIcon, LayoutGrid, Users, DollarSign, BookOpen, Layers, ShieldCheck, LogOut, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';

interface SidebarProps {
  role?: string | null;
}

export function Sidebar({ role }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const commonT = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const currentRole = role?.toLowerCase();
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';

  const navItems = currentRole === 'superadmin' ? [
    { path: '/', icon: Home, label: t('dashboard') },
    { path: '/leads', icon: MessageCircle, label: t('leads') },
    { path: '/users', icon: Users, label: t('users') },
    { path: '/finance', icon: DollarSign, label: t('finance') },
    { path: '/system', icon: ShieldCheck, label: t('system') },
    { path: '/settings', icon: SettingsIcon, label: t('settings') },
  ] : currentRole === 'admin' ? [
    { path: '/', icon: Home, label: t('home') },
    { path: '/leads', icon: MessageCircle, label: t('leads') },
    { path: '/users', icon: Users, label: t('students') },
    { path: '/courses', icon: BookOpen, label: t('courses') },
    { path: '/results', icon: LayoutGrid, label: t('reports') },
    { path: '/settings', icon: SettingsIcon, label: t('settings') },
  ] : isTeacher ? [
    { path: '/', icon: Home, label: t('monitor') },
    { path: '/groups', icon: Layers, label: t('groups') },
    { path: '/tasks', icon: BookOpen, label: t('tasks') },
    { path: '/results', icon: LayoutGrid, label: t('results') },
    { path: '/settings', icon: SettingsIcon, label: t('settings') },
  ] : [
    { path: '/', icon: Home, label: t('home') },
    { path: '/groups', icon: Layers, label: t('groups') },
    { path: '/learning', icon: BookOpen, label: t('learning') },
    { path: '/books', icon: Book, label: t('books') },
    { path: '/results', icon: LayoutGrid, label: t('rating') },
    { path: '/settings', icon: SettingsIcon, label: t('profile') },
  ];

  return (
    <div className="fixed left-0 top-0 z-[60] hidden h-screen w-72 flex-col border-r border-gray-100 bg-white shadow-2xl shadow-gray-100/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40 lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-[#3D855A]/20">
            <img 
              src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-black leading-none tracking-tight text-[#111827] dark:text-slate-100">{commonT('appName')}</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t('brandSub')}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <LanguageSwitcher className="border-gray-200 bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" />
          <ThemeToggle className="border-gray-200 bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" />
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              normalizedPathname === item.path ||
              (item.path !== '/' && normalizedPathname.startsWith(item.path));
            const Icon = item.icon;
            const localizedHref = localizePath(locale, item.path);
            
            return (
              <Link 
                key={item.path} 
                href={localizedHref}
                className={`flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group ${
                  isActive 
                    ? 'bg-[#3D855A] text-white shadow-xl shadow-[#3D855A]/20' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-[#111827] dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-md' : 'group-hover:scale-110 transition-transform'} />
                <span className={`text-[13px] tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <div className="mb-6 rounded-[28px] border border-[#3D855A]/10 bg-[#F2F8F5] p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[10px] font-black text-[#3D855A] uppercase tracking-widest leading-none mb-1.5 text-center">
            {commonT('systemStatus')}
          </p>
          <div className="w-full h-1.5 bg-[#3D855A]/10 rounded-full overflow-hidden">
             <div className="w-4/5 h-full bg-[#3D855A] rounded-full" />
          </div>
        </div>
        
        <button className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-extrabold text-[13px] hover:bg-red-50 rounded-[22px] transition-all group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {commonT('logout')}
        </button>
      </div>
    </div>
  );
}
