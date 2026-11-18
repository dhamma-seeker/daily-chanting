// ============================================================
//  บทสวดมนต์ประจำวัน — ตรรกะหน้าจอ
// ============================================================

const view = document.getElementById("view");
const titleEl = document.getElementById("title");
const backBtn = document.getElementById("backBtn");
const gearBtn = document.getElementById("gearBtn");
const controls = document.getElementById("controls");
const scrim = document.getElementById("scrim");

const PREF = {
  get fs() { return +(localStorage.getItem("fs") || 20); },
  set fs(v) { localStorage.setItem("fs", v); apply(); },
  get thai() { return localStorage.getItem("thai") || "show"; },
  set thai(v) { localStorage.setItem("thai", v); apply(); },
  get roman() { return localStorage.getItem("roman") || "show"; },
  set roman(v) { localStorage.setItem("roman", v); apply(); },
  get theme() { return localStorage.getItem("theme") || "auto"; },
  set theme(v) { localStorage.setItem("theme", v); apply(); },
};

function apply() {
  document.documentElement.style.setProperty("--fs", PREF.fs + "px");
  document.body.classList.toggle("hide-thai", PREF.thai === "hide");
  document.body.classList.toggle("hide-roman", PREF.roman === "hide");
  if (PREF.theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", PREF.theme);
  syncControlButtons();
}

function syncControlButtons() {
  document.querySelectorAll("[data-thai]").forEach(b =>
    b.classList.toggle("active", b.dataset.thai === PREF.thai));
  document.querySelectorAll("[data-theme]").forEach(b =>
    b.classList.toggle("active", b.dataset.theme === PREF.theme));
  document.querySelectorAll("[data-roman]").forEach(b =>
    b.classList.toggle("active", b.dataset.roman === PREF.roman));
}

function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

// ---------- บาลีคำต่อคำ (อักษรไทย บน / โรมัน ล่าง) ----------
function renderWords(lines) {
  return lines.map(line => line.map(([t, r]) =>
    `<span class="w"><span class="t">${esc(t)}</span><span class="r">${esc(r)}</span></span>`).join(" "))
    .join("<br>");
}

// ---------- อ้างอิงพระสูตร ----------
// "AN 3.70:4.4–4.5 · 5.2 · AN 8.41:2.1" -> ลิงก์เปิดพระสูตรเต็มในแอป ตรงย่อหน้านั้น
function refLink(ref) {
  let cur = null;
  const parts = ref.split("·").map(p => p.trim()).filter(Boolean).map(p => {
    const m = p.match(/^(AN|SN|MN|DN|Snp)\s*(\d+\.\d+)(?::(\d+))?/);
    let para = null;
    if (m) { cur = (m[1] + m[2]).toLowerCase(); para = m[3] || null; }
    else { const n = p.match(/^(\d+)/); para = n ? n[1] : null; }
    if (cur && typeof SUTTAS !== "undefined" && SUTTAS[cur])
      return `<a href="#/sutta/${cur}${para ? "/" + para : ""}">${esc(p)}</a>`;
    return esc(p);
  });
  return `<div class="ref">📖 ${parts.join(" · ")}</div>`;
}

// ---------- หน้าพระสูตรเต็ม ----------
function renderSutta(id, para) {
  const st = SUTTAS[id];
  titleEl.textContent = st.title;
  backBtn.classList.remove("hidden");
  gearBtn.classList.remove("hidden");
  const body = st.paras.map(p => {
    const exp = p.lines.some(l => l.expanded)
      ? `<div class="exp-note">ต้นฉบับย่อส่วนนี้ไว้ (…pe…) แอปเติมให้เต็มแล้ว</div>` : "";
    return `<section class="sutta-para${p.n === para ? " target" : ""}" id="p-${esc(p.n)}">
      <div class="para-no">${esc(st.ref)}:${esc(p.n)}</div>
      <div class="pali">${renderWords(p.lines.map(l => l.w))}</div>${exp}
      <div class="thai">${esc(p.thai)}</div>
    </section>`;
  }).join("");
  view.innerHTML = `
    <div class="sutta-head">
      <h2>${esc(st.title)}</h2>
      <p>${esc(st.sub)}</p>
      <p class="src">บาลีฉบับ SuttaCentral (ฐานข้อมูล tripitaka-mcp) · คำแปลภาษาชาวบ้าน ·
        <a href="https://tripitaka-mcp.com/read/${esc(id)}" target="_blank" rel="noopener">ดูต้นฉบับออนไลน์</a></p>
    </div>
    ${body}
    <div class="end-mark">๛</div>`;
  const t = para && document.getElementById("p-" + para);
  if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 0);
  else window.scrollTo(0, 0);
}

