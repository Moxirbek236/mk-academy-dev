import { User } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-gradient-to-br from-[#236842] via-[#317F53] to-[#255e3c] rounded-b-[36px] pt-12 pb-20 px-5 text-white shadow-md relative z-0 overflow-hidden">
      {/* Decorative Waves */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#5BC28B]/20 rounded-full blur-3xl" />
      
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MK. Academy</h1>
          <p className="text-sm opacity-90 mt-0.5">Ta'lim platformasi</p>
        </div>
        <div className="w-11 h-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner">
          <User size={22} className="text-white" />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-8 relative z-10">
        <p className="text-sm opacity-90 mb-2 font-medium">Umumiy progress</p>
        <div className="h-2 w-full bg-black/15 rounded-full overflow-hidden">
          <div className="h-full bg-[#83D1A5] w-1/5 rounded-full shadow-[0_0_10px_rgba(131,209,165,0.4)]" />
        </div>
        <p className="text-sm font-semibold mt-2.5">20% bajarildi</p>
      </div>

      {/* Stats */}
      <div className="flex gap-2.5 mt-5 relative z-10">
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 shadow-sm">
          <p className="text-lg font-bold">1/5</p>
          <p className="text-[11px] font-medium opacity-90 mt-0.5">Topshiriqlar</p>
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 shadow-sm">
          <p className="text-lg font-bold">3</p>
          <p className="text-[11px] font-medium opacity-90 mt-0.5">Kun qoldi</p>
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 shadow-sm">
          <p className="text-lg font-bold">0</p>
          <p className="text-[11px] font-medium opacity-90 mt-0.5">Xatolar</p>
        </div>
      </div>
    </div>
  );
}
