import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import type { ExperienceLevel, VisitVisualState } from "../../../entities/region/model/types";
import { getRegionFill, getRegionHoverFill, getRegionStroke } from "../lib/mapTheme";
import type { MapImageExportOptions, MapImageExporter } from "../model/export";

echarts.use([MapChart, TooltipComponent, CanvasRenderer]);

type GeoJsonFeature = {
  properties?: {
    code?: string;
    name?: string;
    fullname?: string;
    pinyin?: string;
  };
};

type GeoJsonCollection = {
  features?: GeoJsonFeature[];
};

interface AdminGeoMapProps {
  mapCode: string;
  activeCode: string | null;
  isRegionActive?: (regionCode: string) => boolean;
  initialView?: {
    zoom?: number;
    center?: [number, number];
  };
  getVisualState: (regionCode: string) => VisitVisualState;
  getExperienceLevel: (regionCode: string) => ExperienceLevel | null;
  getCoverageRatio?: (regionCode: string) => number;
  onRegionClick: (regionCode: string) => void;
  emptyMessage: string;
  onExportReady?: (exporter: MapImageExporter | null) => void;
  className?: string;
}

export function AdminGeoMap({
  mapCode,
  activeCode,
  isRegionActive,
  initialView,
  getVisualState,
  getExperienceLevel,
  getCoverageRatio,
  onRegionClick,
  emptyMessage,
  onExportReady,
  className = "min-h-[460px] h-full",
}: AdminGeoMapProps) {
  const { locale, t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const featureLookupRef = useRef<Map<string, string>>(new Map());
  const onRegionClickRef = useRef(onRegionClick);
  const onExportReadyRef = useRef(onExportReady);
  const viewStateRef = useRef<{ zoom?: number; center?: number[] }>({});
  const [geoJson, setGeoJson] = useState<GeoJsonCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const initialCenterX = initialView?.center?.[0];
  const initialCenterY = initialView?.center?.[1];

  useEffect(() => {
    onRegionClickRef.current = onRegionClick;
  }, [onRegionClick]);

  useEffect(() => {
    onExportReadyRef.current = onExportReady;
  }, [onExportReady]);

  useEffect(() => {
    viewStateRef.current = {};
  }, [mapCode]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [geoJson, mapCode]);

  useEffect(() => {
    let cancelled = false;

    setGeoJson(null);
    setError(null);

    fetch(`/geojson/china/${mapCode}.json`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(t("map.loadError"));
        }

        return response.json();
      })
      .then((data: GeoJsonCollection) => {
        if (!cancelled) {
          setGeoJson(data);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : t("map.loadError"));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mapCode, t]);

  // The vendored GeoJSON dataset ships pinyin for English display. We title-case it
  // locally so runtime rendering does not depend on a separate translation table.
  const toEnglishName = (value: string) =>
    value
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const featureLookup = useMemo(() => {
    const lookup = new Map<string, string>();

    for (const feature of geoJson?.features ?? []) {
      const code = String(feature.properties?.code ?? "");
      const name = String(feature.properties?.name ?? "");

      if (code && name) {
        lookup.set(name, code);
      }
    }

    return lookup;
  }, [geoJson]);

  useEffect(() => {
    featureLookupRef.current = featureLookup;
  }, [featureLookup]);

  const adaptiveOverviewZoom = useMemo(() => {
    const baseZoom = initialView?.zoom ?? 1.26;

    if (mapCode !== "100000") {
      return baseZoom;
    }

    const widthBoost = Math.max(0, Math.min(0.22, (containerSize.width - 720) / 1400));
    const heightBoost = Math.max(0, Math.min(0.1, (containerSize.height - 520) / 900));

    return Number((baseZoom + widthBoost + heightBoost).toFixed(2));
  }, [containerSize.height, containerSize.width, initialView?.zoom, mapCode]);

  const option = useMemo<EChartsOption | null>(() => {
    if (!geoJson) {
      return null;
    }

    // Register a unique map name per code so country and province drill-down states can
    // coexist without leaking configuration between renders.
    const mapName = `geomemo-${mapCode}`;
    echarts.registerMap(mapName, geoJson as never);

    const seriesData = (geoJson.features ?? []).map((feature) => {
      const code = String(feature.properties?.code ?? "");
      const name = String(feature.properties?.name ?? "");
      const fullName = String(feature.properties?.fullname ?? name);
      const pinyin = String(feature.properties?.pinyin ?? "");
      const visualState = getVisualState(code);
      const experienceLevel = getExperienceLevel(code);
      const coverageRatio = getCoverageRatio ? getCoverageRatio(code) : undefined;
      const isActive = isRegionActive ? isRegionActive(code) : activeCode === code;
      const displayName = locale === "zh-CN" ? fullName : toEnglishName(pinyin || name);

      return {
        name,
        value: 1,
        regionCode: code,
        fullName,
        displayName,
        itemStyle: {
          areaColor: getRegionFill(visualState, experienceLevel, coverageRatio, isActive),
          borderColor: getRegionStroke(isActive),
          borderWidth: isActive ? 2 : 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: getRegionHoverFill(visualState, experienceLevel, coverageRatio),
          },
        },
      };
    });

    return {
      animationDuration: 350,
      animationDurationUpdate: 300,
      tooltip: {
        trigger: "item",
        formatter: (params: any) =>
          params?.data?.displayName ?? params?.data?.fullName ?? params?.name ?? "",
      },
      series: [
        {
          type: "map",
          map: mapName,
          roam: true,
          zoom: viewStateRef.current.zoom ?? adaptiveOverviewZoom,
          center: viewStateRef.current.center ?? initialView?.center,
          scaleLimit: {
            min: 1,
            max: 8,
          },
          label: {
            show: true,
            color: "#243446",
            fontSize: mapCode === "100000" ? 10 : 11,
            textBorderColor: "rgba(248,250,252,0.8)",
            textBorderWidth: 3,
            textShadowColor: "rgba(255,255,255,0.15)",
            textShadowBlur: 6,
            formatter: (params: any) => params?.data?.displayName ?? params?.name ?? "",
          },
          emphasis: {
            label: {
              color: "#182536",
              fontWeight: "bold",
              textBorderColor: "rgba(255,255,255,0.9)",
              textBorderWidth: 3,
            },
          },
          itemStyle: {
            borderColor: "rgba(255,255,255,0.95)",
            borderWidth: 1,
            areaColor: "#d9e1e8",
          },
          data: seriesData,
        },
      ],
    } as EChartsOption;
  }, [activeCode, adaptiveOverviewZoom, geoJson, getCoverageRatio, getExperienceLevel, getVisualState, initialCenterX, initialCenterY, initialView?.center, initialView?.zoom, isRegionActive, locale, mapCode]);

  useEffect(() => {
    if (!containerRef.current || !geoJson) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;
    onExportReadyRef.current?.((options?: MapImageExportOptions) => {
      if (!chartRef.current) {
        return null;
      }

      return chartRef.current.getDataURL({
        type: options?.type ?? "png",
        pixelRatio: options?.pixelRatio ?? 2,
        backgroundColor: options?.backgroundColor ?? "#f8fafc",
      });
    });

    const clickHandler = (params: any) => {
      const code =
        params?.data?.regionCode ??
        (params?.name ? featureLookupRef.current.get(params.name) : null);

      if (code) {
        onRegionClickRef.current(code);
      }
    };

    const georoamHandler = () => {
      const nextOption = chart.getOption();
      const series = Array.isArray(nextOption.series) ? nextOption.series[0] : undefined;
      viewStateRef.current = {
        zoom: Array.isArray(series?.zoom) ? series.zoom[0] : series?.zoom,
        center: Array.isArray(series?.center) ? series.center : undefined,
      };
    };

    chart.on("click", clickHandler);
    chart.on("georoam", georoamHandler);
    const resizeHandler = () => chart.resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chart.off("click", clickHandler);
      chart.off("georoam", georoamHandler);
      chart.dispose();
      chartRef.current = null;
      onExportReadyRef.current?.(null);
      viewStateRef.current = {};
    };
  }, [geoJson, mapCode]);

  useEffect(() => {
    if (!chartRef.current || !option) {
      return;
    }

    chartRef.current.setOption(option, {
      notMerge: false,
      lazyUpdate: true,
    });
  }, [option]);

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500 ${className}`.trim()}>
        {error}
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div className={`flex items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500 ${className}`.trim()}>
        {t("map.loading")}
      </div>
    );
  }

  if ((geoJson.features ?? []).length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500 ${className}`.trim()}>
        {emptyMessage}
      </div>
    );
  }

  return <div ref={containerRef} className={`w-full ${className}`.trim()} />;
}
