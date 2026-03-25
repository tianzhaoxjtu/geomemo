import { useI18n } from "../../../shared/i18n/I18nProvider";
import type { Locale } from "../../../shared/i18n/types";

const locales: Locale[] = ["zh-CN", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 p-1 backdrop-blur">
      <span className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {t("language.label")}
      </span>
      {locales.map((value) => (
        <button
          key={value}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            locale === value
              ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
              : "text-slate-600 hover:bg-white"
          }`}
          onClick={() => setLocale(value)}
        >
          {t(`language.${value}`)}
        </button>
      ))}
    </div>
  );
}
