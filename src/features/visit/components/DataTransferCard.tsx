import { useRef, useState } from "react";
import type { MapImageFormat } from "../../map/model/export";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface DataTransferCardProps {
  importError: string | null;
  lastImportedAt: string | null;
  onExport: () => void;
  onExportMapImage: (format: MapImageFormat, pixelRatio: number) => void;
  canExportMapImage: boolean;
  onImport: (file: File) => Promise<void>;
  onDismissError: () => void;
}

export function DataTransferCard({
  importError,
  lastImportedAt,
  onExport,
  onExportMapImage,
  canExportMapImage,
  onImport,
  onDismissError,
}: DataTransferCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { locale, t } = useI18n();
  const [imageFormat, setImageFormat] = useState<MapImageFormat>("png");
  const [imageScale, setImageScale] = useState("2");

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
        <div className="rounded-[22px] border border-white/70 bg-slate-50/85 p-3">
          <div>
            <p className="text-sm font-medium text-slate-800">{t("data.exportMapTitle")}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{t("data.exportMapDescription")}</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <label className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                {t("data.imageFormat")}
              </span>
              <select
                className="w-full rounded-[16px] border border-white/80 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300"
                value={imageFormat}
                onChange={(event) => setImageFormat(event.target.value as MapImageFormat)}
              >
                <option value="png">{t("data.format.png")}</option>
                <option value="jpeg">{t("data.format.jpeg")}</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                {t("data.imageScale")}
              </span>
              <select
                className="w-full rounded-[16px] border border-white/80 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300"
                value={imageScale}
                onChange={(event) => setImageScale(event.target.value)}
              >
                <option value="1">{t("data.scale.standard")}</option>
                <option value="2">{t("data.scale.high")}</option>
                <option value="3">{t("data.scale.ultra")}</option>
              </select>
            </label>
          </div>
          <button
            className="mt-3 w-full rounded-full bg-slate-950 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={() => onExportMapImage(imageFormat, Number(imageScale))}
            disabled={!canExportMapImage}
          >
            {t("data.exportMap")}
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
