// ============================================================
//  หัวข้อธรรม — อ่านพระสูตร/หัวข้อ
//  · Story (ปัดขึ้น/แตะ = ไปต่อ): แปลไทยก่อน → บาลีไทย → สรุปชาวบ้าน
//  · Map (วงล้อธัมมจักร): หมุน/แตะซี่ดูมรรค 8 + ฉัพพรรณรังสี
//  โหลดก่อน app.js: ใช้ของจาก app.js (view, setChrome, ICON, esc, goBack,
//  cleanupPage, requestWake/releaseWake, wakeLock) ตอนถูกเรียกเท่านั้น
//  เนื้อหาที่ topics/<id>.json · บาลีไทยแปลงด้วย tools/pali2thai.py
// ============================================================

const TOPICS = {
  "snp1.8": {
    type: "story",
    title: "กรณียเมตตสูตร",
    ref: "Snp 1.8",
    ro: "Mettasutta",
    nikaya: "สุตตนิบาต",
    sub: "ขุททกนิกาย สุตตนิบาต · เมตตาควรเจริญอย่างไร พร้อมอานิสงส์",
  },
  "sn56.11": {
    type: "map",
    mapType: "magga",
    title: "ธัมมจักกัปปวัตตนสูตร",
    ref: "SN 56.11",
    ro: "Dhammacakkappavattana Sutta",
    nikaya: "สังยุตตนิกาย",
    sub: "สังยุตตนิกาย มหาวารวรรค · ปฐมเทศนา หมุนวงล้อพระธรรม",
  },
  "dn22": {
    type: "map",
    mapType: "sati",
    title: "มหาสติปัฏฐานสูตร",
    ref: "DN 22",
    ro: "Mahāsatipaṭṭhāna Sutta",
    nikaya: "ทีฆนิกาย",
    sub: "ทีฆนิกาย มหาวรรค · ทางสายเดียว (เอกายนมรรค) สติปัฏฐาน 4",
  },
  "mn118": {
    type: "map",
    mapType: "anapana",
    title: "อานาปานสติสูตร",
    ref: "MN 118",
    ro: "Ānāpānassati Sutta",
    nikaya: "มัชฌิมนิกาย",
    sub: "มัชฌิมนิกาย · อานาปานสติ 16 ขั้น (4 จตุรกะ) → วิชชาวิมุตติ",
  },
  "mn117": {
    type: "map",
    mapType: "cattarisaka",
    title: "มหาจัตตารีสกสูตร",
    ref: "MN 117",
    ro: "Mahācattārīsaka Sutta",
    nikaya: "มัชฌิมนิกาย",
    sub: "มัชฌิมนิกาย · วิเคราะห์มรรค 8→10 + 2 ระดับ (โลกิย/โลกุตตร)",
  },
  "dn2": {
    type: "map",
    mapType: "sikkha",
    title: "สามัญญผลสูตร",
    ref: "DN 2",
    ro: "Sāmaññaphalasutta",
    nikaya: "ทีฆนิกาย",
    sub: "ทีฆนิกาย สีลขันธวรรค · ไตรสิกขา (ศีล→สมาธิ→ปัญญา) = 3 ปิฎก",
  },
};

const TP_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const TP_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const TP_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;

function routeTopics(h) {
  let m = h.match(/^topic\/([a-z0-9.]+)\/read$/);
  if (m && TOPICS[m[1]]) { renderTopic(m[1]); return true; }
  m = h.match(/^topic\/([a-z0-9.]+)$/);
  if (m && TOPICS[m[1]]) {
    const t = TOPICS[m[1]];
    if (t.type === "map") {
      if (t.mapType === "sati") renderSatipatthana(m[1]);
      else if (t.mapType === "anapana") renderAnapana(m[1]);
      else if (t.mapType === "cattarisaka") renderCattarisaka(m[1]);
      else if (t.mapType === "sikkha") renderSamannaphala(m[1]);
      else renderMap(m[1]);
    } else renderTopic(m[1]);
    return true;
  }
  return false;
}

// ============================================================
//  Story reader (ปัดขึ้น/แตะ = ไปต่อ · ปัดลง = ย้อน)
// ============================================================
function renderTopic(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, bar: false });

  let cur = 0, N = 0;
  const cards = [];   // { html, night, hint }

  view.innerHTML = `<div class="tp" id="tp" role="region" aria-label="${esc(meta.title)}">
      <div class="tp-top">
        <div class="tp-progress" id="tpProg" aria-hidden="true"></div>
        <button type="button" class="tp-exit" id="tpExit" aria-label="ปิด">${ICON.x}</button>
      </div>
      <div class="tp-stage" id="tpStage"></div>
      <div class="tp-hud">
        <button type="button" class="tp-hbtn" id="tpPrev" aria-label="ย้อน">${TP_LEFT}</button>
        <span class="tp-hint" id="tpHint"></span>
        <button type="button" class="tp-hbtn" id="tpNext" aria-label="ถัดไป">${TP_RIGHT}</button>
      </div>
    </div>`;

  const root = document.getElementById("tp");
  const stage = document.getElementById("tpStage");
  const prog = document.getElementById("tpProg");
  const hint = document.getElementById("tpHint");
  const live = document.createElement("div");
  live.setAttribute("aria-live", "polite");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";
  root.appendChild(live);

  const paint = () => {
    stage.querySelectorAll(".tp-card").forEach((c, k) => {
      c.classList.toggle("active", k === cur);
      c.classList.toggle("above", k < cur);
      c.classList.toggle("below", k > cur);
    });
    prog.querySelectorAll(".tp-seg").forEach((s, k) => {
      s.className = "tp-seg" + (k < cur ? " done" : k === cur ? " on" : "");
    });
    root.classList.toggle("dark", cards[cur].night);
    hint.textContent = cards[cur].hint;
    live.textContent = cards[cur].aria;
  };
  const next = () => { if (cur < N - 1) { cur++; paint(); } };
  const prev = () => { if (cur > 0) { cur--; paint(); } };

  // ปัด/แตะ = ไปต่อ · ปัดลง/ปัดขวา = ย้อน · เว้นปุ่มและลิงก์
  let sy = null, sx = null;
  stage.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener("pointerup", e => {
    if (sy == null) return;
    const tx = e.clientX, ty = e.clientY;
    const dx = tx - sx, dy = ty - sy;
    sx = sy = null;
    if (e.target.closest("a, button")) return;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if (adx > 40 || ady > 40) {
      if (ady >= adx) { dy < 0 ? next() : prev(); }
      else { dx < 0 ? next() : prev(); }
    }
    else if (adx < 10 && ady < 10) { next(); }
  });

  // Seekbar: แตะ/ลากบนแถบความคืบหน้าเพื่อข้ามไปการ์ดที่ต้องการ
  const seekTo = e => {
    const r = prog.getBoundingClientRect();
    if (r.width === 0 || N === 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const idx = Math.round(ratio * (N - 1));
    if (idx !== cur) { cur = idx; paint(); }
  };
  let seeking = false;
  prog.addEventListener("pointerdown", e => { seeking = true; try { prog.setPointerCapture(e.pointerId); } catch {} seekTo(e); });
  prog.addEventListener("pointermove", e => { if (seeking) seekTo(e); });
  const stopSeek = () => { seeking = false; };
  prog.addEventListener("pointerup", stopSeek);
  prog.addEventListener("pointercancel", stopSeek);

  document.getElementById("tpExit").onclick = goBack;
  document.getElementById("tpNext").onclick = next;
  document.getElementById("tpPrev").onclick = prev;

  const onKey = e => {
    if (e.key === "Escape") goBack();
    else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };
  const onVis = () => { if (document.visibilityState === "visible" && !wakeLock) requestWake(); };
  addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", onVis);
  try { requestWake(); } catch (e) { /* app.js (requestWake) ยังไม่โหลดในขณะนี้ */ }

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVis);
    releaseWake();
  };

  // โหลดเนื้อหา แล้วสร้างการ์ด (ถ้ายังอยู่หน้าเดิม)
  const here = location.hash;
  fetch(`topics/${id}.json`).then(r => r.json()).then(data => {
    if (location.hash !== here) return;
    build(data);
    paint();
  }).catch(() => {
    if (location.hash === here) hint.textContent = "เปิดหัวข้อนี้ไม่ได้ ลองต่อเน็ตแล้วเปิดอีกครั้ง";
  });

  function build(data) {
    const total = data.verses.length;
    cards.push({
      night: true,
      hint: "แตะหรือปัดขึ้นเพื่ออ่าน",
      aria: `ปก ${data.title}`,
      html: `<section class="tp-card night">
          <span class="tp-verse-no r">หัวข้อธรรม · ${esc(meta.nikaya)}</span>
          <span class="tp-cover-ro r d1">${esc(meta.ro)} · ${esc(meta.ref)}</span>
          <h2 class="tp-cover-title r d2">${esc(data.title)}</h2>
          <p class="tp-cover-sub r d3">${esc(meta.sub)}</p>
          <p class="tp-cover-count r d4">ครบ ${total} ข้อ · ปัดขึ้นหรือแตะเพื่ออ่าน</p>
        </section>`,
    });
    data.verses.forEach(v => {
      cards.push({
        night: false,
        hint: `ข้อ ${v.n} / ${total} · ปัดขึ้น/แตะ = ไปต่อ · ปัดลง = ย้อน`,
        aria: `ข้อที่ ${v.n} จาก ${total}`,
        html: `<section class="tp-card">
            <span class="tp-verse-no r">${esc(data.title)} ${esc(meta.ref)} · ${v.n} / ${total}</span>
            <p class="tp-thai r d1">${esc(v.thai)}</p>
            <p class="tp-pali r d2" lang="pi">${esc(v.pali)}</p>
            <div class="tp-sum r d3"><span class="lab">สรุปภาษาชาวบ้าน</span>${esc(v.sum)}</div>
          </section>`,
      });
    });
    cards.push({
      night: true,
      hint: "จบพระสูตรแล้ว · กด ‹ ย้อน หรือปิดด้านบน",
      aria: `จบ ${data.title}`,
      html: `<section class="tp-card night tp-end">
          <span class="tp-verse-no r">จบพระสูตร</span>
          <h2 class="tp-cover-title r d1" style="font-size:30px">จบ${esc(data.title)}</h2>
          <p class="tp-cover-sub r d2">อ่านครบ ${total} ข้อแล้ว</p>
          <a class="tp-end-link r d3" href="#/topic/${esc(id)}">${TP_BOOK}<span>กลับวงล้อหัวข้อธรรม</span></a>
        </section>`,
    });
    N = cards.length;
    prog.innerHTML = "";
    cards.forEach(() => { const s = document.createElement("div"); s.className = "tp-seg"; prog.appendChild(s); });
    stage.innerHTML = cards.map(c => c.html).join("");
  }
}

