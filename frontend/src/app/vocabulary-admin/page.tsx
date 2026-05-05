'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BookOpen, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react';
import {
  addWordListItem,
  createVocabulary,
  createWordList,
  deleteVocabulary,
  deleteWordList,
  getDueVocabularyReviews,
  getVocabularyById,
  getVocabularyProgressById,
  getVocabularyProgressByStudent,
  getWordListById,
  listVocabularies,
  listWordListItems,
  listWordLists,
  removeWordListItem,
  updateVocabulary,
  updateWordList,
  type VocabularyPayload,
  type WordListPayload,
} from '@/lib/backend-api';
import { PageErrorState, PageLoadingState, PageShell } from '@/app/components/ui/PagePrimitives';

type AnyRecord = Record<string, any>;

const inputClass =
  'w-full border border-[var(--app-border)] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-primary)]';
const buttonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-primary)] bg-[var(--app-primary)] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-transform active:scale-95 disabled:opacity-60';
const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--app-border)] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--app-primary)] transition-colors hover:bg-[var(--app-secondary)] disabled:opacity-60';

const emptyVocabularyForm = {
  word: '',
  translation: '',
  exampleSentence: '',
  difficulty: '1',
  courseId: '',
};

const emptyWordListForm = {
  title: '',
  name: '',
  studentId: '',
  description: '',
  isPublic: false,
};

function toNumberOrNull(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && value !== '' ? numberValue : null;
}

function getItemTitle(item: AnyRecord) {
  return item?.title ?? item?.name ?? item?.word ?? item?.vocabulary?.word ?? `#${item?.id ?? '-'}`;
}

