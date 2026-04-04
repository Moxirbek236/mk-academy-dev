'use client';
import { ArrowLeft, Share2, Download, Bookmark, Menu, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BookViewer() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages] = useState(380);

  return (
    <div className="fixed inset-0 bg-[#f9f9f9] z-[60] flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Viewer Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-xl bg-gray-50 text-gray-700 active:scale-95 transition-all"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 line-clamp-1">English Grammar in Use</h2>
            <p className="text-[10px] font-bold text-gray-400">P. 10 of 380</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2 text-gray-400"><Bookmark size={18} strokeWidth={2.5} /></button>
          <button className="p-2 text-gray-400"><Share2 size={18} strokeWidth={2.5} /></button>
          <button className="p-2 text-gray-400"><Menu size={18} strokeWidth={2.5} /></button>
        </div>
      </div>

      {/* Reader Body (Iframe Mock) */}
      <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center bg-[#E5E5E5] p-4">
        {/* Actual Book Content (Iframe for PDF/Web view) */}
        <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden relative">
          {/* This would be an <iframe src={pdfUrl} /> in a real app */}
          <div className="absolute inset-0 flex flex-col p-10">
            <h1 className="text-2xl font-serif font-bold mb-6">Unit 1: Present Continuous</h1>
            <p className="font-serif leading-relaxed text-gray-700 mb-4">
              A) Study this example situation:<br/><br/>
              Sarah is in her car. She is on her way to work. <b>She is driving</b> to work.
              This means: she is driving now, at the time of speaking. The action is not finished.
            </p>
            <div className="bg-[#FFF9ED] p-4 rounded-xl border border-[#FDEBCE] mt-4">
              <p className="text-sm font-serif italic text-gray-600">
                Am/is/are + -ing is the present continuous:
                <br/>I am driving
                <br/>he/she/it is working
                <br/>we/you/they are doing
              </p>
            </div>
            <p className="font-serif leading-relaxed text-gray-700 mt-6">
              B) I am doing something = I’m in the middle of doing it; I’ve started doing it and I haven't finished yet:
            </p>
          </div>
          
          <div className="absolute bottom-4 right-4 p-2 bg-[#3D855A] text-white rounded-lg shadow-lg">
             <Maximize2 size={16} />
          </div>
        </div>
      </div>

      {/* Viewer Footer */}
      <div className="bg-white px-6 py-5 border-t border-gray-100 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          className="flex items-center gap-1 text-[11px] font-extrabold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={3} /> Oldingisi
        </button>
        <div className="flex flex-col items-center gap-1.5">
           <div className="flex gap-1 h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3D855A] rounded-full" style={{ width: '15%' }} />
           </div>
           <span className="text-[10px] font-black text-gray-900 tracking-tighter uppercase">5% o'qildi</span>
        </div>
        <button 
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          className="flex items-center gap-1 text-[11px] font-extrabold text-[#3D855A] hover:text-[#2d6343] transition-colors"
        >
          Keyingisi <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
