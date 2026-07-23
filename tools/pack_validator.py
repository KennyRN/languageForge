#!/usr/bin/env python3
"""
pack_validator.py — dogfood the Step 6 gates against phonetic element packs.

Runs every element in every phonetic pack through the framework's own
readability gates, using the REFINED rules (see gate-refinements.md):

  J1  Joinery: start/middle elements end in a vowel or sonorant (l, r, n);
      end elements begin with a consonant whose leading cluster is legal
      or splittable across the seam.
  V1  Start-vowel policy: A/E/I free; O needs a following consonant
      (O + vowel fails); U needs a following cluster; initial Y fails;
      no element opens with three consecutive vowels (medial runs warn).
  C1  Onset legality: a leading consonant run must be a legal English
      onset, or carry a named waiver (deliberate mood edge, e.g. ts-, vr-).
  U1  Throwaway-U: a middle element ending in open U plants an unstressed
      medial U in the assembled name (Ithusel trap) -> fail.
  A1  Ambiguity: 'c' before 'i' is ambiguous (cinema vs ciao) -> fail.
  B1  Embedded-word/connotation: an element that IS a common English word,
      interjection, or well-known real name fails unless waived as
      genre-established (grim, dun, bra).
  D1  Base packs must be duplicate-free within a slot (duplication is
      reserved as the user-facing weighting mechanism).

Exit code 1 if any FAIL is present (warnings do not fail the build).
Usage: python3 pack_validator.py starter-packs.json
"""

import json
import sys
from collections import Counter

VOWELS = set("aeiou")
SONORANT_FINALS = set("lrn")

LEGAL_ONSETS = {
    # singles
    *"bcdfghjklmnpqrstvwz",
    # digraph consonant sounds
    "sh", "ch", "th", "wh", "qu",
    # doubles
    "bl", "br", "cl", "cr", "dr", "dw", "fl", "fr", "gl", "gr",
    "kl", "kr", "pl", "pr", "sc", "sk", "sl", "sm", "sn", "sp", "st", "sw",
    "tr", "tw", "gn",  # gn- reads as n- (gnome) — earns its keep only if kept rare
    # triples
    "scr", "skr", "spl", "spr", "str", "shr", "thr", "squ",
}

# Deliberate mood-edge onsets, named rather than implied.
WAIVED_ONSETS = {
    "ts": "marginal but familiar via tsar/tsunami (exotic edge)",
    "vr": "marginal but readable via vroom (harsh edge)",
}

# Whole-element collisions with English words / interjections / famous names.
BLOCKLIST = {
    "oi": "British interjection ('oi!')",
    "ely": "cathedral city in Cambridgeshire",
    "both": "common English word",
    "noel": "real name + Christmas association",
    "bath": "common English word",
}
# Genre-established borrowings a fantasy reader accepts without blinking.
BLOCK_WAIVERS = {
    "bra": "attested name element (Bram, Brandon); never surfaces alone",
    "grim": "classic Norse name element (Isengrim, Grimnir)",
    "dun": "Celtic 'fort' element, standard in place-names",
    "kai": "established given name but reads as element, not collision",
    "ava": "real given name; elements are not names — collision check runs on assembled output",
    "mae": "real given name; same reasoning as ava",
}

REAL_NAME_NOTES = {"ava", "mae", "kai"}  # surfaced as info, not failure


def is_vowel(ch):
    return ch in VOWELS


def leading_consonants(s):
    i = 0
    while i < len(s) and s[i] not in VOWELS and not (s[i] == "y" and i > 0):
        i += 1
    return s[:i]


def vowel_runs(s):
    runs, cur = [], 0
    for ch in s:
        if ch in VOWELS:
            cur += 1
        else:
            if cur:
                runs.append(cur)
            cur = 0
    if cur:
        runs.append(cur)
    return runs


def check_onset(cluster):
    """Return (ok, note). A leading run is fine if it is a legal onset,
    a waived onset, or splits as coda+onset across the seam (middles/ends
    always follow a vowel or sonorant, so run[0] may act as a coda)."""
    if cluster == "" or cluster in LEGAL_ONSETS:
        return True, None
    if cluster in WAIVED_ONSETS:
        return True, f"waived onset '{cluster}-': {WAIVED_ONSETS[cluster]}"
    if len(cluster) >= 2 and cluster[1:] in LEGAL_ONSETS:
        return True, f"'{cluster}' splits across the seam ({cluster[0]}|{cluster[1:]})"
    return False, None


