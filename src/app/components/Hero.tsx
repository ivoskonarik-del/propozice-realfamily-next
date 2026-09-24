import { nb } from "../data";

type Props = {
  nadtitul: string;
  nadpis: string;
  lead?: string;
  foto: string;
  alt: string;
  sirka: number;
  vyska: number;
  maly?: boolean;
  deti?: React.ReactNode;
};

/** Celoplošné hero s fotkou. Žádný split — fotka drží celou šířku. */
export default function Hero({
  nadtitul,
  nadpis,
  lead,
  foto,
  alt,
  sirka,
  vyska,
  maly = false,
  deti,
}: Props) {
  return (
    <section className={`hero${maly ? " hero--pod" : ""}`}>
      <div className="hero-foto">
        <img
          src={foto}
          alt={alt}
          width={sirka}
          height={vyska}
          // eslint-disable-next-line react/no-unknown-property
          {...{ fetchpriority: "high" }}
          decoding="async"
        />
      </div>
      <div className="hero-zavoj" aria-hidden="true" />
      <div className="obal hero-in">
        <span className="mono nadtitul hero-nadtitul">{nadtitul}</span>
        <h1>{nb(nadpis)}</h1>
        {lead && <p className="hero-lead">{nb(lead)}</p>}
        {deti}
      </div>
    </section>
  );
}
