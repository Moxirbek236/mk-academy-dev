'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Loader2,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useTests } from '@/hooks/useTests';
import {
  CEFR_LEVELS,
  createQuestion,
  createTest,
  deleteQuestion,
  deleteTest,
  normalizeQuestionOptions,
  type CefrLevel,
  type TestItem,
  type TestPayload,
  type TestQuestionPayload,
  updateQuestion,
  updateTest,
  validateTestPayload,
} from '@/lib/backend-api';
import { hasRoleCapability } from '@/lib/role-access';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageShell,
  RefreshButton,
} from '@/app/components/ui/PagePrimitives';

type QuestionDraft = {
  id?: number;
  type: string;
  inputType: string;
  questionText: string;
  optionsText: string;
  correctAnswer: string;
  explanation: string;
  points: string;
  difficulty: string;
  skill: string;
};

type TestFormState = {
  title: string;
  description: string;
  type: string;
  cefrLevel: CefrLevel | '';
  duration: string;
  passingScore: string;
  courseId: string;
  shuffleQuestions: boolean;
  maxAttempts: string;
  isAdaptive: boolean;
  isPublished: boolean;
  questions: QuestionDraft[];
};

const EMPTY_QUESTION: QuestionDraft = {
  type: 'MCQ',
  inputType: 'OPTIONS',
  questionText: '',
  optionsText: 'A\nB\nC\nD',
  correctAnswer: '',
  explanation: '',
  points: '1',
  difficulty: '1',
  skill: 'GRAMMAR',
};

const EMPTY_FORM: TestFormState = {
  title: '',
  description: '',
  type: 'PRACTICE',
  cefrLevel: '',
  duration: '30',
  passingScore: '70',
  courseId: '',
  shuffleQuestions: false,
  maxAttempts: '3',
  isAdaptive: false,
  isPublished: false,
  questions: [{ ...EMPTY_QUESTION }],
};

function parseOptions(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toQuestionPayload(question: QuestionDraft): TestQuestionPayload {
  const options = parseOptions(question.optionsText);

  return {
    type: question.type.trim() || 'MCQ',
    inputType: question.inputType.trim() || 'OPTIONS',
    questionText: question.questionText.trim(),
    options,
    correctAnswer: question.correctAnswer.trim(),
    explanation: question.explanation.trim() || undefined,
    points: Number(question.points || 1),
    difficulty: Number(question.difficulty || 1),
    skill: question.skill.trim() || undefined,
  };
}

function toTestPayload(form: TestFormState): TestPayload {
  const courseId = Number(form.courseId);
  const maxAttempts = Number(form.maxAttempts);

  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    type: form.type.trim() || 'PRACTICE',
    cefrLevel: form.cefrLevel,
    duration: Number(form.duration || 0),
    timeLimitMinutes: Number(form.duration || 0),
    passingScore: Number(form.passingScore || 0),
    courseId: Number.isFinite(courseId) && courseId > 0 ? courseId : null,
    shuffleQuestions: form.shuffleQuestions,
    maxAttempts: Number.isFinite(maxAttempts) && maxAttempts > 0 ? maxAttempts : null,
    isAdaptive: form.isAdaptive,
    isPublished: form.isPublished,
    questions: form.questions.map(toQuestionPayload),
  };
}

function toFormState(test: TestItem): TestFormState {
  const duration = test.timeLimitMinutes ?? test.timeLimit ?? test.duration ?? 30;

  return {
    title: test.title || '',
    description: test.description || '',
    type: test.type || 'PRACTICE',
    cefrLevel: (test.cefrLevel || '') as CefrLevel | '',
    duration: String(duration),
    passingScore: String(test.passingScore ?? 70),
    courseId: test.courseId ? String(test.courseId) : '',
    shuffleQuestions: Boolean(test.shuffleQuestions),
    maxAttempts: test.maxAttempts ? String(test.maxAttempts) : '',
    isAdaptive: Boolean(test.isAdaptive),
    isPublished: Boolean(test.isPublished),
    questions:
      test.questions && test.questions.length > 0
        ? test.questions.map((question) => ({
            id: question.id,
            type: question.type || 'MCQ',
            inputType: question.inputType || 'OPTIONS',
            questionText: question.questionText || '',
            optionsText: normalizeQuestionOptions(question.options).join('\n') || 'A\nB\nC\nD',
            correctAnswer:
              typeof question.correctAnswer === 'string'
                ? question.correctAnswer
                : question.correctAnswer === undefined || question.correctAnswer === null
                  ? ''
                  : String(question.correctAnswer),
            explanation: question.explanation || '',
            points: String(question.points || 1),
            difficulty: String(question.difficulty || 1),
            skill: question.skill || '',
          }))
        : [{ ...EMPTY_QUESTION }],
  };
}

