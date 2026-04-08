const ROLE_HOME_PATHS: Record<string, string> = {
  superadmin: '/',
  admin: '/',
  teacher: '/',
  mentor: '/',
  student: '/',
};

const RESTRICTED_PREFIXES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: '/finance', roles: ['superadmin', 'admin'] },
  { prefix: '/system', roles: ['superadmin'] },
  { prefix: '/users', roles: ['superadmin', 'admin'] },
  { prefix: '/leads', roles: ['superadmin', 'admin'] },
];

function normalizeRole(role: string | null | undefined) {
  return role?.toLowerCase() || 'student';
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
