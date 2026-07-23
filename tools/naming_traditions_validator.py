#!/usr/bin/env python3
"""
naming_traditions_validator.py — validate the tradition presets against the
concept packs, and DEMO each tradition's names so the shapes can be eyeballed.

Cross-file: content policies, gender themes, and surname domains must resolve
to real concepts in concept-packs.json.

Checks
  S1  schema: label/subtitle/contentPolicy/genders/patterns; patterns.personal non-empty.
  C1  contentPolicy tokens (packs/tags/concepts) all known; policy resolves non-empty.
  G1  each gender's themes resolve non-empty; patronymicAffix present where used.
  P1  pattern types are in the per-category vocabulary.
  R1  particles present for patterns that need them (theophoric->relations,
      clan->prefix, gens/occupational/founder-line->house affix as needed).
  T1  toponymicGenerics well-formed (form/meaning/position; position in prefix|suffix).
Then a DEMO renders personal (given+surname+epithet), place (settlement+feature),
and house names per tradition — concept WORDS stand in for the culture's minted forms.

FAIL blocks; exit 1 on FAIL.
Usage: python3 naming_traditions_validator.py naming-traditions.json concept-packs.json
"""
import json, sys, random

def load(tpath, cpath):
    T = json.load(open(tpath))
    C = json.load(open(cpath))
    return T, C

def build_index(C):
    packs = C["concept_packs"]; vocab = set(C["tag_vocabulary"])
    concepts = set(); tag_map = {}
    for p in packs.values():
        for c in p["concepts"]:
            concepts.add(c["concept"])
            for t in c["tags"]:
                tag_map.setdefault(t, set()).add(c["concept"])
    return packs, vocab, concepts, tag_map

def resolve(tokens, packs, vocab, concepts, tag_map):
    out = set()
    for t in tokens:
        if t in packs: out |= {c["concept"] for c in packs[t]["concepts"]}
        elif t in vocab: out |= tag_map.get(t, set())
        elif t in concepts: out.add(t)
    return out

def policy_pool(pol, *idx):
    inc = list(pol.get("favour",[])) + list(pol.get("lock",[]))
    pool = resolve(inc, *idx) if inc else set()
    if pol.get("exclude"): pool -= resolve(pol["exclude"], *idx)
    return pool

PATVOCAB = {
 "personal":{"single","dithematic","theophoric","epithet"},
 "place":{"descriptive-generic","feature-descriptive","possessive-settlement","theonymic-place","single"},
 "house":{"gens","clan-patronymic","clan","locative","occupational","founder-line","patronymic"}}

def W(c):  # concept -> display placeholder form
    return "".join(p.capitalize() for p in c.replace("_","-").split("-"))

def check(T, idx):
    packs, vocab, concepts, tag_map = idx
    fails = warns = 0
    for tid, tr in T["traditions"].items():
        f = []
        for k in ("label","subtitle","contentPolicy","genders","patterns"):
            if k not in tr: f.append(("FAIL","S1",f"missing {k}"))
        if not tr.get("patterns",{}).get("personal"): f.append(("FAIL","S1","no personal patterns"))
        # content policy
        for tok in list(tr["contentPolicy"].get("favour",[]))+list(tr["contentPolicy"].get("lock",[]))+list(tr["contentPolicy"].get("exclude",[])):
            if tok not in packs and tok not in vocab and tok not in concepts:
                f.append(("FAIL","C1",f"contentPolicy token '{tok}' unknown"))
        if not policy_pool(tr["contentPolicy"], *idx):
            f.append(("FAIL","C1","contentPolicy resolves to 0 concepts"))
        ambig = (set(tr["contentPolicy"].get("favour",[])) | set(tr["contentPolicy"].get("lock",[]))) & set(packs) & set(vocab)
        for tok in sorted(ambig):
            f.append(("WARN","C1",f"'{tok}' is both a pack and a tag — resolver takes the pack; prefix to disambiguate"))
        # genders
        for g,gd in tr["genders"].items():
            th = gd.get("themes",[])
            for tok in th:
                if tok not in packs and tok not in vocab and tok not in concepts:
                    f.append(("FAIL","G1",f"{g} theme '{tok}' unknown"))
            if th and not resolve(th,*idx): f.append(("WARN","G1",f"{g} themes resolve to 0"))
        # patterns
        for cat, pl in tr["patterns"].items():
            for p in pl:
                if p["type"] not in PATVOCAB.get(cat,set()):
                    f.append(("FAIL","P1",f"{cat} pattern '{p['type']}' not in vocab"))
        # particles for special patterns
        ppats = {p["type"] for p in tr["patterns"]["personal"]}
        if "theophoric" in ppats and not tr.get("particles",{}).get("theophoric",{}).get("relations"):
            f.append(("FAIL","R1","theophoric pattern but no theophoric relations"))
        hpats = {p["type"] for p in tr["patterns"].get("house",[])}
        if hpats & {"clan","clan-patronymic"} and not tr.get("particles",{}).get("house",{}).get("prefix"):
            f.append(("FAIL","R1","clan house pattern but no house.prefix"))
        # generics
        for pt, gl in tr.get("toponymicGenerics",{}).items():
            for gg in gl:
                if not all(kk in gg for kk in ("form","meaning","position")):
                    f.append(("FAIL","T1",f"{pt} generic malformed: {gg}"))
                elif gg["position"] not in ("prefix","suffix"):
                    f.append(("FAIL","T1",f"{pt} generic bad position {gg['position']}"))
        # report
        for sev,code,msg in f:
            print(f"  {sev:4} {code} [{tid}] {msg}")
            if sev=="FAIL": fails+=1
            elif sev=="WARN": warns+=1
    print(f"\n== {fails} failure(s), {warns} warning(s) ==")
    return fails

