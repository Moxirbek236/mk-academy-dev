'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Search,
  MoreVertical,
  RefreshCw,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { getApiErrorMessage, offlineMutation } from '@/lib/offline/request';

interface Lead {
  id: number;
  fullName: string;
  phone: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'ENROLLED' | 'REJECTED';
  createdAt: string;
}

export default function LeadsPage() {
  const [filter, setFilter] = useState<Lead['status'] | 'ALL'>('ALL');
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, fromCache, cachedAt, refetch } = useOfflineQuery<Lead[]>({
    url: '/leads',
    initialData: [],
  });

  useEffect(() => {
    setLocalLeads(data || []);
  }, [data]);

  useEffect(() => {
    if (!actionError) return;
    const timer = window.setTimeout(() => setActionError(null), 3000);
    return () => window.clearTimeout(timer);
  }, [actionError]);

  const filteredLeads = useMemo(
    () => localLeads.filter((lead) => filter === 'ALL' || lead.status === filter),
    [filter, localLeads],
  );

  const updateStatus = async (id: number, status: Lead['status']) => {
    try {
      await offlineMutation('patch', `/leads/${id}/status`, { status });
      setLocalLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    } catch (mutationError) {
      setActionError(getApiErrorMessage(mutationError));
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Ushbu murojaatni o'chirishni xohlaysizmi?")) return;

    try {
      await offlineMutation('delete', `/leads/${id}`);
      setLocalLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (mutationError) {
      setActionError(getApiErrorMessage(mutationError));
    }
  };

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
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">O&apos;qish uchun murojaatlar</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Landing page orqali kelgan leadlar
          </p>
          {fromCache && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
              <Database size={11} />
              Cached ma&apos;lumot{cachedAt ? ` (${new Date(cachedAt).toLocaleString()})` : ''}
            </p>
          )}
        </div>

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'NEW', 'CONTACTED', 'ENROLLED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as Lead['status'] | 'ALL')}
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === status
                  ? 'bg-[#3D855A] text-white shadow-lg shadow-[#3D855A]/20'
                  : 'border border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              {status === 'ALL' ? 'Barchasi' : status}
            </button>
          ))}

          <button
            onClick={() => void refetch()}
            className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 pb-20">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="group rounded-[38px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#3D855A]/30"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[24px] text-xl font-black text-white shadow-lg transition-transform group-hover:scale-105 ${
                      lead.status === 'NEW'
                        ? 'bg-blue-500 shadow-blue-500/20'
                        : lead.status === 'CONTACTED'
                          ? 'bg-amber-500 shadow-amber-500/20'
                          : lead.status === 'ENROLLED'
                            ? 'bg-[#3D855A] shadow-[#3D855A]/20'
                            : 'bg-gray-400'
                    }`}
                  >
                    {lead.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#111827]">
                      {lead.fullName}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                          lead.status === 'NEW'
                            ? 'bg-blue-50 text-blue-500'
                            : lead.status === 'CONTACTED'
                              ? 'bg-amber-50 text-amber-500'
                              : lead.status === 'ENROLLED'
                                ? 'bg-emerald-50 text-[#3D855A]'
                                : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                        <Phone size={14} className="text-[#3D855A]" /> {lead.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                        <Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="no-scrollbar ml-auto flex items-center gap-2 overflow-x-auto md:ml-0">
                  <button
                    onClick={() => void updateStatus(lead.id, 'CONTACTED')}
                    title="Bog'lanildi"
                    className="rounded-2xl bg-amber-50 p-3 text-amber-500 shadow-sm transition-all active:scale-90 hover:bg-amber-500 hover:text-white"
                  >
                    <Clock size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => void updateStatus(lead.id, 'ENROLLED')}
                    title="O'qishga kirdi"
                    className="rounded-2xl bg-emerald-50 p-3 text-[#3D855A] shadow-sm transition-all active:scale-90 hover:bg-[#3D855A] hover:text-white"
                  >
                    <CheckCircle size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => void updateStatus(lead.id, 'REJECTED')}
                    title="Rad etildi"
                    className="rounded-2xl bg-red-50 p-3 text-red-500 shadow-sm transition-all active:scale-90 hover:bg-red-500 hover:text-white"
                  >
                    <XCircle size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => void deleteLead(lead.id)}
                    title="O'chirish"
                    className="rounded-2xl bg-gray-50 p-3 text-gray-400 shadow-sm transition-all active:scale-90 hover:bg-gray-900 hover:text-white"
                  >
                    <MoreVertical size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              {lead.message && (
                <div className="mt-6 rounded-[28px] border border-gray-100/50 bg-gray-50 p-5">
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <MessageSquare size={12} strokeWidth={3} /> Foydalanuvchi xabari:
                  </p>
                  <p className="text-sm font-bold italic leading-relaxed text-gray-600">&quot;{lead.message}&quot;</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[48px] border-2 border-dashed border-gray-100 bg-gray-50 p-20 text-center">
            <Search size={40} className="mx-auto mb-4 text-gray-200" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">
              {fromCache ? "Offline cache bo'sh" : "Hozircha murojaatlar yo'q"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