// ============================================================
//  แผนที่ธัมมจักร (วงล้อ 8 ซี่ = มรรค 8 · ฉัพพรรณรังสี 6 สี)
// ============================================================
const MAP_MAGGA = [
  {t:"ทิฏฐิ", full:"สัมมาทิฏฐิ", pali:"sammādiṭṭhi", grp:"ปัญญา · องค์ที่ 1", def:"ความเห็นชอบ = ญาณในอริยสัจ 4", ev:"SN 45.8:3.2 · วนกลับที่ราก"},
  {t:"สังกัปปะ", full:"สัมมาสังกัปปะ", pali:"sammāsaṅkappa", grp:"ปัญญา · องค์ที่ 2", def:"ดำริชอบ = เนกขัมมะ อพยาบาท อวิหิงสา", ev:"SN 45.8:4.2"},
  {t:"วาจา", full:"สัมมาวาจา", pali:"sammāvācā", grp:"ศีล · องค์ที่ 3", def:"เจรจาชอบ = เว้นวจีทุจริต 4", ev:"SN 45.8:5.2"},
  {t:"กัมมันตะ", full:"สัมมากัมมันตะ", pali:"sammākammanta", grp:"ศีล · องค์ที่ 4", def:"การงานชอบ = เว้นกายทุจริต 3", ev:"SN 45.8:6.2"},
  {t:"อาชีวะ", full:"สัมมาอาชีวะ", pali:"sammāājīva", grp:"ศีล · องค์ที่ 5", def:"เลี้ยงชีพชอบ = ละมิจฉาชีวะ", ev:"SN 45.8:7.2"},
  {t:"วายามะ", full:"สัมมาวายามะ", pali:"sammāvāyāma", grp:"สมาธิ · องค์ที่ 6", def:"เพียรชอบ = สัมมัปปธาน 4", ev:"SN 45.8:8.2"},
  {t:"สติ", full:"สัมมาสติ", pali:"sammāsati", grp:"สมาธิ · องค์ที่ 7", def:"ระลึกชอบ = สติปัฏฐาน 4", ev:"SN 45.8:9.2"},
  {t:"สมาธิ", full:"สัมมาสมาธิ", pali:"sammāsamādhi", grp:"สมาธิ · องค์ที่ 8", def:"ตั้งมั่นชอบ = ฌาน 4", ev:"SN 45.8:10.2"},
];

const MAP_NODES = {
  dukkha: {tag:"อริยสัจข้อ 1", title:"ทุกข์", pali:"dukkha ariyasacca", desc:"ความเกิด แก่ เจ็บ ตาย ความโศก ความทุกข์ใจ ความคับแค้น กล่าวโดยย่อคือ ความยึดมั่นในเบญจขันธ์ (รูป เวทนา สัญญา สังขาร วิญญาณ)", ev:"SN 56.11:4.2 · MN 44:2.3–2.5", bridge:"แตกไป: ขันธ์ / อายตนะ / ธาตุ"},
  samudaya: {tag:"อริยสัจข้อ 2", title:"สมุทัย", pali:"dukkhasamudaya ariyasacca", desc:"เหตุเกิดทุกข์ คือ ตัณหา 3 — กามตัณหา ภวตัณหา วิภวตัณหา ที่ทำให้เกิดภพใหม่ พร้อมด้วยความกำหนัดเพลิดเพลิน", ev:"SN 56.11:4.4–4.5", bridge:"สืบเนื่อง: ปฏิจจสมุปบาท (SN 12)"},
  nirodha: {tag:"อริยสัจข้อ 3", title:"นิโรธ", pali:"dukkhanirodha ariyasacca", desc:"ความดับตัณหาโดยสิ้นเชิงไม่เหลือ (อเสสวิราคนิโรธ) ความสละ สลัด ปล่อย ไม่ยึดมั่น = นิพพาน", ev:"SN 56.11:4.7 · MN 44:29.12", bridge:""},
  magga: {tag:"อริยสัจข้อ 4", title:"มรรค", pali:"dukkhanirodhagāminī paṭipadā", desc:"ทางปฏิบัติให้ถึงความดับทุกข์ = มัชฌิมาปฏิปทา = อริยอัฏฐังคิกมรรค หลีกเว้นที่สุดโต่งสองทาง", ev:"SN 56.11:4.9", bridge:"มรรค 8 จัดหมวดเป็นไตรสิกขา (MN 44:11)"},
  vinaya: {tag:"ไตรสิกขา · ศีล", title:"วินัยปิฎก", pali:"Vinayapiṭaka · adhisīla", desc:"ศีลสิกขา → ปาติโมกข์สังวร สิกขาบท วิภังค์ ขันธกะ ปรากฏในมหาวรรค (มหาขันธกะ) ที่เล่าปฐมเทศนาคำต่อคำ", ev:"pli-tv-kd1:6.19.1+ · DN 2:42.1", bridge:"เชื่อมแบบมโนทัศน์ผ่าน 'ศีล'"},
  suttanta: {tag:"ไตรสิกขา · สมาธิ", title:"สุตตันตปิฎก", pali:"Suttantapiṭaka · adhicitta", desc:"สมาธิสิกขา → สติปัฏฐาน สัมมัปปธาน ฌาน โพชฌงค์ กระจาย 5 นิกาย", ev:"SN 45.8:8–10 · MN 44:12", bridge:""},
  abhidhamma: {tag:"ไตรสิกขา · ปัญญา", title:"อภิธรรมปิฎก", pali:"Abhidhammapiṭaka · adhipaññā", desc:"ปัญญาสิกขา → ธัมมสังคณี วิภังค์ ปฏฐาน สัจจวิภังค์ (vb4) อธิปัญญา = รู้แจ้งอริยสัจ 4", ev:"AN 3.89:4.2 · vb4:1.1", bridge:"วนกลับที่ราก: อธิปัญญา = อริยสัจ 4"},
};

const MAP_RAYS = [
  ["100","100","100","4","#93C5FD"],
  ["100","100","183","52","#FDE68A"],
  ["100","100","183","148","#FCA5A5"],
  ["100","100","100","196","#FFFFFF"],
  ["100","100","17","148","#FDBA74"],
  ["100","100","17","52","#E9D5FF"],
];

