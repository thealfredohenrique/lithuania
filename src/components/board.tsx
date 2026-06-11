"use client";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";

import { AddColumn } from "@/components/add-column";
import { Column } from "@/components/column";
import { ColumnsIcon } from "@/components/icons";
import { useBoardStore } from "@/store/board-store";

export function Board() {
  const columns = useBoardStore((s) => s.columns);
  const moveTicket = useBoardStore((s) => s.moveTicket);

  // Load persisted state after mount: SSR HTML and the hydration render both
  // show the initial state (skipHydration), so they always match; saved data
  // swaps in right after. `?.` covers storage-denied browsers, where the
  // persist API is never attached to the store.
  useEffect(() => {
    useBoardStore.persist?.rehydrate();
  }, []);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return; // dropped outside any lane
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    moveTicket(
      { columnId: source.droppableId, index: source.index },
      { columnId: destination.droppableId, index: destination.index },
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="flex max-w-90 flex-col items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-lane border border-line bg-surface shadow-card">
              <ColumnsIcon />
            </span>
            <h2 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-ink">
              Set up your board
            </h2>
            <p className="mt-1 text-[13px] leading-[1.55] text-ink-muted">
              Add a column for each stage of your workflow — tasks live inside
              columns.
            </p>
            <div className="mt-5">
              <AddColumn variant="hero" />
            </div>
          </div>
        </div>
      ) : (
        <div className="scrollbar-subtle flex min-h-0 flex-1 items-start gap-4 overflow-x-auto px-6 pt-4 pb-7">
          {columns.map((column) => (
            <Column key={column.id} {...column} />
          ))}
          <AddColumn variant="rail" />
        </div>
      )}
    </DragDropContext>
  );
}
