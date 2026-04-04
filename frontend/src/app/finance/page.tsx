import { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, Search, MoreVertical, CreditCard, Wallet, Activity, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function FinancePage() {
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, transRes] = await Promise.all([
          api.get('/finance/summary'),
          api.get('/finance/transactions')
        ]);
        setSummary(sumRes.data?.data || sumRes.data);
        setTransactions(transRes.data?.data || transRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Moliya</h1>
        <button className="bg-gray-900 text-white p-3 rounded-2xl active:scale-90 transition-all">
          <TrendingUp size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Balance Card - Premium Design */}
      <div className="bg-[#1A1A1A] p-8 rounded-[40px] text-white mb-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <Wallet size={12} /> JAMIY BALANS (MONTHLY)
            </p>
            <div className="flex items-baseline gap-2 mb-8">
               <span className="text-4xl font-black tracking-tighter">{(summary?.balance || 0).toLocaleString()}</span>
               <span className="text-sm font-bold text-white/40 uppercase">UZS</span>
            </div>
            <div className="flex gap-4">
               <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><ArrowUpRight size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-white/40 tracking-wider">KIRIM</p>
                    <p className="text-sm font-black">+{(summary?.income || 0).toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-xl"><ArrowDownRight size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-white/40 tracking-wider">CHIQIM</p>
                    <p className="text-sm font-black">-{(summary?.expense || 0).toLocaleString()}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-gray-400 tracking-[0.15em] uppercase flex items-center gap-2">
            <Activity size={16} className="text-[#3D855A]" /> TRANZAKSIYALAR
         </h2>
         <button className="text-[10px] font-black text-[#3D855A] hover:underline uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">History</button>
      </div>

      <div className="flex flex-col gap-4 pb-10">
        {transactions.map((t, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[32px] border border-gray-100/50 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] transition-all group">
            <div className={`p-4 rounded-[22px] transition-all group-hover:rotate-[10deg] ${
               t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
            }`}>
               <CreditCard size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="font-extrabold text-[#111827] text-[15px] leading-tight group-hover:translate-x-1 transition-transform">{t.user?.fullName || 'Tizim'}</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 tracking-tighter uppercase">{t.method}</span>
                  <p className="text-[11px] font-bold text-gray-400 tracking-tight">{new Date(t.createdAt).toLocaleTimeString()}</p>
               </div>
            </div>
            <p className={`font-black text-[15px] tracking-tight ${
              t.type === 'INCOME' ? 'text-emerald-550' : 'text-red-500'
            }`}>{t.type === 'INCOME' ? '+' : '-'}{t.amount?.toLocaleString()} UZS</p>
          </div>
        ))}
      </div>
    </div>
  );
}
