// ============================================================
//  ฝึกสักครู่ — ฝึกชั่วขณะตามพระสูตร (#/quick, #/breath, #/breath/learn, #/metta, #/bahira)
//  โหลดก่อน app.js: ฟังก์ชันในไฟล์นี้ใช้ของจาก app.js (view, setChrome, ICON, esc, store,
//  requestWake/releaseWake, cleanupPage, goBack) ตอนถูกเรียกเท่านั้น ไม่ใช้ตอนโหลดไฟล์
//  คำแปลไทยของบาลีในไฟล์นี้แปลจากบาลีโดย AI (บอกผู้ใช้ไว้ในหน้าจอ) ตรวจกับ tripitaka-mcp แล้ว
// ============================================================

const QP_ITEMS = {
  breath: { glyph: "๑", name: "ชั่วลมหายใจเดียว", desc: "มรณสติ: ระลึกว่าชีวิตอาจมีเพียงลมหายใจนี้", ref: "AN 6.19", href: "#/breath" },
  bahira: { glyph: "๖", name: "พิจารณาพาหิรทุกขสูตร", desc: "สิ่งที่ปรากฏตรงหน้า: นั่นไม่ใช่ของเรา", ref: "SN 35.5", href: "#/bahira" },
  metta: { glyph: "๔", name: "เมตตาแผ่ ๔ ทิศ", desc: "แตะทีละทิศ แล้วแผ่ไปทั่วทุกแห่ง", ref: "AN 1.53 · AN 10.219", href: "#/metta" },
  anussati: { glyph: "๕", name: "ระลึก ๕ ประการ · ใจผ่องใส", desc: "พุทธ ธรรม สงฆ์ ศีล เทวดา ทีละคุณ", ref: "AN 3.70", href: "#/anussati" },
};
const QP_TIMES = [
  { id: "breath", name: "1 ลมหายใจ", sub: "ไม่กี่วินาที", items: ["breath"] },
  { id: "min", name: "1 นาที", sub: "รอไฟแดง", items: ["bahira", "metta", "breath"] },
  { id: "five", name: "5 นาที", sub: "รอรถ", items: ["bahira", "anussati", "metta"] },
];
let qpTime = "breath";
const TPM = id => `https://tripitaka-mcp.com/read/${id}`;
const qpRef = (url, label) => `<a class="qp-ref" href="${url}" target="_blank" rel="noopener">${ICON.book}<span>${esc(label)}</span></a>`;
const AI_NOTE = `<p class="qp-ai">คำแปลไทยแปลจากบาลีโดย AI ควรตรวจกับต้นฉบับ</p>`;
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- หน้าเลือก ----------
function renderQuick() {
  setChrome({ title: "ฝึกสักครู่" });
  const t = QP_TIMES.find(x => x.id === qpTime) || QP_TIMES[0];
  const tabs = QP_TIMES.map(x => `<button type="button" role="radio" aria-checked="${x.id === t.id}" data-qp-time="${x.id}">
      <span class="t">${esc(x.name)}</span><span class="s">${esc(x.sub)}</span></button>`).join("");
  const rows = t.items.map(k => {
    const it = QP_ITEMS[k];
    return `<a class="row-card qp-row" href="${it.href}">
      <span class="qp-glyph" aria-hidden="true">${it.glyph}</span>
      <span class="meta"><b>${esc(it.name)}</b><span>${esc(it.desc)}</span><span class="qp-tag">${esc(it.ref)}</span></span>
      <span class="chev">${ICON.chev}</span></a>`;
  }).join("");
  view.innerHTML = `<section class="qp-page">
      <p class="qp-lead">พระสูตรสอนว่า ฝึกแม้ชั่วลมหายใจเดียว ชั่วดีดนิ้ว ก็ไม่เปล่าประโยชน์</p>
      <div class="seg-ctl qp-times" role="radiogroup" aria-label="มีเวลาเท่าไร">${tabs}</div>
      <nav class="list" aria-label="การฝึก">${rows}</nav>
      <p class="qp-tip">ระหว่างฝึก ข้อความจะจางลงเอง ให้ตาและใจกลับมาอยู่กับลมหายใจ ไม่ใช่กับจอ</p>
    </section>`;
  view.querySelectorAll("[data-qp-time]").forEach(b => b.onclick = () => { qpTime = b.dataset.qpTime; renderQuick(); view.querySelector(`[data-qp-time="${qpTime}"]`)?.focus(); });
}

