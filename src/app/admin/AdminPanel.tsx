"use client";

import { useState } from "react";

/* Tlačítko „Načíst nabídky".
 *
 * Web je statický (GitHub Pages), takže sám nic spustit neumí a nesmí v sobě
 * nést žádný přístupový token — v prohlížeči by si ho přečetl kdokoliv.
 * Kliknutí proto odešle pokyn e-mailem na naši adresu; tam ho zachytí hlídač
 * (tools/hlidac_obnovy.py), stáhne aktuální nabídku ze Sreality i Reality.iDNES
 * a web přestaví. Trvá to pár minut, ne vteřin — a je to poctivě napsané níž,
 * aby klientka nečekala u obrazovky.
 */

const PRIJEMCE = "info.webhunter@email.cz";
const PREDMET = "OBNOVIT NABIDKY: realfamily";

export default function AdminPanel() {
  const [odeslano, setOdeslano] = useState(false);

  const nacist = () => {
    const telo = [
      "Prosím o načtení aktuálních nabídek na web.",
      "",
      "Web: REAL family (realfamily)",
      `Odesláno: ${new Date().toLocaleString("cs-CZ")}`,
    ].join("\n");
    window.location.href =
      `mailto:${PRIJEMCE}?subject=${encodeURIComponent(PREDMET)}` +
      `&body=${encodeURIComponent(telo)}`;
    setOdeslano(true);
  };

  return (
    <main className="admin">
      <div className="admin__box">
        <h1>Správa nabídek</h1>
        <p className="admin__perex">
          Vložila jste novou nemovitost na Sreality nebo iDNES reality, nebo jste nějakou prodala?
          Klikněte na tlačítko a web se srovná s aktuálním stavem — fotky, ceny i popisy.
          Ručně tu nic vyplňovat nemusíte.
        </p>

        <button type="button" className="admin__btn" onClick={nacist}>
          Načíst nabídky
        </button>

        {odeslano && (
          <p className="admin__ok" role="status">
            Pokyn odešel. Nabídky se na webu objeví zpravidla do několika minut —
            stránku pak stačí načíst znovu.
          </p>
        )}

        <ul className="admin__kroky">
          <li>Načteme Vaši aktuální nabídku ze Sreality i z Reality.iDNES.</li>
          <li>Stáhneme fotky, ceny, popisy a výměry.</li>
          <li>Co už v nabídce není, z webu zmizí.</li>
          <li>Web se sám přestaví a nasadí.</li>
        </ul>

        <p className="admin__pozn">
          Kdyby cokoliv nesedělo, napište nám na <a href={`mailto:${PRIJEMCE}`}>{PRIJEMCE}</a>.
        </p>
      </div>
    </main>
  );
}
