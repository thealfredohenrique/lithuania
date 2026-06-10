export type Ticket = {
  id: string; // doubles as the serial, e.g. "KB-0041"
  title: string;
  rush?: boolean;
};

export function TicketCard({
  ticket,
  faded = false,
}: {
  ticket: Ticket;
  faded?: boolean;
}) {
  return (
    <li>
      <article
        className={`ticket-notch border-b-2 border-paper-edge bg-paper px-3 py-2.5 text-ink ${faded ? "opacity-60" : ""}`}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] font-medium text-ink-muted">
            #{ticket.id}
          </span>
          {ticket.rush ? (
            <span className="-rotate-2 border border-signal px-1 font-mono text-[10px] font-medium uppercase tracking-widest text-signal">
              Rush
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 text-sm font-medium leading-snug">{ticket.title}</h3>
      </article>
    </li>
  );
}
