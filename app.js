// ============================================================
//  สุตตะ ฆราวาส — ตรรกะหน้าจอ
// ============================================================

const view = document.getElementById("view");
const titleEl = document.getElementById("title");
const topbar = document.getElementById("topbar");
const backBtn = document.getElementById("backBtn");
const gearBtn = document.getElementById("gearBtn");
const APP_TITLE = "สุตตะ ฆราวาส";

// ---------- ไอคอน (SVG เส้น แบบ Lucide) ----------
const svg = (d, extra = "") => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  lotus: svg('<path d="M12 20c-4 0-7-2.5-8-6 2.5-.3 5 .6 6.5 2.3"/><path d="M12 20c4 0 7-2.5 8-6-2.5-.3-5 .6-6.5 2.3"/><path d="M12 20c-2-2-3-4.5-3-7.5 0-2.8 1.2-5.3 3-7.5 1.8 2.2 3 4.7 3 7.5 0 3-1 5.5-3 7.5z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
  moon: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  book: svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  chev: svg('<path d="m9 18 6-6-6-6"/>'),
  down: svg('<path d="m6 9 6 6 6-6"/>'),
  up: svg('<path d="m18 15-6-6-6 6"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  wifiOff: svg('<path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M5 12.86a10 10 0 0 1 5.17-2.69M19 12.86a10 10 0 0 0-2.01-1.52M2 8.82a15 15 0 0 1 4.18-2.65M22 8.82a15 15 0 0 0-11.29-3.76M2 2l20 20"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
  bt: svg('<path d="m7 7 10 10-5 5V2l5 5L7 17"/>'),
  italic: svg('<path d="M19 4h-9M14 20H5M15 4 9 20"/>'),
  underline: svg('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
};
const SESSION_ICON = { morning: "sun", night: "moon", uposatha: "book" };

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// ============================================================
//  ค่าการอ่าน (แยกชั้น: บาลีไทย / บาลีโรมัน / คำแปลไทย)
// ============================================================
const FONTS = {
  notoSansThai:  { name: "Noto Sans Thai",  note: "ไม่มีหัว ทันสมัย", css: '"Noto Sans Thai", "Noto Sans", sans-serif', gf: null },
  sarabun:       { name: "Sarabun",         note: "มีหัว คุ้นตา", css: '"Sarabun", "Noto Sans Thai", sans-serif', gf: "Sarabun:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700" },
  notoSerifThai: { name: "Noto Serif Thai", note: "มีหัว แบบหนังสือ", css: '"Noto Serif Thai", "Noto Sans Thai", serif', gf: "Noto+Serif+Thai:wght@300;400;500;700" },
  pridi:         { name: "Pridi",           note: "มีหัว เส้นมีเชิง", css: '"Pridi", "Noto Sans Thai", serif', gf: "Pridi:wght@300;400;500;700" },
  notoSans:      { name: "Noto Sans",       note: "ไม่มีเชิง", css: '"Noto Sans", sans-serif', gf: null },
  notoSerif:     { name: "Noto Serif",      note: "มีเชิง", css: '"Noto Serif", serif', gf: "Noto+Serif:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700" },
  gentium:       { name: "Gentium Plus",    note: "ทำมาเพื่ออักษรมีจุด/ขีด", css: '"Gentium Plus", "Noto Serif", serif', gf: "Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700" },
};
const THAI_FONTS = ["notoSansThai", "sarabun", "notoSerifThai", "pridi"];
const LAYERS = {
  pali:  { label: "บาลีไทย",  long: "บาลี อักษรไทย",   desc: "ตัวบทที่ใช้สวด", min: 16, max: 34, step: 2, fonts: THAI_FONTS, sample: "นะโม ตัสสะ", small: "ก−", big: "ก+" },
  roman: { label: "บาลีโรมัน", long: "บาลี อักษรโรมัน", desc: "ใต้คำบาลี ในบทที่มีคำต่อคำ", min: 12, max: 22, step: 1, fonts: ["notoSans", "notoSerif", "gentium"], sample: "Namo tassa", small: "A−", big: "A+" },
  thai:  { label: "คำแปลไทย", long: "คำแปลไทย",       desc: "ความหมายของแต่ละท่อน", min: 14, max: 28, step: 2, fonts: THAI_FONTS, sample: "ขอนอบน้อม", small: "ก−", big: "ก+" },
};
const LH = { tight: 1.3, normal: 1.5, loose: 1.75 };
const DEFAULTS = {
  pali:  { on: true, size: 22, lh: "tight", font: "notoSansThai", weight: 500, italic: false, underline: false },
  roman: { on: true, size: 14, lh: "tight", font: "notoSans", weight: 400, italic: false, underline: false },
  thai:  { on: true, size: 18, lh: "tight", font: "notoSansThai", weight: 400, italic: false, underline: false },
};
const clone = o => JSON.parse(JSON.stringify(o));

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// โหลดค่า + ย้ายค่าจากรุ่นเก่า (fs / thai / roman)
function loadPrefs() {
  let p = null;
  try { p = JSON.parse(store.get("prefs-v2")); } catch {}
  if (!p || typeof p !== "object") {
    p = clone(DEFAULTS);
    const fs = +store.get("fs");
    if (fs >= 14 && fs <= 34) p.pali.size = Math.max(16, fs);
    if (store.get("thai") === "hide") p.thai.on = false;
    if (store.get("roman") === "hide") p.roman.on = false;
  }
  for (const k of Object.keys(DEFAULTS)) {
    p[k] = Object.assign({}, DEFAULTS[k], p[k] || {});
    if (!LAYERS[k].fonts.includes(p[k].font)) p[k].font = DEFAULTS[k].font;
    if (!LH[p[k].lh]) p[k].lh = DEFAULTS[k].lh;
    p[k].size = Math.min(LAYERS[k].max, Math.max(LAYERS[k].min, +p[k].size || DEFAULTS[k].size));
  }
  return p;
}
let PREFS = loadPrefs();
let THEME = store.get("theme") || "auto";
let STILL = store.get("still") === "1";        // ช่วงนิ่งหลังสวดจบ (ปิดไว้เป็นค่าเริ่มต้น)

function savePrefs() { store.set("prefs-v2", JSON.stringify(PREFS)); }

const loadedFonts = new Set();
function ensureFont(id) {
  const f = FONTS[id];
  if (!f || !f.gf || loadedFonts.has(id)) return;
  loadedFonts.add(id);
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
  document.head.appendChild(l);
}

function apply() {
  const root = document.documentElement.style;
  for (const k of Object.keys(LAYERS)) {
    const v = PREFS[k];
    ensureFont(v.font);
    root.setProperty(`--${k}-fs`, v.size + "px");
    root.setProperty(`--${k}-lh`, LH[v.lh]);
    root.setProperty(`--${k}-ff`, FONTS[v.font].css);
    root.setProperty(`--${k}-fw`, v.weight);
    root.setProperty(`--${k}-fst`, v.italic ? "italic" : "normal");
    root.setProperty(`--${k}-td`, v.underline ? "underline" : "none");
    document.body.classList.toggle("hide-" + k, !v.on);
  }
  if (THEME === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", THEME);
}

// ============================================================
//  ส่วนประกอบข้อความ
// ============================================================
// คู่คำ [บาลีไทย, โรมัน, ระดับเน้น?] · ระดับ 1 = เน้นอ่อน, 2 = เน้นเข้ม (คำที่ต่างกันในท่อนที่คล้ายกัน)
function renderWords(lines) {
  return lines.map(line => line.map(([t, r, k]) =>
    `<span class="w${k ? " k" + k : ""}"><span class="t">${esc(t)}</span><span class="r" lang="pi-Latn">${esc(r)}</span></span>`).join(""))
    .join("<br>");
}
// คำแปลที่มีช่วงเน้น seg.tm = [[เริ่ม, จบ, ระดับ], ...]
function thaiHTML(seg) {
  if (!seg.tm) return esc(seg.thai);
  let out = "", at = 0;
  for (const [a, b, k] of seg.tm) {
    out += esc(seg.thai.slice(at, a)) + `<mark class="k${k}">${esc(seg.thai.slice(a, b))}</mark>`;
    at = b;
  }
  return out + esc(seg.thai.slice(at));
}
function paliBlock(seg) {
  if (seg.w) return `<div class="pali has-w" lang="pi">${renderWords(seg.w)}</div>`;
  const isTodo = typeof TODO !== "undefined" && seg.pali === TODO;
  return `<div class="pali${isTodo ? " todo" : ""}" lang="pi">${esc(seg.pali)}</div>`;
}
function segmentHTML(seg, extraClass = "") {
  const ref = seg.ref ? refLink(seg.ref) : "";
  if (!seg.pali) return `<div class="segment guide ${extraClass}"><div class="guide-text">${esc(seg.thai)}</div>${ref}</div>`;
  const thai = seg.thai ? `<div class="thai">${thaiHTML(seg)}</div>` : "";
  const tag = seg.tag ? `<div class="seg-tag">${esc(seg.tag)}</div>` : "";
  return `<div class="segment${seg.tag ? " has-tag" : ""} ${extraClass}">${tag}${paliBlock(seg)}${thai}${ref}</div>`;
}

// "AN 3.70:4.4–4.5 · 5.2 · AN 8.41:2.1" -> ลิงก์เปิดพระสูตรเต็มในแอป ตรงย่อหน้านั้น
// รองรับ "MN 100:2.3–2.5", "Khp 1:2.1", "Ja 159:3.1", "DN 16:1.31.2" · ส่วนต่อท้ายหลัง · ที่ไม่มีชื่อคัมภีร์ใช้สูตรเดิม
// เลขย่อหน้าตัดตาม depth ของสูตร (ปกติ ๑ ระดับ, DN 16 ๒ ระดับ)
const REF_ID = { AN: "an", SN: "sn", MN: "mn", DN: "dn", Snp: "snp", Khp: "kp", Ja: "ja", Ud: "ud", Dhp: "dhp" };
function refLink(ref) {
  let cur = null;
  const parts = ref.split("·").map(p => p.trim()).filter(Boolean).map(p => {
    const m = p.match(/^(AN|SN|MN|DN|Snp|Khp|Ja|Ud|Dhp)\s*(\d+(?:\.\d+)?)(?::([\d.]+))?/);
    let loc = null;
    if (m) { cur = REF_ID[m[1]] + m[2]; loc = m[3] || null; }
    else { const n = p.match(/^(\d+(?:\.\d+)*)/); loc = n ? n[1] : null; }
    const st = cur && typeof SUTTAS !== "undefined" && SUTTAS[cur];
    if (st) {
      const para = loc ? loc.replace(/\.$/, "").split(".").slice(0, st.depth || 1).join(".") : null;
      return `<a class="ref-link" href="#/sutta/${cur}${para ? "/" + para : ""}">${ICON.book}<span>${esc(p)}</span></a>`;
    }
    return `<span class="ref-plain">${esc(p)}</span>`;
  });
  return `<div class="ref">${parts.join(" ")}</div>`;
}

// ============================================================
//  ดวงจันทร์
// ============================================================
// p: 0 = จันทร์ดับ, .25 = ขึ้น ๘ ค่ำ, .5 = จันทร์เพ็ญ, .75 = แรม ๘ ค่ำ
function moonPath(p) {
  const r = 40, cx = 50, cy = 50;
  const f = ((p % 1) + 1) % 1;
  if (f < 0.01 || f > 0.99) return "";
  const rx = (Math.abs(Math.cos(2 * Math.PI * f)) * r).toFixed(2);
  const top = `${cx} ${cy - r}`, bot = `${cx} ${cy + r}`;
  // ข้างขึ้นสว่างด้านขวา ข้างแรมสว่างด้านซ้าย; ส่วนโค้งที่สองคือเส้นแบ่งมืด-สว่าง
  if (f <= 0.5) return `M ${top} A ${r} ${r} 0 0 1 ${bot} A ${rx} ${r} 0 0 ${f < 0.25 ? 0 : 1} ${top} Z`;
  return `M ${top} A ${r} ${r} 0 0 0 ${bot} A ${rx} ${r} 0 0 ${f > 0.75 ? 1 : 0} ${top} Z`;
}
const THNUM = { "๐": 0, "๑": 1, "๒": 2, "๓": 3, "๔": 4, "๕": 5, "๖": 6, "๗": 7, "๘": 8, "๙": 9 };
function labelPhase(label) {
  const m = String(label).match(/(ขึ้น|แรม)\s*([๐-๙\d]+)/);
  if (!m) return 0.5;
  const n = +[...m[2]].map(c => c in THNUM ? THNUM[c] : c).join("");
  return m[1] === "ขึ้น" ? n / 30 : 0.5 + n / 30;
}
let moonSeq = 0;
// ring: { s, e } เวลาเริ่ม/จบของวงแสงรอบดวงจันทร์ (ms) อัปเดตทุกวินาทีโดย tickUpo()
function moonSVG(p, size, { glow = false, craters = false, alt = "", ring = null } = {}) {
  const d = moonPath(p), id = "mc" + (++moonSeq);
  const lit = d ? `<path d="${d}" fill="url(#mLit)"/>` : "";
  const crat = craters && d ? `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>
    <g clip-path="url(#${id})" fill="#B45309" opacity=".14"><circle cx="38" cy="40" r="7"/><circle cx="60" cy="58" r="9"/><circle cx="57" cy="32" r="4"/><circle cx="40" cy="64" r="4"/></g>` : "";
  const g = glow && d ? `<circle cx="50" cy="50" r="50" fill="url(#mGlow)"/>` : "";
  const a11y = alt ? `role="img" aria-label="${esc(alt)}"` : 'aria-hidden="true"';
  const rw = size < 60 ? 4 : 2.6;
  const rg = ring ? `<circle cx="50" cy="50" r="47" fill="none" stroke="#FDE68A" stroke-opacity=".18" stroke-width="${rw}"/>
    <circle class="moon-ring" data-rs="${+ring.s}" data-re="${+ring.e}" cx="50" cy="50" r="47" fill="none" stroke="#FACC15"
      stroke-width="${rw}" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - frac(+ring.s, +ring.e, Date.now()) * 100}"
      transform="rotate(-90 50 50)"/>` : "";
  return `<svg ${a11y} width="${size}" height="${size}" viewBox="0 0 100 100" style="flex:none;overflow:visible">${g}
    <circle cx="50" cy="50" r="40" fill="#22325A"/>${lit}${crat}
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FDE68A" stroke-opacity=".38" stroke-width="${size < 40 ? 2.4 : 1.2}"/>${rg}</svg>`;
}
const isFullOrNew = p => Math.abs(p - 0.5) < 0.02;
const frac = (s, e, now) => Math.min(1, Math.max(0, (now - s) / (e - s)));

// ============================================================
//  วันอุโบสถ
// ============================================================
const pad2 = n => String(n).padStart(2, "0");
const thDay = d => d.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });
function thTime(d) {
  const r = new Date(d.getTime() + 30000);       // ปัดเป็นนาทีที่ใกล้สุด
  return `${pad2(r.getHours())}:${pad2(r.getMinutes())} น.`;
}
const thHM = d => thTime(d).replace(" น.", "");
const thWhen = d => `${thDay(d)} ${thTime(d)}`;
const thShort = d => `${thDay(d)} ${thHM(d)}`;
const thDM = d => `${d.toLocaleDateString("th-TH", { day: "numeric", month: "short" })} ${thHM(d)}`;
function untilText(ms) {
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60;
  if (h >= 48) return `อีก ${Math.floor(h / 24)} วัน`;
  if (h >= 24) return `อีก 1 วัน ${h - 24} ชม.`;
  if (h >= 1) return `อีก ${h} ชม. ${m} นาที`;
  return `อีก ${m} นาที`;
}

// countdown ปรับความละเอียดตามระยะ: ≥48 ชม. วัน+ชม. · 1–48 ชม. ชม:นาที:วินาที · <1 ชม. นาที:วินาที
function cdParts(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
  if (h >= 48) {
    const hh = h % 24;
    const txt = `${d} วัน${hh ? ` ${hh} ชม.` : ""}`;
    return { mode: "far", text: txt, sr: txt };
  }
  if (h >= 1) return { mode: "near", text: `${h}:${pad2(m)}:${pad2(s)}`, sr: `${h} ชั่วโมง ${m} นาที` };
  return { mode: "final", text: `${pad2(m)}:${pad2(s)}`, sr: `${m} นาที` };
}
// ตัวเลขที่วิ่งซ่อนจากโปรแกรมอ่านหน้าจอ แล้วมีข้อความคู่กันที่อัปเดตทุก 10 นาที (ไม่อ่านรัวทุกวินาที)
function cdHTML(target) {
  const c = cdParts(target - Date.now());
  return `<span class="cd cd-${c.mode}" data-cd="${+target}" aria-hidden="true">${c.text}</span><span class="sr-only" data-cd-sr="${+target}">${c.sr}</span>`;
}

const periodLabel = p => p.days.map(d => d.label).join(" และ ");
const keyDay = p => p.days[p.days.length - 1];            // วัน ๘ หรือ ๑๕ ค่ำ ของช่วง
const sameDate = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
function startRel(d, now) {
  const y = new Date(now); y.setDate(y.getDate() - 1);
  if (sameDate(d, now)) return `เริ่มวันนี้ ${thHM(d)}`;
  if (sameDate(d, y)) return `เริ่มเมื่อค่ำวาน ${thHM(d)}`;
  return `เริ่ม ${thShort(d)}`;
}
function liveInfo(st) {
  const cur = st.current, now = st.now;
  const day = st.todayDay || cur.days.find(d => d.start <= now && now < d.end) || cur.days[0];
  const idx = cur.days.indexOf(day), n = cur.days.length;
  const isKey = day === keyDay(cur);
  return {
    day, idx, n, p: labelPhase(day.label),
    title: day.label + (isKey ? ` · ${cur.phase.name}` : ""),
    sub: (n > 1 ? `วันที่ ${idx + 1} จาก ${n} · ` : "") + startRel(day.start, now),
  };
}

// แถบแบ่งตามวัน: วันที่ผ่าน = เต็ม, วันนี้ = เติมถึงตอนนี้ + ป้าย "ตอนนี้", วันที่ยังไม่ถึง = ว่าง
// เกิน 3 วัน: ช่องเล็กไม่มีชื่อ + "วันที่ k จาก n"
function dayTimeline(per, now) {
  const n = per.days.length, compact = n > 3;
  const segs = per.days.map(d => {
    const isNow = d.start <= now && now < d.end;
    const pct = frac(+d.start, +d.end, +now) * 100;
    const mark = isNow ? `<span class="tl-now" data-mark data-s="${+d.start}" data-e="${+d.end}" style="left:${pct}%"><span class="tl-dot"></span>${compact ? "" : `<span class="tl-tag" style="transform:translateX(-${pct}%)">ตอนนี้</span>`}</span>` : "";
    return `<div class="tl-seg${isNow ? " now" : ""}">
      <div class="tl-bar" data-fade><span class="tl-fill" data-fill data-s="${+d.start}" data-e="${+d.end}" style="width:${pct}%"></span>${mark}</div>
      ${compact ? "" : `<span class="tl-lbl">${esc(d.label)}</span>`}</div>`;
  }).join("");
  const k = per.days.findIndex(d => d.start <= now && now < d.end);
  const cap = compact && k >= 0 ? `<div class="tl-cap">วันที่ ${k + 1} จาก ${n}</div>` : "";
  return `<div class="timeline${compact ? " compact" : ""}" style="--n:${n}" role="img"
    aria-label="${esc(per.days.map(d => d.label).join(", "))}${k >= 0 ? ` · ตอนนี้ ${esc(per.days[k].label)}` : ""}">${segs}</div>${cap}`;
}

function uposathaHomeCard() {
  if (typeof UPO === "undefined") return "";
  const st = UPO.status();
  if (st.current) {
    const L = liveInfo(st), cur = st.current;
    return `<a class="upo-live${fxClass()}" href="#/uposatha">
      <div class="top">
        <span class="moon-wrap" data-fade>${moonSVG(L.p, 88, { glow: isFullOrNew(L.p), craters: true, alt: "ดวงจันทร์ " + L.day.label, ring: { s: cur.start, e: cur.end } })}</span>
        <div class="meta">
          <span class="live-badge"><span class="dot" aria-hidden="true"></span>กำลังถืออุโบสถ</span>
          <span class="big">${esc(L.title)}</span>
          <span class="sub">${esc(L.sub)}</span>
        </div>
      </div>
      <div class="meter">
        <div class="lbls"><span>เหลืออีก <b>${cdHTML(cur.end)}</b></span><span>จบ ${esc(thShort(cur.end))}</span></div>
        ${dayTimeline(cur, st.now)}
      </div>
      <span class="cta">เปิดบทสวดวันอุโบสถ ${ICON.chev}</span>
    </a>`;
  }
  const nx = st.next[0];
  const kd = keyDay(nx), p = labelPhase(kd.label);
  return `<a class="upo-live upo-next" href="#/uposatha">
    <div class="top">
      <span class="moon-wrap">${moonSVG(p, 88, { glow: isFullOrNew(p), craters: true, alt: "ดวงจันทร์ " + kd.label, ring: approachRing(nx) })}</span>
      <div class="meta">
        <span class="eyebrow">วันอุโบสถครั้งถัดไป</span>
        <span class="big">อีก ${cdHTML(nx.start)}</span>
        <span class="sub">${esc(nx.phase.name)} · ${esc(periodLabel(nx))}</span>
      </div>
    </div>
    <div class="upo-when"><div><span>เริ่ม</span><b>${esc(thShort(nx.start))}</b></div><div><span>จบ</span><b>${esc(thShort(nx.end))}</b></div></div>
    <span class="cta">ดูข้อปฏิบัติวันอุโบสถ ${ICON.chev}</span>
  </a>`;
}
// วงแสงก่อนเริ่ม: แสดงเฉพาะ 24 ชม. สุดท้าย เต็มวงตอนถึงเวลาเริ่ม
const APPROACH = 24 * 3600000;
function approachRing(per) {
  return per.start - Date.now() <= APPROACH ? { s: per.start - APPROACH, e: per.start } : null;
}

function dayRows(per, now, live) {
  return per.days.map(d => {
    const p = labelPhase(d.label);
    const state = now >= d.end ? "done" : (now >= d.start ? "now" : "soon");
    const tag = live ? `<span class="tag ${state}">${state === "done" ? "ผ่านแล้ว" : state === "now" ? "วันนี้" : "ถัดไป"}</span>` : "";
    const moon = live ? moonSVG(p, 32, { alt: "ดวงจันทร์ " + d.label })
      : `<span class="moon-tile" style="width:40px;height:40px;border-radius:10px">${moonSVG(p, 32, { alt: "ดวงจันทร์ " + d.label })}</span>`;
    return `<li>${moon}<span class="meta"><b>${esc(d.label)}</b><span>${esc(thDM(d.start))} – ${esc(thDM(d.end))}</span></span>${tag}</li>`;
  }).join("");
}
// รายการวัน: เกิน 3 วันพับไว้ใน "ดูทุกวัน"
function dayList(per, now, live) {
  const rows = `<ul class="upo-days">${dayRows(per, now, live)}</ul>`;
  return per.days.length > 3 ? `<details class="upo-more"><summary>ดูทุกวัน (${per.days.length} วัน)</summary>${rows}</details>` : rows;
}

// ทางเข้าโหมด "ระลึก ๕ ประการ · ใจผ่องใส" (ใต้การ์ดดวงจันทร์ และในบท "ระลึก ๕ ประการ ชำระใจ")
function anEntryHTML(title = "ระลึกทีละข้อ") {
  return `<a class="an-entry" href="#/anussati"><span class="an-mini" aria-hidden="true"></span>
    <span class="meta"><b>${esc(title)}</b><span>ใจผ่องใส · ระลึกถึงพระพุทธ พระธรรม พระสงฆ์ ศีล เทวดา</span></span>${ICON.chev}</a>`;
}

// ---------- พระสูตรประจำคืน (ในหน้าสวดก่อนนอน) ----------
// ข้อมูลและรอบเวียนอยู่ใน night.js: NIGHTLY, nightIndex, nightlyRotation, nightlyMode, nightlyPick, nightlyIn, nightlySet
const nightlyName = id => CHANTS[id].title.replace(/^พระสูตรประจำคืน:\s*/, "");
const nightlyRef = id => (CHANTS[id].note.match(/^[A-Z][A-Za-z]*\s[\d.:–-]+/) || [""])[0];
function nightlyWhen(k) {
  if (k === 0) return "คืนนี้";
  if (k === 1) return "คืนพรุ่งนี้";
  const base = new Date(Date.now() - 6 * 3600e3);          // คืนหนึ่งนับ 06:00–06:00 เหมือน nightIndex()
  return `อีก ${k} คืน · ${thDay(new Date(base.getTime() + k * 86400e3))}`;
}
function nightlyPanelHTML(cid) {
  if (typeof NIGHTLY === "undefined" || !NIGHTLY.includes(cid)) return "";
  const mode = nightlyMode();
  if (mode === "all" && cid !== NIGHTLY[0]) return "";
  const radio = (k, on, label) => `<button type="button" role="radio" aria-checked="${on}" data-nl="${k}">${label}</button>`;
  const modes = radio("mode:rotate", mode === "rotate", "เวียนคืนละบท") + radio("mode:all", mode === "all", "สวดครบทุกบท");
  let body;
  if (mode === "rotate") {
    const pick = nightlyPick(), rot = nightlyRotation();
    const opts = NIGHTLY.map(id => {
      const on = id === pick;
      return `<button type="button" role="radio" class="nl-opt" aria-checked="${on}" data-nl="pick:${id}">
        <span class="nl-dot" aria-hidden="true"></span>
        <span class="meta"><b>${esc(nightlyName(id))}</b><span>${esc(nightlyRef(id))} · ตามรอบ: ${esc(nightlyWhen(nightlyIn(id)))}</span></span>
        ${on ? `<span class="nl-tag">คืนนี้</span>` : ""}</button>`;
    }).join("");
    const tomorrow = nightlyName(nightlyRotation(nightIndex() + 1));
    const note = pick !== rot ? `คืนนี้เลือกเองแล้ว พรุ่งนี้กลับไปตามรอบ (${tomorrow})`
      : `แตะเพื่อสวดบทอื่นแทนเฉพาะคืนนี้ · พรุ่งนี้: ${tomorrow}`;
    body = `<div class="nl-list" role="radiogroup" aria-label="เลือกพระสูตรของคืนนี้">${opts}</div><p class="nl-note">${esc(note)}</p>`;
  } else {
    body = `<p class="nl-note">สวดครบทั้ง ${NIGHTLY.length} พระสูตรทุกคืน: ${NIGHTLY.map(id => esc(nightlyName(id))).join(" · ")}</p>`;
  }
  return `<section class="nightly card" aria-labelledby="nlT"><h3 id="nlT">พระสูตรประจำคืน</h3>
    <div class="seg-ctl" style="--n:2" role="radiogroup" aria-labelledby="nlT">${modes}</div>${body}</section>`;
}

// ---------- บทสวดเสริม (add-on ที่ผู้ใช้เปิด/ปิดได้ตามความชอบ) ----------
// ข้อมูลใน night.js: OPTIONS, optionEnabled, optionSet · เก็บใน localStorage "chants-v1"
let optOpen = false;   // แผงบทสวดเสริมกางอยู่ไหม (คงไว้ตอนวาดหน้าใหม่หลังเปิด/ปิดบท)
// note ของบทขึ้นต้นด้วยที่มาอยู่แล้ว และมีคำว่า "บทสวดเสริม" ซ้ำกับหัวแผง ตัดออกเฉพาะตอนแสดงในแผงนี้
const optNote = n => String(n || "").replace(/\s*·\s*บทสวดเสริม\s*/g, " · ").replace(/(\s*·\s*)+$/, "").trim();
function optionPanelHTML(sid) {
  if (typeof OPTIONS === "undefined") return "";
  const opts = OPTIONS[sid] || [];
  if (!opts.length) return "";
  const nOn = opts.filter(id => optionEnabled(sid, id)).length;
  const rows = opts.map(id => {
    const c = CHANTS[id];
    const on = optionEnabled(sid, id);
    return `<div class="opt-row">
      <span class="meta"><b>${esc(shortTitle(c ? c.title : id))}</b><span>${esc(optNote(c && c.note))}</span></span>
      <button type="button" role="switch" aria-checked="${on}" class="switch" data-opt="${id}" aria-label="เปิด/ปิด ${esc(c ? c.title : id)}"></button>
    </div>`;
  }).join("");
  return `<details class="chant-options card" id="optPanel"${optOpen ? " open" : ""}>
    <summary><span class="t">บทสวดเสริม</span><span class="n">เปิดอยู่ ${nOn} จาก ${opts.length}</span>${ICON.down}</summary>
    <p class="opt-sub">เลือกเพิ่มได้ตามความชอบ · ถ้าปิดไว้จะไม่แสดงในสารบัญ</p>
    ${rows}
  </details>`;
}

function uposathaPanel() {
  if (typeof UPO === "undefined") return "";
  const st = UPO.status(new Date(), 6);
  let hero;
  if (st.current) {
    const L = liveInfo(st), cur = st.current;
    hero = `<section class="upo-hero live${fxClass()}" aria-labelledby="upoHeroT">
      <div class="center">
        <span class="moon-wrap" data-fade>${moonSVG(L.p, 140, { glow: isFullOrNew(L.p), craters: true, alt: "ดวงจันทร์ " + L.day.label, ring: { s: cur.start, e: cur.end } })}</span>
        <span class="live-badge"><span class="dot" aria-hidden="true"></span>กำลังถืออุโบสถ</span>
        <h2 id="upoHeroT">${esc(L.day.label)}</h2>
        <span class="sub">${esc(L.sub)}</span>
        <span class="sub">${esc(cur.phase.name)} ${esc(thWhen(cur.phase.time))}</span>
      </div>
      <div class="meter">
        <div class="lbls"><span>เหลืออีก <b>${cdHTML(cur.end)}</b></span><span>จบ ${esc(thShort(cur.end))}</span></div>
        ${dayTimeline(cur, st.now)}
      </div>
      <div class="upo-grid"><div><small>เริ่ม</small><b>${esc(thShort(cur.start))}</b></div><div><small>จบ</small><b>${esc(thShort(cur.end))}</b></div></div>
      ${dayList(cur, st.now, true)}
    </section>`;
  } else {
    const nx = st.next[0], kd = keyDay(nx), p = labelPhase(kd.label);
    hero = `<section class="upo-hero soon" aria-labelledby="upoHeroT">
      <div class="head">
        <span class="moon-tile" style="width:96px;height:96px;border-radius:20px">${moonSVG(p, 80, { glow: isFullOrNew(p), craters: true, alt: "ดวงจันทร์ " + kd.label, ring: approachRing(nx) })}</span>
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
          <span class="eyebrow" id="upoHeroT">ช่วงถืออุโบสถครั้งถัดไป</span>
          <span class="big">อีก ${cdHTML(nx.start)}</span>
          <span class="sub">${esc(nx.phase.name)} ${esc(thWhen(nx.phase.time))}</span>
        </div>
      </div>
      <div class="upo-grid"><div><small>เริ่ม</small><b>${esc(thShort(nx.start))}</b></div><div><small>จบ</small><b>${esc(thShort(nx.end))}</b></div></div>
      ${dayList(nx, st.now, false)}
    </section>`;
  }
  const later = (st.current ? st.next : st.next.slice(1)).slice(0, 3).map(p => {
    const kd = keyDay(p), ph = labelPhase(kd.label);
    return `<li><span class="moon-tile" style="width:44px;height:44px;border-radius:12px">${moonSVG(ph, 34, { alt: "ดวงจันทร์ " + kd.label })}</span>
      <span class="meta"><b>${esc(periodLabel(p))}</b><span>${esc(thDM(p.start))} – ${esc(thDM(p.end))}</span></span>
      <span class="tag soon">${esc(untilText(p.start - st.now))}</span></li>`;
  }).join("");
  return `${hero}
    ${anEntryHTML("ระลึก ๕ ประการ")}
    <h2 class="section-label">ครั้งต่อ ๆ ไป</h2>
    <ul class="later card">${later}</ul>
    <details class="howto card">
      <summary>นับวันอย่างไร</summary>
      <p>วัน ๘, ๑๔, ๑๕ ของปักษ์ตามพระสูตร (AN 3.37, Snp 2.14) ·
        ๘ ค่ำ คือวันที่ดวงจันทร์ครึ่งดวง ๑๕ ค่ำ คือวันจันทร์เพ็ญหรือจันทร์ดับ ถือรวม ๑๔ ค่ำ ก่อนหน้าด้วย ·
        แต่ละวันนับจากค่ำ ๑๘:๐๐ ถึงค่ำวันรุ่งขึ้น ๑๘:๐๐ เพราะพระสูตรว่า "คืนนี้และวันนี้" (อิมัญจะ รัตติง อิมัญจะ ทิวะสัง) ·
        เวลาข้างขึ้นข้างแรมคำนวณทางดาราศาสตร์ ตามเวลาของเครื่อง</p>
    </details>
    <h2 class="section-label">บทสวดและข้อปฏิบัติ · ${(SESSIONS.find(x => x.id === "uposatha")?.order || []).length} บท</h2>`;
}

// ============================================================
//  นาฬิกาวันอุโบสถ: นับถอยหลังทุกวินาที + ช่วงเปลี่ยนตอนถึงเวลา
// ============================================================
// ช่วงเปลี่ยน (ตาม MOTION.md):
//  เริ่มถือ → "แสงทอง" ที่ดวงจันทร์ · ข้ามวัน (๑๔ → ๑๕) → "ประกาย" ที่แถบวัน · ถือครบ → "ฉัพพรรณรังสี" + อนุโมทนา
let upoTimer = 0, upoKey = null, upoFx = null, upoRerender = null;
const FX_WINDOW = 10 * 60000;    // เห็นการเปลี่ยนภายใน 10 นาที (เช่นเพิ่งกลับมาที่แอป) ยังเล่นช่วงเปลี่ยน เกินนั้นแค่อัปเดตเงียบ ๆ

function upoState(now = new Date()) {
  const st = UPO.status(now);
  if (st.current) {
    const i = st.current.days.findIndex(d => d.start <= now && now < d.end);
    return { key: `L:${+st.current.start}:${i}`, live: true, per: st.current, dayStart: st.current.days[i]?.start };
  }
  return { key: `U:${+st.next[0].start}`, live: false, per: st.next[0] };
}
function fxClass() {
  if (!upoFx) return "";
  return upoFx === "arrive" ? " arrive" : upoFx === "glint" ? " glint" : "";
}
function announce(msg) {
  const a = document.getElementById("announcer");
  if (a) { a.textContent = ""; setTimeout(() => { a.textContent = msg; }, 50); }
}

function startUpoClock(rerender) {
  if (typeof UPO === "undefined") return () => {};
  upoRerender = rerender;
  upoKey = upoState().key;
  tickUpo();
  upoTimer = setInterval(tickUpo, 1000);
  return () => { clearInterval(upoTimer); upoTimer = 0; upoRerender = null; };
}

function tickUpo() {
  if (document.visibilityState !== "visible") return;
  const now = new Date(), nowMs = +now;
  const s = upoState(now);
  if (s.key !== upoKey) {
    const prev = upoKey;
    upoKey = s.key;
    const wasLive = prev && prev.startsWith("L:");
    let fx = null, recent = false;
    if (!wasLive && s.live) { fx = "arrive"; recent = nowMs - s.per.start < FX_WINDOW; }
    else if (wasLive && s.live) { fx = "glint"; recent = nowMs - s.dayStart < FX_WINDOW; }
    else if (wasLive && !s.live) {
      const ended = UPO.status(new Date(nowMs - 60000)).current || UPO.status(new Date(nowMs - FX_WINDOW)).current;
      fx = "end"; recent = !!ended && nowMs - ended.end < FX_WINDOW;
      if (recent) showRiteEnd(ended);
    }
    upoFx = recent && fx !== "end" ? fx : null;
    if (upoRerender) upoRerender();
    upoFx = null;
    if (recent && fx === "arrive") announce("เริ่มช่วงถืออุโบสถแล้ว");
    if (recent && fx === "glint") announce("เข้าสู่วันถัดไปของช่วงถืออุโบสถ");
    return;
  }
  document.querySelectorAll("[data-cd]").forEach(el => {
    const c = cdParts(+el.dataset.cd - nowMs);
    if (el.textContent !== c.text) el.textContent = c.text;
    const cls = "cd cd-" + c.mode;
    if (el.className !== cls) el.className = cls;
  });
  if (now.getSeconds() === 0 && now.getMinutes() % 10 === 0)
    document.querySelectorAll("[data-cd-sr]").forEach(el => { el.textContent = cdParts(+el.dataset.cdSr - nowMs).sr; });
  document.querySelectorAll(".moon-ring").forEach(el =>
    el.setAttribute("stroke-dashoffset", 100 - frac(+el.dataset.rs, +el.dataset.re, nowMs) * 100));
  document.querySelectorAll("[data-fill]").forEach(el => { el.style.width = frac(+el.dataset.s, +el.dataset.e, nowMs) * 100 + "%"; });
  // ป้าย "ตอนนี้" เลื่อนจุดยึดตามตำแหน่ง (ซ้ายสุดชิดซ้าย ขวาสุดชิดขวา) ไม่ให้ล้นขอบการ์ด
  document.querySelectorAll("[data-mark]").forEach(el => {
    const pct = frac(+el.dataset.s, +el.dataset.e, nowMs) * 100;
    el.style.left = pct + "%";
    const tag = el.querySelector(".tl-tag");
    if (tag) tag.style.transform = `translateX(-${pct}%)`;
  });
}

// ฉากถือครบ: ดวงจันทร์เป็นแกน → แสงทอง → ฉัพพรรณรังสี → จาง (ปุ่มปิดกดได้ทันที)
function showRiteEnd(per) {
  if (document.querySelector(".rite") || document.body.classList.contains("chant-mode")) return;
  const kd = keyDay(per), p = labelPhase(kd.label);
  const el = document.createElement("div");
  el.className = "rite";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "riteT");
  el.innerHTML = `<section class="cm-done">
      <div class="bloom" aria-hidden="true">
        <span class="rays" data-fade style="background:${RAYS_BG}"></span>
        <span class="glow" data-fade></span>
        <span class="core" data-fade>${moonSVG(p, 150, { glow: isFullOrNew(p), craters: true })}</span>
      </div>
      <h2 id="riteT" tabindex="-1">อนุโมทนา</h2>
      <p>ถืออุโบสถครบแล้ว · ${esc(periodLabel(per))}</p>
      <div class="actions"><button type="button" class="btn primary block" data-rite="close">ปิด</button></div>
    </section>`;
  const close = () => { el.remove(); removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  el.addEventListener("click", e => { if (e.target.closest("[data-rite=close]")) close(); });
  addEventListener("keydown", onKey);
  document.body.appendChild(el);
  el.querySelector("#riteT").focus({ preventScroll: true });
}

// ============================================================
//  ติดตั้งแอป (แสดงเฉพาะตอนเปิดในเบราว์เซอร์)
// ============================================================
let installEvt = null;
const UA = navigator.userAgent;
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isAndroid = /Android/i.test(UA);
const isIOS = !isAndroid && (/iPhone|iPad|iPod/i.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
const inAppBrowser = /Line\/|FBAN|FBAV|FB_IAB|Instagram|Messenger|MicroMessenger|TikTok/i.test(UA);
const isSamsung = /SamsungBrowser/i.test(UA);

function chromeIntentURL() {
  const u = new URL(location.href);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;end`;
}

// แถบติดตั้งแบบ smart banner: แถวเดียวบนสุดของหน้าแรก แตะแล้วกางวิธีติดตั้งตามเครื่อง
let installOpen = false;
let installTab = null;
const INSTALL_SNOOZE = 14 * 864e5;                 // กดปิดแล้วซ่อน 14 วัน
const safariMajor = () => (/CriOS|FxiOS|EdgiOS/.test(UA) ? 0 : +((UA.match(/Version\/(\d+)/) || [])[1] || 0));

function installMode() {
  if (isStandalone()) return null;
  if (inAppBrowser) return "inapp";
  if (installEvt && !isAndroid && !isIOS) return "desktop";
  if (isIOS || isAndroid) return "mobile";
  return null;
}
const IOS_CHROME_NOTE = "ถ้าใช้ Chrome: ปุ่มแชร์อยู่ที่ช่องที่อยู่เว็บด้านบน แล้วทำต่อแบบเดียวกัน";
function installTabs() {
  const android = installEvt
    ? { steps: ["แตะปุ่ม <b>“ติดตั้ง”</b> ด้านบน", "แตะ <b>“ติดตั้ง”</b> อีกครั้งในหน้าต่างที่ขึ้นมา"],
        note: "ถ้าไม่มีหน้าต่างขึ้นมา: แตะเมนู <b>⋮</b> มุมขวาบน แล้วเลือก <b>“ติดตั้งแอป”</b>" }
    : isSamsung
      ? { steps: ["แตะปุ่ม <b>☰</b> ที่มุมขวาล่าง", "แตะ <b>“เพิ่มหน้าไปยัง”</b> แล้วเลือก <b>“หน้าจอหลัก”</b>", "แตะ <b>“เพิ่ม”</b>"] }
      : { steps: ["แตะปุ่ม <b>⋮</b> ที่มุมขวาบน", "แตะ <b>“ติดตั้งแอป”</b> หรือ <b>“เพิ่มลงในหน้าจอหลัก”</b>", "แตะ <b>“ติดตั้ง”</b>"] };
  return {
    ios26: { tab: "iOS 26", steps: [
      "แตะปุ่ม <b>•••</b> ทางขวาของช่องที่อยู่เว็บ (ด้านล่างจอ)",
      "แตะ <b>“แชร์”</b>",
      "เลื่อนลง แตะ <b>“เพิ่มไปยังหน้าจอโฮม”</b>",
      "เปิดสวิตช์ <b>“เปิดเป็นเว็บแอป”</b> (Open as Web App) ไว้ แล้วแตะ <b>“เพิ่ม”</b>"], note: IOS_CHROME_NOTE },
    ios: { tab: "iOS เก่า", steps: [
      "แตะปุ่มแชร์ (สี่เหลี่ยมมีลูกศรชี้ขึ้น) ที่แถบด้านล่าง",
      "เลื่อนลง แตะ <b>“เพิ่มไปยังหน้าจอโฮม”</b>",
      "แตะ <b>“เพิ่ม”</b> มุมขวาบน"], note: IOS_CHROME_NOTE },
    android: { tab: "Android", ...android },
  };
}
function installBar() {
  const mode = installMode();
  if (!mode) return "";
  const until = +store.get("install-snooze") || 0;
  if (Date.now() < until) return "";
  const open = installOpen;
  let panel;
  if (mode === "inapp") {
    panel = `<p class="ib-note">ตอนนี้เปิดอยู่ในแอปแชต ซึ่งติดตั้งไม่ได้ ต้องเปิดใน Safari หรือ Chrome ก่อน</p>
      ${isAndroid ? `<a class="btn primary block" href="${chromeIntentURL()}">เปิดใน Chrome</a>` : ""}
      <p class="ib-note">ถ้ากดแล้วไม่เปิด: แตะเมนูมุมจอ แล้วเลือก <b>“เปิดในเบราว์เซอร์”</b></p>`;
  } else if (mode === "desktop") {
    panel = `<ol class="ib-steps"><li><span class="n">1</span><span>แตะปุ่ม <b>“ติดตั้ง”</b> ด้านบน</span></li>
      <li><span class="n">2</span><span>กด <b>“ติดตั้ง”</b> อีกครั้งในหน้าต่างที่ขึ้นมา</span></li></ol>`;
  } else {
    const tabs = installTabs();
    const def = isIOS ? (safariMajor() >= 26 || safariMajor() === 0 ? "ios26" : "ios") : "android";
    const key = tabs[installTab] ? installTab : def;
    const t = tabs[key];
    const tabBtns = Object.entries(tabs).map(([k, v]) =>
      `<button type="button" role="tab" aria-selected="${k === key}" data-ib-tab="${k}">${esc(v.tab)}${k === def ? `<span class="sr-only"> (เครื่องนี้)</span>` : ""}</button>`).join("");
    panel = `<div class="seg-ctl ib-tabs" role="tablist" aria-label="เลือกเครื่อง">${tabBtns}</div>
      <ol class="ib-steps">${t.steps.map((x, n) => `<li><span class="n">${n + 1}</span><span>${x}</span></li>`).join("")}</ol>
      ${t.note ? `<p class="ib-note">${t.note}</p>` : ""}`;
  }
  return `<section class="install-bar" id="installBar" aria-label="ติดตั้งแอป">
    <div class="ib-row">
      <button type="button" class="ib-toggle" data-ib="toggle" aria-expanded="${open}" aria-controls="ibPanel">
        <img src="icon.svg?v=2" alt="" width="40" height="40">
        <span class="t"><b>ติดตั้ง ${APP_TITLE}</b><span>${open ? "ย่อวิธีติดตั้ง" : "แตะเพื่อดูวิธีติดตั้ง"}${ICON.down}</span></span>
      </button>
      <button type="button" class="ib-go" data-ib="go">${mode === "inapp" && isAndroid ? "เปิด" : "ติดตั้ง"}</button>
      <button type="button" class="iconbtn ib-x" data-ib="close" aria-label="ปิด ไว้ทีหลัง">${ICON.x}</button>
    </div>
    <div class="ib-panel" id="ibPanel"${open ? "" : " hidden"}>${panel}</div>
  </section>`;
}
function repaintInstallBar() {
  const el = document.getElementById("installBar");
  if (!el) return;
  const html = installBar();
  if (html) el.outerHTML = html; else el.remove();
}
view.addEventListener("click", async e => {
  const b = e.target.closest("[data-ib], [data-ib-tab]");
  if (!b || !b.closest("#installBar")) return;
  if (b.dataset.ibTab) { installTab = b.dataset.ibTab; repaintInstallBar(); document.querySelector(`[data-ib-tab="${installTab}"]`)?.focus(); return; }
  const a = b.dataset.ib;
  if (a === "toggle") { installOpen = !installOpen; repaintInstallBar(); document.querySelector("[data-ib=toggle]")?.focus(); }
  else if (a === "close") { store.set("install-snooze", String(Date.now() + INSTALL_SNOOZE)); document.getElementById("installBar")?.remove(); }
  else if (a === "go") {
    // Android/เดสก์ท็อป: เรียกหน้าต่างติดตั้งของระบบได้เลย · iOS ไม่มี API ให้ติดตั้งเอง จึงกางขั้นตอนแทน
    if (installEvt) {
      installEvt.prompt();
      await installEvt.userChoice.catch(() => {});
      installEvt = null;
      renderHome({ keep: true });
    } else if (installMode() === "inapp" && isAndroid) {
      location.href = chromeIntentURL();
    } else { installOpen = true; repaintInstallBar(); }
  }
});

// ============================================================
//  หน้าจอ
// ============================================================
function setChrome({ title = APP_TITLE, back = true, gear = true, bar = true } = {}) {
  titleEl.textContent = title;
  topbar.classList.toggle("hidden", !bar);
  backBtn.classList.toggle("ghost", !back);
  backBtn.disabled = !back;
  gearBtn.classList.toggle("ghost", !gear);
  gearBtn.disabled = !gear;
  document.body.classList.remove("has-fab", "chant-mode");
  document.querySelector(".fab")?.remove();
  document.title = title === APP_TITLE ? APP_TITLE : `${title} · ${APP_TITLE}`;
  if (typeof cleanupPage === "function") { cleanupPage(); cleanupPage = null; }
}
let cleanupPage = null;

function suggestedSession() {
  const hour = new Date().getHours();
  return (hour >= 4 && hour < 15) ? "morning" : "night";
}

function renderHome({ keep = false } = {}) {
  const y = scrollY;
  setChrome({ bar: false });
  const sid = suggestedSession();
  const s = SESSIONS.find(x => x.id === sid);
  const first = CHANTS[s.order[0]], last = CHANTS[s.order[s.order.length - 1]];
  const span = s.order.length > 1 ? `${s.order.length} บท · ${shortTitle(first.title)} ถึง ${shortTitle(last.title)}` : `${s.order.length} บท`;

  const rows = SESSIONS.map(x => {
    const o = x.order, fc = CHANTS[o[0]], lc = CHANTS[o[o.length - 1]];
    const sub = x.id === "uposatha" ? `${o.length} บท · ข้อปฏิบัติและพระสูตร`
      : o.length > 1 && fc && lc ? `${o.length} บท · ${shortTitle(fc.title)} ถึง ${shortTitle(lc.title)}` : `${o.length} บท`;
    return `<a class="row-card" href="#/${x.id}">
      <span class="tile${x.id === "uposatha" ? " gold" : ""}">${ICON[SESSION_ICON[x.id]] || ICON.book}</span>
      <span class="meta"><b>${esc(x.title)}</b><span>${esc(sub)}</span></span>
      <span class="chev">${ICON.chev}</span>
    </a>`;
  }).join("");

  view.innerHTML = `
    ${installBar()}
    <header class="brand">
      <img class="logo" src="icon.svg?v=2" alt="" width="48" height="48">
      <div class="txt"><h1>${APP_TITLE}</h1><p>เป็นฆราวาส ตามพระสูตร</p></div>
      <a class="iconbtn aa" href="#/settings" aria-label="ตั้งค่าการอ่าน">Aa</a>
    </header>
    ${uposathaHomeCard()}
    <a class="suggest-row" href="#/${s.id}">
      <span class="meta">
        <span class="eyebrow">${ICON[sid === "morning" ? "sun" : "moon"]}<span>แนะนำตอนนี้ · ${sid === "morning" ? "ช่วงเช้า" : "ค่ำแล้ว"}</span></span>
        <b>${esc(s.title)}</b><span class="sub">${esc(span)}</span>
      </span>
      <span class="go">${ICON.play}<span>เริ่มสวด</span></span>
    </a>
    <a class="qp-entry" href="#/quick">
      <span class="qp-glyph" aria-hidden="true">${ICON.lotus}</span>
      <span class="meta"><b>ฝึกสักครู่</b><span>ไม่กี่วินาทีก็ฝึกได้ ตามพระสูตร</span></span>
      <span class="chev">${ICON.chev}</span>
    </a>
    <a class="qp-entry" href="#/topic/snp1.8">
      <span class="qp-glyph" aria-hidden="true">${ICON.book}</span>
      <span class="meta"><b>หัวข้อธรรม</b><span>กรณียเมตตสูตร · อ่านแบบปัด/แตะ</span></span>
      <span class="chev">${ICON.chev}</span>
    </a>
    <h2 class="section-label">บทสวดทั้งหมด</h2>
    <nav class="list grouped" aria-label="บทสวด">${rows}</nav>
    <p class="home-note">${ICON.wifiOff}<span>ใช้ได้แม้ไม่มีเน็ต · อัปเดตเองเมื่อมีเน็ต</span></p>`;
  window.scrollTo(0, keep ? y : 0);
  cleanupPage = startUpoClock(() => renderHome({ keep: true }));
}
const shortTitle = t => t.replace(/\s*\(.*?\)\s*/g, "").replace(/^คำ|^บท|^คาถา/, "").trim();

// ---------- หน้าสวด ----------
let tocExpanded = false;   // สารบัญหน้าวันอุโบสถกางครบแล้วไหม (คงไว้ตอนวาดใหม่ทุกนาทีจากนาฬิกาอุโบสถ)
function renderSession(id, { keep = false } = {}) {
  const s = SESSIONS.find(x => x.id === id);
  if (!s) return renderHome();
  const y = scrollY;
  setChrome({ title: s.title });

  const n = s.order.length;
  const chips = s.order.map((cid, i) => {
    const c = CHANTS[cid];
    return `<a class="chip" href="#c-${i}" data-jump="${i}"><span class="n">${i + 1}</span><span>${esc(c ? shortChip(c.title) : cid)}</span></a>`;
  }).join("");

  const body = s.order.map((cid, i) => {
    const c = CHANTS[cid];
    if (!c) return "";
    const note = c.note ? `<p class="chant-note">${esc(c.note)}</p>` : "";
    const segs = c.segments.map(seg => seg.head ? `<h3 class="seg-head">${esc(seg.head)}</h3>` : segmentHTML(seg)).join("");
    return `<section class="chant" id="c-${i}">
      <div class="chant-head"><span class="of">บทที่ ${i + 1} จาก ${n}</span><h2>${esc(c.title)}</h2>${note}</div>
      ${cid === "uposatha-anussati" ? anEntryHTML() : ""}
      ${s.id === "night" ? nightlyPanelHTML(cid) : ""}
      ${segs}
    </section>`;
  }).join("");

  // หน้าวันอุโบสถ: สารบัญเป็นรายการแนวตั้ง ๕ บทแรก + "อีก N บท" (ดีไซน์ Uposatha บน canvas)
  // ชิปสารบัญยังอยู่ แต่ลอยลงมาใต้แถบบนเฉพาะตอนเลื่อนผ่านรายการไปแล้ว ไม่ให้ซ้ำกันตอนอยู่บนสุด
  const isUpo = s.id === "uposatha", TOC_SHOW = 5;
  const tocList = !isUpo ? "" : `<ol class="toc-list card" id="tocList">${s.order.map((cid, i) => {
      const c = CHANTS[cid];
      return `<li${i >= TOC_SHOW && !tocExpanded ? " hidden" : ""}><a href="#c-${i}" data-jump="${i}"><span class="n">${i + 1}</span><span class="t">${esc(c ? c.title : cid)}</span>${ICON.chev}</a></li>`;
    }).join("")}${n > TOC_SHOW && !tocExpanded ? `<li class="toc-more"><button type="button" id="tocMore" aria-expanded="false">
      <span>อีก ${n - TOC_SHOW} บท · ถึง ${esc(shortTitle(CHANTS[s.order[n - 1]]?.title || ""))}</span>${ICON.down}</button></li>` : ""}</ol>`;

  view.innerHTML = `
    ${isUpo ? uposathaPanel() : ""}
    ${tocList}
    ${optionPanelHTML(s.id)}
    <nav class="toc-chips${isUpo ? " floating" : ""}" aria-label="สารบัญ">
      <div class="scroller">${chips}</div>
      <div class="read-progress" aria-hidden="true"><span id="readProg"></span></div>
    </nav>
    ${body}
    <div class="end-mark" aria-hidden="true">๛</div>`;

  const fab = document.createElement("a");
  fab.className = "fab";
  fab.href = `#/chant/${s.id}`;
  fab.innerHTML = `${ICON.play}<span>สวดทีละท่อน</span>`;
  document.body.appendChild(fab);
  document.body.classList.add("has-fab");

  // พระสูตรประจำคืน: เปลี่ยนโหมด / เลือกบทของคืนนี้ แล้ววาดหน้าใหม่ โดยให้แผงยังอยู่ในจอและโฟกัสอยู่ที่ปุ่มเดิม
  view.querySelectorAll("[data-nl]").forEach(b =>
    b.addEventListener("click", () => {
      const key = b.dataset.nl, [k, v] = key.split(":");
      if (k === "mode") nightlySet({ mode: v });
      else nightlySet({ pick: { night: nightIndex(), id: v } });
      renderSession(id, { keep: true });
      const panel = view.querySelector(".nightly");
      if (panel) {
        const top = panel.getBoundingClientRect().top, tb = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tb-h")) || 64;
        if (top < tb + 60 || top > innerHeight - 120) panel.scrollIntoView({ block: "start", behavior: "auto" });
        view.querySelector(`[data-nl="${key}"]`)?.focus();
      }
    }));

  // บทสวดเสริม: เปิด/ปิดแล้ววาดหน้าใหม่ (คงตำแหน่งเลื่อนไว้)
  document.getElementById("optPanel")?.addEventListener("toggle", e => { optOpen = e.target.open; });
  view.querySelectorAll("[data-opt]").forEach(b =>
    b.addEventListener("click", () => {
      optionSet(id, b.dataset.opt, !optionEnabled(id, b.dataset.opt));
      renderSession(id, { keep: true });
    }));

  view.querySelectorAll("[data-jump]").forEach(a =>
    a.addEventListener("click", e => {
      e.preventDefault();
      const t = document.getElementById("c-" + a.dataset.jump);
      if (t) t.scrollIntoView({ behavior: smooth(), block: "start" });
    }));

  // ชิปบทปัจจุบัน + แถบความคืบหน้า ตามตำแหน่งที่เลื่อน
  const sections = [...view.querySelectorAll(".chant")];
  const chipEls = [...view.querySelectorAll(".chip")];
  const prog = document.getElementById("readProg");
  const tocEl = view.querySelector("#tocList"), floatNav = view.querySelector(".toc-chips.floating");
  let curIdx = -1, raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tb-h")) || 64) + 90;
      let idx = 0;
      sections.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= line) idx = i; });
      if (idx !== curIdx) {
        curIdx = idx;
        chipEls.forEach((c, i) => c.setAttribute("aria-current", i === idx ? "true" : "false"));
        // เลื่อนแถบชิปในแนวนอนเท่านั้น (scrollIntoView จะลากทั้งหน้าลงไปด้วย)
        const chip = chipEls[idx], sc = chip?.parentElement;
        if (chip && sc) sc.scrollTo({ left: sc.scrollLeft + chip.getBoundingClientRect().left - sc.getBoundingClientRect().left - (sc.clientWidth - chip.offsetWidth) / 2, behavior: smooth() });
      }
      if (tocEl && floatNav) floatNav.classList.toggle("show", tocEl.getBoundingClientRect().bottom < line - 90);
      const max = document.documentElement.scrollHeight - innerHeight;
      if (prog) prog.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + "%";
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  view.querySelector("#tocMore")?.addEventListener("click", () => {
    tocExpanded = true;
    view.querySelectorAll("#tocList li[hidden]").forEach(li => li.hidden = false);
    const more = view.querySelector(".toc-more");
    more?.previousElementSibling?.querySelector("a")?.focus();
    more?.remove();
  });
  const stopClock = id === "uposatha" ? startUpoClock(() => renderSession(id, { keep: true })) : () => {};
  cleanupPage = () => { removeEventListener("scroll", onScroll); stopClock(); };
  window.scrollTo(0, keep ? y : 0);
  onScroll();
}
const shortChip = t => t.replace(/\s*\(([^)]*)\)/, (m, x) => /จบ/.test(x) ? "" : ` (${x})`).trim();
const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

