import type { LabelColor } from "@/store/board-store";

// Selectable palette, in swatch-picker order.
export const LABEL_COLORS: LabelColor[] = [
  "blue",
  "green",
  "amber",
  "rose",
  "violet",
  "slate",
];

// Pill styles: soft background + darker text. Literal class strings so the
// Tailwind scanner emits them (no dynamic interpolation).
export const LABEL_STYLES: Record<LabelColor, string> = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
  violet: "bg-violet-100 text-violet-800",
  slate: "bg-slate-100 text-slate-700",
};

// Solid fills for the color-picker swatches.
export const LABEL_SWATCHES: Record<LabelColor, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  slate: "bg-slate-500",
};

// Parse "yyyy-mm-dd" as a *local* date (the bare string parses as UTC midnight,
// which shifts a day in negative-offset timezones).
function parseLocalDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

// "yyyy-mm-dd" -> "Jun 20" (or "Jun 20, 2027" when not the current year).
export function formatDueDate(iso: string): string {
  const date = parseLocalDate(iso);
  if (Number.isNaN(date.getTime())) return iso; // hand-edited garbage: show raw
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

// True when the due date is strictly before today (local midnight).
export function isOverdue(iso: string): boolean {
  const date = parseLocalDate(iso);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

// "yyyy-mm-dd" -> "Overdue" / "Today" / "Tomorrow" / "In N days" relative to
// local midnight. Empty string for missing/garbage input.
export function formatRelativeDueDate(iso: string): string {
  const date = parseLocalDate(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((date.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

// "Rasa K." -> "RK". Up to two leading letters from the first two words.
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}
