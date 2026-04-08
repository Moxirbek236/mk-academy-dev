import { useState, useEffect } from 'react';
import { Users, GraduationCap, Clock, CheckCircle2, ChevronRight, BarChart3, MessageSquarePlus, Calendar, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';

export function MentorDashboard() {
  const t = useTranslations('DashboardMentor');
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

  const groups = data?.myGroups || [
    { name: 'IELTS Intensive - 01', students: 12, lessons: '24/40', status: 'Active', nextLesson: '14:30' },
    { name: 'CEFR B2 - Master', students: 8, lessons: '15/30', status: 'Reviewing', nextLesson: 'Ertaga' },
    { name: 'General English - A2', students: 15, lessons: '5/24', status: 'Upcoming', nextLesson: 'Dushanba' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Mentor Welcome Card */}
      <div className="app-card bg-mesh mb-8 overflow-hidden border border-[var(--app-border)] p-8 text-[var(--app-text)]">
         <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2.5 h-2.5 bg-[var(--app-primary)] rounded-full" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none text-[var(--app-muted)]">{t('activeTeachingSession')}</p>
               </div>
               <h2 className="text-2xl font-black tracking-tight leading-tight">Mirasror Ali</h2>
               <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">{t('roleTitle')}</p>
            </div>
            <div className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-[var(--app-primary)] shadow-sm">
               <GraduationCap size={28} />
            </div>
         </div>
         
         <div className="flex gap-4 relative z-10">
            <div className="flex-1 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 cursor-default">
               <p className="mb-2 text-[9px] font-black uppercase tracking-widest leading-none text-[var(--app-muted)]">{t('activeGroups')}</p>
               <p className="text-2xl font-black tracking-tighter">{data?.activeGroups || 0} ta</p>
            </div>
            <div className="flex-1 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 cursor-default">
               <p className="mb-2 text-[9px] font-black uppercase tracking-widest leading-none text-[var(--app-muted)]">{t('pendingHomework')}</p>
               <p className="text-2xl font-black tracking-tighter">{data?.pendingHomeworks || 0} ta</p>
            </div>
         </div>
      </div>

      <div className="px-2 flex items-center justify-between mb-6">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase px-1 flex items-center gap-2 font-black">
            <Calendar size={14} className="text-[var(--app-primary)]" /> {t('groupsTitle')}
         </h2>
         <button className="rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-all hover:bg-[var(--app-surface-soft)]">{t('schedule')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {groups.map((group: any, idx: number) => (
          <div key={idx} className="app-card p-6 flex items-center gap-5 cursor-pointer group active:scale-[0.98]">
            <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--app-surface-soft)] text-[var(--app-primary)] font-black text-xl transition-all shadow-inner shrink-0 group-hover:bg-[color:color-mix(in_srgb,var(--app-primary)_12%,white)]">
              {(group.name || '?').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-[var(--app-text)] text-base leading-tight tracking-tight truncate">{group.name}</h3>
              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-[var(--app-muted)] uppercase tracking-tighter bg-[var(--app-surface-soft)] px-2.5 py-1 rounded-md">
                   <Users size={12} strokeWidth={2.5} /> {t('students', { count: group.students })}
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-black text-[var(--app-primary)] uppercase tracking-tighter bg-[var(--app-primary)]/10 px-2.5 py-1 rounded-md">
                   <BookOpen size={12} strokeWidth={2.5} /> {group.lessons}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
               <span className="rounded-full bg-[var(--app-surface-soft)] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest leading-none text-[var(--app-muted)]">{group.nextLesson}</span>
               <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2.5 text-[var(--app-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--app-primary)]">
                  <ChevronRight size={20} strokeWidth={3} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <button className="app-card p-8 flex flex-col items-center gap-5 text-center active:scale-95 transition-all group hover:border-red-100 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1">
               {data?.pendingHomeworks > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping opacity-75" />}
            </div>
            <div className="rounded-[16px] bg-red-50 p-5 text-red-500 transition-all shadow-inner shadow-red-100 group-hover:scale-105">
               <AlertCircle size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[var(--app-text)] leading-tight uppercase tracking-tight">{t('uncheckedTasks', { count: data?.pendingHomeworks || 0 })}</span>
         </button>
         <button className="app-card p-8 flex flex-col items-center gap-5 text-center active:scale-95 transition-all group hover:border-blue-100">
            <div className="rounded-[16px] bg-[var(--app-surface-soft)] p-5 text-[var(--app-primary)] transition-all shadow-inner group-hover:scale-105">
               <BarChart3 size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-[var(--app-text)] leading-tight uppercase tracking-tight">{t('groupAnalytics')}</span>
         </button>
      </div>
      
      <button className="w-full btn-premium mb-12 border-none bg-[var(--app-primary)] p-6 text-white">
         <MessageSquarePlus size={22} strokeWidth={2.5} className="mr-3" />
         <span className="tracking-widest">{t('newTask')}</span>
      </button>
    </div>
  );
}
