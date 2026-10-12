"""Validate the Meerana evidence register CSV.

Usage: python check_register.py plan/03-evidence-register.csv
Exit code 0 = valid, 1 = errors found (printed).
"""
import csv
import re
import sys

REQUIRED = ["id", "topic", "item", "verbatim", "class", "source", "location", "published",
            "accessed", "confidence", "conflicts", "public_status", "notes"]
CLASSES = {"verified-fact", "company-claim", "interpretation", "proposed-copy", "illustrative", "unknown"}
CONF = {"high", "medium", "low", "none"}
STATUS = {"ok-to-use", "use-with-edit", "confirm-with-meerana", "internal-only", "do-not-use"}
TOPIC_RE = re.compile(r"^(company|product:[a-z0-9-]+|service|award|certification|partner|client|figure|office|event|brand|asset|legal)$")
ID_RE = re.compile(r"^EV-\d{3,4}$")
DATE_RE = re.compile(r"^(\d{4}(-\d{2}(-\d{2})?)?|undated|)$")


def main(path: str) -> int:
    errors = []
    with open(path, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        missing = [c for c in REQUIRED if c not in (reader.fieldnames or [])]
        if missing:
            print(f"ERROR missing columns: {missing}")
            return 1
        rows = list(reader)
    ids = [r["id"].strip() for r in rows]
    seen = set()
    for n, r in enumerate(rows, start=2):
        rid = r["id"].strip()
        where = f"line {n} ({rid or 'no id'})"
        if not ID_RE.match(rid):
            errors.append(f"{where}: bad id")
        if rid in seen:
            errors.append(f"{where}: duplicate id")
        seen.add(rid)
        if not TOPIC_RE.match(r["topic"].strip()):
            errors.append(f"{where}: bad topic '{r['topic']}'")
        if not r["item"].strip():
            errors.append(f"{where}: empty item")
        cls, conf, status = r["class"].strip(), r["confidence"].strip(), r["public_status"].strip()
        if cls not in CLASSES:
            errors.append(f"{where}: bad class '{cls}'")
        if conf not in CONF:
            errors.append(f"{where}: bad confidence '{conf}'")
        if status not in STATUS:
            errors.append(f"{where}: bad public_status '{status}'")
        for col in ("published", "accessed"):
            if not DATE_RE.match(r[col].strip()):
                errors.append(f"{where}: bad {col} '{r[col]}' (YYYY[-MM[-DD]] or 'undated')")
        if cls != "unknown" and not r["source"].strip():
            errors.append(f"{where}: source required")
        if status == "ok-to-use":
            if conf not in {"high", "medium"}:
                errors.append(f"{where}: ok-to-use needs high/medium confidence")
            if not r["location"].strip():
                errors.append(f"{where}: ok-to-use needs a location")
            if cls == "illustrative":
                errors.append(f"{where}: illustrative content cannot be ok-to-use as fact")
        if cls == "unknown" and status not in {"confirm-with-meerana", "do-not-use"}:
            errors.append(f"{where}: unknown items must be confirm-with-meerana or do-not-use")
        for ref in re.findall(r"EV-\d{3,4}", r["conflicts"]):
            if ref not in ids:
                errors.append(f"{where}: conflict reference {ref} not found")
    for e in errors:
        print("ERROR", e)
    counts = {}
    for r in rows:
        counts[r["public_status"].strip()] = counts.get(r["public_status"].strip(), 0) + 1
    print(f"{len(rows)} rows checked, {len(errors)} errors. Status counts: {counts}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "plan/03-evidence-register.csv"))