// ---------- โครงหน้าฝึกเต็มจอ (พื้น --night) ----------
function qpShell(title, { learnHref = "", body = "" } = {}) {
  return `<div class="qp" id="qp">
    <header class="qp-head">
      <button type="button" class="iconbtn" data-qp="exit" aria-label="ออก">${ICON.x}</button>
      <h1>${esc(title)}</h1>
      ${learnHref ? `<a class="iconbtn" href="${learnHref}" aria-label="ทวนคำสอน" title="ทวนคำสอน">${ICON.book}</a>` : `<span class="iconbtn ghost" aria-hidden="true"></span>`}
    </header>
    <div class="qp-body" id="qpBody">${body}</div>
  </div>`;
}
// เปิดหน้าฝึก: ซ่อนแถบบน กันจอดับ Esc ออก · คืนค่าทุกอย่างตอนออก
function qpOpen(title, opts, onCleanup) {
  setChrome({ title, bar: false });
  document.body.classList.add("chant-mode");
  view.innerHTML = qpShell(title, opts);
  requestWake();
  const onKey = e => { if (e.key === "Escape") goBack(); };
  const onVis = () => { if (document.visibilityState === "visible" && !wakeLock) requestWake(); };
  addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", onVis);
  view.querySelector("[data-qp=exit]").onclick = goBack;
  cleanupPage = () => {
    onCleanup?.();
    removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVis);
    releaseWake();
    document.body.classList.remove("chant-mode");
  };
  return document.getElementById("qpBody");
}

// กดค้าง = หายใจเข้า ปล่อย = หายใจออก · ใช้ทั้งในหน้าฝึกและในขั้น "ลองท่า"
// วงแสงขยายตามที่ผู้ใช้กดค้างจริง ส่วนช่วงหายใจออกหดตามเวลาโดยประมาณ (outMs) แล้วจบรอบ
function bindBreathRing(btn, { onPhase, onDone, outMs = 4500 }) {
  let phase = "idle", timer = null;
  const set = p => { phase = p; btn.dataset.phase = p; onPhase?.(p); };
  const press = e => {
    if (e?.preventDefault) e.preventDefault();
    clearTimeout(timer);
    if (phase === "idle" || phase === "out") set("in");
  };
  const release = () => {
    if (phase !== "in") return;
    set("out");
    timer = setTimeout(() => { set("idle"); onDone?.(); }, reduceMotion() ? 800 : outMs);
  };
  btn.addEventListener("pointerdown", press);
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, release));
  btn.addEventListener("contextmenu", e => e.preventDefault());
  btn.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) press(e); });
  btn.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") release(); });
  set("idle");
  return () => clearTimeout(timer);
}
const RING_HTML = `<span class="qp-glow" aria-hidden="true"></span><span class="qp-ring" aria-hidden="true"></span><span class="qp-core" aria-hidden="true"></span>`;

// ปัดซ้าย = ไปต่อ ปัดขวา = ย้อน · กัน click ที่ตามหลังการปัดไม่ให้นับซ้ำ
function bindSwipe(el, { next, prev }) {
  let sx = null, swiped = false;
  el.addEventListener("pointerdown", e => { sx = e.clientX; });
  el.addEventListener("pointerup", e => {
    if (sx == null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) <= 60) return;
    swiped = true; setTimeout(() => { swiped = false; }, 350);
    dx < 0 ? next() : prev();
  });
  return () => { if (swiped) { swiped = false; return true; } return false; };
}

// ============================================================
//  ชั่วลมหายใจเดียว (AN 6.19)
// ============================================================
const BREATH_LEARNED = "learned-breath";