// ---------- วันอุโบสถ ----------
const pad2 = n => String(n).padStart(2, "0");
function thDay(d) {
  return d.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });
}
function thTime(d) {
  const r = new Date(d.getTime() + 30000);       // ปัดเป็นนาทีที่ใกล้สุด
  return `${pad2(r.getHours())}:${pad2(r.getMinutes())} น.`;
}
function thWhen(d) { return `${thDay(d)} ${thTime(d)}`; }
function untilText(ms) {
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60;
  if (h >= 48) return `อีก ${Math.floor(h / 24)} วัน`;
  if (h >= 24) return `อีก 1 วัน ${h - 24} ชม.`;
  if (h >= 1) return `อีก ${h} ชม. ${m} นาที`;
  return `อีก ${m} นาที`;
}
function periodLabel(p) { return p.days.map(d => d.label).join(" และ "); }

function uposathaHomeCard() {
  if (typeof UPO === "undefined") return "";
  const st = UPO.status();
  const cur = st.current, nx = st.next[0];
  const head = cur
    ? `<b>${cur.phase.icon} อยู่ในวันอุโบสถ · ${esc(st.todayDay.label)}</b>
       <span>ถึง ${esc(thWhen(cur.end))} · ${esc(untilText(cur.end - st.now))}</span>`
    : `<b>${esc(untilText(nx.start - st.now))} ถึงวันอุโบสถ</b>
       <span>เริ่ม ${esc(thWhen(nx.start))} · ${esc(periodLabel(nx))}</span>`;
  return `<button class="upo-card${cur ? " is-today" : ""}" data-session="uposatha">
    <span class="meta">${head}<span class="sub">บทสวด ข้อปฏิบัติ และพระสูตรเรื่องอุโบสถ</span></span>
    <span class="chev">›</span>
  </button>`;
}

function periodRow(p, now) {
  const isNow = p.start <= now && now < p.end;
  const days = p.days.map(d =>
    `<div class="upo-day"><b>${esc(d.label)}</b> ${esc(thWhen(d.start))} ถึง ${esc(thWhen(d.end))}</div>`).join("");
  const badge = isNow ? `<span class="upo-badge">กำลังถือ · เหลือ${esc(untilText(p.end - now).slice(3))}</span>`
    : `<span class="upo-badge soft">${esc(untilText(p.start - now))}</span>`;
  return `<li class="${isNow ? "now" : ""}">
    <div class="upo-range">${p.phase.icon} เริ่ม <b>${esc(thWhen(p.start))}</b><br>จบ <b>${esc(thWhen(p.end))}</b> ${badge}</div>
    ${days}
    <div class="upo-phase">${esc(p.phase.name)} ${esc(thWhen(p.phase.time))}</div>
  </li>`;
}

function uposathaPanel() {
  if (typeof UPO === "undefined") return "";
  const st = UPO.status(new Date(), 6);
  const list = (st.current ? [st.current] : []).concat(st.next);
  return `<section class="upo-panel">
    <div class="upo-today">${st.current ? "ตอนนี้อยู่ในวันอุโบสถ" : "ช่วงถืออุโบสถครั้งถัดไป"}</div>
    <ol class="upo-list">${list.map(p => periodRow(p, st.now)).join("")}</ol>
    <p class="upo-foot">วัน ๘, ๑๔, ๑๕ ของปักษ์ตามพระสูตร (AN 3.37, Snp 2.14) ·
      ๘ ค่ำ คือวันที่ดวงจันทร์ครึ่งดวง ๑๕ ค่ำ คือวันจันทร์เพ็ญหรือจันทร์ดับ ถือรวม ๑๔ ค่ำ ก่อนหน้าด้วย ·
      แต่ละวันนับจากค่ำ ๑๘:๐๐ ถึงค่ำวันรุ่งขึ้น ๑๘:๐๐ เพราะพระสูตรว่า "คืนนี้และวันนี้" (อิมัญจะ รัตติง อิมัญจะ ทิวะสัง) ·
      เวลาข้างขึ้นข้างแรมคำนวณทางดาราศาสตร์ ตามเวลาของเครื่อง</p>
  </section>`;
}

// ---------- หน้าแรก ----------
// ---------- การ์ดติดตั้งแอป (แสดงเฉพาะตอนเปิดในเบราว์เซอร์) ----------
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

