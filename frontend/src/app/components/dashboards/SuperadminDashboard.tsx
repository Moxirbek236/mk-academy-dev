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
      <div className="bg-[#1A1A1A] p-8 rounded-[42px] text-white mb-8 shadow-2xl relative overflow-hidden border border-white/5">
         <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-[#3D855A]/20 rounded-full blur-[80px] opacity-60" />
         <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] opacity-40" />
         
         <div className="mb-10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
               <div className="bg-gradient-to-tr from-[#3D855A] to-[#69B58A] p-4 rounded-[22px] shadow-xl shadow-[#3D855A]/40 border border-white/10 ring-4 ring-white/5">
                  <Crown size={30} className="text-white drop-shadow-md" />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight leading-tight">Master Panel</h1>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     SYSTEMS ONLINE
                  </p>
               </div>
            </div>
            <button className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-inner">
               <Command size={22} />
            </button>
         </div>
         
         <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
               <p className="text-[10px] font-black text-white/40 mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Globe size={13} className="text-blue-400" /> GLOBAL LOAD
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.uptime || 99}%</span>
                  <span className="text-[10px] font-bold text-emerald-400">Stable</span>
               </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
               <p className="text-[10px] font-black text-white/40 mb-5 flex items-center gap-2 tracking-widest uppercase">
                 <Zap size={13} className="text-amber-400" /> API LATENCY
               </p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{data?.system?.networkMs || 30}ms</span>
                  <span className="text-[10px] font-bold text-emerald-400">Optimal</span>
               </div>
            </div>
         </div>
      </div>

      {/* Main Metrics */}
      <h2 className="text-[12px] font-black text-[#1A1A1A]/40 tracking-[0.15em] uppercase mb-6 px-2 flex items-center gap-3">
         <Activity size={16} className="text-[#3D855A]" /> REAL-TIME ANALYTICS
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-10 text-gray-900">
         {metrics.map((metric, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[36px] shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-gray-200 transition-all group cursor-default">
               <div className={`p-4 w-fit rounded-2xl mb-5 ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <metric.icon size={24} strokeWidth={2.5} />
               </div>
               <p className="text-[10px] font-black text-gray-400 tracking-wider mb-2 uppercase">{metric.label}</p>
               <p className="text-2xl font-black tracking-tighter">{metric.value}</p>
            </div>
         ))}
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[#1A1A1A]/40 tracking-[0.15em] uppercase px-1">AUDIT LOGS</h2>
         <button className="text-[10px] font-black text-[#3D855A] hover:underline uppercase tracking-widest bg-[#3D855A]/5 px-3 py-1.5 rounded-full">Explore All</button>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {alerts.map((alert, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-sm p-5 rounded-[32px] border border-gray-100/80 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:bg-white transition-all group active:scale-[0.98]">
            <div className={`p-4 rounded-[20px] transition-all group-hover:rotate-[10deg] ${
               alert.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 
               alert.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 
               'bg-blue-100 text-blue-600'
            }`}>
               <ShieldAlert size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="font-extrabold text-[#111827] text-[15px] leading-tight">{alert.title}</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase tracking-tighter">{alert.type}</span>
                  <p className="text-[10px] font-bold text-gray-400">{alert.time}</p>
               </div>
            </div>
            <button className="p-3.5 rounded-2xl bg-gray-50 text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition-colors">
               <PieChart size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
         <button className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[42px] shadow-2xl flex flex-col items-center gap-5 text-center active:scale-95 transition-all border border-white/5 group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-5 bg-white/10 rounded-[22px] text-blue-400 group-hover:scale-110 transition-transform ring-4 ring-white/5">
               <PieChart size={30} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black text-white/90 tracking-wide leading-none">ANNUAL REPORT</span>
         </button>
         <button className="bg-white p-8 rounded-[42px] border border-gray-100 shadow-sm flex flex-col items-center gap-5 text-center active:scale-95 transition-all group hover:border-gray-200">
            <div className="p-5 bg-gray-50 rounded-[22px] text-gray-400 group-hover:scale-110 group-hover:text-amber-500 transition-all group-hover:bg-amber-50 shadow-inner">
               <Globe size={30} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black text-gray-800 tracking-wide leading-none">MAINTENANCE</span>
         </button>
      </div>

      <div className="mt-12 mb-8 flex justify-center">
         <button className="flex items-center gap-3 text-[11px] font-black text-gray-400 hover:text-gray-900 transition-all border border-gray-100 px-6 py-3 rounded-full hover:bg-white hover:shadow-md">
            <HelpCircle size={16} className="text-[#3D855A]" /> 
            <span className="tracking-widest uppercase opacity-80">System Documentation</span>
         </button>
      </div>
    </div>
  );
}
