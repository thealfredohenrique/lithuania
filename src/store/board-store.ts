import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  todo: [],
  doing: [],
  done: [],
};

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

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      columns: INITIAL_COLUMNS,
      ticketsByColumn: INITIAL_TICKETS,
      // Serials are never re-issued after deletes (job-ticket semantics).
      nextSerial: 1,
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
              ticketsByColumn: {
                ...s.ticketsByColumn,
                [from.columnId]: fromTickets,
              },
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
    }),
    {
      name: "shop-floor-board",
      // Lane defs (titles, hazard/faded flags) are presentation config —
      // always sourced from code, never from a stale persisted copy.
      partialize: (s) => ({
        ticketsByColumn: s.ticketsByColumn,
        nextSerial: s.nextSerial,
      }),
      // SSR: hold the initial state through server render and React
      // hydration; Board rehydrates from localStorage in a post-mount effect.
      skipHydration: true,
    },
  ),
);
