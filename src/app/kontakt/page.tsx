import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Hlavicka from "../components/Hlavicka";
import Paticka from "../components/Paticka";
import Hero from "../components/Hero";
import { FIRMA, KANCELARE, MAKLERI, nb } from "../data";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kanceláře v Olomouci a Hranicích. Telefon 775 101 597, e-mail hana.bryksova@seznam.cz.",
};

export default function Kontakt() {
  return (
    <>
      <Hlavicka aktivni="/kontakt/" />
      <main id="obsah">
        <Hero
          maly
          nadtitul="Rádi se s vámi spojíme"
          nadpis="Kontakt"
          lead="Zavolejte kdykoli. Když to nezvedneme, jsme na prohlídce — ozveme se zpátky."
          foto="/images/olomouc-pruh.jpg"
          alt="Olomouc, pohled na město"
          sirka={1600}
          vyska={600}
        />

        <section className="sekce">
          <div className="obal kontakt-mrizka">
            <div>
              <span className="mono nadtitul">Spojení</span>
              <h2 style={{ marginTop: "var(--sp-3)", marginBottom: "var(--sp-5)" }}>
                {FIRMA.majitelka}
              </h2>

              <div className="kontakt-radek">
                <Phone size={19} aria-hidden="true" style={{ color: "var(--modr)" }} />
                <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
              </div>
              <div className="kontakt-radek">
                <Mail size={19} aria-hidden="true" style={{ color: "var(--modr)" }} />
                <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
              </div>
              <div className="kontakt-radek">
                <ExternalLink size={19} aria-hidden="true" style={{ color: "var(--modr)" }} />
                <a href={FIRMA.sreality} target="_blank" rel="noopener noreferrer">
                  Profil kanceláře na Sreality
                </a>
              </div>

              <p className="mono" style={{ marginTop: "var(--sp-6)", color: "var(--seda)" }}>
                IČO {FIRMA.ico}
              </p>
            </div>

            <div>
              <span className="mono nadtitul">Kanceláře</span>
              <h2 style={{ marginTop: "var(--sp-3)", marginBottom: "var(--sp-5)" }}>
                Kde nás zastihnete
              </h2>
              {KANCELARE.map((k) => (
                <div className="kontakt-radek" key={k.mesto} style={{ alignItems: "flex-start" }}>
                  <MapPin size={19} aria-hidden="true" style={{ color: "var(--modr)", marginTop: 4 }} />
                  <span>
                    <b>{k.mesto}</b>
                    <br />
                    {k.adresa}, {k.castObce}
                    <br />
                    <a href={k.mapa} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15 }}>
                      Zobrazit na mapě
                    </a>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sekce sekce--tesna" aria-labelledby="mapy-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Kudy k nám</span>
              <h2 id="mapy-h">Obě kanceláře na mapě</h2>
            </div>
            <div className="kontakt-mrizka">
              {KANCELARE.map((k) => (
                <a
                  key={k.mesto}
                  href={k.mapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div className="mapa">
                    <img
                      src={k.mapka}
                      alt={`Mapa okolí kanceláře ${k.mesto}, ${k.adresa}`}
                      width={1000}
                      height={625}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="mapa-bod" aria-hidden="true" />
                    <span className="mapa-popis">
                      {k.mesto} · {k.adresa}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <p className="mono" style={{ marginTop: "var(--sp-4)", color: "var(--seda)" }}>
              Podklad map © přispěvatelé OpenStreetMap
            </p>
          </div>
        </section>

        <section className="sekce sekce--papir2" aria-labelledby="tym-h">
          <div className="obal">
            <div className="hlava-sekce">
              <span className="mono nadtitul">Tým</span>
              <h2 id="tym-h">Kdo vám zvedne telefon</h2>
            </div>
            <div className="mrizka-3">
              {MAKLERI.map((m) => (
                <article className="desticka" key={m.jmeno}>
                  <h3>{m.jmeno}</h3>
                  <p className="mono" style={{ marginTop: "var(--sp-2)" }}>{m.role}</p>
                </article>
              ))}
            </div>
            <p style={{ marginTop: "var(--sp-7)", color: "var(--seda)", maxWidth: "62ch" }}>
              {nb(
                "Nabízíme i správu nájemních bytových domů v Olomouci, Hranicích a Olšovci. Pokud vlastníte nájemní dům a chcete se o něj přestat starat, ozvěte se."
              )}
            </p>
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
