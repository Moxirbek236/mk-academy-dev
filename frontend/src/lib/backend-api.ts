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
  duration: number;
  passingScore: number;
  courseId?: number | null;
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

export type CenterSettings = {
  id?: number;
  name: string;
  shortName: string;
  logoUrl: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CenterSettingsPayload = {
  name?: string;
  shortName?: string;
  logoUrl?: string;
  description?: string;
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

export async function getPublicCenterSettings() {
  const response = await api.get('/center-settings/public');
  return unwrapApiData<CenterSettings>(response.data);
}

export async function getCenterSettings() {
  const response = await api.get('/center-settings');
  return unwrapApiData<CenterSettings>(response.data);
}

export async function updateCenterSettings(payload: CenterSettingsPayload) {
  const response = await api.patch('/center-settings', payload);
  return unwrapApiData<CenterSettings>(response.data);
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

export async function listTests() {
  const response = await api.get('/tests');
  return unwrapApiData<any[]>(response.data) ?? [];
}

export async function getTestById(id: number) {
  const response = await api.get(`/tests/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function createTest(payload: TestPayload) {
  const response = await api.post('/tests', payload);
  return unwrapApiData<any>(response.data);
}

export async function updateTest(id: number, payload: Partial<TestPayload>) {
  const response = await api.patch(`/tests/${id}`, payload);
  return unwrapApiData<any>(response.data);
}

export async function deleteTest(id: number) {
  const response = await api.delete(`/tests/${id}`);
  return unwrapApiData<any>(response.data);
}

export async function getStudentTestAttempts(studentId: number) {
  const response = await api.get(`/test-attempts/student/${studentId}`);
  return unwrapApiData<any[]>(response.data) ?? [];
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

