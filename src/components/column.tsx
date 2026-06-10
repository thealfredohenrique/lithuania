import { TicketCard, type Ticket } from "@/components/ticket-card";

export type ColumnProps = {
  title: string;
  tickets: Ticket[];
  hazard?: boolean; // amber hazard tape on lane sign (Doing)
  faded?: boolean; // faded tickets (Done)
};

export function Column({ title, tickets, hazard = false, faded = false }: ColumnProps) {
  return (
    <section
      aria-label={title}
      className="flex h-full w-80 shrink-0 flex-col border border-edge bg-steel"
    >
      <div aria-hidden="true" className={`h-1.5 shrink-0 ${hazard ? "bg-hazard" : ""}`} />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-edge px-3 pb-2.5 pt-1.5">
        <h2 className="font-display text-base font-semibold uppercase tracking-[0.14em] text-bright">
          {title}
        </h2>
        <span className="bg-wall px-1.5 py-0.5 font-mono text-xs text-amber">
          {tickets.length}
          <span className="sr-only"> cards</span>
        </span>
      </div>
      <ul className="scrollbar-steel flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} faded={faded} />
        ))}
      </ul>
      <div className="shrink-0 p-3 pt-0">
        <button
          type="button"
          aria-label={`Add card to ${title}`}
          className="w-full border border-dashed border-edge px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber motion-reduce:transition-none"
        >
          + Add card
        </button>
      </div>
    </section>
  );
}
