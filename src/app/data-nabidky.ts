/* Nabídky nemovitostí — GENEROVANÝ SOUBOR, needitovat ručně.
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
  {
    kod: "816238668",
    nazev: "Prodej rodinného domu 134 m², pozemek 305 m²",
    adresa: "Na kopci, Velký Týnec",
    mesto: "Olomouc – Velký Týnec",
    cena: "4 590 000 Kč",
    druh: "Dům",
    operace: "prodej",
    plocha: "134 m²",
    energie: "",
    popis: "Nabízíme k prodeji RD 3,5 + 1, ul. Na Kopci, Velký Týnec. Jedná se o samostatně stojící přízemní RD s připraveným podkrovím k vybudování dalších pokojů. Dům je ze smíšeného zdiva, převážně cihly, tvárnice (tl.stěn 50cm), s terasou a zahradou. Byl postaven v roce cca 1953, prošel rekonstrukcí v roce 1990 a v roce 2019 prošel další rekonstrukcí převážně zvenčí, kterou má majitelka kompletně zdokumentovanou. Došlo k podřezání domu a usazení folie proti vlhkosti, zateplení, fasáda, nová plechová střecha, osazení 2 ks panelů na cirkulaci vzduchu v domě, ve všech místnostech nové omítky, výmalby, terénní úpravy kolem domu, terasa k posezení.\nDům je částečně podsklepený, v přízemí se nachází vstupní chodba ze vchodem z ulice a vchodem přes terasu do zahrady, kuchyň, obývák, ložnice a dětský pokoj se šatnou, dále koupelna s vanou a samostané wc, komora a schodiště do sklepa. V patře je pak připraveno obytné podrovní pro byt 2+kk, zatím vstup pouze zvenčí . V zahradě se nachází další kamenný obloukový sklípek. Zahrada je mírně svažitá, oplocená. Dům je bez garáže, parkovací místa před domem. Dům má vlastní studnu, je napojena do domu k využití užitkové vody. V domě připojen i obecní vodovod, plynový kotel k vytápění a ohřevu TUV, obecní kanalizace.\nDům se nachází v mírném kopci, ve slepé ulici, v centru obce, vše v bezprostřední blízkosti. Obec Velký Týnec je 9 km vzdálená od Olomouce, blízko se nachází nákupní centrum Olympie, autobusová doprava, v obci veškerá občanská vybavenost, lékaři, MŠ, ZŠ, pošta, obchody, hospody, obecní úřad, hřiště, časté kulturní i sportovní akce. Dům je nyní obydlený nájemníky se smlouvou do 28.2.2027, kteří čekají na dokončení jiného bydlení, předpokládané uvolnění domu 11/2026. Prohlídky po dohodě, možné i víkendy. Energetický průkaz tř.G. Geodetem bylo vyhotoveno přesné vytýčení hranic pozemku, které odpovídá skutečnosti.\nProhlídky po dohodě, možno i víkendy.\nCena k jednání 4 590 000Kč.",
    fotekCelkem: 20,
    zdroj: "https://www.sreality.cz/detail/prodej/dum/rodinny/velky-tynec-velky-tynec-na-kopci/816238668",
    fotky: [
      { src: "/propozice-realfamily-next/images/nabidky/816238668-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/propozice-realfamily-next/images/nabidky/816238668-02.jpg", sirka: 1200, vyska: 900 },
      { src: "/propozice-realfamily-next/images/nabidky/816238668-03.jpg", sirka: 1200, vyska: 900 },
      { src: "/propozice-realfamily-next/images/nabidky/816238668-04.jpg", sirka: 900, vyska: 1200 },
      { src: "/propozice-realfamily-next/images/nabidky/816238668-05.jpg", sirka: 900, vyska: 1200 },
    ],
  },
  {
    kod: "717516876",
    nazev: "Pronájem bytu 3+1 63 m²",
    adresa: "Hamerská, Olomouc - Holice",
    mesto: "Olomouc – Holice",
    cena: "13 500 Kč/měsíc",
    druh: "Byt",
    operace: "pronájem",
    plocha: "63 m²",
    energie: "Úsporná, č. 78/2013 Sb.",
    popis: "Pronájem bytu 3+1 se šatnou, ul. Hamerská, Olomouc. Panelový byt o rozloze 63m2 se nachází v 1.patře domu (zvýšené přízemí). Byt je po kompletní rekonstrukci, 2 pokoje jsou neprůchozí (ložnice, dětský), podlahy koberec, v obýváku plovoučka, kuchyně a koupelna dlažba, chodba vinyl, nové dveře, vymalovaný bílou barvou, čistě uklizený. Koupelna společná s wc, sprchový kout. Byt se pronajímá kompletně zařízený nábytkem, spotřebiče (lednička,mikrovlnka, linka je připravena na myčku), vybavený televizí, nádobím, záclonami, závěsy, ve všech místnostech zůstává osvětlení. K bytu náleží sklepní koje.Je připravený k okamžitému bydlení. Volný od 1.1.2027. Pouze nekuřáci, zájemci bez zvířat a bez dluhů. U domu dětské hřiště, parkoviště, zastávka autobusu MHD směr Holice a Olomouc. Měsíční náklady 2400,- Kč vč.elektřiny a plynu (vaření). Prohlídky po dohodě. Skládá se jistota ve výši dvou nájmů, možno složit ve dvou splátkách, provize RK jeden nájem.",
    fotekCelkem: 11,
    zdroj: "https://www.sreality.cz/detail/pronajem/byt/3+1/olomouc-holice-hamerska/717516876",
    fotky: [
      { src: "/propozice-realfamily-next/images/nabidky/717516876-01.jpg", sirka: 900, vyska: 1200 },
      { src: "/propozice-realfamily-next/images/nabidky/717516876-02.jpg", sirka: 900, vyska: 1200 },
      { src: "/propozice-realfamily-next/images/nabidky/717516876-03.jpg", sirka: 900, vyska: 1200 },
      { src: "/propozice-realfamily-next/images/nabidky/717516876-04.jpg", sirka: 1200, vyska: 900 },
      { src: "/propozice-realfamily-next/images/nabidky/717516876-05.jpg", sirka: 1200, vyska: 900 },
    ],
  },
  {
    kod: "2228940876",
    nazev: "Pronájem kanceláře 20 m²",
    adresa: "Holická, Olomouc",
    mesto: "Olomouc – obec Olomouc",
    cena: "7 000 Kč/měsíc (350 Kč/m²)",
    druh: "Komerční prostor",
    operace: "pronájem",
    plocha: "20 m²",
    energie: "",
    popis: "Pronájem nebytových prostor ul. Holická v Olomouci. Nabízíme nebytový prostor, který se nachází v 1.patře (2.NP) domu bez výtahu. Jedná se o pronájem jednotlivých kanceláři o výměře cca 20m2 (viz plánek) nebo také celého patra (s vlastním uzamykatelným vchodem ze schodiště). V nabídce je 12 samostaných kanceláří s internetem, kancelář naproti vstupním dveřím je vybavena videotelefonem, na patře kuchyňka, sklad, sprchy ženy , sprchy muži,WC ženy,Wc muži. Vytápění je zajištěno dvěma plnovými kotli, na patře jsou měřidla plynu, elektřiny a vody. Možnost využití cca 3 parkovacích míst (nebo dle dohody) na krytém parkovišti za poplatek 100 Kč/měs/místo. Volné ihned. Ostatní dle dohody s pronajímatelem. Prohlídky možné po dohodě.",
    fotekCelkem: 7,
    zdroj: "https://www.sreality.cz/detail/pronajem/komercni/kancelare/olomouc-olomouc-holicka/2228940876",
    fotky: [
      { src: "/propozice-realfamily-next/images/nabidky/2228940876-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/propozice-realfamily-next/images/nabidky/2228940876-02.jpg", sirka: 1200, vyska: 673 },
      { src: "/propozice-realfamily-next/images/nabidky/2228940876-03.jpg", sirka: 1200, vyska: 673 },
      { src: "/propozice-realfamily-next/images/nabidky/2228940876-04.jpg", sirka: 754, vyska: 445 },
      { src: "/propozice-realfamily-next/images/nabidky/2228940876-05.jpg", sirka: 1200, vyska: 673 },
    ],
  },
];

export function obalka(n: Nabidka): Foto | undefined {
  return n.fotky.find((f) => f.sirka >= f.vyska) ?? n.fotky[0];
}

export const DRUHY = Array.from(new Set(NABIDKY.map((n) => n.druh)));
