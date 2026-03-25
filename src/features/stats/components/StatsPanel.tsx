import type { RegionStats } from "../../../entities/region/model/types";
import { ProgressBar } from "../../../shared/ui/ProgressBar";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface StatsPanelProps {
  title: string;
  stats: RegionStats | { totalCities: number; visitedCities: number; cityVisitPercentage: number };
}

export function StatsPanel({ title, stats }: StatsPanelProps) {
  return (
    <SurfaceCard eyebrow="Statistics" title={title} description="Progress updates instantly as you mark cities and provinces.">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Visited cities"
          value={`${stats.visitedCities}/${stats.totalCities}`}
          progress={stats.cityVisitPercentage}
          tone="blue"
        />
        <StatCard label="City coverage" value={`${stats.cityVisitPercentage}%`} progress={stats.cityVisitPercentage} tone="blue" />
        {"visitedProvinces" in stats && "totalProvinces" in stats ? (
          <>
            <StatCard
              label="Visited provinces"
              value={`${stats.visitedProvinces}/${stats.totalProvinces}`}
              progress={stats.provinceVisitPercentage}
              tone="amber"
            />
            <StatCard
              label="Province coverage"
              value={`${stats.provinceVisitPercentage}%`}
              progress={stats.provinceVisitPercentage}
              tone="amber"
            />
          </>
        ) : null}
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
  return (
    <div className="rounded-[24px] border border-white/70 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Live</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
      <div className="mt-4">
        <ProgressBar value={progress} tone={tone} />
      </div>
    </div>
  );
}
