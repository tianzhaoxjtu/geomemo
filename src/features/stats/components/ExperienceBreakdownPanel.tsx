import type { RegionStats } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface ExperienceBreakdownPanelProps {
  stats: RegionStats;
}

export function ExperienceBreakdownPanel({ stats }: ExperienceBreakdownPanelProps) {
  const { t } = useI18n();

  return (
    <SurfaceCard
      eyebrow={t("stats.section")}
      title={t("stats.experienceBreakdown")}
      description={t("stats.experienceBreakdownDescription")}
    >
      <div className="space-y-3">
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
    </SurfaceCard>
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
    <div className="rounded-[24px] border border-white/80 bg-gradient-to-b from-white/95 to-slate-50 px-4 py-4 shadow-sm shadow-slate-900/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
          <span className="text-xs font-medium tracking-[0.01em] text-slate-500">{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-400">{percentage}%</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">{value}</p>
        <div className="h-px flex-1 self-center rounded-full bg-slate-200/80" />
      </div>
    </div>
  );
}
