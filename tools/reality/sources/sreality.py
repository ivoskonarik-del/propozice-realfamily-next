"""Sreality.cz — zdroj inzerátů (prodej i pronájem).

ROZHODNUTÍ A ODPOVĚDNOST
------------------------
Modul dosud stahování vědomě NEIMPLEMENTOVAL, a to ze dvou důvodů:

  1. `https://www.sreality.cz/robots.txt` začíná dvojicí
         User-agent: *
         Disallow: /
     Povolené jsou jmenovitě jen vyhledávače (Googlebot, SeznamBot, Bingbot,
     Slurp, DuckDuckBot, Baiduspider, YandexBot, Applebot, ia_archiver…).
     Náš robot mezi ně nepatří, takže podle robots.txt má zakázaný celý web.
  2. Smluvní podmínky služby Sreality.cz zakazují užívat software za účelem
     vytěžení databáze, jmenovitě „scrapování dat nebo jiným obdobným způsobem“.

Ověřeno znovu 18. 9. 2026: robots.txt ani smluvní podmínky se nezměnily
a veřejné API neexistuje — `/api/v1/estates` vrací 401 Unauthorized,
`/api/cs/v2/*` vrací 404.

Majitel projektu dal 18. 9. 2026 výslovný pokyn zdroj přesto zprovoznit
a nese za to odpovědnost. Zaslepka je proto nahrazena funkční implementací.
Protože robots.txt náš přístup zakazuje, obchází tenhle modul `RobotsGate`
sdíleného `HttpClient` a stahuje vlastní session (`_session()`). Je to jediné
místo v celém scraperu, kde se to děje, a děje se to na základě toho pokynu.

PRAVIDLA MODULU (tvrdé hranice, které se nepřekračují)
------------------------------------------------------
  * Chodíme s běžnou prohlížečovou hlavičkou (Chrome UA + odpovídající
    sec-fetch/sec-ch-ua sada). NIKDY se nevydáváme za Googlebota, SeznamBota
    ani jiného vyhledávače — to by byla lež o identitě, ne jen porušení
    robots.txt.
  * Žádná rotace proxy, žádné střídání IP, žádné obcházení captchy ani
    přihlášení. Když server zablokuje (401/403/captcha), zdroj čistě spadne
    s `SourceBlocked` a srozumitelnou hláškou. Nezkouší se to oklikou.
  * Mezi požadavky je povinný odstup nejméně `MIN_ODSTUP` = 1,5 s
    (viz `_pockej`) a při 429 nebo 5xx se zpomaluje exponenciálně
    (viz `_stahni`). Radši pomalu než agresivně.
  * Souhlasová zeď Seznamu (cmp.seznam.cz) se neobchází falešnou cookie
    souhlasu. Chodí se s `Accept: */*`, na který server vydá stránku rovnou;
    kdyby CMP přišla i tak, zdroj spadne se `SourceBlocked` (viz `HLAVICKY`
    a `get_text`).
  * Nepoužívá se Playwright ani jiný headless prohlížeč — není potřeba,
    výpis i detail jsou renderované na serveru.

CO JE KDE V HTML (ověřeno 18. 9. 2026 na 10 detailech)
------------------------------------------------------
Výpis   `https://www.sreality.cz/hledani/<prodej|pronajem>/<byty|domy|…>/<lokalita>`
        vrací 200 a ~750 kB server-side renderovaného HTML, 21 unikátních
        odkazů na detail. Stránkování je `?strana=N` (poslední strana je
        v odkazech na konci výpisu). Mezi sousedními stranami se občas pár
        inzerátů zopakuje (placené „tipy“), proto `discover` dedupluje.

Detail  `/detail/<prodej|pronajem>/<byt|dum|pozemek|…>/<dispozice>/<lokalita>/<id>`
        vrací 200 a ~690 kB, taky renderované na serveru. Stabilní záchytné
        body jsou atributy `data-e2e` (Sreality je používají pro vlastní
        e2e testy), třídy `css-xxxxx` jsou z Emotionu a mění se při každém
        buildu — na ty se NESPOLÉHÁME.

        titulek + adresa   <h1 data-e2e="detail-heading">   (dva řádky přes <br>)
        cena               první <p> za h1 („10 590 000 Kč“) — čitelná
        popis              <div data-e2e="detail-description"> → <pre>
        parametry          <dl> s <dt>Popisek:</dt><dd>hodnota</dd>
                           (Celková cena, Poznámka k ceně, Příslušenství,
                            Energetická náročnost, Stavba, Infrastruktura,
                            Plocha, Vlastnictví, ID zakázky, Vloženo…)
        fotky              <button data-e2e="gallery-collapsed-image"> → <img>
                           (desktop i mobilní galerie, dohromady kompletní sada;
                            proto se deduplikuje podle cesty bez query)
        makléř             <section> s <h2>Prodejce</h2>:
                             jméno  = <a href="/adresar/<rk>/<id>/makleri/<id>">
                             foto   = <img> v témže odkazu
                             telefon= <a href="tel:…">  („Zobrazit telefon“ je
                                      jen přepínač viditelnosti, číslo je v HTML)
                             e-mail = <a href="mailto:…">ADRESA</a> v <ul>
                                      pod tlačítkem „Zobrazit e-mail“
                             web    = externí <a> s utm_source=sreality.cz
        kancelář           tamtéž níž: <a href="/adresar/<rk>/<id>"> název + web
        souřadnice         odkaz na mapy.com/…?center=<lon>,<lat>
        kategorie          BreadcrumbList v prvním <script type="application/ld+json">

        Dva bloky `application/ld+json` na detailu JSOU, ale nesou jen
        BreadcrumbList a WebSite — data o nemovitosti v nich NEJSOU.
        `__NEXT_DATA__` obsahuje jen překlady, taky se na něj nespoléhá.

        Vzorek 8 detailů: e-mail byl v 6 z 8, telefon v 8 z 8.

        Hodnota <dd> u „Celková cena“ je proložená znaky nulové šířky
        (U+200B), takže se z ní číslo přímo přečíst nedá. Cenu proto bereme
        z hlavičky, kde je čitelná; <dd> slouží jen jako záloha a tam se
        znaky nulové šířky odstraní (jde o normalizaci textu, ne o prolomení
        ochrany — stejné číslo je i v og:description).

FOTKY
-----
Obrázkový server `*.sdn.cz` přijímá jen whitelistované recepty v `?fl=`:
holá URL bez `fl=` vrací 401, `res,1201,…` i `res,2000,…` vrací 400.
Strop je tedy 1200 px a odpovídá paměti projektu. V HTML jsou tři varianty
(1200/800/400 w), ta největší je ale opatřená vodoznakem (`wrm,…|webp,80`).
Bereme proto recept z `og:image` — `fl=res,1200,1200,1|shr,,20|jpg,80` —
který dává stejných 1200×900 bez vodoznaku a funguje na každé fotce galerie.
"""

