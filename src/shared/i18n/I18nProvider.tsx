import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { messages } from "./resources";
import type { Locale } from "./types";
import { LOCALE_STORAGE_KEY } from "../lib/storage";
const DEFAULT_LOCALE: Locale = "zh-CN";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LOCALE;
    }

    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return saved === "en" || saved === "zh-CN" ? saved : DEFAULT_LOCALE;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dictionary = messages[locale];
      const fallback = messages[DEFAULT_LOCALE];
      const template = dictionary[key] ?? fallback[key] ?? key;
      return interpolate(template, vars);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