// ---------- หน้าพระสูตรเต็ม ----------
// เนื้อหาพระสูตรแยกไฟล์ suttas/<id>.json (แอปเปิดเร็ว ไม่ต้องโหลดทุกสูตรตั้งแต่ต้น · sw.js แคชไว้ใช้ออฟไลน์)
const SUTTA_DATA = {};
function loadSutta(id) {
  if (!SUTTA_DATA[id]) SUTTA_DATA[id] = fetch(`suttas/${id}.json`).then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).catch(e => { delete SUTTA_DATA[id]; throw e; });
  return SUTTA_DATA[id];
}
function suttaHead(id, st) {
  return `<div class="sutta-head">
      <h2>${esc(st.title)}</h2>
      <p>${esc(st.sub)}</p>
      <p class="src">บาลีฉบับ SuttaCentral (ฐานข้อมูล tripitaka-mcp) · คำแปลภาษาชาวบ้าน ·
        <a href="https://tripitaka-mcp.com/read/${esc(id)}" target="_blank" rel="noopener">ดูต้นฉบับออนไลน์</a></p>
    </div>`;
}
function renderSutta(id, para) {
  const st = SUTTAS[id];
  setChrome({ title: st.title });
  view.innerHTML = `${suttaHead(id, st)}<p class="sutta-loading" role="status">กำลังเปิดพระสูตร…</p>`;
  const here = location.hash;
  loadSutta(id).then(data => {
    if (location.hash !== here) return;                 // ผู้ใช้ไปหน้าอื่นแล้ว
    paintSutta(id, st, data, para);
  }).catch(() => {
    const el = view.querySelector(".sutta-loading");
    if (el && location.hash === here) el.textContent = "เปิดพระสูตรนี้ไม่ได้ ลองต่อเน็ตแล้วเปิดอีกครั้ง (เปิดครั้งแรกแล้วจะใช้ออฟไลน์ได้)";
  });
}
function paintSutta(id, st, data, para) {
  const body = data.paras.map(p => {
    const exp = p.lines.some(l => l.expanded)
      ? `<div class="exp-note">ต้นฉบับย่อส่วนนี้ไว้ (…pe…) แอปเติมให้เต็มแล้ว</div>` : "";
    return `<section class="sutta-para${p.n === para ? " target" : ""}" id="p-${esc(p.n)}">
      <div class="para-no">${esc(st.ref)}:${esc(p.n)}</div>
      <div class="pali has-w" lang="pi">${renderWords(p.lines.map(l => l.w))}</div>${exp}
      <div class="thai">${esc(p.thai)}</div>
    </section>`;
  }).join("");
  view.innerHTML = `
    ${suttaHead(id, st)}
    ${body}
    <div class="end-mark" aria-hidden="true">๛</div>`;
  const t = para && document.getElementById("p-" + para);
  if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 0);
  else window.scrollTo(0, 0);
}

