'use client';
import { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Shield, GraduationCap, User, Filter } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users', {
          params: { fullName: searchTerm }
        });
        setUsers(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Foydalanuvchilar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Jami: {users.length} nafar</p>
        </div>
        <button className="bg-[#3D855A] text-white p-3 rounded-2xl shadow-lg shadow-[#3D855A]/20 active:scale-90 transition-all">
          <UserPlus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ism bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
          />
        </div>
        <button className="p-3.5 bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-gray-900 transition-all shadow-sm">
           <Filter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pb-20">
        {loading ? (
          <div className="flex justify-center p-20 opacity-20 col-span-full"><User size={40} className="animate-pulse" /></div>
        ) : users.map((user, idx) => (
          <div key={user.id || idx} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-[#3D855A]/30 hover:shadow-xl group transition-all cursor-pointer overflow-hidden active:scale-[0.98]">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl shadow-inner transition-all group-hover:scale-110 shrink-0 ${
              user.role === 'SUPERADMIN' ? 'bg-[#FFEBEC] text-[#E54D2E]' : 
              user.role === 'TEACHER' ? 'bg-[#F2F8F5] text-[#3D855A]' : 
              'bg-blue-50 text-blue-600'
            }`}>
              {user.fullName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-[#111827] text-base truncate tracking-tight">{user.fullName || 'New User'}</h3>
              <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded-md text-gray-400 whitespace-nowrap">{user.role}</span>
                {user.cefrLevel && (
                   <>
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                     <span className="text-[9px] font-black text-[#3D855A] uppercase tracking-widest whitespace-nowrap">{user.cefrLevel}</span>
                   </>
                )}
              </div>
            </div>
            <button className="p-3 text-gray-300 hover:text-gray-900 transition-all shrink-0">
               <MoreVertical size={20} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
