import { useState, useEffect } from 'react';
import { Shield, Users, FileText, PlusCircle, Activity, ChevronRight, Settings, TrendingUp, Presentation, School, UserPlus, ClipboardList, Loader2, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

export function AdminDashboard() {
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

  const stats = [
    { label: 'JAMI O\'QUVCHILAR', value: (data?.totalStudents || 0).toLocaleString(), color: 'text-emerald-550', bg: 'bg-emerald-50', icon: Users, trend: `+${data?.recentRegistrations || 0}` },
    { label: 'O\'RTACHA NATIJA', value: `${data?.averageResult || 0}%`, color: 'text-blue-550', bg: 'bg-blue-50', icon: ClipboardList, trend: '+3%' },
    { label: 'FAOL GURUHLAR', value: `${data?.activeGroups || 0} ta`, color: 'text-amber-550', bg: 'bg-amber-50', icon: Presentation, trend: '+2' },
    { label: 'MARKAZ IMTIYOZI', value: '4.8', color: 'text-purple-550', bg: 'bg-purple-50', icon: School, trend: 'Top' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-10 px-2">
         <div className="flex items-center gap-4">
            <div className="app-card rounded-[16px] bg-[var(--app-surface)] p-4 shadow-sm transition-all">
               <Shield size={28} className="text-[var(--app-primary)]" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-[var(--app-text)] tracking-tight">Center Admin</h2>
               <p className="text-[10px] font-black text-[var(--app-muted)] uppercase tracking-[0.15em] mt-1 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-primary)]" />
                  Management Active
               </p>
            </div>
         </div>
         <button className="app-touch flex items-center justify-center rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-3.5 text-[var(--app-muted)] shadow-sm transition-all hover:text-[var(--app-text)] active:scale-95">
            <Settings size={22} strokeWidth={2.5} />
         </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat: any, idx: number) => (
          <div key={idx} className="app-card p-6 flex flex-col group cursor-default">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-[16px] ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform shadow-sm`}>
                  <stat.icon size={26} strokeWidth={2.5} />
               </div>
               <span className="rounded-full bg-[color:color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter text-[var(--app-primary)]">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-[var(--app-muted)] tracking-wider mb-2 uppercase opacity-80">{stat.label}</p>
            <p className="text-3xl font-black text-[var(--app-text)] tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase mb-6 px-3 flex items-center justify-between">
         Quick Actions
         <Activity size={16} className="text-[var(--app-primary)]" />
      </h2>
      <div className="flex flex-col gap-4 pb-12">
         {[
           { label: 'Yangi Kurs', desc: 'O\'quv rejasini boshqarish', icon: PlusCircle, color: 'text-[var(--app-primary)]', bg: 'bg-[var(--app-primary)]/10', hover: 'hover:border-[var(--app-primary)]/30' },
           { label: 'Murojaatlar', desc: 'Landing page murojaatlari', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50', hover: 'hover:border-blue-200', href: '/leads' },
           { label: 'Mentorlar', desc: 'Mentorlarni ro\'yxatga olish', icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-50', hover: 'hover:border-amber-200' },
           { label: 'Imtihonlar', desc: 'Testlar tahlili', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', hover: 'hover:border-purple-200' }
         ].map((action, i) => (
           <button 
             key={i} 
             onClick={action.href ? () => window.location.href = action.href : undefined} 
             className={`flex items-center gap-5 app-card p-6 active:scale-[0.98] transition-all text-left ${action.hover} group`}
           >
              <div className={`p-5 rounded-[16px] ${action.bg} ${action.color} group-hover:scale-105 transition-transform`}>
                 <action.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                 <h3 className="font-extrabold text-[var(--app-text)] text-lg leading-tight">{action.label}</h3>
                 <p className="text-[11px] text-[var(--app-muted)] font-bold mt-1 tracking-tight truncate">{action.desc}</p>
              </div>
              <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2.5 text-[var(--app-muted)] transition-all group-hover:text-[var(--app-primary)]">
                 <ChevronRight size={20} strokeWidth={3} />
              </div>
           </button>
         ))}
      </div>

      <div className="mt-4 flex justify-center pb-8">
         <button className="flex items-center gap-2 rounded-full border border-[var(--app-border)] px-6 py-3 text-[11px] font-black uppercase tracking-widest leading-none text-[var(--app-muted)] transition-all hover:bg-[var(--app-surface)] hover:text-[var(--app-primary)]">
            <TrendingUp size={16} /> View Detailed Stats
         </button>
      </div>
    </div>
  );
}
