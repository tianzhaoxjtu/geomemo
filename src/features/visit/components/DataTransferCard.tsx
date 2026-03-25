import { useRef } from "react";
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

  return (
    <SurfaceCard
      eyebrow="Data"
      title="Import or export visits"
      description="Move your visit collection between browsers now, and this contract can later back an API or sync service."
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button className="glass-button rounded-[22px]" onClick={onExport}>
            Export JSON
          </button>
          <button className="glass-button rounded-[22px]" onClick={() => inputRef.current?.click()}>
            Import JSON
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
          <p className="text-sm text-slate-500">Last import: {new Date(lastImportedAt).toLocaleString()}</p>
        ) : null}
        {importError ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <div className="flex items-start justify-between gap-3">
              <span>{importError}</span>
              <button className="font-medium text-rose-900" onClick={onDismissError}>
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
