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
    kod: "1187438668",
    nazev: "Prodej bytu 3+1 107 m²",
    adresa: "Rumunská, Olomouc - Neředín",
    mesto: "Olomouc – Neředín",
    cena: "9 900 000 Kč",
    druh: "Byt",
    operace: "prodej",
    plocha: "107 m²",
    energie: "Úsporná",
    popis: "Nabízíme k prodeji lukrativní cihlový bytu 3+1 v Olomouci, Rumunská ulice, který je ideální volbou pro zájemce, který hledá komfortní, prostorné a moderní bydlení s výbornou dostupností do centra města a s veškerou občanskou vybaveností v těsné blízkosti ( Globus, MŠ, ZŠ, nemocnice, obchody, služby...). Byt se nachází ve třetím patře cihlového domu s výtahem, užitná plocha 107 m². Byt má prostorné neprůchozí pokoje, u dvou z nich jsou lodžie, orientace JZ, výhled do zeleně do klidu. Koupelna se sprchovým koutem, místo na pračku i sušičku a wc samostatně. V bytě je také samostaná komora, druhá komora pak na chodbě naproti bytu. Byt prošel rekonstrukcí před 5 lety, nové podlahy, okna trojskla se žaluziemi, odhlučnění od sousedů, nové zásuvky a vypínače, nová kuch.linka vč. spotřebičů, nové obklady a dlažby v koupelně a na wc, stupačky v nerezu r.2025. V blízké době se plánuje výměna střechy na domě a opravy garážových prostor, na něž je našetřeno ve fondu oprav.\nDo domu je bezbariérový přístup s novým prostorným výtahem, čímž je byt dostupný pro všechny generace.\nEnergetická třída bytu je C což zajišťuje přiměřené měsíční náklady, a to 5610 Kč + elektřina,z toho fond oprav činí 2680 Kč.\nK bytu náleží parkovací prostorné místo v podzemních garážích, kde je možno kromě parkování auta parkovat ještě velkou motorku.\nPo dohodě je možno ponechat vybavení bytu nebo jeho část.\nProhlídky jsou možné po předchozí domluvě o víkendech i svátcích. Pro více informací o této nemovitosti nebo sjednání prohlídky nás prosím kontaktujte nebo vyplňte níže uvedený formulář, rádi Vám pomůžeme.",
    fotekCelkem: 25,
    zdroj: "https://www.sreality.cz/detail/prodej/byt/3+1/olomouc-neredin-rumunska/1187438668",
    fotky: [
      { src: "/images/nabidky/1187438668-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/1187438668-02.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/1187438668-03.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/1187438668-04.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/1187438668-05.jpg", sirka: 900, vyska: 1200 },
    ],
  },
  {
    kod: "816238668",
    nazev: "Prodej rodinného domu 134 m², pozemek 305 m²",
    adresa: "Na kopci, Velký Týnec",
    mesto: "Olomouc – Velký Týnec",
    cena: "5 890 000 Kč",
    druh: "Dům",
    operace: "prodej",
    plocha: "134 m²",
    energie: "",
    popis: "Nabízíme k prodeji RD 3,5 + 1, ul. Na Kopci, Velký Týnec. Jedná se o samostatně stojící přízemní RD s připraveným podkrovím k vybudování dalších pokojů. Dům je ze smíšeného zdiva, převážně cihly, tvárnice (tl.stěn 50cm), s terasou a zahradou. Byl postaven v roce cca 1953, prošel rekonstrukcí v roce 1990 a v roce 2019 prošel další rekonstrukcí převážně zvenčí, kterou má majitelka kompletně zdokumentovanou. Došlo k podřezání domu a usazení folie proti vlhkosti, zateplení, fasáda, nová plechová střecha, osazení 2 ks panelů na cirkulaci vzduchu v domě, ve všech místnostech nové omítky, výmalby, terénní úpravy kolem domu, terasa k posezení.\nDům je částečně podsklepený, v přízemí se nachází vstupní chodba ze vchodem z ulice a vchodem přes terasu do zahrady, kuchyň, obývák, ložnice a dětský pokoj se šatnou, dále koupelna s vanou a samostané wc, komora a schodiště do sklepa. V patře je pak připraveno obytné podrovní pro byt 2+kk, zatím vstup pouze zvenčí . V zahradě se nachází další kamenný obloukový sklípek. Zahrada je mírně svažitá, oplocená. Dům je bez garáže, parkovací místa před domem. Dům má vlastní studnu, je napojena do domu k využití užitkové vody. V domě připojen i obecní vodovod, plynový kotel k vytápění a ohřevu TUV, obecní kanalizace.\nDům se nachází v mírném kopci, ve slepé ulici, v centru obce, vše v bezprostřední blízkosti. Obec Velký Týnec je 9 km vzdálená od Olomouce, blízko se nachází nákupní centrum Olympie, autobusová doprava, v obci veškerá občanská vybavenost, lékaři, MŠ, ZŠ, pošta, obchody, hospody, obecní úřad, hřiště, časté kulturní i sportovní akce. Dům je nyní obydlený nájemníky se smlouvou do 28.2.2027, kteří čekají na dokončení jiného bydlení, předpokládané uvolnění domu 10-11/2026. Prohlídky po dohodě, možné i víkendy. Energetický průkaz se zpracovává, bude kupujícímu doložen, proto nyní uvádíme tř.G. Dále budou geodetem přesně zaměřeny a vytýčeny hranice pozemku.\nProhlídky po dohodě, možno i víkendy.\nCena k jednání 5 890 000 Kč.",
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
    kod: "1294118988",
    nazev: "Pronájem bytu 2+1 66 m²",
    adresa: "Skrbeňská, Horka nad Moravou",
    mesto: "Olomouc – Horka nad Moravou",
    cena: "13 500 Kč/měsíc",
    druh: "Byt",
    operace: "pronájem",
    plocha: "66 m²",
    energie: "",
    popis: "Pronájem bytu 2+1 o rozloze cca 66m2 ve 2.NP ( první patro) rodinného domu v Horce nad Moravou - nejraději partě ideálně 4 vysokoškolských studentů,nebo i párům, pouze nekuřáci vb bytě a bez zvířat.\nNabízíme samostatný byt se dvěma neprůchozími pokoji (21,9m2 a 18,5m2), oba nově vybavené dvěma postelemi vč. matrací, šatními skříněmi a pracovními stoly s křesly (viz foto)\nByt má samostatný vchod ze společného schodiště. Je po celkové rekonstrukci, kompletně vybavený novým nábytkem, koberci, záclonami, v oknech žaluzie. Kuchyňská linka je vč spotřebičů - varná deska, elektrická trouba, myčka, digestoř, americká kombinovaná lednice, jídelní stůl s lavicí a židlemi, televize. Z kuchyně je vchod na balkon s možností posezení. Dále nová koupelna s vanou 170x75 cm, umyvadlo, zrcadlo, pračka, sušička. Internet přes wifi. Byt má samostatný odpočtový elektroměr a samostatné vodoměry na teplou a studenou vodu, voda obecní i z vlastní studny, což umožní značné šetření vody z obecního řádu. Možnost spoluužívání dvorku a zahrady. Parkování osobního vozu ve dvoře, možno dohodnout úložný prostor pro kolo, koloběžku, lyže apod..\nVolný ihned.\nCena pro 4 osoby: nájem 13500 Kč/měsíc vč.internetu (+ 2000 topení na celý byt + zálohy na elektřinu a vodu 1000,-/osobu).\nPro jednu osobu: - nájem 3750+ inkaso. Zálohy na energie majitel vyúčtovává.\nObec Horka nad Moravou je vzdálena od města Olomouce 7 km (10min cesty) , je zde spojení autobusy MHD - zastávka linky 18 před domem a zastávka linky č. 20 vzdálená 300 metrů od domu, i vlakové spojení.Autobus č.20 zajíždí přímo bez přestupu k fakultě přírodověděcké, fakultě právnické a fakultě pedagogické.\nV obci obchody, lékař, zubař, hřiště, kostel, cyklotrasy, trasy pro pěší - brána do CHKO Litovelské Pomoraví.\nMajitel požaduje jistotu ve výši 20 000 Kč (tj. 5000,- Kč/osobu). Jistotu je možné složit ve dvou splátkách.\nProvize RK jeden nájem tj. 13500Kč (3375 Kč/osoba).\nProhlídky po tel.dohodě ,možno i víkendy a svátky.\nUbytování je vhodné pro studenty či mladé páry.",
    fotekCelkem: 13,
    zdroj: "https://www.sreality.cz/detail/pronajem/byt/2+1/horka-nad-moravou-horka-nad-moravou-skrbenska/1294118988",
    fotky: [
      { src: "/images/nabidky/1294118988-01.jpg", sirka: 1000, vyska: 666 },
      { src: "/images/nabidky/1294118988-02.jpg", sirka: 1000, vyska: 667 },
      { src: "/images/nabidky/1294118988-03.jpg", sirka: 1000, vyska: 667 },
      { src: "/images/nabidky/1294118988-04.jpg", sirka: 1000, vyska: 667 },
      { src: "/images/nabidky/1294118988-05.jpg", sirka: 1000, vyska: 667 },
    ],
  },
  {
    kod: "2228940876",
    nazev: "Pronájem kanceláře 484 m²",
    adresa: "Holická, Olomouc",
    mesto: "Olomouc – obec Olomouc",
    cena: "53 000 Kč/měsíc (110 Kč/m²)",
    druh: "Komerční prostor",
    operace: "pronájem",
    plocha: "484 m²",
    energie: "",
    popis: "Pronájem nebytových prostor ul. Holická v Olomouci. Nabízíme nebytový prostor, který se nachází v 1.patře domu bez výtahu. Jedná se o pronájem celého patra, s vlastním uzamykatelným vchodem ze schodiště. V nabídce je 12 samostaných kanceláří s internetem, kancelář naproti vstupním dveřím je vybavena videotelefonem, na patře kuchyňka, sklad, sprchy ženy , sprchy muži,WC ženy,Wc muži. Vytápění je zajištěno dvěma plnovými kotli, na patře jsou dvojí měřidla plynu, elektřiny a vody, tudíž patro lze rozdělit na dvě samostatné části se společným zázemím (WC, sprchy, kuchyňka). Inkaso (plyn,elektřina, voda) se pohybuje v částce 12 000 Kč/měs. Odvoz odpadu si zajišťuje nájemce sám. Možnost využití cca 3 parkovacích míst na krytém parkovišti za dohodnutý poplatek. Volné od 1.10.2026. Ostatní dle dohody s pronajímatelem. Prohlídky možné po dohodě.",
    fotekCelkem: 6,
    zdroj: "https://www.sreality.cz/detail/pronajem/komercni/kancelare/olomouc-olomouc-holicka/2228940876",
    fotky: [
      { src: "/images/nabidky/2228940876-01.jpg", sirka: 1200, vyska: 900 },
      { src: "/images/nabidky/2228940876-02.jpg", sirka: 1200, vyska: 673 },
      { src: "/images/nabidky/2228940876-03.jpg", sirka: 1200, vyska: 673 },
      { src: "/images/nabidky/2228940876-04.jpg", sirka: 754, vyska: 445 },
      { src: "/images/nabidky/2228940876-05.jpg", sirka: 1200, vyska: 673 },
    ],
  },
  {
    kod: "1937092684",
    nazev: "Prodej stavebního pozemku 2097 m²",
    adresa: "Stará Ves",
    mesto: "Bruntál – Stará Ves",
    cena: "2 950 000 Kč (1 407 Kč/m²)",
    druh: "Pozemek",
    operace: "prodej",
    plocha: "2097 m²",
    energie: "",
    popis: "Ve výhradním zastoupení majitelů nabízíme pozemek určený k výstavbě rodinného domu či rekreačního objektuv obci Stará Ves u Rýmařova.\nPozemek má rozlohu 2097m2 a nachází se v klidné části obce vzdálené od Rýmařova 5 km. Pozemek je dostupný přímo z asfaltové komunikace, kde se se nachází inženýrské sítě (kanalizace, voda, elektřina). Kolem pozemku je vybudovaný chodník pro pěší ze zámkové dlažby. Pozemek lze rozdělit na dva i tři samostatné menší parcely.\nV obci Stará Ves najdeme školu, školku, poštu, obchod, restauraci, v městě Rýmařově pak veškerou občanskou vybavenost. Snadná dostupnost autem či autobusem.\nV blízkém okolí najdete sjezdovky,trasy pro běžkaře, cyklotrasy, výlety pro pěší např.na známé sedlo Skřítek, vzdálené cca 8km.\nBližší informace rádi poskytneme,prohlídky po dohodě, možno i o víkendech.",
    fotekCelkem: 14,
    zdroj: "https://www.sreality.cz/detail/prodej/pozemek/bydleni/stara-ves-stara-ves-/1937092684",
    fotky: [
      { src: "/images/nabidky/1937092684-01.jpg", sirka: 1000, vyska: 750 },
      { src: "/images/nabidky/1937092684-02.jpg", sirka: 1000, vyska: 750 },
      { src: "/images/nabidky/1937092684-03.jpg", sirka: 1000, vyska: 750 },
      { src: "/images/nabidky/1937092684-04.jpg", sirka: 1000, vyska: 750 },
      { src: "/images/nabidky/1937092684-05.jpg", sirka: 1000, vyska: 750 },
    ],
  },
];

export function obalka(n: Nabidka): Foto | undefined {
  return n.fotky.find((f) => f.sirka >= f.vyska) ?? n.fotky[0];
}

export const DRUHY = Array.from(new Set(NABIDKY.map((n) => n.druh)));
