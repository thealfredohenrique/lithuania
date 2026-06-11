"use client";

import { FilterIcon, PlusIcon } from "@/components/icons";
import { useBoardStore } from "@/store/board-store";

export function BoardToolbar() {
  const count = useBoardStore((s) =>
    s.columns.reduce((n, c) => n + (s.ticketsByColumn[c.id]?.length ?? 0), 0),
  );

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-5 pb-1">
      <div className="flex items-baseline gap-2.5">
        <h1 className="text-xl font-[650] tracking-[-0.02em]">Main Board</h1>
        <span className="text-[13px] font-medium text-ink-faint">
          {count} {count === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Member stack is workspace chrome — the app has no accounts. */}
        <div aria-hidden="true" className="flex items-center">
          <span className="flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-[#F6E3D7] text-[11px] font-semibold text-[#A35A2A]">
            RK
          </span>
          <span className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-[#DCEEE3] text-[11px] font-semibold text-[#2A7A4F]">
            AS
          </span>
          <span className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-accent-soft text-[11px] font-semibold text-accent">
            JV
          </span>
          <span className="-ml-2 flex size-7 items-center justify-center rounded-full border border-dashed border-[#C9CDD6] bg-surface text-[11px] font-semibold text-ink-faint">
            +2
          </span>
        </div>
        <div aria-hidden="true" className="h-5 w-px bg-[#E5E7EC]" />

        <button
          type="button"
          className="flex items-center gap-[7px] rounded-lg border border-line-strong bg-surface px-3 py-[7px] text-[13px] font-medium text-ink-secondary transition-colors hover:border-[#C9CDD6] hover:bg-[#FCFCFD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <FilterIcon />
          Filter
        </button>

        <button
          type="button"
          className="flex items-center gap-[7px] rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <PlusIcon size={12} />
          New task
        </button>
      </div>
    </div>
  );
}
