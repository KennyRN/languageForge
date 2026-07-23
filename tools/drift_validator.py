#!/usr/bin/env python3
"""
drift_validator.py — validate the drift-pack library and demo its output.

Parallels pack_validator.py. Checks every pack in drift-packs.json against the
rules the engine relies on, then APPLIES each pack to sample words so a human can
eyeball that the drift is plausible and still readable.

Checks
  S1  Schema: pack has effectFamily, direction, appliesTo, plainDescription, why,
      and a non-empty ordered rules[]; each rule has from/to/when/gloss.
  F1  Family/direction consistency: effectFamily is known; direction matches it
      (softening/compression -> erosion; vowel-shift/hardening/reshaping -> shift).
  A1  appliesTo is descent|loanword; reshaping must be loanword; a descent pack
      must not be reshaping.
  W1  'when' is in the controlled vocabulary.
  N1  No no-op or empty 'from' (from == to, or from == "").
  D2  No duplicate rule (same from+to+when) within a pack.
  I1  No inverse pair within a pack (rule X>Y and later Y>X — a cancel bug).
  G1  26-letter constraint on OUTPUT: 'to' is [a-z]* only (empty allowed). An
      apostrophe is permitted in 'from' (to strip it) but never in 'to'.
  E1  Ease heuristic (erosion packs only): 'to' longer than 'from' warns, unless
      it is a single stop spirantising to a known digraph (dh/gh/th).
  K1  Digraph awareness: a consonant digraph in 'to' outside the known set warns
      (decorative digraphs violate the 26-letter spirit).
  O1  Feeding order (info): reports where a rule consumes an earlier rule's output,
      so intended chains are visible and accidental ones are caught by eye.

FAIL blocks the build; WARN/INFO are advisory. Exit 1 if any FAIL.
Usage: python3 drift_validator.py drift-packs.json
"""

import json
import re
import sys
from collections import Counter

VOWELS = "aeiou"

EROSION_FAMILIES = {"softening", "compression"}
SHIFT_FAMILIES = {"vowel-shift", "hardening", "reshaping"}
ALL_FAMILIES = EROSION_FAMILIES | SHIFT_FAMILIES

WHEN_VOCAB = {
    "always", "intervocalic", "initial", "final",
    "after_vowel", "before_vowel", "after_consonant", "before_consonant",
    "unstressed",
}

KNOWN_DIGRAPHS = {"dh", "gh", "th", "sh", "ch", "ph", "wh", "kh"}
SPIRANT_DIGRAPHS = {"dh", "gh", "th"}  # legitimate length-adding lenition outputs


# ----------------------------------------------------------------- rule applier
def _apply_rule(word, frm, to, when):
    """Apply one rule to a lowercased core word under its environment."""
    f = re.escape(frm)
    if when == "always":
        return re.sub(f, to, word)
    if when == "intervocalic":
        return re.sub(rf"(?<=[{VOWELS}]){f}(?=[{VOWELS}])", to, word)
    if when == "initial":
        return re.sub(rf"^{f}", to, word)
    if when == "final":
        return re.sub(rf"{f}$", to, word)
    if when == "after_vowel":
        return re.sub(rf"(?<=[{VOWELS}]){f}", to, word)
    if when == "before_vowel":
        return re.sub(rf"{f}(?=[{VOWELS}])", to, word)
    if when == "after_consonant":
        return re.sub(rf"(?<=[^{VOWELS}]){f}", to, word)
    if when == "before_consonant":
        return re.sub(rf"{f}(?=[^{VOWELS}])", to, word)
    if when == "unstressed":
        # approximation: everything after the first vowel counts as unstressed
        m = re.search(rf"[{VOWELS}]", word)
        if not m:
            return word
        head_end = m.end()
        return word[:head_end] + re.sub(f, to, word[head_end:])
    return word


def apply_pack(pack, word):
    """Apply a whole pack (ordered, single pass), preserving a leading capital
    and a leading '-' the way the engine's driftWord does."""
    lead_dash = word.startswith("-")
    core = word[1:] if lead_dash else word
    cap = core[:1].isupper()
    w = core.lower()
    for r in pack["rules"]:
        w = _apply_rule(w, r["from"], r["to"], r["when"])
    if not w:
        w = core.lower()
    if cap and w:
        w = w[0].upper() + w[1:]
    return ("-" + w) if lead_dash else w


# ----------------------------------------------------------------- checks
def is_consonant_digraph(s):
    return len(s) == 2 and all(c not in VOWELS for c in s)


