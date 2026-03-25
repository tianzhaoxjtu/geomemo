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
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button className="glass-button rounded-[22px]" onClick={onExport}>
            {t("data.export")}
          </button>
          <button className="glass-button rounded-[22px]" onClick={() => inputRef.current?.click()}>
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
          <p className="text-sm text-slate-500">
            {t("data.lastImport", {
              time: new Date(lastImportedAt).toLocaleString(locale === "en" ? "en-US" : "zh-CN"),
            })}
          </p>
        ) : null}
        {importError ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
