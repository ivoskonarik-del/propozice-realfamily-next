"""Výjimky scraperu. Jedna rodina, ať volající pozná typ selhání bez parsování textu."""


class ScraperError(Exception):
    """Základ pro všechny chyby scraperu."""


class RobotsDisallowed(ScraperError):
    """robots.txt cílového serveru náš přístup na danou URL zakazuje.

    Nikdy neobcházíme — je to tvrdá zastávka, ne varování.
    """


class SourceBlocked(ScraperError):
    """Zdroj je pro automatizovaný sběr uzavřený (robots.txt a/nebo smluvní podmínky).

    Nese vysvětlení, proč je uzavřený a co je legální alternativa.
    """


class FetchError(ScraperError):
    """HTTP se nepodařilo dotáhnout ani po opakování."""


class ParseError(ScraperError):
    """Stránka se stáhla, ale nemá očekávanou strukturu (zdroj pravděpodobně změnil HTML)."""


class UnknownSource(ScraperError):
    """URL nepatří žádnému registrovanému zdroji."""
