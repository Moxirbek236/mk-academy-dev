'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Phone, Lock, ArrowRight, Loader2, Home, Eye, EyeOff, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { getUserFriendlyErrorMessage } from '@/lib/offline/errors';
import { localizePath } from '@/i18n/localizedPath';
import { clearStoredAuth, getStoredRole, getStoredToken, setStoredAuth, setStoredRole } from '@/lib/auth-storage';
import { isNativeApp } from '@/lib/native-app';

type JwtPayload = {
  role?: string;
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function decodeJwtRole(token: string): string | null {
  return decodeJwtPayload(token)?.role?.toLowerCase() || null;
}

function isTokenStillValid(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return false;
  }

  if (!payload.exp) {
    return true;
  }

  return payload.exp * 1000 > Date.now();
}

function extractLoginData(body: any): { token: string | null; role: string | null } {
  const token =
    body?.data?.access_token ||
    body?.data?.token ||
    body?.access_token ||
    body?.token ||
    null;

  const roleFromBody =
    body?.data?.user?.role?.toLowerCase?.() ||
    body?.user?.role?.toLowerCase?.() ||
    null;

  const role = roleFromBody || (token ? decodeJwtRole(token) : null);

  return { token, role };
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const nativeApp = isNativeApp();

  useEffect(() => {
    const checkSession = async () => {
      const token = await getStoredToken();

      if (!token) {
        setCheckingSession(false);
        return;
      }

      if (!isTokenStillValid(token)) {
        await clearStoredAuth();
        setCheckingSession(false);
        return;
      }

      const storedRole = await getStoredRole();
      const decodedRole = decodeJwtRole(token);

      if (!storedRole && decodedRole) {
        await setStoredRole(decodedRole);
      }

      router.replace(localizePath(locale, '/'));
    };

    void checkSession();
  }, [locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        phone: normalizePhone(formData.phone),
        password: formData.password,
      };
      const res = await api.post('/auth/login', payload, { timeout: 30000 });
      const body = res.data;
      const { token, role } = extractLoginData(body);

      if (token) {
        await setStoredAuth(token, role);
        router.replace(localizePath(locale, '/'));
      } else {
        setError('Tizimga kirishda xatolik yuz berdi');
      }
    } catch (err: unknown) {
      const message = getUserFriendlyErrorMessage(err, 'Telefon raqami yoki parol noto\'g\'ri');
      if (
        message === 'Phone and password do not found' ||
        message === 'User is not active'
      ) {
        setError('Telefon raqami yoki parol noto\'g\'ri');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen-safe flex items-center justify-center bg-[#F4FBF7] px-safe text-gray-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#3D855A] shadow-xl shadow-[#3D855A]/20">
            <Loader2 size={30} className="animate-spin text-white" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-500">
            Session tekshirilmoqda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-safe relative flex items-start justify-center overflow-hidden bg-[#F4FBF7] px-safe pb-safe pt-safe text-gray-900 dark:bg-slate-950 dark:text-slate-100 sm:items-center sm:p-6">
      {!nativeApp && (
        <>
          <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[#3D855A]/15 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-300/20 blur-[100px]" />
        </>
      )}
      
      {nativeApp ? (
        <button
          onClick={() => router.push(localizePath(locale, '/landing'))}
          className="app-touch absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[calc(0.75rem+env(safe-area-inset-top))] flex min-h-10 items-center gap-2 rounded-full border border-gray-100 bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm transition-all hover:text-[#3D855A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:left-8 sm:top-8"
        >
          <Home size={14} /> Back to Home
        </button>
      ) : (
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push(localizePath(locale, '/landing'))}
          className="app-touch absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[calc(0.75rem+env(safe-area-inset-top))] flex min-h-10 items-center gap-2 rounded-full border border-gray-100 bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm transition-all hover:text-[#3D855A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:left-8 sm:top-8"
        >
          <Home size={14} /> Back to Home
        </motion.button>
      )}

      {nativeApp ? (
        <div className="relative z-10 mt-14 w-full max-w-[28rem] rounded-[28px] border border-[#E5F2EA] bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:mt-0 sm:rounded-[32px] sm:p-8">
          <div className="mb-8 flex flex-col items-center sm:mb-10">
            <div className="mb-5 h-16 w-16 overflow-hidden rounded-[18px] shadow-md shadow-[#3D855A]/20">
              <img 
                src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg" 
                alt="Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mb-2 text-3xl font-black tracking-tighter text-gray-900 dark:text-slate-100 sm:text-4xl">Xush Kelibsiz</h1>
            <p className="px-3 text-center text-sm font-bold text-gray-500 dark:text-slate-400">MK Academy platformasiga kirish uchun ma&apos;lumotlarni kiriting.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">PHONE NUMBER</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
                <input 
                  required
                  type="tel" 
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-[18px] border border-[#DCEEE3] bg-[#F7FBF8] py-4 pl-14 pr-6 text-[15px] font-bold text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#3D855A]/50 focus:outline-none focus:ring-4 focus:ring-[#3D855A]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">PASSWORD</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-tight text-[#3D855A] hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full rounded-[18px] border border-[#DCEEE3] bg-[#F7FBF8] py-4 pl-14 pr-14 text-[15px] font-bold text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#3D855A]/50 focus:outline-none focus:ring-4 focus:ring-[#3D855A]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                  placeholder="********"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3D855A] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-[16px] border border-red-500/20 bg-red-500/10 p-4 text-[13px] font-bold text-red-500">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-tr from-[#3D855A] to-emerald-500 py-4 text-base font-black text-white shadow-lg shadow-[#3D855A]/15 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={24} className="animate-spin text-white" /> : (
                <>
                  LOG IN <ArrowRight size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10 sm:gap-6">
            <div className="flex w-full items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Social login</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            
            <button className="group flex w-full items-center justify-center gap-4 rounded-[18px] border border-[#DCEEE3] bg-[#F7FBF8] py-3.5 transition-all hover:bg-[#EEF7F1] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
              <Globe size={20} className="text-gray-400 group-hover:text-[#3D855A]" />
              <span className="text-sm font-black tracking-tight">Continue with Google</span>
            </button>

            <p className="text-center text-[12px] font-bold text-gray-500 dark:text-slate-400">
              Tizimga faqat ruxsat etilgan o&apos;quvchilar kira oladi.
            </p>
          </div>
        </div>
      ) : (
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mt-14 w-full max-w-[28rem] rounded-[36px] border border-[#E5F2EA] bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:mt-0 sm:rounded-[44px] sm:p-8"
      >
        <div className="mb-8 flex flex-col items-center sm:mb-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="mb-5 h-16 w-16 overflow-hidden rounded-[24px] shadow-lg shadow-[#3D855A]/30"
          >
            <img 
              src="https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h1 className="mb-2 text-3xl font-black tracking-tighter text-gray-900 dark:text-slate-100 sm:text-4xl">Xush Kelibsiz</h1>
          <p className="px-3 text-center text-sm font-bold text-gray-500 dark:text-slate-400">MK Academy platformasiga kirish uchun ma&apos;lumotlarni kiriting.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase ml-1">PHONE NUMBER</label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
              <input 
                required
                type="tel" 
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full rounded-3xl border border-[#DCEEE3] bg-[#F7FBF8] py-4 pl-14 pr-6 text-[15px] font-bold text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#3D855A]/50 focus:outline-none focus:ring-4 focus:ring-[#3D855A]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
               <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">PASSWORD</label>
               <button type="button" className="text-[10px] font-black text-[#3D855A] hover:underline uppercase tracking-tight">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
              <input 
                required
                type={showPassword ? 'text' : 'password'} 
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full rounded-3xl border border-[#DCEEE3] bg-[#F7FBF8] py-4 pl-14 pr-14 text-[15px] font-bold text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#3D855A]/50 focus:outline-none focus:ring-4 focus:ring-[#3D855A]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="********"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3D855A] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[13px] font-bold flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-tr from-[#3D855A] to-emerald-500 py-4 text-base font-black text-white shadow-xl shadow-[#3D855A]/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (
               <>
                 LOG IN <ArrowRight size={20} strokeWidth={3} />
               </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10 sm:gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Social login</span>
              <div className="h-px bg-gray-200 flex-1" />
           </div>
           
           <button className="group flex w-full items-center justify-center gap-4 rounded-3xl border border-[#DCEEE3] bg-[#F7FBF8] py-3.5 transition-all hover:bg-[#EEF7F1] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
              <Globe size={20} className="text-gray-400 group-hover:text-[#3D855A]" />
              <span className="text-sm font-black tracking-tight">Continue with Google</span>
           </button>

           <p className="text-center text-[12px] font-bold text-gray-500 dark:text-slate-400">
             Tizimga faqat ruxsat etilgan o'quvchilar kira oladi.
           </p>
        </div>
      </motion.div>
      )}
    </div>
  );
}
