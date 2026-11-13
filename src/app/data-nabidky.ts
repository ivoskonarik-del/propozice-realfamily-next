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
    cena: "4 900 000 Kč",
    druh: "Dům",
    operace: "prodej",
    plocha: "134 m²",
    energie: "",
    popis: "Nabízíme k prodeji RD 3,5 + 1, ul. Na Kopci, Velký Týnec. Jedná se o samostatně stojící přízemní RD s připraveným podkrovím k vybudování dalších pokojů. Dům je ze smíšeného zdiva, převážně cihly, tvárnice (tl.stěn 50cm), s terasou a zahradou. Byl postaven v roce cca 1953, prošel rekonstrukcí v roce 1990 a v roce 2019 prošel další rekonstrukcí převážně zvenčí, kterou má majitelka kompletně zdokumentovanou. Došlo k podřezání domu a usazení folie proti vlhkosti, zateplení, fasáda, nová plechová střecha, osazení 2 ks panelů na cirkulaci vzduchu v domě, ve všech místnostech nové omítky, výmalby, terénní úpravy kolem domu, terasa k posezení.\nDům je částečně podsklepený, v přízemí se nachází vstupní chodba ze vchodem z ulice a vchodem přes terasu do zahrady, kuchyň, obývák, ložnice a dětský pokoj se šatnou, dále koupelna s vanou a samostané wc, komora a schodiště do sklepa. V patře je pak připraveno obytné podrovní pro byt 2+kk, zatím vstup pouze zvenčí . V zahradě se nachází další kamenný obloukový sklípek. Zahrada je mírně svažitá, oplocená. Dům je bez garáže, parkovací místa před domem. Dům má vlastní studnu, je napojena do domu k využití užitkové vody. V domě připojen i obecní vodovod, plynový kotel k vytápění a ohřevu TUV, obecní kanalizace.\nDům se nachází v mírném kopci, ve slepé ulici, v centru obce, vše v bezprostřední blízkosti. Obec Velký Týnec je 9 km vzdálená od Olomouce, blízko se nachází nákupní centrum Olympie, autobusová doprava, v obci veškerá občanská vybavenost, lékaři, MŠ, ZŠ, pošta, obchody, hospody, obecní úřad, hřiště, časté kulturní i sportovní akce. Dům je nyní obydlený nájemníky se smlouvou do 28.2.2027, kteří čekají na dokončení jiného bydlení, předpokládané uvolnění domu 11/2026. Prohlídky po dohodě, možné i víkendy. Energetický průkaz tř.G. Geodetem bylo vyhotoveno přesné vytýčení hranic pozemku, které odpovídá skutečnosti.\nProhlídky po dohodě, možno i víkendy.\nCena k jednání 4 590 000Kč.",
    fotekCelkem: 20,
    zdroj: "https://www.sreality.cz/detail/prodej/dum/rodinny/velky-tynec-velky-tynec-na-kopci/816238668",
    fotky: [
      { src: "/images/nabidky/816238668-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/816238668-02.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/816238668-03.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/816238668-04.jpg", sirka: 900, vyska: 1200 },
      { src: "/images/nabidky/816238668-05.jpg", sirka: 900, vyska: 1200 },
    ],
  },
  {
    kod: "837357644",
    nazev: "Pronájem bytu 2+1 58 m²",
    adresa: "Hraniční, Olomouc",
    mesto: "Olomouc – obec Olomouc",
    cena: "12 500 Kč/měsíc",
    druh: "Byt",
    operace: "pronájem",
    plocha: "58 m²",
    energie: "Úsporná",
    popis: "Nabízíme k pronájmu panelový byt 2+1 v Olomouci, Hraniční ulice. Byt se nachází v 5.patře revitalizovaného panelového domu s výtahem, je v osobním vlastnictví, s užitnou plochu 58 m². Byt má všechny pokoje samostatné, neprůchozí, koupelna se sprch.koutem, wc samostaně a komora vybavená regály. Kuchyně je prostorná, vybavená linkou, plynovým sporákem s digestoří a potravinovou skříní. Pokoje jsou bez vybavení, pouze nová stropní svítidla. U jednoho pokoje je lodžie orientovná na JV. V chodbě se nacházejí starší vestavěné skříně, poskytující velký úložný prostor.\nByt je ve velmi dobrém stavu,nyní prošel částečnou rekonstrukcí, nové dveře, vinylové podlahy, parkety v pokojích po renovaci, nové výmalby, vše čistě uklizeno. K bytu náleží sklepní kóje umístěná v suterénu domu.\nPo dohodě je možno byt dovybavit spotřebiči (pračka, lednička, mikrovlnka...)\nNájemné čini 12 500 Kč + služby 3845 Kč Kč + elektřinu a plyn (pouze vaření) si hradí nájemce sám. Provize za zprostředkování pronájmu je stanovena na\n12 500 Kč,jistota činí 25 000 Kč a lze ji složit ve dvou splátkách. Byt je k dispozici od 1.12.2026.\nVelmi dobrá lokalita s veškerou občanskou vybaveností v místě a výbornou dostupností do všech částí města.\nMožné i studenti. Pouze nekuřáci, zájemci bez exekucí a jiných dluhů a bez zvířat.\nMajitelé jsou ochotni se dohodnout na příp.úpravě bytu či doplnění vybavení (lednička, pračka...).\nPokud Vás byt zaujal, neváhejte nám napsat nebo zavolat a domluvit se na prohlídce (možno i víkendy a svátky).",
    fotekCelkem: 11,
    zdroj: "https://www.sreality.cz/detail/pronajem/byt/2+1/olomouc-olomouc-hranicni/837357644",
    fotky: [
      { src: "/images/nabidky/837357644-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/837357644-02.jpg", sirka: 900, vyska: 1200 },
      { src: "/images/nabidky/837357644-03.jpg", sirka: 900, vyska: 1200 },
      { src: "/images/nabidky/837357644-04.jpg", sirka: 900, vyska: 1200 },
      { src: "/images/nabidky/837357644-05.jpg", sirka: 900, vyska: 1200 },
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
      { src: "/images/nabidky/2228940876-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/2228940876-02.jpg", sirka: 1200, vyska: 673 },
      { src: "/images/nabidky/2228940876-03.jpg", sirka: 1200, vyska: 673 },
      { src: "/images/nabidky/2228940876-04.jpg", sirka: 754, vyska: 445 },
      { src: "/images/nabidky/2228940876-05.jpg", sirka: 1200, vyska: 673 },
    ],
  },
];

export function obalka(n: Nabidka): Foto | undefined {
  return n.fotky.find((f) => f.sirka >= f.vyska) ?? n.fotky[0];
}

export const DRUHY = Array.from(new Set(NABIDKY.map((n) => n.druh)));
