'use client';
import { useState, useEffect } from 'react';
import { Book, ChevronLeft, Loader2, PlayCircle, Trophy, Zap, Users, Info, ChevronRight, ListTodo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, getGroupsByCourse, assignCourseToGroup, removeGroupCourse, listGroups } from '@/lib/backend-api';
import { useAuth } from '@/hooks/useAuth';
import { hasRoleCapability } from '@/lib/role-access';

export default function CourseDetailClient() {
  const { id } = useParams();
  const { role } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courseGroups, setCourseGroups] = useState<any[]>([]);
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [assignGroupId, setAssignGroupId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const router = useRouter();

  const canManageCourseGroups = hasRoleCapability(role, 'manage_courses');
  const courseId = Number(id);

  const fetchGroups = async (cId: number) => {
    try {
      const data = await getGroupsByCourse(cId);
      setCourseGroups(Array.isArray(data) ? data : []);
    } catch {
        setCourseGroups([]);
    }
  };

  const fetchAvailableGroups = async () => {
    if (!canManageCourseGroups) return;
    try {
      const data = await listGroups();
      setAvailableGroups(Array.isArray(data) ? data : []);
    } catch {
      setAvailableGroups([]);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        await fetchGroups(courseId);
        await fetchAvailableGroups();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId, canManageCourseGroups]);

  const assignedGroupIds = new Set(courseGroups.map((item) => item.groupId ?? item.group?.id));
  const groupOptions = availableGroups.filter((group) => !assignedGroupIds.has(group.id));

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#2563eb]" size={40} /></div>;

  if (!course) return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-xl font-black text-gray-400 uppercase tracking-widest">Kurs topilmadi</h1>
      <button onClick={() => router.back()} className="mt-4 text-[#2563eb] font-black text-sm uppercase tracking-widest">Orqaga qaytish</button>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="relative mb-8 pt-6">
        <button onClick={() => router.back()} className="absolute top-6 left-2 p-3 rounded-2xl bg-white/80 backdrop-blur-md text-gray-500 shadow-sm border border-gray-100 active:scale-90 transition-all z-10">
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="w-full h-64 bg-gray-50 rounded-[48px] overflow-hidden relative shadow-sm border border-gray-100 group">
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent group-hover:opacity-60 transition-opacity" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Book size={80} className="text-[#2563eb]/20 transform group-hover:scale-110 transition-transform" strokeWidth={1} />
           </div>
           <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                 <span className="text-[10px] font-black text-white bg-[#2563eb] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#2563eb]/30">{course.level || 'A1'}</span>
                 <span className="text-[10px] font-black text-[#1d4ed8] bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Online Kurs</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight px-2">{course.title}</h1>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-[#2563eb]/30 transition-all">
            <div className="p-3 rounded-2xl bg-blue-50 text-[#2563eb] group-hover:rotate-12 transition-transform">
               <Zap size={20} strokeWidth={2.5} />
            </div>
               <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Vazifalar</p>
                  <p className="text-sm font-black text-gray-900 leading-none mt-1">{(course._count?.tasks || 0) + (course._count?.tests || 0)} ta</p>
               </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-[#2563eb]/30 transition-all">
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
             <span className="text-[10px] font-black text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-md uppercase">4 qism</span>
          </div>
          <div className="flex flex-col gap-3">
             {[
               { icon: PlayCircle, title: "Video va Audio darslik", desc: "Interaktiv tushuntirishlar", color: "text-[#2563eb]", bg: "bg-blue-50" },
               { icon: Book, title: "O'qish materiallari", desc: "Kitoblar va PDF darsliklar", color: "text-blue-500", bg: "bg-blue-50" },
               { icon: ListTodo, title: "Interaktiv vazifalar", desc: "Bilimingizni mustahkamlash", color: "text-amber-500", bg: "bg-amber-50" },
               { icon: Trophy, title: "Final Exam", desc: "Sertifikat uchun imtihon", color: "text-purple-500", bg: "bg-purple-50" },
             ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center gap-5 group hover:bg-gray-50 transition-all cursor-pointer shadow-sm shadow-blue-900/5">
                   <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-all group-hover:scale-95 group-hover:rotate-6`}>
                      <item.icon size={24} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-[#111827] text-md tracking-tight leading-none mb-1 text-sm">{item.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.desc}</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-200 group-hover:text-[#2563eb] transition-colors" />
                </div>
             ))}
          </div>
        </section>

        <section>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">KURS GURUHLARI</h2>
             <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
               {courseGroups.length} ta
             </span>
          </div>

          {/* Admin: assign new group to this course */}
          {canManageCourseGroups && (
            <div className="mb-4 flex gap-2">
              <select
                value={assignGroupId}
                onChange={(e) => setAssignGroupId(e.target.value)}
                className="flex-1 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-bold text-[var(--app-text)] outline-none transition-all focus:border-[#2563eb]"
              >
                <option value="">Guruh tanlang...</option>
                {groupOptions.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} #{group.id}
                  </option>
                ))}
              </select>
              <button
                disabled={assignLoading || !assignGroupId}
                onClick={async () => {
                  const gid = parseInt(assignGroupId.trim());
                  if (!gid || isNaN(gid)) return;
                  setAssignLoading(true);
                  setAssignError(null);
                  try {
                    await assignCourseToGroup(gid, courseId);
                    setAssignGroupId('');
                    await fetchGroups(courseId);
                    await fetchAvailableGroups();
                  } catch (err: any) {
                    setAssignError(err?.response?.data?.message || "Guruh biriktirib bo'lmadi");
                  } finally {
                    setAssignLoading(false);
                  }
                }}
                className="shrink-0 rounded-[18px] bg-[#2563eb] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {assignLoading ? '...' : '+ Biriktir'}
              </button>
            </div>
          )}

          {assignError && (
            <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
              {assignError}
            </div>
          )}

          {courseGroups.length === 0 ? (
             <div className="rounded-[40px] border border-dashed border-gray-100 bg-gradient-to-br from-[#eff6ff] via-[#f8fbff] to-white p-10 text-center">
                 <h3 className="text-xl font-black tracking-tight leading-tight mb-2 text-gray-800">Guruhlar mavjud emas</h3>
                 <p className="text-sm font-bold text-gray-400 max-w-[200px] mx-auto">
                   Hozircha bu kursga hech qanday guruh biriktirilmagan.
                 </p>
             </div>
          ) : (
             <div className="flex flex-col gap-3">
                {courseGroups.map((gCourse: any, index: number) => {
                  const group = gCourse.group;
                  return (
                     <div key={gCourse.id ?? index} className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center justify-between group hover:border-[#2563eb]/20 transition-all shadow-sm shadow-blue-900/5">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-blue-50 text-[var(--app-primary)] text-lg font-black transition-transform group-hover:scale-110">
                              {group?.name?.charAt(0) || 'G'}
                           </div>
                           <div className="min-w-0">
                              <h4 className="font-extrabold text-[#111827] text-base tracking-tight leading-none mb-1 truncate">
                                {group?.name || 'Noma\'lum guruh'}
                              </h4>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                {group?.inviteCode || '—'}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Remove from course (admin only) */}
                          {canManageCourseGroups && (
                            <button
                              onClick={async () => {
                                if (!confirm('Bu guruhni kursdan olib tashlamoqchimisiz?')) return;
                                try {
                                  await removeGroupCourse(gCourse.id);
                                  setCourseGroups((prev) => prev.filter((_, i) => i !== index));
                                  await fetchAvailableGroups();
                                } catch (err: any) {
                                  setAssignError(err?.response?.data?.message || "O'chirib bo'lmadi");
                                }
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-90"
                              title="Kursdan olib tashlash"
                            >
                              ✕
                            </button>
                          )}
                          {/* Navigate to group */}
                          <button
                             onClick={() => router.push(`/groups/${group?.id}`)}
                             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-[#2563eb] group-hover:text-white transition-all active:scale-95"
                          >
                             <ChevronRight size={18} strokeWidth={3} />
                          </button>
                        </div>
                     </div>
                  );
                })}
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
