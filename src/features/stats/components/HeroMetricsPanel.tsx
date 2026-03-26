import type { RegionStats } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";

interface HeroMetricsPanelProps {
  stats: RegionStats;
}

export function HeroMetricsPanel({ stats }: HeroMetricsPanelProps) {
  const { t } = useI18n();

  return (
    <section className="w-full max-w-[760px]">
      <div className="overflow-hidden rounded-[28px] border border-white/65 bg-white/50 px-4 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
          <MetricGroup
            eyebrow={t("header.metricProvinceCompletion")}
            tone="amber"
            metrics={[
              {
                label: t("header.metricProvinceCompleted"),
                value: `${stats.visitedProvinces}`,
                sublabel: t("header.metricOfTotal", { total: stats.totalProvinces }),
              },
              {
                label: t("header.metricProvinceCompletionRate"),
                value: `${stats.provinceVisitPercentage}%`,
                sublabel: t("header.metricProvincesFootnote", {
                  visited: stats.visitedProvinces,
                  total: stats.totalProvinces,
                }),
              },
            ]}
          />
          <div className="hidden w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent md:block" />
          <MetricGroup
            eyebrow={t("header.metricCityCompletion")}
            tone="blue"
            metrics={[
              {
                label: t("header.metricCitiesVisited"),
                value: `${stats.visitedCities}`,
                sublabel: t("header.metricOfTotal", { total: stats.totalCities }),
              },
              {
                label: t("header.metricCityCompletionRate"),
                value: `${stats.cityVisitPercentage}%`,
                sublabel: t("header.metricCitiesFootnote", {
                  visited: stats.visitedCities,
                  total: stats.totalCities,
                }),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function MetricGroup({
  eyebrow,
  tone,
  metrics,
}: {
  eyebrow: string;
  tone: "amber" | "blue";
  metrics: Array<{
    label: string;
    value: string;
    sublabel: string;
  }>;
}) {
  const eyebrowTone =
    tone === "amber" ? "text-amber-700/80" : "text-sky-700/80";
  const numberTone =
    tone === "amber" ? "text-slate-950" : "text-slate-950";
  const dividerTone =
    tone === "amber"
      ? "from-transparent via-amber-200/70 to-transparent"
      : "from-transparent via-sky-200/70 to-transparent";

  return (
    <div className="flex-1">
      <div className="mb-3 px-2 md:px-5">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${eyebrowTone}`}>
          {eyebrow}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:gap-0">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="relative px-2 md:px-5">
            {index > 0 ? (
              <div className={`absolute left-0 top-1 hidden h-14 w-px bg-gradient-to-b md:block ${dividerTone}`} />
            ) : null}
            <p className="text-[11px] font-medium tracking-[0.01em] text-slate-500">
              {metric.label}
            </p>
            <p className={`mt-2 text-[34px] font-semibold tracking-[-0.05em] ${numberTone}`}>
              {metric.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {metric.sublabel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
