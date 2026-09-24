import Link from "next/link";
import { obalka, type Nabidka } from "../data-nabidky";

export default function KartaNabidky({
  n,
  prvni = false,
}: {
  n: Nabidka;
  prvni?: boolean;
}) {
  const foto = obalka(n);
  return (
    <Link className="karta" href={`/nabidky/${n.kod}/`}>
      <div className="karta-foto">
        {foto && (
          <img
            src={foto.src}
            alt={n.nazev}
            width={foto.sirka}
            height={foto.vyska}
            loading={prvni ? "eager" : "lazy"}
            decoding="async"
          />
        )}
        <div className="stitky">
          <span
            className={`stitek stitek--${n.operace === "prodej" ? "prodej" : "pronajem"}`}
          >
            {n.operace === "prodej" ? "Prodej" : "Pronájem"}
          </span>
          <span className="stitek">{n.druh}</span>
        </div>
      </div>

      <div className="karta-telo">
        <h3>{n.nazev}</h3>
        <p className="karta-misto">{n.mesto}</p>
        <div className="karta-cena">{n.cena}</div>
        <div className="karta-fakta">
          <span>{n.plocha}</span>
          {n.energie && (
            <span className={`energie energie--${n.energie.toLowerCase()}`}>
              Energetická třída {n.energie}
            </span>
          )}
          <span>{n.fotekCelkem} fotek</span>
        </div>
      </div>
    </Link>
  );
}