function installCard() {
  if (isStandalone()) return "";
  let body;
  if (inAppBrowser) {
    body = `<p>ตอนนี้เปิดอยู่ในแอปแชต ซึ่งติดตั้งไม่ได้ กดปุ่มนี้เพื่อเปิดใน Chrome ก่อนครับ</p>
      <a class="install-btn" href="${isAndroid ? chromeIntentURL() : location.href}">เปิดใน Chrome</a>
      <p class="install-alt">ถ้ากดแล้วไม่เปิด: แตะปุ่ม ⋮ มุมขวาบน แล้วเลือก “เปิดในเบราว์เซอร์”</p>`;
  } else if (installEvt) {
    body = `<p>ติดตั้งครั้งเดียว จะมีไอคอน 🪷 บนหน้าจอมือถือ แตะเปิดได้ทุกวัน ไม่ต้องจำเว็บ</p>
      <button class="install-btn" id="installBtn">📲 ติดตั้งแอปลงมือถือ</button>
      <p class="install-alt">มีหน้าต่างถามขึ้นมา ให้แตะ “ติดตั้ง”</p>`;
  } else if (isIOS) {
    body = `<ol class="install-steps">
      <li>แตะปุ่มแชร์ <b>⬆︎</b> ที่แถบด้านล่าง</li>
      <li>เลื่อนลง แตะ <b>“เพิ่มไปยังหน้าจอโฮม”</b></li>
      <li>แตะ <b>“เพิ่ม”</b> มุมขวาบน</li></ol>`;
  } else if (isSamsung) {
    body = `<ol class="install-steps">
      <li>แตะปุ่ม <b>☰</b> ที่มุมขวาล่าง</li>
      <li>แตะ <b>“เพิ่มหน้าไปยัง”</b> แล้วเลือก <b>“หน้าจอหลัก”</b></li>
      <li>แตะ <b>“เพิ่ม”</b></li></ol>`;
  } else if (isAndroid) {
    body = `<ol class="install-steps">
      <li>แตะปุ่ม <b>⋮</b> ที่มุมขวาบน</li>
      <li>แตะ <b>“ติดตั้งแอป”</b> หรือ <b>“เพิ่มลงในหน้าจอหลัก”</b></li>
      <li>แตะ <b>“ติดตั้ง”</b></li></ol>`;
  } else return "";
  return `<section class="install-card">
    <h3>ติดตั้งแอปลงมือถือ</h3>${body}
    <button class="install-later" id="installLater">ไว้ทีหลัง</button>
  </section>`;
}

function bindInstallCard() {
  const btn = document.getElementById("installBtn");
  if (btn) btn.onclick = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice.catch(() => {});
    installEvt = null;
    renderHome();
  };
  const later = document.getElementById("installLater");
  if (later) later.onclick = () => {
    try { sessionStorage.setItem("install-later", "1"); } catch {}
    later.closest(".install-card").remove();
  };
  try { if (sessionStorage.getItem("install-later")) document.querySelector(".install-card")?.remove(); } catch {}
}

function renderHome() {
  titleEl.textContent = "บทสวดมนต์ประจำวัน";
  backBtn.classList.add("hidden");
  gearBtn.classList.add("hidden");
  closeControls();

  const hour = new Date().getHours();
  const suggest = (hour >= 4 && hour < 15) ? "morning" : "night";

  const cards = SESSIONS.filter(s => s.id !== "uposatha").map(s => {
    const count = s.order.length;
    const hint = s.id === suggest ? " · แนะนำตอนนี้" : "";
    return `<button class="session-card" data-session="${s.id}">
      <span class="emoji">${s.icon}</span>
      <span class="meta"><b>${esc(s.title)}</b><span>${count} บท${hint}</span></span>
      <span class="chev">›</span>
    </button>`;
  }).join("");

  view.innerHTML = `
    <div class="hero">
      <div class="mark">🪷</div>
      <h2>สวดมนต์ประจำวัน</h2>
      <p>บาลี แล้วตามด้วยคำแปลไทย</p>
    </div>
    ${installCard()}
    ${uposathaHomeCard()}
    <div class="session-grid">${cards}</div>
    <div class="home-note">ใช้งานได้แม้ไม่มีเน็ต · แอปอัปเดตเองเมื่อเปิดตอนมีเน็ต</div>`;

  view.querySelectorAll("[data-session]").forEach(el =>
    el.addEventListener("click", () => location.hash = "#/" + el.dataset.session));
  bindInstallCard();
  window.scrollTo(0, 0);
}