// ---------- หน้าตั้งค่าการอ่าน ----------
let setTab = "pali";
let flashedTab = null, flashTimer = 0;
function renderSettings() {
  flashedTab = null;
  setChrome({ title: "ตั้งค่าการอ่าน", gear: false });
  const sample = {
    w: [[["อัฏฐะมิยัง", "Aṭṭhamiyaṁ,"], ["ภิกขะเว", "bhikkhave,"], ["ปักขัสสะ", "pakkhassa"], ["จะตุนนัง", "catunnaṁ"], ["มะหาราชานัง", "mahārājānaṁ"]]],
    pali: "x",
    thai: "ดูก่อนภิกษุทั้งหลาย ในวัน ๘ ค่ำของปักษ์ อำมาตย์และบริวารของท้าวมหาราชทั้งสี่ เที่ยวตรวจดูโลก…",
  };
  view.innerHTML = `
    <section class="set-preview" aria-label="ตัวอย่าง">
      <div class="lbl"><b>ตัวอย่าง</b><span class="editing" id="editingLbl" aria-live="polite"></span></div>
      ${segmentHTML(sample)}
    </section>
    <div id="setBody"></div>`;
  renderSettingsBody();
  window.scrollTo(0, 0);
}

function renderSettingsBody() {
  const host = document.getElementById("setBody");
  if (!host) return;
  const focusKey = document.activeElement?.dataset?.k;
  const L = LAYERS[setTab], v = PREFS[setTab];
  const pv = document.querySelector(".set-preview");
  if (pv) pv.dataset.edit = setTab;
  // ไฮไลต์ชั่วคราว เฉพาะตอนเข้าหน้าครั้งแรกและตอนเปลี่ยนแท็บ (ปรับค่าอื่นในแท็บเดิมไม่กะพริบซ้ำ)
  if (pv && flashedTab !== setTab) {
    flashedTab = setTab;
    pv.classList.remove("flash");
    void pv.offsetWidth;
    pv.classList.add("flash");
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => pv.classList.remove("flash"), 1200);
  }
  const el = document.getElementById("editingLbl");
  if (el) el.textContent = v.on ? `กำลังปรับ: ${L.label}` : `${L.label} ซ่อนอยู่`;
  const radio = (k, val, on, label, extra = "") =>
    `<button type="button" role="radio" aria-checked="${on}" data-k="${k}:${val}"${extra}>${label}</button>`;

  const tabs = Object.keys(LAYERS).map(k => {
    const on = k === setTab;
    return `<button type="button" role="tab" id="tab-${k}" aria-selected="${on}" aria-controls="layerPanel" tabindex="${on ? 0 : -1}" data-k="tab:${k}">
      <span class="t">${LAYERS[k].label}</span><span class="s">${PREFS[k].on ? PREFS[k].size + " px" : "ซ่อนอยู่"}</span></button>`;
  }).join("");

  const spacing = [["tight", "แคบ", "M4 8h16M4 12h16M4 16h16"], ["normal", "ปกติ", "M4 7h16M4 12h16M4 17h16"], ["loose", "กว้าง", "M4 5h16M4 12h16M4 19h16"]]
    .map(([id, label, d]) => radio("lh", id, v.lh === id, `${svg(`<path d="${d}"/>`)}<span>${label}</span>`)).join("");
  const weights = [[300, "บาง"], [400, "ปกติ"], [500, "กลาง"], [700, "หนา"]]
    .map(([w, label]) => radio("weight", w, v.weight === w, label, ` style="font-weight:${w}"`)).join("");
  const fonts = L.fonts.map(id => {
    const f = FONTS[id];
    ensureFont(id);
    return `<button type="button" class="font-opt" role="radio" aria-checked="${v.font === id}" data-k="font:${id}">
      <span class="smp" style="font-family:${esc(f.css)}">${esc(L.sample)}</span>
      <span class="nm">${esc(f.name)}</span><span class="nt">${esc(f.note)}</span></button>`;
  }).join("");
  const themes = [["auto", "อัตโนมัติ"], ["light", "สว่าง"], ["dark", "มืด"]]
    .map(([id, label]) => radio("theme", id, THEME === id, label)).join("");

  host.innerHTML = `
    <div class="seg-ctl tabs" role="tablist" aria-label="ชั้นข้อความ">${tabs}</div>
    <section class="panel card" id="layerPanel" role="tabpanel" aria-labelledby="tab-${setTab}">
      <div class="prow">
        <div style="display:flex;flex-direction:column"><span class="lbl b" id="swLbl">แสดง${L.long}</span><span class="desc">${L.desc}</span></div>
        <button type="button" class="switch" role="switch" aria-checked="${v.on}" aria-labelledby="swLbl" data-k="on:toggle"></button>
      </div>
      ${v.on ? `
      <div class="prow">
        <span class="lbl">ขนาด</span>
        <div class="stepper">
          <button type="button" aria-label="${L.long} เล็กลง" data-k="size:down" ${v.size <= L.min ? "disabled" : ""}>${L.small}</button>
          <output aria-live="polite">${v.size} px</output>
          <button type="button" class="big" aria-label="${L.long} ใหญ่ขึ้น" data-k="size:up" ${v.size >= L.max ? "disabled" : ""}>${L.big}</button>
        </div>
      </div>
      <div class="pcol"><span class="lbl" id="lhLbl">ระยะห่างบรรทัด</span>
        <div class="seg-ctl" role="radiogroup" aria-labelledby="lhLbl">${spacing}</div></div>
      <div class="pcol"><span class="lbl" id="fLbl">ฟอนต์</span>
        <div class="font-grid" role="radiogroup" aria-labelledby="fLbl">${fonts}</div></div>
      <div class="pcol"><span class="lbl" id="wLbl">น้ำหนักตัวอักษร</span>
        <div class="seg-ctl" style="--n:4" role="radiogroup" aria-labelledby="wLbl">${weights}</div></div>
      <div class="prow sep">
        <span class="lbl">ลักษณะ</span>
        <div class="toggles">
          <button type="button" class="tgl" aria-pressed="${v.italic}" data-k="italic:toggle">${ICON.italic}<span>เอียง</span></button>
          <button type="button" class="tgl" aria-pressed="${v.underline}" data-k="underline:toggle">${ICON.underline}<span>ขีดเส้นใต้</span></button>
        </div>
      </div>` : `<p class="off-note">ชั้นนี้ซ่อนอยู่ เปิดสวิตช์เพื่อปรับรูปแบบ</p>`}
    </section>
    <section class="panel card">
      <div class="prow">
        <div style="display:flex;flex-direction:column"><span class="lbl b" id="stLbl">ช่วงนิ่งหลังสวดจบ</span><span class="desc">วงแสงขยายเข้าออกช้า ๆ ให้หายใจตาม 3 รอบ ราว 24 วินาที</span></div>
        <button type="button" class="switch" role="switch" aria-checked="${STILL}" aria-labelledby="stLbl" data-k="still:toggle"></button>
      </div>
      <p class="remote-note">${ICON.bt}<span>โหมดสวดทีละท่อนใช้รีโมทบลูทูธหรือคีย์บอร์ดได้: ↓ → Space = ถัดไป · ↑ ← = ย้อน · Esc = ออก</span></p>
    </section>
    <section class="panel card" style="padding:14px 16px">
      <div class="pcol" style="border-top:0;padding:0"><span class="lbl" id="thLbl" style="font-weight:600">ธีม</span>
        <div class="seg-ctl" role="radiogroup" aria-labelledby="thLbl">${themes}</div></div>
    </section>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button type="button" class="btn secondary" data-k="reset:all">ค่าเดิม</button>
      <button type="button" class="btn primary" style="flex:1" data-k="done:go">เสร็จ</button>
    </div>`;

  if (focusKey) host.querySelector(`[data-k="${CSS.escape(focusKey)}"]`)?.focus();
}

