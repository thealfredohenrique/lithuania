import { useBoardStore, type ColumnId, type Ticket } from "@/store/board-store";

export function TicketCard({
  ticket,
  columnId,
  faded = false,
}: {
  ticket: Ticket;
  columnId: ColumnId;
  faded?: boolean;
}) {
  const removeTicket = useBoardStore((s) => s.removeTicket);

  return (
    <li>
      <article
        className={`group ticket-notch border-b-2 border-paper-edge bg-paper px-3 py-2.5 text-ink ${faded ? "opacity-60" : ""}`}
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
  );
}
