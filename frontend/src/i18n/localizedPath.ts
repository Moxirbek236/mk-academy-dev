export function localizePath(locale: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (process.env.NEXT_PUBLIC_DISABLE_LOCALE_PREFIX === 'true') {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}
