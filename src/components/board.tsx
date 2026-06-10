"use client";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

import { Column } from "@/components/column";
import { useBoardStore, type ColumnId } from "@/store/board-store";

export function Board() {
  const columns = useBoardStore((s) => s.columns);
  const moveTicket = useBoardStore((s) => s.moveTicket);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return; // dropped outside any lane
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    moveTicket(
      { columnId: source.droppableId as ColumnId, index: source.index },
      { columnId: destination.droppableId as ColumnId, index: destination.index },
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="scrollbar-steel flex h-full gap-4 overflow-x-auto p-4 md:p-6">
        {columns.map((column) => (
          <Column key={column.id} {...column} />
        ))}
      </div>
    </DragDropContext>
  );
}
