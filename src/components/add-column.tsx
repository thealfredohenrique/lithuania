import { useState } from "react";

import { PlusIcon } from "@/components/icons";
import { useBoardStore } from "@/store/board-store";

// rail: dashed ghost button at the end of the lane row.
// hero: primary CTA inside the empty-board state.
// Input mode is identical in both, mirroring the Add-task pattern.
export function AddColumn({ variant }: { variant: "rail" | "hero" }) {
  const addColumn = useBoardStore((s) => s.addColumn);
  const [draft, setDraft] = useState<string | null>(null); // null = button mode

  if (draft === null) {
    return variant === "rail" ? (
      <button
        type="button"
        onClick={() => setDraft("")}
        className="flex w-81 shrink-0 items-center justify-center gap-[7px] rounded-lane border border-dashed border-[#C9CDD6] px-4 py-[13px] text-[13px] font-medium text-ink-muted transition-colors hover:border-line-hover hover:bg-lane hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        <PlusIcon size={11} />
        Add column
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setDraft("")}
        className="flex items-center gap-[7px] rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        <PlusIcon size={12} />
        Add column
      </button>
    );
  }

  return (
    <div
      className={`w-81 rounded-lane bg-lane p-2.5 ${variant === "rail" ? "shrink-0" : ""}`}
    >
      <input
        autoFocus
        value={draft}
        placeholder="Column title"
        aria-label="New column title"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = draft.trim();
            if (value) {
              addColumn(value);
              setDraft(null);
            }
          } else if (e.key === "Escape") {
            setDraft(null);
          }
        }}
        onBlur={() => setDraft(null)}
        className="w-full rounded-[9px] border border-accent bg-surface px-3 py-2 text-[13px] text-ink shadow-card placeholder:text-ink-faint focus:outline-none"
      />
    </div>
  );
}
