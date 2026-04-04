'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Home, BookOpen, Eye, EyeOff, Globe, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', formData);
      const body = res.data;

      if (body?.success && body?.data?.access_token) {
        localStorage.setItem('token', body.data.access_token);
        localStorage.setItem('role', body.data.user.role.toLowerCase());
        router.push('/');
      } else {
        setError('Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Ma\'lumotlar talabga javob bermadi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3D855A]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />

      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/landing')} 
        className="absolute top-8 left-8 text-gray-500 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
      >
        <Home size={14} /> Back to Home
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-900/60 border border-white/10 p-10 rounded-[56px] shadow-3xl relative z-10 backdrop-blur-3xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-xl"
          >
            <BookOpen size={28} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Yangi Hisob</h1>
          <p className="text-gray-400 font-bold text-sm px-4">MK Academy bilan ingliz tilini o&apos;rganishni hoziroq boshlang.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase ml-1">FULL NAME</label>
              <div className="relative group">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-white focus:outline-none focus:border-[#3D855A]/50 focus:ring-4 focus:ring-[#3D855A]/10 transition-all"
                  placeholder="Ismingiz va familiyangiz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase ml-1">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-white focus:outline-none focus:border-[#3D855A]/50 focus:ring-4 focus:ring-[#3D855A]/10 transition-all"
                  placeholder="nomingiz@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase ml-1">PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3D855A] transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-14 py-4.5 text-[15px] font-bold text-white focus:outline-none focus:border-[#3D855A]/50 focus:ring-4 focus:ring-[#3D855A]/10 transition-all"
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
          </div>

          <div className="flex items-start gap-3 ml-1 py-2">
             <div className="mt-1"><CheckCircle2 size={16} className="text-[#3D855A]" /></div>
             <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
               Ro&apos;yxatdan o&apos;tish orqali siz bizning <span className="text-white">Xizmat ko&apos;rsatish shartlari</span> va <span className="text-white">Maxfiylik siyosatimizga</span> rozilik bildirasiz.
             </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-3xl text-[13px] font-bold flex items-center justify-center gap-3"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-white text-black font-black py-5 rounded-[32px] transition-all shadow-xl shadow-white/5 disabled:opacity-50 text-base"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (
               <>
                 GET STARTED <ArrowRight size={20} strokeWidth={3} />
               </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-white/5 flex-1" />
              <button onClick={() => router.push('/login')} className="text-[11px] font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors mb-[-2px]">
                 Allready have an account? Log In
              </button>
              <div className="h-px bg-white/5 flex-1" />
           </div>
           
           <button className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-3xl transition-all group">
              <Globe size={20} className="text-gray-400 group-hover:text-[#3D855A]" />
              <span className="text-sm font-black tracking-tight text-gray-300">Quick sign up with Google</span>
           </button>
        </div>
      </motion.div>
    </div>
  );
}
