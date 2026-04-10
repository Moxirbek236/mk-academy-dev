'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getGroupById } from '@/lib/backend-api';
import { ChevronLeft, PlusCircle, Users, BookOpen, Clock, FileText } from 'lucide-react';
import { PageLoadingState, PageErrorState } from '@/app/components/ui/PagePrimitives';

export default function GroupDetailClient() {
  const router = useRouter();
  const { id } = useParams();
  const { role } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const data = await getGroupById(Number(id));
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Guruh ma\'lumotlarini olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGroup();
  }, [id]);

  if (loading) {
    return <PageLoadingState title="Guruh ma'lumotlari yuklanmoqda" description="Kuting..." />;
  }

  if (error || !group) {
    return <PageErrorState title="Xatolik" description={error || 'Guruh topilmadi'} retryLabel="Orqaga" onRetry={() => router.back()} />;
  }

  return (
    <div className="pb-nav-safe relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-40 bg-[var(--app-bg)]/80 backdrop-blur-md px-4 py-4 sm:px-6 sm:py-6 border-b border-[var(--app-border)]">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="app-touch rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm transition-all active:scale-90">
            <ChevronLeft size={20} className="text-[var(--app-text)]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[var(--app-text)] uppercase tracking-tight">{group.name}</h1>
            <p className="text-[10px] font-bold text-[var(--app-muted)] tracking-widest uppercase">
              {group._count?.members || group.members?.length || 0} O'quvchi
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        {/* Task/Exam Biriktirish qismi */}
        <div className="mb-8">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">Vazifa & Imtihonlar</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="app-touch flex-1 rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm active:scale-95 transition-transform flex items-center gap-4 group hover:border-[#2563eb]/50">
              <div className="rounded-[16px] bg-blue-50 text-[#2563eb] p-3 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">YANGI VAZIFA</p>
                <p className="text-sm font-black text-[var(--app-text)] truncate">Task biriktirish</p>
              </div>
              <PlusCircle size={20} className="text-gray-300 group-hover:text-[#2563eb]" />
            </button>

            <button className="app-touch flex-1 rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm active:scale-95 transition-transform flex items-center gap-4 group hover:border-amber-500/50">
              <div className="rounded-[16px] bg-amber-50 text-amber-500 p-3 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">YANGI IMTIHON</p>
                <p className="text-sm font-black text-[var(--app-text)] truncate">Exam belgillash</p>
              </div>
              <PlusCircle size={20} className="text-gray-300 group-hover:text-amber-500" />
            </button>
          </div>
        </div>

        {/* Guruh O'quvchilari */}
        <div>
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--app-muted)] flex items-center gap-2">
            <Users size={14} /> Guruh a'zolari
          </h2>

          {(!group.members || group.members.length === 0) ? (
             <div className="rounded-[28px] border border-dashed border-[var(--app-border)] p-10 text-center flex flex-col items-center">
               <div className="h-16 w-16 mb-4 rounded-[20px] bg-[var(--app-surface-soft)] flex items-center justify-center text-[var(--app-muted)]">
                 <Users size={28} />
               </div>
               <p className="text-sm font-black text-[var(--app-text)]">O'quvchilar yo'q</p>
               <p className="mt-1 text-xs font-bold text-[var(--app-muted)] max-w-[200px]">Bu guruhda hozircha o'quvchilar mavjud emas.</p>
             </div>
          ) : (
             <div className="flex flex-col gap-3">
               {group.members.map((member: any) => (
                 <div key={member.id} className="flex items-center gap-4 p-4 bg-[var(--app-surface)] rounded-[24px] border border-[var(--app-border)] shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] text-base font-black text-white shadow-inner">
                      {member.user?.fullName?.charAt(0) || 'O'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-sm font-black tracking-tight text-[var(--app-text)] truncate">{member.user?.fullName || member.fullName || 'Noma\'lum o\'quvchi'}</h3>
                       <p className="text-[10px] font-bold text-[var(--app-muted)] tracking-widest uppercase mt-0.5">
                         {member.user?.phone || member.phone || '-'}
                       </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg bg-[var(--app-surface-soft)] text-[9px] font-black uppercase text-[var(--app-muted)] tracking-widest">
                       Faol
                    </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
