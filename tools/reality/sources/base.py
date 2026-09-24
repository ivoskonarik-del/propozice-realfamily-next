"""Rozhraní zdroje inzerátů.

Přidat nový portál = napsat jednu třídu a zaregistrovat ji. Zbytek systému
(generátor webu, monitoring, CSV) se zdrojem nezabývá — pracuje jen s ListingRecord.
"""

from __future__ import annotations

import re
from abc import ABC, abstractmethod

from ..http_client import HttpClient
from ..models import ListingRecord


class Source(ABC):
    key: str = ""            # krátký identifikátor ("realitymix")
    name: str = ""           # název pro člověka
    base_url: str = ""
    detail_pattern: re.Pattern[str] = re.compile(r"^$")

    #: Pořadí jména makléře tak, jak ho portál zobrazuje ("first_last" / "last_first").
    name_order: str = "first_last"

    @classmethod
    def matches(cls, url: str) -> bool:
        return bool(cls.detail_pattern.search(url))

    @abstractmethod
    def discover(self, client: HttpClient, listing_url: str, *, limit: int = 20) -> list[str]:
        """Vrátí URL detailů inzerátů z výpisové stránky. Podklad pro fázi 2 (monitoring)."""

    @abstractmethod
    def parse_detail(self, html: str, url: str) -> ListingRecord:
        """Z HTML detailu složí kompletní záznam. Chybějící pole nechá None."""

    def enrich(self, client: HttpClient, record: ListingRecord) -> ListingRecord:
        """Volitelné dotažení dalších veřejných údajů (profil RK). Výchozí: nic."""
        return record

    def scrape(
        self,
        client: HttpClient,
        url: str,
        *,
        with_agency: bool = True,
        measure_photos: bool = True,
    ) -> ListingRecord:
        record = self.parse_detail(client.get_text(url), url)
        if with_agency:
            record = self.enrich(client, record)
        if measure_photos and record.images:
            from ..measure import measure_images

            measure_images(record.images, client)
        record.apply_contact_links()
        record.compute_missing()
        return record
