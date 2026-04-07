'use client';
import { Home, Book, Settings as SettingsIcon, LayoutGrid, Users, DollarSign, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { motion } from 'framer-motion';

interface BottomNavProps {
  role?: string | null;
}

export function BottomNav({ role }: BottomNavProps) {
  const t = useTranslations('BottomNav');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const currentRole = role?.toLowerCase();
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';

  const navItems = currentRole === 'superadmin' ? [
    { path: '/', icon: Home, label: t('dashboard') },
    { path: '/users', icon: Users, label: t('users') },
    { path: '/finance', icon: DollarSign, label: t('finance') },
    { path: '/system', icon: ShieldCheck, label: t('system') },
    { path: '/settings', icon: SettingsIcon, label: t('settings') },
  ] : currentRole === 'admin' ? [
    { path: '/', icon: Home, label: t('home') },
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
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[560px] items-stretch gap-1 border-t border-gray-100 bg-white/95 px-3 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-15px_40px_rgba(2,6,23,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:bottom-4 sm:rounded-[2.5rem] sm:border sm:px-4 sm:pb-3 sm:shadow-2xl">
      {navItems.map((item) => {
        const isActive =
          normalizedPathname === item.path ||
          (item.path !== '/' && normalizedPathname.startsWith(item.path));
        const Icon = item.icon;
        const localizedHref = item.path === '/' ? `/${locale}` : `/${locale}${item.path}`;
        
        return (
          <Link 
            key={item.path} 
            href={localizedHref}
            className={`app-touch flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[24px] px-1 transition-all duration-300 active:scale-90 ${isActive ? 'text-[var(--app-primary)]' : 'text-gray-400 hover:text-gray-900 dark:hover:text-slate-100'}`}
          >
            <div className={`relative flex items-center justify-center rounded-2xl p-2 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-[var(--app-primary)]/10 dark:bg-[var(--app-primary)]/20"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
            </div>
            <span className={`relative z-10 truncate text-[9px] uppercase tracking-[0.08em] ${isActive ? 'font-black opacity-100' : 'font-bold opacity-60'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
