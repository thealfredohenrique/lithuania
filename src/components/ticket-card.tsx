import { Draggable } from "@hello-pangea/dnd";

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
            className={`group flex cursor-grab flex-col gap-[7px] rounded-card border border-line bg-surface px-3.5 py-3 shadow-card transition-[border-color,box-shadow] hover:border-line-hover hover:shadow-card-hover motion-reduce:transition-none ${snapshot.isDragging ? "rotate-1 cursor-grabbing border-line-hover" : ""}`}
          >
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
                  onClick={() => removeTicket(columnId, ticket.id)}
                  className="rounded-[5px] px-1 text-sm leading-none text-ink-faint opacity-0 transition-opacity hover:text-rush focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent group-hover:opacity-100 motion-reduce:transition-none"
                >
                  ×
                </button>
              </span>
            </div>
            <h3 className="text-[13.5px] font-medium leading-[1.45] text-ink">
              {ticket.title}
            </h3>
          </article>
        </li>
      )}
    </Draggable>
  );
}
