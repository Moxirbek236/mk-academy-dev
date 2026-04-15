'use client';
import { SearchIcon, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Books() {
  const [activeTab, setActiveTab] = useState('all');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { id: 'all', name: 'Barchasi' },
    { id: 'GRAMMAR', name: 'Grammatika' },
    { id: 'FICTION', name: 'Badiiy' },
    { id: 'ACADEMIC', name: 'Akademik' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const url = activeTab === 'all' ? '/books' : `/books?category=${activeTab}`;
        const res: any = await api.get(url);
        setBooks(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [activeTab]);

  return (
    <div className="app-page pb-nav-safe pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:pt-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">Kutubxona</h2>
        <p className="text-sm font-medium text-gray-500">O'zingizga yoqqan kitobni tanlang va o'qing</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon size={18} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Kitob qidirish..." 
          className="w-full rounded-[18px] border border-gray-100 bg-white py-3.5 pl-12 pr-4 text-sm font-semibold shadow-sm transition-all focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#2563eb]/5 sm:rounded-[22px] sm:py-4"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              activeTab === cat.id 
                ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-md shadow-[#2563eb]/20 scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#2563eb]">
          <Loader2 className="animate-spin" size={40} />
          <p className="mt-4 font-bold text-sm">Kitoblar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/books/${book.id}`}
              className="group flex flex-col overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] transition-all active:scale-98 hover:border-[#2563eb]/20 hover:shadow-2xl sm:rounded-[42px]"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                <img 
                  src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {book.cefrLevel && (
                  <div className="absolute left-3 top-3 rounded-xl border border-gray-100 bg-white/95 px-2.5 py-1 shadow-lg ring-4 ring-white/10 backdrop-blur-md sm:left-4 sm:top-4">
                    <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest">{book.cefrLevel}</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 sm:p-5">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <ExternalLink size={12} strokeWidth={3} /> Hoziroq o&apos;qish
                   </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-4 sm:p-5">
                <h3 className="font-black text-gray-900 text-sm line-clamp-1 group-hover:text-[#2563eb] transition-colors tracking-tight">{book.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{book.author}</p>
                <div className="mt-3 flex items-center justify-between sm:mt-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{book.pages || 0} BET</span>
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-[#2563eb] group-hover:text-white transition-all shadow-inner">
                    <ExternalLink size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {books.length === 0 && (
            <div className="col-span-full rounded-[24px] border-2 border-dashed border-gray-100 bg-gray-50 py-12 text-center sm:rounded-[48px] sm:py-20">
               <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[12px]">Hozircha kitoblar mavjud emas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
