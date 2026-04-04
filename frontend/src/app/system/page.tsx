'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Server, HardDrive, Cpu, Activity, RefreshCw, AlertTriangle, Zap, Terminal, Clock, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function SystemPage() {
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

  const serverLogs = data?.auditLogs || [
    { type: 'Info', title: 'Backup completed successfully', time: '10 daqiqa oldin', status: 'Success' },
    { type: 'Warning', title: 'Memory utilization high (85%)', time: '2 soat oldin', status: 'Warning' },
    { type: 'Info', title: 'New SSL certificate deployed', time: '1 kun oldin', status: 'Success' },
  ];

  const sysStats = [
    { label: 'CPU USAGE', value: `${data?.system?.cpuUsage?.toFixed(1) || 0}%`, icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'RAM FREE', value: `${data?.system?.ramFree?.toFixed(1) || 0} GB`, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'DISK SPACE', value: `${data?.system?.diskSpace || 0} GB`, icon: HardDrive, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'NETWORK', value: `${data?.system?.networkMs || 0} ms`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tizim</h1>
        <button className="bg-[#3D855A] text-white p-3 rounded-2xl active:scale-90 transition-all shadow-lg animate-pulse hover:animate-none">
          <RefreshCw size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {sysStats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex flex-col items-center gap-4 text-center group hover:border-[#3D855A]/30 hover:shadow-xl transition-all h-full">
            <div className={`p-5 rounded-[22px] transition-all group-hover:scale-110 shadow-inner ${item.bg} ${item.color}`}>
               <item.icon size={26} strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">{item.label}</p>
               <p className="text-2xl font-black text-gray-900 tracking-tighter">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-gray-400 tracking-[0.15em] uppercase flex items-center gap-2">
            <Terminal size={16} className="text-[#3D855A]" /> SERVER LOGLARI
         </h2>
         <button className="text-[10px] font-black text-[#3D855A] hover:underline uppercase tracking-widest">Live Feed</button>
      </div>

      <div className="flex flex-col gap-4 mb-10 pb-10">
        {serverLogs.map((log: any, idx: number) => (
          <div key={idx} className="bg-[#1A1A1A] p-5 rounded-[32px] border border-white/5 shadow-sm flex items-center gap-5 hover:border-white/10 group active:scale-[0.98] transition-all">
            <div className={`p-4 rounded-[20px] transition-all group-hover:scale-110 shadow-2xl ${
               log.status === 'Warning' ? 'bg-amber-550/20 text-amber-500' : 'bg-emerald-550/20 text-emerald-400'
            }`}>
               <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1 truncate">
               <h3 className="font-extrabold text-[#FFFFFF] text-[15px] leading-tight group-hover:translate-x-1 transition-transform truncate">{log.title}</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-white/5 text-white/40 tracking-tighter uppercase">{log.type}</span>
                  <p className="text-[10px] font-bold text-white/30 tracking-tight">{log.time}</p>
               </div>
            </div>
            <div className="p-2 text-white/20"><Clock size={16} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
