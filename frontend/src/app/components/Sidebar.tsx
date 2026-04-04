'use client';
import { Home, Book, Settings as SettingsIcon, LayoutGrid, Users, DollarSign, BookOpen, Layers, ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role?: string | null;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname() || '/';
  const currentRole = role?.toLowerCase();
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';

  const navItems = currentRole === 'superadmin' ? [
    { path: '/', icon: Home, label: 'Boshqaruv' },
    { path: '/users', icon: Users, label: 'Foydalanuvchilar' },
    { path: '/finance', icon: DollarSign, label: 'Moliya' },
    { path: '/system', icon: ShieldCheck, label: 'Tizim' },
    { path: '/settings', icon: SettingsIcon, label: 'Sozlamalar' },
  ] : currentRole === 'admin' ? [
    { path: '/', icon: Home, label: 'Bosh' },
    { path: '/users', icon: Users, label: 'O\'quvchilar' },
    { path: '/courses', icon: BookOpen, label: 'Kurslar' },
    { path: '/results', icon: LayoutGrid, label: 'Hisobot' },
    { path: '/settings', icon: SettingsIcon, label: 'Sozlamalar' },
  ] : isTeacher ? [
    { path: '/', icon: Home, label: 'Monitor' },
    { path: '/groups', icon: Layers, label: 'Guruhlar' },
    { path: '/tasks', icon: BookOpen, label: 'Topshiriqlar' },
    { path: '/results', icon: LayoutGrid, label: 'Natijalar' },
    { path: '/settings', icon: SettingsIcon, label: 'Sozlamalar' },
  ] : [
    { path: '/', icon: Home, label: 'Bosh' },
    { path: '/learning', icon: BookOpen, label: 'Darslar' },
    { path: '/books', icon: Book, label: 'Kitoblar' },
    { path: '/results', icon: LayoutGrid, label: 'Reyting' },
    { path: '/settings', icon: SettingsIcon, label: 'Profil' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-[60] shadow-2xl shadow-gray-100/50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3D855A] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#3D855A]/20">
            MK
          </div>
          <div>
            <h1 className="text-lg font-black text-[#111827] tracking-tight leading-none">Academy</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Language Lab</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group ${
                  isActive 
                    ? 'bg-[#3D855A] text-white shadow-xl shadow-[#3D855A]/20' 
                    : 'text-gray-400 hover:text-[#111827] hover:bg-gray-50'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-md' : 'group-hover:scale-110 transition-transform'} />
                <span className={`text-[13px] tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-[#F2F8F5] p-5 rounded-[28px] border border-[#3D855A]/10 mb-6">
          <p className="text-[10px] font-black text-[#3D855A] uppercase tracking-widest leading-none mb-1.5 text-center">Tizim holati</p>
          <div className="w-full h-1.5 bg-[#3D855A]/10 rounded-full overflow-hidden">
             <div className="w-4/5 h-full bg-[#3D855A] rounded-full" />
          </div>
        </div>
        
        <button className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-extrabold text-[13px] hover:bg-red-50 rounded-[22px] transition-all group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}