export default function VocabularyAdminPage() {
  const [vocabularies, setVocabularies] = useState<AnyRecord[]>([]);
  const [wordLists, setWordLists] = useState<AnyRecord[]>([]);
  const [wordListItems, setWordListItems] = useState<AnyRecord[]>([]);
  const [dueReviews, setDueReviews] = useState<AnyRecord[]>([]);
  const [studentProgress, setStudentProgress] = useState<AnyRecord[]>([]);
  const [progressDetail, setProgressDetail] = useState<AnyRecord | null>(null);
  const [selectedVocabularyId, setSelectedVocabularyId] = useState<number | null>(null);
  const [selectedWordListId, setSelectedWordListId] = useState<number | null>(null);
  const [vocabularyForm, setVocabularyForm] = useState(emptyVocabularyForm);
  const [wordListForm, setWordListForm] = useState(emptyWordListForm);
  const [itemVocabularyId, setItemVocabularyId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [progressId, setProgressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const stats = useMemo(
    () => [
      ['Vocabulary', vocabularies.length],
      ['Word lists', wordLists.length],
      ['List items', wordListItems.length],
      ['Due reviews', dueReviews.length],
    ],
    [dueReviews.length, vocabularies.length, wordListItems.length, wordLists.length],
  );

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const [vocabularyRes, listRes, dueRes] = await Promise.allSettled([
        listVocabularies({ limit: 100 }),
        listWordLists(),
        getDueVocabularyReviews(),
      ]);
      if (vocabularyRes.status === 'fulfilled') setVocabularies(vocabularyRes.value);
      if (listRes.status === 'fulfilled') setWordLists(listRes.value);
      if (dueRes.status === 'fulfilled') setDueReviews(dueRes.value);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Vocabulary ma'lumotlarini yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function buildVocabularyPayload(): VocabularyPayload {
    const courseId = toNumberOrNull(vocabularyForm.courseId);
    return {
      word: vocabularyForm.word,
      translation: vocabularyForm.translation,
      exampleSentence: vocabularyForm.exampleSentence || undefined,
      difficulty: Number(vocabularyForm.difficulty || 1),
      courseId,
    };
  }

  function buildWordListPayload(): WordListPayload {
    const student = toNumberOrNull(wordListForm.studentId);
    return {
      title: wordListForm.title || undefined,
      name: wordListForm.name || undefined,
      description: wordListForm.description || undefined,
      isPublic: wordListForm.isPublic,
      studentId: student ?? undefined,
    };
  }

  async function handleSaveVocabulary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = buildVocabularyPayload();
      if (selectedVocabularyId) {
        await updateVocabulary(selectedVocabularyId, payload);
        setNotice("Vocabulary yangilandi");
      } else {
        await createVocabulary(payload);
        setNotice("Vocabulary yaratildi");
      }
      setVocabularyForm(emptyVocabularyForm);
      setSelectedVocabularyId(null);
      setVocabularies(await listVocabularies({ limit: 100 }));
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : "Vocabulary saqlanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function editVocabulary(id: number) {
    try {
      setSaving(true);
      const item = await getVocabularyById(id);
      setSelectedVocabularyId(id);
      setVocabularyForm({
        word: item?.word ?? '',
        translation: item?.translation ?? '',
        exampleSentence: item?.exampleSentence ?? '',
        difficulty: String(item?.difficulty ?? 1),
        courseId: item?.courseId ? String(item.courseId) : '',
      });
      setNotice("Vocabulary detali yuklandi");
    } catch (editError) {
      setNotice(editError instanceof Error ? editError.message : "Vocabulary topilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function removeVocabulary(id: number) {
    try {
      setSaving(true);
      await deleteVocabulary(id);
      setVocabularies(await listVocabularies({ limit: 100 }));
      setNotice("Vocabulary o'chirildi");
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : "Vocabulary o'chirilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveWordList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = buildWordListPayload();
      if (selectedWordListId) {
        await updateWordList(selectedWordListId, payload);
        setNotice("Word list yangilandi");
      } else {
        await createWordList(payload);
        setNotice("Word list yaratildi");
      }
      setWordListForm(emptyWordListForm);
      setSelectedWordListId(null);
      setWordLists(await listWordLists());
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : "Word list saqlanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function selectWordList(id: number) {
    try {
      setSaving(true);
      const [detail, items] = await Promise.all([getWordListById(id), listWordListItems(id)]);
      setSelectedWordListId(id);
      setWordListForm({
        title: detail?.title ?? '',
        name: detail?.name ?? '',
        studentId: detail?.studentId ? String(detail.studentId) : '',
        description: detail?.description ?? '',
        isPublic: Boolean(detail?.isPublic),
      });
      setWordListItems(items);
      setNotice("Word list detali yuklandi");
    } catch (selectError) {
      setNotice(selectError instanceof Error ? selectError.message : "Word list yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function removeWordList(id: number) {
    try {
      setSaving(true);
      await deleteWordList(id);
      setWordLists(await listWordLists());
      if (selectedWordListId === id) {
        setSelectedWordListId(null);
        setWordListItems([]);
        setWordListForm(emptyWordListForm);
      }
      setNotice("Word list o'chirildi");
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : "Word list o'chirilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedWordListId) return;
    try {
      setSaving(true);
      await addWordListItem(selectedWordListId, { vocabularyId: Number(itemVocabularyId) });
      setWordListItems(await listWordListItems(selectedWordListId));
      setItemVocabularyId('');
      setNotice("So'z listga qo'shildi");
    } catch (addError) {
      setNotice(addError instanceof Error ? addError.message : "So'z qo'shilmadi");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item: AnyRecord) {
    if (!selectedWordListId) return;
    const vocabularyId = Number(item?.vocabularyId ?? item?.vocabulary?.id ?? item?.id);
    try {
      setSaving(true);
      await removeWordListItem(selectedWordListId, vocabularyId);
      setWordListItems(await listWordListItems(selectedWordListId));
      setNotice("So'z listdan olib tashlandi");
    } catch (removeError) {
      setNotice(removeError instanceof Error ? removeError.message : "So'z olib tashlanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function loadStudentProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setStudentProgress(await getVocabularyProgressByStudent(Number(studentId)));
      setNotice("Student progress yuklandi");
    } catch (progressError) {
      setNotice(progressError instanceof Error ? progressError.message : "Student progress yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  async function loadProgressDetail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setProgressDetail(await getVocabularyProgressById(Number(progressId)));
      setNotice("Progress detali yuklandi");
    } catch (progressError) {
      setNotice(progressError instanceof Error ? progressError.message : "Progress detali yuklanmadi");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell title="Vocabulary admin" subtitle="Vocabulary CRUD, word lists va progress">
        <PageLoadingState title="Vocabulary yuklanmoqda" description="Backenddagi lug'at ma'lumotlari olinmoqda" />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Vocabulary admin" subtitle="Xatolik">
        <PageErrorState title="Ma'lumot yuklanmadi" description={error} retryLabel="Qayta urinish" onRetry={() => void loadData()} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Vocabulary admin"
      subtitle="Vocabulary, word-list va vocabulary-progress APIlari"
      action={
        <button onClick={() => void loadData()} className={ghostButtonClass}>
          <RefreshCcw size={14} />
          Yangilash
        </button>
      }
    >
      {notice ? <div className="mb-4 border border-[var(--app-border)] bg-[var(--app-secondary)] px-4 py-3 text-sm font-bold text-[var(--app-primary)]">{notice}</div> : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="app-card p-4">
            <BookOpen size={20} className="text-[var(--app-primary)]" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-[var(--app-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-black text-[var(--app-text)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-5">
          <form onSubmit={handleSaveVocabulary} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">{selectedVocabularyId ? 'Vocabulary tahrirlash' : 'Vocabulary yaratish'}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={inputClass} value={vocabularyForm.word} onChange={(e) => setVocabularyForm({ ...vocabularyForm, word: e.target.value })} placeholder="word" required />
              <input className={inputClass} value={vocabularyForm.translation} onChange={(e) => setVocabularyForm({ ...vocabularyForm, translation: e.target.value })} placeholder="translation" required />
              <input className={inputClass} type="number" value={vocabularyForm.difficulty} onChange={(e) => setVocabularyForm({ ...vocabularyForm, difficulty: e.target.value })} placeholder="difficulty" />
              <input className={inputClass} type="number" value={vocabularyForm.courseId} onChange={(e) => setVocabularyForm({ ...vocabularyForm, courseId: e.target.value })} placeholder="courseId" />
              <textarea className={`${inputClass} min-h-24 md:col-span-2`} value={vocabularyForm.exampleSentence} onChange={(e) => setVocabularyForm({ ...vocabularyForm, exampleSentence: e.target.value })} placeholder="exampleSentence" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={buttonClass} disabled={saving}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Saqlash</button>
              {selectedVocabularyId ? <button type="button" className={ghostButtonClass} onClick={() => { setSelectedVocabularyId(null); setVocabularyForm(emptyVocabularyForm); }}>Bekor qilish</button> : null}
            </div>
          </form>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Vocabulary ro'yxati</h2>
            <div className="mt-4 space-y-2">
              {vocabularies.map((item, index) => (
                <div key={`${item?.id ?? index}`} className="flex items-center justify-between gap-3 border border-[var(--app-border)] bg-white p-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--app-text)]">{item?.word}</p>
                    <p className="text-xs font-semibold text-[var(--app-muted)]">{item?.translation}</p>
                  </div>
                  <div className="flex gap-2">
                    {item?.id ? <button className={ghostButtonClass} onClick={() => void editVocabulary(Number(item.id))}><Edit3 size={14} /></button> : null}
                    {item?.id ? <button className={ghostButtonClass} onClick={() => void removeVocabulary(Number(item.id))}><Trash2 size={14} /></button> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <form onSubmit={handleSaveWordList} className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">{selectedWordListId ? 'Word list tahrirlash' : 'Word list yaratish'}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={inputClass} value={wordListForm.title} onChange={(e) => setWordListForm({ ...wordListForm, title: e.target.value })} placeholder="title" />
              <input className={inputClass} value={wordListForm.name} onChange={(e) => setWordListForm({ ...wordListForm, name: e.target.value })} placeholder="name" />
              <input className={inputClass} type="number" value={wordListForm.studentId} onChange={(e) => setWordListForm({ ...wordListForm, studentId: e.target.value })} placeholder="studentId" />
              <label className="flex items-center gap-2 border border-[var(--app-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--app-text)]">
                <input type="checkbox" checked={wordListForm.isPublic} onChange={(e) => setWordListForm({ ...wordListForm, isPublic: e.target.checked })} />
                Public
              </label>
              <textarea className={`${inputClass} min-h-24 md:col-span-2`} value={wordListForm.description} onChange={(e) => setWordListForm({ ...wordListForm, description: e.target.value })} placeholder="description" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={buttonClass} disabled={saving}>Saqlash</button>
              {selectedWordListId ? <button type="button" className={ghostButtonClass} onClick={() => { setSelectedWordListId(null); setWordListItems([]); setWordListForm(emptyWordListForm); }}>Bekor qilish</button> : null}
            </div>
          </form>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Word lists</h2>
            <div className="mt-4 space-y-2">
              {wordLists.map((item, index) => (
                <div key={`${item?.id ?? index}`} className="flex items-center justify-between gap-3 border border-[var(--app-border)] bg-white p-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--app-text)]">{getItemTitle(item)}</p>
                    <p className="text-xs font-semibold text-[var(--app-muted)]">ID: {item?.id ?? '-'}</p>
                  </div>
                  <div className="flex gap-2">
                    {item?.id ? <button className={ghostButtonClass} onClick={() => void selectWordList(Number(item.id))}><Search size={14} /></button> : null}
                    {item?.id ? <button className={ghostButtonClass} onClick={() => void removeWordList(Number(item.id))}><Trash2 size={14} /></button> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="app-card p-5">
            <h2 className="text-base font-black text-[var(--app-text)]">Word list itemlari</h2>
            <form onSubmit={handleAddItem} className="mt-4 flex gap-2">
              <input className={inputClass} type="number" value={itemVocabularyId} onChange={(e) => setItemVocabularyId(e.target.value)} placeholder="vocabularyId" disabled={!selectedWordListId} required />
              <button className={buttonClass} disabled={!selectedWordListId || saving}><Plus size={14} /></button>
            </form>
            <div className="mt-4 space-y-2">
              {wordListItems.map((item, index) => (
                <div key={`${item?.id ?? item?.vocabularyId ?? index}`} className="flex items-center justify-between gap-3 border border-[var(--app-border)] bg-white p-3">
                  <p className="font-black text-[var(--app-text)]">{getItemTitle(item)}</p>
                  <button className={ghostButtonClass} onClick={() => void removeItem(item)}><Trash2 size={14} /></button>
                </div>
              ))}
              {!wordListItems.length ? <p className="text-sm font-semibold text-[var(--app-muted)]">Word list tanlang yoki item qo'shing.</p> : null}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <form onSubmit={loadStudentProgress} className="app-card p-5">
          <h2 className="text-base font-black text-[var(--app-text)]">Student vocabulary progress</h2>
          <div className="mt-4 flex gap-2">
            <input className={inputClass} type="number" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="studentId" required />
            <button className={buttonClass} disabled={saving}>Yuklash</button>
          </div>
          {studentProgress.length ? <pre className="mt-4 max-h-72 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify(studentProgress, null, 2)}</pre> : null}
        </form>

        <form onSubmit={loadProgressDetail} className="app-card p-5">
          <h2 className="text-base font-black text-[var(--app-text)]">Progress detail</h2>
          <div className="mt-4 flex gap-2">
            <input className={inputClass} type="number" value={progressId} onChange={(e) => setProgressId(e.target.value)} placeholder="progressId" required />
            <button className={buttonClass} disabled={saving}>Yuklash</button>
          </div>
          <pre className="mt-4 max-h-72 overflow-auto border border-[var(--app-border)] bg-white p-3 text-xs">{JSON.stringify({ dueReviews, progressDetail }, null, 2)}</pre>
        </form>
      </div>
    </PageShell>
  );
}
