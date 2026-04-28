'use client';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './notifications/NotificationBell';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';
import { getNavigationConfig } from '@/lib/navigation-config';
import { clearStoredAuth } from '@/lib/auth-storage';
import { useSystemHealth } from '@/hooks/useSystemStats';
import { useCenterBranding } from './branding/CenterBrandingProvider';

interface SidebarProps {
  role?: string | null;
}

export function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const t = useTranslations('Sidebar');
  const commonT = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const navItems = getNavigationConfig(role, 'sidebar');
  const { data: health } = useSystemHealth(true);
  const { centerBranding } = useCenterBranding();
  const systemHealthy = ['ok', 'healthy'].includes(String(health?.status || '').toLowerCase());

  function handleLogout() {
    void clearStoredAuth().finally(() => {
      router.push(localizePath(locale, '/landing'));
    });
  }

  return (
    <div className="fixed left-0 top-0 z-[60] hidden h-screen w-72 flex-col overflow-y-auto border-r border-[var(--app-border)] bg-[var(--sidebar)] lg:flex">
      <div className="border-b border-[var(--app-border)] p-6 xl:p-8">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden border border-[var(--app-border)] bg-white">
            <img 
              src={centerBranding.logoUrl}
              alt={centerBranding.shortName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black leading-tight tracking-tight text-[var(--app-text)] xl:text-lg">
              {centerBranding.shortName}
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)]">
              {t('brandSub')}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-stretch gap-2">
          <NotificationBell className="shrink-0" />
          <LanguageSwitcher className="min-w-0 flex-1 basis-[calc(50%-0.25rem)] border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]" />
          <div className="min-w-0 flex-1 basis-[calc(50%-0.25rem)] border border-[var(--app-border)] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--app-primary)]">
            Light UI
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 px-4">
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
                className={`flex items-center gap-4 border px-5 py-3.5 transition-all group ${
                  isActive 
                    ? 'border-[color:color-mix(in_srgb,var(--app-primary)_26%,var(--app-border))] bg-white text-[var(--app-primary)]'
                    : 'border-transparent text-[var(--app-muted)] hover:border-[var(--app-border)] hover:bg-white hover:text-[var(--app-text)]'
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
        <div className="mb-6 border border-[var(--app-border)] bg-white p-5">
          <p className="mb-1.5 text-center text-[10px] font-black uppercase tracking-widest leading-none text-[var(--app-primary)]">
            {systemHealthy ? t('statusHealthy') : commonT('systemStatus')}
          </p>
          <div className="h-1.5 w-full overflow-hidden bg-[color:color-mix(in_srgb,var(--app-primary)_10%,white)]">
             <div className={`h-full ${systemHealthy ? 'w-full bg-[var(--app-primary)]' : 'w-2/5 bg-[#b42318]'}`} />
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 border border-transparent px-6 py-4 text-[13px] font-extrabold text-red-600 transition-all group hover:border-red-200 hover:bg-white"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {commonT('logout')}
        </button>
      </div>
    </div>
  );
}