from __future__ import annotations

import json
import logging
import random
import re
import time

from urllib.parse import urlencode, urljoin, urlsplit, urlunsplit, parse_qsl

import requests
from bs4 import BeautifulSoup

from .. import normalize as nz
from ..errors import FetchError, ParseError, SourceBlocked
from ..http_client import HttpClient
from ..models import Agency, Agent, Image, Listing, ListingRecord, Location
from .base import Source

log = logging.getLogger(__name__)

#: Povinný minimální odstup mezi dvěma požadavky. Nikdy se nesnižuje.
MIN_ODSTUP = 1.5
#: Odstup pro statické assety (fotky na CDN). Z fotek se stahuje jen 64 kB
#: hlavičky kvůli rozměrům a leží na cizím statickém serveru, kde plný
#: odstup nemá co chránit — zato dělal 12 z 13 sekund na jeden inzerát.
#: Stejnou hodnotu používá `reality/measure.py` (HttpClient.asset_interval).
ODSTUP_ASSETY = 0.3

#: Kolikrát se zkusí požadavek zopakovat při 429 / 5xx, než to vzdáme.
MAX_POKUSU = 4

#: Strop exponenciálního zpomalení v sekundách.
MAX_CEKANI = 60.0

#: Běžná prohlížečová hlavička. Vědomě NEobsahuje žádného vyhledávacího bota.
CHROME_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
)

HLAVICKY = {
    "User-Agent": CHROME_UA,
    # Pozor na `Accept`. Jakmile začíná `text/html…`, Seznam nás přes devět
    # přesměrování pošle na svou souhlasovou zeď cmp.seznam.cz („Nastavení
    # souhlasu s personalizací“) a místo výpisu přijde 21 kB CMP stránky.
    # Souhlas s personalizací za uživatele nevymýšlíme a cookie souhlasu
    # nefalšujeme, takže si o personalizovanou stránku prostě neříkáme:
    # `*/*` je běžná, nelživá hodnota („jakýkoli typ obsahu“) a server na ni
    # vydá stejné server-side renderované HTML. Když se CMP stránka přesto
    # vrátí, zdroj spadne se SourceBlocked (viz `get_text`).
    "Accept": "*/*",
    "Accept-Language": "cs-CZ,cs;q=0.9,sk;q=0.8,en;q=0.7",
    # Bez `br`: brotli není v prostředí nainstalované a requests by odpověď
    # neuměl rozbalit.
    "Accept-Encoding": "gzip, deflate",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    'sec-ch-ua': '"Chromium";v="129", "Not=A?Brand";v="8", "Google Chrome";v="129"',
    "sec-ch-ua-mobile": "?0",
    'sec-ch-ua-platform': '"macOS"',
    "Connection": "keep-alive",
}

#: Odkaz na detail. ID je vždy dlouhé číslo, takže se na tohle nechytí
#: ani /detail/…pdf, ani kategorie a ani odkazy na výpisy.
DETAIL_RE = re.compile(
    r"/detail/"
    r"(?P<transakce>prodej|pronajem|drazba)/"
    r"(?P<typ>[a-z0-9-]+)/"
    r"(?P<dispozice>[^/?#\"'\s]*)/"
    r"(?P<lokalita>[^/?#\"'\s]+)/"
    r"(?P<id>\d{4,})"
    r"(?=$|[/?#\"'\s])"
)

#: Recept na fotku bez vodoznaku v maximálním rozlišení (1200 px, viz docstring).
FOTO_FL = "res,1200,1200,1|shr,,20|jpg,80"
FOTO_FL_NAHLED = "res,400,400,1|shr,,20|jpg,60"

#: Znaky nulové šířky, kterými Sreality prokládají hodnotu ceny v <dd>.
_NULOVA_SIRKA = re.compile(r"[​‌‍⁠﻿]")

#: Dispozice: 1+kk, 3+1, 5+kk. Cokoli jiného v URL dispozice není.
_DISPOZICE_RE = re.compile(r"^\d\s?\+\s?(?:kk|\d)$", re.I)
_DISPOZICE_V_TEXTU = re.compile(r"\b\d\s?\+\s?(?:kk|\d)\b", re.I)

#: Městský obvod statutárního města: "Praha 8", "Brno-střed", "Ostrava 1".
_OBVOD_RE = re.compile(
    r"^(?:Praha|Brno|Ostrava|Plzeň|Liberec|Pardubice|Ústí nad Labem)[\s-]\S+$", re.I
)

