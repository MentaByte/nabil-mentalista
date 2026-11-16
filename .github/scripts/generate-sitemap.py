#!/usr/bin/env python3
"""Genera sitemap.xml solo con las páginas finales e indexables.

Excluye:
  - 404.html
  - cualquier .html con <meta http-equiv="refresh"> (redirecciones)
  - cualquier .html con <meta name="robots" content="...noindex...">

lastmod = fecha del último commit que modificó cada archivo.
"""
import re
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

BASE_URL = "https://nabilmentalista.com"
ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {".git", ".github", "node_modules"}

META_RE = re.compile(r"<meta\b[^>]*>", re.I)
REFRESH_RE = re.compile(r"""http-equiv\s*=\s*["']?refresh""", re.I)
ROBOTS_RE = re.compile(r"""name\s*=\s*["']?robots""", re.I)
NOINDEX_RE = re.compile(r"""content\s*=\s*["'][^"']*noindex""", re.I)


def excluded(text: str) -> bool:
    for tag in META_RE.findall(text):
        if REFRESH_RE.search(tag):
            return True
        if ROBOTS_RE.search(tag) and NOINDEX_RE.search(tag):
            return True
    return False


def lastmod(path: Path) -> str:
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cI", "--", str(path.relative_to(ROOT))],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.strip()
    return out


def url_for(rel: str) -> str:
    if rel == "index.html":
        return BASE_URL + "/"
    if rel.endswith("/index.html"):
        return f"{BASE_URL}/{rel[: -len('index.html')]}"
    return f"{BASE_URL}/{rel}"


def main() -> None:
    entries = []
    for path in sorted(ROOT.rglob("*.html")):
        rel_parts = path.relative_to(ROOT).parts
        if any(p in SKIP_DIRS for p in rel_parts):
            continue
        rel = "/".join(rel_parts)
        if rel == "404.html":
            continue
        if excluded(path.read_text(encoding="utf-8", errors="ignore")):
            continue
        entries.append((url_for(rel), lastmod(path)))

    entries.sort(key=lambda e: (e[0] != BASE_URL + "/", e[0]))
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, mod in entries:
        lines.append("<url>")
        lines.append(f"<loc>{escape(loc)}</loc>")
        if mod:
            lines.append(f"<lastmod>{mod}</lastmod>")
        lines.append("</url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for loc, _ in entries:
        print(loc)


if __name__ == "__main__":
    main()
