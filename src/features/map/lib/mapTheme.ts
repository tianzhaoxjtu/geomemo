import type { VisitVisualState } from "../../../entities/region/model/types";

export function getRegionFill(visualState: VisitVisualState, isActive = false) {
  const colorMap: Record<VisitVisualState, string> = {
    visited: "#2563eb",
    partial: "#f59e0b",
    unvisited: "#cbd5e1",
  };

  return isActive ? "#0f172a" : colorMap[visualState];
}

export function getRegionStroke(isActive = false) {
  return isActive ? "#f8fafc" : "#ffffff";
}

export function getRegionHoverFill(visualState: VisitVisualState) {
  const colorMap: Record<VisitVisualState, string> = {
    visited: "#1d4ed8",
    partial: "#d97706",
    unvisited: "#94a3b8",
  };

  return colorMap[visualState];
}
