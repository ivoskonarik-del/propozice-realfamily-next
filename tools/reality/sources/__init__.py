"""Registr zdrojů — tady jen Sreality."""

from __future__ import annotations

from ..errors import UnknownSource
from .base import Source
from .sreality import SrealitySource

SOURCES: list[type[Source]] = [SrealitySource]


def get_source(key: str) -> Source:
    for cls in SOURCES:
        if cls.key == key:
            return cls()
    raise UnknownSource(f"Neznámý zdroj '{key}'. Dostupné: {', '.join(c.key for c in SOURCES)}")


def source_for_url(url: str) -> Source:
    for cls in SOURCES:
        if cls.matches(url):
            return cls()
    raise UnknownSource(f"Pro {url} tu není zdroj.")
