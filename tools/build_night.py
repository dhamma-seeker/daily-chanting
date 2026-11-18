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
      "//  บทสวดก่อนนอน และบทที่ใช้ร่วม/สวดเช้า (นโม, โมรปริตร)  ⚠️ ไฟล์นี้สร้างอัตโนมัติ อย่าแก้ตรงนี้\n"
      "//  แก้ที่ tools/night_src.py แล้วรัน: python3 -I tools/build_night.py\n"
      "// ============================================================\n\n"
      f"Object.assign(CHANTS, {json.dumps(out, ensure_ascii=False, indent=2)});\n\n"
      f"const NIGHTLY = {json.dumps(NIGHTLY, ensure_ascii=False)};\n"
      f"const NIGHT_ORDER = {json.dumps(ORDER, ensure_ascii=False)};\n\n"
      "// ---------- พระสูตรประจำคืน ----------\n"
      "// โหมด rotate: เวียนคืนละบทตามปฏิทิน (คืนหนึ่งนับจาก 06:00 ถึง 06:00 วันรุ่งขึ้น)\n"
      "//              ผู้ใช้เลือกบทอื่นแทนได้เฉพาะคืนนั้น คืนต่อไปกลับไปตามรอบ\n"
      "// โหมด all:    สวดครบทุกบททุกคืน\n"
      "// เก็บใน localStorage \"nightly-v1\" = { mode: \"rotate\"|\"all\", pick: { night: <เลขคืน>, id } }\n"
      "const NIGHTLY_KEY = \"nightly-v1\";\n"
      "function nightIndex(d = new Date()) {\n"
      "  const t = new Date(d.getTime() - 6 * 3600e3);\n"
      "  return Math.floor(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / 86400e3);\n"
      "}\n"
      "const nightlyRotation = (n = nightIndex()) => NIGHTLY[((n % NIGHTLY.length) + NIGHTLY.length) % NIGHTLY.length];\n"
      "function nightlyState() {\n"
      "  try { const s = JSON.parse(localStorage.getItem(NIGHTLY_KEY)); return s && typeof s === \"object\" ? s : {}; }\n"
      "  catch { return {}; }\n"
      "}\n"
      "function nightlySave(s) { try { localStorage.setItem(NIGHTLY_KEY, JSON.stringify(s)); } catch {} }\n"
      "const nightlyMode = () => nightlyState().mode === \"all\" ? \"all\" : \"rotate\";\n"
      "function nightlyPick(d = new Date()) {\n"
      "  const n = nightIndex(d), p = nightlyState().pick;\n"
      "  return p && p.night === n && NIGHTLY.includes(p.id) ? p.id : nightlyRotation(n);\n"
      "}\n"
      "// อีกกี่คืนบทนี้จะมาตามรอบ (0 = คืนนี้)\n"
      "function nightlyIn(id, d = new Date()) {\n"
      "  const n = nightIndex(d);\n"
      "  for (let k = 0; k < NIGHTLY.length; k++) if (nightlyRotation(n + k) === id) return k;\n"
      "  return -1;\n"
      "}\n"
      "function nightlySet(change) { nightlySave(Object.assign(nightlyState(), change)); }\n"
      "{\n"
      "  const s = SESSIONS.find(x => x.id === \"night\");\n"
      "  Object.defineProperty(s, \"order\", {\n"
      "    get: () => NIGHT_ORDER.flatMap(x => x !== \"@nightly\" ? [x] : nightlyMode() === \"all\" ? NIGHTLY : [nightlyPick()]),\n"
      "    enumerable: true, configurable: true,\n"
      "  });\n"
      "}\n")
open(os.path.join(HERE, "..", "night.js"), "w").write(js)
print("ok", sum(len(c["segments"]) for c in out.values()), "segments,", len(out), "chants")
