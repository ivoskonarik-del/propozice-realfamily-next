/* Obsah webu REAL family.
 *
 * Texty vycházejí z nynějšího webu realfamily.cz a z e-mailů paní
 * Trnečkové Bryksové. Fakta se nevymýšlejí — co na starém webu nebylo
 * a klientka to nenapsala, tady chybí schválně.
 */

export const FIRMA = {
  nazev: "REAL family",
  majitelka: "Hana Trnečková Bryksová",
  telefon: "775 101 597",
  telefonHref: "tel:+420775101597",
  email: "hana.bryksova@seznam.cz",
  ico: "62345222",
  odRoku: 2004,
  smluv: 1000,
  sreality:
    "https://www.sreality.cz/adresar/hana-trneckova-bryksova-real-family-bystrovany/5391",
};

export const KANCELARE = [
  {
    mesto: "Olomouc",
    adresa: "Jihoslovanská 491/33",
    castObce: "Olomouc-Povel",
    mapa: "https://mapy.cz/zakladni?q=Jihoslovansk%C3%A1%20491%2F33%20Olomouc",
    mapka: "/images/mapa-olomouc.jpg",
  },
  {
    mesto: "Hranice",
    adresa: "Cementářské sídliště 1234",
    castObce: "Hranice",
    mapa: "https://mapy.cz/zakladni?q=Cement%C3%A1%C5%99sk%C3%A9%20s%C3%ADdli%C5%A1t%C4%9B%201234%20Hranice",
    mapka: "/images/mapa-hranice.jpg",
  },
];

export const MAKLERI = [
  { jmeno: "Hana Trnečková Bryksová", role: "majitelka kanceláře" },
  { jmeno: "Ing. Jitka Kubešová", role: "realitní makléřka" },
];

/* Jedenáct služeb ze stávajícího webu, doslova. Pořadí je změněné tak,
   aby nahoře stálo to, čím se kancelář živí nejvíc. */
export const SLUZBY = [
  {
    klic: "prodej",
    nazev: "Prodej nemovitostí",
    text: "Prodáváte nebo hledáte nemovitost? V tom případě jste u nás správně! Celým procesem vás rádi provedeme a vše zařídíme za vás.",
  },
  {
    klic: "pronajem",
    nazev: "Pronájem nemovitostí",
    text: "Samozřejmostí je i zprostředkování pronájmu nemovitostí. Ať už tedy hledáte pronájem nebo chcete pronajmout vaši nemovitost, neváhejte nás kontaktovat. Veškeré úkony zařídíme za vás.",
  },
  {
    klic: "pravni",
    nazev: "Právní servis",
    text: "Nájemní smlouva, předávací protokol, kupní smlouva, smlouva o depositní úschově a vklad do katastru pro nás nejsou žádný oříšek. Veškeré smlouvy pro nás zajišťuje advokátní kancelář.",
  },
  {
    klic: "oceneni",
    nazev: "Ocenění nemovitosti",
    text: "Zajistíme potřebné znalecké posudky a vytvoříme tržní odhad ceny vaší nemovitosti.",
  },
  {
    klic: "prohlidky",
    nazev: "Prohlídky nemovitostí",
    text: "Zprostředkování prohlídek nemovitostí můžeme díky naší časové flexibilitě téměř kdykoliv. Obraťte se na nás a rezervujte si prohlídku.",
  },
  {
    klic: "foto",
    nazev: "Profesionální fotografie",
    text: "Ať už prodej, nebo pronájem vaší nemovitosti potřebuje kvalitní fotky, které vytvoří důležitý první dojem. Profesionálně nafotíme vaši nemovitost.",
  },
  {
    klic: "pozustalost",
    nazev: "Vyřešení pozůstalosti",
    text: "Prodej nemovitosti z dědictví zařídíme za vás. Obraťte se na nás s vyřešením pozůstalosti a zajistíme tržní odhad i prodej vaší nemovitosti.",
  },
  {
    klic: "financovani",
    nazev: "Financování",
    text: "Společně vybereme nejlepší řešení financování pro váš nový domov. Poradíme, jak financovat hypotéku i tehdy, když nemáte vlastní úspory.",
  },
  {
    klic: "geodet",
    nazev: "Geodetické služby",
    text: "Zaměření skutečného stavu stavby nebo rozparcelování pozemku nechte na nás. Zjistíme všechny inženýrské sítě a vyhotovíme geometrický plán.",
  },
  {
    klic: "oddluzeni",
    nazev: "Oddlužení nemovitosti",
    text: "Obrátit se na nás můžete i s exekučním vypořádáním. Svěřte nám jednání s věřiteli a vaši nemovitost oddlužíme raz dva.",
  },
  {
    klic: "penb",
    nazev: "Průkaz energetické náročnosti",
    text: "Vaši nemovitost opatříme energetickým průkazem se zařazením do tříd A až G. Nedělejte si starosti s PENB a nechte to na nás.",
  },
];

