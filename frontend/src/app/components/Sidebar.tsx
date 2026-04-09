'use client';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';
import { getNavigationConfig } from '@/lib/navigation-config';

interface SidebarProps {
  role?: string | null;
}

export function Sidebar({ role }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const commonT = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const navItems = getNavigationConfig(role, 'sidebar');

  return (
    <div className="fixed left-0 top-0 z-[60] hidden h-screen w-72 flex-col border-r border-[var(--app-border)] bg-[var(--app-surface)] shadow-[8px_0_24px_-24px_rgba(15,23,42,0.35)] lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-[14px] border border-[var(--app-border)] shadow-sm">
            <img 
              src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-black leading-none tracking-tight text-[var(--app-text)]">{commonT('appName')}</h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)]">{t('brandSub')}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <LanguageSwitcher className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
          <ThemeToggle className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
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
                prefetch={false}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-[16px] transition-all group ${
                  isActive 
                    ? 'border border-[color:color-mix(in_srgb,var(--app-primary)_20%,var(--app-border))] bg-[color:color-mix(in_srgb,var(--app-primary)_10%,white)] text-[var(--app-primary)]'
                    : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} className="transition-transform group-hover:scale-105" />
                <span className={`text-[13px] tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                  {t(item.labelKey as any)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <div className="mb-6 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-5">
          <p className="mb-1.5 text-center text-[10px] font-black uppercase tracking-widest leading-none text-[var(--app-primary)]">
            {commonT('systemStatus')}
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--app-primary)_14%,transparent)]">
             <div className="h-full w-4/5 rounded-full bg-[var(--app-primary)]" />
          </div>
        </div>
        
        <button className="w-full flex items-center gap-4 px-6 py-4 text-[13px] font-extrabold text-red-500 transition-all group rounded-[16px] hover:bg-red-50 dark:hover:bg-red-950/20">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {commonT('logout')}
        </button>
      </div>
    </div>
  );
}
