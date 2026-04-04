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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
            placeholder="Ism yoki email bo'yicha..." 
            className="w-full bg-white border border-gray-100 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] transition-all shadow-sm"
          />
        </div>
        <button className="p-3.5 bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-gray-900 transition-all shadow-sm">
           <Filter size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3.5 pb-10">
        {loading ? (
          <div className="flex justify-center p-20 opacity-20"><User size={40} className="animate-pulse" /></div>
        ) : users.map((user, idx) => (
          <div key={user.id || idx} className="bg-white p-4 rounded-[28px] border border-gray-50 shadow-sm flex items-center gap-4 hover:border-gray-200 group transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
              user.role === 'SUPERADMIN' ? 'bg-[#FFEBEC] text-[#E54D2E]' : 
              user.role === 'TEACHER' ? 'bg-[#3D855A]/10 text-[#3D855A]' : 
              'bg-blue-50 text-blue-600'
            }`}>
              {user.fullName?.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <h3 className="font-extrabold text-gray-900 text-[15px] truncate">{user.fullName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-50">{user.role}</span>
                {user.cefrLevel && (
                   <>
                     <span className="w-1 h-1 rounded-full bg-gray-300" />
                     <span className="text-[9px] font-black text-[#3D855A] uppercase">{user.cefrLevel}</span>
                   </>
                )}
              </div>
            </div>
            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
              <MoreVertical size={18} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
