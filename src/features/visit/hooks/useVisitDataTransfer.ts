import { useMemo } from "react";
import { serializeVisitData } from "../../../entities/visit/lib/visitTransfer";
import type { MapImageExporter, MapImageFormat } from "../../map/model/export";
import { useGeoMemoStore } from "../../../shared/store/geoMemoStore";

export interface MapImageExportResult {
  ok: boolean;
  errorKey?: string;
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  triggerDownload(filename, url, true);
}

function downloadDataUrl(filename: string, dataUrl: string) {
  triggerDownload(filename, dataUrl, false);
}

function triggerDownload(filename: string, url: string, revokeAfterDownload: boolean) {
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (revokeAfterDownload) {
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }
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
    ): MapImageExportResult => {
      // The map export is delegated to the active ECharts instance so the downloaded
      // image matches the live viewport, styling, and visit state instead of the page UI.
      if (!exporter) {
        return {
          ok: false,
          errorKey: "error.export.mapNotReady",
        };
      }

      try {
        if (typeof exporter !== "function") {
          console.error("Map export failed: exporter is not a callable function.", exporter);
          return {
            ok: false,
            errorKey: "error.export.mapUnavailable",
          };
        }

        const dataUrl = exporter({
          type: format,
          pixelRatio,
        });

        if (!dataUrl) {
          console.error("Map export failed: exporter returned an empty data URL.", {
            format,
            pixelRatio,
          });
          return {
            ok: false,
            errorKey: "error.export.mapUnavailable",
          };
        }

        downloadDataUrl(createMapFilename(format), dataUrl);

        return {
          ok: true,
        };
      } catch (error) {
        console.error("Map export failed while generating the image.", error);
        return {
          ok: false,
          errorKey: "error.export.mapUnavailable",
        };
      }
    },
    importFile: async (file: File) => {
      const text = await file.text();
      importVisits(text);
    },
    clearImportError,
  };
}
