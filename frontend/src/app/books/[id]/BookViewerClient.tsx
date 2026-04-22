'use client';

import { useCallback } from 'react';
import {
  ChevronLeft,
  ExternalLink,
  Loader2,
  Maximize2,
  Share2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getBookById } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

type BookDetails = {
  id?: number;
  title?: string;
  author?: string;
  description?: string;
  downloadUrl?: string;
  fileUrl?: string;
  url?: string;
};

export default function BookViewerClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookId = Number(params.id);
  const enabled = Number.isFinite(bookId) && bookId > 0;

  const request = useCallback(() => getBookById(bookId), [bookId]);
  const {
    data: book,
    loading,
    error,
    refetch,
  } = useApiRequest<BookDetails | null>({
    enabled,
    initialData: null,
    request,
    requestKey: ['book', bookId],
  });

  const fileUrl = book?.downloadUrl || book?.fileUrl || book?.url || '';
  const title = book?.title || 'Kitob';

  const shareBook = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.share) return;
    void navigator.share({
      title,
      url: window.location.href,
    });
  }, [title]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#f9f9f9]">
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl bg-gray-50 p-2 text-gray-700 transition-all active:scale-95"
            aria-label="Orqaga"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="min-w-0">
            <h2 className="line-clamp-1 text-sm font-extrabold text-gray-900">
              {title}
            </h2>
            <p className="mt-0.5 text-[10px] font-bold text-gray-400">
              {book?.author || "Muallif ko'rsatilmagan"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="p-2 text-gray-400"
            type="button"
            onClick={shareBook}
            aria-label="Ulashish"
          >
            <Share2 size={18} strokeWidth={2.5} />
          </button>
          {fileUrl ? (
            <a
              className="p-2 text-gray-400"
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Yangi oynada ochish"
            >
              <ExternalLink size={18} strokeWidth={2.5} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#E5E5E5] p-4">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-white shadow-lg">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center text-[#2563eb]">
              <Loader2 className="animate-spin" size={36} />
              <p className="mt-4 text-sm font-bold">Kitob yuklanmoqda...</p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-lg font-black text-gray-900">
                Kitobni yuklab bo'lmadi
              </p>
              <p className="mt-2 max-w-md text-sm font-semibold text-gray-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="mt-6 rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-black text-white"
              >
                Qayta yuklash
              </button>
            </div>
          ) : fileUrl ? (
            <iframe
              title={title}
              src={fileUrl}
              className="h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-lg font-black text-gray-900">
                Kitob fayli mavjud emas
              </p>
              <p className="mt-2 max-w-md text-sm font-semibold text-gray-500">
                Backend bu kitob uchun `downloadUrl` yoki fayl manzilini qaytarmadi.
              </p>
            </div>
          )}

          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 rounded-lg bg-[#2563eb] p-2 text-white shadow-lg"
              aria-label="To'liq ekranda ochish"
            >
              <Maximize2 size={16} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[11px] font-extrabold text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft size={16} strokeWidth={3} /> Orqaga
        </button>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-[#2563eb] px-4 py-2 text-[11px] font-black uppercase text-white"
          >
            Ochish <ExternalLink size={14} strokeWidth={3} />
          </a>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Fayl kutilmoqda
          </span>
        )}
      </div>
    </div>
  );
}
