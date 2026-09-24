"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { FIRMA } from "../data";

const ODKAZY = [
  { href: "/nabidky/", popis: "Nabídka nemovitostí" },
  { href: "/sluzby/", popis: "Služby" },
  { href: "/sprava-nemovitosti/", popis: "Správa domů" },
  { href: "/o-nas/", popis: "O nás" },
  { href: "/kontakt/", popis: "Kontakt" },
];

export default function Hlavicka({ aktivni }: { aktivni?: string }) {
  const [otevreno, setOtevreno] = useState(false);

  return (
    <header className="hlavicka">
      <div className="obal hlavicka-in">
        <Link className="znacka" href="/" aria-label="REAL family — domů">
          {/* Logo je vektor od klientky, jen zmenšený. */}
          <img src="/images/logo-realfamily.svg" alt="REAL family" width={86} height={40} />
        </Link>

        <button
          type="button"
          className="menu-prepinac"
          aria-expanded={otevreno}
          aria-controls="hlavni-menu"
          onClick={() => setOtevreno((o) => !o)}
        >
          {otevreno ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="mono" style={{ marginLeft: 8 }}>
            {otevreno ? "Zavřít" : "Menu"}
          </span>
        </button>

        <nav
          id="hlavni-menu"
          className={`menu${otevreno ? " je-otevrene" : ""}`}
          aria-label="Hlavní"
        >
          {ODKAZY.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              aria-current={aktivni === o.href ? "page" : undefined}
              onClick={() => setOtevreno(false)}
            >
              {o.popis}
            </Link>
          ))}
        </nav>

        <a className="hlavicka-tel" href={FIRMA.telefonHref}>
          <Phone size={17} aria-hidden="true" />
          <span>{FIRMA.telefon}</span>
        </a>
      </div>
    </header>
  );
}
