// ============================================================
//  หัวข้อธรรม — อ่านพระสูตร/หัวข้อแบบ Story (ปัดขึ้น/แตะ = ไปต่อ)
//  โหลดก่อน app.js: ใช้ของจาก app.js (view, setChrome, ICON, esc, goBack,
//  cleanupPage, requestWake/releaseWake, wakeLock) ตอนถูกเรียกเท่านั้น
//  เนื้อหาที่ topics/<id>.json · บาลีไทยแปลงด้วย tools/pali2thai.py
//  รูปแบบการ์ด: แปลไทยก่อน → บาลีไทย → สรุปชาวบ้าน (ตาม DESIGN + MOTION)
// ============================================================

const TOPICS = {
  "snp1.8": {
    title: "กรณียเมตตสูตร",
    ref: "Snp 1.8",
    ro: "Mettasutta",
    sub: "ขุททกนิกาย สุตตนิบาต · เมตตาควรเจริญอย่างไร พร้อมอานิสงส์",
  },
};

const TP_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const TP_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const TP_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;

function routeTopics(h) {
  const m = h.match(/^topic\/([a-z0-9.]+)$/);
  if (m && TOPICS[m[1]]) { renderTopic(m[1]); return true; }
  return false;
}

function renderTopic(id) {
  const meta = TOPICS[id];
  setChrome({ title: meta.title, bar: false });
  document.body.classList.add("chant-mode");

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

  // ปัดขึ้น/แตะ = ไปต่อ · ปัดลง = ย้อน · เว้นปุ่มและลิงก์
  let sy = null, sx = null;
  stage.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener("pointerup", e => {
    if (sy == null) return;
    const tx = e.clientX, ty = e.clientY;
    sx = sy = null;
    if (e.target.closest("a, button")) return;
    const dx = tx - sx, dy = ty - sy, adx = Math.abs(dx), ady = Math.abs(dy);
    if (ady > 36 && ady > adx) { dy < 0 ? next() : prev(); }
    else if (adx < 10 && ady < 10) { next(); }
  });

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
    document.body.classList.remove("chant-mode");
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
          <span class="tp-verse-no r">หัวข้อธรรม · สุตตนิบาต</span>
          <span class="tp-cover-ro r d1">${esc(meta.ro)} · ${esc(meta.ref)}</span>
          <h2 class="tp-cover-title r d2">${esc(data.title)}</h2>
          <p class="tp-cover-sub r d3">${esc(meta.sub)}</p>
          <p class="tp-cover-count r d4">ครบ ${total} คาถา · ปัดขึ้นหรือแตะเพื่ออ่าน</p>
        </section>`,
    });
    data.verses.forEach(v => {
      cards.push({
        night: false,
        hint: `คาถา ${v.n} · ปัดขึ้น/แตะ = ไปต่อ · ปัดลง = ย้อน`,
        aria: `คาถาที่ ${v.n} จาก ${total}`,
        html: `<section class="tp-card">
            <span class="tp-verse-no r">คาถา ${v.n} / ${total}</span>
            <p class="tp-thai r d1">${esc(v.thai)}</p>
            <p class="tp-pali r d2" lang="pi">${esc(v.pali)}</p>
            <div class="tp-sum r d3"><span class="lab">สรุปภาษาชาวบ้าน</span>${esc(v.sum)}</div>
            <p class="tp-src r d4">${esc(data.title)} ${esc(meta.ref)}:${v.n}</p>
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
          <p class="tp-cover-sub r d2">อ่านครบ ${total} คาถาแล้ว</p>
          <a class="tp-end-link r d3" href="#/sutta/${esc(id)}">${TP_BOOK}<span>เปิดพระสูตรเต็ม (อ่านคำต่อคำ)</span></a>
        </section>`,
    });
    N = cards.length;
    prog.innerHTML = "";
    cards.forEach(() => { const s = document.createElement("div"); s.className = "tp-seg"; prog.appendChild(s); });
    stage.innerHTML = cards.map(c => c.html).join("");
  }
}
