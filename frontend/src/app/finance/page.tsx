'use client';
import { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, Search, MoreVertical, CreditCard, Wallet, Activity, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function FinancePage() {
  const t = useTranslations('Finance');
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

  if (loading) return <div className="flex justify-center p-16 sm:p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  const totalTransactions = transactions.length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-nav-safe lg:pb-14">
      <div className="mb-6 flex items-center justify-between px-1 sm:mb-8">
        <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">{t('title')}</h1>
        <button className="app-touch rounded-2xl bg-[#3D855A] p-3 text-white shadow-lg shadow-[#3D855A]/20 transition-all active:scale-90">
          <TrendingUp size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Balance Card - Premium Design */}
      <div className="group relative mb-8 overflow-hidden rounded-[32px] border border-[#DCEEE3] bg-gradient-to-br from-[#ECF8F1] via-[#F7FCF9] to-white p-5 text-gray-900 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:mb-10 sm:rounded-[40px] sm:p-8">
         <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <Wallet size={12} /> {t('balanceLabel', { period: t('monthly') })}
            </p>
            <div className="mb-6 flex items-baseline gap-2 sm:mb-8">
               <span className="text-3xl font-black tracking-tighter sm:text-4xl">{(summary?.balance || 0).toLocaleString()}</span>
               <span className="text-sm font-bold text-gray-500 uppercase">UZS</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
               <div className="flex items-center gap-3 rounded-3xl border border-[#E4F1EA] bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><ArrowUpRight size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 tracking-wider">{t('income')}</p>
                    <p className="text-sm font-black">+{(summary?.income || 0).toLocaleString()}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 rounded-3xl border border-[#E4F1EA] bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="p-2 bg-red-100 text-red-500 rounded-xl"><ArrowDownRight size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 tracking-wider">{t('expense')}</p>
                    <p className="text-sm font-black">-{(summary?.expense || 0).toLocaleString()}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="mb-5 flex items-center justify-between px-2 sm:mb-6">
         <h2 className="text-[12px] font-black text-gray-400 tracking-[0.15em] uppercase flex items-center gap-2">
            <Activity size={16} className="text-[#3D855A]" /> {t('transactions')}
         </h2>
         <button className="text-[10px] font-black text-[#3D855A] hover:underline uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
           {t('history')}
         </button>
      </div>
      <p className="px-2 -mt-3 mb-5 text-[11px] font-bold text-gray-400">
        {t('transactionCount', { count: totalTransactions })}
      </p>

      <div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 md:gap-6">
        {transactions.map((tx, idx) => (
          <div key={idx} className="group flex cursor-default items-center gap-4 overflow-hidden rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98] sm:gap-5 sm:rounded-[38px] sm:p-6">
            <div className={`p-4 rounded-[24px] transition-all group-hover:rotate-[10deg] shrink-0 ${
               tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
            }`}>
               <CreditCard size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="truncate text-sm font-extrabold leading-tight tracking-tight text-[#111827] transition-transform group-hover:translate-x-1 sm:text-base">
                 {tx.user?.fullName || t('systemTransaction')}
               </h3>
               <div className="flex items-center gap-3 mt-2 overflow-hidden">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 tracking-tighter uppercase whitespace-nowrap">
                    {tx.method || t('transfer')}
                  </span>
                  <p className="text-[11px] font-bold text-gray-400 tracking-tight whitespace-nowrap">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-base font-black tracking-tighter sm:text-lg ${
                tx.type === 'INCOME' ? 'text-emerald-550' : 'text-red-500'
              }`}>{tx.type === 'INCOME' ? '+' : '-'}{tx.amount?.toLocaleString()} UZS</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
