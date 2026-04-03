import { Outlet } from 'react-router';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#242424] flex justify-center text-gray-900 font-sans">
      <div className="w-full max-w-md min-h-screen bg-[#F4F7F5] relative shadow-2xl overflow-hidden pb-24 border-x border-[#333] flex flex-col">
        <Header />
        
        <div className="bg-[#F4F7F5] rounded-t-[32px] -mt-10 px-5 pt-8 z-10 relative flex-1 pb-24 shadow-[0_-8px_20px_rgba(0,0,0,0.02)] overflow-y-auto">
          <Outlet />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}