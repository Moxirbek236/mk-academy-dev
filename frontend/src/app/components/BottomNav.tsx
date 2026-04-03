import { Home, PlaySquare, Settings, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Asosiy' },
    { path: '/start', icon: PlaySquare, label: 'Start Here' },
    { path: '/results', icon: LayoutGrid, label: 'My Results' },
    { path: '/settings', icon: Settings, label: 'Sozlamalar' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 pb-safe flex justify-between items-center z-50 rounded-t-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center gap-1.5 group transition-all ${isActive ? 'text-[#3D855A]' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <div className={`p-2.5 rounded-2xl group-active:scale-95 transition-transform ${isActive ? 'bg-[#F2F8F5]' : 'group-hover:bg-gray-50'}`}>
              <Icon size={22} strokeWidth={2.5} />
            </div>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}