function renderBreath() {
  if (store.get(BREATH_LEARNED) !== "1") return renderBreathLearn({ first: true });
  let stopRing = null;
  const body = qpOpen("ชั่วลมหายใจเดียว · มรณสติ", { learnHref: "#/breath/learn" }, () => stopRing?.());
  const paintIdle = () => {
    body.innerHTML = `<section class="qp-breath">
        <p class="qp-fade qp-intro">ถ้าชีวิตเหลือเพียงลมหายใจนี้<br>ขอใส่ใจคำสอนของพระผู้มีพระภาคเจ้า</p>
        <button type="button" class="qp-hold" id="qpHold" aria-label="กดค้างไว้ขณะหายใจเข้า ปล่อยเมื่อหายใจออก">${RING_HTML}</button>
        <p class="qp-phase" id="qpPhase" aria-live="polite"></p>
        <p class="qp-fade qp-hint">กดค้างไว้ขณะหายใจเข้า · ปล่อยเมื่อหายใจออก<br>วงแสงตามจังหวะของคุณเอง</p>
      </section>`;
    const sec = body.firstElementChild, ph = body.querySelector("#qpPhase");
    stopRing = bindBreathRing(body.querySelector("#qpHold"), {
      onPhase: p => { sec.dataset.phase = p; ph.textContent = p === "in" ? "หายใจเข้า…" : p === "out" ? "หายใจออก…" : ""; },
      onDone: paintDone,
    });
  };
  const paintDone = () => {
    body.innerHTML = `<section class="qp-done">
        <span class="qp-spark" aria-hidden="true"></span>
        <article class="qp-quote">
          <p class="pi" lang="pi-Latn">‘aho vatāhaṁ tadantaraṁ jīveyyaṁ yadantaraṁ assasitvā vā passasāmi passasitvā vā assasāmi, bhagavato sāsanaṁ manasi kareyyaṁ, bahu vata me kataṁ assā’ti.</p>
          <hr>
          <p class="th">“โอหนอ ขอเราพึงมีชีวิตอยู่เพียงชั่วหายใจเข้าแล้วหายใจออก หรือหายใจออกแล้วหายใจเข้า พึงใส่ใจคำสอนของพระผู้มีพระภาคเจ้า กิจที่เราทำแล้วก็จะมากหนอ”</p>
          <p class="note">ผู้ที่เจริญมรณสติอย่างนี้ พระสูตรเรียกว่า <b>ผู้ไม่ประมาท</b> (appamattā)</p>
          <div class="refs">${qpRef(TPM("an6.19#an6.19:7.5"), "AN 6.19:7.5")}${qpRef(TPM("an6.19#an6.19:15.1"), "15.1")}</div>
          ${AI_NOTE}
        </article>
        <div class="qp-actions">
          <button type="button" class="btn qp-primary" id="qpAgain">อีกหนึ่งลมหายใจ</button>
          <button type="button" class="btn qp-secondary" data-qp="exit2">พอแล้ว</button>
        </div>
      </section>`;
    body.querySelector("#qpAgain").onclick = () => { paintIdle(); body.querySelector("#qpHold").focus(); };
    body.querySelector("[data-qp=exit2]").onclick = goBack;
    body.querySelector("#qpAgain").focus({ preventScroll: true });
  };
  paintIdle();
}

