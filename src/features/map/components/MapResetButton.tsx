import { useI18n } from "../../../shared/i18n/I18nProvider";

interface MapResetButtonProps {
  onReset: () => void;
}

export function MapResetButton({ onReset }: MapResetButtonProps) {
  const { t } = useI18n();

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/85 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-[0_16px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      onClick={onReset}
    >
      <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5.5 5.5A6 6 0 1 1 4 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 2.75V5.5h2.75"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t("header.resetVisits")}
    </button>
  );
}
