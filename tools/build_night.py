"""สร้าง night.js จาก night_src.py  (python3 -I tools/build_night.py)"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from pali2thai import word_pairs
from night_src import CHANTS, NIGHTLY, ORDER


def seg(t):
    if t[0] == "head":
        return {"head": t[1]}
    if t[0] == "guide":
        return {"pali": "", "thai": t[1], "ref": t[2]}
    ref, pali, thai = t
    w = [word_pairs(l) for l in pali.split("\n")]
    return {"pali": "\n".join(" ".join(p[0] for p in line) for line in w),
            "w": w, "thai": thai, "ref": ref}


for cid in ORDER + NIGHTLY:
    assert cid == "@nightly" or cid in CHANTS, cid
out = {cid: {"title": c["title"], "note": c.get("note", ""),
             "segments": [seg(t) for t in c["segments"]]} for cid, c in CHANTS.items()}
js = ("// ============================================================\n"
      "//  บทสวดก่อนนอน (และ นโม ที่ใช้ร่วมทุกหมวด)  ⚠️ ไฟล์นี้สร้างอัตโนมัติ อย่าแก้ตรงนี้\n"
      "//  แก้ที่ tools/night_src.py แล้วรัน: python3 -I tools/build_night.py\n"
      "// ============================================================\n\n"
      f"Object.assign(CHANTS, {json.dumps(out, ensure_ascii=False, indent=2)});\n\n"
      f"const NIGHTLY = {json.dumps(NIGHTLY, ensure_ascii=False)};\n"
      f"const NIGHT_ORDER = {json.dumps(ORDER, ensure_ascii=False)};\n\n"
      "// พระสูตรประจำคืน: เวียนวันละบท นับวันแบบเวลาท้องถิ่น และเปลี่ยนบทตอน 06:00\n"
      "// (สวดหลังเที่ยงคืนยังได้บทเดิมของคืนนั้น)\n"
      "function nightlyPick(d = new Date()) {\n"
      "  const t = new Date(d.getTime() - 6 * 3600e3);\n"
      "  const day = Math.floor(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / 86400e3);\n"
      "  return NIGHTLY[((day % NIGHTLY.length) + NIGHTLY.length) % NIGHTLY.length];\n"
      "}\n"
      "{\n"
      "  const s = SESSIONS.find(x => x.id === \"night\");\n"
      "  Object.defineProperty(s, \"order\", {\n"
      "    get: () => NIGHT_ORDER.map(x => x === \"@nightly\" ? nightlyPick() : x),\n"
      "    enumerable: true, configurable: true,\n"
      "  });\n"
      "}\n")
open(os.path.join(HERE, "..", "night.js"), "w").write(js)
print("ok", sum(len(c["segments"]) for c in out.values()), "segments,", len(out), "chants")
