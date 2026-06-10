import { Column, type ColumnProps } from "@/components/column";

const columns: ColumnProps[] = [
  {
    title: "To Do",
    tickets: [
      { id: "KB-0006", title: "Drag and drop between lanes" },
      { id: "KB-0007", title: "Wire up local persistence (IndexedDB)" },
      { id: "KB-0008", title: "Ticket detail view and editing" },
      { id: "KB-0009", title: "Keyboard navigation across the board" },
    ],
  },
  {
    title: "Doing",
    hazard: true,
    tickets: [
      { id: "KB-0004", title: "Board layout and lane components", rush: true },
      { id: "KB-0005", title: "Design tokens — shop floor theme" },
    ],
  },
  {
    title: "Done",
    faded: true,
    tickets: [
      { id: "KB-0001", title: "Project scaffold (Next 16 + Tailwind v4)" },
      { id: "KB-0002", title: "Decide: local-first, no accounts, no backend" },
      { id: "KB-0003", title: "Shop floor visual direction" },
    ],
  },
];

export function Board() {
  return (
    <div className="scrollbar-steel flex h-full gap-4 overflow-x-auto p-4 md:p-6">
      {columns.map((column) => (
        <Column key={column.title} {...column} />
      ))}
    </div>
  );
}
