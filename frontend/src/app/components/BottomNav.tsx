'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';
import { motion } from 'framer-motion';
import { isNativeApp } from '@/lib/native-app';
import { getNavigationConfig } from '@/lib/navigation-config';

interface BottomNavProps {
  role?: string | null;
}

export function BottomNav({ role }: BottomNavProps) {
  const t = useTranslations('BottomNav');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const nativeApp = isNativeApp();
  const navItems = getNavigationConfig(role, 'bottom');

  return (
    <div className="app-bottom-nav-safe fixed inset-x-0 bottom-0 z-50 pb-0 sm:bottom-4 sm:px-4 sm:pb-0">
      <div className="mx-auto flex w-full max-w-[560px] items-stretch gap-1 border-t border-[var(--app-border)] bg-[color:color-mix(in_srgb,var(--app-surface)_94%,transparent)] px-3 pt-2 pb-[calc(0.75rem+var(--app-safe-bottom))] shadow-[0_-12px_28px_rgba(15,23,42,0.08)] backdrop-blur-md sm:rounded-[20px] sm:border sm:px-4 sm:pb-3">
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
              <span className={`relative z-10 truncate text-[9px] uppercase tracking-[0.08em] ${isActive ? 'font-black opacity-100' : 'font-bold opacity-60'}`}>{t(item.labelKey as any)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
