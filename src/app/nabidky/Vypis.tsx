"use client";

import { useMemo, useState } from "react";
import KartaNabidky from "../components/KartaNabidky";
import { pocetNemovitosti } from "./pocet";
import { NABIDKY, type Nabidka } from "../data-nabidky";

const OPERACE = [
  { klic: "prodej", popis: "Prodej" },
  { klic: "pronájem", popis: "Pronájem" },
];

/** Druhy podle klientky (25. 11. 2026): pevný seznam, ne jen to, co je zrovna v nabídce. */
const DRUHY = ["Byt", "Dům", "Chata - chalupa", "Pozemek", "Komerční prostor"];

/** Sreality vede chaty a chalupy pod domy, poznají se podle adresy inzerátu. */
function druhNemovitosti(n: Nabidka): string {
  return n.druh === "Chata" || /\/(chata|chalupa)\//.test(n.zdroj) ? "Chata - chalupa" : n.druh;
}

/** Filtr nad nabídkou. „Vše“ zruší obě volby, opětovný klik na volbu zruší jen ji. Filtruje se v prohlížeči — data jsou už na stránce,
 *  takže přepnutí je okamžité a nečeká se na server. */
export default function Vypis() {
  const [operace, setOperace] = useState("vse");
  const [druh, setDruh] = useState("vse");

  const videt = useMemo(
    () =>
      NABIDKY.filter(
        (n) =>
          (operace === "vse" || n.operace === operace) &&
          (druh === "vse" || druhNemovitosti(n) === druh)
      ),
    [operace, druh]
  );

  return (
    <>
      <div className="filtr">
        <div className="filtr-skupina" role="group" aria-label="Prodej nebo pronájem">
          <button
            type="button"
            className="filtr-btn"
            aria-pressed={operace === "vse" && druh === "vse"}
            onClick={() => {
              setOperace("vse");
              setDruh("vse");
            }}
          >
            Vše
          </button>
          {OPERACE.map((o) => (
            <button
              key={o.klic}
              type="button"
              className="filtr-btn"
              aria-pressed={operace === o.klic}
              onClick={() => setOperace(operace === o.klic ? "vse" : o.klic)}
            >
              {o.popis}
            </button>
          ))}
        </div>

        <div className="filtr-skupina" role="group" aria-label="Druh nemovitosti">
          {DRUHY.map((d) => (
            <button
              key={d}
              type="button"
              className="filtr-btn"
              aria-pressed={druh === d}
              onClick={() => setDruh(druh === d ? "vse" : d)}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="filtr-pocet" aria-live="polite">
          {videt.length === NABIDKY.length
            ? pocetNemovitosti(NABIDKY.length)
            : `${videt.length} z celkem ${NABIDKY.length}`}
        </p>
      </div>

      {videt.length > 0 ? (
        <div className="mrizka-nabidek">
          {videt.map((n, i) => (
            <KartaNabidky key={n.kod} n={n} prvni={i === 0} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--seda)", padding: "var(--sp-8) 0" }}>
          Tomuhle výběru zatím nic neodpovídá. Zkuste jiný druh nemovitosti —
          nebo nám napište, co hledáte, a ozveme se, až to budeme mít.
        </p>
      )}
    </>
  );
}
