import type { Metadata } from "next";
import Hlavicka from "../components/Hlavicka";
import Paticka from "../components/Paticka";
import Hero from "../components/Hero";
import Vypis from "./Vypis";
import { nb } from "../data";
import { NABIDKY } from "../data-nabidky";

export const metadata: Metadata = {
  title: "Nabídka nemovitostí",
  description:
    "Byty, domy, pozemky a komerční prostory v Olomouckém a Moravskoslezském kraji. Aktuální nabídka realitní kanceláře REAL family.",
};

export default function Nabidky() {
  return (
    <>
      <Hlavicka aktivni="/nabidky/" />
      <main id="obsah">
        <Hero
          maly
          nadtitul={`${NABIDKY.length} nemovitostí v nabídce`}
          nadpis="Nabídka nemovitostí"
          lead="Výpis se plní z naší nabídky automaticky. Co je tady, je opravdu volné."
          foto="/images/olomouc-pruh.jpg"
          alt="Střechy Olomouce z výšky"
          sirka={1600}
          vyska={600}
        />

        <section className="sekce">
          <div className="obal">
            <Vypis />
            <p
              className="mono"
              style={{ marginTop: "var(--sp-8)", color: "var(--seda)" }}
            >
              {nb(
                "Hledáte něco, co tu není? Napište nám — velkou část nemovitostí prodáme dřív, než se stihnou objevit v inzerci."
              )}
            </p>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
