import {
  Book,
  BookOpen,
  Home,
  LayoutGrid,
  Layers,
  MessageCircle,
  Settings as SettingsIcon,
  ShieldCheck,
  ClipboardCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AppRole = 'superadmin' | 'admin' | 'teacher' | 'mentor' | 'student';
export type NavigationSurface = 'sidebar' | 'bottom';

export interface NavigationItem {
  path: string;
  icon: LucideIcon;
  labelKey: string;
}

type NavigationConfig = Record<NavigationSurface, NavigationItem[]>;

const ROLE_NAVIGATION: Record<AppRole, NavigationConfig> = {
    superadmin: {
    sidebar: [
      { path: '/dashboard', icon: Home, labelKey: 'dashboard' },
      { path: '/leads', icon: MessageCircle, labelKey: 'leads' },
      { path: '/users', icon: Users, labelKey: 'users' },
      { path: '/courses', icon: BookOpen, labelKey: 'courses' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/system', icon: ShieldCheck, labelKey: 'system' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
    bottom: [
      { path: '/dashboard', icon: Home, labelKey: 'dashboard' },
      { path: '/users', icon: Users, labelKey: 'users' },
      { path: '/courses', icon: BookOpen, labelKey: 'courses' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/system', icon: ShieldCheck, labelKey: 'system' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
  },
  admin: {
    sidebar: [
      { path: '/dashboard', icon: Home, labelKey: 'home' },
      { path: '/leads', icon: MessageCircle, labelKey: 'leads' },
      { path: '/users', icon: Users, labelKey: 'students' },
      { path: '/groups', icon: Layers, labelKey: 'groups' },
      { path: '/courses', icon: BookOpen, labelKey: 'courses' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'reports' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
    bottom: [
      { path: '/dashboard', icon: Home, labelKey: 'home' },
      { path: '/users', icon: Users, labelKey: 'students' },
      { path: '/groups', icon: Layers, labelKey: 'groups' },
      { path: '/courses', icon: BookOpen, labelKey: 'courses' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'reports' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
  },
  teacher: {
    sidebar: [
      { path: '/dashboard', icon: Home, labelKey: 'monitor' },
      { path: '/tasks', icon: BookOpen, labelKey: 'tasks' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'results' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
    bottom: [
      { path: '/dashboard', icon: Home, labelKey: 'monitor' },
      { path: '/tasks', icon: BookOpen, labelKey: 'tasks' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'results' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
  },
  mentor: {
    sidebar: [
      { path: '/dashboard', icon: Home, labelKey: 'monitor' },
      { path: '/tasks', icon: BookOpen, labelKey: 'tasks' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'results' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
    bottom: [
      { path: '/dashboard', icon: Home, labelKey: 'monitor' },
      { path: '/tasks', icon: BookOpen, labelKey: 'tasks' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/results', icon: LayoutGrid, labelKey: 'results' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'settings' },
    ],
  },
  student: {
    sidebar: [
      { path: '/dashboard', icon: Home, labelKey: 'home' },
      { path: '/groups', icon: Layers, labelKey: 'groups' },
      { path: '/learning', icon: BookOpen, labelKey: 'learning' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/results', icon: LayoutGrid, labelKey: 'rating' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'profile' },
    ],
    bottom: [
      { path: '/dashboard', icon: Home, labelKey: 'home' },
      { path: '/groups', icon: Layers, labelKey: 'groups' },
      { path: '/learning', icon: BookOpen, labelKey: 'learning' },
      { path: '/tests', icon: ClipboardCheck, labelKey: 'tests' },
      { path: '/books', icon: Book, labelKey: 'books' },
      { path: '/results', icon: LayoutGrid, labelKey: 'rating' },
      { path: '/settings', icon: SettingsIcon, labelKey: 'profile' },
    ],
  },
};

function normalizeRole(role: string | null | undefined): AppRole {
  const normalizedRole = role?.toLowerCase() as AppRole | undefined;

  if (!normalizedRole) return 'student';
  if (normalizedRole in ROLE_NAVIGATION) return normalizedRole;
  return 'student';
}

export function getNavigationConfig(
  role: string | null | undefined,
  surface: NavigationSurface,
): NavigationItem[] {
  return ROLE_NAVIGATION[normalizeRole(role)][surface];
}
