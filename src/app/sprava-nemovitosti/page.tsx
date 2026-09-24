import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Hlavicka from "../components/Hlavicka";
import Paticka from "../components/Paticka";
import Hero from "../components/Hero";
import { FIRMA, SPRAVA, nb } from "../data";

export const metadata: Metadata = {
  title: "Správa nájemních domů",
  description:
    "Správa nájemních bytových domů v Olomouci, Hranicích a Olšovci. Nájemní smlouvy, platby, údržba i předávání bytů.",
};

const PRO_KOHO = [
  "Zdědili jste bytový dům a nevíte, co s ním",
  "Máte nájemní dům v jiném městě, než kde bydlíte",
  "Nechcete řešit výběr nájemníků ani upomínky",
  "Potřebujete přehled o platbách, ale ne práci navíc",
];

export default function Sprava() {
  return (
    <>
      <Hlavicka aktivni="/sprava-nemovitosti/" />
      <main id="obsah">
        <Hero
          maly
          nadtitul={SPRAVA.mesta.join(" · ")}
          nadpis="Správa nájemních bytových domů"
          lead="Druhá věc, kterou děláme stejně dlouho jako realitní zprostředkování — jen o ní tolik nemluvíme."
          foto="/images/olomouc-pruh.jpg"
          alt="Obytné domy v Olomouci"
          sirka={1600}
          vyska={600}
        />

        <section className="sekce">
          <div className="obal-uzky">
            <p style={{ fontSize: 20, lineHeight: 1.7 }}>{nb(SPRAVA.uvod)}</p>
            <p style={{ marginTop: "var(--sp-5)", color: "var(--seda)", fontSize: 18 }}>
              {nb(
                "Majitel domu má s námi jeden kontakt a jeden přehled. Nemusí znát instalatéra, hlídat splatnosti ani vysvětlovat nájemníkovi, proč se topí špatně."
              )}
            </p>
          </div>
        </section>

        <section className="sekce sekce--papir2" aria-labelledby="co-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Co přebíráme</span>
              <h2 id="co-h">Čtyři věci, které vám zmizí ze stolu</h2>
            </div>
            <div className="mrizka-3">
              {SPRAVA.body.map((b, i) => (
                <article className="desticka" key={b.nazev}>
                  <div className="desticka-cislo">{i + 1}</div>
                  <h3>{b.nazev}</h3>
                  <p>{nb(b.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sekce" aria-labelledby="komu-h">
          <div className="obal-uzky">
            <span className="mono nadtitul">Komu se to vyplatí</span>
            <h2 id="komu-h" style={{ marginTop: "var(--sp-3)" }}>
              Ozvěte se, pokud platí aspoň jedno
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "var(--sp-6) 0 0", display: "grid", gap: "var(--sp-4)" }}>
              {PRO_KOHO.map((p) => (
                <li key={p} style={{ display: "flex", gap: "var(--sp-3)", alignItems: "flex-start" }}>
                  <Check size={20} aria-hidden="true" style={{ color: "var(--modr)", flex: "0 0 auto", marginTop: 3 }} />
                  <span>{nb(p)}</span>
                </li>
              ))}
            </ul>
            <div className="akce" style={{ marginTop: "var(--sp-7)" }}>
              <a className="btn btn-hlavni" href={FIRMA.telefonHref}>Zavolat {FIRMA.telefon}</a>
              <Link className="btn btn-obrys" href="/kontakt/">Napsat nám</Link>
            </div>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
