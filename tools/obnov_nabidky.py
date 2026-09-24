#!/usr/bin/env python3
"""Přegeneruje nabídky nemovitostí na klientském webu ze zdrojových portálů.

Klient (REAL family, H. Trnečková Bryksová) inzeruje na Sreality i na
Reality.iDNES a nechce nabídky na web přepisovat ručně. Tenhle skript si
sáhne na profil kanceláře, stáhne aktuální nabídku, uloží fotky a přepíše
`src/app/data-nabidky.ts`. Web se pak jen přestaví.

Pouští se buď ručně, nebo z GitHub Actions (workflow `obnovit-nabidky.yml`),
protože samotné GitHub Pages nic spustit neumí — servírují jen soubory.

    python3 tools/obnov_nabidky.py \\
        --projekt proposals/realfamily-next \\
        --sreality https://www.sreality.cz/adresar/.../5391 \\
        --idnes https://reality.idnes.cz/rk/detail/<slug>/<id>/

Bez `--zapsat` jen vypíše, co by udělal. Nic se nepřepíše.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import sys
from pathlib import Path

# Skript leží v `tools/` uvnitř repozitáře webu a scraper má vedle sebe
# (`tools/reality/`), aby si vystačil sám — GitHub Actions k našemu hlavnímu
# nástrojovému repozitáři přístup nemají.
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from reality.http_client import HttpClient          # noqa: E402
from reality.sources import get_source              # noqa: E402

log = logging.getLogger("obnov_nabidky")

#: Kolik fotek na nabídku se ukládá k webu. Víc než pět galerie stejně
#: neukazuje a každá další jen zdržuje build i nasazení.
FOTEK_NA_NABIDKU = 5

DRUHY_NAZVY = {
    "byt": "Byt", "dům": "Dům", "pozemek": "Pozemek", "chata": "Chata",
    "garáž": "Garáž", "komerční": "Komerční prostor",
}


def _q(text: str | None) -> str:
    """Řetězec do TypeScriptu. Uvozovky i zalomení musí přežít."""
    if not text:
        return '""'
    t = (text.replace("\\", "\\\\").replace('"', '\\"')
             .replace("\n", "\\n").replace("\r", ""))
    return f'"{t}"'


def _klic_nemovitosti(l) -> str:
    """Klíč pro rozpoznání téže nemovitosti na dvou portálech.

    Sdílený `reality.otisk` porovnává i PŘESNOU cenu, což je správné při
    hledání duplicit napříč celým trhem. Tady ale jde o vlastní nabídku jedné
    kanceláře a portály se v ceně běžně rozcházejí — dům ve Velkém Týnci měl
    24. 9. 2026 na Sreality 5 890 000 Kč a na iDNES už zlevněných 5 650 000 Kč.
    Podle ceny by se tatáž nemovitost dostala na web dvakrát, proto se tu
    porovnává jen typ, transakce, plocha na celé m² a obec.
    """
    obec = ""
    if l.location:
        obec = (l.location.city or l.location.raw or "").lower().strip()
        obec = re.sub(r"\s*-\s*.*$", "", obec)          # „Olomouc - Neředín" → „olomouc"
        obec = re.sub(r"[^\w ]+", "", obec, flags=re.U).strip()
    plocha = int(round(l.area_m2)) if l.area_m2 else None
    if not obec or plocha is None:
        return ""
    return "|".join((
        (l.property_type or "").lower(),
        (l.transaction_type or "").lower(),
        str(plocha),
        obec,
    ))


def stahni_fotky(record, cil: Path, kod: str, client: HttpClient) -> list[dict]:
    """Uloží prvních pár fotek a vrátí jejich rozměry pro `data-nabidky.ts`."""
    from PIL import Image as PILImage
    cil.mkdir(parents=True, exist_ok=True)
    out: list[dict] = []
    for i, img in enumerate(record.images[:FOTEK_NA_NABIDKU], 1):
        if not img.url:
            continue
        soubor = cil / f"{kod}-{i:02d}.jpg"
        try:
            data = client.get_bytes(img.url) if hasattr(client, "get_bytes") else None
            if data is None:
                import requests
                data = requests.get(img.url, timeout=30,
                                    headers={"User-Agent": "Mozilla/5.0"}).content
            soubor.write_bytes(data)
            with PILImage.open(soubor) as im:
                if im.mode not in ("RGB", "L"):
                    im = im.convert("RGB")
                    im.save(soubor, "JPEG", quality=85, optimize=True)
                sirka, vyska = im.size
        except Exception as exc:                      # jedna fotka navíc nestojí za pád
            log.warning("fotka %s se nepodařila (%s)", img.url[:60], exc)
            continue
        out.append({"src": f"/images/nabidky/{soubor.name}", "sirka": sirka, "vyska": vyska})
    return out


def posbirej(zdroj_key: str, vypis_url: str, client: HttpClient, limit: int) -> list:
    src = get_source(zdroj_key)
    odkazy = src.discover(client, vypis_url, limit=limit)
    log.info("%s: nalezeno %d nabídek", zdroj_key, len(odkazy))
    zaznamy = []
    for u in odkazy:
        try:
            zaznamy.append((src, src.scrape(client, u)))
        except Exception as exc:
            log.warning("%s se nepodařilo stáhnout: %s", u[:70], exc)
    return zaznamy


def sestav_ts(polozky: list[dict]) -> str:
    hlavicka = '''/* Nabídky nemovitostí — GENEROVANÝ SOUBOR, needitovat ručně.
 *
 * Přepisuje ho `tools/obnov_nabidky.py`, který si sáhne pro aktuální nabídku
 * kanceláře na Sreality a Reality.iDNES. Přesně to si klientka přála:
 * nabídky se na web propisují ze zdroje, ne přepisováním stránek.
 *
 * POZOR na `src`: je tu ÚPLNÁ cesta včetně přípony, ne jen název souboru.
 * Deploy přepisuje cesty v JS jen tehdy, když jsou celé v jednom řetězci.
 * Kdyby se cesta skládala v komponentě (`/images/…/${x}`), zůstal by v JS
 * holý prefix, deploy by ho minul a po hydrataci by fotky zmizely.
 */

export type Foto = { src: string; sirka: number; vyska: number };

export type Nabidka = {
  kod: string;
  nazev: string;
  adresa: string;
  mesto: string;
  cena: string;
  druh: string;
  operace: string;
  plocha: string;
  energie: string;
  popis: string;
  fotekCelkem: number;
  zdroj: string;
  fotky: Foto[];
};

export const NABIDKY: Nabidka[] = [
'''
    telo = []
    for p in polozky:
        fotky = "\n".join(
            f'      {{ src: {_q(f["src"])}, sirka: {f["sirka"]}, vyska: {f["vyska"]} }},'
            for f in p["fotky"])
        telo.append(f'''  {{
    kod: {_q(p["kod"])},
    nazev: {_q(p["nazev"])},
    adresa: {_q(p["adresa"])},
    mesto: {_q(p["mesto"])},
    cena: {_q(p["cena"])},
    druh: {_q(p["druh"])},
    operace: {_q(p["operace"])},
    plocha: {_q(p["plocha"])},
    energie: {_q(p["energie"])},
    popis: {_q(p["popis"])},
    fotekCelkem: {p["fotekCelkem"]},
    zdroj: {_q(p["zdroj"])},
    fotky: [
{fotky}
    ],
  }},''')
    pata = '''
];

export function obalka(n: Nabidka): Foto | undefined {
  return n.fotky.find((f) => f.sirka >= f.vyska) ?? n.fotky[0];
}

export const DRUHY = Array.from(new Set(NABIDKY.map((n) => n.druh)));
'''
    return hlavicka + "\n".join(telo) + pata


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--projekt", required=True, help="adresář webu (proposals/<slug>)")
    ap.add_argument("--sreality", help="URL profilu/nabídky kanceláře na Sreality")
    ap.add_argument("--limit", type=int, default=30, help="strop nabídek na portál")
    ap.add_argument("--zapsat", action="store_true", help="opravdu přepsat data a fotky")
    a = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    if not a.sreality:
        print("Zadej zdroj: --sreality", file=sys.stderr)
        return 2

    projekt = (ROOT / a.projekt) if not Path(a.projekt).is_absolute() else Path(a.projekt)
    if not (projekt / "src/app").is_dir():
        print(f"{projekt} nevypadá jako projekt webu (chybí src/app)", file=sys.stderr)
        return 2

    client = HttpClient()
    zaznamy = []
    if a.sreality:
        zaznamy += posbirej("sreality", a.sreality, client, a.limit)

    if not zaznamy:
        print("Nenašla se ani jedna nabídka — data nechávám být.", file=sys.stderr)
        return 1

    fotky_dir = projekt / "public/images/nabidky"
    polozky: list[dict] = []
    videne: set[str] = set()      # ID v rámci jednoho portálu
    videne_otisky: set[str] = set()   # nemovitost napříč portály
    for src, rec in zaznamy:
        l = rec.listing
        kod = str(l.id or "")
        if not kod or kod in videne:
            continue
        # Táž nemovitost bývá na Sreality i na iDNES pod jiným ID. Bez otisku
        # (typ | transakce | plocha | cena | lokalita) by se na web dostala
        # dvakrát — ověřeno 24. 9. 2026, klientka má na obou portálech
        # stejných pět nabídek.
        klic = _klic_nemovitosti(l)
        if klic:
            if klic in videne_otisky:
                log.info("přeskakuji duplicitu napříč portály: %s", (l.title or kod)[:60])
                continue
            videne_otisky.add(klic)
        videne.add(kod)
        polozky.append({
            "kod": kod,
            "nazev": l.title or "",
            "adresa": (l.location.raw or "") if l.location else "",
            "mesto": " – ".join(x for x in ((l.location.city if l.location else None),
                                            (l.location.city_part if l.location else None)) if x),
            "cena": l.price_raw or "Cena na vyžádání",
            "druh": DRUHY_NAZVY.get(l.property_type or "", (l.property_type or "Nemovitost").capitalize()),
            "operace": l.transaction_type or "prodej",
            "plocha": f"{l.area_m2:g} m²" if l.area_m2 else "",
            "energie": l.energy_class or "",
            "popis": l.description or "",
            "fotekCelkem": len(rec.images),
            "zdroj": l.url or "",
            "fotky": stahni_fotky(rec, fotky_dir, kod, client) if a.zapsat else [],
        })

    print(f"\nNabídek celkem: {len(polozky)}")
    for p in polozky:
        print(f"  [{p['kod']:>16}] {p['nazev'][:52]:<52} {p['cena']:>16}  fotek {len(p['fotky'])}")

    if not a.zapsat:
        print("\n(zkušební běh — nic se nezapsalo; přidej --zapsat)")
        return 0

    cil = projekt / "src/app/data-nabidky.ts"
    cil.write_text(sestav_ts(polozky), encoding="utf-8")
    print(f"\nZapsáno: {cil.relative_to(ROOT)} ({len(polozky)} nabídek)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
