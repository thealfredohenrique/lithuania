import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Saira_Condensed } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
const saira = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Shop Floor — Kanban",
  description: "A local-first kanban board. Paper job tickets on a steel workshop wall.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} ${saira.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-pegboard font-sans text-bright">
        <header className="flex shrink-0 items-center gap-3 border-b border-edge bg-steel px-5 py-3">
          <span aria-hidden="true" className="size-2.5 bg-amber" />
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.18em]">
            Shop Floor
          </h1>
          <span className="font-mono text-xs tracking-wide text-muted">
            kanban / local-first
          </span>
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </body>
    </html>
  );
}