// ---------- หน้าสวด ----------
function renderSession(id) {
  const s = SESSIONS.find(x => x.id === id);
  if (!s) return renderHome();

  titleEl.textContent = s.icon + " " + s.title;
  backBtn.classList.remove("hidden");
  gearBtn.classList.remove("hidden");

  const toc = s.order.map((cid, i) => {
    const c = CHANTS[cid];
    return `<li><a href="#c-${i}" data-jump="${i}">${esc(c ? c.title : cid)}</a></li>`;
  }).join("");

  const body = s.order.map((cid, i) => {
    const c = CHANTS[cid];
    if (!c) return "";
    const note = c.note ? `<p class="chant-note">${esc(c.note)}</p>` : "";
    const segs = c.segments.map(seg => {
      if (seg.head) return `<h4 class="seg-head">${esc(seg.head)}</h4>`;
      const ref = seg.ref ? refLink(seg.ref) : "";
      if (!seg.pali) return `<div class="segment guide"><div class="guide-text">${esc(seg.thai)}</div>${ref}</div>`;
      const isTodo = typeof TODO !== "undefined" && seg.pali === TODO;
      const pali = seg.w
        ? `<div class="pali">${renderWords(seg.w)}</div>`
        : `<div class="pali${isTodo ? " todo" : ""}">${esc(seg.pali)}</div>`;
      const thai = seg.thai ? `<div class="thai">${esc(seg.thai)}</div>` : "";
      return `<div class="segment">${pali}${thai}${ref}</div>`;
    }).join("");
    return `<section class="chant" id="c-${i}">
      <div class="chant-head"><span class="num">${i + 1}</span><h3>${esc(c.title)}</h3></div>
      ${note}${segs}
    </section>`;
  }).join("");

  view.innerHTML = `
    ${s.id === "uposatha" ? uposathaPanel() : ""}
    <nav class="toc"><ol>${toc}</ol></nav>
    ${body}
    <div class="end-mark">๛</div>`;

  view.querySelectorAll("[data-jump]").forEach(a =>
    a.addEventListener("click", e => {
      e.preventDefault();
      const t = document.getElementById("c-" + a.dataset.jump);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  window.scrollTo(0, 0);
}

// ---------- แผงตั้งค่า ----------
function openControls() { controls.classList.add("open"); scrim.classList.add("open"); }
function closeControls() { controls.classList.remove("open"); scrim.classList.remove("open"); }

gearBtn.addEventListener("click", () =>
  controls.classList.contains("open") ? closeControls() : openControls());
scrim.addEventListener("click", closeControls);
let navDepth = 0;   // จำนวนหน้าที่เปิดต่อกันในแอป (ใช้ย้อนกลับจากหน้าพระสูตร)
window.addEventListener("hashchange", () => navDepth++);
backBtn.addEventListener("click", () => {
  if (location.hash.startsWith("#/sutta/") && navDepth > 0) history.back();
  else location.hash = "";
});

document.getElementById("fsUp").addEventListener("click", () =>
  PREF.fs = Math.min(34, PREF.fs + 2));
document.getElementById("fsDown").addEventListener("click", () =>
  PREF.fs = Math.max(14, PREF.fs - 2));
document.querySelectorAll("[data-thai]").forEach(b =>
  b.addEventListener("click", () => PREF.thai = b.dataset.thai));
document.querySelectorAll("[data-theme]").forEach(b =>
  b.addEventListener("click", () => PREF.theme = b.dataset.theme));
document.querySelectorAll("[data-roman]").forEach(b =>
  b.addEventListener("click", () => PREF.roman = b.dataset.roman));

// ---------- Router ----------
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  const m = h.match(/^sutta\/([a-z0-9.]+)(?:\/(\d+))?$/);
  if (m && typeof SUTTAS !== "undefined" && SUTTAS[m[1]]) { closeControls(); renderSutta(m[1], m[2] || null); }
  else if (h && SESSIONS.some(s => s.id === h)) renderSession(h);
  else renderHome();
}
window.addEventListener("hashchange", route);

apply();
route();

// ---------- Service worker + อัปเดตอัตโนมัติ ----------
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
  t.textContent = "✓ อัปเดตแอปเป็นรุ่นล่าสุดแล้ว";
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
  try { localStorage.setItem("installed", "1"); } catch {}
  if (!location.hash || location.hash === "#/") renderHome();
});