def check_element(el, slot, mood):
    """Yield (severity, code, message) findings for one element."""
    raw = el
    e = el.lower().lstrip("-")

    # B1 blocklist / waivers
    if e in BLOCKLIST:
        yield ("FAIL", "B1", f"element is '{e}' — {BLOCKLIST[e]}")
    elif e in BLOCK_WAIVERS and e in REAL_NAME_NOTES:
        yield ("INFO", "B1", f"'{e}': {BLOCK_WAIVERS[e]}")

    # A1 ambiguous c+i
    if "ci" in e:
        yield ("FAIL", "A1", "'ci' is ambiguous (cinema vs ciao); respell with s/k/ts")

    # V1 vowel-run policy
    runs = vowel_runs(e)
    if e and e[0] in VOWELS:
        lead = 0
        while lead < len(e) and e[lead] in VOWELS:
            lead += 1
        if lead >= 3:
            yield ("FAIL", "V1", f"opens with {lead} consecutive vowels")
        first = e[0]
        if first == "y":
            yield ("FAIL", "V1", "start-position Y")
        if first == "o" and slot == "start":
            if len(e) == 1:
                pass  # bare 'O': joinery guarantees a consonant follows
            elif e[1] in VOWELS:
                yield ("FAIL", "V1", "O followed by a vowel at start position")
        if first == "u" and slot == "start":
            nxt = leading_consonants(e[1:])
            if len(nxt) < 2:
                yield ("FAIL", "V1", "start-position U without a following cluster")
    if any(r >= 3 for r in runs[1:]) or (runs and runs[0] >= 3 and e[0] not in VOWELS):
        yield ("WARN", "V1", "medial run of 3 vowels — readable but keep rare")

    # slot-specific rules
    if slot == "start":
        if e[-1] not in VOWELS and e[-1] not in SONORANT_FINALS and e[-1] != "y":
            yield ("FAIL", "J1", f"start must end in a vowel or l/r/n (ends '{e[-1]}')")
        onset = leading_consonants(e)
        if onset and onset not in LEGAL_ONSETS:
            if onset in WAIVED_ONSETS:
                yield ("WARN", "C1", f"waived onset '{onset}-': {WAIVED_ONSETS[onset]}")
            else:
                yield ("FAIL", "C1", f"illegal onset '{onset}-' with no waiver (no seam to split at start position)")

    elif slot == "middle":
        if not e or e[0] in VOWELS:
            yield ("FAIL", "J1", "middle must begin with a consonant")
        else:
            ok, note = check_onset(leading_consonants(e))
            if not ok:
                yield ("FAIL", "C1", f"leading run '{leading_consonants(e)}' neither legal nor seam-splittable")
        if e[-1] not in VOWELS and e[-1] not in SONORANT_FINALS:
            yield ("FAIL", "J1", f"middle must end in a vowel or l/r/n (ends '{e[-1]}')")
        if e[-1] == "u":
            yield ("FAIL", "U1", "element-final open U becomes an unstressed medial U in the name (Ithusel trap)")

    if e.endswith("w") and len(e) >= 3 and e[-2] in VOWELS and e[-3] in VOWELS:
        # final-W coda: English allows -aw/-ew/-ow but not vowel-cluster + w (raew)
        yield ("FAIL", "J1", f"'{e[-3:]}' coda has no English analogue (-aw/-ew/-ow only)")

    if slot == "end":
        if not raw.startswith("-"):
            yield ("WARN", "J1", "end element missing leading hyphen (cosmetic)")
        if not e or e[0] in VOWELS:
            yield ("FAIL", "J1", "end must begin with a consonant")
        else:
            ok, note = check_onset(leading_consonants(e))
            if not ok:
                yield ("FAIL", "C1", f"leading run '{leading_consonants(e)}' neither legal nor seam-splittable")


def main(path):
    with open(path) as f:
        data = json.load(f)

    packs = data["phonetic_element_packs"]
    fails = warns = 0

    for mood, pack in packs.items():
        findings = []
        for slot in ("start", "middle", "end"):
            elements = pack.get(slot, [])
            # D1 duplicates
            for el, n in Counter(x.lower() for x in elements).items():
                if n > 1:
                    findings.append(("FAIL", "D1", el, f"appears {n}x — base packs ship duplicate-free (duplication is the weighting signal)"))
            for el in elements:
                for sev, code, msg in check_element(el, slot, mood):
                    findings.append((sev, code, f"{slot}:{el}", msg))

        if findings:
            print(f"\n[{mood}]")
            for sev, code, where, msg in findings:
                print(f"  {sev:4} {code}  {where:14} {msg}")
                if sev == "FAIL":
                    fails += 1
                elif sev == "WARN":
                    warns += 1
        else:
            print(f"\n[{mood}]  clean")

    print(f"\n== {fails} failure(s), {warns} warning(s) ==")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "starter-packs.json"))
