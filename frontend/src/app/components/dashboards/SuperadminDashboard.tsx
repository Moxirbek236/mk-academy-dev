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
      <div className="app-card bg-mesh relative mb-8 overflow-hidden p-8 text-[var(--app-text)]">
         <div className="mb-10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
               <div className="rounded-[16px] bg-[color:color-mix(in_srgb,var(--app-primary)_12%,white)] p-4 text-[var(--app-primary)] shadow-sm">
                  <Crown size={30} />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight leading-tight">Master Panel</h1>
                  <p className="text-[10px] font-black text-[var(--app-muted)] uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[var(--app-primary)]" />
                     SYSTEMS ONLINE
                  </p>
               </div>
            </div>
            <button className="app-touch flex items-center justify-center rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3.5 text-[var(--app-muted)] transition-all active:scale-95">
               <Command size={22} />
            </button>
         </div>
         
         <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all group">
               <p className="text-[10px] font-black text-[var(--app-muted)] mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Globe size={13} className="text-blue-500" /> GLOBAL LOAD
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.uptime || 99}%</span>
                  <span className="rounded-full bg-[color:color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-[var(--app-primary)]">Stable</span>
                </div>
            </div>
            <div className="rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all group">
               <p className="text-[10px] font-black text-[var(--app-muted)] mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Zap size={13} className="text-amber-500" /> API LATENCY
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.networkMs || 30}ms</span>
                  <span className="rounded-full bg-[color:color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-[var(--app-primary)]">Optimal</span>
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
               <div className={`mb-5 w-fit rounded-[16px] p-4 ${metric.bg} ${metric.color} transition-transform shadow-sm group-hover:scale-105`}>
                  <metric.icon size={24} strokeWidth={2.5} />
               </div>
               <p className="text-[10px] font-black text-[var(--app-muted)] tracking-wider mb-2 uppercase opacity-80">{metric.label}</p>
               <p className="text-2xl font-black tracking-tighter">{metric.value}</p>
            </div>
         ))}
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase px-1">AUDIT LOGS</h2>
         <button className="rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-all hover:bg-[var(--app-surface-soft)]">Explore All</button>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {alerts.map((alert: any, idx: number) => (
          <div key={idx} className="app-card p-5 flex items-center gap-5 active:scale-[0.98]">
            <div className={`rounded-[14px] p-4 transition-all ${
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
            <button className="rounded-[14px] bg-[var(--app-surface-soft)] p-3.5 text-[var(--app-muted)] transition-all group-hover:text-[var(--app-primary)]">
               <PieChart size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10 pb-8">
         <button className="app-card flex flex-col items-center gap-5 overflow-hidden border border-[var(--app-border)] p-8 text-center transition-all active:scale-95">
            <div className="rounded-[16px] bg-[var(--app-surface-soft)] p-5 text-[var(--app-primary)]">
               <PieChart size={30} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.1em] leading-none text-[var(--app-text)]">ANNUAL REPORT</span>
         </button>
         <button className="app-card flex flex-col items-center gap-5 overflow-hidden p-8 text-center transition-all active:scale-95">
            <div className="rounded-[16px] bg-[var(--app-surface-soft)] p-5 text-[var(--app-muted)] shadow-inner">
               <Globe size={30} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[var(--app-text)] tracking-[0.1em] leading-none uppercase">MAINTENANCE</span>
         </button>
      </div>

      <div className="mt-4 mb-12 flex justify-center">
         <button className="flex items-center gap-3 rounded-full border border-[var(--app-border)] px-6 py-3.5 text-[11px] font-black text-[var(--app-muted)] transition-all hover:bg-[var(--app-surface)] hover:text-[var(--app-text)]">
            <HelpCircle size={16} className="text-[var(--app-primary)]" /> 
            <span className="tracking-widest uppercase opacity-80">System Documentation</span>
         </button>
      </div>
    </div>
  );
}
