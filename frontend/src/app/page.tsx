'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { SuperadminDashboard } from './components/dashboards/SuperadminDashboard';
import { localizePath } from '@/i18n/localizedPath';
import { getStoredRole, getStoredToken } from '@/lib/auth-storage';

export default function Dashboard() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('student');

  useEffect(() => {
    const bootstrap = async () => {
      const token = await getStoredToken();

      if (!token) {
        router.push(localizePath(locale, '/landing'));
        return;
      }

      const storedRole = await getStoredRole();
      if (storedRole) setRole(storedRole.toLowerCase());
      setLoading(false);
    };

    void bootstrap();
  }, [router, locale]);

  if (loading) return null;

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
