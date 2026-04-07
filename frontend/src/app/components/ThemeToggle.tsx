'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { cn } from '@/app/components/ui/utils';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations('Theme');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme || 'system') as ThemeMode;

  const icon =
    currentTheme === 'dark' ? (
      <Moon size={14} />
    ) : currentTheme === 'light' ? (
      <Sun size={14} />
    ) : (
      <Monitor size={14} />
    );

  return (
    <label
      className={cn(
        'app-touch inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold tracking-wide',
        className,
      )}
    >
      {icon}
      <select
        aria-label="Theme mode"
        className="min-h-8 bg-transparent text-[11px] uppercase outline-none sm:text-xs"
        value={mounted ? currentTheme : 'system'}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="light" className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">
          {t('light')}
        </option>
        <option value="dark" className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">
          {t('dark')}
        </option>
        <option value="system" className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">
          {t('system')}
        </option>
      </select>
    </label>
  );
}
