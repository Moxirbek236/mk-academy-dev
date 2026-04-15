import api from '@/lib/api';

export type AppRole = 'superadmin' | 'admin' | 'teacher' | 'mentor' | 'student';
export type UserDirectoryRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TaskType =
  | 'READING'
  | 'WRITING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'TEST';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'ENROLLED' | 'REJECTED';

export const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const TASK_TYPES: TaskType[] = [
  'READING',
  'WRITING',
  'LISTENING',
  'SPEAKING',
  'GRAMMAR',
  'VOCABULARY',
  'TEST',
];
export const TRANSACTION_TYPES: TransactionType[] = ['INCOME', 'EXPENSE'];

type RequestStrategy = 'scoped' | 'role-specific';

type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type UserListQuery = ListQuery & {
  fullName?: string;
  GroupName?: string;
  user?: UserDirectoryRole;
  isActive?: boolean;
};

export type CourseListQuery = ListQuery & {
  level?: CefrLevel;
};

export type ProfileUpdatePayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  passwordHash?: string;
  dateOfBirth?: string;
  language?: string;
  avatarUrl?: File | null;
};

export type UserCreatePayload = {
  phone: string;
  passwordHash: string;
  fullName: string;
  cefrLevel?: CefrLevel | '';
  avatarUrl?: File | null;
};

export type CoursePayload = {
  title: string;
  level: CefrLevel;
  description?: string;
  imageUrl?: File | null;
  isActive?: boolean;
};

export type GroupPayload = {
  name: string;
  description?: string;
  teacherId: number;
  inviteCode: string;
};

export type BookPayload = {
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  downloadUrl?: string;
  level?: CefrLevel | '';
};

export type TaskPayload = {
  title: string;
  description?: string;
  type: TaskType;
  xpReward: number;
  courseId?: number | null;
};

export type TestPayload = {
  title: string;
  description?: string;
  type?: string;
  cefrLevel?: CefrLevel | '';
  duration?: number;
  timeLimitMinutes?: number;
  passingScore: number;
  courseId?: number | null;
  shuffleQuestions?: boolean;
  maxAttempts?: number | null;
  isAdaptive?: boolean;
  isPublished?: boolean;
  questions?: TestQuestionPayload[];
};

export type TestQuestionPayload = {
  type?: string;
  inputType?: string;
  questionText: string;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: string;
  points?: number;
  difficulty?: number;
  skill?: string;
};

export type TestListQuery = ListQuery & {
  courseId?: number | null;
  cefrLevel?: CefrLevel | '';
  type?: string;
  isPublished?: boolean | '';
  isActive?: boolean | '';
};

export type TestAttemptSubmitPayload = {
  testId?: number;
  attemptId?: number;
  answers?: Record<string, unknown> | Array<Record<string, unknown>>;
  timeSpentSeconds?: number;
  score?: number;
  percentage?: number;
  passed?: boolean;
  studentId?: number;
};

export type TestQuestion = {
  id: number;
  testId?: number;
  type?: string;
  inputType?: string;
  questionText: string;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: string | null;
  points?: number;
  difficulty?: number;
  skill?: string | null;
  isActive?: boolean;
};

export type TestItem = {
  id: number;
  title: string;
  description?: string | null;
  type?: string;
  cefrLevel?: CefrLevel | string | null;
  duration?: number | null;
  timeLimitMinutes?: number | null;
  timeLimit?: number | null;
  passingScore?: number;
  courseId?: number | null;
  shuffleQuestions?: boolean;
  maxAttempts?: number | null;
  isAdaptive?: boolean;
  isPublished?: boolean;
  isActive?: boolean;
  course?: { id: number; title: string; level?: string | null } | null;
  createdBy?: { id: number; fullName?: string | null; role?: string | null } | null;
  questions?: TestQuestion[];
  _count?: { questions?: number; attempts?: number };
};

