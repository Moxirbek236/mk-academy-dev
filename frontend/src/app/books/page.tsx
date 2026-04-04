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
          className="w-full bg-white border border-gray-100 rounded-[22px] py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-[#3D855A] focus:ring-4 focus:ring-[#3D855A]/5 transition-all shadow-sm"
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
                ? 'bg-[#3D855A] text-white border-[#3D855A] shadow-md shadow-[#3D855A]/20 scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#3D855A]">
          <Loader2 className="animate-spin" size={40} />
          <p className="mt-4 font-bold text-sm">Kitoblar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-2">
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/books/${book.id}`}
              className="group flex flex-col bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.05)] active:scale-95 transition-all"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100">
                <img 
                  src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'} 
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {book.cefrLevel && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-[8px] font-extrabold text-[#3D855A] uppercase tracking-wider">{book.cefrLevel}</span>
                  </div>
                )}
              </div>
              <div className="p-3.5 flex flex-col gap-0.5">
                <h3 className="font-extrabold text-gray-900 text-xs line-clamp-1 group-hover:text-[#3D855A] transition-colors">{book.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold">{book.author}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400">{book.pages || 0} bet</span>
                  <div className="p-1.5 rounded-full bg-[#F2F8F5] text-[#3D855A]">
                    <ExternalLink size={12} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {books.length === 0 && (
            <div className="col-span-2 text-center py-10">
               <p className="text-gray-400 font-bold text-sm">Hozircha kitoblar yo'q</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