#: Adresy provozovatele, které nikdy nejsou kontaktem na makléře.
#: Pozor: `nz.extract_email()` zahazuje celou doménu seznam.cz i email.cz,
#: protože Seznam je provozovatel portálu. Tady to nejde — spousta českých
#: makléřů má schránku právě na seznam.cz. Filtrujeme proto jmenovitě jen
#: servisní schránky portálu, ne celou doménu.
_SERVISNI_SCHRANKY = {
    "sreality@seznam.cz",
    "podpora@seznam.cz",
    "info@sreality.cz",
    "podpora@sreality.cz",
    "reklama@sreality.cz",
}
_SERVISNI_DOMENY = {"sreality.cz", "seznam.cz.cz", "example.com"}
_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")

#: Parametry, ze kterých se skládá seznam „vybavení“ na vygenerovaném webu.
_FEATURE_PARAMS = ("Příslušenství", "Infrastruktura", "Lokalita")

#: Mapa URL segmentu typu nemovitosti na český název do modelu.
_TYPY = {
    "byt": "byt",
    "dum": "dům",
    "pozemek": "pozemek",
    "komercni": "komerční",
    "ostatni": "ostatní",
    "chata": "chata",
    "garaz": "garáž",
}
_TRANSAKCE = {"prodej": "prodej", "pronajem": "pronájem", "drazba": "dražba"}


