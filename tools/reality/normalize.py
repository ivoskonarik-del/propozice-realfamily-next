"""Převod textu z HTML na typované hodnoty.

Pravidlo: když se hodnota nedá bezpečně přečíst, vrací se None. Nikdy odhad.
"""

from __future__ import annotations

import re
import unicodedata

# Mezery, které české weby používají v číslech (pevná, úzká pevná, tenká).
_SPACES = "     "
_SPACE_RE = re.compile(f"[{_SPACES}]+")

_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
_PHONE_RE = re.compile(r"(?:\+?420)?[\s./-]*(\d{3})[\s./-]*(\d{3})[\s./-]*(\d{3})\b")

# E-maily provozovatelů portálů a technické adresy — nikdy nejsou kontaktem na makléře.
_EMAIL_BLOCKLIST_DOMAINS = {
    "realitymix.cz",
    "sreality.cz",
    "zoznamrealit.sk",
    "seznam.cz",
    "dalten.com",
    "dalten.cz",
    "example.com",
    "email.cz",  # generický vzor "jmeno@email.cz" v placeholderech formulářů
}
_EMAIL_BLOCKLIST_LOCAL = {"jmeno", "vas", "vase", "name", "email", "your"}


def clean(text: str | None) -> str | None:
    """Sjednotí bílé znaky a odstraní okraje. Prázdný výsledek -> None."""
    if text is None:
        return None
    t = unicodedata.normalize("NFC", text)
    t = _SPACE_RE.sub(" ", t.replace("\xad", ""))
    t = re.sub(r"\s*\n\s*", "\n", t)
    t = re.sub(r"[ \t]{2,}", " ", t).strip()
    return t or None


def strip_label(text: str | None) -> str | None:
    """Odstraní koncovou dvojtečku z popisku parametru."""
    t = clean(text)
    return t.rstrip(":").strip() if t else None


def parse_int(text: str | None) -> int | None:
    """První celé číslo v textu (bez oddělovačů tisíců). '9 400 000 Kč' -> 9400000."""
    t = clean(text)
    if not t:
        return None
    digits = re.sub(f"[{_SPACES}]", "", t)
    m = re.search(r"-?\d+", digits)
    return int(m.group()) if m else None


def parse_float(text: str | None) -> float | None:
    """První desetinné číslo. Přijímá českou i anglickou desetinnou čárku."""
    t = clean(text)
    if not t:
        return None
    t = re.sub(f"[{_SPACES}]", "", t)
    m = re.search(r"-?\d+(?:[.,]\d+)?", t)
    if not m:
        return None
    try:
        return float(m.group().replace(",", "."))
    except ValueError:
        return None


def parse_price(text: str | None) -> tuple[int | None, str | None, str | None]:
    """Vrátí (částka, měna, poznámka).

    'Cena na vyžádání' nebo 'Informace o ceně u RK' -> (None, None, původní text).
    """
    raw = clean(text)
    if not raw:
        return None, None, None
    if not re.search(r"\d", raw):
        return None, None, raw
    amount = parse_int(raw)
    if amount is None:
        return None, None, raw
    currency = None
    if re.search(r"Kč|CZK", raw, re.I):
        currency = "CZK"
    elif "€" in raw or re.search(r"\bEUR\b", raw, re.I):
        currency = "EUR"
    note = None
    if re.search(r"vyžádání|u RK|dohodou|neuvedena", raw, re.I):
        note = raw
    return amount, currency, note


def parse_area(text: str | None) -> float | None:
    """'47 m²' -> 47.0. Bez jednotky vrací None, aby se nespletl počet podlaží s plochou."""
    t = clean(text)
    if not t or not re.search(r"m\s*[²2]", t, re.I):
        return None
    return parse_float(t)


def normalize_phone(text: str | None) -> tuple[str | None, str | None]:
    """Vrátí (E.164 nebo None, původní text nebo None).

    Bere jen české devítimístné číslo. Cokoli jiného zůstane pouze jako `raw`.
    """
    raw = clean(text)
    if not raw:
        return None, None
    m = _PHONE_RE.search(raw)
    if not m:
        return None, raw
    return "+420" + "".join(m.groups()), raw


def extract_email(text: str | None) -> str | None:
    """Vytáhne první důvěryhodný e-mail. Provozovatel portálu a placeholdery se zahazují."""
    if not text:
        return None
    for candidate in _EMAIL_RE.findall(text):
        email = candidate.strip().lower()
        local, _, domain = email.partition("@")
        if domain in _EMAIL_BLOCKLIST_DOMAINS:
            continue
        if local in _EMAIL_BLOCKLIST_LOCAL:
            continue
        if re.fullmatch(r"[0-9a-f]{24,}", local):  # hashované tracking adresy
            continue
        return email
    return None


# České mobilní předvolby (ČTÚ). Pevné linky začínají 2-5 a WhatsApp na nich nefunguje.
_CZ_MOBILE_RE = re.compile(r"^\+420(?:60[1-8]|70[2-4]|7[23]\d|77\d|79\d)\d{6}$")


def is_czech_mobile(phone_e164: str | None) -> bool:
    """Je to české mobilní číslo? Jen na něm má smysl nabízet WhatsApp."""
    return bool(phone_e164 and _CZ_MOBILE_RE.match(phone_e164))


def whatsapp_url(phone_e164: str | None, text: str | None = None) -> str | None:
    """Odkaz, který po rozkliknutí otevře chat na WhatsApp s předvyplněnou zprávou.

    Vrací None u pevné linky i u prázdného čísla — mrtvý odkaz je horší než žádný.
    Formát wa.me/<číslo bez plus> otevře appku na mobilu a WhatsApp Web na počítači.
    """
    if not is_czech_mobile(phone_e164):
        return None
    url = f"https://wa.me/{phone_e164.lstrip('+')}"
    if text:
        from urllib.parse import quote
        url += f"?text={quote(text)}"
    return url


def split_name(full_name: str | None, order: str = "first_last") -> tuple[str | None, str | None]:
    """Rozdělí zobrazené jméno na (křestní, příjmení) podle pořadí deklarovaného zdrojem.

    `order='last_first'` pro portály, které zobrazují 'Novák Jan'.
    U víceslovných jmen se nehádá — vrací se (None, None) a platí jen `full_name`.
    """
    name = clean(full_name)
    if not name:
        return None, None
    parts = [p for p in name.replace(",", " ").split() if not p.endswith(".")]
    if len(parts) != 2:
        return None, None
    a, b = parts
    return (b, a) if order == "last_first" else (a, b)


def dedupe_preserve_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for i in items:
        if i not in seen:
            seen.add(i)
            out.append(i)
    return out