/* Správa nájemních domů — druhá nohá kanceláře, na starém webu jen
   jednou větou v odstavci „O nás". Klientka výslovně žádala, ať je jí
   na webu víc. */
export const SPRAVA = {
  mesta: ["Olomouc", "Hranice", "Olšovec"],
  uvod: "Můžete se na nás obrátit i se správou nájemních bytů, kterou už zajišťujeme pro majitele bytových domů v Olomouci, Hranicích a Olšovci.",
  body: [
    {
      nazev: "Nájemní vztahy",
      text: "Sháníme nájemníky, prověřujeme je, uzavíráme nájemní smlouvy a hlídáme jejich konce i výpovědní lhůty.",
    },
    {
      nazev: "Platby a evidence",
      text: "Sledujeme úhrady nájemného a záloh, upomínáme dlužníky a vedeme přehled, který majitel kdykoli uvidí.",
    },
    {
      nazev: "Provoz domu",
      text: "Řešíme běžnou údržbu, havárie i dodavatele. Majitel nemusí zvedat telefon uprostřed noci.",
    },
    {
      nazev: "Předávání bytů",
      text: "Přebíráme a předáváme byty s protokolem, odečty měřidel a fotodokumentací stavu.",
    },
  ],
};

/* Partneři, se kterými kancelář spolupracuje — z e-mailu klientky
   z 18. 9. 2026 a ze stránky Služby. */
export const PARTNERI = [
  {
    nazev: "Advokátní kancelář",
    text: "Kupní i nájemní smlouvy, úschova kupní ceny a vklad do katastru nemovitostí. Žádnou smlouvu neuzavíráme bez právní konzultace.",
  },
  {
    nazev: "Geodeti",
    text: "Geometrické plány, zaměření skutečného stavu stavby a dohledání inženýrských sítí u pozemků.",
  },
  {
    nazev: "Znalci ve stavebnictví",
    text: "Znalecké posudky a odhady tržní ceny, posouzení stavu objektu před koupí.",
  },
  {
    nazev: "Finanční poradci",
    text: "Srovnání hypoték a zajištění financování včetně případů, kdy kupující nemá vlastní úspory.",
  },
];

/* Krátké pravdivé věty z inzerátů — na webu slouží jako důkaz, ne jako
   marketingová vata. */
export const CISLA = [
  { hodnota: "2004", popis: "na realitním trhu od" },
  { hodnota: "1 000+", popis: "uzavřených smluv" },
  { hodnota: "2", popis: "kanceláře — Olomouc a Hranice" },
  { hodnota: "11", popis: "služeb pod jednou střechou" },
];

export const TIP = {
  nadpis: "Odměna za tip na nemovitost",
  text: "Znáte někoho, kdo bude prodávat nebo už prodává byt, rodinný dům, pozemek či jinou nemovitost? Napište nám a domluvíme se na odměně.",
};

/** Nezlomitelná mezera za jednoznakovými předložkami a spojkami. */
export function nb(text: string): string {
  return text.replace(/(^|[\s(„"])([aikosuvzAIKOSUVZ])\s/g, "$1$2 ");
}
