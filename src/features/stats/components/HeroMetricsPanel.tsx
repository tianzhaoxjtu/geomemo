import type { RegionStats } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { ProgressBar } from "../../../shared/ui/ProgressBar";

interface HeroMetricsPanelProps {
  stats: RegionStats;
}

export function HeroMetricsPanel({ stats }: HeroMetricsPanelProps) {
  const { t } = useI18n();
  const metrics = [
    {
      label: t("stats.visitedCities"),
      value: `${stats.visitedCities}/${stats.totalCities}`,
      progress: stats.cityVisitPercentage,
      tone: "blue" as const,
    },
    {
      label: t("stats.cityCoverage"),
      value: `${stats.cityVisitPercentage}%`,
      progress: stats.cityVisitPercentage,
      tone: "blue" as const,
    },
    {
      label: t("stats.visitedProvinces"),
      value: `${stats.visitedProvinces}/${stats.totalProvinces}`,
      progress: stats.provinceVisitPercentage,
      tone: "amber" as const,
    },
    {
      label: t("stats.provinceCoverage"),
      value: `${stats.provinceVisitPercentage}%`,
      progress: stats.provinceVisitPercentage,
      tone: "amber" as const,
    },
  ];

  return (
    <section className="w-full max-w-[760px]">
      <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/50 p-3 backdrop-blur-xl">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[24px] border border-white/80 bg-gradient-to-b from-white/95 to-slate-50/90 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.42)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {t("stats.live")}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                {metric.value}
              </p>
              <div className="mt-4">
                <ProgressBar value={metric.progress} tone={metric.tone} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
