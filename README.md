# REAL family — web s automatickým načítáním nabídek

Statický web (Next.js export). Nabídky nemovitostí se **nevkládají ručně** —
načítají se z profilu kanceláře na Sreality.

## Jak se nabídky obnoví

1. **Samo** — GitHub Actions spouští obnovu podle plánu (viz
   `.github/workflows/obnovit-nabidky.yml`).
2. **Na kliknutí** — tlačítko „Načíst nabídky“ v administraci webu (`/admin/`).

Obnova stáhne aktuální nabídku, uloží fotky, přepíše `src/app/data-nabidky.ts`,
web přestaví a nasadí. Co už v nabídce není, z webu zmizí.

Zdroj nabídek se nastavuje v proměnné repozitáře `SREALITY_URL`
(Settings → Secrets and variables → Actions → Variables).
