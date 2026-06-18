import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

import { CardDetailsModal } from "@/components/card-details-modal";
import { CalendarIcon, DescriptionIcon } from "@/components/icons";
import { LABEL_STYLES, formatDueDate, isOverdue } from "@/lib/labels";
import { useBoardStore, type Ticket } from "@/store/board-store";

export function TicketCard({
  ticket,
  columnId,
  index,
}: {
  ticket: Ticket;
  columnId: string;
  index: number;
}) {
  const removeTicket = useBoardStore((s) => s.removeTicket);
  const [open, setOpen] = useState(false);

  const labels = ticket.labels ?? [];
  const hasDescription = Boolean(ticket.description?.trim());
  const overdue = ticket.dueDate ? isOverdue(ticket.dueDate) : false;

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${snapshot.isDragging ? "drop-shadow-drag" : ""}`}
        >
          {/* Drag cues live on two elements: the library writes an inline
              transform on the li while dragging, so our tilt must sit on the
              article to avoid being clobbered; the drop-shadow stays on the
              li with it. */}
          <article
            onClick={() => setOpen(true)}
            className={`group flex cursor-pointer flex-col gap-[7px] rounded-card border border-line bg-surface px-3.5 py-3 shadow-card transition-[border-color,box-shadow] hover:border-line-hover hover:shadow-card-hover motion-reduce:transition-none ${snapshot.isDragging ? "rotate-1 cursor-grabbing border-line-hover" : ""}`}
          >
            {labels.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {labels.map((label) => (
                  <span
                    key={label.id}
                    className={`max-w-full truncate rounded px-1.5 py-0.5 text-[10.5px] font-medium ${LABEL_STYLES[label.color]}`}
                  >
                    {label.text}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-medium tracking-[0.02em] text-ink-serial">
                {ticket.id}
              </span>
              <span className="flex items-center gap-1.5">
                {ticket.rush ? (
                  <span className="inline-flex items-center gap-[5px] rounded-full border border-rush-line bg-rush-soft px-2 py-0.5 text-[11px] font-semibold text-rush">
                    <span aria-hidden="true" className="size-[5px] rounded-full bg-rush-dot" />
                    Rush
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Delete ${ticket.title}`}
                  onClick={(e) => {
                    e.stopPropagation(); // don't open the details modal
                    removeTicket(columnId, ticket.id);
                  }}
                  className="rounded-[5px] px-1 text-sm leading-none text-ink-faint opacity-0 transition-opacity hover:text-rush focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent group-hover:opacity-100 motion-reduce:transition-none"
                >
                  ×
                </button>
              </span>
            </div>
            <h3 className="text-[13.5px] font-medium leading-[1.45] text-ink">
              {ticket.title}
            </h3>
            {hasDescription || ticket.dueDate ? (
              <div className="flex items-center gap-2 pt-0.5">
                {hasDescription ? (
                  <span className="text-ink-faint" title="Has a description">
                    <DescriptionIcon />
                    <span className="sr-only">Has a description</span>
                  </span>
                ) : null}
                {ticket.dueDate ? (
                  <span
                    className={`ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${overdue ? "bg-rush-soft text-rush" : "bg-chip text-ink-muted"}`}
                  >
                    <CalendarIcon size={11} />
                    {formatDueDate(ticket.dueDate)}
                    {overdue ? <span className="sr-only"> (overdue)</span> : null}
                  </span>
                ) : null}
              </div>
            ) : null}
          </article>
          {open ? (
            <CardDetailsModal
              ticket={ticket}
              columnId={columnId}
              onClose={() => setOpen(false)}
            />
          ) : null}
        </li>
      )}
    </Draggable>
  );
}
