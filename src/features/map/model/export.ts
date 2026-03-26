export type MapImageFormat = "png" | "jpeg";

export interface MapImageExportOptions {
  type?: MapImageFormat;
  pixelRatio?: number;
  backgroundColor?: string;
}

export type MapImageExporter = (options?: MapImageExportOptions) => string | null;
