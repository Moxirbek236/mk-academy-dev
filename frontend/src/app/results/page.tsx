'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function Results() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, attemptsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/tests/my-attempts')
        ]);
        setStats(statsRes.data?.data || statsRes.data);
        setAttempts(attemptsRes.data?.data || attemptsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#2563eb]" size={40} /></div>;

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <h2 className="text-[22px] font-extrabold text-gray-900 mb-6 tracking-tight">Sizning Natijalaringiz</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#eff6ff] p-6 rounded-[34px] shadow-sm border border-[#dbeafe] flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <TrendingUp size={22} strokeWidth={3} />
            <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Muvaffaqiyat</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{Math.round(stats?.progress || 0)}%</p>
            <p className="text-[10px] text-[#2563eb] font-black mt-2 uppercase tracking-widest opacity-60">Avg. Score</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[34px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-4 text-[#2563eb]">
            <Clock size={22} strokeWidth={3} />
            <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Streak</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.streak || 0}<span className="text-[14px] ml-1 uppercase opacity-30 tracking-widest">kun</span></p>
            <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-60">Active now</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[34px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all hidden lg:flex">
          <div className="flex items-center gap-2 mb-4 text-blue-500">
             <CheckCircle size={22} strokeWidth={3} />
             <span className="font-extrabold text-[12px] uppercase tracking-[0.1em]">Vazifalar</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">12/48</p>
            <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-60">Unit Coverage</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[34px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all hidden lg:flex">
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

      <div className="flex items-center justify-between mb-6 mt-12 px-2">
        <h3 className="text-[12px] font-black text-[#2563eb] tracking-[0.2em] uppercase">SO&apos;NGGI TESTLAR</h3>
        <button className="text-[10px] font-black text-gray-400 hover:text-gray-900 tracking-widest uppercase bg-gray-100 px-4 py-1.5 rounded-full">Barchasi</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 pb-20">
        {attempts.length > 0 ? attempts.map((test, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 rounded-[36px] shadow-sm border border-gray-100/60 flex items-center justify-between hover:border-[#2563eb]/30 hover:shadow-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-[22px] shrink-0 transition-colors bg-[#eff6ff] text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white`}>
                <CheckCircle size={28} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-[#111827] text-lg leading-tight tracking-tight truncate">{test.test?.title || 'Unknown Test'}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Intl.DateTimeFormat('uz-UZ').format(new Date(test.startedAt))}</p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`font-black text-2xl tracking-tighter ${test.score >= 90 ? 'text-[#2563eb]' : 'text-gray-900'}`}>{test.score || 0}%</span>
            </div>
          </div>
        )) : (
          <div className="p-16 text-center bg-gray-50 rounded-[42px] border-2 border-dashed border-gray-100 col-span-full">
             <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[11px]">Hali test topshirilmagan</p>
          </div>
        )}
      </div>
    </div>
  );
}