// ฟังก่อน: ๔ ขั้น แตะ/ปัดไปต่อ · ขั้น ๒ เปิดคำตอบของภิกษุทีละรูป · ขั้น ๓ ต้องลองท่าครบหนึ่งรอบ
const BREATH_RUNGS = [
  ["วันหนึ่งคืนหนึ่ง", 100], ["วันหนึ่ง", 78], ["ชั่วฉันอาหารมื้อหนึ่ง", 52],
  ["ชั่วเคี้ยวกลืนข้าว ๔–๕ คำ", 30], ["ชั่วเคี้ยวกลืนข้าวคำเดียว", 13], ["ชั่วหายใจเข้าแล้วออก", 5],
];
function renderBreathLearn({ first = false } = {}) {
  let stopRing = null;
  const body = qpOpen("ฟังก่อน · AN 6.19", {}, () => stopRing?.());
  const S = { card: 0, rung: 0, tried: false };
  const N = 4;
  body.innerHTML = `<div class="qp-learn">
      <div class="qp-dots" role="img" id="lnDots"></div>
      <div class="qp-stage" id="lnStage"></div>
      <footer class="qp-foot">
        <button type="button" class="qp-back" id="lnBack" aria-label="ย้อน">${ICON.chev}</button>
        <button type="button" class="btn qp-primary" id="lnNext"></button>
      </footer>
    </div>`;
  const stage = body.querySelector("#lnStage"), nextBtn = body.querySelector("#lnNext"), backBtn = body.querySelector("#lnBack");
  const finish = () => {
    store.set(BREATH_LEARNED, "1");
    if (first) renderBreath();               // ครั้งแรก: ฟังจบแล้วเข้าฝึกต่อในหน้าเดิม
    else goBack();                            // ทวนคำสอนจากหน้าฝึก: กลับไปหน้าฝึก
  };
  const go = c => { stopRing?.(); stopRing = null; S.card = Math.max(0, Math.min(N - 1, c)); paint(); };
  const tap = () => {
    if (S.card === 1 && S.rung < 7) { S.rung++; paintRungs(); return syncFoot(); }
    if (S.card === 2 && !S.tried) return;
    if (S.card === N - 1) return finish();
    go(S.card + 1);
  };
  const wasSwipe = bindSwipe(stage, { next: tap, prev: () => go(S.card - 1) });
  stage.addEventListener("click", e => {
    if (wasSwipe() || e.target.closest("a, button")) return;
    if (S.card === 0 || S.card === 1) tap();
  });
  nextBtn.onclick = tap;
  backBtn.onclick = () => go(S.card - 1);

  const syncFoot = () => {
    const dots = body.querySelector("#lnDots");
    dots.setAttribute("aria-label", `ขั้นที่ ${S.card + 1} จาก ${N}`);
    dots.innerHTML = Array.from({ length: N }, (_, k) => `<span class="${k === S.card ? "on" : k < S.card ? "past" : ""}"></span>`).join("");
    backBtn.disabled = S.card === 0;
    const wait = S.card === 2 && !S.tried;
    nextBtn.disabled = wait;
    nextBtn.textContent = S.card === 1 && S.rung < 7 ? "ฟังต่อ" : wait ? "ลองท่าก่อนหนึ่งครั้ง" : S.card === N - 1 ? (first ? "เข้าใจแล้ว เริ่มฝึก" : "กลับไปฝึก") : "ถัดไป";
  };
  const paintRungs = () => {
    const judged = S.rung >= 7;
    stage.querySelectorAll(".ln-rung").forEach((el, k) => {
      el.classList.toggle("shown", k < S.rung);
      el.classList.toggle("ok", judged && k >= 4);
      el.classList.toggle("lax", judged && k < 4);
    });
    stage.querySelector(".ln-verdict").classList.toggle("shown", judged);
    stage.querySelector(".ln-hint").textContent = S.rung === 0 ? "แตะเพื่อฟังคำตอบทีละรูป"
      : S.rung < 6 ? `แตะเพื่อฟังรูปถัดไป (${S.rung}/6)` : S.rung === 6 ? "แตะเพื่อฟังว่าพระพุทธเจ้าตรัสอย่างไร" : "แตะหรือปัดเพื่อไปต่อ";
  };
  const CARDS = [
    () => `<section class="ln-card ln-c1">
        <span class="ln-orb" aria-hidden="true"></span>
        <p class="ln-eyebrow rise">พระพุทธเจ้าตรัสกับภิกษุว่า</p>
        <p class="ln-big rise2">“มรณสติ ที่เจริญแล้ว ทำให้มากแล้ว<br>มีผลมาก มีอานิสงส์มาก<br>หยั่งลงสู่อมตะ มีอมตะเป็นที่สุด”</p>
        <p class="ln-pi rise3" lang="pi-Latn">maraṇassati … amatogadhā amatapariyosānā</p>
        <div class="rise3">${qpRef(TPM("an6.19#an6.19:1.6"), "AN 6.19:1.6")}</div>
      </section>`,
    () => `<section class="ln-card ln-c2">
        <p class="ln-eyebrow">ทรงถามว่า “พวกเธอเจริญมรณสติไหม”</p>
        <p class="ln-mid">ภิกษุ ๖ รูปตอบว่า “ถ้าเรามีชีวิตอยู่เพียงเท่านี้ จะใส่ใจคำสอนของพระผู้มีพระภาคเจ้า”</p>
        <ol class="ln-rungs">${BREATH_RUNGS.map(([l, w], k) => `<li class="ln-rung">
            <span class="lbl"><span>${esc(l)}</span><b>${k >= 4 ? "ไม่ประมาท" : "ยังประมาท"}</b></span>
            <span class="track"><span class="bar" style="--w:${w}%"></span></span></li>`).join("")}</ol>
        <p class="ln-verdict">ทรงตรัสว่า ๔ รูปแรก <b>ยังประมาท</b> ส่วนชั่วข้าวคำเดียวและ <em>ชั่วลมหายใจเดียว</em> คือ <em>ผู้ไม่ประมาท</em>
          ${qpRef(TPM("an6.19#an6.19:12.1"), "12.1")}${qpRef(TPM("an6.19#an6.19:15.1"), "15.1")}</p>
        <p class="ln-hint"></p>
      </section>`,
    () => `<section class="ln-card ln-c3">
        <p class="ln-eyebrow">ลองท่าก่อนหนึ่งครั้ง</p>
        <p class="ln-mid">กดวงกลมค้างไว้ ขณะหายใจเข้า<br>ปล่อย เมื่อหายใจออก</p>
        <button type="button" class="qp-hold small" id="lnHold" aria-label="กดค้างไว้ขณะหายใจเข้า ปล่อยเมื่อหายใจออก">${RING_HTML}</button>
        <p class="qp-phase" id="lnPhase" aria-live="polite">${S.tried ? "ได้แล้ว · นี่คือหนึ่งลมหายใจ" : ""}</p>
      </section>`,
    () => `<section class="ln-card ln-c4">
        <p class="ln-eyebrow rise">ในลมหายใจนั้น</p>
        <p class="ln-big rise2">ใส่ใจคำสอนของพระพุทธเจ้า<br>ราวกับชีวิตมีเพียงเท่านี้</p>
        <p class="ln-mid rise3">พระสูตรไม่ได้ระบุว่าคำสอนข้อไหน ข้อนี้เป็นของผู้ฝึกเอง แอปจะแสดงบรรทัดจากพระสูตรให้ตอนจบรอบ</p>
        <p class="ln-teacher rise3">แอปให้ได้แค่ตัวบท ถ้าสงสัย ควรถามครูบาอาจารย์ (ลำดับการฟังธรรมใน ${qpRef(TPM("mn70#mn70:23.2"), "MN 70")} เริ่มที่การเข้าไปหาครู)</p>
        <p class="qp-ai rise3">คำแปลไทยแปลจากบาลีโดย AI · <a href="${TPM("an6.19")}" target="_blank" rel="noopener">อ่านพระสูตรเต็ม</a></p>
      </section>`,
  ];
  const paint = () => {
    stage.innerHTML = CARDS[S.card]();
    if (S.card === 1) paintRungs();
    if (S.card === 2) {
      const ph = stage.querySelector("#lnPhase"), card = stage.firstElementChild;
      stopRing = bindBreathRing(stage.querySelector("#lnHold"), {
        outMs: 3500,
        onPhase: p => { card.dataset.phase = p; if (p !== "idle") ph.textContent = p === "in" ? "หายใจเข้า…" : "หายใจออก…"; },
        onDone: () => { S.tried = true; ph.textContent = "ได้แล้ว · นี่คือหนึ่งลมหายใจ"; syncFoot(); },
      });
    }
    syncFoot();
  };
  paint();
}

