// Service worker — แคชไฟล์ไว้ใช้ออฟไลน์
// เลข CACHE เปลี่ยนเมื่อเพิ่ม/ลบไฟล์ใน ASSETS (ไฟล์ที่แก้เฉย ๆ อัปเดตเองอยู่แล้ว)
const CACHE = "suadmon-v8";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./uposatha.js",
  "./suttas.js",
  "./uposatha-cal.js",
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

// เน็ตก่อนทุกไฟล์ (ถามเซิร์ฟเวอร์ว่ามีของใหม่ไหม) ถ้าเน็ตช้าเกิน 4 วินาทีหรือไม่มีเน็ต ใช้ของในเครื่อง
// แบบนี้แก้ไฟล์แล้ว push ขึ้นไป เปิดแอปครั้งถัดไปก็ได้ของใหม่ทันที ไม่ต้องเปลี่ยนเลข CACHE ก็ได้
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const net = fetch(req, { cache: "no-cache" }).then((res) => {
      if (res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    });
    const cached = await cache.match(req, { ignoreSearch: true });
    if (!cached) {
      try { return await net; }
      catch { return (await cache.match("./index.html")) || Response.error(); }
    }
    const timeout = new Promise((r) => setTimeout(() => r(cached), 4000));
    return Promise.race([net.catch(() => cached), timeout]);
  })());
});
