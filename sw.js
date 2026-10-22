// Service worker — แคชไฟล์ไว้ใช้ออฟไลน์
// *** เวลามีการแก้ไฟล์ ให้เปลี่ยนเลข CACHE เพื่อให้โหลดใหม่ ***
const CACHE = "suadmon-v4";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // เพิ่มทีละไฟล์ ไม่ให้ล้มทั้งชุดถ้าไฟล์ใดหาย
      Promise.all(ASSETS.map((u) => c.add(u).catch(() => {}))))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // network-first สำหรับ data.js และ HTML (ให้เนื้อหาใหม่ขึ้นเร็ว)
  const url = new URL(req.url);
  const freshFirst = url.pathname.endsWith("data.js") ||
                     url.pathname.endsWith(".html") ||
                     url.pathname.endsWith("/");

  if (freshFirst) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // cache-first สำหรับไฟล์อื่น
  e.respondWith(
    caches.match(req).then((r) => r || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
