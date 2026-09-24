import type { Metadata } from "next";
import Link from "next/link";
import Hlavicka from "../components/Hlavicka";
import Paticka from "../components/Paticka";
import Hero from "../components/Hero";
import { FIRMA, PARTNERI, SLUZBY, nb } from "../data";

export const metadata: Metadata = {
  title: "Služby",
  description:
    "Prodej a pronájem nemovitostí, právní servis, ocenění, geodetické služby, financování, PENB i vyřešení pozůstalosti. Vše pod jednou střechou.",
};

export default function Sluzby() {
  return (
    <>
      <Hlavicka aktivni="/sluzby/" />
      <main id="obsah">
        <Hero
          maly
          nadtitul="Jedenáct služeb"
          nadpis="Všechno kolem nemovitosti na jednom místě"
          lead="Od prvního odhadu ceny po vklad do katastru. Co neděláme sami, zajistíme přes prověřené partnery."
          foto="/images/olomouc-pruh.jpg"
          alt="Historické centrum Olomouce"
          sirka={1600}
          vyska={600}
        />

        <section className="sekce">
          <div className="obal">
            <div className="mrizka-3">
              {SLUZBY.map((s, i) => (
                <article className="desticka" key={s.klic}>
                  <div className="desticka-cislo">{i + 1}</div>
                  <h3>{s.nazev}</h3>
                  <p>{nb(s.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sekce sekce--papir2" aria-labelledby="part-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Partneři</span>
              <h2 id="part-h">Na koho se obracíme, aby to bylo bez chyby</h2>
              <p>
                {nb(
                  "Žádnou smlouvu neuzavíráme bez právní konzultace. Posudky, geometrické plány ani financování si klient nemusí shánět sám."
                )}
              </p>
            </div>
            <div className="mrizka-3">
              {PARTNERI.map((p) => (
                <article className="desticka" key={p.nazev}>
                  <h3>{p.nazev}</h3>
                  <p>{nb(p.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sekce sekce--modra">
          <div className="obal-uzky" style={{ textAlign: "center" }}>
            <h2>Nevíte, kde začít?</h2>
            <p style={{ marginTop: "var(--sp-4)", color: "rgba(255,255,255,.85)", fontSize: 18 }}>
              {nb(
                "Zavolejte a řekněte, co řešíte. Poradíme i v případě, že z toho žádný obchod nebude."
              )}
            </p>
            <div className="akce" style={{ marginTop: "var(--sp-6)", justifyContent: "center" }}>
              <a className="btn btn-zluty" href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
              <Link className="btn btn-bily-obrys" href="/kontakt/">Kontakty a kanceláře</Link>
            </div>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
