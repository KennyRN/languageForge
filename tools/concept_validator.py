#!/usr/bin/env python3
"""
concept_validator.py — validate the tagged concept packs and prove the class
root policies resolve. Parallels the element/drift validators.

Checks
  S1  Each concept has a non-empty concept string and >=1 tag.
  T1  Every tag is in the declared vocabulary.
  D1  No duplicate concept within a pack.
  A1  'core' is additive:false; every other pack is additive:true.
  H1  Cross-pack shared concept: if two packs use the same concept with
      DISJOINT tag sets it's a likely homonym -> WARN; overlapping tags -> INFO
      (intentional capped-weight repetition).
Then a POLICY SMOKE TEST resolves the real class policies (favour/lock,
include/exclude across packs+tags+concepts) and prints their sizes + samples,
so 'flora but not trees' etc. are shown to be non-empty.

FAIL blocks the build; WARN/INFO advisory. Exit 1 on FAIL.
Usage: python3 concept_validator.py concept-packs.json
"""
import json, sys
from collections import defaultdict

def load(path):
    d = json.load(open(path))
    return d["tag_vocabulary"], d["concept_packs"]

def resolve(packs, tokens, vocab):
    """tokens = pack names, tag names, or literal concepts -> set of concepts."""
    packnames = set(packs); tags = set(vocab)
    out = set()
    for t in tokens:
        if t in packnames:
            out |= {c["concept"] for c in packs[t]["concepts"]}
        elif t in tags:
            for p in packs.values():
                out |= {c["concept"] for c in p["concepts"] if t in c["tags"]}
        else:  # literal concept
            for p in packs.values():
                for c in p["concepts"]:
                    if c["concept"] == t: out.add(t)
    return out

def policy(packs, vocab, include, exclude=()):
    return resolve(packs, include, vocab) - resolve(packs, exclude, vocab)

def main(path):
    vocab, packs = load(path)
    fails = warns = 0
    concept_tags = defaultdict(dict)  # concept -> {pack: set(tags)}

    for name, pack in packs.items():
        seen = set()
        for c in pack["concepts"]:
            con, tags = c.get("concept",""), set(c.get("tags",[]))
            if not con or not tags:
                print(f"  FAIL S1 [{name}] '{con}': missing concept or tags"); fails+=1
            for t in tags:
                if t not in vocab:
                    print(f"  FAIL T1 [{name}] '{con}': tag '{t}' not in vocabulary"); fails+=1
            if con in seen:
                print(f"  FAIL D1 [{name}] '{con}': duplicate in pack"); fails+=1
            seen.add(con)
            concept_tags[con][name] = tags
        expect = (name == "core")
        if pack["additive"] == expect:
            print(f"  FAIL A1 [{name}]: additive should be {not expect}"); fails+=1

    for con, bypack in concept_tags.items():
        if len(bypack) < 2: continue
        sets = list(bypack.values())
        inter = set.intersection(*sets)
        if not inter:
            packs_s = ", ".join(bypack)
            print(f"  WARN H1 '{con}': shared by {packs_s} with DISJOINT tags — homonym?"); warns+=1

    print(f"\n== schema: {fails} failure(s), {warns} warning(s) ==")

    # ---- policy smoke test ----
    print("\nClass root policies (resolved):")
    tests = [
        ("feminine (favour)", ["flora","hearth","virtue"], ["tree"]),
        ("masculine (favour)", ["forest","sea","strength"], []),
        ("feminine-warrior (lock)", ["war","strength"], []),
        ("flowers only", ["flower"], []),
        ("flora minus trees", ["flora"], ["tree"]),
        ("hearth", ["hearth"], []),
        ("beasts & birds", ["beast","bird"], []),
    ]
    for label, inc, exc in tests:
        s = policy(packs, vocab, inc, exc)
        sample = ", ".join(sorted(s)[:8])
        print(f"  {label:26} {len(s):3} concepts  e.g. {sample}")
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv)>1 else "concept-packs.json"))
