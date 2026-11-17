"""สร้าง uposatha.js จาก uposatha_src.py  (python3 -I tools/build_uposatha.py)"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from pali2thai import convert
from uposatha_src import CHANTS, SESSION


def seg(t):
    if t[0] == "head":
        return {"head": t[1]}
    if t[0] == "guide":
        return {"pali": "", "thai": t[1], "ref": t[2]}
    ref, pali, thai = t
    lines = [convert(l) for l in pali.split("\n")]
    return {"pali": "\n".join(lines), "thai": thai, "ref": ref}


out = {cid: {"title": c["title"], "note": c.get("note", ""),
             "segments": [seg(t) for t in c["segments"]]} for cid, c in CHANTS.items()}
js = ("// ============================================================\n"
      "//  หมวดวันอุโบสถ  ⚠️ ไฟล์นี้สร้างอัตโนมัติ อย่าแก้ตรงนี้\n"
      "//  แก้ที่ tools/uposatha_src.py แล้วรัน: python3 -I tools/build_uposatha.py\n"
      "// ============================================================\n\n"
      f"Object.assign(CHANTS, {json.dumps(out, ensure_ascii=False, indent=2)});\n\n"
      f"SESSIONS.push({json.dumps(SESSION, ensure_ascii=False, indent=2)});\n")
open(os.path.join(HERE, "..", "uposatha.js"), "w").write(js)
print("ok", sum(len(c["segments"]) for c in out.values()), "segments")
