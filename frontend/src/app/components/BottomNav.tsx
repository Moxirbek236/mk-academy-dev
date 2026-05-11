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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] translate-y-0 lg:hidden">
      <div className="pointer-events-auto w-full px-0">
        <div className="flex w-full items-stretch gap-1 border-t border-[var(--app-border)] bg-[color:color-mix(in_srgb,var(--app-surface)_98%,transparent)] px-3 pt-2 pb-[calc(0.75rem+var(--app-safe-bottom))] backdrop-blur-sm">
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
              className={`app-touch flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-1 border border-transparent px-1 transition-all duration-300 active:scale-95 ${isActive ? 'border-[var(--app-border)] bg-white text-[var(--app-primary)]' : 'text-[var(--app-muted)] hover:border-[var(--app-border)] hover:bg-white hover:text-[var(--app-text)]'}`}
            >
              <div className={`relative flex items-center justify-center p-2 transition-all duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                {isActive && (
                  nativeApp ? (
                    <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--app-primary)_10%,white)]" />
                  ) : (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--app-primary)_10%,white)]"
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
    </div>
  );
}
