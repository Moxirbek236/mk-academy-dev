'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Building2, CheckCircle2, Image as ImageIcon, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCenterBranding } from '@/app/components/branding/CenterBrandingProvider';

export default function CenterSettingsPage() {
  const router = useRouter();
  const t = useTranslations('CenterSettingsPage');
  const { role } = useAuth();
  const { centerBranding, saveSettings, saving } = useCenterBranding();
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const canManageCenterBranding = role === 'superadmin' || role === 'admin';

  useEffect(() => {
    setName(centerBranding.name);
    setShortName(centerBranding.shortName);
    setLogoUrl(centerBranding.logoUrl);
    setDescription(centerBranding.description);
  }, [centerBranding]);

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== centerBranding.name ||
      shortName.trim() !== centerBranding.shortName ||
      logoUrl.trim() !== centerBranding.logoUrl ||
      description.trim() !== centerBranding.description
    );
  }, [centerBranding, description, logoUrl, name, shortName]);

  async function handleSave() {
    if (!canManageCenterBranding || !hasChanges) {
      return;
    }

    await saveSettings({
      name: name.trim(),
      shortName: shortName.trim(),
      logoUrl: logoUrl.trim(),
      description: description.trim(),
    });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  if (!canManageCenterBranding) {
    return (
      <div className="app-page pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
        <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-center shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
            {t('accessDeniedTitle')}
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-red-900">
            {t('accessDeniedDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page animate-in fade-in duration-300 pb-nav-safe lg:pb-14 pt-4 sm:pt-6">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="app-touch rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">
            {t('title')}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="rounded-[28px] border border-[#dbeafe] bg-white p-5 shadow-sm sm:rounded-[34px] sm:p-7">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]">
                {t('nameLabel')}
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-[18px] border border-[#bfdbfe] bg-[#eff6ff]/60 px-4 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                placeholder={t('nameLabel')}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]">
                {t('shortNameLabel')}
              </label>
              <input
                value={shortName}
                onChange={(event) => setShortName(event.target.value)}
                className="rounded-[18px] border border-[#bfdbfe] bg-[#eff6ff]/60 px-4 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                placeholder={t('shortNameLabel')}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]">
                {t('logoUrlLabel')}
              </label>
              <input
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                className="rounded-[18px] border border-[#bfdbfe] bg-[#eff6ff]/60 px-4 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]">
                {t('descriptionLabel')}
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="resize-none rounded-[18px] border border-[#bfdbfe] bg-[#eff6ff]/60 px-4 py-3.5 text-sm font-bold text-gray-900 outline-none transition-all focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            <button
              onClick={() => void handleSave()}
              disabled={saving || !hasChanges}
              className="mt-2 flex items-center justify-center gap-3 rounded-[20px] bg-[#2563eb] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-[#2563eb]/20 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
              <span>
                {saved ? t('saveSuccess') : saving ? t('saving') : t('save')}
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#dbeafe] bg-white p-5 shadow-sm sm:rounded-[34px] sm:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb]">
            {t('previewTitle')}
          </p>
          <div className="mt-5 rounded-[24px] border border-gray-100 bg-[#f8fbff] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] border border-[#dbeafe] bg-white shadow-sm">
                {logoUrl.trim() ? (
                  <img
                    src={logoUrl.trim()}
                    alt={shortName.trim() || name.trim()}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon size={24} className="text-gray-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-tight text-gray-900">
                  {shortName.trim() || name.trim() || centerBranding.shortName}
                </p>
                <p className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  <Building2 size={12} />
                  {name.trim() || centerBranding.name}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm font-bold leading-relaxed text-gray-500">
              {description.trim() || centerBranding.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
