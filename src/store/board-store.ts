import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LabelColor = "blue" | "green" | "amber" | "rose" | "violet" | "slate";

export type Label = {
  id: string; // crypto.randomUUID()
  text: string;
  color: LabelColor;
};

export type ChecklistItem = {
  id: string; // crypto.randomUUID()
  text: string;
  done: boolean;
};

export type Ticket = {
  id: string; // doubles as the serial, e.g. "KB-0041"
  title: string;
  rush?: boolean;
  // Enrichment fields are optional so tickets persisted before this feature
  // (which lack them) deserialize cleanly and default at the call site.
  description?: string;
  labels?: Label[];
  dueDate?: string | null; // ISO "yyyy-mm-dd" from <input type="date">, or null
  assignee?: string; // free-text name; "" / undefined = unassigned
  checklist?: ChecklistItem[];
};

export type ColumnDef = {
  id: string; // crypto.randomUUID()
  title: string;
};

const toSerial = (n: number) => `KB-${String(n).padStart(4, "0")}`;

export type TicketLocation = {
  columnId: string;
  index: number;
};

type BoardState = {
  columns: ColumnDef[];
  ticketsByColumn: Record<string, Ticket[]>;
  nextSerial: number;
  addColumn: (title: string) => void;
  removeColumn: (columnId: string) => void;
  updateColumnTitle: (id: string, newTitle: string) => void;
  addTicket: (columnId: string, title: string) => void;
  removeTicket: (columnId: string, ticketId: string) => void;
  updateTicket: (
    columnId: string,
    ticketId: string,
    patch: Partial<
      Pick<
        Ticket,
        | "title"
        | "description"
        | "labels"
        | "dueDate"
        | "rush"
        | "assignee"
        | "checklist"
      >
    >,
  ) => void;
  moveTicket: (from: TicketLocation, to: TicketLocation) => void;
};

type PersistedState = Pick<
  BoardState,
  "columns" | "ticketsByColumn" | "nextSerial"
>;

// Reset target for pre-v1 (hardcoded-lane) payloads and corrupt data alike.
// Also the brand-new-user state: an empty board.
const EMPTY_PERSISTED: PersistedState = {
  columns: [],
  ticketsByColumn: {},
  nextSerial: 1,
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      ...EMPTY_PERSISTED,
      addColumn: (title) =>
        set((s) => {
          const id = crypto.randomUUID();
          return {
            columns: [...s.columns, { id, title }],
            ticketsByColumn: { ...s.ticketsByColumn, [id]: [] },
          };
        }),
      removeColumn: (columnId) =>
        set((s) => {
          // Cascade: the column's tickets entry goes with it.
          const rest = { ...s.ticketsByColumn };
          delete rest[columnId];
          return {
            columns: s.columns.filter((c) => c.id !== columnId),
            ticketsByColumn: rest,
          };
        }),
      updateColumnTitle: (id, newTitle) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === id ? { ...c, title: newTitle } : c,
          ),
        })),
      // Serials are never re-issued after deletes (job-ticket semantics).
      addTicket: (columnId, title) =>
        set((s) => ({
          nextSerial: s.nextSerial + 1,
          ticketsByColumn: {
            ...s.ticketsByColumn,
            [columnId]: [
              ...(s.ticketsByColumn[columnId] ?? []),
              { id: toSerial(s.nextSerial), title },
            ],
          },
        })),
      removeTicket: (columnId, ticketId) =>
        set((s) => ({
          ticketsByColumn: {
            ...s.ticketsByColumn,
            [columnId]: (s.ticketsByColumn[columnId] ?? []).filter(
              (ticket) => ticket.id !== ticketId,
            ),
          },
        })),
      // Immutable field-level patch for a single ticket. Mirrors removeTicket's
      // (columnId, ticketId) lookup; an unknown column is ignored.
      updateTicket: (columnId, ticketId, patch) =>
        set((s) => {
          const column = s.ticketsByColumn[columnId];
          if (!column) return s;
          return {
            ticketsByColumn: {
              ...s.ticketsByColumn,
              [columnId]: column.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, ...patch } : ticket,
              ),
            },
          };
        }),
      moveTicket: (from, to) =>
        set((s) => {
          const source = s.ticketsByColumn[from.columnId];
          const target = s.ticketsByColumn[to.columnId];
          if (!source || !target) return s; // unknown column — ignore
          const fromTickets = [...source];
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
          const toTickets = [...target];
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
      // Legacy key from the Shop Floor era — kept so the v1 write-back
      // overwrites stale data in place instead of orphaning it.
      name: "shop-floor-board",
      version: 1,
      // Columns are user data now, so they persist alongside the tickets.
      partialize: (s) => ({
        columns: s.columns,
        ticketsByColumn: s.ticketsByColumn,
        nextSerial: s.nextSerial,
      }),
      // Pre-v1 payloads hold the hardcoded todo/doing/done schema. No
      // migration path by design: reset to an empty board.
      migrate: () => EMPTY_PERSISTED,
      // Same-version corruption guard (hand-edited storage): reset rather
      // than crash on a malformed shape.
      merge: (persisted, current) => {
        const p = persisted as Partial<PersistedState> | null;
        if (
          !p ||
          !Array.isArray(p.columns) ||
          typeof p.ticketsByColumn !== "object" ||
          p.ticketsByColumn === null
        ) {
          return { ...current, ...EMPTY_PERSISTED };
        }
        return { ...current, ...p };
      },
      // SSR: hold the initial state through server render and React
      // hydration; Board rehydrates from localStorage in a post-mount effect.
      skipHydration: true,
    },
  ),
);
