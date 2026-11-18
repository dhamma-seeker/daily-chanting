# CLAUDE.md

แอปบทสวดมนต์ "สุตตะ ฆราวาส" — PWA ไฟล์ static ล้วน (ไม่มี build step) deploy ด้วย GitHub Pages จาก `main`

- **ก่อนแก้ UI ทุกครั้ง อ่าน [DESIGN.md](DESIGN.md)** ใช้สี ฟอนต์ ระยะ และกฎตามนั้น
  แก้ดีไซน์แล้วให้อัปเดต DESIGN.md ในงานเดียวกันด้วย
- งานที่มีอนิเมชันหรือแสง อ่าน [MOTION.md](MOTION.md) ก่อน: ลำดับ 7 จังหวะ 3 ระดับของแสง และกฎที่ห้ามละเมิด
- ไฟล์ที่ **สร้างอัตโนมัติ อย่าแก้ตรง ๆ**: `uposatha.js` (แก้ `tools/uposatha_src.py` แล้วรัน `python3 -I tools/build_uposatha.py`),
  `night.js` บทสวดก่อนนอน + นโม (แก้ `tools/night_src.py` แล้วรัน `python3 -I tools/build_night.py`),
  `suttas.js` (คำแปลอยู่ `tools/suttas/th_*.py` แล้วรัน `python3 -I tools/build_suttas.py`)
- บทสวดหลักแก้ที่ `data.js` · ตรรกะหน้าจอทั้งหมดอยู่ใน `app.js` · สไตล์ใน `styles.css`
- รันทดสอบในเครื่อง: `python3 -m http.server 8765` แล้วเปิด http://localhost:8765
- ทดสอบอย่างน้อยที่ความกว้าง 375px ทั้งโหมดสว่างและมืด และเช็คว่าไม่มี error ใน console
- เจ้าของ repo สื่อสารภาษาไทย ข้อความ commit เขียนเป็นภาษาไทย
