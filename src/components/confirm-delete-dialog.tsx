import { useEffect, useRef } from "react";

export function ConfirmDeleteDialog({
  columnTitle,
  ticketCount,
  onCancel,
  onConfirm,
}: {
  columnTitle: string;
  ticketCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // React can't open a modal dialog declaratively (the `open` prop renders
  // non-modal); showModal() buys the focus trap, Escape handling, and
  // ::backdrop for free.
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onCancel} // fires on Escape via the native cancel→close flow
      onClick={(e) => {
        if (e.target === ref.current) onCancel(); // backdrop click
      }}
      className="m-auto w-100 max-w-[calc(100vw-3rem)] rounded-lane border border-line bg-surface p-0 shadow-[0_16px_40px_rgb(16_24_40/0.16)] backdrop:bg-ink/40"
    >
      {/* Inner wrapper so content clicks never hit the dialog element itself */}
      <div className="p-5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          Delete &ldquo;{columnTitle}&rdquo;?
        </h2>
        <p className="mt-1.5 text-[13px] leading-[1.55] text-ink-muted">
          This column contains {ticketCount} {ticketCount === 1 ? "task" : "tasks"}.
          Deleting it will permanently delete {ticketCount === 1 ? "that task" : "them"} too.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-line-strong bg-surface px-3 py-[7px] text-[13px] font-medium text-ink-secondary transition-colors hover:border-[#C9CDD6] hover:bg-[#FCFCFD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rush px-3.5 py-[7px] text-[13px] font-semibold text-white shadow-button transition-colors hover:bg-[#b3262b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rush motion-reduce:transition-none"
          >
            Delete column
          </button>
        </div>
      </div>
    </dialog>
  );
}
