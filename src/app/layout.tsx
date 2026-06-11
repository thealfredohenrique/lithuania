import type { Metadata } from "next";
import "./globals.css";

import { BellIcon, SearchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Lithuania — Kanban",
  description: "A local-first kanban board for the Lithuania workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex h-dvh flex-col overflow-hidden bg-canvas font-sans text-ink">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line bg-surface px-5">
          {/* Brand + section nav. Timeline/Reports are visual chrome for now,
              so they render as inert spans rather than dead links. */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-[9px]">
              <span
                aria-hidden="true"
                className="flex size-6.5 items-center justify-center rounded-[7px] bg-accent text-[13px] font-bold tracking-[0.02em] text-white"
              >
                L
              </span>
              <span className="text-[14.5px] font-semibold tracking-[-0.01em]">
                Lithuania
              </span>
            </div>
            <div aria-hidden="true" className="h-5 w-px bg-line" />
            <nav className="flex items-center gap-1">
              <span className="rounded-[7px] bg-fill px-[11px] py-1.5 text-[13px] font-semibold text-ink">
                Board
              </span>
              <span className="px-[11px] py-1.5 text-[13px] font-medium text-ink-muted">
                Timeline
              </span>
              <span className="px-[11px] py-1.5 text-[13px] font-medium text-ink-muted">
                Reports
              </span>
            </nav>
          </div>

          <div
            aria-hidden="true"
            className="flex max-w-90 flex-1 items-center gap-2 rounded-[9px] bg-fill px-3 py-[7px]"
          >
            <SearchIcon />
            <span className="text-[13px] text-ink-faint">Search tasks…</span>
            <span className="ml-auto rounded-[5px] border border-line-strong bg-surface px-[5px] py-px text-[11px] text-ink-faint">
              ⌘K
            </span>
          </div>

          <div aria-hidden="true" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg">
              <BellIcon />
            </span>
            <span className="h-5 w-px bg-line" />
            <span className="flex size-7.5 items-center justify-center rounded-full border border-accent-line bg-accent-soft text-xs font-semibold text-accent">
              JV
            </span>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
