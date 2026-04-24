export type AppRole = 'superadmin' | 'admin' | 'teacher' | 'mentor' | 'student';
export type RoleCapability =
  | 'view_users'
  | 'manage_users'
  | 'create_admin'
  | 'create_teacher'
  | 'create_student'
  | 'view_system'
  | 'view_leads'
  | 'manage_leads'
  | 'manage_courses'
  | 'manage_groups'
  | 'manage_books'
  | 'manage_tasks'
  | 'manage_tests';

const ROLE_HOME_PATHS: Record<string, string> = {
  superadmin: '/dashboard',
  admin: '/dashboard',
  teacher: '/dashboard',
  mentor: '/dashboard',
  student: '/dashboard',
};

const RESTRICTED_PREFIXES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: '/system', roles: ['superadmin'] },
  { prefix: '/users', roles: ['superadmin', 'admin', 'teacher', 'mentor'] },
  { prefix: '/leads', roles: ['superadmin', 'admin'] },
  { prefix: '/tasks', roles: ['superadmin', 'admin', 'teacher', 'mentor'] },
];

const ROLE_CAPABILITIES: Record<AppRole, RoleCapability[]> = {
  superadmin: [
    'view_users',
    'manage_users',
    'create_admin',
    'create_teacher',
    'create_student',
    'view_system',
    'view_leads',
    'manage_leads',
    'manage_courses',
    'manage_groups',
    'manage_books',
    'manage_tasks',
    'manage_tests',
  ],
  admin: [
    'view_users',
    'manage_users',
    'create_teacher',
    'create_student',
    'view_leads',
    'manage_leads',
    'manage_courses',
    'manage_groups',
    'manage_books',
    'manage_tasks',
    'manage_tests',
  ],
  teacher: ['view_users', 'manage_books', 'manage_tasks', 'manage_tests'],
  mentor: ['view_users', 'manage_tasks', 'manage_tests'],
  student: [],
};

function normalizeRole(role: string | null | undefined) {
  const normalized = role?.toLowerCase();

  if (
    normalized === 'superadmin' ||
    normalized === 'admin' ||
    normalized === 'teacher' ||
    normalized === 'mentor'
  ) {
    return normalized;
  }

  return 'student';
}

export function isRoleAllowedForPath(pathname: string, role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  for (const rule of RESTRICTED_PREFIXES) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      return rule.roles.includes(normalizedRole);
    }
  }

  return true;
}

export function getRoleHomePath(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);
  return ROLE_HOME_PATHS[normalizedRole] || '/';
}

export function hasRoleCapability(
  role: string | null | undefined,
  capability: RoleCapability,
) {
  const normalizedRole = normalizeRole(role) as AppRole;
  return ROLE_CAPABILITIES[normalizedRole].includes(capability);
}
