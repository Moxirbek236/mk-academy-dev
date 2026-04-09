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
  let content;

  switch (currentRole) {
    case 'teacher':
    case 'mentor':
      content = <MentorDashboard />;
      break;
    case 'admin':
      content = <AdminDashboard />;
      break;
    case 'superadmin':
      content = <SuperadminDashboard />;
      break;
    default:
      content = <StudentDashboard />;
      break;
  }

  return <div className="app-page pb-6 sm:pb-8">{content}</div>;
}
