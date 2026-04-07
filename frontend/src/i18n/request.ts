import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isAppLocale, localeCookieName } from './config';

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const headerLocale = headerStore.get('x-locale');
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  let locale = defaultLocale;
  if (isAppLocale(headerLocale ?? '')) {
    locale = headerLocale as typeof defaultLocale;
  } else if (isAppLocale(cookieLocale ?? '')) {
    locale = cookieLocale as typeof defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
