'use client';

import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { MentorDashboard } from '../components/dashboards/MentorDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { SuperadminDashboard } from '../components/dashboards/SuperadminDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { role, token, loading } = useAuth();

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
