"use client";

import { useMemo, useState } from "react";
import KartaNabidky from "../components/KartaNabidky";
import { DRUHY, NABIDKY } from "../data-nabidky";

const OPERACE = [
  { klic: "vse", popis: "Vše" },
  { klic: "prodej", popis: "Prodej" },
  { klic: "pronájem", popis: "Pronájem" },
];

/** Filtr nad nabídkou. Filtruje se v prohlížeči — data jsou už na stránce,
 *  takže přepnutí je okamžité a nečeká se na server. */
export default function Vypis() {
  const [operace, setOperace] = useState("vse");
  const [druh, setDruh] = useState("vse");

  const videt = useMemo(
    () =>
      NABIDKY.filter(
        (n) =>
          (operace === "vse" || n.operace === operace) &&
          (druh === "vse" || n.druh === druh)
      ),
    [operace, druh]
  );

  return (
    <>
      <div className="filtr">
        <div className="filtr-skupina" role="group" aria-label="Prodej nebo pronájem">
          {OPERACE.map((o) => (
            <button
              key={o.klic}
              type="button"
              className="filtr-btn"
              aria-pressed={operace === o.klic}
              onClick={() => setOperace(o.klic)}
            >
              {o.popis}
            </button>
          ))}
        </div>

        <div className="filtr-skupina" role="group" aria-label="Druh nemovitosti">
          <button
            type="button"
            className="filtr-btn"
            aria-pressed={druh === "vse"}
            onClick={() => setDruh("vse")}
          >
            Všechny druhy
          </button>
          {DRUHY.map((d) => (
            <button
              key={d}
              type="button"
              className="filtr-btn"
              aria-pressed={druh === d}
              onClick={() => setDruh(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="filtr-pocet" aria-live="polite">
          {videt.length === NABIDKY.length
            ? `${NABIDKY.length} nemovitostí`
            : `${videt.length} z ${NABIDKY.length}`}
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