// ============================================================
//  เมตตาแผ่ ๔ ทิศ (AN 10.219:2.1 · AN 1.53)
// ============================================================
const METTA_STEPS = [
  { title: "เริ่ม", pi: "mettāsahagatena cetasā", th: "ตั้งใจที่ประกอบด้วยเมตตา ที่ตรงนี้ ตอนนี้" },
  { title: "ทิศที่ ๑", pi: "ekaṁ disaṁ pharitvā viharati", th: "แผ่ไปยังทิศหนึ่ง แก่ทุกคนที่อยู่ทางนั้น" },
  { title: "ทิศที่ ๒", pi: "tathā dutiyaṁ", th: "ทิศที่สองก็เช่นนั้น" },
  { title: "ทิศที่ ๓", pi: "tathā tatiyaṁ", th: "ทิศที่สามก็เช่นนั้น" },
  { title: "ทิศที่ ๔", pi: "tathā catutthaṁ", th: "ทิศที่สี่ก็เช่นนั้น" },
  { title: "ทั่วทุกแห่ง", pi: "iti uddhamadho tiriyaṁ sabbadhi sabbattatāya sabbāvantaṁ lokaṁ", th: "ทั้งเบื้องบน เบื้องล่าง เบื้องขวาง ทุกแห่ง ทั่วทั้งโลก" },
  { title: "ไม่มีประมาณ", pi: "vipulena mahaggatena appamāṇena averena abyāpajjena", th: "ด้วยใจที่กว้างขวาง ยิ่งใหญ่ ไม่มีประมาณ ไม่มีเวร ไม่เบียดเบียน" },
];
function renderMetta() {
  const body = qpOpen("เมตตาแผ่ ๔ ทิศ");
  let s = 0;
  const n = METTA_STEPS.length;
  const paintStage = () => {
    body.innerHTML = `<button type="button" class="qp-metta" id="mtStage">
        <span class="mt-field" aria-hidden="true">
          <span class="mt-wave w1"></span><span class="mt-wave w2"></span><span class="mt-glow"></span>
          ${[0, 1, 2, 3].map(k => `<span class="mt-quad q${k}"></span>`).join("")}
          <span class="mt-ring"></span><span class="mt-self"></span>
          ${["ทิศที่ ๑", "ทิศที่ ๒", "ทิศที่ ๓", "ทิศที่ ๔"].map((t, k) => `<span class="mt-lbl l${k}">${t}</span>`).join("")}
        </span>
        <span class="mt-text" id="mtText" aria-live="polite"></span>
        <span class="mt-hint" id="mtHint"></span>
      </button>`;
    body.querySelector("#mtStage").onclick = () => { s++; s >= n ? paintDone() : sync(); };
    sync();
  };
  const sync = () => {
    const st = METTA_STEPS[s], lit = Math.min(4, s), stage = body.querySelector("#mtStage");
    stage.dataset.lit = lit;
    stage.classList.toggle("wide", s >= 5);
    stage.classList.toggle("boundless", s >= 6);
    stage.setAttribute("aria-label", s === n - 1 ? "จบ" : "แผ่ต่อ");
    body.querySelector("#mtText").innerHTML = `<span class="t">${esc(st.title)}</span><span class="pi" lang="pi-Latn">${esc(st.pi)}</span><span class="th">${esc(st.th)}</span>`;
    body.querySelector("#mtHint").textContent = s === 0 ? "แตะตรงไหนก็ได้ เพื่อแผ่ไปทิศแรก · ไม่ต้องรีบ" : s === n - 1 ? "แตะเมื่อพร้อม" : "อยู่กับทิศนี้สักครู่ แล้วแตะเพื่อไปต่อ";
  };
  const paintDone = () => {
    body.innerHTML = `<section class="qp-done">
        <article class="qp-quote">
          <p class="pi" lang="pi-Latn">“Accharāsaṅghātamattampi ce, bhikkhave, bhikkhu mettācittaṁ āsevati; ayaṁ vuccati, bhikkhave: ‘bhikkhu arittajjhāno viharati …’”</p>
          <hr>
          <p class="th">“ภิกษุทั้งหลาย ถ้าภิกษุเสพเมตตาจิตแม้ชั่วดีดนิ้ว ภิกษุนี้เรียกว่า อยู่ไม่ว่างจากฌาน ทำตามคำสอนของพระศาสดา … จะกล่าวไปไยถึงผู้ที่ทำให้มาก”</p>
          <p class="note">พระสูตรนี้ตรัสกับภิกษุ ส่วนเวลามสูตรตรัสกับคฤหบดีว่า เจริญเมตตาแม้ชั่วรีดนมโค มีผลมากกว่าทานใหญ่</p>
          <div class="refs">${qpRef(TPM("an1.51-60#an1.53:1.1"), "AN 1.53")}${qpRef(TPM("an10.219#an10.219:2.1"), "AN 10.219")}${qpRef(TPM("an9.20#an9.20:9.9"), "AN 9.20")}</div>
          ${AI_NOTE}
        </article>
        <div class="qp-actions">
          <button type="button" class="btn qp-primary" id="qpAgain">แผ่อีกรอบ</button>
          <button type="button" class="btn qp-secondary" data-qp="exit2">พอแล้ว</button>
        </div>
      </section>`;
    body.querySelector("#qpAgain").onclick = () => { s = 0; paintStage(); body.querySelector("#mtStage").focus(); };
    body.querySelector("[data-qp=exit2]").onclick = goBack;
    body.querySelector("#qpAgain").focus({ preventScroll: true });
  };
  paintStage();
}

