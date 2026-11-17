"""แปลงบาลีอักษรโรมัน -> อักษรไทยแบบหนังสือสวดมนต์ (ใส่ อะ เต็ม เช่น ภะคะวา)"""
import re, sys, unicodedata

CONS = {
    "kh": "ข", "gh": "ฆ", "ch": "ฉ", "jh": "ฌ", "ṭh": "ฐ", "ḍh": "ฒ",
    "th": "ถ", "dh": "ธ", "ph": "ผ", "bh": "ภ",
    "k": "ก", "g": "ค", "ṅ": "ง", "c": "จ", "j": "ช", "ñ": "ญ", "ṭ": "ฏ",
    "ḍ": "ฑ", "ṇ": "ณ", "t": "ต", "d": "ท", "n": "น", "p": "ป", "b": "พ",
    "m": "ม", "y": "ย", "r": "ร", "l": "ล", "ḷ": "ฬ", "v": "ว", "s": "ส",
    "h": "ห",
}
VOWELS = ["ā", "ī", "ū", "a", "i", "u", "e", "o"]
NIG = "ṁ"


def tokenize(word):
    toks, i = [], 0
    while i < len(word):
        two = word[i:i + 2]
        if two in CONS and len(two) == 2:
            toks.append(("C", two)); i += 2; continue
        ch = word[i]
        if ch in CONS:
            toks.append(("C", ch))
        elif ch in VOWELS:
            toks.append(("V", ch))
        elif ch == NIG:
            toks.append(("N", ch))
        else:
            raise ValueError(f"unknown char {ch!r} in {word!r}")
        i += 1
    return toks


def syllables(toks):
    """แยกพยางค์: [onset list, vowel, coda list]"""
    sylls, pending = [], []
    for t in toks:
        if t[0] == "C":
            pending.append(t[1])
        elif t[0] == "N":
            sylls[-1][2].append("ṁ")
        else:  # vowel
            if sylls and pending:
                if len(pending) == 1:
                    onset = pending
                elif pending == ["b", "r"]:  # อะพฺรัหมะ: br เป็นพยัญชนะควบ
                    onset = pending
                else:
                    sylls[-1][2].append(pending[0])
                    onset = pending[1:]
            else:
                onset = pending
            sylls.append([onset, t[1], []])
            pending = []
    if pending:
        sylls[-1][2].extend(pending)
    return sylls


def render(s):
    onset, v, coda = s
    if onset:
        th = "".join(CONS[c] + "ฺ" for c in onset[:-1]) + CONS[onset[-1]]
    else:
        th = "อ"
    cod = ""
    for c in coda:
        cod += "ง" if c == "ṁ" else CONS[c]
    if v == "a":
        return th + ("ั" + cod if cod else "ะ")
    if v == "ā":
        return th + "า" + cod
    if v in "iīuū":
        return th + {"i": "ิ", "ī": "ี", "u": "ุ", "ū": "ู"}[v] + cod
    # e / o : สระหน้า
    pre = "เ" if v == "e" else "โ"
    if cod and coda[0] in ("y", "v"):
        cod = cod[0] + "ฺ" + cod[1:]
    # วางสระหน้าไว้หน้าพยัญชนะต้นตัวสุดท้าย (กล้ำ: ไว้หน้าตัวแรก)
    return pre + th + cod


def word2thai(w):
    return "".join(render(s) for s in syllables(tokenize(w)))


def convert(text):
    text = unicodedata.normalize("NFC", text).replace("ṃ", "ṁ")
    text = text.lower()
    text = re.sub(r"[‘’“”\"]", "", text)
    text = re.sub(r"[—–…-]", " ", text)
    text = re.sub(r"[,;:.?!]", " ", text)
    out = []
    for w in text.split():
        out.append(word2thai(w))
    return " ".join(out)


if __name__ == "__main__":
    for line in sys.stdin:
        line = line.rstrip("\n")
        print(convert(line) if line.strip() else "")


def word_pairs(line):
    """แยกบรรทัดบาลีโรมันเป็นคู่ [อักษรไทย, โรมัน] ทีละคำ สำหรับวางเทียบคำต่อคำ"""
    line = unicodedata.normalize("NFC", line).replace("ṃ", "ṁ").replace("…pe…", " …pe… ")
    line = re.sub(r"[—–]", " ", line)
    out = []
    for tok in line.split():
        if tok == "…pe…":
            out.append(["ฯลฯ", "…pe…"]); continue
        core = re.sub(r"[‘’“”\"]", "", tok.lower())
        core = re.sub(r"[,;:.?!…\d-]", "", core)
        if not core:
            if tok.strip(".") and not re.search(r"\d", tok):
                out.append(["…", tok])
            continue
        out.append([word2thai(core), tok])
    return out
