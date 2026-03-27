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
  coverageRatio = visualState === "visited" ? 1 : visualState === "partial" ? 0.5 : 0,
  isActive = false,
) {
  const palette = getExperiencePalette(experienceLevel);
  const baseUnvisited = "#d9e1e8";

  if (visualState === "unvisited") {
    return isActive ? "#bec9d3" : baseUnvisited;
  }

  const normalizedCoverage = Math.max(0, Math.min(coverageRatio, 1));
  const easedCoverage = Math.pow(normalizedCoverage, 0.82);
  const minBlend = 0.18;
  const maxBlend = visualState === "visited" ? 0.92 : 0.82;
  const blend = minBlend + (maxBlend - minBlend) * easedCoverage;
  const defaultColor = mixHex(baseUnvisited, palette.visited, blend);

  if (!isActive) {
    return defaultColor;
  }

  return mixHex(defaultColor, palette.activeVisited, 0.34);
}

export function getRegionStroke(isActive = false) {
  return isActive ? "#36516c" : "rgba(255,255,255,0.95)";
}

export function getRegionHoverFill(
  visualState: VisitVisualState,
  experienceLevel: ExperienceLevel | null,
  coverageRatio = visualState === "visited" ? 1 : visualState === "partial" ? 0.5 : 0,
) {
  const palette = getExperiencePalette(experienceLevel);

  if (visualState === "unvisited") {
    return "#c3ced8";
  }

  const normalizedCoverage = Math.max(0, Math.min(coverageRatio, 1));
  const easedCoverage = Math.pow(normalizedCoverage, 0.82);
  const blend = 0.3 + 0.5 * easedCoverage;

  return mixHex(palette.hover, palette.visited, blend);
}

function mixHex(fromHex: string, toHex: string, ratio: number) {
  const safeRatio = Math.max(0, Math.min(ratio, 1));
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);

  const mixed = {
    r: Math.round(from.r + (to.r - from.r) * safeRatio),
    g: Math.round(from.g + (to.g - from.g) * safeRatio),
    b: Math.round(from.b + (to.b - from.b) * safeRatio),
  };

  return rgbToHex(mixed.r, mixed.g, mixed.b);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((part) => part + part)
        .join("")
    : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}
