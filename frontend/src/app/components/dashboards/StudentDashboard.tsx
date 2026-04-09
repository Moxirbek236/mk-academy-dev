'use client';
import { useCallback, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, ListTodo, X, Trophy, Zap, Clock, ChevronRight, ArrowUpRight, Target, BrainCircuit, Users, PlusCircle, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LessonCard } from '../LessonCard';
import api from '@/lib/api';
import { useDashboard } from '@/hooks/useDashboard';
import { useApiRequest } from '@/hooks/useApiRequest';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/app/components/ui/PagePrimitives';

export function StudentDashboard() {
  const t = useTranslations('DashboardStudent');
  const uiT = useTranslations('UiStates');
  const { data, loading, error, refetch } = useDashboard();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const router = useRouter();
  const fetchTasks = useCallback(async () => {
    const tasksResponse = await api.get('/tasks');
    return tasksResponse.data?.data || tasksResponse.data || [];
  }, []);
  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useApiRequest({
    initialData: [] as any[],
    request: fetchTasks,
  });
  const studentGroups = Array.isArray(data?.myGroups) ? data.myGroups : [];

  const stats = [
    { label: t('ranking'), value: data?.rank || t('topPercent'), icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', trend: '+2%' },
    { label: t('streak'), value: t('daysCount', { count: data?.streak || 0 }), icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', trend: t('streakTrend') },
    { label: t('accuracy'), value: `${data?.accuracy || 94}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', trend: t('accuracyTrend') },
    { label: t('mastery'), value: `${data?.completedTasks || 12}/${data?.totalTasks || 40}`, icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-50', trend: t('masteryTrend') },
  ];

  if (loading || tasksLoading) {
    return <PageLoadingState title={uiT('loadingTitle')} description={uiT('loadingDescription')} />;
  }

  if (error) {
    return (
      <PageErrorState
        title={uiT('errorTitle')}
        description={error}
        retryLabel={uiT('retry')}
        onRetry={() => {
          void Promise.all([refetch(), refetchTasks()]);
        }}
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Gamification / Progress Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {stats.map((stat, idx) => (
            <div key={idx} className="app-card p-5 flex items-center gap-4 active:scale-[0.98]">
               <div className={`p-3 rounded-[14px] ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                  <stat.icon size={20} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-sm font-black text-[var(--app-text)] mt-1 tracking-tight">{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="mb-10 px-1 animate-in fade-in slide-in-from-right-4 duration-1000">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
            <Users size={14} className="text-[var(--app-primary)]" /> {t('myGroups')}
         </h2>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {studentGroups.length > 0 ? (
              studentGroups.map((group: any) => (
                <div
                  key={group.id}
                  onClick={() => router.push('/groups')}
                  className="min-w-[260px] app-card p-6 flex items-center gap-4 cursor-pointer group"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--app-surface-soft)] text-[var(--app-primary)] font-black text-lg transition-all shadow-sm group-hover:bg-[color:color-mix(in_srgb,var(--app-primary)_12%,white)]">
                    {(group.name || 'G').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-[var(--app-text)] text-sm tracking-tight truncate">{group.name}</h4>
                    <p className="text-[10px] font-bold text-[var(--app-muted)] uppercase tracking-widest mt-0.5">
                      {t('mentor', { name: group.teacherName || 'Mentor' })}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-[var(--app-muted)]">
                      {group.lessons} • {group.nextLesson}
                    </p>
                  </div>
                  <div className="rounded-[12px] bg-[var(--app-surface-soft)] p-2.5 text-[var(--app-muted)] transition-all group-hover:text-[var(--app-primary)]">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              ))
            ) : (
              <div className="min-w-[280px] max-w-[320px]">
                <PageEmptyState title={t('myGroups')} description={t('emptyGroupsDescription')} />
              </div>
            )}
            <button className="min-w-[160px] rounded-[16px] border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface)] flex flex-col items-center justify-center gap-2 text-[var(--app-muted)] hover:border-[var(--app-primary)]/30 hover:text-[var(--app-primary)] transition-all group active:scale-95">
               <PlusCircle size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">{t('addGroup')}</span>
            </button>
         </div>
      </div>

      <div className="mt-10 mb-6 flex items-center justify-between px-2">
         <h2 className="text-[12px] font-black text-[var(--app-muted)] tracking-[0.15em] uppercase px-1">{t('studyPlan')}</h2>
         <button className="flex items-center gap-1 rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-all hover:bg-[var(--app-surface-soft)] group">
            {t('allUnits')} <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <button
          onClick={() => router.push('/results')}
          className="app-card md:col-span-2 overflow-hidden border-[color:color-mix(in_srgb,var(--app-accent)_20%,var(--app-border))] bg-[linear-gradient(135deg,#fff9ee_0%,#ffffff_52%,#f6fbf8_100%)] p-0 text-left transition-all hover:-translate-y-0.5 active:scale-[0.99]"
        >
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#f5d9a6] bg-[#fff2d9] text-[#c78736] shadow-sm">
                <CheckSquare size={24} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#fff1d7] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#c78736]">
                    {t('nextExam')}
                  </span>
                  <span className="rounded-full border border-[#f3deba] bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#9a6a26]">
                    {t('unitExamCountdown')}
                  </span>
                </div>
                <h3 className="truncate text-xl font-black tracking-tight text-[var(--app-text)]">
                  {t('unitExamTitle')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-[var(--app-muted)]">
                  {t('unitExamDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:text-right">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  {t('unitExamMetaLabel')}
                </p>
                <p className="mt-1 text-sm font-black text-[var(--app-text)]">
                  {t('unitExamMeta')}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--app-primary)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--app-primary)_24%,transparent)]">
                {t('unitExamAction')}
                <ArrowUpRight size={14} strokeWidth={3} />
              </div>
            </div>
          </div>
        </button>

        {tasks.length > 0 ? (
           tasks.map((task: any, idx: number) => (
             <LessonCard 
                key={task.id}
                unit={(idx + 1).toString()} 
                title={task.title} 
                status={idx === 0 ? "done" : idx === 1 ? "done" : "locked"} 
                progress={idx === 0 ? 100 : idx === 1 ? 40 : 0} 
                onClick={() => setSelectedUnit((idx + 1).toString())}
             />
           ))
        ) : (
          <>
            {tasksError ? (
              <div className="col-span-full rounded-[18px] border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-center text-sm font-semibold text-[var(--app-muted)]">
                {tasksError}
              </div>
            ) : null}
            <LessonCard 
              unit="1" 
              title={t('fallbackLesson1')} 
              status="done" 
              progress={100} 
              onClick={() => setSelectedUnit("1")}
            />
            <LessonCard 
              unit="2" 
              title={t('fallbackLesson2')} 
              status="done" 
              progress={40} 
              onClick={() => setSelectedUnit("2")}
            />
            <LessonCard 
              unit="3" 
              title={t('fallbackLesson3')} 
              status="locked" 
              progress={0} 
            />
          </>
        )}
      </div>

      <div className="bg-mesh app-card relative mb-10 overflow-hidden p-8 text-[var(--app-text)]">
         <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">{t('practiceTitle')}</h3>
            <p className="text-sm font-bold text-[var(--app-muted)] mb-8 leading-relaxed max-w-sm">{t('practiceDescription')}</p>
            <button 
               onClick={() => router.push('/vocabulary-practice')}
               className="btn-premium border-none bg-[var(--app-primary)] text-white"
            >
               <Clock size={16} strokeWidth={2.5} className="mr-2" /> {t('trainNow')}
            </button>
         </div>
      </div>

      <Dialog.Root open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[92%] max-w-[360px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-[22px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.18)] focus:outline-none animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <Dialog.Title className="text-2xl font-black tracking-tighter text-[var(--app-text)]">{t('unitTitle', { unit: selectedUnit ?? '' })}</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm font-bold uppercase tracking-widest text-[var(--app-muted)]">{t('selectFocus')}</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="rounded-[14px] bg-[var(--app-surface-soft)] p-3 text-[var(--app-muted)] transition-all active:scale-90 hover:text-[var(--app-text)]">
                  <X size={20} strokeWidth={3} />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              <button 
                onClick={() => router.push(`/unit/${selectedUnit}/vocabulary`)}
                className="flex items-center gap-5 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-5 text-left transition-all group active:scale-[0.98] hover:border-[color:color-mix(in_srgb,var(--app-primary)_20%,var(--app-border))]"
              >
                <div className="rounded-[14px] bg-[var(--app-surface)] p-4 text-[var(--app-primary)] transition-all group-hover:scale-105">
                  <BookOpen size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold tracking-tight text-[var(--app-text)]">{t('vocabulary')}</h4>
                  <p className="mt-0.5 text-[11px] font-bold tracking-tight text-[var(--app-muted)]">{t('vocabularyDescription')}</p>
                </div>
              </button>

              <button 
                onClick={() => router.push(`/unit/${selectedUnit}/tasks`)}
                className="flex items-center gap-5 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-5 text-left transition-all group active:scale-[0.98] hover:border-[color:color-mix(in_srgb,var(--app-accent)_24%,var(--app-border))]"
              >
                <div className="rounded-[14px] bg-[var(--app-surface)] p-4 text-[var(--app-accent)] transition-all group-hover:scale-105">
                  <ListTodo size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold tracking-tight text-[var(--app-text)]">{t('practice')}</h4>
                  <p className="mt-0.5 text-[11px] font-bold tracking-tight text-[var(--app-muted)]">{t('practiceDescription')}</p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 flex justify-center pb-2">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)] opacity-80">{t('footer')}</p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
