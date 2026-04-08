'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { GlobalApiNotice } from './components/GlobalApiNotice';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { localizePath } from '@/i18n/localizedPath';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Common');
  const { role, loading, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizedPath = stripLocaleFromPathname(pathname || '/');

  // Public routes that don't need auth
  const isPublicRoute = ['/login', '/landing'].includes(normalizedPath);

  useEffect(() => {
    if (mounted && !loading && !token && !isPublicRoute) {
      router.replace(localizePath(locale, '/landing'));
    }
  }, [mounted, loading, token, isPublicRoute, locale, router]);

  if (!mounted || (loading && !isPublicRoute)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--app-bg)]">
         <div className="flex flex-col items-center gap-5 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[var(--app-primary)] shadow-lg shadow-black/5">
               <Loader2 size={32} className="text-white animate-spin" />
            </div>
            <p className="ml-1 text-[10px] font-black uppercase tracking-[0.32em] text-gray-500">
              {t('loading')} {t('appName')}
            </p>
         </div>
      </div>
    );
  }

  const hideNav = isPublicRoute;

  return (
    <div
      className="app-shell flex bg-[var(--app-bg)]"
    >
      {!hideNav && <Sidebar role={role} />}
      
      <div className={`flex-1 flex min-h-screen-safe flex-col ${!hideNav ? 'lg:pl-72' : ''}`}>
        {!hideNav && <div className="lg:hidden"><Header role={role} /></div>}
        <OfflineStatusBanner />
        <main className={`w-full flex-1 ${!hideNav ? 'mx-auto max-w-7xl pb-nav-safe pt-8 lg:pt-10' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideNav && <div className="lg:hidden"><BottomNav role={role} /></div>}
      </div>
      <GlobalApiNotice />
    </div>
  );
}
