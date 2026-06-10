import { Draggable } from "@hello-pangea/dnd";

import { useBoardStore, type ColumnId, type Ticket } from "@/store/board-store";

export function TicketCard({
  ticket,
  columnId,
  index,
  faded = false,
}: {
  ticket: Ticket;
  columnId: ColumnId;
  index: number;
  faded?: boolean;
}) {
  const removeTicket = useBoardStore((s) => s.removeTicket);

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${snapshot.isDragging ? "drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]" : ""}`}
        >
          {/* Drag cues live on two elements: the drop-shadow filter must sit on
              the li so it traces the article's notched clip-path instead of
              being clipped by it, and the tilt must sit on the article so it
              doesn't compose with the library's inline drag transform. */}
          <article
            className={`group ticket-notch border-b-2 border-paper-edge bg-paper px-3 py-2.5 text-ink transition-transform motion-reduce:transition-none ${faded ? "opacity-60" : ""} ${snapshot.isDragging ? "rotate-1" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] font-medium text-ink-muted">
                #{ticket.id}
              </span>
              <span className="flex items-baseline gap-1.5">
                {ticket.rush ? (
                  <span className="-rotate-2 border border-signal px-1 font-mono text-[10px] font-medium uppercase tracking-widest text-signal">
                    Rush
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Delete ${ticket.title}`}
                  onClick={() => removeTicket(columnId, ticket.id)}
                  className="px-1 font-mono text-sm leading-none text-ink-muted opacity-0 transition-opacity hover:text-signal focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber group-hover:opacity-100 motion-reduce:transition-none"
                >
                  ×
                </button>
              </span>
            </div>
            <h3 className="mt-1.5 text-sm font-medium leading-snug">{ticket.title}</h3>
          </article>
        </li>
      )}
    </Draggable>
  );
}
