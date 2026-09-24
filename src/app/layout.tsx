import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

/* Fraunces na nadpisy — má vážnost notářské kanceláře, ale není strohá.
   Source Sans na text, protože se v ní dobře čtou dlouhé popisy inzerátů. */
const nadpis = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-nadpis",
  display: "swap",
  // Statické řezy, ne variable osy — next/font je nekombinuje s `weight`.
});

const text = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "REAL family — realitní kancelář Olomouc a Hranice",
    template: "%s · REAL family",
  },
  description:
    "Realitní kancelář z Olomouce. Od roku 2004, přes tisíc uzavřených smluv. Prodej a pronájem nemovitostí, právní servis, ocenění a správa nájemních bytových domů.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${nadpis.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
