import type { ExperienceLevel, VisitVisualState } from "../../../entities/region/model/types";

function getExperiencePalette(experienceLevel: ExperienceLevel | null) {
  switch (experienceLevel) {
    case "long":
      return {
        visited: "#3f6487",
        partial: "#b8cadb",
        activeVisited: "#2f4f6f",
        activePartial: "#9fb7cb",
        hover: "#55799e",
      };
    case "medium":
      return {
        visited: "#5d82a5",
        partial: "#c8d7e4",
        activeVisited: "#4a6f91",
        activePartial: "#afc3d5",
        hover: "#7398ba",
      };
    case "short":
      return {
        visited: "#7c9ab3",
        partial: "#d7e1ea",
        activeVisited: "#6888a2",
        activePartial: "#bcccd9",
        hover: "#92aec6",
      };
    default:
      return {
        visited: "#567b9f",
        partial: "#c3d3e2",
        activeVisited: "#436788",
        activePartial: "#aabfd2",
        hover: "#6f93b5",
      };
  }
}

export function getRegionFill(
  visualState: VisitVisualState,
  experienceLevel: ExperienceLevel | null,
  isActive = false,
) {
  const palette = getExperiencePalette(experienceLevel);
  const colorMap: Record<VisitVisualState, { default: string; active: string }> = {
    visited: {
      default: palette.visited,
      active: palette.activeVisited,
    },
    partial: {
      default: palette.partial,
      active: palette.activePartial,
    },
    unvisited: {
      default: "#d9e1e8",
      active: "#bec9d3",
    },
  };

  const target = colorMap[visualState];

  return isActive ? target.active : target.default;
}

export function getRegionStroke(isActive = false) {
  return isActive ? "#36516c" : "rgba(255,255,255,0.95)";
}

export function getRegionHoverFill(
  visualState: VisitVisualState,
  experienceLevel: ExperienceLevel | null,
) {
  const palette = getExperiencePalette(experienceLevel);
  const colorMap: Record<VisitVisualState, string> = {
    visited: palette.hover,
    partial: palette.hover,
    unvisited: "#c3ced8",
  };

  return colorMap[visualState];
}
