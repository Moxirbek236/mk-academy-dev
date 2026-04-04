import { useState, useEffect } from 'react';
import { Shield, Users, FileText, PlusCircle, Activity, ChevronRight, Settings, TrendingUp, Presentation, School, UserPlus, ClipboardList, Loader2 } from 'lucide-react';
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
            <div className="p-4 bg-white shadow-xl rounded-[24px] border border-gray-100/50 group hover:rotate-[10deg] transition-all">
               <Shield size={28} className="text-[#3D855A]" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-[#111827] tracking-tight">Center Admin</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Management Active
               </p>
            </div>
         </div>
         <button className="p-3.5 rounded-[22px] bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#111827] hover:bg-gray-50 transition-all hover:scale-110 active:scale-95">
            <Settings size={22} strokeWidth={2.5} />
         </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat: any, idx: number) => (
          <div key={idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm group hover:border-[#3D855A]/30 hover:shadow-xl transition-all cursor-default">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-[22px] ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <stat.icon size={26} strokeWidth={2.5} />
               </div>
               <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 tracking-wider mb-2 uppercase opacity-80">{stat.label}</p>
            <p className="text-3xl font-black text-[#111827] tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[12px] font-black text-[#1A1A1A]/40 tracking-[0.15em] uppercase mb-6 px-3 flex items-center justify-between">
         Quick Actions
         <Activity size={16} className="text-[#3D855A]" />
      </h2>
      <div className="flex flex-col gap-4">
         <button className="flex items-center gap-5 bg-white p-6 rounded-[36px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all text-left hover:border-[#3D855A]/30 group">
            <div className="p-5 bg-[#F2F8F5] text-[#3D855A] rounded-[24px] group-hover:scale-110 transition-transform">
               <PlusCircle size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="font-extrabold text-[#111827] text-lg">Yangi Kurs</h3>
               <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-tight">O&apos;quv rejasini boshqarish</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-[#3D855A] group-hover:text-white transition-all">
               <ChevronRight size={20} strokeWidth={3} />
            </div>
         </button>

         <button className="flex items-center gap-5 bg-white p-6 rounded-[36px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all text-left hover:border-amber-100 group">
            <div className="p-5 bg-amber-50 text-amber-600 rounded-[24px] group-hover:scale-110 transition-transform">
               <UserPlus size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="font-extrabold text-[#111827] text-lg">Mentorlar</h3>
               <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-tight">Yangi mentorlarni ro&apos;yxatga olish</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
               <ChevronRight size={20} strokeWidth={3} />
            </div>
         </button>

         <button className="flex items-center gap-5 bg-white p-6 rounded-[36px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all text-left hover:border-blue-100 group">
            <div className="p-5 bg-blue-50 text-blue-600 rounded-[24px] group-hover:scale-110 transition-transform">
               <FileText size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="font-extrabold text-[#111827] text-lg">Imtihonlar</h3>
               <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-tight">Topshirilgan testlar tahlili</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-all">
               <ChevronRight size={20} strokeWidth={3} />
            </div>
         </button>
      </div>

      <div className="mt-8 flex justify-center pb-4">
         <button className="flex items-center gap-2 text-[11px] font-black text-gray-400 hover:text-[#3D855A] transition-all uppercase tracking-widest tracking-tighter">
            <TrendingUp size={16} /> View Detailed Stats
         </button>
      </div>
    </div>
  );
}
