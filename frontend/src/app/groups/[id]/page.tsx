import { Metadata } from 'next';
import GroupDetailClient from './GroupDetailClient';
import { generateSEO } from '@/lib/seo';
import { getServerCenterBranding } from '@/lib/server-center-branding';

interface Props {
  params: Promise<{ id: string }>;
}

// Internal API url helper
const DEFAULT_API_URL = 'https://mk-academy-dev.onrender.com/api';
function getApiUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const centerBranding = await getServerCenterBranding();
  
  try {
    const response = await fetch(`${getApiUrl()}/groups/${id}`, { cache: 'no-store' });
    const payload = await response.json();
    const group = payload?.data ?? payload;

    if (!group) throw new Error('Group not found');

    return generateSEO(
      `${group.name} | ${centerBranding.name} O'quv Guruhlari`,
      `${group.name} guruhining tafsilotlari va o'quv jarayoni.`,
      `/groups/${id}`,
      centerBranding.logoUrl,
      centerBranding.name,
      {
        noIndex: true, // Privacy for group pages
      }
    );
  } catch {
    return generateSEO(
      `Guruh tafsilotlari | ${centerBranding.name}`,
      centerBranding.description,
      `/groups/${id}`,
      centerBranding.logoUrl,
      centerBranding.name,
      { noIndex: true }
    );
  }
}

export default async function GroupDetailPage({ params }: Props) {
  await params;
  return <GroupDetailClient />;
}