export type TestAttempt = {
  id: number;
  studentId: number;
  testId: number;
  startedAt: string;
  submittedAt?: string | null;
  score?: number | null;
  percentage?: number | null;
  passed?: boolean | null;
  timeSpentSeconds?: number | null;
  answers?: any;
  feedback?: any;
  test?: {
    id: number;
    title: string;
    type?: string;
    passingScore?: number;
    timeLimitMinutes?: number | null;
  };
  student?: {
    id: number;
    fullName?: string | null;
    role?: string | null;
  };
};

export type LeadPayload = {
  fullName: string;
  phone: string;
  message?: string;
};

export type FinanceTransactionPayload = {
  userId: number;
  amount: number;
  type: TransactionType;
  reason: string;
};

export type AppNotification = {
  id: number;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any> | null;
  isRead: boolean;
  createdAt: string;
  isActive?: boolean;
};

export type NotificationFeed = {
  items: AppNotification[];
  unreadCount: number;
};

function normalizeRole(role?: string | null): AppRole {
  const value = role?.toLowerCase();
  if (value === 'superadmin' || value === 'admin' || value === 'teacher' || value === 'mentor') {
    return value;
  }
  return 'student';
}

function unwrapApiData<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

function normalizeListQuery(query: ListQuery) {
  const params: Record<string, unknown> = {};

  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  if (query.search?.trim()) params.search = query.search.trim();

  return params;
}

function createFormData(payload: Record<string, unknown>) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export async function getDashboardStats() {
  const response = await api.get('/dashboard/stats');
  return unwrapApiData<any>(response.data);
}

export async function getSystemHealth() {
  const response = await api.get('/system/health');
  return unwrapApiData<any>(response.data);
}

export async function getSystemStats() {
  const response = await api.get('/system/stats');
  return unwrapApiData<any>(response.data);
}

