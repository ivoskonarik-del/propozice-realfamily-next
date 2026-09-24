"""Slušný HTTP klient.

Vlastnosti, na kterých stojí spolehlivost:
  * identifikuje se vlastním User-Agentem včetně kontaktu,
  * drží minimální odstup mezi požadavky na stejný host (respektuje Crawl-delay),
  * opakuje jen na přechodných chybách a respektuje Retry-After,
  * volitelně cachuje odpovědi na disk, aby vývoj nebušil do cizího serveru.
"""

from __future__ import annotations

import hashlib
import logging
import random
import time
from pathlib import Path
from urllib.parse import urlsplit

import requests

from .errors import FetchError
from .robots import RobotsGate

log = logging.getLogger(__name__)

DEFAULT_USER_AGENT = (
    "WebhunterBot/0.1 (+https://webhunter.cz; kontakt: info.webhunter@email.cz)"
)


class HttpClient:
    def __init__(
        self,
        *,
        user_agent: str = DEFAULT_USER_AGENT,
        min_interval: float = 2.0,
        asset_interval: float = 0.3,
        timeout: float = 25.0,
        max_retries: int = 3,
        cache_dir: Path | str | None = None,
        respect_robots: bool = True,
    ) -> None:
        self.user_agent = user_agent
        self.min_interval = min_interval
        # Obrázky jsou statické soubory na samostatném serveru a stahuje se
        # z nich jen prvních 64 kB kvůli rozměrům. Dvousekundový odstup jako
        # u stránek tam nemá co chránit a dělá 12 z 13 sekund na inzerát.
        self.asset_interval = asset_interval
        self.timeout = timeout
        self.max_retries = max_retries
        self.cache_dir = Path(cache_dir) if cache_dir else None
        if self.cache_dir:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": user_agent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "cs,sk;q=0.9,en;q=0.6",
            }
        )
        # Robots se stahuje stejnou session, tedy i stejným User-Agentem.
        self.robots = RobotsGate(user_agent, enabled=respect_robots, session=self.session)
        self._last_hit: dict[str, float] = {}

    # ---------- interní ----------

    def _delay_for(self, url: str, interval: float | None = None) -> float:
        """Jak dlouhý odstup držet mezi požadavky na tenhle host.

        Prodleva z robots.txt má přednost před vším ostatním — když si ji
        server vyžádá, dodržíme ji, i kdyby volající chtěl kratší.
        """
        return self.robots.crawl_delay(url) or interval or self.min_interval

    def _wait(self, url: str, *, interval: float | None = None) -> None:
        """Počká, než smí jít další požadavek na tenhle host.

        `interval` si může vyžádat volající (obrázky). Prodleva z robots.txt
        má vždy přednost — když si ji server vyžádá, dodržíme ji.
        """
        host = urlsplit(url).netloc
        delay = self._delay_for(url, interval)
        last = self._last_hit.get(host)
        if last is not None:
            gap = delay - (time.monotonic() - last)
            if gap > 0:
                time.sleep(gap + random.uniform(0, 0.4))
        self._last_hit[host] = time.monotonic()

    def _cache_path(self, url: str) -> Path | None:
        if not self.cache_dir:
            return None
        return self.cache_dir / (hashlib.sha256(url.encode()).hexdigest()[:24] + ".html")

    # ---------- veřejné ----------

    def get_text(self, url: str, *, use_cache: bool = True) -> str:
        """Stáhne stránku jako text. Před stažením vždy zkontroluje robots.txt."""
        cache = self._cache_path(url)
        if use_cache and cache and cache.exists():
            log.debug("cache hit %s", url)
            return cache.read_text(encoding="utf-8")

        self.robots.assert_allowed(url)

        last_exc: Exception | None = None
        for attempt in range(1, self.max_retries + 1):
            self._wait(url)
            try:
                resp = self.session.get(url, timeout=self.timeout)
            except requests.RequestException as exc:
                last_exc = exc
                log.warning("pokus %s/%s selhal (%s): %s", attempt, self.max_retries, url, exc)
                time.sleep(min(2**attempt, 20))
                continue

            if resp.status_code == 429 or resp.status_code >= 500:
                retry_after = resp.headers.get("Retry-After")
                wait = float(retry_after) if (retry_after or "").isdigit() else min(2**attempt, 30)
                log.warning("HTTP %s na %s, čekám %.0f s", resp.status_code, url, wait)
                last_exc = FetchError(f"HTTP {resp.status_code}")
                time.sleep(wait)
                continue

            if resp.status_code == 404:
                raise FetchError(f"404 Not Found: {url}")
            if not resp.ok:
                raise FetchError(f"HTTP {resp.status_code} u {url}")

            resp.encoding = resp.apparent_encoding or resp.encoding
            text = resp.text
            if cache:
                cache.write_text(text, encoding="utf-8")
            return text

        raise FetchError(f"{url} se nepodařilo stáhnout ani po {self.max_retries} pokusech: {last_exc}")

    def head_ok(self, url: str) -> bool:
        """Ověří dostupnost URL (např. varianty fotky ve full-res) bez stahování těla."""
        try:
            self.robots.assert_allowed(url)
            self._wait(url)
            r = self.session.head(url, timeout=self.timeout, allow_redirects=True)
            return r.ok
        except Exception:
            return False
