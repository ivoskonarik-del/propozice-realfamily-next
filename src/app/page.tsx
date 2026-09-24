import Link from "next/link";
import { ArrowRight, Building2, FileCheck2, KeyRound } from "lucide-react";
import Hlavicka from "./components/Hlavicka";
import Paticka from "./components/Paticka";
import Hero from "./components/Hero";
import KartaNabidky from "./components/KartaNabidky";
import { CISLA, FIRMA, PARTNERI, SLUZBY, SPRAVA, TIP, nb } from "./data";
import { NABIDKY } from "./data-nabidky";

const IKONY = [KeyRound, FileCheck2, Building2];

export default function Domu() {
  return (
    <>
      <Hlavicka />
      <main id="obsah">
        <Hero
          nadtitul="Olomouc · Hranice"
          nadpis="Realitní kancelář, která u toho zůstane až do předání klíčů"
          lead="Od roku 2004 a přes tisíc uzavřených smluv. Prodej, pronájem, právní servis i správa nájemních domů — všechno pod jednou střechou."
          foto="/images/olomouc-hero.jpg"
          alt="Pohled na Horní náměstí v Olomouci s radniční věží"
          sirka={1920}
          vyska={1280}
          deti={
            <div className="akce hero-akce">
              <Link className="btn btn-zluty" href="/nabidky/">
                Prohlédnout nabídku <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="btn btn-bily-obrys" href={FIRMA.telefonHref}>
                Zavolat {FIRMA.telefon}
              </a>
            </div>
          }
        />

        {/* ── čísla, která jsou doložitelná ── */}
        <section className="sekce sekce--tesna">
          <div className="obal cisla">
            {CISLA.map((c) => (
              <div className="cislo" key={c.popis}>
                <b>{c.hodnota}</b>
                <span>{c.popis}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── aktuální nabídka ── */}
        <section className="sekce sekce--papir2" aria-labelledby="nabidka-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Aktuální nabídka</span>
              <h2 id="nabidka-h">Nemovitosti, které teď nabízíme</h2>
              <p>
                {nb(
                  "Výpis se plní automaticky z naší nabídky — když přibude nová nemovitost nebo se některá prodá, web se srovná sám. Nic se nepřepisuje ručně."
                )}
              </p>
            </div>

            <div className="mrizka-nabidek">
              {NABIDKY.slice(0, 3).map((n, i) => (
                <KartaNabidky key={n.kod} n={n} prvni={i === 0} />
              ))}
            </div>

            <div className="akce" style={{ marginTop: "var(--sp-7)" }}>
              <Link className="btn btn-hlavni" href="/nabidky/">
                Všech {NABIDKY.length} nemovitostí{" "}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── co děláme ── */}
        <section className="sekce" aria-labelledby="sluzby-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Co pro vás uděláme</span>
              <h2 id="sluzby-h">Od prohlídky po vklad do katastru</h2>
              <p>
                {nb(
                  "Nejsme jen zprostředkovatel. Smlouvy nám zajišťuje advokátní kancelář, posudky znalci, geometrické plány geodeti. Klient jedná s námi, ne s pěti firmami."
                )}
              </p>
            </div>

            <div className="mrizka-3">
              {SLUZBY.slice(0, 3).map((s, i) => {
                const Ikona = IKONY[i];
                return (
                  <article className="desticka" key={s.klic}>
                    <Ikona
                      size={26}
                      aria-hidden="true"
                      style={{ color: "var(--modr)", marginBottom: "var(--sp-4)" }}
                    />
                    <h3>{s.nazev}</h3>
                    <p>{nb(s.text)}</p>
                  </article>
                );
              })}
            </div>

            <div className="akce" style={{ marginTop: "var(--sp-6)" }}>
              <Link className="btn btn-obrys" href="/sluzby/">
                Všech {SLUZBY.length} služeb <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── správa domů: druhá noha kanceláře ── */}
        <section className="sekce sekce--modra" aria-labelledby="sprava-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Správa nájemních domů</span>
              <h2 id="sprava-h">
                Staráme se o bytové domy v Olomouci, Hranicích a Olšovci
              </h2>
              <p>
                {nb(
                  "Majitel nájemního domu má dvě možnosti: řešit každý prasklý ventil sám, nebo to předat někomu, kdo to dělá denně. Děláme to druhé."
                )}
              </p>
            </div>

            <div className="mrizka-3">
              {SPRAVA.body.map((b, i) => (
                <article className="desticka desticka--modra" key={b.nazev}>
                  <div className="desticka-cislo">{i + 1}</div>
                  <h3>{b.nazev}</h3>
                  <p>{nb(b.text)}</p>
                </article>
              ))}
            </div>

            <div className="akce" style={{ marginTop: "var(--sp-7)" }}>
              <Link className="btn btn-zluty" href="/sprava-nemovitosti/">
                Jak správa probíhá <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── partneři ── */}
        <section className="sekce" aria-labelledby="partneri-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">S kým spolupracujeme</span>
              <h2 id="partneri-h">Odborníci, které byste jinak sháněli sami</h2>
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

        {/* ── odměna za tip ── */}
        <section className="sekce sekce--papir2">
          <div className="obal-uzky" style={{ textAlign: "center" }}>
            <span className="mono nadtitul">{TIP.nadpis}</span>
            <h2 style={{ marginTop: "var(--sp-3)" }}>
              Víte o někom, kdo prodává?
            </h2>
            <p style={{ marginTop: "var(--sp-4)", color: "var(--seda)", fontSize: 18 }}>
              {nb(TIP.text)}
            </p>
            <div
              className="akce"
              style={{ marginTop: "var(--sp-6)", justifyContent: "center" }}
            >
              <a className="btn btn-hlavni" href={`mailto:${FIRMA.email}`}>
                Napsat nám
              </a>
              <a className="btn btn-obrys" href={FIRMA.telefonHref}>
                {FIRMA.telefon}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
