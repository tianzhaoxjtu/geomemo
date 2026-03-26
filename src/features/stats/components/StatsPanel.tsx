import type { RegionStats } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { ProgressBar } from "../../../shared/ui/ProgressBar";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface StatsPanelProps {
  title: string;
  stats: RegionStats;
}

export function StatsPanel({ title, stats }: StatsPanelProps) {
  const { t } = useI18n();

  return (
    <SurfaceCard eyebrow={t("stats.section")} title={title} description={t("stats.description")}>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t("stats.visitedCities")}
          value={`${stats.visitedCities}/${stats.totalCities}`}
          progress={stats.cityVisitPercentage}
          tone="blue"
        />
        <StatCard label={t("stats.cityCoverage")} value={`${stats.cityVisitPercentage}%`} progress={stats.cityVisitPercentage} tone="blue" />
        {"visitedProvinces" in stats && "totalProvinces" in stats ? (
          <>
            <StatCard
              label={t("stats.visitedProvinces")}
              value={`${stats.visitedProvinces}/${stats.totalProvinces}`}
              progress={stats.provinceVisitPercentage}
              tone="amber"
            />
            <StatCard
              label={t("stats.provinceCoverage")}
              value={`${stats.provinceVisitPercentage}%`}
              progress={stats.provinceVisitPercentage}
              tone="amber"
            />
          </>
        ) : null}
      </div>
      <div className="mt-5 rounded-[24px] bg-slate-50/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">{t("stats.experienceBreakdown")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("stats.experienceBreakdownDescription")}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <BreakdownPill
            label={t("visit.experience.long")}
            value={`${stats.experienceBreakdown.long.count}`}
            percentage={stats.experienceBreakdown.long.percentage}
            tone="bg-blue-700"
          />
          <BreakdownPill
            label={t("visit.experience.medium")}
            value={`${stats.experienceBreakdown.medium.count}`}
            percentage={stats.experienceBreakdown.medium.percentage}
            tone="bg-blue-500"
          />
          <BreakdownPill
            label={t("visit.experience.short")}
            value={`${stats.experienceBreakdown.short.count}`}
            percentage={stats.experienceBreakdown.short.percentage}
            tone="bg-sky-300"
          />
        </div>
      </div>
    </SurfaceCard>
  );
}

function StatCard({
  label,
  value,
  progress,
  tone,
}: {
  label: string;
  value: string;
  progress: number;
  tone: "blue" | "amber";
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-[24px] border border-white/70 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{t("stats.live")}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
      <div className="mt-4">
        <ProgressBar value={progress} tone={tone} />
      </div>
    </div>
  );
}

function BreakdownPill({
  label,
  value,
  percentage,
  tone,
}: {
  label: string;
  value: string;
  percentage: number;
  tone: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white px-3 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
          <span className="text-xs font-medium text-slate-600">{label}</span>
        </div>
        <span className="text-xs text-slate-400">{percentage}%</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
    </div>
  );
}
