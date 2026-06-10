"use client";

import { Column } from "@/components/column";
import { useBoardStore } from "@/store/board-store";

export function Board() {
  const columns = useBoardStore((s) => s.columns);

  return (
    <div className="scrollbar-steel flex h-full gap-4 overflow-x-auto p-4 md:p-6">
      {columns.map((column) => (
        <Column key={column.id} {...column} />
      ))}
    </div>
  );
}
