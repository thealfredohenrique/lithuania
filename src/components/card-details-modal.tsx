import { useEffect, useRef, useState } from "react";

import { CalendarIcon } from "@/components/icons";
import {
  LABEL_COLORS,
  LABEL_STYLES,
  LABEL_SWATCHES,
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

  // Title keeps a local draft so an intermediate empty value is allowed while
  // typing without ever clearing the card's stored title (mirrors column.tsx).
  const [titleDraft, setTitleDraft] = useState(ticket.title);
  const [labelText, setLabelText] = useState("");
  const [labelColor, setLabelColor] = useState<LabelColor>(LABEL_COLORS[0]);

  const labels = ticket.labels ?? [];

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

  return (
    <dialog
      ref={ref}
      onClose={onClose} // fires on Escape via the native cancel→close flow
      onClick={(e) => {
        // Stop clicks from bubbling out to the card's open-on-click handler.
        e.stopPropagation();
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      className="m-auto w-[34rem] max-w-[calc(100vw-2rem)] rounded-lane border border-line bg-surface p-0 shadow-[0_16px_40px_rgb(16_24_40/0.16)] backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[calc(100dvh-4rem)] flex-col">
        {/* Header: serial + editable title, with a close affordance */}
        <div className="flex items-start gap-3 border-b border-line px-5 pt-4 pb-4">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.02em] text-ink-serial">
              {ticket.id}
            </span>
            <input
              value={titleDraft}
              aria-label="Card title"
              onChange={(e) => commitTitle(e.target.value)}
              className="mt-1 w-full rounded-[7px] border border-transparent bg-transparent px-2 py-1 -mx-2 text-[16px] font-semibold tracking-[-0.01em] text-ink hover:bg-fill focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[7px] text-[17px] leading-none text-ink-faint transition-colors hover:bg-chip hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            ×
          </button>
        </div>

        <div className="scrollbar-subtle flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Labels */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">
              Labels
            </h3>
            {labels.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
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
              </div>
            ) : null}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                value={labelText}
                placeholder="Add a label…"
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
                className="shrink-0 rounded-lg bg-accent px-3 py-[7px] text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
              >
                Add
              </button>
            </div>
            {/* Color picker for the next label */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="mr-0.5 text-[12px] text-ink-muted">Color</span>
              {LABEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`${color} label color`}
                  aria-pressed={labelColor === color}
                  onClick={() => setLabelColor(color)}
                  className={`size-5 rounded-full ${LABEL_SWATCHES[color]} transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${labelColor === color ? "ring-2 ring-ink/30 ring-offset-2 ring-offset-surface" : ""}`}
                />
              ))}
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">
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
              className="mt-2 w-full resize-y rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px] leading-[1.6] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </section>

          {/* Due date */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-faint">
              Due date
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-ink-faint">
                <CalendarIcon size={14} />
              </span>
              <input
                type="date"
                value={ticket.dueDate ?? ""}
                aria-label="Due date"
                onChange={(e) =>
                  updateTicket(columnId, ticket.id, {
                    dueDate: e.target.value || null,
                  })
                }
                className="rounded-lg border border-line-strong bg-surface px-3 py-[7px] text-[13px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {ticket.dueDate ? (
                <button
                  type="button"
                  onClick={() => updateTicket(columnId, ticket.id, { dueDate: null })}
                  className="rounded-md px-2 py-1 text-[12px] font-medium text-ink-muted transition-colors hover:bg-chip hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}