function renderMap(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, back: true, gear: true, bar: true });
  document.body.classList.remove("chant-mode");

  let cur = 0, rot = 0;
  const N = MAP_MAGGA.length;
  const spokeAngle = k => 22.5 + k * 45;

  const rays = MAP_RAYS.map(r =>
    `<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}" stroke="${r[4]}" stroke-width="3" stroke-linecap="round"/>`
  ).join("");

  view.innerHTML = `<div class="dmap">
    <section class="dmap-hero">
      <div class="dmap-kicker">หมุนหรือแตะซี่ · ดูมรรค 8 ทีละองค์</div>
      <div class="dmap-name">${esc(meta.title)}</div>
      <div class="dmap-ref">${esc(meta.ro)} · ${esc(meta.ref)}</div>

      <div class="dmap-wheel" id="dmapWheel">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="dmapGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#FACC15" stop-opacity=".5"/>
              <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
            </radialGradient>
            <filter id="dmapSoftBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
          </defs>
          <g class="dmap-rays" filter="url(#dmapSoftBlur)">${rays}</g>
          <circle class="dmap-glow" cx="100" cy="100" r="62" fill="url(#dmapGoldGlow)"/>
          <g id="dmapRot">
            <circle class="dmap-rim-in" cx="100" cy="100" r="88"/>
            <circle class="dmap-rim" cx="100" cy="100" r="82"/>
            <g id="dmapSpokes"></g>
          </g>
          <circle class="dmap-hub" cx="100" cy="100" r="38"/>
          <text class="dmap-hub-text" x="100" y="102">${esc(meta.ref)}</text>
          <text class="dmap-hub-sub" x="100" y="118">ธัมมจักร</text>
        </svg>
        <div id="dmapLabels"></div>
      </div>

      <div class="dmap-nav">
        <button type="button" id="dmapPrev" aria-label="องค์ก่อนหน้า">‹</button>
        <button type="button" id="dmapNext" aria-label="องค์ถัดไป">›</button>
      </div>

      <div class="dmap-card" aria-live="polite">
        <span class="grp" id="dmapGrp"></span>
        <span class="full" id="dmapFull"></span>
        <span class="pali" id="dmapPali"></span>
        <span class="def" id="dmapDef"></span>
        <span class="ev" id="dmapEv"></span>
      </div>

      <a class="dmap-read" href="#/topic/${esc(id)}/read">${TP_BOOK}<span>อ่านพระสูตรเต็ม · ปัด/แตะ</span></a>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>อริยสัจ 4</h2><span class="pali">cattāri ariyasaccāni</span></div>
      <div class="dmap-truths">
        <button type="button" class="dmap-truth" data-node="dukkha"><span class="no">สัจจะที่ 1</span><span class="t">ทุกข์</span><span class="p">dukkha</span><span class="d">ความยึดมั่นในเบญจขันธ์</span></button>
        <button type="button" class="dmap-truth" data-node="samudaya"><span class="no">สัจจะที่ 2</span><span class="t">สมุทัย</span><span class="p">samudaya</span><span class="d">ตัณหา 3 → ปฏิจจสมุปบาท</span></button>
        <button type="button" class="dmap-truth" data-node="nirodha"><span class="no">สัจจะที่ 3</span><span class="t">นิโรธ</span><span class="p">nirodha</span><span class="d">ความดับตัณหา = นิพพาน</span></button>
        <button type="button" class="dmap-truth" data-node="magga"><span class="no">สัจจะที่ 4</span><span class="t">มรรค</span><span class="p">magga</span><span class="d">อริยมรรคมีองค์ 8</span></button>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>ไตรสิกขา → 3 ปิฎก</h2><span class="pali">tisso sikkhā · MN 44</span></div>
      <div class="dmap-pitaka">
        <button type="button" class="dmap-pitaka-card" data-node="vinaya">
          <span class="ic">${TP_BOOK}</span>
          <span class="meta"><b>ศีล → วินัยปิฎก</b><span>ปาติโมกข์ · สิกขาบท · วิภังค์ · ขันธกะ</span></span>
          <span class="chev">${TP_RIGHT}</span>
        </button>
        <button type="button" class="dmap-pitaka-card" data-node="suttanta">
          <span class="ic">${TP_BOOK}</span>
          <span class="meta"><b>สมาธิ → สุตตันตปิฎก</b><span>สติปัฏฐาน · ฌาน · โพชฌงค์ · 5 นิกาย</span></span>
          <span class="chev">${TP_RIGHT}</span>
        </button>
        <button type="button" class="dmap-pitaka-card" data-node="abhidhamma">
          <span class="ic">${TP_BOOK}</span>
          <span class="meta"><b>ปัญญา → อภิธรรมปิฎก</b><span>ธัมมสังคณี · วิภังค์ · ปฏฐาน · วนกลับอริยสัจ 4</span></span>
          <span class="chev">${TP_RIGHT}</span>
        </button>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>ติปริวัฏฏ์ ทวาทสาการ</h2><span class="pali">tiparivaṭṭa · 3 รอบ 12 อาการ</span></div>
      <div class="dmap-method">
        <div class="no">วิธีของพระสูตร · ปรากฏเพียง 7 ข้อความทั่วทั้งพระไตรปิฎก</div>
        <h3>ทำ 4 กิจ ใน 3 รอบ</h3>
        <div class="flow">
          <span>ปริญญา — รู้ทุกข์</span><span>ปหาน — ละสมุทัย</span><span>สจฉิกิริยา — ทำนิโรธให้แจ้ง</span><span>ภาวนา — เจริญมรรค</span><span class="b">→ ธัมมจักขุ → วิมุตติ</span>
        </div>
      </div>
    </section>
  </div>

  <div class="dmap-scrim" id="dmapScrim"></div>
  <div class="dmap-sheet" id="dmapSheet" role="dialog" aria-modal="true">
    <div class="grab"></div>
    <button type="button" class="close" id="dmapSheetClose" aria-label="ปิด">${ICON.x}</button>
    <span class="tag" id="dmapTag"></span>
    <h3 id="dmapTitle"></h3>
    <div class="pali" id="dmapPali2"></div>
    <p class="desc" id="dmapDesc"></p>
    <div class="ev"><div class="lab">หลักฐานในพระไตรปิฎก</div><div class="cite" id="dmapEv2"></div></div>
    <div class="bridge" id="dmapBridge"></div>
  </div>`;

  // ---- วาดซี่ 8 + ป้าย ----
  const spokesG = document.getElementById("dmapSpokes");
  const labelsBox = document.getElementById("dmapLabels");
  const wheelEl = document.getElementById("dmapWheel");

  let spokesHTML = "";
  for (let k = 0; k < N; k++) {
    const a = spokeAngle(k) * Math.PI / 180;
    const x1 = 100 + 38 * Math.sin(a), y1 = 100 - 38 * Math.cos(a);
    const x2 = 100 + 82 * Math.sin(a), y2 = 100 - 82 * Math.cos(a);
    spokesHTML += `<line class="dmap-spoke" data-k="${k}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  spokesG.innerHTML = spokesHTML;

  labelsBox.innerHTML = MAP_MAGGA.map((m, k) =>
    `<button type="button" class="dmap-label" data-k="${k}" style="left:50%;top:50%;">${esc(m.t)}</button>`
  ).join("");

  const positionLabels = () => {
    const box = wheelEl.getBoundingClientRect();
    const cx = box.width / 2, cy = box.height / 2;
    const r = box.width / 2 * 0.92;
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => {
      const k = +lb.dataset.k;
      const a = (spokeAngle(k) + rot) * Math.PI / 180;
      lb.style.left = (cx + r * Math.sin(a)) + "px";
      lb.style.top = (cy - r * Math.cos(a)) + "px";
    });
  };

  const renderCard = () => {
    const m = MAP_MAGGA[cur];
    document.getElementById("dmapGrp").textContent = m.grp;
    document.getElementById("dmapFull").textContent = m.full;
    document.getElementById("dmapPali").textContent = m.pali;
    document.getElementById("dmapDef").textContent = m.def;
    document.getElementById("dmapEv").textContent = "หลักฐาน: " + m.ev;
  };

  const applyRot = () => {
    document.getElementById("dmapRot").setAttribute("transform", `rotate(${rot} 100 100)`);
    spokesG.querySelectorAll(".dmap-spoke").forEach(s => s.classList.toggle("on", +s.dataset.k === cur));
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.classList.toggle("on", +lb.dataset.k === cur));
    positionLabels();
    renderCard();
  };
  const goTo = k => { cur = ((k % N) + N) % N; rot = -spokeAngle(cur); applyRot(); };

  labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.addEventListener("click", () => goTo(+lb.dataset.k)));
  spokesG.addEventListener("click", e => { const s = e.target.closest(".dmap-spoke"); if (s) goTo(+s.dataset.k); });
  document.getElementById("dmapPrev").addEventListener("click", () => goTo(cur - 1));
  document.getElementById("dmapNext").addEventListener("click", () => goTo(cur + 1));

  // ลากหมุน
  let dragging = false, lastA = 0;
  wheelEl.addEventListener("pointerdown", e => {
    dragging = true;
    const r = wheelEl.getBoundingClientRect();
    lastA = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    wheelEl.setPointerCapture(e.pointerId);
  });
  wheelEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = wheelEl.getBoundingClientRect();
    const a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    rot += (a - lastA) * 180 / Math.PI; lastA = a;
    let best = 0, bd = 1e9;
    for (let k = 0; k < N; k++) {
      let d = Math.abs(spokeAngle(k) + rot); d = Math.min(d, 360 - d);
      if (d < bd) { bd = d; best = k; }
    }
    cur = best;
    applyRot();
  });
  const endDrag = () => { dragging = false; };
  wheelEl.addEventListener("pointerup", endDrag);
  wheelEl.addEventListener("pointercancel", endDrag);

  // ---- bottom sheet (อริยสัจ / ปิฎก) ----
  const sheet = document.getElementById("dmapSheet");
  const scrim = document.getElementById("dmapScrim");
  const openSheet = nodeId => {
    const n = MAP_NODES[nodeId]; if (!n) return;
    document.getElementById("dmapTag").textContent = n.tag;
    document.getElementById("dmapTitle").textContent = n.title;
    document.getElementById("dmapPali2").textContent = n.pali;
    document.getElementById("dmapDesc").textContent = n.desc;
    document.getElementById("dmapEv2").textContent = n.ev;
    document.getElementById("dmapBridge").textContent = n.bridge ? "↳ " + n.bridge : "";
    sheet.classList.add("open"); scrim.classList.add("open");
  };
  const closeSheet = () => { sheet.classList.remove("open"); scrim.classList.remove("open"); };
  view.querySelectorAll("[data-node]").forEach(el => el.addEventListener("click", () => openSheet(el.dataset.node)));
  document.getElementById("dmapSheetClose").addEventListener("click", closeSheet);
  scrim.addEventListener("click", closeSheet);

  const onKey = e => {
    if (e.key === "Escape") { closeSheet(); goBack(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); }
  };
  addEventListener("keydown", onKey);

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
  };

  goTo(0);
  addEventListener("resize", positionLabels);
}

// ============================================================
//  แผนที่มหาสติปัฏฐาน (วงล้อ 4 ซี่ = สติปัฏฐาน 4 · เอกายนมรรค)
// ============================================================
const MAP_SATI = [
  {t:"กาย", full:"กายานุปัสสนา", pali:"kāyānupassanā", grp:"ฐานที่ 1", def:"พิจารณาเห็นกายในกาย — อานาปาน อิริยาบถ ปฏิกูล ธาตุ นวสีวถิกา", ev:"DN 22:2–10"},
  {t:"เวทนา", full:"เวทนานุปัสสนา", pali:"vedanānupassanā", grp:"ฐานที่ 2", def:"พิจารณาเห็นเวทนาในเวทนา — สุข ทุกข์ อทุกขมสุข ทั้งมีอามิสและไม่มีอามิส", ev:"DN 22:11"},
  {t:"จิต", full:"จิตตานุปัสสนา", pali:"cittānupassanā", grp:"ฐานที่ 3", def:"พิจารณาเห็นจิตในจิต — มีราคะ/ไม่มีราคะ เป็นต้น 16 อาการ", ev:"DN 22:12"},
  {t:"ธรรม", full:"ธัมมานุปัสสนา", pali:"dhammānupassanā", grp:"ฐานที่ 4", def:"พิจารณาเห็นธรรมในธรรม — นิวรณ์ 5 ขันธ์ 5 อายตนะ 6 โพชฌงค์ 7 อริยสัจ 4", ev:"DN 22:13–22"},
];

const MAP_SATI_NODES = {
  nivarana: {tag:"ธัมมานุปัสสนา", title:"นิวรณ์ 5", pali:"pañca nīvaraṇāni", desc:"เครื่องกั้นใจ 5: กามฉันทะ พยาบาท ถีนมิทธะ อุทธัจจกุกกุจจะ วิจิกิจฉา รู้เท่าทันว่ามี/ไม่มี เกิดแล้ว/ละได้แล้ว", ev:"DN 22:13", bridge:"→ อภิธรรม (นิวรณ์ 387 ข้อความ)"},
  khandha: {tag:"ธัมมานุปัสสนา", title:"อุปาทานขันธ์ 5", pali:"pañcupādānakkhandhā", desc:"รูป เวทนา สัญญา สังขาร วิญญาณ รู้ว่าขันธ์เป็นอย่างนี้ ความเกิดและความดับเป็นอย่างนี้", ev:"DN 22:14", bridge:"→ อภิธรรม (วิภังค์/ธัมมสังคณี, ขันธ์ 4963 ข้อความ)"},
  ayatana: {tag:"ธัมมานุปัสสนา", title:"อายตนะ 6", pali:"cha āyatanāni", desc:"จักขุ โสตะ ฆานะ ชิวหา กาย มโน + อารมณ์ รู้ชัดอายตนะและสังโยชน์ที่เกิดเพราะอาศัยอายตนะ", ev:"DN 22:15", bridge:"→ อภิธรรม (ธาตุกถา/ยมก, อายตนะ 298 ข้อความ)"},
  bojjhanga: {tag:"ธัมมานุปัสสนา", title:"โพชฌงค์ 7", pali:"satta bojjhaṅgā", desc:"สติ ธัมมวิจยะ วิริยะ ปีติ ปัสสัทธิ สมาธิ อุเบกขา รู้ว่ามี/ไม่มี เกิดแล้ว/เจริญเต็มที่แล้ว", ev:"DN 22:16", bridge:"→ โพธิปักขิยธรรม 37 (DN 16:3.50.5)"},
  sacca: {tag:"ธัมมานุปัสสนา", title:"อริยสัจ 4", pali:"cattāri ariyasaccāni", desc:"รู้ตามเป็นจริงว่า นี้ทุกข์ นี้สมุทัย นี้นิโรธ นี้มรรค — หมวดสัจจะนี้บรรจุธัมมจักกัปปวัตตนสูตรทั้งชุด (264 ข้อความ)", ev:"DN 22:17–22", bridge:"↳ ดูเต็มใน ธัมมจักกัปปวัตตนสูตร (SN 56.11)"},
};

function renderSatipatthana(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, back: true, gear: true, bar: true });
  document.body.classList.remove("chant-mode");

  let cur = 0, rot = 0;
  const N = MAP_SATI.length;           // 4
  const spokeAngle = k => k * 90;      // 4 ซี่ ตามทิศหลัก

  const rays = MAP_RAYS.map(r =>
    `<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}" stroke="${r[4]}" stroke-width="3" stroke-linecap="round"/>`
  ).join("");

  view.innerHTML = `<div class="dmap">
    <section class="dmap-hero">
      <div class="dmap-kicker">หมุนหรือแตะซี่ · สติปัฏฐาน 4</div>
      <div class="dmap-name">${esc(meta.title)}</div>
      <div class="dmap-ref">${esc(meta.ro)} · ${esc(meta.ref)}</div>

      <div class="dmap-wheel" id="dmapWheel">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="dmapGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#FACC15" stop-opacity=".5"/>
              <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
            </radialGradient>
            <filter id="dmapSoftBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
          </defs>
          <g class="dmap-rays" filter="url(#dmapSoftBlur)">${rays}</g>
          <circle class="dmap-glow" cx="100" cy="100" r="62" fill="url(#dmapGoldGlow)"/>
          <g id="dmapRot">
            <circle class="dmap-rim-in" cx="100" cy="100" r="88"/>
            <circle class="dmap-rim" cx="100" cy="100" r="82"/>
            <g id="dmapSpokes"></g>
          </g>
          <circle class="dmap-hub" cx="100" cy="100" r="38"/>
          <text class="dmap-hub-text" x="100" y="102">${esc(meta.ref)}</text>
          <text class="dmap-hub-sub" x="100" y="118">สติปัฏฐาน</text>
        </svg>
        <div id="dmapLabels"></div>
      </div>

      <div class="dmap-nav">
        <button type="button" id="dmapPrev" aria-label="ฐานก่อนหน้า">‹</button>
        <button type="button" id="dmapNext" aria-label="ฐานถัดไป">›</button>
      </div>

      <div class="dmap-card" aria-live="polite">
        <span class="grp" id="dmapGrp"></span>
        <span class="full" id="dmapFull"></span>
        <span class="pali" id="dmapPali"></span>
        <span class="def" id="dmapDef"></span>
        <span class="ev" id="dmapEv"></span>
      </div>

      <a class="dmap-read" href="#/topic/${esc(id)}/read">${TP_BOOK}<span>อ่านพระสูตรเต็ม · ปัด/แตะ</span></a>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>ธัมมานุปัสสนา · 5 หมวดธรรม</h2><span class="pali">dhammānupassanā</span></div>
      <div class="dmap-truths">
        <button type="button" class="dmap-truth" data-node="nivarana"><span class="no">หมวด 1</span><span class="t">นิวรณ์ 5</span><span class="p">nīvaraṇa</span><span class="d">เครื่องกั้นใจ</span></button>
        <button type="button" class="dmap-truth" data-node="khandha"><span class="no">หมวด 2</span><span class="t">อุปาทานขันธ์ 5</span><span class="p">khandha</span><span class="d">รูป เวทนา สัญญา สังขาร วิญญาณ</span></button>
        <button type="button" class="dmap-truth" data-node="ayatana"><span class="no">หมวด 3</span><span class="t">อายตนะ 6</span><span class="p">āyatana</span><span class="d">ตา หู จมูก ลิ้น กาย ใจ</span></button>
        <button type="button" class="dmap-truth" data-node="bojjhanga"><span class="no">หมวด 4</span><span class="t">โพชฌงค์ 7</span><span class="p">bojjhaṅga</span><span class="d">องค์แห่งการตรัสรู้</span></button>
        <button type="button" class="dmap-truth" data-node="sacca"><span class="no">หมวด 5</span><span class="t">อริยสัจ 4</span><span class="p">ariyasacca</span><span class="d">= บรรจุธัมมจักกัปปวัตตนสูตร</span></button>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>เชื่อมกับธัมมจักกัปปวัตตนสูตร</h2><span class="pali">sammāsati = satipaṭṭhāna</span></div>
      <div class="dmap-method">
        <div class="no">สะพานบัญญัติในตัวบาลี (SN 45.8:9.2 · MN 44:12.3)</div>
        <h3>สัมมาสติ (มรรคองค์ 7) = สติปัฏฐาน 4</h3>
        <div class="flow">
          <span>สติปัฏฐาน 4 → สัมมาสติ (องค์ 7)</span>
          <span>สติปัฏฐาน = สมาธินิมิตต์ (MN 44)</span>
          <span class="b">→ มรรค 8 → ไตรสิกขา → 3 ปิฎก</span>
        </div>
        <a class="dmap-read" href="#/topic/sn56.11" style="margin-top:12px;">${TP_BOOK}<span>เปิดวงล้อ ธัมมจักกัปปวัตตนสูตร</span></a>
      </div>
    </section>
  </div>

  <div class="dmap-scrim" id="dmapScrim"></div>
  <div class="dmap-sheet" id="dmapSheet" role="dialog" aria-modal="true">
    <div class="grab"></div>
    <button type="button" class="close" id="dmapSheetClose" aria-label="ปิด">${ICON.x}</button>
    <span class="tag" id="dmapTag"></span>
    <h3 id="dmapTitle"></h3>
    <div class="pali" id="dmapPali2"></div>
    <p class="desc" id="dmapDesc"></p>
    <div class="ev"><div class="lab">หลักฐานในพระไตรปิฎก</div><div class="cite" id="dmapEv2"></div></div>
    <div class="bridge" id="dmapBridge"></div>
  </div>`;

  const spokesG = document.getElementById("dmapSpokes");
  const labelsBox = document.getElementById("dmapLabels");
  const wheelEl = document.getElementById("dmapWheel");

  let spokesHTML = "";
  for (let k = 0; k < N; k++) {
    const a = spokeAngle(k) * Math.PI / 180;
    const x1 = 100 + 38 * Math.sin(a), y1 = 100 - 38 * Math.cos(a);
    const x2 = 100 + 82 * Math.sin(a), y2 = 100 - 82 * Math.cos(a);
    spokesHTML += `<line class="dmap-spoke" data-k="${k}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  spokesG.innerHTML = spokesHTML;

  labelsBox.innerHTML = MAP_SATI.map((m, k) =>
    `<button type="button" class="dmap-label" data-k="${k}" style="left:50%;top:50%;">${esc(m.t)}</button>`
  ).join("");

  const positionLabels = () => {
    const box = wheelEl.getBoundingClientRect();
    const cx = box.width / 2, cy = box.height / 2;
    const r = box.width / 2 * 0.92;
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => {
      const k = +lb.dataset.k;
      const a = (spokeAngle(k) + rot) * Math.PI / 180;
      lb.style.left = (cx + r * Math.sin(a)) + "px";
      lb.style.top = (cy - r * Math.cos(a)) + "px";
    });
  };

  const renderCard = () => {
    const m = MAP_SATI[cur];
    document.getElementById("dmapGrp").textContent = m.grp;
    document.getElementById("dmapFull").textContent = m.full;
    document.getElementById("dmapPali").textContent = m.pali;
    document.getElementById("dmapDef").textContent = m.def;
    document.getElementById("dmapEv").textContent = "หลักฐาน: " + m.ev;
  };

  const applyRot = () => {
    document.getElementById("dmapRot").setAttribute("transform", `rotate(${rot} 100 100)`);
    spokesG.querySelectorAll(".dmap-spoke").forEach(s => s.classList.toggle("on", +s.dataset.k === cur));
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.classList.toggle("on", +lb.dataset.k === cur));
    positionLabels();
    renderCard();
  };
  const goTo = k => { cur = ((k % N) + N) % N; rot = -spokeAngle(cur); applyRot(); };

  labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.addEventListener("click", () => goTo(+lb.dataset.k)));
  spokesG.addEventListener("click", e => { const s = e.target.closest(".dmap-spoke"); if (s) goTo(+s.dataset.k); });
  document.getElementById("dmapPrev").addEventListener("click", () => goTo(cur - 1));
  document.getElementById("dmapNext").addEventListener("click", () => goTo(cur + 1));

  let dragging = false, lastA = 0;
  wheelEl.addEventListener("pointerdown", e => {
    dragging = true;
    const r = wheelEl.getBoundingClientRect();
    lastA = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    wheelEl.setPointerCapture(e.pointerId);
  });
  wheelEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = wheelEl.getBoundingClientRect();
    const a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    rot += (a - lastA) * 180 / Math.PI; lastA = a;
    let best = 0, bd = 1e9;
    for (let k = 0; k < N; k++) {
      let d = Math.abs(spokeAngle(k) + rot); d = Math.min(d, 360 - d);
      if (d < bd) { bd = d; best = k; }
    }
    cur = best;
    applyRot();
  });
  const endDrag = () => { dragging = false; };
  wheelEl.addEventListener("pointerup", endDrag);
  wheelEl.addEventListener("pointercancel", endDrag);

  const sheet = document.getElementById("dmapSheet");
  const scrim = document.getElementById("dmapScrim");
  const openSheet = nodeId => {
    const n = MAP_SATI_NODES[nodeId]; if (!n) return;
    document.getElementById("dmapTag").textContent = n.tag;
    document.getElementById("dmapTitle").textContent = n.title;
    document.getElementById("dmapPali2").textContent = n.pali;
    document.getElementById("dmapDesc").textContent = n.desc;
    document.getElementById("dmapEv2").textContent = n.ev;
    document.getElementById("dmapBridge").textContent = n.bridge ? "↳ " + n.bridge : "";
    sheet.classList.add("open"); scrim.classList.add("open");
  };
  const closeSheet = () => { sheet.classList.remove("open"); scrim.classList.remove("open"); };
  view.querySelectorAll("[data-node]").forEach(el => el.addEventListener("click", () => openSheet(el.dataset.node)));
  document.getElementById("dmapSheetClose").addEventListener("click", closeSheet);
  scrim.addEventListener("click", closeSheet);

  const onKey = e => {
    if (e.key === "Escape") { closeSheet(); goBack(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); }
  };
  addEventListener("keydown", onKey);

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
  };

  goTo(0);
  addEventListener("resize", positionLabels);
}

// ============================================================
//  แผนที่อานาปานสติ (วงล้อ 4 จตุรกะ = 16 ขั้น · น้ำตกสู่วิชชาวิมุตติ)
// ============================================================
const MAP_ANAPANA = [
  {t:"กาย", full:"จตุรกะ 1 · กายานุปัสสนา", pali:"kāyānupassanā", grp:"16 ขั้น · ข้อ 1–4", def:"ลมหายใจยาว/สั้น → รู้ทั่วกาย → ทำกายสังขารให้สงบ", ev:"MN 118:18"},
  {t:"เวทนา", full:"จตุรกะ 2 · เวทนานุปัสสนา", pali:"vedanānupassanā", grp:"16 ขั้น · ข้อ 5–8", def:"รู้ปีติ → รู้สุข → รู้จิตตสังขาร → ทำใจให้สงบ", ev:"MN 118:19"},
  {t:"จิต", full:"จตุรกะ 3 · จิตตานุปัสสนา", pali:"cittānupassanā", grp:"16 ขั้น · ข้อ 9–12", def:"รู้จิต → ยังจิตให้บันเทิง → ตั้งมั่น → เปลื้องปล่อย", ev:"MN 118:20"},
  {t:"ธรรม", full:"จตุรกะ 4 · ธัมมานุปัสสนา", pali:"dhammānupassanā", grp:"16 ขั้น · ข้อ 13–16", def:"เห็นอนิจจะ → วิราคะ → นิโรธ → ปฏินิสสัคคะ", ev:"MN 118:21"},
];

function renderAnapana(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, back: true, gear: true, bar: true });
  document.body.classList.remove("chant-mode");

  let cur = 0, rot = 0;
  const N = MAP_ANAPANA.length;        // 4
  const spokeAngle = k => k * 90;      // 4 จตุรกะ ตามทิศหลัก

  const rays = MAP_RAYS.map(r =>
    `<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}" stroke="${r[4]}" stroke-width="3" stroke-linecap="round"/>`
  ).join("");

  view.innerHTML = `<div class="dmap">
    <section class="dmap-hero">
      <div class="dmap-kicker">หมุนหรือแตะซี่ · 16 ขั้น 4 จตุรกะ</div>
      <div class="dmap-name">${esc(meta.title)}</div>
      <div class="dmap-ref">${esc(meta.ro)} · ${esc(meta.ref)}</div>

      <div class="dmap-wheel" id="dmapWheel">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="dmapGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#FACC15" stop-opacity=".5"/>
              <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
            </radialGradient>
            <filter id="dmapSoftBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
          </defs>
          <g class="dmap-rays" filter="url(#dmapSoftBlur)">${rays}</g>
          <circle class="dmap-glow" cx="100" cy="100" r="62" fill="url(#dmapGoldGlow)"/>
          <g id="dmapRot">
            <circle class="dmap-rim-in" cx="100" cy="100" r="88"/>
            <circle class="dmap-rim" cx="100" cy="100" r="82"/>
            <g id="dmapSpokes"></g>
          </g>
          <circle class="dmap-hub" cx="100" cy="100" r="38"/>
          <text class="dmap-hub-text" x="100" y="102">${esc(meta.ref)}</text>
          <text class="dmap-hub-sub" x="100" y="118">อานาปานสติ</text>
        </svg>
        <div id="dmapLabels"></div>
      </div>

      <div class="dmap-nav">
        <button type="button" id="dmapPrev" aria-label="จตุรกะก่อนหน้า">‹</button>
        <button type="button" id="dmapNext" aria-label="จตุรกะถัดไป">›</button>
      </div>

      <div class="dmap-card" aria-live="polite">
        <span class="grp" id="dmapGrp"></span>
        <span class="full" id="dmapFull"></span>
        <span class="pali" id="dmapPali"></span>
        <span class="def" id="dmapDef"></span>
        <span class="ev" id="dmapEv"></span>
      </div>

      <a class="dmap-read" href="#/topic/${esc(id)}/read">${TP_BOOK}<span>อ่านพระสูตรเต็ม · ปัด/แตะ</span></a>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>น้ำตกแห่งการปฏิบัติ</h2><span class="pali">paripūreti · MN 118:15</span></div>
      <div class="dmap-method">
        <div class="no">ลำดับที่ตัวบาลีระบุ: แต่ละขั้นทำให้ขั้นถัดไปบริบูรณ์</div>
        <div class="dmap-cascade">
          <div class="step">อานาปานสติ 16 ขั้น<span>ānāpānassati</span></div>
          <div class="arr">↓ ปริปูเรติ (ทำให้บริบูรณ์)</div>
          <div class="step">สติปัฏฐาน 4<span>satipaṭṭhāna</span></div>
          <div class="arr">↓ ปริปูเรนติ</div>
          <div class="step">โพชฌงค์ 7<span>bojjhaṅga</span></div>
          <div class="arr">↓ ปริปูเรนติ</div>
          <div class="step gold">วิชชาวิมุตติ<span>vijjāvimutti · ปลายทาง</span></div>
        </div>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>เชื่อมกับมหาสติปัฏฐานสูตร</h2><span class="pali">ānāpāna = กายานุปัสสนา</span></div>
      <div class="dmap-method">
        <div class="no">อานาปานสติเป็นกรรมฐานข้อแรกของกายานุปัสสนา (DN 22:2)</div>
        <h3>ลมหายใจ = เครื่องมือเจริญสติปัฏฐาน 4</h3>
        <div class="flow">
          <span>จตุรกะ 1 → กายานุปัสสนา</span>
          <span>จตุรกะ 2 → เวทนานุปัสสนา</span>
          <span>จตุรกะ 3 → จิตตานุปัสสนา</span>
          <span>จตุรกะ 4 → ธัมมานุปัสสนา</span>
        </div>
        <a class="dmap-read" href="#/topic/dn22" style="margin-top:12px;">${TP_BOOK}<span>เปิดวงล้อ มหาสติปัฏฐานสูตร</span></a>
      </div>
    </section>
  </div>

  <div class="dmap-scrim" id="dmapScrim"></div>`;

  const spokesG = document.getElementById("dmapSpokes");
  const labelsBox = document.getElementById("dmapLabels");
  const wheelEl = document.getElementById("dmapWheel");

  let spokesHTML = "";
  for (let k = 0; k < N; k++) {
    const a = spokeAngle(k) * Math.PI / 180;
    const x1 = 100 + 38 * Math.sin(a), y1 = 100 - 38 * Math.cos(a);
    const x2 = 100 + 82 * Math.sin(a), y2 = 100 - 82 * Math.cos(a);
    spokesHTML += `<line class="dmap-spoke" data-k="${k}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  spokesG.innerHTML = spokesHTML;

  labelsBox.innerHTML = MAP_ANAPANA.map((m, k) =>
    `<button type="button" class="dmap-label" data-k="${k}" style="left:50%;top:50%;">${esc(m.t)}</button>`
  ).join("");

  const positionLabels = () => {
    const box = wheelEl.getBoundingClientRect();
    const cx = box.width / 2, cy = box.height / 2;
    const r = box.width / 2 * 0.92;
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => {
      const k = +lb.dataset.k;
      const a = (spokeAngle(k) + rot) * Math.PI / 180;
      lb.style.left = (cx + r * Math.sin(a)) + "px";
      lb.style.top = (cy - r * Math.cos(a)) + "px";
    });
  };

  const renderCard = () => {
    const m = MAP_ANAPANA[cur];
    document.getElementById("dmapGrp").textContent = m.grp;
    document.getElementById("dmapFull").textContent = m.full;
    document.getElementById("dmapPali").textContent = m.pali;
    document.getElementById("dmapDef").textContent = m.def;
    document.getElementById("dmapEv").textContent = "หลักฐาน: " + m.ev;
  };

  const applyRot = () => {
    document.getElementById("dmapRot").setAttribute("transform", `rotate(${rot} 100 100)`);
    spokesG.querySelectorAll(".dmap-spoke").forEach(s => s.classList.toggle("on", +s.dataset.k === cur));
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.classList.toggle("on", +lb.dataset.k === cur));
    positionLabels();
    renderCard();
  };
  const goTo = k => { cur = ((k % N) + N) % N; rot = -spokeAngle(cur); applyRot(); };

  labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.addEventListener("click", () => goTo(+lb.dataset.k)));
  spokesG.addEventListener("click", e => { const s = e.target.closest(".dmap-spoke"); if (s) goTo(+s.dataset.k); });
  document.getElementById("dmapPrev").addEventListener("click", () => goTo(cur - 1));
  document.getElementById("dmapNext").addEventListener("click", () => goTo(cur + 1));

  let dragging = false, lastA = 0;
  wheelEl.addEventListener("pointerdown", e => {
    dragging = true;
    const r = wheelEl.getBoundingClientRect();
    lastA = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    wheelEl.setPointerCapture(e.pointerId);
  });
  wheelEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = wheelEl.getBoundingClientRect();
    const a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    rot += (a - lastA) * 180 / Math.PI; lastA = a;
    let best = 0, bd = 1e9;
    for (let k = 0; k < N; k++) {
      let d = Math.abs(spokeAngle(k) + rot); d = Math.min(d, 360 - d);
      if (d < bd) { bd = d; best = k; }
    }
    cur = best;
    applyRot();
  });
  const endDrag = () => { dragging = false; };
  wheelEl.addEventListener("pointerup", endDrag);
  wheelEl.addEventListener("pointercancel", endDrag);

  const onKey = e => {
    if (e.key === "Escape") goBack();
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); }
  };
  addEventListener("keydown", onKey);

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
  };

  goTo(0);
  addEventListener("resize", positionLabels);
}

// ============================================================
//  แผนที่มหาจัตตารีสก (วงล้อ 8 ซี่ = มรรค 8 · 2 ระดับ · 8→10)
// ============================================================
const MAP_CATTARISAKA = [
  {t:"ทิฏฐิ", full:"สัมมาทิฏฐิ", pali:"sammādiṭṭhi", grp:"องค์ 1 · ปุพพังคมา (ผู้นำ)", def:"ความเห็นถูก = รู้มิจฉา/สัมมา · 2 ระดับ: โลกิย (สาสว) ↔ โลกุตตร (อนาสว)", ev:"MN 117:4–8"},
  {t:"สังกัปปะ", full:"สัมมาสังกัปปะ", pali:"sammāsaṅkappa", grp:"องค์ 2", def:"ดำริชอบ = เนกขัมมะ อพยาบาท อวิหิงสา", ev:"MN 117:9–12"},
  {t:"วาจา", full:"สัมมาวาจา", pali:"sammāvācā", grp:"องค์ 3", def:"เจรจาชอบ = เว้นวจีทุจริต 4", ev:"MN 117:13–15"},
  {t:"กัมมันตะ", full:"สัมมากัมมันตะ", pali:"sammākammanta", grp:"องค์ 4", def:"การงานชอบ = เว้นกายทุจริต 3", ev:"MN 117:16–18"},
  {t:"อาชีวะ", full:"สัมมาอาชีวะ", pali:"sammāājīva", grp:"องค์ 5", def:"เลี้ยงชีพชอบ = ละมิจฉาชีวะ", ev:"MN 117:19–21"},
  {t:"วายามะ", full:"สัมมาวายามะ", pali:"sammāvāyāma", grp:"องค์ 6", def:"เพียรชอบ = สัมมัปปธาน 4", ev:"MN 117:22–24"},
  {t:"สติ", full:"สัมมาสติ", pali:"sammāsati", grp:"องค์ 7", def:"ระลึกชอบ = สติปัฏฐาน 4", ev:"MN 117:25–27"},
  {t:"สมาธิ", full:"สัมมาสมาธิ", pali:"sammāsamādhi", grp:"องค์ 8 · แก่นของสูตร", def:"ตั้งมั่นชอบ = องค์ 7 + เอกัคคตา (สอุปนิส สปริกขาร)", ev:"MN 117:28–34"},
];

function renderCattarisaka(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, back: true, gear: true, bar: true });
  document.body.classList.remove("chant-mode");

  let cur = 0, rot = 0;
  const N = MAP_CATTARISAKA.length;    // 8
  const spokeAngle = k => 22.5 + k * 45;

  const rays = MAP_RAYS.map(r =>
    `<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}" stroke="${r[4]}" stroke-width="3" stroke-linecap="round"/>`
  ).join("");

  view.innerHTML = `<div class="dmap">
    <section class="dmap-hero">
      <div class="dmap-kicker">หมุนหรือแตะซี่ · มรรค 8 วิเคราะห์ 2 ระดับ</div>
      <div class="dmap-name">${esc(meta.title)}</div>
      <div class="dmap-ref">${esc(meta.ro)} · ${esc(meta.ref)}</div>

      <div class="dmap-wheel" id="dmapWheel">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="dmapGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#FACC15" stop-opacity=".5"/>
              <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
            </radialGradient>
            <filter id="dmapSoftBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
          </defs>
          <g class="dmap-rays" filter="url(#dmapSoftBlur)">${rays}</g>
          <circle class="dmap-glow" cx="100" cy="100" r="62" fill="url(#dmapGoldGlow)"/>
          <g id="dmapRot">
            <circle class="dmap-rim-in" cx="100" cy="100" r="88"/>
            <circle class="dmap-rim" cx="100" cy="100" r="82"/>
            <g id="dmapSpokes"></g>
          </g>
          <circle class="dmap-hub" cx="100" cy="100" r="38"/>
          <text class="dmap-hub-text" x="100" y="102">${esc(meta.ref)}</text>
          <text class="dmap-hub-sub" x="100" y="118">มหาจัตตารีสก</text>
        </svg>
        <div id="dmapLabels"></div>
      </div>

      <div class="dmap-nav">
        <button type="button" id="dmapPrev" aria-label="องค์ก่อนหน้า">‹</button>
        <button type="button" id="dmapNext" aria-label="องค์ถัดไป">›</button>
      </div>

      <div class="dmap-card" aria-live="polite">
        <span class="grp" id="dmapGrp"></span>
        <span class="full" id="dmapFull"></span>
        <span class="pali" id="dmapPali"></span>
        <span class="def" id="dmapDef"></span>
        <span class="ev" id="dmapEv"></span>
      </div>

      <a class="dmap-read" href="#/topic/${esc(id)}/read">${TP_BOOK}<span>อ่านพระสูตรเต็ม · ปัด/แตะ</span></a>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>2 ระดับของมรรค (ทฺวายํ)</h2><span class="pali">dvāyaṁ · MN 117:6</span></div>
      <div class="dmap-method">
        <div class="no">วิธีจำแนกเดียวกับอภิธรรม (โลกียทุกะ/สาสวทุกะ/อนาสวทุกะ)</div>
        <div class="flow">
          <span>โลกิยะ = สาสว / ปุญญภาคิย / อุปธิเวปกก</span>
          <span class="b">โลกุตตระ = อนาสว / อริยะ / มัคคังคะ</span>
        </div>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>มรรค 8 → 10</h2><span class="pali">aṭṭhaṅga → dasaṅga · MN 117:34</span></div>
      <div class="dmap-method">
        <div class="no">เพิ่ม 2 องค์ปลายทางของสุตตันตะ</div>
        <h3>องค์ 8 = เสขะ · องค์ 10 = อรหันต์</h3>
        <div class="flow">
          <span>1–8: ทิฏฐิ → สมาธิ</span>
          <span>9: สัมมาญาณ</span>
          <span>10: สัมมาวิมุตติ</span>
          <span class="b">มหาจัตตารีสก = 20 กุศล + 20 อกุศล</span>
        </div>
        <a class="dmap-read" href="#/topic/sn56.11" style="margin-top:12px;">${TP_BOOK}<span>สัมมาทิฏฐิ = ญาณในอริยสัจ 4 → ธัมมจักกัปปวัตตนสูตร</span></a>
      </div>
    </section>
  </div>

  <div class="dmap-scrim" id="dmapScrim"></div>`;

  const spokesG = document.getElementById("dmapSpokes");
  const labelsBox = document.getElementById("dmapLabels");
  const wheelEl = document.getElementById("dmapWheel");

  let spokesHTML = "";
  for (let k = 0; k < N; k++) {
    const a = spokeAngle(k) * Math.PI / 180;
    const x1 = 100 + 38 * Math.sin(a), y1 = 100 - 38 * Math.cos(a);
    const x2 = 100 + 82 * Math.sin(a), y2 = 100 - 82 * Math.cos(a);
    spokesHTML += `<line class="dmap-spoke" data-k="${k}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  spokesG.innerHTML = spokesHTML;

  labelsBox.innerHTML = MAP_CATTARISAKA.map((m, k) =>
    `<button type="button" class="dmap-label" data-k="${k}" style="left:50%;top:50%;">${esc(m.t)}</button>`
  ).join("");

  const positionLabels = () => {
    const box = wheelEl.getBoundingClientRect();
    const cx = box.width / 2, cy = box.height / 2;
    const r = box.width / 2 * 0.92;
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => {
      const k = +lb.dataset.k;
      const a = (spokeAngle(k) + rot) * Math.PI / 180;
      lb.style.left = (cx + r * Math.sin(a)) + "px";
      lb.style.top = (cy - r * Math.cos(a)) + "px";
    });
  };

  const renderCard = () => {
    const m = MAP_CATTARISAKA[cur];
    document.getElementById("dmapGrp").textContent = m.grp;
    document.getElementById("dmapFull").textContent = m.full;
    document.getElementById("dmapPali").textContent = m.pali;
    document.getElementById("dmapDef").textContent = m.def;
    document.getElementById("dmapEv").textContent = "หลักฐาน: " + m.ev;
  };

  const applyRot = () => {
    document.getElementById("dmapRot").setAttribute("transform", `rotate(${rot} 100 100)`);
    spokesG.querySelectorAll(".dmap-spoke").forEach(s => s.classList.toggle("on", +s.dataset.k === cur));
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.classList.toggle("on", +lb.dataset.k === cur));
    positionLabels();
    renderCard();
  };
  const goTo = k => { cur = ((k % N) + N) % N; rot = -spokeAngle(cur); applyRot(); };

  labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.addEventListener("click", () => goTo(+lb.dataset.k)));
  spokesG.addEventListener("click", e => { const s = e.target.closest(".dmap-spoke"); if (s) goTo(+s.dataset.k); });
  document.getElementById("dmapPrev").addEventListener("click", () => goTo(cur - 1));
  document.getElementById("dmapNext").addEventListener("click", () => goTo(cur + 1));

  let dragging = false, lastA = 0;
  wheelEl.addEventListener("pointerdown", e => {
    dragging = true;
    const r = wheelEl.getBoundingClientRect();
    lastA = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    wheelEl.setPointerCapture(e.pointerId);
  });
  wheelEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = wheelEl.getBoundingClientRect();
    const a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    rot += (a - lastA) * 180 / Math.PI; lastA = a;
    let best = 0, bd = 1e9;
    for (let k = 0; k < N; k++) {
      let d = Math.abs(spokeAngle(k) + rot); d = Math.min(d, 360 - d);
      if (d < bd) { bd = d; best = k; }
    }
    cur = best;
    applyRot();
  });
  const endDrag = () => { dragging = false; };
  wheelEl.addEventListener("pointerup", endDrag);
  wheelEl.addEventListener("pointercancel", endDrag);

  const onKey = e => {
    if (e.key === "Escape") goBack();
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); }
  };
  addEventListener("keydown", onKey);

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
  };

  goTo(0);
  addEventListener("resize", positionLabels);
}

// ============================================================
//  แผนที่สามัญญผล (วงล้อ 3 ซี่ = ไตรสิกขา · 3 ปิฎกเป็น 3 ขั้น)
// ============================================================
const MAP_SIKKHA = [
  {t:"ศีล", full:"อธิสีลสิกขา", pali:"adhisīlasikkhā", grp:"ขั้นที่ 1", def:"ปาติโมกขสังวร → จูฬ/มัชฌิม/มหาศีล", ev:"DN 2:42–64", pitaka:"วินัยปิฎก"},
  {t:"สมาธิ", full:"อธิจิตตสิกขา", pali:"adhicittasikkhā", grp:"ขั้นที่ 2", def:"อินทรียสังวร → ละนิวรณ์ 5 → ฌาน 4", ev:"DN 2:64–84", pitaka:"สุตตันตปิฎก"},
  {t:"ปัญญา", full:"อธิปัญญาสิกขา", pali:"adhipaññāsikkhā", grp:"ขั้นที่ 3", def:"ญาณทัสสนะ → อภิญญา 7 → อาสวักขยญาณ", ev:"DN 2:83–98", pitaka:"อภิธรรมปิฎก"},
];

function renderSamannaphala(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, back: true, gear: true, bar: true });
  document.body.classList.remove("chant-mode");

  let cur = 0, rot = 0;
  const N = MAP_SIKKHA.length;          // 3
  const spokeAngle = k => k * 120;      // 3 ซี่

  const rays = MAP_RAYS.map(r =>
    `<line x1="${r[0]}" y1="${r[1]}" x2="${r[2]}" y2="${r[3]}" stroke="${r[4]}" stroke-width="3" stroke-linecap="round"/>`
  ).join("");

  view.innerHTML = `<div class="dmap">
    <section class="dmap-hero">
      <div class="dmap-kicker">หมุนหรือแตะซี่ · ไตรสิกขา 3 ขั้น</div>
      <div class="dmap-name">${esc(meta.title)}</div>
      <div class="dmap-ref">${esc(meta.ro)} · ${esc(meta.ref)}</div>

      <div class="dmap-wheel" id="dmapWheel">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="dmapGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#FACC15" stop-opacity=".5"/>
              <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
            </radialGradient>
            <filter id="dmapSoftBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>
          </defs>
          <g class="dmap-rays" filter="url(#dmapSoftBlur)">${rays}</g>
          <circle class="dmap-glow" cx="100" cy="100" r="62" fill="url(#dmapGoldGlow)"/>
          <g id="dmapRot">
            <circle class="dmap-rim-in" cx="100" cy="100" r="88"/>
            <circle class="dmap-rim" cx="100" cy="100" r="82"/>
            <g id="dmapSpokes"></g>
          </g>
          <circle class="dmap-hub" cx="100" cy="100" r="38"/>
          <text class="dmap-hub-text" x="100" y="102">${esc(meta.ref)}</text>
          <text class="dmap-hub-sub" x="100" y="118">ไตรสิกขา</text>
        </svg>
        <div id="dmapLabels"></div>
      </div>

      <div class="dmap-nav">
        <button type="button" id="dmapPrev" aria-label="ขั้นก่อนหน้า">‹</button>
        <button type="button" id="dmapNext" aria-label="ขั้นถัดไป">›</button>
      </div>

      <div class="dmap-card" aria-live="polite">
        <span class="grp" id="dmapGrp"></span>
        <span class="full" id="dmapFull"></span>
        <span class="pali" id="dmapPali"></span>
        <span class="def" id="dmapDef"></span>
        <span class="ev" id="dmapEv"></span>
      </div>

      <a class="dmap-read" href="#/topic/${esc(id)}/read">${TP_BOOK}<span>อ่านพระสูตรเต็ม · ปัด/แตะ</span></a>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>3 ปิฎก = 3 ขั้นของมรรคเดียว</h2><span class="pali">tisso sikkhā · MN 44</span></div>
      <div class="dmap-method">
        <div class="no">สะพานที่ตัวบาลีบัญญัติ (mn44:11.3–11.5 · an3.89:1.3)</div>
        <div class="dmap-cascade">
          <div class="step">1) ศีล → วินัยปิฎก<span>ปาติโมกข์ 364 · สิกขาบท 555</span></div>
          <div class="arr">↓ อนุปุพพิกถา (ตามลำดับ)</div>
          <div class="step">2) สมาธิ → สุตตันตปิฎก<span>ฌาน 4 · สติปัฏฐาน</span></div>
          <div class="arr">↓ อนุปุพพิกถา</div>
          <div class="step gold">3) ปัญญา → อภิธรรมปิฎก<span>ญาณ 7 · อาสวักขยญาณ = สามัญญผล</span></div>
        </div>
      </div>
    </section>

    <section class="dmap-sec">
      <div class="dmap-sec-head"><h2>สองรากเอกของแผนที่</h2><span class="pali">WHAT + PATH</span></div>
      <div class="dmap-method">
        <div class="no">แกนธรรม (SN 56.11) + แกนปฏิบัติ (DN 2) บรรจบกันที่ 'มรรค'</div>
        <h3>อริยสัจข้อ 4 = ไตรสิกขา = มรรค</h3>
        <div class="flow">
          <span>SN 56.11 = ธรรมะคืออะไร (WHAT)</span>
          <span class="b">DN 2 = ปฏิบัติอย่างไรเป็นลำดับ (PATH)</span>
        </div>
        <a class="dmap-read" href="#/topic/sn56.11" style="margin-top:12px;">${TP_BOOK}<span>เปิดวงล้อ ธัมมจักกัปปวัตตนสูตร</span></a>
      </div>
    </section>
  </div>

  <div class="dmap-scrim" id="dmapScrim"></div>`;

  const spokesG = document.getElementById("dmapSpokes");
  const labelsBox = document.getElementById("dmapLabels");
  const wheelEl = document.getElementById("dmapWheel");

  let spokesHTML = "";
  for (let k = 0; k < N; k++) {
    const a = spokeAngle(k) * Math.PI / 180;
    const x1 = 100 + 38 * Math.sin(a), y1 = 100 - 38 * Math.cos(a);
    const x2 = 100 + 82 * Math.sin(a), y2 = 100 - 82 * Math.cos(a);
    spokesHTML += `<line class="dmap-spoke" data-k="${k}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  spokesG.innerHTML = spokesHTML;

  labelsBox.innerHTML = MAP_SIKKHA.map((m, k) =>
    `<button type="button" class="dmap-label" data-k="${k}" style="left:50%;top:50%;">${esc(m.t)}</button>`
  ).join("");

  const positionLabels = () => {
    const box = wheelEl.getBoundingClientRect();
    const cx = box.width / 2, cy = box.height / 2;
    const r = box.width / 2 * 0.92;
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => {
      const k = +lb.dataset.k;
      const a = (spokeAngle(k) + rot) * Math.PI / 180;
      lb.style.left = (cx + r * Math.sin(a)) + "px";
      lb.style.top = (cy - r * Math.cos(a)) + "px";
    });
  };

  const renderCard = () => {
    const m = MAP_SIKKHA[cur];
    document.getElementById("dmapGrp").textContent = m.grp;
    document.getElementById("dmapFull").textContent = m.full;
    document.getElementById("dmapPali").textContent = m.pali + " · " + m.pitaka;
    document.getElementById("dmapDef").textContent = m.def;
    document.getElementById("dmapEv").textContent = "หลักฐาน: " + m.ev;
  };

  const applyRot = () => {
    document.getElementById("dmapRot").setAttribute("transform", `rotate(${rot} 100 100)`);
    spokesG.querySelectorAll(".dmap-spoke").forEach(s => s.classList.toggle("on", +s.dataset.k === cur));
    labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.classList.toggle("on", +lb.dataset.k === cur));
    positionLabels();
    renderCard();
  };
  const goTo = k => { cur = ((k % N) + N) % N; rot = -spokeAngle(cur); applyRot(); };

  labelsBox.querySelectorAll(".dmap-label").forEach(lb => lb.addEventListener("click", () => goTo(+lb.dataset.k)));
  spokesG.addEventListener("click", e => { const s = e.target.closest(".dmap-spoke"); if (s) goTo(+s.dataset.k); });
  document.getElementById("dmapPrev").addEventListener("click", () => goTo(cur - 1));
  document.getElementById("dmapNext").addEventListener("click", () => goTo(cur + 1));

  let dragging = false, lastA = 0;
  wheelEl.addEventListener("pointerdown", e => {
    dragging = true;
    const r = wheelEl.getBoundingClientRect();
    lastA = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    wheelEl.setPointerCapture(e.pointerId);
  });
  wheelEl.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = wheelEl.getBoundingClientRect();
    const a = Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
    rot += (a - lastA) * 180 / Math.PI; lastA = a;
    let best = 0, bd = 1e9;
    for (let k = 0; k < N; k++) {
      let d = Math.abs(spokeAngle(k) + rot); d = Math.min(d, 360 - d);
      if (d < bd) { bd = d; best = k; }
    }
    cur = best;
    applyRot();
  });
  const endDrag = () => { dragging = false; };
  wheelEl.addEventListener("pointerup", endDrag);
  wheelEl.addEventListener("pointercancel", endDrag);

  const onKey = e => {
    if (e.key === "Escape") goBack();
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(cur - 1); }
  };
  addEventListener("keydown", onKey);

  cleanupPage = () => {
    removeEventListener("keydown", onKey);
  };

  goTo(0);
  addEventListener("resize", positionLabels);
}
