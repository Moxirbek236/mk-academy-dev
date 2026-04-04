import { User, Layers, Activity, TrendingUp, Users } from 'lucide-react';

interface HeaderProps {
  role?: string | null;
}

export function Header({ role }: HeaderProps) {
  const currentRole = role?.toLowerCase();
  const isStudent = currentRole === 'student' || !currentRole;
  const isTeacher = currentRole === 'teacher' || currentRole === 'mentor';
  const isAdmin = currentRole === 'admin' || currentRole === 'superadmin';

  return (
    <div className={`bg-gradient-to-br ${isAdmin ? 'from-[#1A1A1A] via-[#2A2A2A] to-[#111111]' : 'from-[#236842] via-[#317F53] to-[#255e3c]'} rounded-b-[36px] pt-12 pb-20 px-5 text-white shadow-md relative z-0 overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#5BC28B]/10 rounded-full blur-3xl opacity-20" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight drop-shadow-sm">MK. Academy</h1>
          <p className="text-xs font-bold opacity-80 mt-0.5 tracking-wider uppercase">
            {currentRole === 'superadmin' ? 'Global Admin Panel' : 
             currentRole === 'admin' ? 'Center Management' : 
             isTeacher ? 'Instructor Portal' : 
             'English Learning'}
          </p>
        </div>
        <div className="w-11 h-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-md shadow-lg group hover:bg-white/20 transition-all cursor-pointer">
          <User size={22} className="text-white group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {isStudent && (
        <>
          <div className="mt-8 relative z-10">
            <p className="text-[11px] font-bold opacity-80 mb-2 uppercase tracking-widest">Umumiy progress</p>
            <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#83D1A5] to-[#5BC28B] w-1/5 rounded-full shadow-[0_0_15px_rgba(131,209,165,0.5)]" />
            </div>
            <div className="flex justify-between items-center mt-2.5">
               <span className="text-sm font-black">20% bajarildi</span>
               <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-lg border border-white/5 uppercase">Level A2</span>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5 relative z-10">
            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-3.5 border border-white/10 shadow-xl">
              <p className="text-xl font-black">1/5</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">Topshiriq</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-3.5 border border-white/10 shadow-xl">
              <p className="text-xl font-black text-amber-300">3</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">Kun qoldi</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-3.5 border border-white/10 shadow-xl">
              <p className="text-xl font-black">0</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">Xatolar</p>
            </div>
          </div>
        </>
      )}

      {isTeacher && (
        <div className="flex gap-2.5 mt-8 relative z-10">
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl"><Layers size={20} /></div>
            <div>
              <p className="text-lg font-black leading-none">3 ta</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">GURUH</p>
            </div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
             <div className="p-2 bg-white/15 rounded-xl"><Users size={20} /></div>
             <div>
              <p className="text-lg font-black leading-none">35 ta</p>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">O&apos;QUVCHI</p>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex gap-2.5 mt-8 relative z-10">
           <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
             <div className="p-2 bg-emerald-500/30 rounded-xl"><Activity size={20} /></div>
             <div>
               <p className="text-lg font-black leading-none">100%</p>
               <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">UPTIME</p>
             </div>
           </div>
           <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/30 rounded-xl"><TrendingUp size={20} /></div>
              <div>
               <p className="text-lg font-black leading-none">+12.5%</p>
               <p className="text-[10px] font-bold opacity-70 mt-1 uppercase">O&apos;SISH</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
