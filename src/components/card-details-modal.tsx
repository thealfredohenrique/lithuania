import { useEffect, useRef, useState } from "react";

import { CalendarIcon, CheckIcon, MoreIcon, UserIcon } from "@/components/icons";
import {
  LABEL_COLORS,
  LABEL_STYLES,
  LABEL_SWATCHES,
  formatRelativeDueDate,
  getInitials,
  isOverdue,
} from "@/lib/labels";
import {
  useBoardStore,
  type LabelColor,
  type Ticket,
} from "@/store/board-store";

export function CardDetailsModal({
  ticket,
  columnId,
  onClose,
}: {
  ticket: Ticket;
  columnId: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const updateTicket = useBoardStore((s) => s.updateTicket);
  const removeTicket = useBoardStore((s) => s.removeTicket);
  // The column a card lives in *is* its status on a kanban board, so the
  // (read-only) Status row mirrors the column title rather than a stored field.
  const columnTitle = useBoardStore(
    (s) => s.columns.find((c) => c.id === columnId)?.title,
  );

  // Title keeps a local draft so an intermediate empty value is allowed while
  // typing without ever clearing the card's stored title (mirrors column.tsx).
  const [titleDraft, setTitleDraft] = useState(ticket.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adderOpen, setAdderOpen] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [labelColor, setLabelColor] = useState<LabelColor>(LABEL_COLORS[0]);
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [assigneeDraft, setAssigneeDraft] = useState(ticket.assignee ?? "");
  const [itemDraft, setItemDraft] = useState("");

  const labels = ticket.labels ?? [];
  const checklist = ticket.checklist ?? [];
  const doneCount = checklist.filter((c) => c.done).length;
  const totalCount = checklist.length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const dueRelative = ticket.dueDate ? formatRelativeDueDate(ticket.dueDate) : "";
  const overdue = ticket.dueDate ? isOverdue(ticket.dueDate) : false;

  // React can't open a modal dialog declaratively; showModal() buys the focus
  // trap, Escape handling, and ::backdrop for free (same as ConfirmDeleteDialog).
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const commitTitle = (value: string) => {
    setTitleDraft(value);
    const trimmed = value.trim();
    if (trimmed) updateTicket(columnId, ticket.id, { title: trimmed });
  };

  const commitAssignee = () => {
    updateTicket(columnId, ticket.id, { assignee: assigneeDraft.trim() });
    setEditingAssignee(false);
  };
  const startAssigneeEdit = () => {
    setAssigneeDraft(ticket.assignee ?? "");
    setEditingAssignee(true);
  };

  const addLabel = () => {
    const text = labelText.trim();
    if (!text) return;
    updateTicket(columnId, ticket.id, {
      labels: [...labels, { id: crypto.randomUUID(), text, color: labelColor }],
    });
    setLabelText("");
  };
  const removeLabel = (labelId: string) => {
    updateTicket(columnId, ticket.id, {
      labels: labels.filter((l) => l.id !== labelId),
    });
  };

  const addItem = () => {
    const text = itemDraft.trim();
    if (!text) return;
    updateTicket(columnId, ticket.id, {
      checklist: [...checklist, { id: crypto.randomUUID(), text, done: false }],
    });
    setItemDraft("");
  };
  const toggleItem = (itemId: string) => {
    updateTicket(columnId, ticket.id, {
      checklist: checklist.map((c) =>
        c.id === itemId ? { ...c, done: !c.done } : c,
      ),
    });
  };
  const removeItem = (itemId: string) => {
    updateTicket(columnId, ticket.id, {
      checklist: checklist.filter((c) => c.id !== itemId),
    });
  };

  const deleteCard = () => {
    setMenuOpen(false);
    removeTicket(columnId, ticket.id);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose} // fires on Escape via the native cancel→close flow
      onClick={(e) => {
        // Stop clicks from bubbling out to the card's open-on-click handler.
        e.stopPropagation();
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      className="m-auto w-[580px] max-w-[calc(100vw-2rem)] rounded-[16px] border border-line bg-surface p-0 shadow-[0_24px_60px_rgb(16_24_40/0.20),0_4px_12px_rgb(16_24_40/0.06)] backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="cd-modal-enter flex max-h-[calc(100dvh-4rem)] flex-col">
        {/* ===== Header ===== */}
        <div className="shrink-0 border-b border-line px-[22px] pt-5 pb-4">
          <div className="flex items-center gap-[9px]">
            <span className="font-mono text-[11.5px] font-medium tracking-[0.03em] text-ink-serial">
              {ticket.id}
            </span>
            <span aria-hidden="true" className="text-line-hover">
              ·
            </span>
            <span className="text-[12px] font-medium text-ink-faint">Main Board</span>
            <button
              type="button"
              aria-pressed={Boolean(ticket.rush)}
              onClick={() => updateTicket(columnId, ticket.id, { rush: !ticket.rush })}
              className={`ml-1 inline-flex items-center gap-[5px] rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${
                ticket.rush
                  ? "border-rush-line bg-rush-soft text-rush"
                  : "border-line bg-surface text-ink-faint hover:border-line-hover"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-[5px] rounded-full ${ticket.rush ? "bg-rush-dot" : "bg-dot-todo"}`}
              />
              {ticket.rush ? "Rush" : "Set priority"}
            </button>
            <div className="ml-auto flex items-center gap-0.5">
              <div className="relative">
                <button
                  type="button"
                  aria-label="More actions"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  className={`flex size-7.5 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-fill hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${menuOpen ? "bg-fill text-ink-secondary" : ""}`}
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
                        onClick={deleteCard}
                        className="flex w-full items-center px-3 py-1.5 text-left text-[13px] font-medium text-rush transition-colors hover:bg-rush-soft focus-visible:bg-rush-soft focus-visible:outline-none motion-reduce:transition-none"
                      >
                        Delete card
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex size-7.5 items-center justify-center rounded-lg text-[18px] leading-none text-ink-faint transition-colors hover:bg-fill hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
              >
                ×
              </button>
            </div>
          </div>
          <input
            value={titleDraft}
            aria-label="Card title"
            placeholder="Untitled task"
            onChange={(e) => commitTitle(e.target.value)}
            className="mt-2.5 -mx-2 w-[calc(100%+1rem)] rounded-lg border border-transparent bg-transparent px-2 py-1 text-[20px] font-[650] leading-[1.3] tracking-[-0.02em] text-ink placeholder:text-ink-faint hover:bg-fill focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* ===== Scroll body ===== */}
        <div className="scrollbar-subtle flex-1 overflow-y-auto px-[22px] py-5">
          {/* Properties */}
          <div className="grid grid-cols-[92px_1fr] items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-[7px] text-[12.5px] font-medium text-ink-faint">
              <span aria-hidden="true" className="inline-flex">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
              Status
            </div>
            <div className="py-[5px]">
              <span className="inline-flex items-center gap-[7px] rounded-lg border border-line bg-surface px-2.5 py-[5px] text-[13px] font-semibold text-ink-secondary">
                <span aria-hidden="true" className="size-2 rounded-full bg-dot-todo" />
                {columnTitle ?? "—"}
              </span>
            </div>

            <div className="flex items-center gap-[7px] text-[12.5px] font-medium text-ink-faint">
              <UserIcon />
              Assignee
            </div>
            <div className="py-1">
              {editingAssignee ? (
                <input
                  autoFocus
                  value={assigneeDraft}
                  aria-label="Assignee name"
                  placeholder="Name…"
                  onChange={(e) => setAssigneeDraft(e.target.value)}
                  onBlur={commitAssignee}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitAssignee();
                    else if (e.key === "Escape") setEditingAssignee(false);
                  }}
                  className="w-48 max-w-full rounded-lg border border-line-strong bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              ) : ticket.assignee ? (
                <button
                  type="button"
                  onClick={startAssigneeEdit}
                  className="flex items-center gap-2 rounded-lg px-1 py-0.5 transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                >
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent-soft text-[10.5px] font-semibold text-accent">
                    {getInitials(ticket.assignee)}
                  </span>
                  <span className="text-[13px] font-medium text-ink-secondary">
                    {ticket.assignee}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startAssigneeEdit}
                  className="rounded-lg px-2 py-1 text-[13px] font-medium text-ink-faint transition-colors hover:bg-fill hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                >
                  Assign…
                </button>
              )}
            </div>

            <div className="flex items-center gap-[7px] text-[12.5px] font-medium text-ink-faint">
              <CalendarIcon size={13} />
              Due date
            </div>
            <div className="flex items-center gap-2 py-1">
              <input
                type="date"
                value={ticket.dueDate ?? ""}
                aria-label="Due date"
                onChange={(e) =>
                  updateTicket(columnId, ticket.id, {
                    dueDate: e.target.value || null,
                  })
                }
                className="rounded-lg border border-line-strong bg-surface px-2.5 py-[5px] text-[13px] font-medium text-ink-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {dueRelative ? (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${overdue ? "bg-rush-soft text-rush" : "bg-success-soft text-success"}`}
                >
                  {dueRelative}
                </span>
              ) : null}
              {ticket.dueDate ? (
                <button
                  type="button"
                  onClick={() => updateTicket(columnId, ticket.id, { dueDate: null })}
                  className="rounded-md px-1.5 py-1 text-[12px] font-medium text-ink-faint transition-colors hover:bg-fill hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {/* Labels */}
          <section className="mt-[22px]">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
              Labels
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {labels.map((label) => (
                <span
                  key={label.id}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium ${LABEL_STYLES[label.color]}`}
                >
                  {label.text}
                  <button
                    type="button"
                    aria-label={`Remove ${label.text} label`}
                    onClick={() => removeLabel(label.id)}
                    className="-mr-0.5 ml-0.5 rounded text-[13px] leading-none opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current motion-reduce:transition-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                aria-expanded={adderOpen}
                onClick={() => setAdderOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded-md border border-dashed border-line-hover bg-surface px-2 py-[3px] text-[12px] font-semibold text-ink-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
              >
                <span aria-hidden="true" className="text-[13px] leading-none">
                  +
                </span>
                Add
              </button>
            </div>
            {adderOpen ? (
              <div className="mt-2.5 rounded-[11px] border border-line bg-canvas p-3">
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={labelText}
                    placeholder="Label name…"
                    aria-label="New label text"
                    onChange={(e) => setLabelText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLabel();
                      }
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 py-[7px] text-[13px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={addLabel}
                    disabled={!labelText.trim()}
                    className="shrink-0 rounded-lg bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="mr-0.5 text-[12px] text-ink-muted">Color</span>
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`${color} label color`}
                      aria-pressed={labelColor === color}
                      onClick={() => setLabelColor(color)}
                      className={`size-5 rounded-full ${LABEL_SWATCHES[color]} transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${labelColor === color ? "ring-2 ring-ink/30 ring-offset-2 ring-offset-canvas" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* Description */}
          <section className="mt-[22px]">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
              Description
            </h3>
            <textarea
              value={ticket.description ?? ""}
              placeholder="Add a more detailed description…"
              aria-label="Description"
              rows={4}
              onChange={(e) =>
                updateTicket(columnId, ticket.id, { description: e.target.value })
              }
              className="w-full resize-y rounded-[11px] border border-line-strong bg-surface px-3.5 py-3 text-[13.5px] leading-[1.65] text-ink-secondary placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </section>

          {/* Checklist */}
          <section className="mt-[22px]">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
                Checklist
              </h3>
              {totalCount > 0 ? (
                <span className="text-[12px] font-semibold text-ink-faint">
                  {doneCount}/{totalCount}
                </span>
              ) : null}
            </div>
            {totalCount > 0 ? (
              <div className="h-[5px] overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-success transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null}
            <div className="mt-2.5 flex flex-col gap-0.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-1 rounded-lg pr-1 transition-colors hover:bg-fill motion-reduce:transition-none"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.done}
                    onClick={() => toggleItem(item.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-[7px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors motion-reduce:transition-none ${item.done ? "border-success bg-success text-white" : "border-line-hover bg-surface text-transparent"}`}
                    >
                      <CheckIcon size={11} />
                    </span>
                    <span
                      className={`truncate text-[13.5px] ${item.done ? "text-ink-faint line-through" : "text-ink-secondary"}`}
                    >
                      {item.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove "${item.text}"`}
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 rounded px-1.5 text-[14px] leading-none text-ink-faint opacity-0 transition-opacity hover:text-rush focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent group-hover:opacity-100 motion-reduce:transition-none"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  value={itemDraft}
                  placeholder="Add an item…"
                  aria-label="New checklist item"
                  onChange={(e) => setItemDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 py-[7px] text-[13px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!itemDraft.trim()}
                  className="shrink-0 rounded-lg bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                >
                  Add
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ===== Footer ===== */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-line bg-fill px-[22px] py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-[13px] font-medium text-ink-secondary transition-colors hover:border-line-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3.5 py-2 text-[13px] font-semibold text-white shadow-button transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success motion-reduce:transition-none"
          >
            <CheckIcon size={13} />
            Mark complete
          </button>
        </div>
      </div>
    </dialog>
  );
}
