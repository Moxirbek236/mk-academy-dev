import { useState, useEffect } from 'react';
import { Crown, Zap, ShieldAlert, PieChart, Activity, Globe, Command, HelpCircle, DollarSign, Database, HardDrive, ListChecks, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export function SuperadminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  const alerts = data?.auditLogs || [
    { type: 'Update', title: 'Tizim yangilanishi 2.1.0 (Completed)', time: '2 soat oldin', status: 'Success' },
    { type: 'Issue', title: 'Ulanish tezligi pasayishi', time: '15 daqiqa oldin', status: 'Warning' },
    { type: 'Audit', title: 'Admin "Sardor" yangi foydalanuvchi yaratdi', time: '5 daqiqa oldin', status: 'Info' },
  ];

  const metrics = [
    { label: 'JAMI DAROMAD', value: `$${(data?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'FAOL OBUNACHILAR', value: (data?.subscribers || 0).toString(), icon: ListChecks, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'DATABASE YUKLAMASI', value: `${data?.system?.cpuUsage?.toFixed(1) || 0}%`, icon: Database, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'STORAGE', value: `${data?.system?.diskSpace || 0} GB`, icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Super Header / Global Status */}
      <div className="app-card bg-mesh p-8 text-[var(--app-text)] mb-8 relative overflow-hidden">
         <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-[var(--app-primary)]/10 rounded-full blur-[80px] opacity-60" />
         <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] opacity-40" />
         
         <div className="mb-10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
               <div className="bg-gradient-to-tr from-[var(--app-primary)] to-[var(--app-primary-dark)] p-4 rounded-[22px] shadow-xl shadow-[var(--app-primary)]/20 ring-4 ring-[var(--app-primary)]/10">
                  <Crown size={30} className="text-white drop-shadow-md" />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight leading-tight">Master Panel</h1>
                  <p className="text-[10px] font-black text-[var(--app-muted)] uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[var(--app-primary)] animate-pulse" />
                     SYSTEMS ONLINE
                  </p>
               </div>
            </div>
            <button className="app-touch flex items-center justify-center p-3.5 bg-[var(--app-surface-soft)] rounded-2xl border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] transition-all hover:scale-110 active:scale-95 shadow-inner">
               <Command size={22} />
            </button>
         </div>
         
         <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="p-6 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/50 hover:border-[var(--app-primary)]/20 transition-all group">
               <p className="text-[10px] font-black text-[var(--app-muted)] mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Globe size={13} className="text-blue-500" /> GLOBAL LOAD
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.uptime || 99}%</span>
                  <span className="text-[9px] font-black text-[var(--app-primary)] bg-[var(--app-primary)]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Stable</span>
               </div>
            </div>
            <div className="p-6 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/50 hover:border-[var(--app-primary)]/20 transition-all group">
               <p className="text-[10px] font-black text-[var(--app-muted)] mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Zap size={13} className="text-amber-500" /> API LATENCY
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.networkMs || 30}ms</span>
                  <span className="text-[9px] font-black text-[var(--app-primary)] bg-[var(--app-primary)]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Optimal</span>
               </div>
            </div>
         </div>
      </div>

      {/* Main Metrics */}
      <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase mb-6 px-2 flex items-center gap-3">
         <Activity size={16} className="text-[var(--app-primary)]" /> REAL-TIME ANALYTICS
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-10 text-[var(--app-text)]">
         {metrics.map((metric: any, idx: number) => (
            <div key={idx} className="app-card p-6 flex flex-col group cursor-default">
               <div className={`p-4 w-fit rounded-2xl mb-5 ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <metric.icon size={24} strokeWidth={2.5} />
               </div>
               <p className="text-[10px] font-black text-[var(--app-muted)] tracking-wider mb-2 uppercase opacity-80">{metric.label}</p>
               <p className="text-2xl font-black tracking-tighter">{metric.value}</p>
            </div>
         ))}
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase px-1">AUDIT LOGS</h2>
         <button className="text-[10px] font-black text-[var(--app-primary)] hover:underline uppercase tracking-widest bg-[var(--app-primary)]/10 px-3.5 py-1.5 rounded-full transition-all">Explore All</button>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {alerts.map((alert: any, idx: number) => (
          <div key={idx} className="app-card p-5 flex items-center gap-5 active:scale-[0.98]">
            <div className={`p-4 rounded-[20px] transition-all group-hover:rotate-[10deg] ${
               alert.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 
               alert.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 
               'bg-blue-100 text-blue-600'
            }`}>
               <ShieldAlert size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-extrabold text-[var(--app-text)] text-[15px] leading-tight truncate">{alert.title}</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[var(--app-surface-soft)] text-[var(--app-muted)] uppercase tracking-tighter">{alert.type}</span>
                  <p className="text-[10px] font-bold text-[var(--app-muted)]">{alert.time}</p>
               </div>
            </div>
            <button className="p-3.5 rounded-2xl bg-[var(--app-surface-soft)] text-gray-300 hover:text-[var(--app-text)] transition-all group-hover:text-[var(--app-primary)]">
               <PieChart size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10 pb-8">
         <button className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[42px] shadow-2xl flex flex-col items-center gap-5 text-center active:scale-95 transition-all border border-white/5 group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--app-primary)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-5 bg-white/10 rounded-[22px] text-[var(--app-primary)] group-hover:scale-110 transition-transform ring-4 ring-white/5">
               <PieChart size={30} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-white/90 tracking-[0.1em] leading-none uppercase">ANNUAL REPORT</span>
         </button>
         <button className="app-card p-8 flex flex-col items-center gap-5 text-center active:scale-95 transition-all group overflow-hidden">
            <div className="p-5 bg-[var(--app-surface-soft)] rounded-[22px] text-[var(--app-muted)] group-hover:scale-110 group-hover:text-amber-500 transition-all group-hover:bg-amber-50 shadow-inner">
               <Globe size={30} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[var(--app-text)] tracking-[0.1em] leading-none uppercase">MAINTENANCE</span>
         </button>
      </div>

      <div className="mt-4 mb-12 flex justify-center">
         <button className="flex items-center gap-3 text-[11px] font-black text-[var(--app-muted)] hover:text-[var(--app-text)] transition-all border border-[var(--app-border)] px-6 py-3.5 rounded-full hover:bg-white hover:shadow-md">
            <HelpCircle size={16} className="text-[var(--app-primary)]" /> 
            <span className="tracking-widest uppercase opacity-80">System Documentation</span>
         </button>
      </div>
    </div>
  );
}
