"use client";

import {
  ExternalLink,
  Loader2,
  PlusCircle,
  Save,
  SearchIcon,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CEFR_LEVELS,
  createBook,
  listBooks,
  type CefrLevel,
} from "@/lib/backend-api";
import { useAuth } from "@/hooks/useAuth";
import { hasRoleCapability } from "@/lib/role-access";

const EMPTY_BOOK_FORM = {
  title: "",
  author: "",
  description: "",
  cefrLevel: "" as CefrLevel | "",
  coverImage: null as File | null,
  bookFile: null as File | null,
};

export default function Books() {
  const { role } = useAuth();
  const canManageBooks = hasRoleCapability(role, "manage_books");
  const [activeLevel, setActiveLevel] = useState<CefrLevel | "all">("all");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_BOOK_FORM);

  const levels = useMemo(
    () => [
      { id: "all" as const, name: "Barchasi" },
      ...CEFR_LEVELS.map((level) => ({ id: level, name: level })),
    ],
    []
  );

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listBooks({
        search,
        cefrLevel: activeLevel === "all" ? "" : activeLevel,
        isActive: true,
        limit: 100,
      });
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [activeLevel, search]);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  async function handleCreateBook() {
    if (!form.title.trim()) {
      setMutationError("Kitob nomini kiriting");
      return;
    }

    if (!form.bookFile) {
      setMutationError("Kitob faylini tanlang");
      return;
    }

    try {
      setCreating(true);
      setMutationError(null);
      await createBook({
        title: form.title.trim(),
        author: form.author.trim() || undefined,
        description: form.description.trim() || undefined,
        cefrLevel: form.cefrLevel || undefined,
        coverImage: form.coverImage,
        bookFile: form.bookFile,
      });
      setCreateOpen(false);
      setForm(EMPTY_BOOK_FORM);
      await fetchBooks();
    } catch (bookError) {
      setMutationError(
        bookError instanceof Error
          ? bookError.message
          : "Kitobni qo'shib bo'lmadi"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="app-page pb-nav-safe pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:pt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--app-primary-dark)] sm:text-2xl">
            Kutubxona
          </h2>
          <p className="text-sm font-medium text-[var(--app-muted)]">
            O'zingizga yoqqan kitobni tanlang va o'qing
          </p>
        </div>

        {canManageBooks ? (
          <button
            onClick={() => {
              setMutationError(null);
              setCreateOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-[var(--app-primary)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
          >
            <PlusCircle size={16} strokeWidth={2.5} />
            Kitob qo'shish
          </button>
        ) : null}
      </div>

      <div className="relative mb-6">
        <SearchIcon
          size={18}
          strokeWidth={2.5}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Kitob qidirish..."
          className="w-full border border-[var(--app-border)] bg-[var(--app-surface)] py-3.5 pl-12 pr-4 text-sm font-semibold text-[var(--app-text)] transition-all focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/10 sm:py-4"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setActiveLevel(level.id)}
            className={`whitespace-nowrap border px-5 py-2.5 text-xs font-bold transition-all ${
              activeLevel === level.id
                ? "border-[var(--app-primary)] bg-[var(--app-primary)] text-white scale-105"
                : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:border-[var(--app-primary)]/20"
            }`}
          >
            {level.name}
          </button>
        ))}
      </div>

      {mutationError ? (
        <div className="mb-4 border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {mutationError}
        </div>
      ) : null}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#2563eb]">
          <Loader2 className="animate-spin" size={40} />
          <p className="mt-4 text-sm font-bold">Kitoblar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group flex flex-col overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] transition-all active:scale-98 hover:border-[#2563eb]/20 hover:shadow-2xl sm:rounded-[32px]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <img
                  src={
                    book.coverImageUrl ||
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
                  }
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {book.cefrLevel ? (
                  <div className="absolute left-3 top-3 rounded-xl border border-gray-100 bg-white/95 px-2.5 py-1 shadow-lg ring-4 ring-white/10 backdrop-blur-md sm:left-4 sm:top-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#2563eb]">
                      {book.cefrLevel}
                    </span>
                  </div>
                ) : null}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 sm:p-5">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                    <ExternalLink size={12} strokeWidth={3} /> Hoziroq o'qish
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-4 sm:p-5">
                <h3 className="line-clamp-1 text-sm font-black tracking-tight text-gray-900 transition-colors group-hover:text-[#2563eb]">
                  {book.title}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {book.author || "MK Academy"}
                </p>
                <div className="mt-3 flex items-center justify-between sm:mt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    PDF
                  </span>
                  <div className="rounded-xl bg-gray-50 p-2 text-gray-300 shadow-inner transition-all group-hover:bg-[#2563eb] group-hover:text-white">
                    <ExternalLink size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {books.length === 0 ? (
            <div className="col-span-full rounded-[24px] border-2 border-dashed border-gray-100 bg-gray-50 py-12 text-center sm:rounded-[32px] sm:py-20">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-300">
                Hozircha kitoblar mavjud emas
              </p>
            </div>
          ) : null}
        </div>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[var(--app-primary)]/20 backdrop-blur-md px-3 sm:items-center sm:px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-xl animate-scale-in sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[var(--app-text)]">
                  Yangi kitob
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                  PDF/DOC fayl majburiy
                </p>
              </div>
              <button
                onClick={() => {
                  setCreateOpen(false);
                  setMutationError(null);
                }}
                className="rounded-xl bg-[var(--app-surface-soft)] p-3 text-[var(--app-muted)] transition-all hover:text-[var(--app-primary)] active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Kitob nomi"
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--app-text)] outline-none transition-all focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary)]/10"
              />
              <input
                value={form.author}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    author: event.target.value,
                  }))
                }
                placeholder="Muallif"
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--app-text)] outline-none transition-all focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary)]/10"
              />
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Qisqa tavsif"
                className="w-full resize-none rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--app-text)] outline-none transition-all focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary)]/10"
              />
              <select
                value={form.cefrLevel}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    cefrLevel: event.target.value as CefrLevel | "",
                  }))
                }
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--app-text)] outline-none transition-all focus:border-[var(--app-primary)]"
              >
                <option value="">CEFR level tanlang</option>
                {CEFR_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-bold text-[var(--app-muted)] transition-all hover:border-[var(--app-primary)]/40">
                <Upload size={16} className="text-[var(--app-primary)]" />
                <span className="min-w-0 flex-1 truncate">
                  {form.coverImage?.name || "Cover image tanlash"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      coverImage: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--app-primary)]/30 bg-[color:color-mix(in_srgb,var(--app-primary)_6%,var(--app-surface))] px-4 py-3 text-sm font-bold text-[var(--app-text)] transition-all hover:border-[var(--app-primary)]/50">
                <Upload size={16} className="text-[var(--app-primary)]" />
                <span className="min-w-0 flex-1 truncate">
                  {form.bookFile?.name || "Kitob faylini tanlash"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.zip,.doc,.docx,.xls,.xlsx,application/pdf"
                  className="hidden"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bookFile: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setCreateOpen(false);
                  setMutationError(null);
                }}
                className="flex-1 rounded-xl border border-[var(--app-border)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)] transition-all hover:border-[var(--app-primary)]/30"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => void handleCreateBook()}
                disabled={creating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-[var(--app-primary-dark)] disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Saqlash
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