function onSettingsClick(e) {
  const b = e.target.closest("[data-k]");
  if (!b || !b.closest("#setBody")) return;
  const [k, val] = b.dataset.k.split(":");
  const v = PREFS[setTab], L = LAYERS[setTab];
  switch (k) {
    case "tab": setTab = val; break;
    case "on": v.on = !v.on; break;
    case "size": v.size = Math.min(L.max, Math.max(L.min, v.size + (val === "up" ? L.step : -L.step))); break;
    case "lh": v.lh = val; break;
    case "font": v.font = val; break;
    case "weight": v.weight = +val; break;
    case "italic": v.italic = !v.italic; break;
    case "underline": v.underline = !v.underline; break;
    case "theme": THEME = val; store.set("theme", val); break;
    case "still": STILL = !STILL; store.set("still", STILL ? "1" : "0"); break;
    case "reset": PREFS = clone(DEFAULTS); break;
    case "done": goBack(); return;
  }
  savePrefs();
  apply();
  renderSettingsBody();
}
view.addEventListener("click", onSettingsClick);
// ลูกศรซ้าย/ขวาเลื่อนแท็บ ตามแบบ tablist
view.addEventListener("keydown", e => {
  const t = e.target.closest?.('[role="tab"]');
  if (!t || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const keys = Object.keys(LAYERS), i = keys.indexOf(setTab);
  setTab = keys[(i + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
  renderSettingsBody();
  document.getElementById("tab-" + setTab)?.focus();
  e.preventDefault();
});

// ============================================================
//  โหมดสวดทีละท่อน
// ============================================================
let CM = null;          // { sid, steps, i }
let wakeLock = null;

async function requestWake() {
  try {
    if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; updateWakeChip(); });
  } catch { wakeLock = null; }
  updateWakeChip();
}
function releaseWake() { try { wakeLock?.release(); } catch {} wakeLock = null; }
function updateWakeChip() {
  const c = document.getElementById("wakeChip");
  if (c) c.classList.toggle("off", !wakeLock);
}

// ---------- ภาพตอนจบ ----------
// ดอกบัว: กลีบหมุนรอบโคนดอก (60,92) กลีบหลังวาดก่อน
const LOTUS_SVG = (() => {
  const petal = "M60 92 C47 77 45 50 60 26 C75 50 73 77 60 92 Z";
  const ring = [
    { r: -62, s: .78, d: .30, back: true }, { r: 62, s: .78, d: .30, back: true },
    { r: -32, s: .9, d: .15 }, { r: 32, s: .9, d: .15 }, { r: 0, s: 1, d: 0 },
  ];
  const g = ring.map(p => `<path class="petal" d="${petal}" fill="url(#${p.back ? "ptB" : "ptF"})" stroke="#EAB308" stroke-opacity=".55" stroke-width=".8"
    style="--r:${p.r}deg;--s:${p.s};--d:${p.d}s"/>`).join("");
  return `<svg class="lotus" data-fade viewBox="0 0 120 120">
    <defs>
      <linearGradient id="ptF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FDE68A"/><stop offset=".55" stop-color="#FFFBEB"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
      <linearGradient id="ptB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#EAB308"/><stop offset="1" stop-color="#FDE68A"/></linearGradient>
    </defs>
    ${g}
    <path d="M30 96 C45 104 75 104 90 96" fill="none" stroke="#FDE68A" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
})();
// ฉัพพรรณรังสี: นีล ปีต โลหิต โอทาต มัญเชฐ ประภัสสร (โทนอ่อน) เรียงวนเป็นลำแสง 36 ลำ
const RAYS_BG = (() => {
  const c = ["#93C5FD", "#FDE68A", "#FCA5A5", "#FFFFFF", "#FDBA74", "#E9D5FF"];
  const stops = [];
  for (let i = 0; i < 36; i++) {
    const a = i * 10;
    stops.push(`transparent ${a}deg`, `${c[i % 6]} ${a + 2.5}deg`, `${c[i % 6]} ${a + 4.5}deg`, `transparent ${a + 7}deg`);
  }
  return `conic-gradient(from -2deg, ${stops.join(", ")}, transparent 360deg)`;
})();

function buildSteps(s) {
  const steps = [];
  s.order.forEach((cid, ci) => {
    const c = CHANTS[cid];
    if (!c) return;
    let head = "";
    c.segments.forEach(seg => {
      if (seg.head) { head = seg.head; return; }
      steps.push({ ci, chant: c.title, head, seg });
      head = "";
    });
  });
  return steps;
}

function renderChant(sid, idx) {
  const s = SESSIONS.find(x => x.id === sid);
  if (!s) return renderHome();
  setChrome({ title: s.title, bar: false });
  document.body.classList.add("chant-mode");
  // ลำดับบทเปลี่ยนได้ระหว่างที่ CM ยังค้างอยู่ (เปิด/ปิดบทสวดเสริม, เปลี่ยนพระสูตรประจำคืน แล้วกลับมาด้วยปุ่มย้อน)
  const orderKey = s.order.join("|");
  if (!CM || CM.sid !== sid || CM.orderKey !== orderKey) CM = { sid, orderKey, steps: buildSteps(s), i: 0, part: 0, chunks: [], size: "" };
  CM.title = s.title;
  CM.i = Math.max(0, Math.min(CM.steps.length, isNaN(idx) ? 0 : idx));
  CM.part = 0;
  view.innerHTML = `<div class="cm" id="cm"></div>`;
  paintChant();
  requestWake();
  addEventListener("keydown", chantKeys);
  document.addEventListener("visibilitychange", onVis);
  // ฟอนต์เว็บโหลดเสร็จทีหลัง ความสูงของท่อนเปลี่ยน ต้องวัดใหม่
  document.fonts?.ready.then(() => { if (CM) { CM.size = ""; layoutChant(); } });
  cleanupPage = () => {
    clearStill();
    cmDetach();
    removeEventListener("keydown", chantKeys);
    document.removeEventListener("visibilitychange", onVis);
    releaseWake();
    document.body.classList.remove("chant-mode");
  };
}
function onVis() { if (document.visibilityState === "visible" && CM && !wakeLock) requestWake(); }

// ช่วงนิ่ง: ข้อความนำหายใจตรงจังหวะวงแสง (เข้า 4s / ออก 4s × 3 รอบ เริ่มที่ 5.6s)
// เป็นข้อความ ไม่ใช่การเคลื่อนไหว จึงใช้ได้แม้ตั้งลดการเคลื่อนไหว และบอกชัดว่ายังทำงานอยู่ ไม่ได้ค้าง
let stillTimers = [];
function clearStill() { stillTimers.forEach(clearTimeout); stillTimers = []; }
function runStill(el) {
  clearStill();
  if (!el) return;
  const at = (ms, fn) => stillTimers.push(setTimeout(fn, ms));
  at(4600, () => { el.textContent = "นิ่งสักครู่ หายใจตามวงแสง"; el.classList.add("on"); });
  for (let r = 0; r < 3; r++) {
    at(5600 + r * 8000, () => { el.textContent = `หายใจเข้า…  รอบที่ ${r + 1} จาก 3`; });
    at(9600 + r * 8000, () => { el.textContent = `หายใจออก…  รอบที่ ${r + 1} จาก 3`; });
  }
  at(29600, () => { el.textContent = "จบช่วงนิ่ง"; });
  at(32600, () => el.classList.remove("on"));
}

// ---------- teleprompter: ทุกท่อนเรียงเป็น list เดียว ----------
// ท่อนปัจจุบันถูกเลื่อนไปตรึงใต้หัวจอ (โผล่บรรทัดท้ายของท่อนก่อน CM_PEEK px) ท่อนถัดไปเรียงลงมาจางตามระยะ
// ท่อนที่สูงเกินพื้นที่ ตัดเป็นหน้าย่อยที่รอยต่อบรรทัด: กฎหลักคือเห็นท่อนปัจจุบันครบโดยไม่ต้องเลื่อนเอง
const CM_PEEK = 36;
const CM_FOOT_GAP = 44;      // เผื่อขอบล่างที่จางลง ไม่ให้การ์ดท่อนปัจจุบันจมในส่วนจาง
const CM_FADE = [.62, .48, .38, .3, .26];
let cmRO = null, cmIO = null, cmAuto = 0;

// บาลีของท่อนแบนเป็นลำดับคำ (จำบรรทัดเดิมไว้) เพื่อตัดหน้าได้ทั้งตรงท้ายบรรทัด และกลางบรรทัดที่ยาวมาก
function paliWords(seg) {
  if (seg._pw) return seg._pw;
  let out = [];
  if (seg.w) out = seg.w.flatMap((line, li) => line.map(w => ({ li, w })));
  else if (seg.pali) out = String(seg.pali).split("\n").flatMap((line, li) => line.split(/\s+/).filter(Boolean).map(w => ({ li, w })));
  Object.defineProperty(seg, "_pw", { value: out });
  return out;
}
const segWordCount = seg => paliWords(seg).length;
const partsOf = i => (CM && CM.chunks[i] && CM.chunks[i].length) || 1;
const cmLabel = st => `บทที่ ${st.ci + 1} · ${st.chant}${st.head ? " · " + st.head : ""}`;

// หน้าย่อย 1 หน้า = คำบาลี [a, b) + คำแปลช่วงตัวอักษร [t0, t1)
// ตัดคำแปลได้เฉพาะตรงช่องว่าง/ขึ้นบรรทัดใหม่ และเลื่อนช่วงเน้นคำ (tm) ตามไปด้วย
function chunkSeg(seg, c) {
  const out = { ...seg };
  const words = paliWords(seg).slice(c.a, c.b), lines = [];
  for (const { li, w } of words) {
    if (!lines.length || lines[lines.length - 1].li !== li) lines.push({ li, ws: [] });
    lines[lines.length - 1].ws.push(w);
  }
  if (seg.w) out.w = lines.map(l => l.ws);
  else if (seg.pali) out.pali = lines.map(l => l.ws.join(" ")).join("\n");
  const T = String(seg.thai || "");
  let t0 = c.t0;
  while (t0 < c.t1 && /\s/.test(T[t0])) t0++;
  out.thai = T.slice(t0, c.t1).replace(/\s+$/, "");
  if (seg.tm) out.tm = seg.tm.filter(([x, y]) => y > t0 && x < c.t1)
    .map(([x, y, k]) => [Math.max(x, t0) - t0, Math.min(y, t0 + out.thai.length) - t0, k]);
  if (!out.thai) { delete out.thai; delete out.tm; }
  if (!c.last) delete out.ref;
  if (!c.first) delete out.tag;
  return out;
}
function chunkHTML(seg, c) {
  if (!c) return segmentHTML(seg);
  const s = chunkSeg(seg, c);
  if (!seg.pali) return segmentHTML({ ...s, thai: s.thai || "" });
  if (c.b > c.a) return segmentHTML(s);
  return `<div class="segment">${s.thai ? `<div class="thai cm-thai-only">${thaiHTML(s)}</div>` : ""}${s.ref ? refLink(s.ref) : ""}</div>`;
}
function cmPageInner(st, c, p, k) {
  return `<span class="cm-chant"><span>${esc(cmLabel(st))}</span>${k > 1 ? `<span class="cm-part">หน้า ${p + 1}/${k}</span>` : ""}</span>
    ${chunkHTML(st.seg, c)}
    ${p < k - 1 ? `<span class="cm-more">${ICON.down}<span>ท่อนนี้ยาว แตะเพื่อดูหน้าถัดไป</span></span>` : ""}`;
}
function cmPagesHTML() {
  let prevCi = -1;
  return CM.steps.map((st, si) => {
    const ch = CM.chunks[si], k = ch ? ch.length : 1;
    let html = "";
    for (let p = 0; p < k; p++) {
      const first = st.ci !== prevCi && p === 0;
      html += `<section class="cm-page${first ? " first" : ""}" data-i="${si}" data-p="${p}" inert>${cmPageInner(st, ch && ch[p], p, k)}</section>`;
    }
    prevCi = st.ci;
    return html;
  }).join("");
}
// หาจุดตัดที่ไกลที่สุดใน cand ที่ยังพอดีพื้นที่ (ความสูงเพิ่มตามจุดตัดเสมอ จึงค้นแบบ binary search ได้)
function farthestFit(cand, fits) {
  let lo = 0, hi = cand.length - 1, best = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (fits(cand[m])) { best = m; lo = m + 1; } else hi = m - 1;
  }
  return best < 0 ? null : cand[best];
}
// จัดหน้าย่อยแบบโลภ: บาลีก่อน (ตัดท้ายบรรทัดก่อน ถ้าบรรทัดเดียวก็ล้นจึงตัดกลางบรรทัด) แล้วต่อคำแปลยาวที่สุดที่ยังพอดี
function packStep(st, avail, measurer) {
  const seg = st.seg, W = paliWords(seg), N = W.length, T = String(seg.thai || "");
  const lineEnds = [], wordEnds = [], tCuts = [];
  for (let i = 1; i <= N; i++) { wordEnds.push(i); if (i === N || W[i].li !== W[i - 1].li) lineEnds.push(i); }
  for (let i = 1; i < T.length; i++) if (/\s/.test(T[i]) && !/\s/.test(T[i - 1])) tCuts.push(i);
  tCuts.push(T.length);
  const h = c => {
    measurer.innerHTML = cmPageInner(st, { ...c, first: c.a === 0 && c.t0 === 0, last: c.t1 >= T.length && c.b >= N }, 0, 2);
    return measurer.offsetHeight;
  };
  const chunks = [];
  let a = 0, t = 0;
  while ((a < N || t < T.length) && chunks.length < 80) {
    const c = { a, b: a, t0: t, t1: t };
    if (a < N) {
      const fit = b => h({ ...c, b }) <= avail;
      c.b = farthestFit(lineEnds.filter(x => x > a), fit) ?? farthestFit(wordEnds.filter(x => x > a), fit) ?? a + 1;
    }
    // คำแปลทั้งก้อนไม่พอดีหน้านี้: ลองส่งบรรทัดท้าย ๆ ไปหน้าถัดไปพร้อมคำแปลทั้งหมด จะได้ไม่ตัดคำแปลกลางประโยค
    if (c.b === N && t < T.length && c.b > a && h({ ...c, t1: T.length }) > avail) {
      const ends = lineEnds.filter(x => x > a && x < N);
      let lo = 0, hi = ends.length - 1, x = null;
      while (lo <= hi) {
        const m = (lo + hi) >> 1;
        if (h({ a: ends[m], b: N, t0: t, t1: T.length }) <= avail) { x = ends[m]; hi = m - 1; } else lo = m + 1;
      }
      if (x !== null) { c.b = x; chunks.push(c); a = x; continue; }
    }
    if (c.b === N && t < T.length) {
      const t1 = farthestFit(tCuts.filter(x => x > t), x => h({ ...c, t1: x }) <= avail);
      c.t1 = t1 ?? (c.b === a ? tCuts.find(x => x > t) : t);
    }
    chunks.push(c);
    a = c.b; t = c.t1;
  }
  chunks.forEach((c, i) => { c.first = i === 0; c.last = i === chunks.length - 1; });
  return chunks;
}

function paintChant() {
  clearStill();
  cmDetach();
  const host = document.getElementById("cm");
  if (!host || !CM) return;
  const { steps, i } = CM, n = steps.length, done = i >= n;
  const head = `<header class="cm-head">
      <div class="row">
        <button type="button" class="iconbtn" data-cm="exit" aria-label="ออกจากโหมดสวด">${ICON.x}</button>
        <div class="ttl"><h1>${esc(CM.title)}</h1><span class="pos" id="cmPos" aria-live="polite"></span></div>
        <span class="wake-chip${wakeLock ? "" : " off"}" id="wakeChip" title="จอจะไม่ดับระหว่างสวด">${ICON.sun}<span>จอไม่ดับ</span></span>
      </div>
      <div class="cm-bar" id="cmBar" role="progressbar" aria-label="ความคืบหน้า" aria-valuemin="0" aria-valuemax="100"><span></span></div>
    </header>`;

  if (done) {
    const chants = new Set(steps.map(x => x.ci)).size;
    const still = STILL ? `<span class="breath" data-fade></span>` : "";
    host.innerHTML = `${head}
      <section class="cm-done" aria-labelledby="cmDoneT">
        <div class="bloom" aria-hidden="true">
          <span class="rays" data-fade style="background:${RAYS_BG}"></span>
          <span class="glow" data-fade></span>${still}
          ${LOTUS_SVG}
        </div>
        <h2 id="cmDoneT" tabindex="-1">สาธุ</h2>
        <p>จบ${esc(CM.title)} · ครบ ${chants} บท ${n} ท่อน</p>
        ${STILL ? `<p class="still-note" id="stillNote" aria-hidden="true"></p><p class="sr-only">ช่วงนิ่ง หายใจตามวงแสง 3 รอบ</p>` : ""}
        <div class="actions">
          <a class="btn primary block" href="#/">กลับหน้าแรก</a>
          <button type="button" class="btn secondary block" data-cm="restart">สวดอีกครั้ง</button>
        </div>
      </section>`;
    cmHeadSync();
    host.querySelector("#cmDoneT").focus({ preventScroll: true });
    if (STILL) runStill(host.querySelector("#stillNote"));
    return;
  }

  host.innerHTML = `${head}
    <div class="cm-stage" id="cmStage"><div class="cm-list" id="cmList"></div></div>
    <button type="button" class="cm-back" id="cmBack" data-cm="back" hidden>${ICON.up}<span>กลับไปท่อนปัจจุบัน</span></button>
    <footer class="cm-foot"><div class="inner">
      <button type="button" class="btn secondary" data-cm="prev" id="cmPrev" aria-label="ย้อนท่อนก่อนหน้า">${ICON.up}<span>ย้อน</span></button>
      <span class="hint">แตะที่บทสวดเพื่อไปต่อ</span>
      <button type="button" class="btn primary" data-cm="next" id="cmNext"><span>ถัดไป</span>${ICON.down}</button>
    </div></footer>`;

  const stage = host.querySelector("#cmStage");
  // แตะตรงไหนของบทสวดก็ไปต่อ (ปุ่ม "ถัดไป" ด้านล่างและคีย์บอร์ดทำแบบเดียวกัน สำหรับคนที่ไม่ใช้การแตะ)
  stage.addEventListener("click", e => {
    if (e.target.closest("a, button, summary, input, label")) return;
    if (String(getSelection?.() || "")) return;
    chantGo(1);
  });
  // ท่อนปัจจุบันหลุดจากจอเพราะผู้ใช้เลื่อนดูเอง → แสดงปุ่ม "กลับไปท่อนปัจจุบัน" (ไม่ดึงจอกลับเอง)
  cmIO = new IntersectionObserver(([en]) => {
    if (!en || Date.now() < cmAuto) return;
    document.getElementById("cmBack").hidden = en.intersectionRatio >= .5;
  }, { root: stage, threshold: [0, .5, 1] });
  cmRO = new ResizeObserver(() => layoutChant());
  cmRO.observe(stage);
  layoutChant();
}
function cmDetach() {
  cmRO?.disconnect(); cmIO?.disconnect();
  cmRO = cmIO = null;
}

// วัดความสูงจริงของแต่ละท่อน แล้วตัดท่อนที่ล้นเป็นหน้าย่อย (ทำใหม่เมื่อขนาดจอหรือฟอนต์เปลี่ยน)
function layoutChant() {
  const stage = document.getElementById("cmStage"), list = document.getElementById("cmList");
  if (!stage || !list || !CM) return;
  const size = `${stage.clientWidth}x${stage.clientHeight}`;
  if (size === CM.size && list.childElementCount) return;
  const keepPart = CM.part;
  CM.size = size;
  CM.chunks = [];
  const avail = stage.clientHeight - CM_PEEK - CM_FOOT_GAP;
  list.style.paddingBottom = `${stage.clientHeight}px`;
  list.innerHTML = cmPagesHTML();
  const measurer = document.createElement("section");
  measurer.className = "cm-page is-cur cm-measure";
  measurer.setAttribute("aria-hidden", "true");
  list.appendChild(measurer);
  measurer.innerHTML = list.firstElementChild ? list.firstElementChild.innerHTML : "";
  for (const el of [...list.children]) {
    if (el === measurer) continue;
    const si = +el.dataset.i;
    measurer.innerHTML = el.innerHTML;
    if (measurer.offsetHeight > avail) CM.chunks[si] = packStep(CM.steps[si], avail, measurer);
  }
  measurer.remove();
  if (CM.chunks.length) list.innerHTML = cmPagesHTML();
  CM.part = Math.min(keepPart, partsOf(CM.i) - 1);
  syncChant(false);
}

function cmHeadSync() {
  const { steps, i } = CM, n = steps.length, done = i >= n;
  const pos = Math.min(i + 1, n);
  const pct = done ? 100 : Math.round((i / n) * 100);
  const posEl = document.getElementById("cmPos"), bar = document.getElementById("cmBar");
  if (posEl) posEl.textContent = done ? "จบแล้ว" : `ท่อน ${pos} จาก ${n}`;
  if (bar) { bar.setAttribute("aria-valuenow", Math.round(pos / n * 100)); bar.firstElementChild.style.width = pct + "%"; }
}

// ย้ายไฮไลต์ไปท่อนปัจจุบัน แล้วเลื่อนให้อยู่ตำแหน่งเดิมใต้หัวจอ
function syncChant(smooth = true) {
  const stage = document.getElementById("cmStage"), list = document.getElementById("cmList");
  if (!stage || !list || !CM) return;
  const pages = [...list.children];
  const ci = pages.findIndex(el => +el.dataset.i === CM.i && +el.dataset.p === CM.part);
  if (ci < 0) return;
  pages.forEach((el, k) => {
    const d = k - ci;
    el.classList.toggle("is-cur", d === 0);
    el.classList.toggle("is-past", d < 0);
    el.style.setProperty("--o", d < 0 ? .35 : d === 0 ? 1 : (CM_FADE[d - 1] ?? .22));
    // ท่อนอื่นเป็น inert: แตะแล้วทะลุไปที่พื้นที่สวด (= ไปต่อ) และโปรแกรมอ่านหน้าจออ่านเฉพาะท่อนปัจจุบัน
    if (d === 0) { el.removeAttribute("inert"); el.setAttribute("aria-current", "step"); }
    else { el.setAttribute("inert", ""); el.removeAttribute("aria-current"); }
  });
  const cur = pages[ci];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  cmAuto = Date.now() + (smooth && !reduce ? 700 : 80);
  document.getElementById("cmBack").hidden = true;
  stage.scrollTo({ top: Math.max(0, cur.offsetTop - CM_PEEK), behavior: smooth && !reduce ? "smooth" : "auto" });
  if (cmIO) { cmIO.disconnect(); cmIO.observe(cur); }

  cmHeadSync();
  const last = CM.i === CM.steps.length - 1 && CM.part === partsOf(CM.i) - 1;
  const nextBtn = document.getElementById("cmNext"), prevBtn = document.getElementById("cmPrev");
  nextBtn.firstElementChild.textContent = last ? "จบ" : "ถัดไป";
  nextBtn.setAttribute("aria-label", last ? "จบการสวด" : "ไปท่อนถัดไป");
  prevBtn.disabled = CM.i === 0 && CM.part === 0;
}

function chantGo(delta) {
  if (!CM) return;
  const n = CM.steps.length, wasDone = CM.i >= n;
  if (delta > 0) {
    if (wasDone) return;
    if (CM.part < partsOf(CM.i) - 1) CM.part++;
    else { CM.i++; CM.part = 0; }
  } else {
    if (wasDone) { CM.i = n - 1; CM.part = partsOf(n - 1) - 1; }
    else if (CM.part > 0) CM.part--;
    else if (CM.i > 0) { CM.i--; CM.part = partsOf(CM.i) - 1; }
    else return;
  }
  // แก้ hash ตรงที่ ไม่เพิ่มประวัติ ถ้าแอปโหลดใหม่ (อัปเดต) จะกลับมาท่อนเดิม
  history.replaceState(null, "", `#/chant/${CM.sid}/${CM.i}`);
  if (CM.i >= n || wasDone || !document.getElementById("cmList")) { CM.size = ""; paintChant(); }
  else syncChant(true);
}
function exitChant() {
  const sid = CM?.sid;
  CM = null;
  if (navDepth > 0) history.back();
  else location.hash = sid ? `#/${sid}` : "";
}
function chantKeys(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const onBtn = e.target.closest?.("button, a");
  const k = e.key;
  if (["ArrowDown", "ArrowRight", "PageDown", " ", "Spacebar"].includes(k)) {
    if (onBtn && k === " ") return;        // ให้ปุ่มที่โฟกัสอยู่ทำงานเอง ไม่ข้ามสองท่อน
    e.preventDefault(); chantGo(1);
  } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(k)) {
    e.preventDefault(); chantGo(-1);
  } else if (k === "Escape") {
    exitChant();
  }
}
view.addEventListener("click", e => {
  const b = e.target.closest("[data-cm]");
  if (!b) return;
  const a = b.dataset.cm;
  if (a === "next") chantGo(1);
  else if (a === "prev") chantGo(-1);
  else if (a === "back") syncChant(true);
  else if (a === "exit") exitChant();
  else if (a === "restart") { CM.i = 0; CM.part = 0; CM.size = ""; history.replaceState(null, "", `#/chant/${CM.sid}/0`); paintChant(); }
});

// ============================================================
//  ระลึก ๕ ประการ · ใจผ่องใส (AN 3.70)
// ============================================================
// ดวงแก้วกลาง = ใจ เริ่มขุ่น แล้วใสขึ้นทีละคุณ · จุดแสงรอบดวงแก้ว = จำนวนคุณของข้อนั้นตามพระสูตร
// แสง (MOTION.md): ทุกคุณ = ประกาย (วงแสงขยาย) · ครบข้อ = แสงทอง · ครบ ๕ ข้อ = ฉัพพรรณรังสี
// บาลีสะกดตามบท "ระลึก ๕ ประการ ชำระใจ" ใน uposatha.js
const ANUSSATI = [
  { label: "พุทธ", name: "ระลึกถึงพระพุทธเจ้า", simile: "เหมือนสระผม", intro: "อิธะ อะริยะสาวะโก ตะถาคะตัง อะนุสสะระติ", q: [
    ["อะระหัง", "เป็นพระอรหันต์ ไกลจากกิเลส"], ["สัมมาสัมพุทโธ", "ตรัสรู้ชอบได้เอง"], ["วิชชาจะระณะสัมปันโน", "ถึงพร้อมด้วยความรู้และความประพฤติ"],
    ["สุคะโต", "ไปดีแล้ว"], ["โลกะวิทู", "รู้แจ้งโลก"], ["อะนุตตะโร ปุริสะทัมมะสาระถิ", "ฝึกคนที่ควรฝึกได้ ไม่มีใครยิ่งกว่า"],
    ["สัตถา เทวะมะนุสสานัง", "เป็นครูของเทวดาและมนุษย์"], ["พุทโธ", "เป็นผู้รู้ ผู้ตื่น ผู้เบิกบาน"], ["ภะคะวา", "เป็นผู้มีโชค ผู้จำแนกธรรม"]] },
  { label: "ธรรม", name: "ระลึกถึงพระธรรม", simile: "เหมือนอาบน้ำชำระกาย", intro: "อิธะ อะริยะสาวะโก ธัมมัง อะนุสสะระติ", q: [
    ["สฺวากขาโต ภะคะวะตา ธัมโม", "พระธรรมที่พระผู้มีพระภาคตรัสไว้ดีแล้ว"], ["สันทิฏฐิโก", "เห็นได้ด้วยตนเอง"], ["อะกาลิโก", "ไม่ขึ้นกับกาลเวลา"],
    ["เอหิปัสสิโก", "ควรเรียกคนอื่นมาดู"], ["โอปะเนยฺยิโก", "ควรน้อมเข้ามาใส่ตัว"], ["ปัจจัตตัง เวทิตัพโพ วิญญูหิ", "ผู้รู้รู้ได้เฉพาะตน"]] },
  { label: "สงฆ์", name: "ระลึกถึงพระสงฆ์", simile: "เหมือนซักผ้า", intro: "อิธะ อะริยะสาวะโก สังฆัง อะนุสสะระติ", q: [
    ["สุปปะฏิปันโน", "ปฏิบัติดี"], ["อุชุปปะฏิปันโน", "ปฏิบัติตรง"], ["ญายัปปะฏิปันโน", "ปฏิบัติเพื่อรู้ธรรม"], ["สามีจิปปะฏิปันโน", "ปฏิบัติสมควร"],
    ["อาหุเนยฺโย", "ควรแก่ของที่นำมาบูชา"], ["ปาหุเนยฺโย", "ควรแก่การต้อนรับ"], ["ทักขิเณยฺโย", "ควรแก่ทักษิณา"], ["อัญชะลิกะระณีโย", "ควรแก่การไหว้"],
    ["อะนุตตะรัง ปุญญักเขตตัง โลกัสสะ", "เป็นเนื้อนาบุญของโลก ไม่มีที่ใดยิ่งกว่า"]] },
  { label: "ศีล", name: "ระลึกถึงศีลของตน", simile: "เหมือนเช็ดกระจกที่หมอง", intro: "อิธะ อะริยะสาวะโก อัตตะโน สีลานิ อะนุสสะระติ", q: [
    ["อะขัณฑานิ", "ไม่ขาด"], ["อัจฉิททานิ", "ไม่ทะลุ"], ["อะสะพะลานิ", "ไม่ด่าง"], ["อะกัมมาสานิ", "ไม่พร้อย"], ["ภุชิสสานิ", "เป็นไท ไม่เป็นทาสตัณหา"],
    ["วิญญุปปะสัตถานิ", "ผู้รู้สรรเสริญ"], ["อะปะรามัฏฐานิ", "ไม่ยึดติดผิด ๆ"], ["สะมาธิสังวัตตะนิกานิ", "ช่วยให้ใจตั้งมั่น"]] },
  { label: "เทวดา", name: "ระลึกถึงเทวดา", simile: "เหมือนหลอมทอง", intro: "อิธะ อะริยะสาวะโก เทวะตา อะนุสสะระติ", q: [
    ["สัทธา", "ศรัทธาแบบที่เทวดามี เราก็มี"], ["สีลัง", "ศีลแบบที่เทวดามี เราก็มี"], ["สุตัง", "การได้ฟังได้เรียนธรรมแบบที่เทวดามี เราก็มี"],
    ["จาโค", "การให้ การเสียสละแบบที่เทวดามี เราก็มี"], ["ปัญญา", "ปัญญาแบบที่เทวดามี เราก็มี"]] },
];
let AN = null;

function renderAnussati() {
  setChrome({ title: "ระลึก ๕ ประการ", bar: false });
  document.body.classList.add("chant-mode");
  AN = { rec: 0, step: -1, done: ANUSSATI.map(() => false), finale: false };
  view.innerHTML = `<div class="an" id="an">
    <header class="an-head">
      <div class="row">
        <button type="button" class="iconbtn" data-an="exit" aria-label="ออกจากการระลึก">${ICON.x}</button>
        <div class="ttl"><h1>ระลึก ๕ ประการ</h1><span id="anPos"></span></div>
        <span class="wake-chip off" id="wakeChip" title="จอจะไม่ดับระหว่างระลึก">${ICON.sun}<span>จอไม่ดับ</span></span>
      </div>
      <div class="an-chips" role="tablist" aria-label="เลือกข้อที่จะระลึก" id="anChips"></div>
    </header>
    <section class="an-stage" aria-hidden="true">
      <span class="an-rays" data-fade id="anRays" style="background:${RAYS_BG}"></span>
      <span class="an-fx" id="anFx"></span>
      <span class="an-dots" id="anDots"></span>
      <span class="an-orb" id="anOrb"><span class="speck s1"></span><span class="speck s2"></span><span class="speck s3"></span><span class="speck s4"></span><span class="an-haze" id="anHaze"></span></span>
    </section>
    <section class="an-card" id="anCard" aria-live="polite"></section>
    <button type="button" class="an-next" data-an="next"><span class="go" id="anNextLbl"></span><span class="hint">แตะตรงไหนก็ได้ในส่วนนี้</span></button>
    <footer class="an-foot">
      <button type="button" class="btn secondary" data-an="prev" id="anPrev">${ICON.up}<span>ย้อน</span></button>
      <a href="#/sutta/an3.70/4">${ICON.book}<span>AN 3.70 อ่านพระสูตร</span></a>
    </footer>
  </div>`;
  paintAn(null);
  requestWake();
  const onKey = e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const onBtn = e.target.closest?.("button, a"), k = e.key;
    if (["ArrowDown", "ArrowRight", "PageDown", " ", "Spacebar"].includes(k)) {
      if (onBtn && k === " ") return;
      e.preventDefault(); anGo(1);
    } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(k)) { e.preventDefault(); anGo(-1); }
    else if (k === "Escape") goBack();
  };
  const onVisAn = () => { if (document.visibilityState === "visible" && !wakeLock) requestWake(); };
  addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", onVisAn);
  cleanupPage = () => {
    removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVisAn);
    releaseWake();
    document.body.classList.remove("chant-mode");
    AN = null;
  };
}

