import { useMemo } from "react";
import { serializeVisitData } from "../../../entities/visit/lib/visitTransfer";
import { useGeoMemoStore } from "../../../shared/store/geoMemoStore";

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function useVisitDataTransfer() {
  const visits = useGeoMemoStore((state) => state.visits);
  const importVisits = useGeoMemoStore((state) => state.importVisits);
  const clearImportError = useGeoMemoStore((state) => state.clearImportError);
  const importError = useGeoMemoStore((state) => state.ui.importError);
  const lastImportedAt = useGeoMemoStore((state) => state.ui.lastImportedAt);

  const exportJson = useMemo(() => serializeVisitData(visits), [visits]);

  return {
    exportJson,
    importError,
    lastImportedAt,
    downloadExport: () => {
      downloadFile("geomemo-visits.json", exportJson);
    },
    importFile: async (file: File) => {
      const text = await file.text();
      importVisits(text);
    },
    clearImportError,
  };
}
