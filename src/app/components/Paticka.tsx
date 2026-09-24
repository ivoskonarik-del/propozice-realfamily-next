import Link from "next/link";
import { FIRMA, KANCELARE } from "../data";

export default function Paticka() {
  return (
    <footer className="paticka">
      <div className="obal">
        <div className="paticka-mrizka">
          <div>
            <img
              className="paticka-logo"
              src="/images/logo-realfamily.svg"
              alt="REAL family"
              width={99}
              height={46}
            />
            <p style={{ maxWidth: "34ch", fontSize: 15.5 }}>
              Realitní kancelář z Olomouce. Na trhu od roku {FIRMA.odRoku},
              přes tisíc uzavřených smluv.
            </p>
            <p className="mono" style={{ marginTop: "var(--sp-4)", opacity: 0.6 }}>
              IČO {FIRMA.ico}
            </p>
          </div>

          <div>
            <h4>Kanceláře</h4>
            <ul>
              {KANCELARE.map((k) => (
                <li key={k.mesto}>
                  <b style={{ color: "#fff" }}>{k.mesto}</b>
                  <br />
                  {k.adresa}
                  <br />
                  {k.castObce}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Spojení</h4>
            <ul>
              <li>
                <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
              </li>
              <li>
                <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
              </li>
              <li>
                <Link href="/nabidky/">Nabídka nemovitostí</Link>
              </li>
              <li>
                <Link href="/kontakt/">Kontakt</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="paticka-spod">
          <span>
            © {new Date().getFullYear()} {FIRMA.nazev} — {FIRMA.majitelka}
          </span>
          <span style={{ opacity: 0.6 }}>
            Návrh webu · WebHunter
          </span>
        </div>
      </div>
    </footer>
  );
}
