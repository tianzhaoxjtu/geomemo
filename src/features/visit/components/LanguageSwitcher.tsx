import { useI18n } from "../../../shared/i18n/I18nProvider";
import type { Locale } from "../../../shared/i18n/types";

const locales: Locale[] = ["zh-CN", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/50 p-1 shadow-sm ring-1 ring-white/55 backdrop-blur-md">
      <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {t("language.label")}
      </span>
      {locales.map((value) => (
        <button
          key={value}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
            locale === value
              ? "bg-white/90 text-slate-700 shadow-sm"
              : "text-slate-400 hover:bg-white/60 hover:text-slate-600"
          }`}
          onClick={() => setLocale(value)}
        >
          {t(`language.${value}`)}
        </button>
      ))}
    </div>
  );
}
