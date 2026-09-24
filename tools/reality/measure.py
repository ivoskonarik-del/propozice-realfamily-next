"""Zjištění rozměrů fotografií bez stahování celých souborů.

Hero fotka se nesmí vybírat podle pořadí v inzerátu: první fotka bývá i na výšku
nebo v malém rozlišení a přes celou obrazovku pak vypadá špatně. Aby šla vybrat
ta správná, potřebujeme rozměry — ale stahovat kvůli tomu 40 fotek po půl mega
by bylo zbytečné.

Rozměry JPEG i PNG jsou v hlavičce souboru, takže stačí requestem Range
stáhnout prvních pár desítek kilobajtů. Měří se jen prvních `limit` fotek,
protože hero se stejně vybírá ze začátku galerie.
"""

from __future__ import annotations

import io
import logging
from typing import Any

from .http_client import HttpClient

log = logging.getLogger(__name__)

#: Kolik bajtů od začátku souboru stačí na přečtení rozměrů.
HEAD_BYTES = 65536


def _size_from_bytes(raw: bytes) -> tuple[int, int] | None:
    try:
        from PIL import Image
    except ImportError:  # Pillow není povinná závislost
        return None
    try:
        with Image.open(io.BytesIO(raw)) as im:
            return im.size
    except Exception:
        return None


def measure_images(
    images: list[dict[str, Any]] | list[Any],
    client: HttpClient,
    *,
    limit: int = 6,
) -> int:
    """Doplní fotkám `width` a `height`. Vrací počet změřených.

    Pracuje jak nad slovníky, tak nad objekty Image. Selhání u jedné fotky
    nezastaví zbytek — nezměřená fotka prostě zůstane bez rozměrů.
    """
    measured = 0
    for image in images[:limit]:
        url = image.get("url") if isinstance(image, dict) else getattr(image, "url", None)
        if not url:
            continue
        try:
            client.robots.assert_allowed(url)
            # Kratší odstup než u stránek: statický server, 64 kB na fotku.
            client._wait(url, interval=client.asset_interval)  # noqa: SLF001
            resp = client.session.get(
                url, timeout=client.timeout, headers={"Range": f"bytes=0-{HEAD_BYTES - 1}"}
            )
            if not resp.ok:
                continue
            size = _size_from_bytes(resp.content)
        except Exception as exc:
            log.debug("rozměr %s se nepodařilo zjistit: %s", url, exc)
            continue
        if not size:
            continue
        width, height = size
        if isinstance(image, dict):
            image["width"], image["height"] = width, height
        else:
            image.width, image.height = width, height
        measured += 1
    return measured
