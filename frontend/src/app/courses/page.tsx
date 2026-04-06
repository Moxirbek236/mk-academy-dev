'use client';

import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  Layers,
  ListTodo,
  Loader2,
  RefreshCw,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { getApiErrorMessage } from '@/lib/offline/request';

interface Course {
  title: string;
  level?: string;
  isActive?: boolean;
  _count?: {
    tasks?: number;
    tests?: number;
    groups?: number;
  };
}

export default function CoursesPage() {
  const { data, loading, error, fromCache, cachedAt, isEmpty, refetch } = useOfflineQuery<Course[]>({
    url: '/courses',
    initialData: [],
  });

  const courses = data || [];

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#3D855A]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-red-100 bg-red-50 p-8 text-center">
        <AlertTriangle size={36} className="mx-auto mb-3 text-red-500" />
        <p className="text-sm font-extrabold text-red-700">{getApiErrorMessage(error)}</p>
        <button
          onClick={() => void refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-red-700 shadow-sm"
        >
          <RefreshCw size={14} />
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Kurslar</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Jami: {courses.length} ta</p>
          {fromCache && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
              <Database size={11} />
              Cached ma&apos;lumot{cachedAt ? ` (${new Date(cachedAt).toLocaleString()})` : ''}
            </p>
          )}
        </div>
        <button className="rounded-2xl bg-[#3D855A] p-3 text-white shadow-lg shadow-[#3D855A]/20 transition-all active:scale-90">
          <PlusCircle size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Kurslarni qidirish..."
            className="w-full rounded-[20px] border border-gray-100 bg-white py-4 pl-11 pr-4 text-sm font-semibold shadow-sm transition-all focus:border-[#3D855A] focus:outline-none"
          />
        </div>
        <button className="rounded-[20px] border border-gray-100 bg-white p-4 text-gray-400 shadow-sm transition-all hover:text-gray-900">
          <Filter size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {!isEmpty ? (
          courses.map((course, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-5 overflow-hidden rounded-[38px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#3D855A]/30 hover:shadow-xl active:scale-[0.98]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#F2F8F5] text-xl font-black text-[#3D855A] shadow-inner transition-all group-hover:rotate-6 group-hover:bg-[#3D855A] group-hover:text-white">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 truncate">
                <h3 className="truncate text-lg font-extrabold tracking-tight text-[#111827]">{course.title}</h3>
                <div className="no-scrollbar mt-1.5 flex items-center gap-3 overflow-x-auto">
                  <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-gray-500">
                    {course.level || 'UNKNOWN'}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-[#3D855A]">
                    {(course._count?.tasks || 0) + (course._count?.tests || 0)} dars
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-blue-500">
                    {(course._count?.groups || 0) * 12} o&apos;quvchi
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button className="rounded-xl bg-gray-50 p-2.5 text-gray-300 transition-all hover:bg-gray-100 hover:text-gray-900">
                  <MoreVertical size={18} strokeWidth={2.5} />
                </button>
                {!course.isActive && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
                    Draft
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[40px] border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {fromCache
                ? "Offline cache bo'sh: hozircha kurslar saqlanmagan"
                : 'Hali kurslar mavjud emas'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center border-t border-gray-100/50 pb-8 pt-8">
        <div className="grid w-full grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 rounded-[24px] bg-gray-50 p-4 text-[11px] font-black text-gray-400 transition-all hover:text-[#3D855A]">
            <Layers size={18} /> Unit Library
          </button>
          <button className="flex items-center justify-center gap-3 rounded-[24px] bg-gray-50 p-4 text-[11px] font-black text-gray-400 transition-all hover:text-[#C78736]">
            <ListTodo size={18} /> Master Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
