// ============================================================
//  คำนวณวันอุโบสถตามพระสูตร (ไม่ใช้ปฏิทินจันทรคติไทย)
// ============================================================
//  พระสูตร: วัน ๘, ๑๔, ๑๕ ของปักษ์ (AN 3.37, Snp 2.14)
//  - ปักษ์ข้างขึ้น จบที่วันจันทร์เพ็ญ  ปักษ์ข้างแรม จบที่วันจันทร์ดับ
//  - เวลาจันทร์เพ็ญ/จันทร์ดับ คำนวณทางดาราศาสตร์ (Jean Meeus,
//    Astronomical Algorithms บทที่ 49) คลาดเคลื่อนไม่เกินราว ๑–๒ นาที
//  - วันใหม่เริ่มตอนรุ่งอรุณ ใช้ ๐๖:๐๐ ตามเวลาของเครื่อง
//  - วันที่จันทร์เพ็ญ/ดับตกอยู่ = วัน ๑๕ ค่ำ (ถ้าปักษ์มีแค่ ๑๔ วัน = ๑๔ ค่ำ)
//    วันถัดไปเป็น ๑ ค่ำของปักษ์ใหม่
//  - ปักษ์ที่นับได้ ๑๖ วัน (นาน ๆ ครั้ง) ยังถือวันเพ็ญ/ดับเป็น ๑๕ ค่ำ และวันก่อนหน้าเป็น ๑๔ ค่ำ
//    ปักษ์ ๑๓ วัน (หายากมาก) ถือวันเพ็ญ/ดับเป็น ๑๔ ค่ำ
// ============================================================

