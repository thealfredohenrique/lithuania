import { create } from "zustand";

export type Ticket = {
  id: string; // doubles as the serial, e.g. "KB-0041"
  title: string;
  rush?: boolean;
};

export type ColumnId = "todo" | "doing" | "done";

export type ColumnDef = {
  id: ColumnId;
  title: string;
  hazard?: boolean; // amber hazard tape on lane sign (Doing)
  faded?: boolean; // faded tickets (Done)
};

const INITIAL_COLUMNS: ColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing", hazard: true },
  { id: "done", title: "Done", faded: true },
];

const INITIAL_TICKETS: Record<ColumnId, Ticket[]> = {
  todo: [
    { id: "KB-0006", title: "Drag and drop between lanes" },
    { id: "KB-0007", title: "Wire up local persistence (IndexedDB)" },
    { id: "KB-0008", title: "Ticket detail view and editing" },
    { id: "KB-0009", title: "Keyboard navigation across the board" },
  ],
  doing: [
    { id: "KB-0004", title: "Board layout and lane components", rush: true },
    { id: "KB-0005", title: "Design tokens — shop floor theme" },
  ],
  done: [
    { id: "KB-0001", title: "Project scaffold (Next 16 + Tailwind v4)" },
    { id: "KB-0002", title: "Decide: local-first, no accounts, no backend" },
    { id: "KB-0003", title: "Shop floor visual direction" },
  ],
};

// Serials are never re-issued after deletes (job-ticket semantics).
const seedSerial =
  Math.max(
    ...Object.values(INITIAL_TICKETS)
      .flat()
      .map((ticket) => Number(ticket.id.slice(3))),
  ) + 1;

const toSerial = (n: number) => `KB-${String(n).padStart(4, "0")}`;

export type TicketLocation = {
  columnId: ColumnId;
  index: number;
};

type BoardState = {
  columns: ColumnDef[];
  ticketsByColumn: Record<ColumnId, Ticket[]>;
  nextSerial: number;
  addTicket: (columnId: ColumnId, title: string) => void;
  removeTicket: (columnId: ColumnId, ticketId: string) => void;
  moveTicket: (from: TicketLocation, to: TicketLocation) => void;
};

export const useBoardStore = create<BoardState>()((set) => ({
  columns: INITIAL_COLUMNS,
  ticketsByColumn: INITIAL_TICKETS,
  nextSerial: seedSerial,
  addTicket: (columnId, title) =>
    set((s) => ({
      nextSerial: s.nextSerial + 1,
      ticketsByColumn: {
        ...s.ticketsByColumn,
        [columnId]: [
          ...s.ticketsByColumn[columnId],
          { id: toSerial(s.nextSerial), title },
        ],
      },
    })),
  removeTicket: (columnId, ticketId) =>
    set((s) => ({
      ticketsByColumn: {
        ...s.ticketsByColumn,
        [columnId]: s.ticketsByColumn[columnId].filter(
          (ticket) => ticket.id !== ticketId,
        ),
      },
    })),
  moveTicket: (from, to) =>
    set((s) => {
      const fromTickets = [...s.ticketsByColumn[from.columnId]];
      const [moved] = fromTickets.splice(from.index, 1);
      if (!moved) return s; // stale index — ignore
      if (from.columnId === to.columnId) {
        fromTickets.splice(to.index, 0, moved);
        return {
          ticketsByColumn: { ...s.ticketsByColumn, [from.columnId]: fromTickets },
        };
      }
      const toTickets = [...s.ticketsByColumn[to.columnId]];
      toTickets.splice(to.index, 0, moved);
      return {
        ticketsByColumn: {
          ...s.ticketsByColumn,
          [from.columnId]: fromTickets,
          [to.columnId]: toTickets,
        },
      };
    }),
}));
