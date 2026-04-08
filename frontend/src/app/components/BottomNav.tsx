'use client';
import { Home, Book, Settings as SettingsIcon, LayoutGrid, Users, DollarSign, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';
import { motion } from 'framer-motion';
import { isNativeApp } from '@/lib/native-app';

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
  const nativeApp = isNativeApp();

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
    <div className="app-bottom-nav-safe fixed inset-x-0 bottom-0 z-50 sm:bottom-4 sm:px-4 sm:pb-0">
      <div className="mx-auto flex w-full max-w-[560px] items-stretch gap-1 border-t border-[var(--app-border)] bg-[color:color-mix(in_srgb,var(--app-surface)_94%,transparent)] px-3 pt-2 pb-3 shadow-[0_-12px_28px_rgba(15,23,42,0.08)] backdrop-blur-md sm:rounded-[20px] sm:border sm:px-4">
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
              prefetch={false}
              className={`app-touch flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[14px] px-1 transition-all duration-300 active:scale-95 ${isActive ? 'text-[var(--app-primary)]' : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'}`}
            >
              <div className={`relative flex items-center justify-center rounded-[12px] p-2 transition-all duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                {isActive && (
                  nativeApp ? (
                    <div className="absolute inset-0 rounded-[12px] bg-[color:color-mix(in_srgb,var(--app-primary)_12%,transparent)]" />
                  ) : (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-[12px] bg-[color:color-mix(in_srgb,var(--app-primary)_12%,transparent)]"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )
                )}
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
              </div>
              <span className={`relative z-10 truncate text-[9px] uppercase tracking-[0.08em] ${isActive ? 'font-black opacity-100' : 'font-bold opacity-60'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
