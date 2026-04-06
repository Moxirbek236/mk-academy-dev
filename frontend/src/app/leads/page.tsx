'use client';
import { useState, useEffect } from 'react';
import { Phone, User, Calendar, MessageSquare, CheckCircle, XCircle, Clock, Loader2, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leads');
      setLeads(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/leads/${id}/status`, { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Ushbu murojaatni o\'chirishni xohlaysizmi?')) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter(l => filter === 'ALL' || l.status === filter);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">O&apos;qish uchun murojaatlar</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Landing page orqali kelgan leadlar</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'NEW', 'CONTACTED', 'ENROLLED', 'REJECTED'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-[#3D855A] text-white shadow-lg shadow-[#3D855A]/20' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'Barchasi' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20">
        {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white p-6 rounded-[38px] border border-gray-100 shadow-sm hover:border-[#3D855A]/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-105 ${
                  lead.status === 'NEW' ? 'bg-blue-500 shadow-blue-500/20' : 
                  lead.status === 'CONTACTED' ? 'bg-amber-500 shadow-amber-500/20' :
                  lead.status === 'ENROLLED' ? 'bg-[#3D855A] shadow-[#3D855A]/20' : 'bg-gray-400'
                }`}>
                  {lead.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#111827] text-lg tracking-tight flex items-center gap-2">
                    {lead.fullName}
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      lead.status === 'NEW' ? 'bg-blue-50 text-blue-500' : 
                      lead.status === 'CONTACTED' ? 'bg-amber-50 text-amber-500' :
                      lead.status === 'ENROLLED' ? 'bg-emerald-50 text-[#3D855A]' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {lead.status}
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                      <Phone size={14} className="text-[#3D855A]" /> {lead.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                      <Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-0 overflow-x-auto no-scrollbar">
                <button onClick={() => updateStatus(lead.id, 'CONTACTED')} title="Bog'lanildi" className="p-3 rounded-2xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-90">
                   <Clock size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => updateStatus(lead.id, 'ENROLLED')} title="O'qishga kirdi" className="p-3 rounded-2xl bg-emerald-50 text-[#3D855A] hover:bg-[#3D855A] hover:text-white transition-all shadow-sm active:scale-90">
                   <CheckCircle size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => updateStatus(lead.id, 'REJECTED')} title="Rad etildi" className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
                   <XCircle size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => deleteLead(lead.id)} title="O'chirish" className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90">
                   <MoreVertical size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {lead.message && (
              <div className="mt-6 p-5 bg-gray-50 rounded-[28px] border border-gray-100/50">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <MessageSquare size={12} strokeWidth={3} /> Foydalanuvchi xabari:
                 </p>
                 <p className="text-sm font-bold text-gray-600 leading-relaxed italic">&quot;{lead.message}&quot;</p>
              </div>
            )}
          </div>
        )) : (
          <div className="p-20 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-100">
            <Search size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[11px]">Hozircha murojaatlar yo&apos;q</p>
          </div>
        )}
      </div>
    </div>
  );
}