// ============================================================
//  พิจารณาพาหิรทุกขสูตร (SN 35.5 · ส่วนท้ายเต็มอยู่ใน SN 35.4:1.13–15)
// ============================================================
const BAHIRA = [
  { id: "rupa", th: "รูป", pi: "rūpā", hint: "สิ่งที่เห็น" },
  { id: "sadda", th: "เสียง", pi: "saddā", hint: "สิ่งที่ได้ยิน" },
  { id: "gandha", th: "กลิ่น", pi: "gandhā", hint: "สิ่งที่ได้กลิ่น" },
  { id: "rasa", th: "รส", pi: "rasā", hint: "สิ่งที่ลิ้มรส" },
  { id: "photthabba", th: "สัมผัส", pi: "phoṭṭhabbā", hint: "สิ่งที่กายกระทบ" },
  { id: "dhamma", th: "ธรรมารมณ์", pi: "dhammā", hint: "สิ่งที่ใจรู้ ความคิด" },
];
const BAHIRA_LEARNED = "learned-bahira";
function renderBahira({ review = false } = {}) {
  const body = qpOpen("พิจารณาพาหิรทุกขสูตร", { learnHref: review ? "" : "#/bahira/learn" });
  const S = { cur: null, k: 0, done: [] };
  const intro = () => {
    body.innerHTML = `<section class="bd-intro">
        <span class="qp-chip">ฟังก่อน · SN 35.5</span>
        <p class="ln-big">“รูป เสียง กลิ่น รส สิ่งที่กายสัมผัส และสิ่งที่ใจรู้ เป็นทุกข์”</p>
        <p class="ln-mid">สิ่งใดเป็นทุกข์ สิ่งนั้นเป็นอนัตตา<br>สิ่งใดเป็นอนัตตา พึงเห็นด้วยปัญญาอันชอบตามความเป็นจริงว่า</p>
        <p class="bd-key">นั่นไม่ใช่ของเรา · เราไม่ใช่นั่น<br>นั่นไม่ใช่ตัวตนของเรา</p>
        <p class="ln-pi" lang="pi-Latn">Rūpā, bhikkhave, dukkhā. Yaṁ dukkhaṁ tadanattā; yadanattā taṁ ‘netaṁ mama, nesohamasmi, na meso attā’ti …</p>
        <p class="bd-how">วิธีฝึก: ดูว่าตอนนี้อะไรปรากฏชัดที่สุดในอายตนะภายนอก ๖ เช่น เสียงรถ แสงไฟ ความร้อน แล้วพิจารณาสิ่งนั้นตามพระสูตร ทีละขั้น</p>
        <div class="refs">${qpRef(TPM("sn35.5#sn35.5:1.1"), "อ่าน SN 35.5")}</div>
        ${AI_NOTE}
        <button type="button" class="btn qp-primary" id="bdStart">${review ? "กลับไปพิจารณา" : "เริ่มพิจารณา"}</button>
      </section>`;
    body.querySelector("#bdStart").onclick = () => {
      store.set(BAHIRA_LEARNED, "1");
      review ? goBack() : practice();
    };
  };
  const practice = () => {
    body.innerHTML = `<section class="bd-practice" id="bdP">
        <div class="bd-ring" role="group" aria-label="อายตนะภายนอก ๖">
          ${BAHIRA.map((x, i) => `<span class="bd-line" style="--a:${-90 + i * 60}deg" data-i="${i}" aria-hidden="true"></span>`).join("")}
          <span class="bd-self" aria-hidden="true"></span>
          ${BAHIRA.map((x, i) => `<button type="button" class="bd-node${x.th.length > 5 ? " long" : ""}" style="--a:${-90 + i * 60}deg" data-i="${i}"
              aria-label="${esc(x.th)} (${esc(x.hint)})"><b>${esc(x.th)}</b><i lang="pi-Latn">${esc(x.pi)}</i></button>`).join("")}
        </div>
        <div class="bd-panel" id="bdPanel"></div>
      </section>`;
    body.querySelectorAll(".bd-node").forEach(b => b.onclick = () => {
      const x = BAHIRA[+b.dataset.i];
      if (S.cur || S.done.includes(x.id)) return;
      S.cur = x.id; S.k = 0; sync();
    });
    sync();
  };
  const sync = () => {
    const p = body.querySelector("#bdP"), panel = body.querySelector("#bdPanel");
    const nd = S.done.length;
    p.style.setProperty("--self", String(1 - nd * .08));
    BAHIRA.forEach((x, i) => {
      const node = p.querySelector(`.bd-node[data-i="${i}"]`), line = p.querySelector(`.bd-line[data-i="${i}"]`);
      const done = S.done.includes(x.id), cur = S.cur === x.id;
      node.classList.toggle("cur", cur); node.classList.toggle("done", done);
      node.classList.toggle("dim", !!S.cur && !cur);
      node.disabled = !!S.cur || done;
      node.setAttribute("aria-label", `${x.th} (${x.hint})${done ? " · พิจารณาแล้ว" : ""}`);
      line.classList.toggle("done", done);
      line.classList.toggle("loosen", cur && S.k >= 2);
    });
    if (S.cur) {
      const x = BAHIRA.find(b => b.id === S.cur);
      const L = [
        [`${x.th} เป็นทุกข์`, `${x.pi} dukkhā`],
        ["สิ่งใดเป็นทุกข์ สิ่งนั้นเป็นอนัตตา", "yaṁ dukkhaṁ tadanattā"],
        ["นั่นไม่ใช่ของเรา · เราไม่ใช่นั่น · นั่นไม่ใช่ตัวตนของเรา", "‘netaṁ mama, nesohamasmi, na meso attā’"],
      ][S.k];
      panel.innerHTML = `<button type="button" class="bd-chain" id="bdStep">
          <span class="pos">${esc(x.th)} · ${S.k + 1}/3</span>
          <span class="th" aria-live="polite">${esc(L[0])}</span>
          <span class="pi" lang="pi-Latn">${esc(L[1])}</span>
          <span class="hint">${S.k < 2 ? "แตะเมื่อพิจารณาแล้ว" : "แตะเพื่อปล่อย"}</span>
        </button>`;
      const btn = panel.querySelector("#bdStep");
      btn.onclick = () => {
        if (S.k < 2) S.k++;
        else { S.done.push(S.cur); S.cur = null; S.k = 0; }
        sync();
        if (!S.cur) (body.querySelector(".bd-node:not([disabled])") || body.querySelector("#bdFinish"))?.focus({ preventScroll: true });
      };
      btn.focus({ preventScroll: true });
    } else {
      const all = nd === BAHIRA.length;
      panel.innerHTML = `${all ? "" : `<div class="bd-ask">
            <p class="t">${nd ? "มีอย่างอื่นปรากฏอีกไหม" : "ตอนนี้ อะไรปรากฏชัดที่สุด"}</p>
            <p class="s">${nd ? "แตะอีกอย่างที่ปรากฏ หรือพอแค่นี้ก็ได้" : "แตะสิ่งที่กำลังรับรู้จริงตอนนี้ เช่น เสียงรถ แสงไฟ ลมที่ผิว หรือความคิดที่ผุดขึ้น"}</p>
          </div>`}
        ${nd ? `<button type="button" class="btn qp-secondary" id="bdFinish">พอแล้ว</button>` : ""}`;
      panel.querySelector("#bdFinish")?.addEventListener("click", end);
    }
  };
  const end = () => {
    const nd = S.done.length;
    body.innerHTML = `<section class="qp-done">
        <article class="qp-quote">
          <span class="qp-chip">พระสูตรสอนต่อว่า</span>
          <p class="th">“อริยสาวกผู้ได้สดับ เห็นอยู่อย่างนี้ ย่อมเบื่อหน่ายในรูป เสียง กลิ่น รส สิ่งที่กายสัมผัส และสิ่งที่ใจรู้ เมื่อเบื่อหน่าย ย่อมคลายกำหนัด เพราะคลายกำหนัด ย่อมหลุดพ้น”</p>
          <p class="pi" lang="pi-Latn">Evaṁ passaṁ … rūpesupi nibbindati … Nibbindaṁ virajjati; virāgā vimuccati …</p>
          <p class="note">SN 35.5 ย่อข้อความส่วนนี้ไว้ (…pe…) ข้อความเต็มอยู่ใน SN 35.4 ซึ่งเป็นพระสูตรก่อนหน้า</p>
          <div class="refs">${qpRef(TPM("sn35.5#sn35.5:1.11"), "SN 35.5:1.11")}${qpRef(TPM("sn35.4#sn35.4:1.13"), "SN 35.4:1.13–14")}</div>
          ${AI_NOTE}
        </article>
        <p class="qp-count">รอบนี้พิจารณาไป ${nd} อย่าง</p>
        <div class="qp-actions">
          <button type="button" class="btn qp-primary" id="qpAgain">พิจารณาอีกรอบ</button>
          <button type="button" class="btn qp-secondary" data-qp="exit2">พอแล้ว</button>
        </div>
      </section>`;
    body.querySelector("#qpAgain").onclick = () => { S.cur = null; S.k = 0; S.done = []; practice(); };
    body.querySelector("[data-qp=exit2]").onclick = goBack;
    body.querySelector("#qpAgain").focus({ preventScroll: true });
  };
  if (review || store.get(BAHIRA_LEARNED) !== "1") intro(); else practice();
}

// เส้นทางของไฟล์นี้ (route() ใน app.js เรียกก่อนเส้นทางอื่น) · คืน true ถ้าจัดการแล้ว
function routeQuick(h) {
  if (h === "quick") renderQuick();
  else if (h === "breath") renderBreath();
  else if (h === "breath/learn") renderBreathLearn();
  else if (h === "metta") renderMetta();
  else if (h === "bahira") renderBahira();
  else if (h === "bahira/learn") renderBahira({ review: true });
  else return false;
  return true;
}
