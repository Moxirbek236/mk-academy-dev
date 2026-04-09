'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { SuperadminDashboard } from './components/dashboards/SuperadminDashboard';
import { localizePath } from '@/i18n/localizedPath';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const locale = useLocale();
  const { role, token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.replace(localizePath(locale, '/landing'));
    }
  }, [loading, token, router, locale]);

  if (loading || !token) return null;

  const currentRole = role?.toLowerCase();

  switch (currentRole) {
    case 'teacher':
    case 'mentor':
      return <MentorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'superadmin':
      return <SuperadminDashboard />;
    default:
      return <StudentDashboard />;
  }
}
