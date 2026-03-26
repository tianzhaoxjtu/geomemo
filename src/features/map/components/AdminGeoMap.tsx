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
  const [geoJson, setGeoJson] = useState<GeoJsonCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const option = useMemo<EChartsOption | null>(() => {
    if (!geoJson) {
      return null;
    }

    const mapName = `geomemo-${mapCode}`;
    echarts.registerMap(mapName, geoJson as never);

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
          zoom: 1.05,
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
          data: (geoJson.features ?? []).map((feature) => {
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
          }),
        },
      ],
    } as EChartsOption;
  }, [activeCode, geoJson, getExperienceLevel, getVisualState, locale, mapCode]);

  useEffect(() => {
    if (!containerRef.current || !option) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;
    chart.setOption(option);

    const clickHandler = (params: any) => {
      const code = params?.data?.regionCode ?? (params?.name ? featureLookup.get(params.name) : null);

      if (code) {
        onRegionClick(code);
      }
    };

    chart.on("click", clickHandler);
    const resizeHandler = () => chart.resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chart.off("click", clickHandler);
      chart.dispose();
      chartRef.current = null;
    };
  }, [featureLookup, onRegionClick, option]);

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
