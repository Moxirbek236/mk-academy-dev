'use client';
import { useState, useEffect } from 'react';
import { Book, ChevronLeft, Loader2, PlayCircle, Trophy, Zap, Clock, Star, Users, CheckCircle2, ListTodo, MoreVertical, Heart, Share2, Info, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#3D855A]" size={40} /></div>;

  if (!course) return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-xl font-black text-gray-400 uppercase tracking-widest">Kurs topilmadi</h1>
      <button onClick={() => router.back()} className="mt-4 text-[#3D855A] font-black text-sm uppercase tracking-widest">Orqaga qaytish</button>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="relative mb-8 pt-6">
        <button onClick={() => router.back()} className="absolute top-6 left-2 p-3 rounded-2xl bg-white/80 backdrop-blur-md text-gray-500 shadow-sm border border-gray-100 active:scale-90 transition-all z-10">
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="w-full h-64 bg-gray-50 rounded-[48px] overflow-hidden relative shadow-sm border border-gray-100 group">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent group-hover:opacity-60 transition-opacity" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Book size={80} className="text-[#3D855A]/20 transform group-hover:scale-110 transition-transform" strokeWidth={1} />
           </div>
           <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                 <span className="text-[10px] font-black text-white bg-[#3D855A] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#3D855A]/30">{course.level || 'A1'}</span>
                 <span className="text-[10px] font-black text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest">Online Kurs</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight px-2">{course.title}</h1>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-[#3D855A]/30 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-50 text-[#3D855A] group-hover:rotate-12 transition-transform">
               <Zap size={20} strokeWidth={2.5} />
            </div>
               <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Vazifalar</p>
                  <p className="text-sm font-black text-gray-900 leading-none mt-1">{(course._count?.tasks || 0) + (course._count?.tests || 0)} ta</p>
               </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-[#3D855A]/30 transition-all">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-500 group-hover:-rotate-12 transition-transform">
               <Users size={20} strokeWidth={2.5} />
            </div>
               <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Guruhlar</p>
                  <p className="text-sm font-black text-gray-900 leading-none mt-1">{course._count?.groups || 0} ta</p>
               </div>
         </div>
      </div>

      <div className="space-y-10 px-2">
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">KURS HAQIDA</h2>
             <Info size={16} className="text-gray-200" />
          </div>
          <p className="text-sm font-bold text-gray-500 leading-relaxed text-justify">
             {course.description || 'Ushbu kurs ingliz tilini tizimli o&apos;rganish uchun mo&apos;ljallangan bo&apos;lib, unda barcha ko&apos;nikmalar (Grammar, Vocabulary, Reading) qamrab olingan. Har bir dars oxirida interaktiv testlar mavjud.'}
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">DARS JARAYONI</h2>
             <span className="text-[10px] font-black text-[#3D855A] bg-emerald-50 px-2.5 py-1 rounded-md uppercase">4 qism</span>
          </div>
          <div className="flex flex-col gap-3">
             {[
               { icon: PlayCircle, title: "Video va Audio darslik", desc: "Interaktiv tushuntirishlar", color: "text-[#3D855A]", bg: "bg-emerald-50" },
               { icon: Book, title: "O'qish materiallari", desc: "Kitoblar va PDF darsliklar", color: "text-blue-500", bg: "bg-blue-50" },
               { icon: ListTodo, title: "Interaktiv vazifalar", desc: "Bilimingizni mustahkamlash", color: "text-amber-500", bg: "bg-amber-50" },
               { icon: Trophy, title: "Final Exam", desc: "Sertifikat uchun imtihon", color: "text-purple-500", bg: "bg-purple-50" },
             ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center gap-5 group hover:bg-gray-50 transition-all cursor-pointer shadow-sm shadow-emerald-900/5">
                   <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-all group-hover:scale-95 group-hover:rotate-6`}>
                      <item.icon size={24} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-[#111827] text-md tracking-tight leading-none mb-1 text-sm">{item.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.desc}</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-200 group-hover:text-[#3D855A] transition-colors" />
                </div>
             ))}
          </div>
        </section>

        <section className="bg-gray-900 rounded-[44px] p-10 text-white relative overflow-hidden group">
           <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-[#3D855A]/20 rounded-full blur-[60px]" />
           <div className="relative z-10 text-center">
              <h3 className="text-2xl font-black tracking-tight leading-tight mb-3">Kursga qo&apos;shilishni xohlaysizmi?</h3>
              <p className="text-sm font-bold text-white/50 mb-10 leading-relaxed max-w-[200px] mx-auto">Guruhlarga qo&apos;shilib tajribali mentorlar nazoratida o&apos;rganing.</p>
              <button 
                onClick={() => router.push('/groups')}
                className="w-full bg-[#3D855A] hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#3D855A]/20 active:scale-[0.98]"
              >
                 GURUHLARNI KO&apos;RISH
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
