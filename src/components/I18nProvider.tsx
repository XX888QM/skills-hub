"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectLocale,
  isLocale,
  localeMeta,
  LOCALE_COOKIE,
  LOCALE_MAX_AGE,
  translate,
  type Locale,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem("locale", locale);
  } catch {
    /* ignore quota / private mode */
  }
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`;
  document.documentElement.lang = localeMeta[locale].html;
  document.documentElement.dataset.locale = locale;
}

export function I18nProvider({
  children,
  initialLocale = "zh",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("locale");
    } catch {
      stored = null;
    }
    const cookieMatch = document.cookie.match(/(?:^|; )locale=([^;]+)/);
    const cookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    const next = isLocale(stored)
      ? stored
      : isLocale(cookie)
        ? cookie
        : detectLocale(navigator.language);
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, values) => translate(locale, key, values),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
