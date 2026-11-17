"""สร้าง suttas.js (พระสูตรเต็มที่อ้างอิงในหมวดอุโบสถ)  python3 -I tools/build_suttas.py"""
import importlib.util, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from pali2thai import word_pairs

SUT = os.path.join(HERE, "suttas")
IDS = ["an3.37", "an3.70", "an8.41", "an9.18", "an10.46", "snp2.14"]
REF = {"an3.37": "AN 3.37", "an3.70": "AN 3.70", "an8.41": "AN 8.41", "an9.18": "AN 9.18",
       "an10.46": "AN 10.46", "snp2.14": "Snp 2.14"}


def load_th(sid):
    p = os.path.join(SUT, "th_" + sid.replace(".", "_") + ".py")
    spec = importlib.util.spec_from_file_location("th", p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


out = {}
for sid in IDS:
    raw = json.load(open(os.path.join(SUT, f"raw-{sid}.json")))
    th = load_th(sid)
    paras, order = {}, []
    for r in raw:
        seg = r["segment_id"]
        para = seg.split(":")[1].split(".")[0]
        if para == "0":
            continue
        text = th.EXPAND.get(seg, r["pali"] or "")
        for li, line in enumerate(text.split("\n")):
            if para not in paras:
                paras[para] = {"n": para, "lines": [], "thai": th.TH.get(para, "")}
                order.append(para)
            paras[para]["lines"].append({"id": seg, "expanded": seg in th.EXPAND,
                                         "w": word_pairs(line)})
    missing = [p for p in order if not paras[p]["thai"]]
    assert not missing, (sid, missing)
    extra = set(th.TH) - set(order)
    assert not extra, (sid, extra)
    out[sid] = {"title": th.TITLE, "sub": th.SUB, "ref": REF[sid],
                "paras": [paras[p] for p in order]}

js = ("// ============================================================\n"
      "//  พระสูตรเต็มที่อ้างอิงในหมวดอุโบสถ  ⚠️ ไฟล์นี้สร้างอัตโนมัติ อย่าแก้ตรงนี้\n"
      "//  บาลีจากฐานข้อมูล tripitaka-mcp (SuttaCentral bilara-data)\n"
      "//  คำแปลอยู่ที่ tools/suttas/th_*.py  สร้างใหม่: python3 -I tools/build_suttas.py\n"
      "// ============================================================\n\n"
      f"const SUTTAS = {json.dumps(out, ensure_ascii=False, separators=(',', ':'))};\n")
open(os.path.join(HERE, "..", "suttas.js"), "w").write(js)
print("ok", {k: len(v["paras"]) for k, v in out.items()}, len(js) // 1024, "KB")
