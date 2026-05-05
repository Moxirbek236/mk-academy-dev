'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ClipboardList, Edit3, Loader2, RefreshCcw, Search, Trash2 } from 'lucide-react';
import {
  deleteGroupAssignment,
  getGroupAssignmentById,
  getGroupCourseById,
  getGroupMembersViaGroup,
  getGroupsByTeacherId,
  listGroupAssignments,
  updateGroupAssignment,
} from '@/lib/backend-api';
import { PageErrorState, PageLoadingState, PageShell } from '@/app/components/ui/PagePrimitives';

type AnyRecord = Record<string, any>;

const inputClass =
  'w-full border border-[var(--app-border)] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-primary)]';
const buttonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-primary)] bg-[var(--app-primary)] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95 disabled:opacity-60';
const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-border)] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-colors hover:bg-[var(--app-secondary)] disabled:opacity-60';

function getAssignmentTitle(item: AnyRecord) {
  return item?.task?.title ?? item?.test?.title ?? item?.title ?? `Assignment #${item?.id ?? '-'}`;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AnyRecord[]>([]);
  const [detail, setDetail] = useState<AnyRecord | null>(null);
  const [teacherGroups, setTeacherGroups] = useState<AnyRecord[]>([]);
  const [groupMembers, setGroupMembers] = useState<AnyRecord[]>([]);
  const [groupCourse, setGroupCourse] = useState<AnyRecord | null>(null);
  const [groupName, setGroupName] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupCourseId, setGroupCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadAssignments(filter = groupName) {
    try {
      setLoading(true);
      setError(null);
      setAssignments(await listGroupAssignments(filter));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Assignmentlar yuklanmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssignments('');
  }, []);

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadAssignments(groupName);
  }

  async function loadAssignmentDetail(id: number) {
    try {
      setSaving(true);
      const item = await getGroupAssignmentById(id);
      setDetail(item);
      setAssignmentId(String(id));
      setDueDate(item?.dueDate ? String(item.dueDate).slice(0, 16) : '');
      setIsRequired(Boolean(item?.isRequired));
      setNotice("Assignment detali yuklandi");
    } catch (detailError) {
      setNotice(detailError instanceof Error ? detailError.message : "Assignment detali topilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      await updateGroupAssignment(Number(assignmentId), {
        dueDate: dueDate || null,
        isRequired,
      });
      setAssignments(await listGroupAssignments(groupName));
      setDetail(await getGroupAssignmentById(Number(assignmentId)));
      setNotice("Assignment yangilandi");
    } catch (updateError) {
      setNotice(updateError instanceof Error ? updateError.message : "Assignment yangilanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(id: number) {
    try {
      setSaving(true);
      await deleteGroupAssignment(id);
      setAssignments(await listGroupAssignments(groupName));
      if (Number(assignmentId) === id) {
        setDetail(null);
        setAssignmentId('');
      }
      setNotice("Assignment o'chirildi");
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : "Assignment o'chirilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleTeacherGroups(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setTeacherGroups(await getGroupsByTeacherId(Number(teacherId)));
      setNotice("Teacher guruhlari yuklandi");
    } catch (groupsError) {
      setNotice(groupsError instanceof Error ? groupsError.message : "Teacher guruhlari yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleGroupMembers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setGroupMembers(await getGroupMembersViaGroup(Number(groupId)));
      setNotice("Group memberlari yuklandi");
    } catch (membersError) {
      setNotice(membersError instanceof Error ? membersError.message : "Group memberlari yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleGroupCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setGroupCourse(await getGroupCourseById(Number(groupCourseId)));
      setNotice("Group-course detali yuklandi");
    } catch (courseError) {
      setNotice(courseError instanceof Error ? courseError.message : "Group-course detali yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell title="Biriktirishlar" subtitle="Group assignment boshqaruvi">
        <PageLoadingState title="Assignmentlar yuklanmoqda" description="Group assignment APIlari tekshirilmoqda" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Biriktirishlar" subtitle="Xatolik">
        <PageErrorState title="Assignmentlar yuklanmadi" description={error} retryLabel="Qayta urinish" onRetry={() => void loadAssignments()} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Biriktirishlar"
      subtitle="Group assignment, teacher groups, group members va group-course detali"
      action={
        <button onClick={() => void loadAssignments()} className={ghostButtonClass}>
          <RefreshCcw size={14} />
          Yangilash
        </button>
      }
    >
      {notice ? <div className="mb-4 border border-[var(--app-border)] bg-[var(--app-secondary)] px-4 py-3 text-sm font-bold text-[var(--app-primary)]">{notice}</div> : null}

      <form onSubmit={handleFilter} className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input className={inputClass} value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="groupName bo'yicha qidirish" />
        <button className={buttonClass}><Search size={14} /> Qidirish</button>
      </form>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="app-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-[var(--app-primary)]" />
            <h2 className="text-base font-black text-[var(--app-text)]">Assignment ro'yxati</h2>
          </div>
          <div className="space-y-2">
            {assignments.map((item, index) => (
              <div key={`${item?.id ?? index}`} className="flex items-center justify-between gap-3 border border-[var(--app-border)] bg-white p-3">
                <div className="min-w-0">
                  <p className="truncate font-black text-[var(--app-text)]">{getAssignmentTitle(item)}</p>
                  <p className="text-xs font-semibold text-[var(--app-muted)]">
                    Group: {item?.group?.name ?? item?.groupName ?? item?.groupId ?? '-'} · ID: {item?.id ?? '-'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item?.id ? <button className={ghostButtonClass} onClick={() => void loadAssignmentDetail(Number(item.id))}><Edit3 size={14} /></button> : null}
                  {item?.id ? <button className={ghostButtonClass} onClick={() => void removeAssignment(Number(item.id))}><Trash2 size={14} /></button> : null}
                </div>
              </div>
            ))}
            {!assignments.length ? <p className="text-sm font-semibold text-[var(--app-muted)]">Assignment topilmadi.</p> : null}
          </div>
        </section>

        <section className="space-y-5">
          <form onSubmit={handleUpdateAssignment} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Assignment detali va update</h2>
            <div className="mt-4 grid gap-3">
              <input className={inputClass} type="number" value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} placeholder="assignmentId" required />
              <input className={inputClass} type="datetime-local" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              <label className="flex items-center gap-2 border border-[var(--app-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--app-text)]">
                <input type="checkbox" checked={isRequired} onChange={(event) => setIsRequired(event.target.checked)} />
                Majburiy
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={ghostButtonClass} onClick={() => void loadAssignmentDetail(Number(assignmentId))} disabled={!assignmentId || saving}>Detail</button>
                <button className={buttonClass} disabled={!assignmentId || saving}>{saving ? <Loader2 size={14} className="animate-spin" /> : null} Update</button>
              </div>
            </div>
            {detail ? <pre className="mt-4 max-h-80 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(detail, null, 2)}</pre> : null}
          </form>

          <form onSubmit={handleTeacherGroups} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Teacher guruhlari</h2>
            <div className="mt-4 flex gap-2">
              <input className={inputClass} type="number" value={teacherId} onChange={(event) => setTeacherId(event.target.value)} placeholder="teacherId" required />
              <button className={buttonClass} disabled={saving}>Yuklash</button>
            </div>
            {teacherGroups.length ? <pre className="mt-4 max-h-64 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(teacherGroups, null, 2)}</pre> : null}
          </form>

          <form onSubmit={handleGroupMembers} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Group members duplicate endpoint</h2>
            <div className="mt-4 flex gap-2">
              <input className={inputClass} type="number" value={groupId} onChange={(event) => setGroupId(event.target.value)} placeholder="groupId" required />
              <button className={buttonClass} disabled={saving}>Yuklash</button>
            </div>
            {groupMembers.length ? <pre className="mt-4 max-h-64 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(groupMembers, null, 2)}</pre> : null}
          </form>

          <form onSubmit={handleGroupCourse} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Group-course detali</h2>
            <div className="mt-4 flex gap-2">
              <input className={inputClass} type="number" value={groupCourseId} onChange={(event) => setGroupCourseId(event.target.value)} placeholder="groupCourseId" required />
              <button className={buttonClass} disabled={saving}>Yuklash</button>
            </div>
            {groupCourse ? <pre className="mt-4 max-h-64 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(groupCourse, null, 2)}</pre> : null}
          </form>
        </section>
      </div>
    </PageShell>
  );
}
