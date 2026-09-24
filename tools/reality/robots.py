"""Brána robots.txt.

Scraper se sám hlídá: každý požadavek musí projít `RobotsGate.assert_allowed()`.
Když robots.txt přístup zakazuje, skončíme chybou. Zákaz se NEOBCHÁZÍ.

robots.txt se stahuje TOU SAMOU identitou, kterou pak scrapujeme. Výchozí
klient v urllib se představuje jako 'Python-urllib' a některé servery mu vrací
403; robotparser to čte jako „zakázáno vše" a scraper by si sám zablokoval
i to, co je ve skutečnosti volné. Přesně to dělal obrázkový server RealityMixu.
"""

from __future__ import annotations

import logging
import urllib.robotparser
from urllib.parse import urlsplit, urlunsplit

import requests

from .errors import RobotsDisallowed

log = logging.getLogger(__name__)


class RobotsGate:
    def __init__(self, user_agent: str, *, enabled: bool = True, session=None) -> None:
        self.user_agent = user_agent
        self.enabled = enabled
        self.session = session or requests.Session()
        self._parsers: dict[str, urllib.robotparser.RobotFileParser | None] = {}

    def _origin(self, url: str) -> str:
        p = urlsplit(url)
        return urlunsplit((p.scheme, p.netloc, "", "", ""))

    def _fetch(self, origin: str) -> urllib.robotparser.RobotFileParser | None:
        """Stáhne a rozparsuje robots.txt. None = pravidla neznáme (dočasně —
        nekešuje se, další dotaz to zkusí znovu, ať jeden výpadek sítě
        nezablokuje celý běh)."""
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(origin + "/robots.txt")
        resp = None
        for pokus in (1, 2):
            try:
                resp = self.session.get(
                    origin + "/robots.txt",
                    headers={"User-Agent": self.user_agent, "Accept": "text/plain,*/*"},
                    timeout=15,
                )
                break
            except requests.RequestException as exc:
                log.warning("robots.txt pro %s se nepodařilo stáhnout (pokus %s/2): %s",
                           origin, pokus, exc)
        if resp is None:
            return None

        if resp.status_code in (401, 403):
            # Server přístup k pravidlům odepřel — bereme jako zákaz.
            rp.disallow_all = True
            return rp
        if 400 <= resp.status_code < 500:
            # 404 a spol.: robots.txt neexistuje, což podle standardu znamená bez omezení.
            rp.allow_all = True
            return rp
        if not resp.ok:
            log.warning("robots.txt pro %s vrátil HTTP %s", origin, resp.status_code)
            return None

        rp.parse(resp.text.splitlines())
        return rp

    def _parser(self, url: str) -> urllib.robotparser.RobotFileParser | None:
        origin = self._origin(url)
        cached = self._parsers.get(origin)
        if cached is not None:
            return cached
        # Neúspěch (None) se schválně nekešuje — jeden dočasný výpadek by
        # jinak zablokoval zbytek běhu i další kola, dokud se proces nerestartuje.
        parsed = self._fetch(origin)
        if parsed is not None:
            self._parsers[origin] = parsed
        return parsed

    def crawl_delay(self, url: str) -> float | None:
        rp = self._parser(url)
        if rp is None:
            return None
        try:
            delay = rp.crawl_delay(self.user_agent)
        except Exception:
            return None
        return float(delay) if delay is not None else None

    def assert_allowed(self, url: str) -> None:
        """Vyhodí RobotsDisallowed, pokud robots.txt naše UA na tuto URL nepouští."""
        if not self.enabled:
            return
        rp = self._parser(url)
        if rp is None:
            raise RobotsDisallowed(
                f"Pravidla robots.txt pro {self._origin(url)} se nepodařilo zjistit. "
                "Bez znalosti pravidel se nestahuje."
            )
        if not rp.can_fetch(self.user_agent, url):
            raise RobotsDisallowed(
                f"robots.txt zakazuje agentu '{self.user_agent}' přístup na {url}. "
                "Zdroj není pro automatizovaný sběr otevřený — hledej legální alternativu."
            )
