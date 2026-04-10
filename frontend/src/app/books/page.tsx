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
    <div className="pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kutubxona</h2>
        <p className="text-sm font-medium text-gray-500">O'zingizga yoqqan kitobni tanlang va o'qing</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon size={18} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Kitob qidirish..." 
          className="w-full bg-white border border-gray-100 rounded-[22px] py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/5 transition-all shadow-sm"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-2">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/books/${book.id}`}
              className="group flex flex-col bg-white rounded-[42px] overflow-hidden border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] active:scale-98 transition-all hover:shadow-2xl hover:border-[#2563eb]/20"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                <img 
                  src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {book.cefrLevel && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-gray-100 ring-4 ring-white/10">
                    <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest">{book.cefrLevel}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <ExternalLink size={12} strokeWidth={3} /> Hoziroq o&apos;qish
                   </p>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <h3 className="font-black text-gray-900 text-sm line-clamp-1 group-hover:text-[#2563eb] transition-colors tracking-tight">{book.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{book.author}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{book.pages || 0} BET</span>
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-[#2563eb] group-hover:text-white transition-all shadow-inner">
                    <ExternalLink size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-100">
               <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[12px]">Hozircha kitoblar mavjud emas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
