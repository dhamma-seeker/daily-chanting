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
  const DAWN_HOUR = 6;
  const DAY = 86400000;
  const rad = d => d * Math.PI / 180;

  // JDE ของจันทร์ดับ (k จำนวนเต็ม) หรือจันทร์เพ็ญ (k ลงท้าย .5)
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
    const s = Math.sin;
    const full = Math.abs(k % 1) > 0.25;
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

  // ลำดับวัน (นับตามรุ่งอรุณของเวลาเครื่อง)
  function dayIndex(date) {
    const d = new Date(date.getTime() - DAWN_HOUR * 3600000);
    return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
  }
  const indexToDate = i => {
    const u = new Date(i * DAY);
    return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate(), 12);
  };

  // วันจันทร์เพ็ญ/ดับรอบ ๆ วันที่ให้มา
  function phasesAround(date) {
    const yrs = (date.getTime() - Date.UTC(2000, 0, 6)) / (365.25 * DAY);
    const k0 = Math.floor(yrs * 12.3685) - 2;
    const out = [];
    for (let k = k0; k <= k0 + 8; k += 0.5) {
      const t = jdeToDate(phaseJDE(k));
      out.push({ full: k % 1 !== 0, time: t, day: dayIndex(t) });
    }
    return out;
  }

  const TH = n => String(n).replace(/\d/g, d => "๐๑๒๓๔๕๖๗๘๙"[d]);

  // วันอุโบสถทั้งหมดในช่วงนั้น เรียงตามวัน
  function uposathaDays(date) {
    const ph = phasesAround(date);
    const days = [];
    for (let i = 1; i < ph.length; i++) {
      const prev = ph[i - 1], cur = ph[i];
      const side = cur.full ? "ขึ้น" : "แรม";
      const len = cur.day - prev.day;            // จำนวนวันของปักษ์นี้
      const end = cur.full ? "วันจันทร์เพ็ญ" : "วันจันทร์ดับ";
      days.push({ day: prev.day + 8, label: `${side} ${TH(8)} ค่ำ`, main: false });
      if (len >= 15) {
        days.push({ day: cur.day - 1, label: `${side} ${TH(14)} ค่ำ`, main: false });
        days.push({ day: cur.day, label: `${side} ${TH(15)} ค่ำ · ${end}`, main: true, time: cur.time });
      } else {
        days.push({ day: cur.day, label: `${side} ${TH(14)} ค่ำ · ${end} (ปักษ์ขาด)`, main: true, time: cur.time });
      }
    }
    return days.sort((a, b) => a.day - b.day);
  }

  // สถานะวันนี้ + วันอุโบสถถัดไป n วัน
  function status(now = new Date(), n = 6) {
    const today = dayIndex(now);
    const all = uposathaDays(now);
    const todayUpo = all.find(d => d.day === today) || null;
    const next = all.filter(d => d.day > today).slice(0, n)
      .map(d => ({ ...d, inDays: d.day - today, date: indexToDate(d.day) }));
    return { today: todayUpo && { ...todayUpo, date: indexToDate(today) }, next };
  }

  return { status, phaseJDE, jdeToDate, uposathaDays, dayIndex, TH };
})();

if (typeof module !== "undefined") module.exports = UPO;