function getReadableError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function TestsPage() {
  const router = useRouter();
  const { role, loading: authLoading } = useAuth();
  const canManageTests = hasRoleCapability(role, 'manage_tests');
  const [search, setSearch] = useState('');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel | ''>('');
  const [publishedFilter, setPublishedFilter] = useState<boolean | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [form, setForm] = useState<TestFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      search,
      cefrLevel,
      isPublished: canManageTests ? publishedFilter : true,
      page: 1,
      limit: 50,
    }),
    [canManageTests, cefrLevel, publishedFilter, search],
  );

  const { data, loading, error, refetch } = useTests(query, !authLoading);
  const { data: coursesData } = useCourses({ page: 1, limit: 100 }, canManageTests);
  const tests = data.items || [];
  const courses = coursesData.items || [];

  function openCreateModal() {
    setEditingTest(null);
    setForm({ ...EMPTY_FORM, questions: [{ ...EMPTY_QUESTION }] });
    setMutationError(null);
    setIsFormOpen(true);
  }

  function openEditModal(test: TestItem) {
    setEditingTest(test);
    setForm(toFormState(test));
    setMutationError(null);
    setIsFormOpen(true);
  }

  function updateQuestionDraft(index: number, patch: Partial<QuestionDraft>) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question,
      ),
    }));
  }

  function addQuestionDraft() {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, { ...EMPTY_QUESTION }],
    }));
  }

  function removeQuestionDraft(index: number) {
    setForm((current) => ({
      ...current,
      questions: current.questions.filter((_, questionIndex) => questionIndex !== index),
    }));
  }

  async function syncQuestions(testId: number, original: TestItem, drafts: QuestionDraft[]) {
    const keptIds = new Set(drafts.map((question) => question.id).filter(Boolean));
    const removedQuestions = (original.questions || []).filter((question) => !keptIds.has(question.id));

    for (const question of removedQuestions) {
      await deleteQuestion(question.id);
    }

    for (const draft of drafts) {
      const payload = toQuestionPayload(draft);
      if (draft.id) {
        await updateQuestion(draft.id, payload);
      } else {
        await createQuestion(testId, payload);
      }
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setMutationError(null);

      const payload = toTestPayload(form);
      const errors = validateTestPayload(payload);
      if (!payload.questions?.length) errors.push('Kamida bitta savol kiritilishi kerak');
      if (errors.length) {
        setMutationError(errors.join('\n'));
        return;
      }

      if (editingTest) {
        const { questions: _questions, ...testFields } = payload;
        await updateTest(editingTest.id, testFields);
        await syncQuestions(editingTest.id, editingTest, form.questions);
      } else {
        await createTest(payload);
      }

      setIsFormOpen(false);
      setEditingTest(null);
      setForm({ ...EMPTY_FORM, questions: [{ ...EMPTY_QUESTION }] });
      await refetch();
    } catch (saveError) {
      setMutationError(getReadableError(saveError, "Testni saqlab bo'lmadi"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setMutationError(null);
      await deleteTest(id);
      await refetch();
    } catch (deleteError) {
      setMutationError(getReadableError(deleteError, "Testni o'chirib bo'lmadi"));
    }
  }

  return (
    <PageShell
      title="Testlar"
      subtitle={`Jami: ${data.meta?.total || tests.length} ta`}
      action={
        <div className="flex items-center gap-2">
          <RefreshButton onRefresh={refetch} disabled={loading} />
          {canManageTests ? (
            <button
              onClick={openCreateModal}
              className="rounded-[16px] bg-[var(--app-primary)] p-3 text-white shadow-lg shadow-black/10 transition-transform active:scale-95"
            >
              <PlusCircle size={20} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      }
    >
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_170px]">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Testlarni qidirish..."
            className="w-full rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--app-text)] shadow-sm transition-all focus:border-[var(--app-primary)] focus:outline-none"
          />
        </div>

        <select
          value={cefrLevel}
          onChange={(event) => setCefrLevel(event.target.value as CefrLevel | '')}
          className="rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3.5 text-sm font-semibold text-[var(--app-text)] shadow-sm focus:border-[var(--app-primary)] focus:outline-none"
        >
          <option value="">Barcha level</option>
          {CEFR_LEVELS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {canManageTests ? (
          <select
            value={publishedFilter === '' ? '' : String(publishedFilter)}
            onChange={(event) =>
              setPublishedFilter(event.target.value === '' ? '' : event.target.value === 'true')
            }
            className="rounded-[18px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3.5 text-sm font-semibold text-[var(--app-text)] shadow-sm focus:border-[var(--app-primary)] focus:outline-none"
          >
            <option value="">Barcha holat</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      {mutationError ? (
        <div className="mb-4 whitespace-pre-line rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {mutationError}
        </div>
      ) : null}

      {loading ? (
        <PageLoadingState title="Testlar yuklanmoqda" description="Backenddagi testlar ro'yxati olinmoqda" />
      ) : error ? (
        <PageErrorState
          title="Testlarni olishda xatolik"
          description={error}
          retryLabel="Qayta urinish"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : tests.length === 0 ? (
        <PageEmptyState title="Testlar topilmadi" description="Hozircha sizga tegishli testlar mavjud emas." />
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20 xl:grid-cols-2">
          {tests.map((test) => {
            const questionCount = test._count?.questions ?? test.questions?.length ?? 0;
            const duration = test.timeLimitMinutes ?? test.timeLimit ?? test.duration ?? 0;

            return (
              <div key={test.id} className="app-card flex flex-col gap-4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[var(--app-surface-soft)] text-[var(--app-primary)]">
                    <ClipboardCheck size={22} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-extrabold tracking-tight text-[var(--app-text)]">
                      {test.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--app-muted)]">
                      {test.description || "Tavsif kiritilmagan."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[var(--app-surface-soft)] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {test.type || 'PRACTICE'}
                  </span>
                  {test.cefrLevel ? (
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-blue-700">
                      {test.cefrLevel}
                    </span>
                  ) : null}
                  <span className="rounded-md bg-[var(--app-surface-soft)] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {questionCount} savol
                  </span>
                  <span className="rounded-md bg-[var(--app-surface-soft)] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                    {duration || '-'} daqiqa
                  </span>
                  <span
                    className={`rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                      test.isPublished ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {test.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className={`grid gap-2 ${canManageTests ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  <button
                    onClick={() => router.push(`/tests/${test.id}`)}
                    className="flex items-center justify-center gap-2 rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--app-text)] transition-transform active:scale-95"
                  >
                    <Eye size={14} />
                    Ochish
                  </button>

                  {canManageTests ? (
                    <>
                      <button
                        onClick={() => openEditModal(test)}
                        className="flex items-center justify-center gap-2 rounded-[14px] bg-amber-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                      >
                        <Pencil size={14} />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => void handleDelete(test.id)}
                        className="flex items-center justify-center gap-2 rounded-[14px] bg-red-500 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95"
                      >
                        <Trash2 size={14} />
                        O'chirish
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/45 px-3 py-6 sm:px-4">
          <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-2xl sm:rounded-[28px] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[var(--app-text)]">
                  {editingTest ? 'Testni tahrirlash' : 'Yangi test yaratish'}
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">
                  Test va savollar backend validatsiyasiga mos tekshiriladi
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTest(null);
                }}
                className="rounded-[14px] bg-[var(--app-surface-soft)] p-3 text-[var(--app-muted)]"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Test nomi"
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <input
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                placeholder="PRACTICE / EXAM"
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <select
                value={form.cefrLevel}
                onChange={(event) => setForm((current) => ({ ...current, cefrLevel: event.target.value as CefrLevel | '' }))}
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              >
                <option value="">CEFR level</option>
                {CEFR_LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={form.courseId}
                onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              >
                <option value="">Kurs tanlanmagan</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                placeholder="Davomiylik, daqiqa"
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={form.passingScore}
                onChange={(event) => setForm((current) => ({ ...current, passingScore: event.target.value }))}
                placeholder="O'tish foizi"
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <input
                type="number"
                min={1}
                value={form.maxAttempts}
                onChange={(event) => setForm((current) => ({ ...current, maxAttempts: event.target.value }))}
                placeholder="Urinishlar soni"
                className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Test tavsifi"
                className="min-h-24 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold md:col-span-2"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-[16px] border border-[var(--app-border)] px-4 py-3 text-sm font-bold text-[var(--app-text)]">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                />
                Published
              </label>
              <label className="flex items-center gap-3 rounded-[16px] border border-[var(--app-border)] px-4 py-3 text-sm font-bold text-[var(--app-text)]">
                <input
                  type="checkbox"
                  checked={form.shuffleQuestions}
                  onChange={(event) => setForm((current) => ({ ...current, shuffleQuestions: event.target.checked }))}
                />
                Shuffle
              </label>
              <label className="flex items-center gap-3 rounded-[16px] border border-[var(--app-border)] px-4 py-3 text-sm font-bold text-[var(--app-text)]">
                <input
                  type="checkbox"
                  checked={form.isAdaptive}
                  onChange={(event) => setForm((current) => ({ ...current, isAdaptive: event.target.checked }))}
                />
                Adaptive
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--app-muted)]">Savollar</h4>
              <button
                onClick={addQuestionDraft}
                className="rounded-[14px] bg-[var(--app-primary)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Savol qo'shish
              </button>
            </div>

            <div className="mt-3 space-y-4">
              {form.questions.map((question, index) => (
                <div key={`${question.id || 'new'}-${index}`} className="rounded-[18px] border border-[var(--app-border)] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[var(--app-text)]">{index + 1}-savol</p>
                    <button
                      onClick={() => removeQuestionDraft(index)}
                      disabled={form.questions.length === 1}
                      className="rounded-[12px] bg-red-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 disabled:opacity-40"
                    >
                      O'chirish
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                      value={question.questionText}
                      onChange={(event) => updateQuestionDraft(index, { questionText: event.target.value })}
                      placeholder="Savol matni"
                      className="min-h-24 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold md:col-span-2"
                    />
                    <input
                      value={question.type}
                      onChange={(event) => updateQuestionDraft(index, { type: event.target.value })}
                      placeholder="MCQ"
                      className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                    />
                    <input
                      value={question.inputType}
                      onChange={(event) => updateQuestionDraft(index, { inputType: event.target.value })}
                      placeholder="OPTIONS"
                      className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                    />
                    <textarea
                      value={question.optionsText}
                      onChange={(event) => updateQuestionDraft(index, { optionsText: event.target.value })}
                      placeholder="Har bir variantni alohida qatorga yozing"
                      className="min-h-28 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                    />
                    <div className="space-y-3">
                      <input
                        value={question.correctAnswer}
                        onChange={(event) => updateQuestionDraft(index, { correctAnswer: event.target.value })}
                        placeholder="To'g'ri javob"
                        className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                      />
                      <input
                        value={question.skill}
                        onChange={(event) => updateQuestionDraft(index, { skill: event.target.value })}
                        placeholder="Skill"
                        className="w-full rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min={1}
                          value={question.points}
                          onChange={(event) => updateQuestionDraft(index, { points: event.target.value })}
                          placeholder="Ball"
                          className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                        />
                        <input
                          type="number"
                          min={1}
                          value={question.difficulty}
                          onChange={(event) => updateQuestionDraft(index, { difficulty: event.target.value })}
                          placeholder="Qiyinlik"
                          className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold"
                        />
                      </div>
                    </div>
                    <textarea
                      value={question.explanation}
                      onChange={(event) => updateQuestionDraft(index, { explanation: event.target.value })}
                      placeholder="Izoh"
                      className="min-h-20 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm font-semibold md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTest(null);
                }}
                className="flex-1 rounded-[16px] border border-[var(--app-border)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--app-muted)]"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[var(--app-primary)] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-60"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Saqlash
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
