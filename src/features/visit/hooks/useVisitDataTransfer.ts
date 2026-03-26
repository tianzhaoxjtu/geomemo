import { useMemo } from "react";
import { serializeVisitData } from "../../../entities/visit/lib/visitTransfer";
import type { MapImageExporter, MapImageFormat } from "../../map/model/export";
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

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function createMapFilename(format: MapImageFormat) {
  const now = new Date();
  const year = `${now.getFullYear()}`;
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `geomemo-map-${year}${month}${day}.${format === "jpeg" ? "jpg" : format}`;
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
    downloadMapImage: (
      exporter: MapImageExporter | null,
      format: MapImageFormat,
      pixelRatio = 2,
    ) => {
      const dataUrl = exporter?.({
        type: format,
        pixelRatio,
      });

      if (!dataUrl) {
        return;
      }

      downloadDataUrl(createMapFilename(format), dataUrl);
    },
    importFile: async (file: File) => {
      const text = await file.text();
      importVisits(text);
    },
    clearImportError,
  };
}