function anGo(delta) {
  if (!AN) return;
  const R = ANUSSATI[AN.rec], N = R.q.length;
  let fx = null;
  if (AN.finale) {
    if (delta > 0) Object.assign(AN, { rec: 0, step: -1, done: ANUSSATI.map(() => false), finale: false });
    else Object.assign(AN, { finale: false, rec: ANUSSATI.length - 1, step: ANUSSATI[ANUSSATI.length - 1].q.length });
  } else if (delta > 0) {
    if (AN.step < N) {
      AN.step++;
      fx = "flash";
      if (AN.step === N) { AN.done[AN.rec] = true; fx = "gold"; }
    } else {
      const nxt = AN.done.findIndex((d, i) => !d && i !== AN.rec);
      if (nxt === -1) { AN.finale = true; fx = "gold"; }
      else Object.assign(AN, { rec: nxt, step: -1 });
    }
  } else {
    if (AN.step > -1) AN.step--;
    else if (AN.rec > 0) Object.assign(AN, { rec: AN.rec - 1, step: ANUSSATI[AN.rec - 1].q.length });
    else return;
  }
  paintAn(fx);
}

function paintAn(fx) {
  if (!AN || !document.getElementById("an")) return;
  const R = ANUSSATI[AN.rec], N = R.q.length;
  const doneCount = AN.done.filter(Boolean).length;
  const lit = AN.finale ? N : Math.max(0, Math.min(N, AN.step + 1));
  // ข้อถัดไปเริ่มจากใจที่ขุ่นน้อยลง ตามจำนวนข้อที่ระลึกครบแล้ว
  const startHaze = Math.max(.35, .9 - .11 * (AN.done[AN.rec] ? doneCount - 1 : doneCount));
  const p = AN.finale ? 1 : lit / N;
  const haze = startHaze * (1 - p);
  const g = Math.round(18 + 70 * p);

  const orb = document.getElementById("anOrb");
  orb.style.boxShadow = `0 0 ${g}px ${Math.round(g / 3)}px rgba(250,204,21,${(.15 + .55 * p).toFixed(2)})`;
  orb.style.filter = `saturate(${(.5 + .5 * p).toFixed(2)}) brightness(${(.75 + .25 * p).toFixed(2)})`;
  orb.style.setProperty("--haze", haze.toFixed(2));

  document.getElementById("anDots").innerHTML = R.q.map((_, i) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    const cur = i === lit - 1 && !AN.finale && AN.step < N;
    return `<span class="an-dot${i < lit ? " on" : ""}${cur ? " cur" : ""}" style="--x:${Math.round(Math.cos(a) * 112)}px;--y:${Math.round(Math.sin(a) * 112)}px"></span>`;
  }).join("");

  const fxHost = document.getElementById("anFx");
  if (fx === "flash") fxHost.innerHTML = `<span class="an-flash"></span>`;
  else if (fx === "gold") fxHost.innerHTML = `<span class="an-gold" data-fade></span>`;
  document.getElementById("anRays").classList.toggle("on", AN.finale);

  document.getElementById("anChips").innerHTML = ANUSSATI.map((d, i) => {
    const sel = i === AN.rec && !AN.finale;
    return `<button type="button" role="tab" aria-selected="${sel}" data-an="rec:${i}" class="an-chip${AN.done[i] ? " done" : ""}">
      <span class="mk" aria-hidden="true"></span><span>${d.label}</span>${AN.done[i] ? '<span class="sr-only">ระลึกแล้ว</span>' : ""}</button>`;
  }).join("");

  let eb, pali, thai, note = "", next, pos;
  if (AN.finale) {
    eb = "ระลึกครบ ๕ ประการ"; pali = "จิตตัง ปะสีทะติ"; thai = "ใจผ่องใส"; note = "อยู่อุโบสถแบบพระอริยะ · สาธุ"; next = "เริ่มใหม่"; pos = "ครบแล้ว";
  } else if (AN.step === -1) {
    eb = `ข้อที่ ${AN.rec + 1} จาก 5`; pali = R.intro; thai = R.name; note = `แตะเพื่อระลึกทีละคุณ (${N} คุณ)`; next = "เริ่มระลึก"; pos = R.name;
  } else if (AN.step < N) {
    eb = `คุณที่ ${AN.step + 1} จาก ${N}`; [pali, thai] = R.q[AN.step]; next = AN.step + 1 < N ? "คุณถัดไป" : "ระลึกครบข้อนี้"; pos = R.name;
  } else {
    eb = `${R.name} ครบ ${N} คุณ`; pali = "จิตตัง ปะสีทะติ ปาโมชชัง อุปปัชชะติ"; thai = "ใจผ่องใส ความเบิกบานเกิดขึ้น"; note = R.simile;
    next = doneCount < ANUSSATI.length ? "ข้อถัดไป" : "ใจผ่องใส"; pos = `ระลึกแล้ว ${doneCount} จาก 5 ข้อ`;
  }
  document.getElementById("anPos").textContent = pos;
  document.getElementById("anCard").innerHTML = `<span class="eb">${esc(eb)}</span>
    <p class="pl" lang="pi">${esc(pali)}</p><p class="th">${esc(thai)}</p>${note ? `<p class="nt">${esc(note)}</p>` : ""}`;
  document.getElementById("anNextLbl").textContent = next;
  document.querySelector(".an-next").setAttribute("aria-label", next);
  document.getElementById("anPrev").disabled = AN.rec === 0 && AN.step === -1 && !AN.finale;
}

