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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <h2 className="text-[22px] font-extrabold text-gray-900 mb-6 tracking-tight">Sizning Natijalaringiz</h2>

      <div className="grid grid-cols-2 gap-3.5 mb-8">
        <div className="bg-[#F2F8F5] p-5 rounded-3xl shadow-sm border border-[#E3EFE8] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-[#3D855A]">
            <TrendingUp size={18} strokeWidth={3} />
            <span className="font-extrabold text-[13px] uppercase tracking-wider">Muvaffaqiyat</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{Math.round(stats?.progress || 0)}%</p>
            <p className="text-xs text-[#3D855A] font-bold mt-1.5 flex items-center gap-1">
              <span className="bg-[#3D855A]/10 px-1.5 rounded">Avg</span> Topshiriqlar
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-gray-500">
            <Clock size={18} strokeWidth={3} />
            <span className="font-extrabold text-[13px] uppercase tracking-wider">Streak</span>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{stats?.streak || 0}<span className="text-xl">kun</span></p>
            <p className="text-xs text-gray-500 font-bold mt-1.5 uppercase tracking-widest">
              Loyiha davomiyligi
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 mt-10">
        <h3 className="text-[13px] font-bold text-[#3D855A] tracking-wider uppercase">So&apos;nggi testlar</h3>
        <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Barchasi</button>
      </div>
      
      <div className="flex flex-col gap-3.5 pb-10">
        {attempts.length > 0 ? attempts.map((test, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-4.5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shrink-0 transition-colors bg-[#E3EFE8] text-[#3D855A]`}>
                <CheckCircle size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-[15px] leading-snug tracking-tight">{test.test?.title || 'Unknown Test'}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 font-medium">{new Date(test.startedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-black text-lg ${test.score >= 90 ? 'text-[#3D855A]' : 'text-gray-900'}`}>{test.score || 0}%</span>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Hali test topshirilmagan</p>
          </div>
        )}
      </div>
    </div>
  );
}