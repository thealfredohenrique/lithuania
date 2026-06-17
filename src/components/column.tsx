import { Droppable } from "@hello-pangea/dnd";
import { useState } from "react";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { MoreIcon, PlusIcon } from "@/components/icons";
import { TicketCard } from "@/components/ticket-card";
import { useBoardStore, type ColumnDef, type Ticket } from "@/store/board-store";

// Stable fallback for the selector: an inline `?? []` would be a fresh
// reference on every store change and force spurious re-renders.
const NO_TICKETS: Ticket[] = [];

export function Column({ id, title }: ColumnDef) {
  const tickets = useBoardStore((s) => s.ticketsByColumn[id] ?? NO_TICKETS);
  const addTicket = useBoardStore((s) => s.addTicket);
  const removeColumn = useBoardStore((s) => s.removeColumn);
  const updateColumnTitle = useBoardStore((s) => s.updateColumnTitle);
  const [draft, setDraft] = useState<string | null>(null); // null = button mode
  const [confirming, setConfirming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);

  const commitTitle = () => {
    const value = titleDraft.trim();
    if (value) updateColumnTitle(id, value); // mirror add-column: ignore empty
    setEditing(false);
  };
  const cancelEdit = () => setEditing(false);
  const startRename = () => {
    setTitleDraft(title);
    setEditing(true);
    setMenuOpen(false);
  };
  const handleDelete = () => {
    setMenuOpen(false);
    // Preserved: empty lanes delete immediately, populated ones confirm first.
    if (tickets.length === 0) removeColumn(id);
    else setConfirming(true);
  };

  return (
    <section
      aria-label={title}
      className="flex max-h-full w-81 shrink-0 flex-col rounded-lane bg-lane"
    >
      <div className="group flex shrink-0 items-center gap-2 px-4 pt-3.5 pb-2.5">
        {editing ? (
          <>
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-dot-todo" />
            <input
              autoFocus
              value={titleDraft}
              aria-label={`Rename ${title} column`}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                else if (e.key === "Escape") cancelEdit();
              }}
              className="min-w-0 flex-1 rounded-[7px] bg-surface px-2 py-1 text-[13.5px] font-semibold tracking-[-0.005em] text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              onClick={commitTitle}
              className="shrink-0 rounded-[6px] px-1.5 py-1 text-[12px] font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="shrink-0 rounded-[6px] px-1.5 py-1 text-[12px] font-medium text-ink-muted transition-colors hover:bg-chip hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span aria-hidden="true" className="size-2 rounded-full bg-dot-todo" />
            <h2 className="text-[13.5px] font-semibold tracking-[-0.005em]">{title}</h2>
            <span className="rounded-md bg-chip px-[7px] py-px text-xs font-semibold text-ink-muted">
              {tickets.length}
              <span className="sr-only"> tasks</span>
            </span>
            <div className="relative ml-auto">
              <button
                type="button"
                aria-label={`Column options for ${title}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className={`flex size-6.5 items-center justify-center rounded-[7px] text-ink-faint transition-[opacity,background-color,color] hover:bg-chip hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:opacity-100 motion-reduce:transition-none ${menuOpen ? "bg-chip text-ink opacity-100" : "opacity-0"}`}
              >
                <MoreIcon />
              </button>
              {menuOpen ? (
                <>
                  {/* Invisible backdrop: catches the outside click that closes the menu. */}
                  <div
                    aria-hidden="true"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-10"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-[10px] border border-line bg-surface py-1 shadow-card-hover"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={startRename}
                      className="flex w-full items-center px-3 py-1.5 text-left text-[13px] font-medium text-ink-secondary transition-colors hover:bg-fill hover:text-ink focus-visible:bg-fill focus-visible:outline-none motion-reduce:transition-none"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleDelete}
                      className="flex w-full items-center px-3 py-1.5 text-left text-[13px] font-medium text-rush transition-colors hover:bg-rush-soft focus-visible:bg-rush-soft focus-visible:outline-none motion-reduce:transition-none"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
      {/* space-y (margins), not gap: the dnd engine measures margin boxes when
          displacing siblings, but flex gap is invisible to it. min-h keeps an
          emptied lane droppable now that columns hug their content. */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`scrollbar-subtle flex min-h-10 flex-1 flex-col space-y-[9px] overflow-y-auto px-2.5 pt-0.5 pb-1.5 transition-colors motion-reduce:transition-none ${snapshot.isDraggingOver ? "bg-accent/5" : ""}`}
          >
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                columnId={id}
                index={index}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <div className="shrink-0 px-2.5 pt-1 pb-3">
        {draft === null ? (
          <button
            type="button"
            aria-label={`Add task to ${title}`}
            onClick={() => setDraft("")}
            className="flex w-full items-center gap-[7px] rounded-[9px] px-2.5 py-[9px] text-left text-[13px] font-medium text-ink-muted transition-colors hover:bg-chip hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            <PlusIcon size={11} />
            Add task
          </button>
        ) : (
          <input
            autoFocus
            value={draft}
            placeholder="Task title"
            aria-label={`New task title for ${title}`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = draft.trim();
                if (value) {
                  addTicket(id, value);
                  setDraft(null);
                }
              } else if (e.key === "Escape") {
                setDraft(null);
              }
            }}
            onBlur={() => setDraft(null)}
            className="w-full rounded-[9px] border border-accent bg-surface px-3 py-2 text-[13px] text-ink shadow-card placeholder:text-ink-faint focus:outline-none"
          />
        )}
      </div>
      {confirming ? (
        <ConfirmDeleteDialog
          columnTitle={title}
          ticketCount={tickets.length}
          onCancel={() => setConfirming(false)}
          onConfirm={() => removeColumn(id)}
        />
      ) : null}
    </section>
  );
}
