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

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, loading, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Public routes that don't need auth
  const isPublicRoute = ['/login', '/landing'].includes(pathname);

  useEffect(() => {
    if (mounted && !loading && !token && !isPublicRoute) {
      router.push('/landing');
    }
  }, [mounted, loading, token, isPublicRoute, pathname]);

  if (!mounted || (loading && !isPublicRoute)) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
         <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-[#3D855A] flex items-center justify-center animate-pulse shadow-2xl shadow-[#3D855A]/30">
               <Loader2 size={32} className="text-white animate-spin" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Loading MK Academy</p>
         </div>
      </div>
    );
  }

  const hideNav = isPublicRoute;

  return (
    <div className={`min-h-screen flex ${role === 'superadmin' ? 'bg-[#0A0A0A]' : 'bg-gray-50/50'}`}>
      {!hideNav && <Sidebar role={role} />}
      
      <div className={`flex-1 flex flex-col min-h-screen ${!hideNav ? 'lg:pl-72' : ''}`}>
        {!hideNav && <div className="lg:hidden"><Header role={role} /></div>}
        <OfflineStatusBanner />
        <main className={`${!hideNav ? 'pt-24 lg:pt-12 pb-32 max-w-7xl mx-auto px-6 w-full' : ''}`}>
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
