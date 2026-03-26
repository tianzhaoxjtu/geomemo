import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import type { ExperienceLevel, VisitVisualState } from "../../../entities/region/model/types";
import { getRegionFill, getRegionHoverFill, getRegionStroke } from "../lib/mapTheme";

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
  getVisualState: (regionCode: string) => VisitVisualState;
  getExperienceLevel: (regionCode: string) => ExperienceLevel | null;
  onRegionClick: (regionCode: string) => void;
  emptyMessage: string;
}

export function AdminGeoMap({
  mapCode,
  activeCode,
  getVisualState,
  getExperienceLevel,
  onRegionClick,
  emptyMessage,
}: AdminGeoMapProps) {
  const { locale, t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const featureLookupRef = useRef<Map<string, string>>(new Map());
  const onRegionClickRef = useRef(onRegionClick);
  const viewStateRef = useRef<{ zoom?: number; center?: number[] }>({});
  const [geoJson, setGeoJson] = useState<GeoJsonCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onRegionClickRef.current = onRegionClick;
  }, [onRegionClick]);

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
      const isActive = activeCode === code;
      const displayName = locale === "zh-CN" ? fullName : toEnglishName(pinyin || name);

      return {
        name,
        value: 1,
        regionCode: code,
        fullName,
        displayName,
        itemStyle: {
          areaColor: getRegionFill(visualState, experienceLevel, isActive),
          borderColor: getRegionStroke(isActive),
          borderWidth: isActive ? 2 : 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: getRegionHoverFill(visualState, experienceLevel),
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
          zoom: viewStateRef.current.zoom ?? 1.05,
          center: viewStateRef.current.center,
          scaleLimit: {
            min: 1,
            max: 8,
          },
          label: {
            show: true,
            color: "#f8fafc",
            fontSize: mapCode === "100000" ? 10 : 11,
            formatter: (params: any) => params?.data?.displayName ?? params?.name ?? "",
          },
          emphasis: {
            label: {
              color: "#ffffff",
              fontWeight: "bold",
            },
          },
          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: 1,
            areaColor: "#cbd5e1",
          },
          data: seriesData,
        },
      ],
    } as EChartsOption;
  }, [activeCode, geoJson, getExperienceLevel, getVisualState, locale, mapCode]);

  useEffect(() => {
    if (!containerRef.current || !geoJson) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

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
      <div className="flex h-[460px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
        {error}
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div className="flex h-[460px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
        {t("map.loading")}
      </div>
    );
  }

  if ((geoJson.features ?? []).length === 0) {
    return (
      <div className="flex h-[460px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return <div ref={containerRef} className="h-[460px] w-full" />;
}
