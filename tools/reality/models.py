"""Datový model jednoho inzerátu.

Návrhová pravidla:
  * Každé pole je Optional a výchozí hodnota je None. Chybějící údaj je None, nikdy "" ani vymyšlená hodnota.
  * E-mail a telefon se pouze PŘEBÍRAJÍ ze zdroje. Nikdy se neodvozují ze jména a firmy.
  * `to_dict()` je stabilní kontrakt pro generátor webů — pořadí a názvy klíčů se nemění bez rozmyslu.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@dataclass(slots=True)
class Image:
    """Jedna fotografie inzerátu."""

    url: str | None = None          # nejvyšší dostupná veřejná kvalita
    thumbnail_url: str | None = None
    order: int = 0                  # pořadí tak, jak je uvedeno v inzerátu (0 = hlavní)
    caption: str | None = None
    width: int | None = None        # doplní measure.measure_images()
    height: int | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Agent:
    """Makléř. Prázdné pole = ve veřejném zdroji nebylo."""

    full_name: str | None = None    # kanonická podoba přesně tak, jak ji zdroj zobrazuje
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None        # normalizováno na +420XXXXXXXXX
    phone_raw: str | None = None
    email: str | None = None        # POUZE pokud je přímo ve zdroji
    profile_url: str | None = None
    photo_url: str | None = None
    #: Odkaz, který otevře chat na WhatsApp. None u pevné linky — tam WhatsApp není.
    whatsapp_url: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Agency:
    """Realitní kancelář."""

    name: str | None = None
    logo_url: str | None = None
    profile_url: str | None = None  # profil na portálu
    website: str | None = None      # vlastní web RK
    phone: str | None = None
    phone_raw: str | None = None
    email: str | None = None
    address: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Location:
    """Rozpad lokality. `raw` je vždy to, co stálo v inzerátu."""

    raw: str | None = None
    street: str | None = None
    city: str | None = None          # obec, např. "Praha", "Brno"
    district: str | None = None      # městský obvod, např. "Praha 6"
    city_part: str | None = None     # čtvrť / katastr, např. "Střešovice"
    region: str | None = None
    lat: float | None = None         # souřadnice pro mapu na webu
    lon: float | None = None
    path: list[str] = field(default_factory=list)  # drobečková navigace zdroje

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Listing:
    """Nemovitost."""

    source: str | None = None            # klíč zdroje, např. "realitymix"
    id: str | None = None                # ID v rámci zdroje
    url: str | None = None
    title: str | None = None
    property_type: str | None = None     # byt / dům / pozemek / komerční …
    transaction_type: str | None = None  # prodej / pronájem / dražba
    disposition: str | None = None       # 2+kk …
    price: int | None = None             # celé číslo v měně `currency`
    price_raw: str | None = None         # původní text ("9 400 000 Kč", "Cena na vyžádání")
    currency: str | None = None
    price_note: str | None = None        # "info o ceně u RK" apod.
    #: Orientační splátka hypotéky, jak ji spočítal portál. Nikdy ji nepočítáme sami.
    mortgage_monthly: int | None = None
    area_m2: float | None = None
    floor: int | None = None
    floors_total: int | None = None
    condition: str | None = None         # stav objektu
    ownership: str | None = None         # typ vlastnictví
    energy_class: str | None = None
    building_type: str | None = None
    description: str | None = None
    reference_number: str | None = None  # číslo zakázky u RK
    location: Location = field(default_factory=Location)
    features: list[str] = field(default_factory=list)   # vybavení odvozené z parametrů
    parameters: dict[str, str] = field(default_factory=dict)  # VŠECHNY parametry beze změny

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        d["location"] = self.location.to_dict()
        return d


@dataclass(slots=True)
class ListingRecord:
    """Kompletní výstup scrapingu jednoho inzerátu = vstup generátoru webu."""

    listing: Listing = field(default_factory=Listing)
    images: list[Image] = field(default_factory=list)
    agent: Agent = field(default_factory=Agent)
    agency: Agency = field(default_factory=Agency)
    scraped_at: str = field(default_factory=_utc_now)
    schema_version: int = 1

    # Pole, která se nepodařilo naplnit. Generátor webu podle nich pozná, co skrýt.
    missing: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "scraped_at": self.scraped_at,
            "listing": self.listing.to_dict(),
            "images": [i.to_dict() for i in self.images],
            "agent": self.agent.to_dict(),
            "agency": self.agency.to_dict(),
            "missing": self.missing,
        }

    def apply_contact_links(self) -> None:
        """Doplní makléři odkaz na WhatsApp s předvyplněným dotazem na tuhle nemovitost.

        Text píše zájemce o koupi, protože odkaz sedí na vygenerovaném webu
        nemovitosti. Vzniká jen u mobilního čísla.
        """
        from . import normalize as nz

        parts = [p for p in (self.listing.title, self.listing.location.city_part
                             or self.listing.location.city) if p]
        predmet = " – ".join(parts) if parts else "vaši nabídku"
        self.agent.whatsapp_url = nz.whatsapp_url(
            self.agent.phone,
            f"Dobrý den, mám zájem o nemovitost {predmet}. Můžeme se domluvit na prohlídce?",
        )

    def compute_missing(self) -> list[str]:
        """Vyplní `missing` seznamem chybějících polí, na kterých záleží generátoru webu."""
        checks: dict[str, Any] = {
            "listing.title": self.listing.title,
            "listing.price": self.listing.price,
            "listing.description": self.listing.description,
            "listing.disposition": self.listing.disposition,
            "listing.area_m2": self.listing.area_m2,
            "listing.location.city": self.listing.location.city,
            "images": self.images or None,
            "agent.full_name": self.agent.full_name,
            "agent.email": self.agent.email,
            "agent.phone": self.agent.phone,
            "agent.photo_url": self.agent.photo_url,
            "agent.whatsapp_url": self.agent.whatsapp_url,
            "agency.name": self.agency.name,
            "agency.logo_url": self.agency.logo_url,
            "agency.website": self.agency.website,
            "agency.email": self.agency.email,
        }
        self.missing = sorted(k for k, v in checks.items() if not v)
        return self.missing

    @property
    def contact_email(self) -> str | None:
        """Adresa, na kterou by nabídka šla. Makléř má přednost před centrálou RK."""
        return self.agent.email or self.agency.email

    @property
    def has_contact(self) -> bool:
        """Má smysl posílat nabídku? Bez e-mailu (makléře nebo RK) ne."""
        return bool(self.contact_email)
