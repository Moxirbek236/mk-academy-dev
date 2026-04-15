'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { getDashboardStats, getMyTestAttempts, type TestAttempt } from '@/lib/backend-api';

export default function Results() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [statsRes, attemptsRes] = await Promise.all([
          getDashboardStats(),
          getMyTestAttempts(),
        ]);
        setStats(statsRes);
        setAttempts(attemptsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Natijalarni yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="app-page flex justify-center p-10 sm:p-20"><Loader2 className="animate-spin text-[#2563eb]" size={40} /></div>;

  return (
    <div className="app-page pb-nav-safe pt-4 animate-in fade-in duration-500 sm:pt-6">
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-gray-900 sm:mb-6 sm:text-[22px]">Sizning Natijalaringiz</h2>

      {error ? (
        <div className="mb-4 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-[20px] border border-[#dbeafe] bg-[#eff6ff] p-4 shadow-sm transition-all hover:shadow-xl sm:rounded-[34px] sm:p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <TrendingUp size={22} strokeWidth={3} />
            <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Muvaffaqiyat</span>
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-gray-900 sm:text-4xl">{Math.round(stats?.progress || 0)}%</p>
            <p className="text-[10px] text-[#2563eb] font-black mt-2 uppercase tracking-widest opacity-60">Avg. Score</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-xl sm:rounded-[34px] sm:p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <Clock size={22} strokeWidth={3} />
            <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Streak</span>
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-gray-900 sm:text-4xl">{stats?.streak || 0}<span className="ml-1 text-[12px] uppercase tracking-widest opacity-30 sm:text-[14px]">kun</span></p>
            <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-60">Active now</p>
          </div>
        </div>
        <div className="hidden flex-col justify-between rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-xl lg:flex lg:rounded-[34px] lg:p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-500">
             <CheckCircle size={22} strokeWidth={3} />
             <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Vazifalar</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">12/48</p>
            <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-60">Unit Coverage</p>
          </div>
        </div>
        <div className="hidden flex-col justify-between rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-xl lg:flex lg:rounded-[34px] lg:p-6">
          <div className="flex items-center gap-2 mb-4 text-amber-500">
             <TrendingUp size={22} strokeWidth={3} />
             <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Reyting</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">#2</p>
            <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-60">Guruh ichida</p>
          </div>
        </div>
      </div>

      <div className="mb-5 mt-10 flex items-center justify-between px-1 sm:mb-6 sm:mt-12 sm:px-2">
        <h3 className="text-[12px] font-black text-[#2563eb] tracking-[0.2em] uppercase">SO&apos;NGGI TESTLAR</h3>
        <button className="text-[10px] font-black text-gray-400 hover:text-gray-900 tracking-widest uppercase bg-gray-100 px-4 py-1.5 rounded-full">Barchasi</button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 pb-20 md:grid-cols-2 lg:grid-cols-2 sm:gap-5">
        {attempts.length > 0 ? attempts.map((test, idx) => (
          <div
            key={test.id || idx}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-[22px] border border-gray-100/60 bg-white p-4 shadow-sm transition-all hover:border-[#2563eb]/30 hover:shadow-2xl active:scale-95 sm:gap-5 sm:rounded-[36px] sm:p-6"
          >
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <div className={`shrink-0 rounded-[18px] bg-[#eff6ff] p-3 text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white sm:rounded-[22px] sm:p-4`}>
                <CheckCircle size={24} strokeWidth={2.5} className="sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-base font-black leading-tight tracking-tight text-[#111827] sm:text-lg">{test.test?.title || 'Unknown Test'}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Intl.DateTimeFormat('uz-UZ').format(new Date(test.startedAt))}</p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-xl font-black tracking-tighter sm:text-2xl ${Number(test.percentage || 0) >= 90 ? 'text-[#2563eb]' : 'text-gray-900'}`}>{Math.round(test.percentage || 0)}%</span>
              <p className={`mt-1 text-[9px] font-black uppercase tracking-widest ${test.passed ? 'text-blue-600' : 'text-red-500'}`}>
                {test.passed ? "O'tdi" : "O'tmadi"}
              </p>
            </div>
          </div>
        )) : (
          <div className="col-span-full rounded-[24px] border-2 border-dashed border-gray-100 bg-gray-50 p-10 text-center sm:rounded-[42px] sm:p-16">
             <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[11px]">Hali test topshirilmagan</p>
          </div>
        )}
      </div>
    </div>
  );
}
