import type { Metadata } from "next";
import Link from "next/link";
import Hlavicka from "../components/Hlavicka";
import Paticka from "../components/Paticka";
import Hero from "../components/Hero";
import { CISLA, FIRMA, KANCELARE, MAKLERI, nb } from "../data";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "REAL family — realitní kancelář z Olomouce. Na trhu od roku 2004, přes tisíc uzavřených smluv, dvě kanceláře a správa nájemních domů.",
};

export default function ONas() {
  return (
    <>
      <Hlavicka aktivni="/o-nas/" />
      <main id="obsah">
        <Hero
          maly
          nadtitul={`Na trhu od roku ${FIRMA.odRoku}`}
          nadpis="Rodinná kancelář, která zná svůj kraj"
          lead="Dvacet let v Olomouci a okolí. Většina našich klientů k nám přišla na doporučení."
          foto="/images/olomouc-pruh.jpg"
          alt="Panorama Olomouce"
          sirka={1600}
          vyska={600}
        />

        <section className="sekce">
          <div className="obal-uzky">
            <p style={{ fontSize: 20, lineHeight: 1.7 }}>
              {nb(
                "Na realitním trhu se pohybujeme od roku 2004. Pracujeme kvalitně, rychle a spolehlivě, a proto máme zřetelné zkušenosti se zprostředkováním prodeje i pronájmu nemovitostí."
              )}
            </p>
            <p style={{ marginTop: "var(--sp-5)", color: "var(--seda)", fontSize: 18 }}>
              {nb(
                "Skrze naši kancelář bylo úspěšně uzavřeno přes tisíc smluv. S každým klientem jednáme individuálně a vše zařídíme podle jeho představ. Naším cílem je spokojenost klientů, kteří se k nám rádi vracejí nebo nás doporučují svým známým."
              )}
            </p>
            <p style={{ marginTop: "var(--sp-5)", color: "var(--seda)", fontSize: 18 }}>
              {nb(
                "Vážíme si toho, když nám někdo svěří koupi nebo prodej bydlení. Záleží nám na tom, aby to pro něj byla bezstarostná a pohodlná záležitost — ne půlrok nervů."
              )}
            </p>
          </div>
        </section>

        <section className="sekce sekce--papir2 sekce--tesna">
          <div className="obal cisla">
            {CISLA.map((c) => (
              <div className="cislo" key={c.popis}>
                <b>{c.hodnota}</b>
                <span>{c.popis}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sekce" aria-labelledby="tym-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Kdo se vám bude věnovat</span>
              <h2 id="tym-h">Dva lidé, ne call centrum</h2>
              <p>
                {nb(
                  "U nás mluvíte pořád s tím samým člověkem — od prvního telefonátu až po předání klíčů."
                )}
              </p>
            </div>
            <div className="mrizka-3">
              {MAKLERI.map((m) => (
                <article className="desticka" key={m.jmeno}>
                  <h3>{m.jmeno}</h3>
                  <p className="mono" style={{ marginTop: "var(--sp-2)" }}>{m.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sekce sekce--modra">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Kde nás najdete</span>
              <h2>Dvě kanceláře, jeden tým</h2>
            </div>
            <div className="mrizka-3">
              {KANCELARE.map((k) => (
                <article className="desticka desticka--modra" key={k.mesto}>
                  <h3>{k.mesto}</h3>
                  <p>{k.adresa}<br />{k.castObce}</p>
                </article>
              ))}
            </div>
            <div className="akce" style={{ marginTop: "var(--sp-7)" }}>
              <Link className="btn btn-zluty" href="/kontakt/">Kontakty a spojení</Link>
            </div>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