export async function listUsersScoped(query: UserListQuery = {}) {
  const params: Record<string, unknown> = {
    ...normalizeListQuery(query),
  };

  if (query.fullName?.trim()) params.fullName = query.fullName.trim();
  if (query.GroupName?.trim()) params.GroupName = query.GroupName.trim();
  if (query.user) params.user = query.user;
  if (typeof query.isActive === 'boolean') params.isActive = query.isActive;

  const response = await api.get('/users', { params });
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function listUsersRoleSpecific(role: string | null, query: UserListQuery = {}) {
  const normalizedRole = normalizeRole(role);
  const params: Record<string, unknown> = {};

  if (query.fullName?.trim()) params.fullName = query.fullName.trim();
  if (query.GroupName?.trim()) params.GroupName = query.GroupName.trim();
  if (query.user) params.user = query.user;
  if (typeof query.isActive === 'boolean') params.isActive = query.isActive;
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;

  if (normalizedRole === 'superadmin') {
    const response = await api.get('/users/superAdmin/getAllRoles', { params });
    return unwrapApiData<any[]>(response.data) ?? [];
  }

  if (normalizedRole === 'admin') {
    const response = await api.get('/users/admin/getAll_Students_And_Techers', { params });
    return unwrapApiData<any[]>(response.data) ?? [];
  }

  if (normalizedRole === 'teacher' || normalizedRole === 'mentor') {
    const response = await api.get('/users/teacher/getAll_Students', { params });
    return unwrapApiData<any[]>(response.data) ?? [];
  }

  return [];
}

export async function listUsers(
  role: string | null,
  query: UserListQuery = {},
  strategy: RequestStrategy = 'scoped',
) {
  if (strategy === 'role-specific') {
    return listUsersRoleSpecific(role, query);
  }

  return listUsersScoped(query);
}

export async function getUserById(id: number) {
  const response = await api.get(`/users/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createTeacher(payload: UserCreatePayload) {
  const response = await api.post('/users/create/teacher', createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function createStudent(payload: UserCreatePayload) {
  const response = await api.post('/users/create/student', createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function createAdmin(payload: UserCreatePayload) {
  const response = await api.post('/users/create/admin', createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function removeUser(id: number) {
  const response = await api.delete(`/users/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function activateUser(id: number) {
  const response = await api.patch(`/users/active/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function getUsersProfile() {
  const response = await api.get('/users/profile');
  return unwrapApiData<any>(response.data);
}

export async function updateUsersProfile(payload: { fullName: string }) {
  const response = await api.patch('/users/profile', payload);
  return unwrapApiData<any>(response.data);
}

export async function getProfileMe() {
  const response = await api.get('/user-profiles/profile/me');
  return unwrapApiData<any>(response.data);
}

export async function updateProfileMe(payload: ProfileUpdatePayload) {
  const response = await api.put('/user-profiles/profile/update', createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function getCurrentProfile() {
  try {
    return await getProfileMe();
  } catch {
    return getUsersProfile();
  }
}

export async function updateCurrentProfile(payload: ProfileUpdatePayload) {
  const hasExtendedFields = ['phone', 'email', 'passwordHash', 'dateOfBirth', 'language', 'avatarUrl'].some(
    (key) => key in payload && payload[key as keyof ProfileUpdatePayload] !== undefined,
  );

  if (hasExtendedFields) {
    await updateProfileMe(payload);
    return getCurrentProfile();
  }

  if (payload.fullName) {
    return updateUsersProfile({ fullName: payload.fullName });
  }

  return getCurrentProfile();
}

export async function listCourses(query: CourseListQuery = {}) {
  const params: Record<string, unknown> = normalizeListQuery(query);
  if (query.level) params.level = query.level;

  const response = await api.get('/courses', { params });
  const payload = response.data;
  return {
    items: unwrapApiData<any[]>(payload) ?? [],
    meta: payload?.meta ?? null,
  };
}

export async function getCourseById(id: number) {
  const response = await api.get(`/courses/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createCourse(payload: CoursePayload) {
  const response = await api.post('/courses/create', createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function updateCourse(id: number, payload: Partial<CoursePayload>) {
  const response = await api.patch(`/courses/${id}`, createFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiData<any>(response.data);
}

export async function deleteCourse(id: number) {
  const response = await api.delete(`/courses/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function listGroups(search?: string) {
  const response = await api.get('/groups', {
    params: search?.trim() ? { name: search.trim() } : undefined,
  });
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function getGroupById(id: number) {
  const response = await api.get(`/groups/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createGroup(payload: GroupPayload) {
  const response = await api.post('/groups', payload);
  return unwrapApiData<any>(response.data);
}

export async function updateGroup(id: number, payload: Partial<GroupPayload>) {
  const response = await api.patch(`/groups/${id}`, payload);
  return unwrapApiData<any>(response.data);
}

export async function deleteGroup(id: number) {
  const response = await api.delete(`/groups/${id}`);
  return unwrapApiData<any>(response.data);
}

// ── Group Members ────────────────────────────────────────────────────────────

/** GET /group-members/:groupId — guruh a'zolari ro'yxati */
export async function getGroupMembers(groupId: number) {
  const response = await api.get(`/group-members/${groupId}`);
  return (unwrapApiData<any[]>(response.data) ?? response.data) as any[];
}

/** POST /group-members/:groupId/add/:studentId — o'quvchini guruhga qo'shish */
export async function addGroupMember(groupId: number, studentId: number) {
  const response = await api.post(`/group-members/${groupId}/add/${studentId}`);
  return unwrapApiData<any>(response.data);
}

/** DELETE /group-members/:groupId/remove/:studentId — o'quvchini guruhdan chiqarish */
export async function removeGroupMember(groupId: number, studentId: number) {
  const response = await api.delete(`/group-members/${groupId}/remove/${studentId}`);
  return unwrapApiData<any>(response.data);
}

// ── Group Course ──────────────────────────────────────────────────────────────

export interface GroupCourseQuery {
  page?: number;
  limit?: number;
  groupId?: number;
  courseId?: number;
  isActive?: boolean;
}

/**
 * GET /group-course
 * Barcha group-course bog'lanishlarini olish (filter: groupId, courseId, page, limit)
 */
export async function listGroupCourses(query?: GroupCourseQuery) {
  const response = await api.get('/group-course', { params: query });
  // returns { data: [...], meta: { total, page, limit, totalPages } }
  const body = response.data;
  return {
    data: (body?.data ?? body) as any[],
    meta: body?.meta as { total: number; page: number; limit: number; totalPages: number } | undefined,
  };
}

/**
 * GET /group-course/:id — bitta GroupCourse yozuvini olish
 */
export async function getGroupCourseById(id: number) {
  const response = await api.get(`/group-course/${id}`);
  return unwrapApiData<any>(response.data);
}

/**
 * POST /group-course — guruhga kurs biriktirish (admin/superadmin)
 */
export async function assignCourseToGroup(groupId: number, courseId: number) {
  const response = await api.post('/group-course', { groupId, courseId });
  return unwrapApiData<any>(response.data);
}

/**
 * PATCH /group-course/:id — bog'lanishni yangilash (admin/superadmin)
 */
export async function updateGroupCourse(id: number, payload: { groupId?: number; courseId?: number; isActive?: boolean }) {
  const response = await api.patch(`/group-course/${id}`, payload);
  return unwrapApiData<any>(response.data);
}

/**
 * DELETE /group-course/:id — soft delete (admin/superadmin)
 */
export async function removeGroupCourse(id: number) {
  const response = await api.delete(`/group-course/${id}`);
  return unwrapApiData<any>(response.data);
}

/**
 * Convenience: kursga biriktirilgan guruhlar ro'yxati
 */
export async function getGroupsByCourse(courseId: number) {
  const { data } = await listGroupCourses({ courseId, isActive: true, limit: 100 });
  return data;
}

/**
 * Convenience: guruhga biriktirilgan kurslar ro'yxati
 */
export async function getCoursesByGroup(groupId: number) {
  const { data } = await listGroupCourses({ groupId, isActive: true, limit: 100 });
  return data;
}

export async function listBooks() {

  const response = await api.get('/books');
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function getBookById(id: number) {
  const response = await api.get(`/books/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createBook(payload: BookPayload) {
  const response = await api.post('/books', payload);
  return unwrapApiData<any>(response.data);
}

export async function updateBook(id: number, payload: Partial<BookPayload>) {
  const response = await api.patch(`/books/${id}`, payload);
  return unwrapApiData<any>(response.data);
}

export async function deleteBook(id: number) {
  const response = await api.delete(`/books/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function listTasks() {
  const response = await api.get('/tasks');
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function getTaskById(id: number) {
  const response = await api.get(`/tasks/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createTask(payload: TaskPayload) {
  const response = await api.post('/tasks', payload);
  return unwrapApiData<any>(response.data);
}

export async function updateTask(id: number, payload: Partial<TaskPayload>) {
  const response = await api.patch(`/tasks/${id}`, payload);
  return unwrapApiData<any>(response.data);
}

export async function deleteTask(id: number) {
  const response = await api.delete(`/tasks/${id}`);
  return unwrapApiData<any>(response.data);
}

function normalizeTestListQuery(query: TestListQuery = {}) {
  const params: Record<string, unknown> = normalizeListQuery(query);

  if (query.courseId) params.courseId = query.courseId;
  if (query.cefrLevel) params.cefrLevel = query.cefrLevel;
  if (query.type?.trim()) params.type = query.type.trim();
  if (typeof query.isPublished === 'boolean') params.isPublished = String(query.isPublished);
  if (typeof query.isActive === 'boolean') params.isActive = String(query.isActive);

  return params;
}

function normalizeTestPayload(payload: Partial<TestPayload>) {
  const normalized: Record<string, unknown> = {
    ...payload,
  };

  const timeLimitMinutes = payload.timeLimitMinutes ?? payload.duration;
  if (timeLimitMinutes !== undefined) {
    normalized.timeLimitMinutes = Number(timeLimitMinutes);
    normalized.duration = Number(timeLimitMinutes);
  }

  if (payload.cefrLevel === '') {
    delete normalized.cefrLevel;
  }

  if (payload.courseId === undefined || payload.courseId === null || Number(payload.courseId) <= 0) {
    normalized.courseId = null;
  }

  if (payload.maxAttempts === undefined || payload.maxAttempts === null || Number(payload.maxAttempts) <= 0) {
    normalized.maxAttempts = null;
  }

  return normalized;
}

function isEmptyValue(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function validateQuestionPayload(question: Partial<TestQuestionPayload>, index = 0) {
  const errors: string[] = [];
  const label = `${index + 1}-savol`;
  const options = Array.isArray(question.options)
    ? question.options.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const inputType = String(question.inputType || question.type || '').toUpperCase();
  const requiresOptions = inputType.includes('OPTION') || inputType.includes('MCQ');

  if (!question.questionText?.trim()) {
    errors.push(`${label}: savol matni kiritilishi kerak`);
  }

  if (requiresOptions && options.length < 2) {
    errors.push(`${label}: kamida 2 ta javob varianti kerak`);
  }

  if (isEmptyValue(question.correctAnswer)) {
    errors.push(`${label}: to'g'ri javob kiritilishi kerak`);
  } else if (requiresOptions && options.length > 0) {
    const correctAnswer = String(question.correctAnswer).trim();
    if (!options.includes(correctAnswer)) {
      errors.push(`${label}: to'g'ri javob variantlar ichida bo'lishi kerak`);
    }
  }

  if (question.points !== undefined && Number(question.points) < 1) {
    errors.push(`${label}: ball 1 dan kam bo'lmasligi kerak`);
  }

  if (question.difficulty !== undefined && Number(question.difficulty) < 1) {
    errors.push(`${label}: qiyinlik darajasi 1 dan kam bo'lmasligi kerak`);
  }

  return errors;
}

export function validateTestPayload(payload: Partial<TestPayload>) {
  const errors: string[] = [];
  const timeLimitMinutes = Number(payload.timeLimitMinutes ?? payload.duration ?? 0);

  if (!payload.title?.trim()) {
    errors.push('Test nomi kiritilishi kerak');
  }

  if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes < 1) {
    errors.push("Test davomiyligi kamida 1 daqiqa bo'lishi kerak");
  }

  if (!Number.isFinite(Number(payload.passingScore)) || Number(payload.passingScore) < 0 || Number(payload.passingScore) > 100) {
    errors.push("O'tish foizi 0 dan 100 gacha bo'lishi kerak");
  }

  if (payload.maxAttempts !== undefined && payload.maxAttempts !== null && Number(payload.maxAttempts) < 1) {
    errors.push("Urinishlar soni 1 dan kam bo'lmasligi kerak");
  }

  payload.questions?.forEach((question, index) => {
    errors.push(...validateQuestionPayload(question, index));
  });

  return errors;
}

export function validateAttemptAnswers(test: TestItem, answers: Record<string, unknown>) {
  const errors: string[] = [];
  const questions = test.questions?.filter((question) => question.isActive !== false) ?? [];

  questions.forEach((question, index) => {
    const value = answers[String(question.id)];
    const label = `${index + 1}-savol`;

    if (isEmptyValue(value)) {
      errors.push(`${label}: javob tanlanmagan`);
      return;
    }

    const options = normalizeQuestionOptions(question.options);
    if (options.length > 0 && !options.includes(String(value).trim())) {
      errors.push(`${label}: javob mavjud variantlardan tanlanishi kerak`);
    }
  });

  return errors;
}

export function normalizeQuestionOptions(options: unknown): string[] {
  if (Array.isArray(options)) {
    return options.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return options
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (options && typeof options === 'object') {
    return Object.values(options).map((item) => String(item).trim()).filter(Boolean);
  }

  return [];
}

export async function listTests(query: TestListQuery = {}) {
  const response = await api.get('/tests', { params: normalizeTestListQuery(query) });
  const payload = response.data;
  return {
    items: unwrapApiData<TestItem[]>(payload) ?? [],
    meta: payload?.meta ?? null,
  };
}

export async function getTestById(id: number) {
  const response = await api.get(`/tests/${id}`);
  return unwrapApiData<TestItem>(response.data);
}

export async function createTest(payload: TestPayload) {
  const errors = validateTestPayload(payload);
  if (errors.length) throw new Error(errors.join('\n'));

  const response = await api.post('/tests', normalizeTestPayload(payload));
  return unwrapApiData<TestItem>(response.data);
}

export async function updateTest(id: number, payload: Partial<TestPayload>) {
  const errors = validateTestPayload({
    title: payload.title || 'existing',
    duration: payload.duration ?? payload.timeLimitMinutes ?? 1,
    passingScore: payload.passingScore ?? 0,
    questions: payload.questions,
    maxAttempts: payload.maxAttempts,
  });
  if (errors.length) throw new Error(errors.join('\n'));

  const response = await api.patch(`/tests/${id}`, normalizeTestPayload(payload));
  return unwrapApiData<TestItem>(response.data);
}

export async function deleteTest(id: number) {
  const response = await api.delete(`/tests/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createQuestion(testId: number, payload: TestQuestionPayload) {
  const errors = validateQuestionPayload(payload);
  if (errors.length) throw new Error(errors.join('\n'));

  const response = await api.post(`/questions/test/${testId}`, payload);
  return unwrapApiData<TestQuestion>(response.data);
}

export async function updateQuestion(id: number, payload: Partial<TestQuestionPayload>) {
  const errors = validateQuestionPayload({
    questionText: payload.questionText || 'existing',
    correctAnswer: payload.correctAnswer ?? 'existing',
    ...payload,
  });
  if (errors.length) throw new Error(errors.join('\n'));

  const response = await api.patch(`/questions/${id}`, payload);
  return unwrapApiData<TestQuestion>(response.data);
}

export async function deleteQuestion(id: number) {
  const response = await api.delete(`/questions/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function startTestAttempt(testId: number) {
  const response = await api.post(`/tests/${testId}/start`);
  return response.data as {
    status?: number;
    success?: boolean;
    message?: string;
    data: TestAttempt;
    test: TestItem;
  };
}

export async function submitTestAttempt(testId: number, payload: TestAttemptSubmitPayload, test?: TestItem) {
  if (test && payload.answers && !Array.isArray(payload.answers)) {
    const errors = validateAttemptAnswers(test, payload.answers);
    if (errors.length) throw new Error(errors.join('\n'));
  }

  const response = await api.post(`/tests/${testId}/submit`, {
    ...payload,
    testId,
  });
  return unwrapApiData<TestAttempt>(response.data);
}

export async function getMyTestAttempts() {
  const response = await api.get('/tests/my-attempts');
  return unwrapApiData<TestAttempt[]>(response.data) ?? [];
}

export async function getStudentTestAttempts(studentId: number) {
  const response = await api.get(`/test-attempts/student/${studentId}`);
  return unwrapApiData<TestAttempt[]>(response.data) ?? [];
}

export async function createLead(payload: LeadPayload) {
  const response = await api.post('/leads', payload);
  return unwrapApiData<any>(response.data);
}

export async function listLeads() {
  const response = await api.get('/leads');
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const response = await api.patch(`/leads/${id}/status`, { status });
  return unwrapApiData<any>(response.data);
}

export async function deleteLead(id: number) {
  const response = await api.delete(`/leads/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function getFinanceSummary() {
  const response = await api.get('/finance/summary');
  return unwrapApiData<any>(response.data);
}

export async function getFinanceTransactions() {
  const response = await api.get('/finance/transactions');
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function createFinanceTransaction(payload: FinanceTransactionPayload) {
  const response = await api.post('/finance/transaction', payload);
  return unwrapApiData<any>(response.data);
}

export async function getMyNotifications() {
  const response = await api.get('/notifications/me');
  return unwrapApiData<NotificationFeed>(response.data);
}

export async function markNotificationAsRead(id: number) {
  const response = await api.patch(`/notifications/${id}/read`);
  return unwrapApiData<any>(response.data);
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch('/notifications/read-all');
  return unwrapApiData<NotificationFeed>(response.data);
}

export async function removeNotification(id: number) {
  const response = await api.delete(`/notifications/${id}`);
  return unwrapApiData<any>(response.data);
}
