interface ProgressBarProps {
  value: number;
  tone?: "blue" | "amber" | "slate";
}

export function ProgressBar({ value, tone = "blue" }: ProgressBarProps) {
  const toneClasses = {
    blue: "from-sky-500 via-blue-500 to-indigo-500",
    amber: "from-amber-400 via-orange-400 to-amber-500",
    slate: "from-slate-400 via-slate-500 to-slate-600",
  };

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${toneClasses[tone]} transition-[width] duration-500 ease-out`}
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}
