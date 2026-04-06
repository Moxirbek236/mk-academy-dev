'use client';
import { Home, Book, Settings as SettingsIcon, LayoutGrid, Users, DollarSign, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  role?: string | null;
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname() || '/';
  const currentRole = role?.toLowerCase();
  const isAdmin = currentRole === 'admin' || currentRole === 'superadmin';
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';

  const navItems = currentRole === 'superadmin' ? [
    { path: '/', icon: Home, label: 'Boshqaruv' },
    { path: '/users', icon: Users, label: 'Foydalanuvchilar' },
    { path: '/finance', icon: DollarSign, label: 'Moliya' },
    { path: '/system', icon: ShieldCheck, label: 'Tizim' },
    { path: '/settings', icon: SettingsIcon, label: 'Sozlamalar' },
  ] : currentRole === 'admin' ? [
    { path: '/', icon: Home, label: 'Bosh' },
    { path: '/users', icon: Users, label: 'O&apos;quvchilar' },
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
    { path: '/groups', icon: Layers, label: 'Guruhlar' },
    { path: '/learning', icon: BookOpen, label: 'Darslar' },
    { path: '/books', icon: Book, label: 'Kitoblar' },
    { path: '/results', icon: LayoutGrid, label: 'Reyting' },
    { path: '/settings', icon: SettingsIcon, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 pb-safe flex justify-between items-center z-50 rounded-t-[30px] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm bg-white/95">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`flex flex-col items-center gap-1.5 group transition-all ${isActive ? 'text-[#3D855A]' : 'text-gray-400 hover:text-gray-900 focus:scale-95'}`}
          >
            <div className={`p-2.5 rounded-2xl group-active:scale-90 transition-all ${isActive ? 'bg-[#F2F8F5] shadow-sm' : 'group-hover:bg-gray-50'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span 
               className={`text-[9.5px] tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}
               dangerouslySetInnerHTML={{ __html: item.label }}
            />
          </Link>
        );
      })}
    </div>
  );
}