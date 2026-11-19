"""สร้างหน้าพระสูตรเต็ม  python3 -I tools/build_suttas.py

ผลลัพธ์
  suttas.js         ดัชนีเล็ก ๆ ที่โหลดทุกครั้ง: SUTTAS[id] = {title, sub, ref, depth}
  suttas/<id>.json  เนื้อหาพระสูตร (บาลีคำต่อคำ + คำแปลทุกย่อหน้า) โหลดเมื่อเปิดหน้าพระสูตร
  suttas/list.js    รายชื่อไฟล์ให้ sw.js แคชไว้ใช้ออฟไลน์

ต้นฉบับ: บาลี tools/suttas/raw-<id>.json (ฐานข้อมูล tripitaka-mcp) + คำแปล tools/suttas/th_<id>.py
"""
import importlib.util, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
sys.path.insert(0, HERE)
from pali2thai import word_pairs

SUT = os.path.join(HERE, "suttas")
# หมวดวันอุโบสถ
IDS = ["an3.37", "an3.70", "an8.41", "an9.18", "an10.46", "snp2.14"]
# สวดก่อนนอน / สวดเช้า (บทสวดและคำอธิบายในบท)
IDS += ["mn100", "kp1", "an6.10", "an11.12", "sn11.3", "an8.39", "an5.57", "sn56.29", "sn56.11",
        "sn35.1", "sn35.4", "sn35.5", "an3.65", "snp1.8", "an11.15", "an10.176", "mn41", "sn3.8", "ud5.1",
        "kp7", "an10.177", "an5.39", "dn16", "ja159", "mn53", "dn31", "mn56"]
# ระดับเลขย่อหน้า: ปกติใช้เลขแรกหลัง ":" · DN 16 ใช้ ๒ ระดับ (เช่น 1.31) เพราะเลขแรกครอบทั้งภาณวาร
DEPTH = {"dn16": 2}
ABBR = {"kp": "Khp", "ja": "Ja", "ud": "Ud", "snp": "Snp", "an": "AN", "sn": "SN", "mn": "MN", "dn": "DN"}


def ref_of(sid):
    m = re.match(r"([a-z]+)(.*)", sid)
    return f"{ABBR[m.group(1)]} {m.group(2)}"


def load_th(sid):
    p = os.path.join(SUT, "th_" + sid.replace(".", "_") + ".py")
    spec = importlib.util.spec_from_file_location("th", p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


index, files, missing_th = {}, [], []
os.makedirs(os.path.join(ROOT, "suttas"), exist_ok=True)
for sid in IDS:
    if not os.path.exists(os.path.join(SUT, "th_" + sid.replace(".", "_") + ".py")):
        missing_th.append(sid); continue
    raw = json.load(open(os.path.join(SUT, f"raw-{sid}.json")))
    th = load_th(sid)
    depth = DEPTH.get(sid, 1)
    paras, order = {}, []
    for r in raw:
        seg = r["segment_id"]
        loc = seg.split(":")[1].split(".")
        if loc[0] == "0":
            continue
        para = ".".join(loc[:depth])
        text = th.EXPAND.get(seg, r["pali"] or "")
        for line in text.split("\n"):
            if para not in paras:
                paras[para] = {"n": para, "lines": [], "thai": th.TH.get(para, "")}
                order.append(para)
            paras[para]["lines"].append({"id": seg, "expanded": seg in th.EXPAND, "w": word_pairs(line)})
    missing = [p for p in order if not paras[p]["thai"]]
    assert not missing, (sid, "ย่อหน้าที่ยังไม่มีคำแปล", missing)
    extra = set(th.TH) - set(order)
    assert not extra, (sid, "คำแปลของย่อหน้าที่ไม่มีในบาลี", extra)
    index[sid] = {"title": th.TITLE, "sub": th.SUB, "ref": ref_of(sid), "depth": depth}
    fn = f"suttas/{sid}.json"
    with open(os.path.join(ROOT, fn), "w") as f:
        json.dump({"paras": [paras[p] for p in order]}, f, ensure_ascii=False, separators=(",", ":"))
    files.append("./" + fn)

if missing_th:
    print("⚠ ยังไม่มีคำแปล (ข้ามไปก่อน):", ", ".join(missing_th))
js = ("// ============================================================\n"
      "//  ดัชนีพระสูตรเต็ม  ⚠️ ไฟล์นี้สร้างอัตโนมัติ อย่าแก้ตรงนี้\n"
      "//  เนื้อหาแต่ละสูตรอยู่ที่ suttas/<id>.json (โหลดเมื่อเปิดหน้าพระสูตร)\n"
      "//  บาลีจากฐานข้อมูล tripitaka-mcp (SuttaCentral bilara-data)\n"
      "//  คำแปลอยู่ที่ tools/suttas/th_*.py  สร้างใหม่: python3 -I tools/build_suttas.py\n"
      "// ============================================================\n\n"
      f"const SUTTAS = {json.dumps(index, ensure_ascii=False, indent=1)};\n")
open(os.path.join(ROOT, "suttas.js"), "w").write(js)
open(os.path.join(ROOT, "suttas", "list.js"), "w").write(
    "// สร้างอัตโนมัติโดย tools/build_suttas.py · รายชื่อไฟล์พระสูตรให้ sw.js แคชไว้ใช้ออฟไลน์\n"
    f"self.SUTTA_FILES = {json.dumps(files, indent=1)};\n")
size = sum(os.path.getsize(os.path.join(ROOT, f[2:])) for f in files)
print("ok", len(index), "suttas ·", len(js) // 1024, "KB index ·", size // 1024, "KB content")
