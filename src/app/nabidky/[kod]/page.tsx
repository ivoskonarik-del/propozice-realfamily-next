import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Hlavicka from "../../components/Hlavicka";
import Paticka from "../../components/Paticka";
import { FIRMA, nb } from "../../data";
import { NABIDKY } from "../../data-nabidky";

export function generateStaticParams() {
  return NABIDKY.map((n) => ({ kod: n.kod }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kod: string }>;
}): Promise<Metadata> {
  const { kod } = await params;
  const n = NABIDKY.find((x) => x.kod === kod);
  if (!n) return { title: "Nemovitost" };
  return {
    title: `${n.nazev} — ${n.mesto}`,
    description: n.popis.slice(0, 160),
  };
}

export default async function Detail({
  params,
}: {
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const n = NABIDKY.find((x) => x.kod === kod);
  if (!n) return null;

  const i = NABIDKY.findIndex((x) => x.kod === kod);
  const predchozi = NABIDKY[(i - 1 + NABIDKY.length) % NABIDKY.length];
  const dalsi = NABIDKY[(i + 1) % NABIDKY.length];

  const parametry = [
    ["Druh", n.druh],
    ["Nabídka", n.operace === "prodej" ? "Prodej" : "Pronájem"],
    ["Plocha", n.plocha],
    ["Lokalita", n.mesto],
    ["Energetická třída", n.energie || "neuvedena"],
  ].filter(([, v]) => v);

  return (
    <>
      <Hlavicka aktivni="/nabidky/" />
      <main id="obsah">
        <section className="sekce sekce--tesna">
          <div className="obal">
            <Link
              href="/nabidky/"
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--seda)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" /> Zpět na nabídku
            </Link>

            <div style={{ marginTop: "var(--sp-5)", marginBottom: "var(--sp-7)" }}>
              <span className="mono nadtitul">{n.adresa}</span>
              <h1 style={{ marginTop: "var(--sp-3)" }}>{n.nazev}</h1>
            </div>

            <div className="detail-mrizka">
              <div>
                <div className="galerie">
                  {n.fotky.map((f, i) => (
                    <figure key={f.src}>
                      <img
                        src={f.src}
                        alt={`${n.nazev} — fotografie ${i + 1}`}
                        width={f.sirka}
                        height={f.vyska}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>

                <div className="popis-nabidky">{nb(n.popis)}</div>

                <p
                  className="mono"
                  style={{ marginTop: "var(--sp-7)", color: "var(--seda)" }}
                >
                  {nb(
                    `Na prohlídce ukážeme všech ${n.fotekCelkem} pohledů i to, co se nafotit nedá.`
                  )}
                </p>
              </div>

              <aside className="panel">
                <span className="mono" style={{ color: "var(--seda)" }}>
                  {n.operace === "prodej" ? "Prodejní cena" : "Nájem"}
                </span>
                <div className="panel-cena" style={{ marginTop: "var(--sp-2)" }}>
                  {n.cena}
                </div>

                <ul className="parametry">
                  {parametry.map(([k, v]) => (
                    <li key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                    </li>
                  ))}
                </ul>

                <div
                  className="akce"
                  style={{ marginTop: "var(--sp-6)", flexDirection: "column" }}
                >
                  <a
                    className="btn btn-hlavni"
                    href={FIRMA.telefonHref}
                    style={{ width: "100%" }}
                  >
                    <Phone size={17} aria-hidden="true" /> {FIRMA.telefon}
                  </a>
                  <a
                    className="btn btn-obrys"
                    href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(
                      "Dotaz k nemovitosti: " + n.nazev
                    )}`}
                    style={{ width: "100%" }}
                  >
                    <Mail size={17} aria-hidden="true" /> Napsat k této nemovitosti
                  </a>
                </div>

                <p
                  style={{
                    marginTop: "var(--sp-5)",
                    color: "var(--seda)",
                    fontSize: 14.5,
                  }}
                >
                  Prohlídky domlouváme podle vás, i mimo pracovní dobu.
                </p>
              </aside>
            </div>

            {NABIDKY.length > 1 && (
              <nav className="sousedi" aria-label="Další nemovitosti">
                <Link className="soused" href={`/nabidky/${predchozi.kod}/`}>
                  <span>Předchozí</span>
                  <b>{predchozi.nazev}</b>
                </Link>
                <Link className="soused soused--dalsi" href={`/nabidky/${dalsi.kod}/`}>
                  <span>Další</span>
                  <b>{dalsi.nazev}</b>
                </Link>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Paticka />
    </>
  );
}