view.addEventListener("click", e => {
  const b = e.target.closest("[data-an]");
  if (!b || !AN) return;
  const [a, v] = b.dataset.an.split(":");
  if (a === "next") anGo(1);
  else if (a === "prev") anGo(-1);
  else if (a === "exit") goBack();
  else if (a === "rec") { Object.assign(AN, { rec: +v, step: -1, finale: false }); paintAn(null); }
});

// ============================================================
//  นำทาง
// ============================================================
let navDepth = 0;   // จำนวนหน้าที่เปิดต่อกันในแอป (ใช้ย้อนกลับ)
window.addEventListener("hashchange", () => navDepth++);
function goBack() {
  if (navDepth > 0) history.back();
  else location.hash = "";
}
backBtn.addEventListener("click", goBack);
gearBtn.addEventListener("click", () => { location.hash = "#/settings"; });

function route() {
  const h = location.hash.replace(/^#\/?/, "");
  if (typeof routeQuick === "function" && routeQuick(h)) return measureTopbar();   // quick.js
  if (typeof routeTopics === "function" && routeTopics(h)) return measureTopbar();   // topics.js
  const m = h.match(/^sutta\/([a-z0-9.]+)(?:\/(\d+(?:\.\d+)*))?$/);
  const c = h.match(/^chant\/([a-z]+)(?:\/(\d+))?$/);
  if (m && typeof SUTTAS !== "undefined" && SUTTAS[m[1]]) renderSutta(m[1], m[2] || null);
  else if (c && SESSIONS.some(s => s.id === c[1])) renderChant(c[1], +(c[2] || 0));
  else if (h === "settings") renderSettings();
  else if (h === "anussati") renderAnussati();
  else if (h && SESSIONS.some(s => s.id === h)) renderSession(h);
  else renderHome();
  measureTopbar();
}
function measureTopbar() {
  const hgt = topbar.classList.contains("hidden") ? 0 : topbar.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--tb-h", hgt + "px");
}
window.addEventListener("hashchange", route);
window.addEventListener("resize", measureTopbar);

apply();
route();

// ============================================================
//  Service worker + อัปเดตอัตโนมัติ
// ============================================================
// GitHub Pages ใส่ Last-Modified เป็นเวลา deploy ล่าสุดให้ทุกไฟล์ ถาม index.html ไฟล์เดียวก็รู้ว่ามีของใหม่ไหม
// เปิดแอป/สลับกลับมาที่แอป: ถ้ามีของใหม่ จำตำแหน่งที่อ่านอยู่ แล้วโหลดใหม่ตรงที่เดิม
const UPD = {
  base: null,
  async stamp() {
    try {
      const r = await fetch("index.html", { method: "HEAD", cache: "no-store" });
      return r.ok ? (r.headers.get("last-modified") || r.headers.get("etag")) : null;
    } catch { return null; }
  },
  async check() {
    const v = await this.stamp();
    if (!v) return;
    if (!this.base) { this.base = v; return; }
    if (v === this.base) return;
    try {
      sessionStorage.setItem("upd-pos", JSON.stringify({ hash: location.hash, y: scrollY }));
    } catch {}
    const reg = await navigator.serviceWorker?.getRegistration().catch(() => null);
    await reg?.update().catch(() => {});
    location.reload();
  },
};

(function restoreAfterUpdate() {
  let pos = null;
  try { pos = JSON.parse(sessionStorage.getItem("upd-pos")); sessionStorage.removeItem("upd-pos"); } catch {}
  if (!pos) return;
  if (pos.hash === location.hash) requestAnimationFrame(() => scrollTo(0, pos.y));
  const t = document.createElement("div");
  t.className = "toast";
  t.setAttribute("role", "status");
  t.textContent = "อัปเดตแอปเป็นรุ่นล่าสุดแล้ว";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
})();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => reg.update()).catch(() => {});
    UPD.check();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") UPD.check();
  });
}

// ---------- ติดตั้งลงมือถือ ----------
// ลิงก์ที่ส่งทาง LINE จะเปิดในเบราว์เซอร์ของ LINE ซึ่งติดตั้งไม่ได้ ส่งต่อไปเบราว์เซอร์หลักของเครื่องให้เลย
if (/Line\//.test(navigator.userAgent) && !/openExternalBrowser/.test(location.search)) {
  const u = new URL(location.href);
  u.searchParams.set("openExternalBrowser", "1");
  location.replace(u.href);
}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installEvt = e;
  if (!location.hash || location.hash === "#/") renderHome();
});
window.addEventListener("appinstalled", () => {
  installEvt = null;
  store.set("installed", "1");
  if (!location.hash || location.hash === "#/") renderHome();
});