def check_pack(pid, pack):
    findings = []  # (severity, code, msg)

    for field in ("effectFamily", "direction", "appliesTo", "plainDescription", "why", "rules"):
        if field not in pack:
            findings.append(("FAIL", "S1", f"missing field '{field}'"))
    rules = pack.get("rules", [])
    if not rules:
        findings.append(("FAIL", "S1", "rules[] is empty"))

    fam = pack.get("effectFamily")
    direction = pack.get("direction")
    applies = pack.get("appliesTo")

    if fam not in ALL_FAMILIES:
        findings.append(("FAIL", "F1", f"unknown effectFamily '{fam}'"))
    else:
        expected = "erosion" if fam in EROSION_FAMILIES else "shift"
        if direction != expected:
            findings.append(("FAIL", "F1", f"family '{fam}' must be direction '{expected}', not '{direction}'"))

    if applies not in ("descent", "loanword"):
        findings.append(("FAIL", "A1", f"appliesTo must be descent|loanword (got '{applies}')"))
    if fam == "reshaping" and applies != "loanword":
        findings.append(("FAIL", "A1", "reshaping packs must applyTo 'loanword'"))
    if fam and fam != "reshaping" and applies == "loanword":
        findings.append(("WARN", "A1", f"'{fam}' pack marked loanword — usually descent"))

    seen = Counter()
    outputs_so_far = []
    for i, r in enumerate(rules):
        for field in ("from", "to", "when", "gloss"):
            if field not in r:
                findings.append(("FAIL", "S1", f"rule {i}: missing '{field}'"))
        frm, to, when = r.get("from", ""), r.get("to", ""), r.get("when", "")

        if when not in WHEN_VOCAB:
            findings.append(("FAIL", "W1", f"rule {i} '{frm}>{to}': unknown when '{when}'"))
        if frm == "":
            findings.append(("FAIL", "N1", f"rule {i}: empty 'from'"))
        elif frm == to:
            findings.append(("FAIL", "N1", f"rule {i} '{frm}': from equals to (no-op)"))

        key = (frm, to, when)
        seen[key] += 1
        if seen[key] == 2:
            findings.append(("FAIL", "D2", f"duplicate rule '{frm}>{to}' [{when}]"))

        # G1 output must be bare a-z (empty ok); apostrophe allowed only in 'from'
        if not re.fullmatch(r"[a-z]*", to):
            findings.append(("FAIL", "G1", f"rule {i}: 'to'='{to}' breaks the 26-letter constraint (a-z only)"))

        # E1 ease heuristic on erosion
        if direction == "erosion" and len(to) > len(frm):
            if len(frm) == 1 and to in SPIRANT_DIGRAPHS:
                pass  # legitimate spirantisation
            else:
                findings.append(("WARN", "E1", f"rule {i} '{frm}>{to}': erosion rule lengthens — confirm it eases articulation"))

        # K1 decorative consonant digraph in output
        if is_consonant_digraph(to) and to not in KNOWN_DIGRAPHS:
            findings.append(("WARN", "K1", f"rule {i}: '{to}' is a consonant digraph outside the known set"))

        # O1 feeding (info)
        for j, prev_to in outputs_so_far:
            if prev_to and prev_to in frm and prev_to != frm:
                findings.append(("INFO", "O1", f"rule {i} '{frm}>' consumes output of rule {j} ('>{prev_to}') — feeding chain"))
                break
        outputs_so_far.append((i, to))

    # I1 inverse pairs
    for a in range(len(rules)):
        for b in range(a + 1, len(rules)):
            ra, rb = rules[a], rules[b]
            if ra.get("to") and ra.get("to") == rb.get("from") and rb.get("to") == ra.get("from"):
                findings.append(("FAIL", "I1", f"rules {a}/{b} cancel: '{ra['from']}>{ra['to']}' then '{rb['from']}>{rb['to']}'"))

    return findings


SAMPLE_WORDS = ["Katavo", "Peloria", "Bagoron", "Sithane", "Keleth", "-mordun", "-gathek", "Oronith"]


def main(path):
    with open(path) as f:
        data = json.load(f)
    packs = data["drift_packs"]

    fails = warns = 0
    for pid, pack in packs.items():
        print(f"\n[{pid}]  ({pack.get('effectFamily')}/{pack.get('direction')} · {pack.get('appliesTo')})")
        findings = check_pack(pid, pack)
        if not any(sev == "FAIL" for sev, _, _ in findings):
            # demo only when structurally sound
            demo = "   ".join(f"{w} → {apply_pack(pack, w)}" for w in SAMPLE_WORDS)
            print(f"  demo: {demo}")
        for sev, code, msg in findings:
            print(f"  {sev:4} {code}  {msg}")
            if sev == "FAIL":
                fails += 1
            elif sev == "WARN":
                warns += 1
        if not findings:
            print("  schema clean")

    print(f"\n== {fails} failure(s), {warns} warning(s) across {len(packs)} pack(s) ==")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "drift-packs.json"))
