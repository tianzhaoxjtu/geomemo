import { useRef } from "react";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface DataTransferCardProps {
  importError: string | null;
  lastImportedAt: string | null;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onDismissError: () => void;
}

export function DataTransferCard({
  importError,
  lastImportedAt,
  onExport,
  onImport,
  onDismissError,
}: DataTransferCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { locale, t } = useI18n();

  return (
    <SurfaceCard
      eyebrow={t("data.section")}
      title={t("data.title")}
      description={t("data.description")}
      className="p-4"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-full bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-white/60 transition-all hover:bg-white hover:text-slate-800"
            onClick={onExport}
          >
            {t("data.export")}
          </button>
          <button
            className="rounded-full bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 ring-1 ring-white/60 transition-all hover:bg-white hover:text-slate-800"
            onClick={() => inputRef.current?.click()}
          >
            {t("data.import")}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (file) {
              await onImport(file);
              event.target.value = "";
            }
          }}
        />
        {lastImportedAt ? (
          <p className="text-xs text-slate-500">
            {t("data.lastImport", {
              time: new Date(lastImportedAt).toLocaleString(locale === "en" ? "en-US" : "zh-CN"),
            })}
          </p>
        ) : null}
        {importError ? (
          <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <div className="flex items-start justify-between gap-3">
              <span>{t(importError)}</span>
              <button className="font-medium text-rose-900" onClick={onDismissError}>
                {t("data.dismiss")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
