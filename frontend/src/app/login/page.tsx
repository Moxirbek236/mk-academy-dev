'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Home, BookOpen, Eye, EyeOff, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', formData);
      const body = res.data;

      if (body?.success && body?.data?.access_token) {
        localStorage.setItem('token', body.data.access_token);
        localStorage.setItem('role', body.data.user.role.toLowerCase());
        router.push('/');
      } else {
        setError('Tizimga kirishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Email yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden font-sansSelection">
      {/* Dynamic Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3D855A]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px]" />
      
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/landing')} 
        className="absolute top-8 left-8 text-gray-500 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
      >
        <Home size={14} /> Back to Home
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-10 rounded-[48px] shadow-3xl relative z-10 backdrop-blur-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#3D855A] to-emerald-400 flex items-center justify-center shadow-lg shadow-[#3D855A]/30 mb-6"
          >
            <BookOpen size={32} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Xush Kelibsiz</h1>
          <p className="text-gray-400 font-bold text-center text-sm px-4">MK Academy platformasiga kirish uchun ma&apos;lumotlarni kiriting.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase ml-1">EMAIL ADDRESS</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-white focus:outline-none focus:border-[#3D855A]/50 focus:ring-4 focus:ring-[#3D855A]/10 transition-all placeholder:text-zinc-700"
                placeholder="nomingiz@email.com"
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-14 py-4.5 text-[15px] font-bold text-white focus:outline-none focus:border-[#3D855A]/50 focus:ring-4 focus:ring-[#3D855A]/10 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
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
            className="w-full flex justify-center items-center gap-3 bg-gradient-to-tr from-[#3D855A] to-emerald-500 text-white font-black py-5 rounded-[28px] transition-all shadow-xl shadow-[#3D855A]/20 disabled:opacity-50 text-base"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (
               <>
                 LOG IN <ArrowRight size={20} strokeWidth={3} />
               </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Social login</span>
              <div className="h-px bg-white/5 flex-1" />
           </div>
           
           <button className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-3xl transition-all group">
              <Globe size={20} className="text-gray-400 group-hover:text-blue-400" />
              <span className="text-sm font-black tracking-tight">Continue with Google</span>
           </button>

           <p className="text-gray-500 text-[12px] font-bold text-center">
             Tizimga faqat ruxsat etilgan o'quvchilar kira oladi.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
