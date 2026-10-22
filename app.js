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
  get theme() { return localStorage.getItem("theme") || "auto"; },
  set theme(v) { localStorage.setItem("theme", v); apply(); },
};

function apply() {
  document.documentElement.style.setProperty("--fs", PREF.fs + "px");
  document.body.classList.toggle("hide-thai", PREF.thai === "hide");
  if (PREF.theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", PREF.theme);
  syncControlButtons();
}

function syncControlButtons() {
  document.querySelectorAll("[data-thai]").forEach(b =>
    b.classList.toggle("active", b.dataset.thai === PREF.thai));
  document.querySelectorAll("[data-theme]").forEach(b =>
    b.classList.toggle("active", b.dataset.theme === PREF.theme));
}

function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

// ---------- หน้าแรก ----------
function renderHome() {
  titleEl.textContent = "บทสวดมนต์ประจำวัน";
  backBtn.classList.add("hidden");
  gearBtn.classList.add("hidden");
  closeControls();

  const hour = new Date().getHours();
  const suggest = (hour >= 4 && hour < 15) ? "morning" : "night";

  const cards = SESSIONS.map(s => {
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
    <div class="session-grid">${cards}</div>
    <div class="home-note">
      เพิ่มลงหน้าจอโฮม: บน iPhone/iPad กดปุ่มแชร์ แล้วเลือก “เพิ่มไปยังหน้าจอโฮม” ·
      ใช้งานได้แม้ไม่มีเน็ต
    </div>`;

  view.querySelectorAll("[data-session]").forEach(el =>
    el.addEventListener("click", () => location.hash = "#/" + el.dataset.session));
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
      const isTodo = typeof TODO !== "undefined" && seg.pali === TODO;
      const pali = `<div class="pali${isTodo ? " todo" : ""}">${esc(seg.pali)}</div>`;
      const thai = seg.thai ? `<div class="thai">${esc(seg.thai)}</div>` : "";
      return `<div class="segment">${pali}${thai}</div>`;
    }).join("");
    return `<section class="chant" id="c-${i}">
      <div class="chant-head"><span class="num">${i + 1}</span><h3>${esc(c.title)}</h3></div>
      ${note}${segs}
    </section>`;
  }).join("");

  view.innerHTML = `
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
backBtn.addEventListener("click", () => location.hash = "");

document.getElementById("fsUp").addEventListener("click", () =>
  PREF.fs = Math.min(34, PREF.fs + 2));
document.getElementById("fsDown").addEventListener("click", () =>
  PREF.fs = Math.max(14, PREF.fs - 2));
document.querySelectorAll("[data-thai]").forEach(b =>
  b.addEventListener("click", () => PREF.thai = b.dataset.thai));
document.querySelectorAll("[data-theme]").forEach(b =>
  b.addEventListener("click", () => PREF.theme = b.dataset.theme));

// ---------- Router ----------
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  if (h && SESSIONS.some(s => s.id === h)) renderSession(h);
  else renderHome();
}
window.addEventListener("hashchange", route);

apply();
route();

// ---------- Service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js").catch(() => {}));
}