class SrealitySource(Source):
    """Sreality.cz. Viz docstring modulu — hlavně část o odpovědnosti a hranicích."""

    key = "sreality"
    name = "Sreality.cz"
    base_url = "https://www.sreality.cz"
    detail_pattern = re.compile(r"sreality\.cz/detail/", re.I)
    name_order = "first_last"   # portál zobrazuje "Eva Grygarová"
    available = True

    #: Výpis má cestu /hledani/…, ne /reality/… jako RealityMix. `cli discover`
    #: i `watch` hledají zdroj podle URL výpisu, takže na ni musí `matches()`
    #: sednout taky — jinak by `source_for_url` na výpise Sreality neuspěl.
    vypis_pattern = re.compile(r"sreality\.cz/hledani/", re.I)

    def __init__(self) -> None:
        self._sess: requests.Session | None = None
        self._posledni: dict[str, float] = {}

    @classmethod
    def matches(cls, url: str) -> bool:
        return bool(cls.detail_pattern.search(url) or cls.vypis_pattern.search(url))

    # ------------------------------------------------------------------ síť

    def _session(self) -> requests.Session:
        """Vlastní session s prohlížečovou hlavičkou.

        Vědomě NEJDE přes `HttpClient`, protože ten se ptá `RobotsGate`
        a robots.txt Sreality náš přístup zakazuje (viz docstring modulu).
        Vlastní session je zároveň jediné místo, kde se hlavičky nastavují —
        nikde jinde se neupravují a nikdy se nestřídají.
        """
        if self._sess is None:
            s = requests.Session()
            s.headers.update(HLAVICKY)
            self._sess = s
        return self._sess

    def _pockej(self, url: str, *, odstup: float | None = None,
                asset: bool = False) -> None:
        """Vynutí povinný odstup mezi požadavky na tentýž host.

        U stránek se `odstup` nikdy nesnižuje pod MIN_ODSTUP — i kdyby si
        o to volající řekl. Výjimkou jsou statické assety (`asset=True`):
        fotky na CDN, ze kterých bereme jen 64 kB hlavičky. Tam platí
        ODSTUP_ASSETY, jinak by měření rozměrů šesti fotek stálo 10 sekund
        na každý inzerát.
        """
        # Podlaha se liší podle druhu cíle. `odstup` nesmí být výchozí
        # MIN_ODSTUP, jinak by `max()` u assetů vrátil zase 1,5 s a kratší
        # odstup by se nikdy neuplatnil.
        podlaha = ODSTUP_ASSETY if asset else MIN_ODSTUP
        odstup = max(odstup if odstup is not None else podlaha, podlaha)
        host = urlsplit(url).netloc
        posledni = self._posledni.get(host)
        if posledni is not None:
            zbyva = odstup - (time.monotonic() - posledni)
            if zbyva > 0:
                time.sleep(zbyva + random.uniform(0, 0.05 if asset else 0.3))
        self._posledni[host] = time.monotonic()

    def _stahni(self, url: str, *, hlavicky: dict[str, str] | None = None,
                asset: bool = False) -> requests.Response:
        """Jeden požadavek s povinným odstupem a exponenciálním zpomalením.

        429 a 5xx = přechodná chyba -> počkat (Retry-After, jinak 2^pokus * 1,5 s,
        strop 60 s) a zkusit znovu, nejvýš MAX_POKUSU krát.
        401/403 = blok -> `SourceBlocked` a konec. Neobchází se.
        """
        posledni_chyba: Exception | None = None
        for pokus in range(1, MAX_POKUSU + 1):
            self._pockej(url, asset=asset)
            try:
                resp = self._session().get(url, timeout=25, headers=hlavicky or {})
            except requests.RequestException as exc:
                posledni_chyba = exc
                cekani = min(MIN_ODSTUP * 2**pokus, MAX_CEKANI)
                log.warning("sreality: pokus %s/%s selhal (%s), čekám %.0f s",
                            pokus, MAX_POKUSU, exc, cekani)
                time.sleep(cekani)
                continue

            if resp.status_code in (401, 403):
                raise SourceBlocked(
                    f"Sreality.cz odpověděly HTTP {resp.status_code} na {url}.\n"
                    "Server nás zablokoval. Obcházení (proxy, jiná IP, jiná identita,\n"
                    "captcha, přihlášení) tenhle modul vědomě neumí a umět nebude —\n"
                    "viz pravidla v docstringu reality/sources/sreality.py.\n"
                    "Zkus to později, nebo použij zdroj 'realitymix'."
                )
            if resp.status_code == 404:
                raise FetchError(f"404 Not Found: {url}")
            if resp.status_code == 429 or resp.status_code >= 500:
                retry_after = (resp.headers.get("Retry-After") or "").strip()
                cekani = (
                    float(retry_after)
                    if retry_after.isdigit()
                    else min(MIN_ODSTUP * 2**pokus, MAX_CEKANI)
                )
                cekani = min(cekani, MAX_CEKANI)
                log.warning("sreality: HTTP %s na %s, zpomaluji o %.0f s",
                            resp.status_code, url, cekani)
                posledni_chyba = FetchError(f"HTTP {resp.status_code}")
                time.sleep(cekani)
                continue
            if not resp.ok:
                raise FetchError(f"HTTP {resp.status_code} u {url}")
            return resp

        raise FetchError(
            f"{url} se nepodařilo stáhnout ani po {MAX_POKUSU} pokusech: {posledni_chyba}"
        )

    def get_text(self, url: str) -> str:
        """Stránka jako text. Veřejné, ať si ji umí vzít i volající mimo `scrape`."""
        resp = self._stahni(url)
        resp.encoding = resp.apparent_encoding or resp.encoding
        text = resp.text
        zacatek = text[:4000]
        if "captcha" in zacatek.lower() or "Ověřte, že nejste robot" in zacatek:
            raise SourceBlocked(
                f"{url} vrátilo stránku s ověřením, že nejsme robot.\n"
                "Captcha se neobchází — viz pravidla v docstringu modulu."
            )
        # Pozná se podle <title>, ne podle výskytu "cmp.seznam.cz" — ten je
        # i v hlavičce běžného detailu (skript CMP lišty) a byl by to planý
        # poplach na každé stránce.
        if re.search(r"<title>\s*Nastavení souhlasu", zacatek, re.I):
            raise SourceBlocked(
                f"{url} skončilo na souhlasové zdi Seznamu (cmp.seznam.cz).\n"
                "Souhlas s personalizací za uživatele nevymýšlíme a cookie souhlasu\n"
                "nefalšujeme. Pokud se tohle děje pořád, Seznam změnil chování CMP\n"
                "a zdroj je potřeba znovu posoudit, ne obejít."
            )
        return text

    # ------------------------------------------------------------- discover

    def discover(self, client: HttpClient, listing_url: str, *, limit: int = 20) -> list[str]:
        """URL detailů z výpisu. Stránkuje přes `?strana=N`, dokud nemá `limit`.

        `client` se schválně nepoužívá — Sreality chodí vlastní session
        (viz `_session`). Parametr zůstává kvůli společnému rozhraní `Source`.

        Jedna strana nese 21 inzerátů. Mezi sousedními stranami se pár inzerátů
        opakuje (placené „tipy“ se přilepí na začátek), proto se dedupluje
        a stránkování končí i tehdy, když další strana nepřinese nic nového.
        """
        del client  # viz docstring
        nalezene: list[str] = []
        strana = self._strana_z_url(listing_url) or 1
        prazdne_kolo = 0

        while len(nalezene) < limit and prazdne_kolo < 2 and strana <= 300:
            url = self._url_strany(listing_url, strana)
            html = self.get_text(url)
            na_strane = self.odkazy_z_vypisu(html)
            if not na_strane:
                break
            pred = len(nalezene)
            for u in na_strane:
                if u not in nalezene:
                    nalezene.append(u)
            prazdne_kolo = 0 if len(nalezene) > pred else prazdne_kolo + 1
            log.info("sreality discover: strana %s -> %s odkazů, celkem %s",
                     strana, len(na_strane), len(nalezene))
            strana += 1

        return nalezene[:limit]

    def odkazy_z_vypisu(self, html: str) -> list[str]:
        """Absolutní URL detailů z jedné výpisové stránky, v pořadí výskytu.

        Čte se přímo z `href`, ne z nějakého JSON bloku — výpis je renderovaný
        na serveru a odkazy v něm jsou. `DETAIL_RE` požaduje dlouhé číselné ID
        na konci, takže se na to nechytí .pdf, kategorie ani odkazy na výpis.
        """
        out: list[str] = []
        for m in re.finditer(r'href="(/detail/[^"]+)"', html):
            cesta = m.group(1)
            shoda = DETAIL_RE.search(cesta)
            if not shoda:
                continue
            # Useknout případné query/kotvy — stejný inzerát nesmí být dvakrát.
            cista = "/detail/" + "/".join(
                [shoda.group("transakce"), shoda.group("typ"), shoda.group("dispozice"),
                 shoda.group("lokalita"), shoda.group("id")]
            )
            plna = urljoin(self.base_url, cista)
            if plna not in out:
                out.append(plna)
        return out

    @staticmethod
    def _strana_z_url(url: str) -> int | None:
        for k, v in parse_qsl(urlsplit(url).query):
            if k == "strana" and v.isdigit():
                return int(v)
        return None

    @staticmethod
    def _url_strany(url: str, strana: int) -> str:
        """Vloží / přepíše `?strana=N`. Ostatní filtry výpisu zůstanou."""
        p = urlsplit(url)
        q = [(k, v) for k, v in parse_qsl(p.query) if k != "strana"]
        if strana > 1:
            q.append(("strana", str(strana)))
        return urlunsplit((p.scheme, p.netloc, p.path, urlencode(q), ""))

    # ---------------------------------------------------------- parse detail

    def parse_detail(self, html: str, url: str) -> ListingRecord:
        soup = BeautifulSoup(html, "html.parser")

        h1 = soup.select_one('[data-e2e="detail-heading"]')
        if h1 is None:
            raise ParseError(
                f"{url}: chybí <h1 data-e2e=\"detail-heading\"> — Sreality "
                "pravděpodobně změnily HTML detailu."
            )

        casti = self._z_url(url)
        listing = Listing(source=self.key, url=url, id=casti.get("id"))
        listing.transaction_type = _TRANSAKCE.get(casti.get("transakce") or "")
        listing.property_type = _TYPY.get(casti.get("typ") or "", casti.get("typ"))

        titulek, adresa = self._hlavicka(h1)
        listing.title = titulek

        listing.price_raw = self._cena_raw(h1, soup)
        listing.price, listing.currency, listing.price_note = nz.parse_price(listing.price_raw)

        listing.parameters = self._parametry(soup)
        if listing.price_note is None:
            listing.price_note = listing.parameters.get("Poznámka k ceně")

        listing.description = self._popis(soup)
        self._uloz_parametry(listing, casti)
        listing.features = self._vybaveni(listing.parameters)
        listing.reference_number = listing.parameters.get("ID zakázky")

        listing.location = self._lokalita(adresa, soup, listing)

        return ListingRecord(
            listing=listing,
            images=self._fotky(soup),
            agent=self._makler(soup),
            agency=self._kancelar(soup),
        )

    # ------------------------------------------------------------ jednotlivá pole

    @staticmethod
    def _z_url(url: str) -> dict[str, str]:
        m = DETAIL_RE.search(url)
        return m.groupdict() if m else {}

    def _listing_id(self, url: str) -> str | None:
        """ID inzerátu z adresy detailu.

        Volá to `watch.run()`, když skládá klíč do registru `seen`
        (`"<zdroj>-<id>"`). Bez téhle metody hlídač na zdroji spadne
        na AttributeError a neuloží ani jeden inzerát — přesně to se
        18. 9. 2026 stalo a Sreality proto zůstala na nule.
        """
        return self._z_url(url).get("id")

    @staticmethod
    def _hlavicka(h1) -> tuple[str | None, str | None]:
        """<h1> nese dva řádky oddělené <br>: název nabídky a adresu."""
        for br in h1.find_all("br"):
            br.replace_with("\n")
        radky = [nz.clean(r) for r in h1.get_text("\n", strip=True).split("\n")]
        radky = [r for r in radky if r]
        titulek = radky[0] if radky else None
        adresa = radky[1] if len(radky) > 1 else None
        return titulek, adresa

    def _cena_raw(self, h1, soup: BeautifulSoup) -> str | None:
        """Cena tak, jak ji portál píše.

        Primárně první <p> za hlavičkou — tam je čitelná („10 590 000 Kč“).
        Záloha: <dd> u „Celková cena“, kde jsou mezi znaky vložené znaky
        nulové šířky (odstraní se), a nakonec og:description.
        """
        for p in h1.find_all_next("p", limit=8):
            txt = nz.clean(p.get_text(" ", strip=True))
            if not txt:
                continue
            if re.search(r"\d", txt) and re.search(r"Kč|CZK|€|EUR", txt, re.I):
                return txt
            if re.search(r"informace o cen|cena na vyžádání|cena dohodou|v RK", txt, re.I):
                return txt

        for dt in soup.find_all("dt"):
            if "Celková cena" in dt.get_text(" ", strip=True):
                dd = dt.find_next_sibling("dd") or dt.parent.find("dd")
                if dd:
                    return nz.clean(_NULOVA_SIRKA.sub("", dd.get_text("", strip=True)))

        og = soup.find("meta", attrs={"property": "og:description"})
        if og and og.get("content"):
            m = re.search(r";\s*([\d\s  ]+(?:Kč|EUR|€))", og["content"])
            if m:
                return nz.clean(m.group(1))
        return None

    @staticmethod
    def _popis(soup: BeautifulSoup) -> str | None:
        """Text inzerátu. Je v <pre> uvnitř data-e2e="detail-description"."""
        blok = soup.select_one('[data-e2e="detail-description"]')
        if blok is None:
            return None
        pre = blok.find("pre")
        node = pre if pre is not None else blok
        for st in node.find_all(["style", "script"]):
            st.decompose()
        return nz.clean(node.get_text("\n", strip=True))

    @classmethod
    def _parametry(cls, soup: BeautifulSoup) -> dict[str, str]:
        """Všechny parametry nemovitosti z <dl>: <dt>Popisek:</dt> -> <dd>hodnota</dd>.

        Sreality mají na detailu čtyři <dl>: parametry nabídky, metadata
        (Zobrazeno / Vloženo / ID zakázky) a dva seznamy občanské vybavenosti
        (Cukrárna, Metro, Lékárna…). Ty poslední jsou o okolí, ne o nemovitosti,
        takže se vynechávají — poznají se podle nadpisu své <section>.

        Vícehodnotové parametry (Příslušenství) mají v <dd> vnořené <div>y,
        každý s jednou položkou; spojují se čárkou, ať zůstane jedno textové pole.
        """
        params: dict[str, str] = {}
        for dl in soup.find_all("dl"):
            if cls._je_okoli(dl):
                continue
            for dt in dl.find_all("dt"):
                popisek = nz.strip_label(dt.get_text(" ", strip=True))
                if not popisek:
                    continue
                dd = dt.find_next_sibling("dd")
                if dd is None:
                    rodic = dt.parent
                    dd = rodic.find("dd") if rodic else None
                if dd is None:
                    continue
                hodnota = cls._hodnota_dd(dd)
                if hodnota and popisek not in params:
                    params[popisek] = hodnota
        return params

    @staticmethod
    def _je_okoli(dl) -> bool:
        """Je tenhle <dl> seznam občanské vybavenosti, ne parametrů nemovitosti?"""
        sekce = dl.find_parent("section")
        nadpis = sekce.find(["h2", "h3"]) if sekce else None
        if nadpis is None:
            return False
        return bool(
            re.search(r"Občanská vybavenost|Doprava v okolí|V okolí",
                      nadpis.get_text(" ", strip=True), re.I)
        )

    @staticmethod
    def _hodnota_dd(dd) -> str | None:
        """Text jedné hodnoty parametru.

        Emotion vkládá do <dd> i <style>, ten musí pryč. Vícehodnotový parametr
        je sada listových <div>ů. U ceny jsou mezi znaky vložené znaky nulové
        šířky, proto se u ní spojuje bez mezery a ty znaky se odstraní.
        """
        for st in dd.find_all(["style", "script"]):
            st.decompose()
        listove = [d for d in dd.find_all("div") if not d.find("div")]
        polozky: list[str] = []
        for d in listove:
            t = nz.clean(d.get_text(" ", strip=True))
            if t and t not in polozky:
                polozky.append(t)
        if len(polozky) > 1:
            return ", ".join(polozky)
        if polozky:
            return polozky[0]
        # Bez strip=True: jednotlivé uzly ceny jsou jen pevná mezera + znak
        # nulové šířky a strip by ty mezery mezi trojicemi číslic zahodil.
        syrove = dd.get_text("")
        if _NULOVA_SIRKA.search(syrove):
            return nz.clean(_NULOVA_SIRKA.sub("", syrove))
        return nz.clean(dd.get_text(" ", strip=True))

    def _uloz_parametry(self, listing: Listing, casti: dict[str, str]) -> None:
        """Namapuje volné parametry Sreality na typovaná pole modelu.

        Sreality slučují víc údajů do jednoho řádku, například
        `Stavba: Cihlová, Jednopodlažní, Po rekonstrukci, 2. podlaží z 7`,
        takže se ten řádek ještě rozebírá.
        """
        p = listing.parameters

        # Dispozice: nejdřív z URL (/detail/prodej/byt/3+kk/…), pak z titulku.
        dispozice = (casti.get("dispozice") or "").replace("-", " ").strip()
        if _DISPOZICE_RE.match(dispozice):
            listing.disposition = dispozice
        elif listing.title:
            m = _DISPOZICE_V_TEXTU.search(listing.title)
            if m:
                listing.disposition = m.group(0)

        # Plocha: "Užitná plocha 78 m²", u pozemků "Plocha pozemku 1 250 m²".
        plocha = p.get("Plocha")
        if plocha:
            listing.area_m2 = self._plocha(plocha)
        if listing.area_m2 is None and listing.title:
            listing.area_m2 = nz.parse_area(listing.title)

        listing.energy_class = p.get("Energetická náročnost")

        stavba = p.get("Stavba") or ""
        if stavba:
            for kus in (nz.clean(k) for k in stavba.split(",")):
                if not kus:
                    continue
                m = re.match(r"(\d+)\.\s*podlaží(?:\s*z\s*(\d+))?", kus, re.I)
                if m:
                    listing.floor = int(m.group(1))
                    if m.group(2):
                        listing.floors_total = int(m.group(2))
                    continue
                if re.search(r"rekonstrukc|novostavb|dobrý stav|velmi dobrý|"
                             r"před rekonstrukc|ve výstavbě|projekt|špatný", kus, re.I):
                    listing.condition = listing.condition or kus
                elif re.search(r"cihl|panel|skelet|dřevostavb|montovan|smíšen|kamen",
                               kus, re.I):
                    listing.building_type = listing.building_type or kus

        vlastnictvi = p.get("Vlastnictví")
        if vlastnictvi:
            listing.ownership = nz.clean(vlastnictvi.split(",")[0])

        if not listing.condition:
            listing.condition = p.get("Stav objektu")

    @staticmethod
    def _plocha(hodnota: str) -> float | None:
        """Z řádku Plocha vezme užitnou/podlahovou plochu, u pozemků plochu pozemku."""
        casti = [nz.clean(c) for c in hodnota.split(",")]
        prednost = ("užitná", "podlahová", "obytná", "plocha pozemku", "zastavěná")
        for klic in prednost:
            for c in casti:
                if c and klic in c.lower():
                    m = nz.parse_area(c)
                    if m is not None:
                        return m
        for c in casti:
            m = nz.parse_area(c or "")
            if m is not None:
                return m
        return None

    @staticmethod
    def _vybaveni(params: dict[str, str]) -> list[str]:
        """Vybavení pro sekci Informace na vygenerovaném webu."""
        out: list[str] = []
        for popisek in _FEATURE_PARAMS:
            hodnota = params.get(popisek)
            if not hodnota:
                continue
            for kus in (nz.clean(k) for k in hodnota.split(",")):
                if kus and kus not in out:
                    out.append(kus)
        return out

    # ------------------------------------------------------------- lokalita

    def _lokalita(self, adresa: str | None, soup: BeautifulSoup, listing: Listing) -> Location:
        """Rozpad lokality.

        Adresní řádek pod titulkem má tvar „Sokolovská, Praha - Karlín“.
        Obec, obvod a čtvrť bere z drobečkové navigace v ld+json, kde jdou
        od kraje/obce po katastr. Souřadnice jsou v odkazu na mapy.com.
        """
        drobecky = self._drobecky(soup)
        loc = Location(raw=adresa, path=[jmeno for jmeno, _ in drobecky])
        geo = self._geo_drobecky(drobecky)

        for hodnota in geo:
            if re.search(r"\bkraj\b", hodnota, re.I):
                loc.region = loc.region or hodnota
            elif _OBVOD_RE.match(hodnota):
                loc.district = loc.district or hodnota
            elif loc.city is None:
                loc.city = hodnota
            else:
                loc.city_part = hodnota

        # Ulice je první část adresního řádku, pokud sama není názvem lokality.
        casti = [c for c in (nz.clean(c) for c in (adresa or "").split(",")) if c]
        znamé = {g.lower() for g in geo}
        if len(casti) >= 2 and casti[0].lower() not in znamé:
            loc.street = casti[0]
        if loc.city is None and casti:
            # Bez drobečků aspoň „Praha - Karlín“ -> obec Praha, čtvrť Karlín.
            posledni = casti[-1]
            if " - " in posledni:
                obec, _, ctvrt = posledni.partition(" - ")
                loc.city = nz.clean(obec)
                loc.city_part = loc.city_part or nz.clean(ctvrt)
            else:
                loc.city = posledni
        if loc.city_part is None and casti:
            posledni = casti[-1]
            if " - " in posledni:
                loc.city_part = nz.clean(posledni.split(" - ", 1)[1])

        mapa = soup.find("a", href=re.compile(r"mapy\.c(?:om|z)/.*center="))
        if mapa:
            m = re.search(r"center=(-?[\d.]+),(-?[\d.]+)", mapa["href"])
            if m:  # mapy.com má pořadí lon,lat
                loc.lon = nz.parse_float(m.group(1))
                loc.lat = nz.parse_float(m.group(2))
        return loc

    @staticmethod
    def _drobecky(soup: BeautifulSoup) -> list[tuple[str, str]]:
        """BreadcrumbList z prvního bloku application/ld+json jako (název, URL)."""
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "{}")
            except (json.JSONDecodeError, TypeError):
                continue
            if not isinstance(data, dict) or data.get("@type") != "BreadcrumbList":
                continue
            out: list[tuple[str, str]] = []
            for el in data.get("itemListElement", []):
                if not isinstance(el, dict):
                    continue
                item = el.get("item")
                jmeno = nz.clean(el.get("name"))
                odkaz = ""
                if isinstance(item, str):
                    odkaz = item
                elif isinstance(item, dict):
                    jmeno = jmeno or nz.clean(item.get("name"))
                    odkaz = item.get("@id") or item.get("item") or ""
                if jmeno:
                    out.append((jmeno, odkaz or ""))
            return out
        return []

    @staticmethod
    def _geo_drobecky(drobecky: list[tuple[str, str]]) -> list[str]:
        """Z drobečkové navigace vybere jen zeměpisnou část.

        Drobečky mají tvar [typ, transakce, podtyp/dispozice, kraj, okres, obec…],
        například ["Domy", "Prodej", "Rodinný", "Jihomoravský kraj", "Brno-venkov",
        "Říčky"] nebo ["Byty", "Prodej", "3+kk", "Praha", "Praha 8", "Karlín"].
        Podle názvu se kategorie od místa nepozná („Rodinný“ i „Vyškov“ jsou
        jen slova), proto se rozhoduje podle URL:

          * dispoziční drobeček má stejnou cestu jako ten před ním a liší se
            jen dotazem (`/hledani/prodej/byty` + `?velikost=3+kk`),
          * podtypový drobeček je cestou prefixem toho následujícího
            (`/hledani/prodej/domy/rodinne-domy` ⊂ `…/rodinne-domy/jihomoravsky-kraj`).

        Když ani jedno neplatí, je drobeček už zeměpisný a bere se od něj dál.
        """
        def segmenty(url: str) -> list[str]:
            return [s for s in urlsplit(url).path.split("/") if s]

        zacatek = min(2, len(drobecky))
        while zacatek < len(drobecky):
            cesta = segmenty(drobecky[zacatek][1])
            predchozi = segmenty(drobecky[zacatek - 1][1]) if zacatek else []
            dalsi = segmenty(drobecky[zacatek + 1][1]) if zacatek + 1 < len(drobecky) else []
            je_kategorie = cesta == predchozi or (
                bool(dalsi) and len(cesta) < len(dalsi) and dalsi[: len(cesta)] == cesta
            )
            if not je_kategorie:
                break
            zacatek += 1
        return [jmeno for jmeno, _ in drobecky[zacatek:]]

    # ---------------------------------------------------------------- fotky

    @classmethod
    def foto_url(cls, src: str, *, fl: str = FOTO_FL) -> str:
        """Z libovolné varianty fotky udělá tu největší bez vodoznaku.

        Sdn.cz přijímá jen whitelistované recepty: bez `fl=` vrací 401,
        `res,1201,…` a výš vrací 400. 1200 px je opravdu strop.
        """
        src = src.strip()
        if src.startswith("//"):
            src = "https:" + src
        zaklad = src.split("?", 1)[0]
        return f"{zaklad}?fl={fl}"

    def _fotky(self, soup: BeautifulSoup) -> list[Image]:
        """Celá galerie v pořadí z inzerátu.

        Fotky jsou v HTML dvakrát — v desktopové a v mobilní galerii, každá
        jen část. Bereme obě a deduplikujeme podle cesty bez query, jinak by
        z 23 fotek zbylo 11. Panorama (mapy.com) do galerie nepatří.
        """
        images: list[Image] = []
        videne: set[str] = set()
        for tlacitko in soup.select('[data-e2e="gallery-collapsed-image"]'):
            img = tlacitko.find("img")
            if img is None:
                continue
            src = (img.get("src") or "").strip()
            if not src or "sdn.cz" not in src:
                continue  # panorama a jiné cizí obrázky do galerie nepatří
            zaklad = src.split("?", 1)[0]
            if zaklad in videne:
                continue
            videne.add(zaklad)
            images.append(
                Image(
                    url=self.foto_url(src),
                    thumbnail_url=self.foto_url(src, fl=FOTO_FL_NAHLED),
                    order=len(images),
                    caption=nz.clean(img.get("alt")),
                )
            )
        return images

    # ------------------------------------------------------------- kontakty

    @staticmethod
    def _email(text: str | None) -> str | None:
        """E-mail z mailto odkazu. Zahodí jen servisní schránky portálu.

        Nepoužívá `nz.extract_email()`, protože ten blokuje celou doménu
        seznam.cz a email.cz — a právě tam má schránku velká část českých
        makléřů (na vzorku 10 detailů 3 z 8 nalezených adres).
        """
        if not text:
            return None
        for kandidat in _EMAIL_RE.findall(text):
            email = kandidat.strip().lower()
            if email in _SERVISNI_SCHRANKY:
                continue
            domena = email.partition("@")[2]
            if domena in _SERVISNI_DOMENY:
                continue
            return email
        return None

    def _sekce_prodejce(self, soup: BeautifulSoup):
        """<section>, jejíž <h2> je Prodejce / Pronajímatel / Developer."""
        for h2 in soup.find_all(["h2", "h3"]):
            if re.match(r"^(Prodejce|Pronajímatel|Developer|Nabízí)\b",
                        h2.get_text(" ", strip=True), re.I):
                sekce = h2.find_parent("section")
                if sekce is not None:
                    return sekce
        return None

    def _makler(self, soup: BeautifulSoup) -> Agent:
        sekce = self._sekce_prodejce(soup)
        if sekce is None:
            return Agent()

        agent = Agent()
        # Na profil makléře vedou dva odkazy: jeden kolem fotky (bez textu)
        # a jeden se jménem. Jméno je v tom druhém, fotka v tom prvním.
        odkazy = sekce.find_all("a", href=re.compile(r"/adresar/[^/]+/\d+/makleri/\d+"))
        odkaz = next((a for a in odkazy if nz.clean(a.get_text(" ", strip=True))), None)
        if odkaz is None and odkazy:
            odkaz = odkazy[0]
        if odkaz is not None:
            agent.full_name = nz.clean(odkaz.get_text(" ", strip=True))
            agent.profile_url = urljoin(self.base_url, odkaz["href"])
            foto = next(
                (a.find("img") for a in odkazy if a.find("img") is not None), None
            )
            if foto is not None and foto.get("src"):
                agent.photo_url = self.foto_url(foto["src"], fl="res,400,600,3|shr,,20|jpg,80")
        agent.first_name, agent.last_name = nz.split_name(agent.full_name, self.name_order)

        tel = sekce.find("a", href=re.compile(r"^tel:"))
        if tel is not None:
            agent.phone, agent.phone_raw = nz.normalize_phone(tel.get_text(" ", strip=True))
            if agent.phone is None:
                agent.phone, agent.phone_raw = nz.normalize_phone(
                    tel["href"].removeprefix("tel:")
                )

        mail = sekce.find("a", href=re.compile(r"^mailto:", re.I))
        if mail is not None:
            agent.email = self._email(mail["href"].split(":", 1)[1]) or self._email(
                mail.get_text(" ", strip=True)
            )
        return agent

    def _kancelar(self, soup: BeautifulSoup) -> Agency:
        sekce = self._sekce_prodejce(soup)
        if sekce is None:
            return Agency()

        agency = Agency()
        # Profil kanceláře = /adresar/<slug>/<id> BEZ /makleri/ na konci.
        for odkaz in sekce.find_all("a", href=re.compile(r"/adresar/[^/]+/\d+/?$")):
            agency.profile_url = urljoin(self.base_url, odkaz["href"])
            nazev = nz.clean(odkaz.get_text(" ", strip=True))
            if nazev:
                agency.name = agency.name or nazev
            logo = odkaz.find("img")
            if logo is not None and logo.get("src"):
                agency.logo_url = self.foto_url(
                    logo["src"], fl="res,400,400,1|shr,,20|jpg,80"
                )
        # Vlastní web kanceláře: externí odkaz s utm_source=sreality.cz.
        web = sekce.find("a", href=re.compile(r"^https?://(?!www\.sreality\.cz)"))
        if web is not None:
            agency.website = web["href"].split("?utm_source=")[0]
        return agency

    # --------------------------------------------------------------- scrape

    def enrich(self, client: HttpClient, record: ListingRecord) -> ListingRecord:
        """Nic nedotahuje.

        Adresář kanceláří `/adresar/...` je SPA — server vrátí prázdnou
        kostru a obsah dotahuje JavaScript, takže z něj bez prohlížeče nic
        není. Prohlížeč se tu nespouští (viz pravidla modulu). Kontakty proto
        bereme výhradně z detailu inzerátu, kde jsou v běžném HTML.
        """
        del client
        return record

    def scrape(
        self,
        client: HttpClient,
        url: str,
        *,
        with_agency: bool = True,
        measure_photos: bool = True,
    ) -> ListingRecord:
        """Kompletní záznam jednoho inzerátu.

        Přepisuje `Source.scrape`, protože Sreality nechodí přes `HttpClient`
        (robots.txt, viz docstring modulu) — a to platí i pro měření fotek.
        """
        del client
        record = self.parse_detail(self.get_text(url), url)
        if with_agency:
            record = self.enrich(None, record)  # type: ignore[arg-type]
        if measure_photos and record.images:
            self.zmer_fotky(record.images)
        record.apply_contact_links()
        record.compute_missing()
        return record

    def zmer_fotky(self, images: list[Image], *, limit: int = 6) -> int:
        """Doplní prvním fotkám rozměry.

        Stahuje jen prvních 64 kB každé fotky (hlavička JPEG stačí), stejně
        jako `reality/measure.py`, jen vlastní session a s povinným odstupem.
        """
        try:
            from PIL import Image as PILImage
        except ImportError:
            return 0
        import io

        zmereno = 0
        for image in images[:limit]:
            if not image.url:
                continue
            try:
                resp = self._stahni(image.url, asset=True,
                                    hlavicky={"Range": "bytes=0-65535",
                                              "Sec-Fetch-Dest": "image",
                                              "Sec-Fetch-Mode": "no-cors"})
                with PILImage.open(io.BytesIO(resp.content)) as im:
                    image.width, image.height = im.size
                zmereno += 1
            except Exception as exc:
                log.debug("rozměr %s se nepodařilo zjistit: %s", image.url, exc)
        return zmereno
