'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  addGroupMember,
  assignCourseToGroup,
  getCoursesByGroup,
  getGroupById,
  getGroupMembers,
  listCourses,
  listUsers,
  removeGroupCourse,
  removeGroupMember,
} from '@/lib/backend-api';
import {
  ChevronLeft,
  PlusCircle,
  Users,
  ClipboardList,
  FileText,
  GraduationCap,
  Phone,
  Loader2,
  UserCircle2,
  AlertCircle,
  UserPlus,
  UserMinus,
  RefreshCw,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

export default function GroupDetailClient() {
  const router = useRouter();
  const { id } = useParams();
  const { role } = useAuth();

  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Add student modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentOptions, setStudentOptions] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Courses state
  const [courses, setCourses] = useState<any[]>([]);
  const [courseOptions, setCourseOptions] = useState<any[]>([]);
  const [assignCourseId, setAssignCourseId] = useState('');
  const [assignCourseLoading, setAssignCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  const isAdmin = role === 'admin' || role === 'superadmin';
  const groupId = Number(id);

  const fetchMembers = useCallback(async () => {
    if (!groupId) return;
    setMembersLoading(true);
    try {
      const data = await getGroupMembers(groupId);
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      // members not critical — group already has members from findOne
    } finally {
      setMembersLoading(false);
    }
  }, [groupId]);

  const fetchCourses = useCallback(async () => {
    if (!groupId) return;
    try {
      const data = await getCoursesByGroup(groupId);
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  }, [groupId]);

  const fetchCourseOptions = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await listCourses({ limit: 100 });
      setCourseOptions(Array.isArray(data.items) ? data.items : []);
    } catch {
      setCourseOptions([]);
    }
  }, [isAdmin]);

  const fetchStudentOptions = useCallback(async () => {
    if (!isAdmin) return;
    setStudentsLoading(true);
    try {
      const data = await listUsers(role, { user: 'STUDENT', page: 1, limit: 100 }, 'role-specific');
      setStudentOptions(Array.isArray(data) ? data : []);
    } catch {
      setStudentOptions([]);
    } finally {
      setStudentsLoading(false);
    }
  }, [isAdmin, role]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const data = await getGroupById(groupId);
        setGroup(data);
        // Use members from group if available, else fetch separately
        if (data?.members?.length > 0) {
          setMembers(data.members);
        } else {
          await fetchMembers();
        }
        await fetchCourses();
        await fetchCourseOptions();
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Guruh ma'lumotlarini olishda xatolik"
        );
      } finally {
        setLoading(false);
      }
    };
    if (groupId) fetchGroup();
  }, [groupId, fetchMembers, fetchCourses, fetchCourseOptions]);

  useEffect(() => {
    if (showAddModal) {
      void fetchStudentOptions();
    }
  }, [fetchStudentOptions, showAddModal]);

  const handleAddMember = async () => {
    const sid = parseInt(studentIdInput.trim());
    if (!sid || isNaN(sid)) {
      setActionError("To'g'ri student ID kiriting");
      return;
    }
    setAddLoading(true);
    setActionError(null);
    try {
      await addGroupMember(groupId, sid);
      setShowAddModal(false);
      setStudentIdInput('');
      await fetchMembers();
      await fetchStudentOptions();
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "O'quvchini qo'shib bo'lmadi");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveMember = async (studentId: number, name: string) => {
    if (!confirm(`"${name}" ni guruhdan chiqarishni tasdiqlaysizmi?`)) return;
    setActionError(null);
    try {
      await removeGroupMember(groupId, studentId);
      setMembers((prev) => prev.filter((m) => m.studentId !== studentId && m.student?.id !== studentId));
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "O'quvchini chiqarib bo'lmadi");
    }
  };

  const handleAssignCourse = async () => {
    const courseId = Number(assignCourseId);

    if (!courseId || Number.isNaN(courseId)) {
      setCourseError("Kurs tanlang");
      return;
    }

    setAssignCourseLoading(true);
    setCourseError(null);

    try {
      await assignCourseToGroup(groupId, courseId);
      setAssignCourseId('');
      await fetchCourses();
      await fetchCourseOptions();
    } catch (err: any) {
      setCourseError(err?.response?.data?.message || "Kursni guruhga biriktirib bo'lmadi");
    } finally {
      setAssignCourseLoading(false);
    }
  };

  const assignedCourseIds = new Set(courses.map((item) => item.courseId ?? item.course?.id));
  const courseSelectOptions = courseOptions.filter((course) => !assignedCourseIds.has(course.id));
  const activeStudentIds = new Set(members.map((member) => member.studentId ?? member.student?.id ?? member.id));
  const studentSelectOptions = studentOptions.filter((student) => !activeStudentIds.has(student.id));

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[var(--app-primary)]" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-[var(--app-muted)]">Yuklanmoqda...</p>
      </div>
    );
  }

  // ── Error ──
  if (error || !group) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-[24px] bg-red-50 p-5 text-red-400">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-base font-black text-[var(--app-text)]">Xatolik yuz berdi</h2>
        <p className="max-w-xs text-sm font-bold text-[var(--app-muted)]">{error || 'Guruh topilmadi'}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 rounded-2xl bg-[var(--app-primary)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  const memberCount = members.length || group._count?.members || 0;
  const avatarColors = [
    'from-blue-500 to-blue-400',
    'from-emerald-500 to-teal-400',
    'from-violet-500 to-purple-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
  ];

  return (
    <div className="pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-bg)]/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="app-touch shrink-0 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-sm transition-all active:scale-90"
          >
            <ChevronLeft size={20} className="text-[var(--app-text)]" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black uppercase tracking-tight text-[var(--app-text)]">
              {group.name}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)]">
              {memberCount} o'quvchi
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-[var(--app-primary)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)]">
            {group.inviteCode}
          </span>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 space-y-8">

        {/* ── Action Error ── */}
        {actionError && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {actionError}
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="app-card flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-blue-50 p-3 text-[#2563eb]">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">O'quvchilar</p>
              <p className="text-2xl font-black tracking-tighter text-[var(--app-text)]">{memberCount}</p>
            </div>
          </div>
          <div className="app-card flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">O'qituvchi</p>
              <p className="text-sm font-black leading-tight tracking-tight text-[var(--app-text)]">
                {group.teacher?.fullName?.split(' ')[0] || "Noma'lum"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Task / Exam Biriktirish ── */}
        <div>
          <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
            Vazifa &amp; Imtihonlar
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="group app-touch flex flex-1 items-center gap-4 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-95">
              <div className="rounded-[18px] bg-blue-50 p-3 text-[#2563eb] transition-transform group-hover:scale-110 group-hover:rotate-3">
                <FileText size={24} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-gray-400">YANGI VAZIFA</p>
                <p className="truncate text-sm font-black text-[var(--app-text)]">Task biriktirish</p>
              </div>
              <PlusCircle size={20} className="shrink-0 text-gray-300 transition-colors group-hover:text-[#2563eb]" />
            </button>

            <button className="group app-touch flex flex-1 items-center gap-4 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md active:scale-95">
              <div className="rounded-[18px] bg-amber-50 p-3 text-amber-500 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                <ClipboardList size={24} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-gray-400">YANGI IMTIHON</p>
                <p className="truncate text-sm font-black text-[var(--app-text)]">Exam belgilash</p>
              </div>
              <PlusCircle size={20} className="shrink-0 text-gray-300 transition-colors group-hover:text-amber-500" />
            </button>
          </div>
        </div>

        {/* ── Guruhga biriktirilgan Kurslar ── */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
              <BookOpen size={14} className="text-[var(--app-primary)]" />
              Kurslar
            </h2>
            <span className="rounded-xl bg-[var(--app-surface-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-primary)]">
              {courses.length} ta
            </span>
          </div>

          {isAdmin && (
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <select
                value={assignCourseId}
                onChange={(event) => setAssignCourseId(event.target.value)}
                className="flex-1 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-bold text-[var(--app-text)] outline-none transition-all focus:border-[var(--app-primary)]"
              >
                <option value="">Kurs tanlang...</option>
                {courseSelectOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} #{course.id}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void handleAssignCourse()}
                disabled={assignCourseLoading || !assignCourseId}
                className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[var(--app-primary)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-60"
              >
                {assignCourseLoading ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                Biriktirish
              </button>
            </div>
          )}

          {courseError ? (
            <div className="mb-4 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {courseError}
            </div>
          ) : null}

          {courses.length === 0 ? (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[var(--app-border)] p-8 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--app-surface-soft)] text-[var(--app-muted)]">
                <BookOpen size={24} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-black text-[var(--app-text)]">Kurslar yo'q</p>
              <p className="mt-1 max-w-[180px] text-xs font-bold text-[var(--app-muted)]">
                Bu guruhga hozircha kurs biriktirilmagan.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {courses.map((gCourse: any, idx: number) => {
                const course = gCourse.course;
                return (
                  <div
                    key={gCourse.id ?? idx}
                    className="group flex items-center gap-4 rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm transition-all hover:border-[var(--app-primary)]/30 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-blue-50 text-[#2563eb] text-lg font-black transition-transform group-hover:scale-110">
                      {course?.title?.charAt(0) || 'K'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black tracking-tight text-[var(--app-text)]">
                        {course?.title || "Noma'lum kurs"}
                      </h3>
                      <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#2563eb]">
                        {course?.level || 'A1'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={async () => {
                            if (!confirm('Bu kursni guruhdan olib tashlamoqchimisiz?')) return;
                            try {
                              await removeGroupCourse(gCourse.id);
                              setCourses((prev) => prev.filter((_, i) => i !== idx));
                              await fetchCourseOptions();
                            } catch (err: any) {
                              setActionError(err?.response?.data?.message || "O'chirib bo'lmadi");
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-90"
                          title="Kursni guruhdan olib tashlash"
                        >
                          ✕
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/courses/${course?.id}`)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all group-hover:bg-[#2563eb] group-hover:text-white active:scale-95"
                      >
                        <ChevronRight size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Members ── */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--app-muted)]">
              <Users size={14} className="text-[var(--app-primary)]" />
              Guruh a'zolari
              {membersLoading && <Loader2 size={12} className="animate-spin" />}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchMembers()}
                className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-2 text-[var(--app-muted)] transition-all hover:text-[var(--app-primary)] active:scale-90"
                title="Yangilash"
              >
                <RefreshCw size={14} strokeWidth={2.5} />
              </button>
              {isAdmin && (
                <button
                  onClick={() => { setShowAddModal(true); setActionError(null); }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--app-primary)] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                >
                  <UserPlus size={13} />
                  Qo'shish
                </button>
              )}
            </div>
          </div>

          {members.length === 0 ? (
            <div className="flex flex-col items-center rounded-[32px] border border-dashed border-[var(--app-border)] p-12 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--app-surface-soft)] text-[var(--app-muted)]">
                <UserCircle2 size={36} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-black text-[var(--app-text)]">O'quvchilar yo'q</p>
              <p className="mt-1 max-w-[200px] text-xs font-bold text-[var(--app-muted)]">
                Bu guruhda hozircha o'quvchilar mavjud emas.
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--app-primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
                >
                  <UserPlus size={14} />
                  O'quvchi qo'shish
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {members.map((member: any, idx: number) => {
                const student = member.student ?? member;
                const name = student?.fullName ?? student?.full_name ?? "Noma'lum o'quvchi";
                const phone = student?.phone ?? '—';
                const level = student?.cefrLevel ?? student?.cefr_level ?? null;
                const sid = student?.id ?? member.studentId;
                const initial = name.charAt(0).toUpperCase();
                const color = avatarColors[idx % avatarColors.length];

                return (
                  <div
                    key={member.id ?? idx}
                    className="group flex items-center gap-4 rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm transition-all hover:border-[var(--app-primary)]/30 hover:shadow-md"
                  >
                    {/* Avatar */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-tr ${color} text-base font-black text-white shadow-inner`}>
                      {initial}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black tracking-tight text-[var(--app-text)]">{name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[var(--app-muted)]">
                        <Phone size={10} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold tracking-wide">{phone}</span>
                      </div>
                    </div>

                    {/* Badges + remove */}
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {level && (
                        <span className="rounded-lg bg-[var(--app-primary)]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-primary)]">
                          {level}
                        </span>
                      )}
                      {isAdmin ? (
                        <button
                          onClick={() => handleRemoveMember(sid, name)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-90"
                          title="Guruhdan chiqarish"
                        >
                          <UserMinus size={12} />
                        </button>
                      ) : (
                        <span className="rounded-lg bg-[var(--app-surface-soft)] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                          Faol
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 rounded-t-[40px] bg-[var(--app-bg)] p-6 pb-safe shadow-2xl sm:rounded-[40px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-black uppercase tracking-tight text-[var(--app-text)]">
                O'quvchi qo'shish
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setActionError(null); setStudentIdInput(''); }}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-2.5 text-[var(--app-muted)] transition-all active:scale-90"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                {actionError}
              </div>
            )}

            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
              O'quvchi
            </label>
            <select
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="mb-5 w-full rounded-[20px] border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 text-sm font-bold text-[var(--app-text)] shadow-sm outline-none transition-all focus:border-[var(--app-primary)]"
            >
              <option value="">{studentsLoading ? 'Oquvchilar yuklanmoqda...' : "O'quvchi tanlang..."}</option>
              {studentSelectOptions.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} #{student.id}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddMember}
              disabled={addLoading || !studentIdInput}
              className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[var(--app-primary)] py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            >
              {addLoading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {addLoading ? 'Qo\'shilmoqda...' : 'Guruhga qo\'shish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