const UPO = (() => {
  const EVENING_HOUR = 18;
  const DAY = 86400000;
  const rad = d => d * Math.PI / 180;

  // JDE ของข้างขึ้นข้างแรมแต่ละช่วง (k = จำนวนเต็ม + 0 จันทร์ดับ, .25 ขึ้น ๘ ค่ำ (ครึ่งดวง),
  // .5 จันทร์เพ็ญ, .75 แรม ๘ ค่ำ (ครึ่งดวง))
  function phaseJDE(k) {
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2
      - 0.00000015 * T3 + 0.00000000073 * T4;
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
    const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3
      - 0.000000058 * T4);
    const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3
      + 0.000000011 * T4);
    const O = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);
    const s = Math.sin, co = Math.cos;
    const frac = ((k % 1) + 1) % 1;
    if (frac < 0.1 || Math.abs(frac - 0.5) < 0.1) {
      const full = frac > 0.25;
      const c = full
        ? [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209]
        : [-0.40720, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208];
      jde += c[0] * s(Mp) + c[1] * E * s(M) + c[2] * s(2 * Mp) + c[3] * s(2 * F)
        + c[4] * E * s(Mp - M) + c[5] * E * s(Mp + M) + c[6] * E * E * s(2 * M)
        - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F)
        + 0.00056 * E * s(2 * Mp + M) - 0.00042 * s(3 * Mp)
        + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F)
        - 0.00024 * E * s(2 * Mp - M) - 0.00017 * s(O)
        - 0.00007 * s(Mp + 2 * M) + 0.00004 * s(2 * Mp - 2 * F) + 0.00004 * s(3 * M)
        + 0.00003 * s(Mp + M - 2 * F) + 0.00003 * s(2 * Mp + 2 * F)
        - 0.00003 * s(Mp + M + 2 * F) + 0.00003 * s(Mp - M + 2 * F)
        - 0.00002 * s(Mp - M - 2 * F) - 0.00002 * s(3 * Mp + M) + 0.00002 * s(4 * Mp);
    } else {
      // ครึ่งดวง (first / last quarter)
      jde += -0.62801 * s(Mp) + 0.17172 * E * s(M) - 0.01183 * E * s(Mp + M)
        + 0.00862 * s(2 * Mp) + 0.00804 * s(2 * F) + 0.00454 * E * s(Mp - M)
        + 0.00204 * E * E * s(2 * M) - 0.0018 * s(Mp - 2 * F) - 0.0007 * s(Mp + 2 * F)
        - 0.0004 * s(3 * Mp) - 0.00034 * E * s(2 * Mp - M) + 0.00032 * E * s(M + 2 * F)
        + 0.00032 * E * s(M - 2 * F) - 0.00028 * E * E * s(Mp + 2 * M)
        + 0.00027 * E * s(2 * Mp + M) - 0.00017 * s(O) - 0.00005 * s(Mp - M - 2 * F)
        + 0.00004 * s(2 * Mp + 2 * F) - 0.00004 * s(Mp + M + 2 * F) + 0.00004 * s(Mp - 2 * M)
        + 0.00003 * s(Mp + M - 2 * F) + 0.00003 * s(3 * M) + 0.00002 * s(2 * Mp - 2 * F)
        + 0.00002 * s(Mp - M + 2 * F) - 0.00002 * s(3 * Mp + M);
      const W = 0.00306 - 0.00038 * E * co(M) + 0.00026 * co(Mp) - 0.00002 * co(Mp - M)
        + 0.00002 * co(Mp + M) + 0.00002 * co(2 * F);
      jde += frac < 0.5 ? W : -W;
    }
    // ส่วนแก้จากดาวเคราะห์ (A1–A14)
    const A = [
      [299.77, 0.107408, -0.009173, 0.000325], [251.88, 0.016321, 0, 0.000165],
      [251.83, 26.651886, 0, 0.000164], [349.42, 36.412478, 0, 0.000126],
      [84.66, 18.206239, 0, 0.00011], [141.74, 53.303771, 0, 0.000062],
      [207.14, 2.453732, 0, 0.00006], [154.84, 7.30686, 0, 0.000056],
      [34.52, 27.261239, 0, 0.000047], [207.19, 0.121824, 0, 0.000042],
      [291.34, 1.844379, 0, 0.00004], [161.72, 24.198154, 0, 0.000037],
      [239.56, 25.513099, 0, 0.000035], [331.55, 3.592518, 0, 0.000023],
    ];
    for (const [a, b, cc, amp] of A) jde += amp * s(rad(a + b * k + cc * T2));
    return jde;
  }

  // JDE (เวลา TT) -> Date (UTC) ลบ ΔT ราว 69 วินาที
  const jdeToDate = jde => new Date((jde - 2440587.5) * DAY - 69000);

  // ช่วงอุโบสถ: เริ่มค่ำ ๑๘:๐๐ ถึงค่ำวันรุ่งขึ้น ๑๘:๐๐ ตามเวลาเครื่อง
  // ("อิมัญจะ รัตติง อิมัญจะ ทิวะสัง" คืนก่อน แล้ววัน)
  function periodOf(t) {
    const d = new Date(t.getTime());
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), EVENING_HOUR);
    if (d < start) start.setDate(start.getDate() - 1);
    return start;   // เวลาเริ่มของช่วงที่ t ตกอยู่
  }
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  const TH = n => String(n).replace(/\d/g, d => "๐๑๒๓๔๕๖๗๘๙"[d]);
  const NAME = {
    0: { side: "แรม", moon: "จันทร์ดับ", icon: "🌑" },
    0.25: { side: "ขึ้น", moon: "ครึ่งดวง ข้างขึ้น", icon: "🌓" },
    0.5: { side: "ขึ้น", moon: "จันทร์เพ็ญ", icon: "🌕" },
    0.75: { side: "แรม", moon: "ครึ่งดวง ข้างแรม", icon: "🌗" },
  };

  // ช่วงอุโบสถรอบวันที่ให้มา เรียงตามเวลา
  // แต่ละช่วง = { start, end, days:[{start,end,label}], phase:{time,name,icon} }
  function periods(date) {
    const yrs = (date.getTime() - Date.UTC(2000, 0, 6)) / (365.25 * DAY);
    const k0 = Math.floor(yrs * 12.3685) - 1;
    const out = [];
    for (let k = k0; k <= k0 + 4; k += 0.25) {
      const frac = Math.round((((k % 1) + 1) % 1) * 4) / 4;
      const time = jdeToDate(phaseJDE(k));
      const p = periodOf(time);
      const n = NAME[frac];
      let days;
      if (frac === 0.25 || frac === 0.75) {
        days = [{ start: p, end: addDays(p, 1), label: `${n.side} ${TH(8)} ค่ำ` }];
      } else {
        days = [
          { start: addDays(p, -1), end: p, label: `${n.side} ${TH(14)} ค่ำ` },
          { start: p, end: addDays(p, 1), label: `${n.side} ${TH(15)} ค่ำ` },
        ];
      }
      out.push({ start: days[0].start, end: days[days.length - 1].end, days,
        phase: { time, name: n.moon, icon: n.icon } });
    }
    return out.sort((a, b) => a.start - b.start);
  }

  // สถานะ ณ ตอนนี้ + ช่วงอุโบสถถัดไป n ช่วง
  function status(now = new Date(), n = 6) {
    const all = periods(now);
    const current = all.find(p => p.start <= now && now < p.end) || null;
    const todayDay = current && current.days.find(d => d.start <= now && now < d.end);
    const next = all.filter(p => p.start > now).slice(0, n);
    return { now, current, todayDay, next };
  }

  return { status, periods, phaseJDE, jdeToDate, TH };
})();

if (typeof module !== "undefined") module.exports = UPO;