# ---------------- demo ----------------
def apply_generic(base, g):
    if g["position"]=="suffix": s = base.capitalize()+g["form"]
    else: s = g["form"].capitalize()+base.lower()
    return s[0].upper()+s[1:]

def demo(T, idx):
    packs, vocab, concepts, tag_map = idx
    rng = random.Random(7)
    craft = resolve(["craft","trade"], *idx)
    for tid, tr in T["traditions"].items():
        content = policy_pool(tr["contentPolicy"], *idx)
        def gpool(gender):
            th = tr["genders"].get(gender,{}).get("themes",[])
            p = resolve(th,*idx) or content
            return p
        def wpick(pool): return W(rng.choice(sorted(pool)))
        def given(gender):
            pats = tr["patterns"]["personal"]; typ = rng.choices([p["type"] for p in pats],[p["weight"] for p in pats])[0]
            gp = gpool(gender)
            if typ=="dithematic":
                c1=rng.choice(sorted(content)); c2=rng.choice(sorted(gp)); return W(c1)+c2.replace('-','').lower(), f"{c1}-{c2}"
            if typ=="theophoric":
                sac=resolve(["sacred","celestial"],*idx) & content or resolve(["sacred"],*idx)
                s=rng.choice(sorted(sac)); rel=tr["particles"]["theophoric"]["relations"]; rk=rng.choice(list(rel));
                return W(s)+rel[rk], f"{s}-{rk}"
            c=rng.choice(sorted(gp)); return W(c), c
        def surname(gender):
            gd=tr["genders"].get(gender,{}); aff=gd.get("patronymicAffix")
            if aff and tr.get("particles",{}).get("patronymic") is not None:
                parent=W(rng.choice(sorted(content)))
                if aff.startswith("-"): return parent+tr["particles"]["patronymic"].get("genitive","")+aff[1:]
                return aff+" "+parent
            # else house pattern
            hp=tr["patterns"].get("house",[{"type":"founder-line"}]); typ=hp[0]["type"]
            hpart=tr.get("particles",{}).get("house",{})
            if typ in ("clan","clan-patronymic"): return hpart.get("prefix","Mac")+W(rng.choice(sorted(content)))
            if typ=="occupational":
                w=W(rng.choice(sorted(craft or content))); return w+(hpart.get("affix","").lstrip("-"))
            if typ=="locative": return "of "+wpick(content)
            affh=hpart.get("affix","").lstrip("-"); return W(rng.choice(sorted(content)))+affh
        # render
        print(f"\n[{tr['label']}]  ({tr['subtitle']})")
        for gender in ("masculine","feminine"):
            g,gl=given(gender); parts=[g]
            if rng.random()<tr.get("surnameRate",0): parts.append(surname(gender))
            # epithet if pattern present
            if any(p['type']=='epithet' for p in tr['patterns']['personal']) and rng.random()<0.4:
                art=tr.get("particles",{}).get("epithet",{}).get("article","")
                trait=W(rng.choice(sorted(resolve(["light","beast","virtue","strength"],*idx)&content or content)))
                parts.append((art+" "+trait).strip())
            print(f"  {gender:9} {' '.join(parts):28} — {gl}")
        # place: settlement + feature
        for pt in ("settlement","feature"):
            gens=tr.get("toponymicGenerics",{}).get(pt)
            if not gens: continue
            g=rng.choice(gens); base=rng.choice(sorted(content))
            print(f"  {pt:9} {apply_generic(W(base),g):28} — {base} + '{g['form']}' ({g['meaning']})")
        # house (use the house pattern directly, not the personal patronymic)
        hp = tr["patterns"].get("house",[{"type":"founder-line"}])[0]["type"]
        hpart = tr.get("particles",{}).get("house",{})
        founder = W(rng.choice(sorted(content)))
        if hp in ("clan","clan-patronymic"): hn = hpart.get("prefix","Mac")+founder
        elif hp=="occupational": hn = W(rng.choice(sorted(craft or content)))+hpart.get("affix","").lstrip("-")
        elif hp=="locative": hn = "of "+founder
        else: hn = founder+hpart.get("affix","").lstrip("-")
        print(f"  {'house':9} {hn:28} — {hp}")

if __name__=="__main__":
    tpath=sys.argv[1] if len(sys.argv)>1 else "naming-traditions.json"
    cpath=sys.argv[2] if len(sys.argv)>2 else "concept-packs.json"
    T,C=load(tpath,cpath); idx=build_index(C)
    fails=check(T,idx)
    demo(T,idx)
    sys.exit(1 if fails else 0)
