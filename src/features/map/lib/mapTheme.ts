import type { ExperienceLevel, VisitVisualState } from "../../../entities/region/model/types";

function getExperiencePalette(experienceLevel: ExperienceLevel | null) {
  switch (experienceLevel) {
    case "long":
      return {
        visited: "#1d4ed8",
        partial: "#8fb4ff",
        hover: "#1e40af",
      };
    case "medium":
      return {
        visited: "#3b82f6",
        partial: "#a9ccff",
        hover: "#2563eb",
      };
    case "short":
      return {
        visited: "#7cc7ff",
        partial: "#d7ecff",
        hover: "#38bdf8",
      };
    default:
      return {
        visited: "#2563eb",
        partial: "#bfdcff",
        hover: "#1d4ed8",
      };
  }
}

export function getRegionFill(
  visualState: VisitVisualState,
  experienceLevel: ExperienceLevel | null,
  isActive = false,
) {
  const palette = getExperiencePalette(experienceLevel);
  const colorMap: Record<VisitVisualState, string> = {
    visited: palette.visited,
    partial: palette.partial,
    unvisited: "#cbd5e1",
  };

  return isActive ? "#0f172a" : colorMap[visualState];
}

export function getRegionStroke(isActive = false) {
  return isActive ? "#f8fafc" : "#ffffff";
}

export function getRegionHoverFill(
  visualState: VisitVisualState,
  experienceLevel: ExperienceLevel | null,
) {
  const palette = getExperiencePalette(experienceLevel);
  const colorMap: Record<VisitVisualState, string> = {
    visited: palette.hover,
    partial: palette.hover,
    unvisited: "#94a3b8",
  };

  return colorMap[visualState];
}
