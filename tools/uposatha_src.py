# ============================================================
#  ต้นฉบับหมวดอุโบสถ (บาลีอักษรโรมัน + คำแปลไทยภาษาชาวบ้าน)
#  บาลีคัดจาก tripitaka-mcp.com (SuttaCentral bilara-data) ทุกท่อน
#  ส่วนที่ต้นฉบับย่อ (…pe…) เติมเต็มจากท่อนเต็มในสูตรเดียวกัน
#  สร้างไฟล์แอป: python3 -I tools/build_uposatha.py
# ============================================================
#  รูปแบบแต่ละท่อน:
#   ("ref", "บาลีโรมัน", "คำแปลไทย")   ท่อนสวด/อ่าน
#   ("head", "หัวข้อย่อย")
#   ("guide", "ข้อความไทยล้วน", "ref ถ้ามี")  คำอธิบาย ไม่มีบาลี
# ============================================================

BUDDHA = ("itipi so bhagavā arahaṁ sammāsambuddho vijjācaraṇasampanno sugato "
          "lokavidū anuttaro purisadammasārathi satthā devamanussānaṁ buddho bhagavā’ti")
DHAMMA = ("svākkhāto bhagavatā dhammo sandiṭṭhiko akāliko ehipassiko opaneyyiko "
          "paccattaṁ veditabbo viññūhī’ti")
SANGHA = ("suppaṭipanno bhagavato sāvakasaṅgho, ujuppaṭipanno bhagavato sāvakasaṅgho, "
          "ñāyappaṭipanno bhagavato sāvakasaṅgho, sāmīcippaṭipanno bhagavato sāvakasaṅgho, "
          "yadidaṁ cattāri purisayugāni aṭṭha purisapuggalā esa bhagavato sāvakasaṅgho "
          "āhuneyyo pāhuneyyo dakkhiṇeyyo añjalikaraṇīyo anuttaraṁ puññakkhettaṁ lokassā’ti")
SILA = ("attano sīlāni anussarati akhaṇḍāni acchiddāni asabalāni akammāsāni bhujissāni "
        "viññuppasatthāni aparāmaṭṭhāni samādhisaṁvattanikāni")
RESULT = "cittaṁ pasīdati, pāmojjaṁ uppajjati, ye cittassa upakkilesā te pahīyanti"
RESULT_TH = "ใจก็ผ่องใส ความเบิกบานก็เกิดขึ้น สิ่งที่ทำให้ใจหมองก็หลุดไป"

BUDDHA_TH = ("พระผู้มีพระภาคเจ้านั้น เป็นพระอรหันต์ ไกลจากกิเลส ตรัสรู้ชอบได้เอง "
             "ถึงพร้อมด้วยความรู้และความประพฤติ ไปดีแล้ว รู้แจ้งโลก "
             "เป็นผู้ฝึกคนที่ควรฝึกได้อย่างไม่มีใครยิ่งกว่า เป็นครูของเทวดาและมนุษย์ "
             "เป็นผู้รู้ ผู้ตื่น ผู้เบิกบาน เป็นผู้มีโชค ควรแก่การจำแนกธรรม")
DHAMMA_TH = ("พระธรรมที่พระผู้มีพระภาคเจ้าตรัสไว้ดีแล้ว เห็นได้ด้วยตัวเอง "
             "ไม่ขึ้นกับกาลเวลา ควรเรียกคนอื่นมาดูได้ ควรน้อมเข้ามาใส่ตัว "
             "คนมีปัญญารู้ได้เฉพาะตน")
SANGHA_TH = ("หมู่สาวกของพระผู้มีพระภาคเจ้า ปฏิบัติดี ปฏิบัติตรง ปฏิบัติเพื่อรู้ธรรม "
             "ปฏิบัติสมควร ได้แก่บุคคล ๔ คู่ นับเรียงตัวได้ ๘ ท่าน "
             "หมู่สาวกนี้ควรแก่ของที่เขานำมาบูชา ควรแก่การต้อนรับ ควรแก่ของทำบุญ "
             "ควรแก่การไหว้ เป็นนาบุญของโลกที่ไม่มีนาบุญใดยิ่งกว่า")
SILA_TH = ("ระลึกถึงศีลของตนเอง ที่ไม่ขาด ไม่ทะลุ ไม่ด่าง ไม่พร้อย "
           "เป็นไท (ไม่เป็นทาสตัณหา) ผู้รู้สรรเสริญ ไม่ยึดติดผิด ๆ และช่วยให้ใจตั้งมั่น")

DEVA = [
    "santi devā cātumahārājikā, santi devā tāvatiṁsā, santi devā yāmā, santi devā tusitā, "
    "santi devā nimmānaratino, santi devā paranimmitavasavattino, santi devā brahmakāyikā, "
    "santi devā tatuttari",
    "Yathārūpāya saddhāya samannāgatā tā devatā ito cutā tatthupapannā, mayhampi tathārūpā saddhā saṁvijjati",
    "Yathārūpena sīlena samannāgatā tā devatā ito cutā tatthupapannā, mayhampi tathārūpaṁ sīlaṁ saṁvijjati",
    "Yathārūpena sutena samannāgatā tā devatā ito cutā tatthupapannā, mayhampi tathārūpaṁ sutaṁ saṁvijjati",
    "Yathārūpena cāgena samannāgatā tā devatā ito cutā tatthupapannā, mayhampi tathārūpo cāgo saṁvijjati",
    "Yathārūpāya paññāya samannāgatā tā devatā ito cutā tatthupapannā, mayhampi tathārūpā paññā saṁvijjatī’ti",
]
DEVA_TH = [
    "เทวดาชั้นจาตุมหาราชิกามีอยู่ ชั้นดาวดึงส์มีอยู่ ชั้นยามามีอยู่ ชั้นดุสิตมีอยู่ "
    "ชั้นนิมมานรดีมีอยู่ ชั้นปรนิมมิตวสวัตดีมีอยู่ ชั้นพรหมกายิกามีอยู่ ชั้นที่สูงกว่านั้นก็มีอยู่",
    "เทวดาเหล่านั้นมีศรัทธาแบบใด จึงจุติจากโลกนี้ไปเกิดที่นั่น ศรัทธาแบบนั้นเราก็มี",
    "เทวดาเหล่านั้นมีศีลแบบใด จึงจุติจากโลกนี้ไปเกิดที่นั่น ศีลแบบนั้นเราก็มี",
    "เทวดาเหล่านั้นได้ฟังได้เรียนธรรมมาแบบใด จึงจุติจากโลกนี้ไปเกิดที่นั่น การได้ฟังได้เรียนแบบนั้นเราก็มี",
    "เทวดาเหล่านั้นมีการให้การเสียสละแบบใด จึงจุติจากโลกนี้ไปเกิดที่นั่น การเสียสละแบบนั้นเราก็มี",
    "เทวดาเหล่านั้นมีปัญญาแบบใด จึงจุติจากโลกนี้ไปเกิดที่นั่น ปัญญาแบบนั้นเราก็มี",
]

CLEAN = "upakkiliṭṭhassa cittassa upakkamena pariyodapanā hoti"
REFRAIN = "Imināpi aṅgena arahataṁ anukaromi, uposatho ca me upavuttho bhavissati"
REFRAIN_TH = "ด้วยองค์นี้ เราชื่อว่าทำตามพระอรหันต์ และอุโบสถของเราก็จะได้ชื่อว่ารักษาแล้ว"
AJJA = "ahampajja imañca rattiṁ imañca divasaṁ"
AJJA_TH = "วันนี้ เราก็ตลอดคืนนี้และวันนี้"

# ศีล ๘ (AN 3.70:19–26 = AN 8.41:2–9) : (ส่วนของพระอรหันต์, ส่วนของเรา, แปลพระอรหันต์, แปลเรา)
SILA8 = [
    ("pāṇātipātaṁ pahāya pāṇātipātā paṭiviratā nihitadaṇḍā nihitasatthā lajjī dayāpannā "
     "sabbapāṇabhūtahitānukampī viharanti",
     "pāṇātipātaṁ pahāya pāṇātipātā paṭivirato nihitadaṇḍo nihitasattho lajjī dayāpanno "
     "sabbapāṇabhūtahitānukampī viharāmi",
     "ละการฆ่าสัตว์ เว้นขาดจากการฆ่า วางไม้วางมีด มีความละอาย มีใจเอ็นดู "
     "เกื้อกูลอนุเคราะห์สัตว์ทุกชีวิต",
     "จะละการฆ่าสัตว์ เว้นขาดจากการฆ่า วางไม้วางมีด มีความละอาย มีใจเอ็นดู "
     "เกื้อกูลอนุเคราะห์สัตว์ทุกชีวิต"),
    ("adinnādānaṁ pahāya adinnādānā paṭiviratā dinnādāyī dinnapāṭikaṅkhī, athenena "
     "sucibhūtena attanā viharanti",
     "adinnādānaṁ pahāya adinnādānā paṭivirato dinnādāyī dinnapāṭikaṅkhī, athenena "
     "sucibhūtena attanā viharāmi",
     "ละการลักขโมย เว้นขาดจากการเอาของที่เจ้าของไม่ได้ให้ รับแต่ของที่เขาให้ "
     "หวังแต่ของที่เขาให้ มีใจสะอาด ไม่คิดขโมย",
     "จะละการลักขโมย เว้นขาดจากการเอาของที่เจ้าของไม่ได้ให้ รับแต่ของที่เขาให้ "
     "หวังแต่ของที่เขาให้ มีใจสะอาด ไม่คิดขโมย"),
    ("abrahmacariyaṁ pahāya brahmacārī ārācārī viratā methunā gāmadhammā",
     "abrahmacariyaṁ pahāya brahmacārī ārācārī virato methunā gāmadhammā",
     "ละการประพฤติที่ไม่ใช่พรหมจรรย์ ประพฤติพรหมจรรย์ อยู่ห่างไกล "
     "เว้นขาดจากการเสพเมถุนอันเป็นเรื่องของชาวบ้าน",
     "จะละการประพฤติที่ไม่ใช่พรหมจรรย์ ประพฤติพรหมจรรย์ อยู่ห่างไกล "
     "เว้นขาดจากการเสพเมถุนอันเป็นเรื่องของชาวบ้าน"),
    ("musāvādaṁ pahāya musāvādā paṭiviratā saccavādī saccasandhā thetā paccayikā "
     "avisaṁvādakā lokassa",
     "musāvādaṁ pahāya musāvādā paṭivirato saccavādī saccasandho theto paccayiko "
     "avisaṁvādako lokassa",
     "ละการพูดเท็จ เว้นขาดจากการพูดเท็จ พูดแต่คำจริง ยึดมั่นในความจริง "
     "พูดอย่างหนักแน่น เชื่อถือได้ ไม่หลอกลวงชาวโลก",
     "จะละการพูดเท็จ เว้นขาดจากการพูดเท็จ พูดแต่คำจริง ยึดมั่นในความจริง "
     "พูดอย่างหนักแน่น เชื่อถือได้ ไม่หลอกลวงชาวโลก"),
    ("surāmerayamajjapamādaṭṭhānaṁ pahāya surāmerayamajjapamādaṭṭhānā paṭiviratā",
     "surāmerayamajjapamādaṭṭhānaṁ pahāya surāmerayamajjapamādaṭṭhānā paṭivirato",
     "ละการดื่มสุราเมรัยและของมึนเมาที่เป็นเหตุให้ประมาท เว้นขาดจากสิ่งเหล่านั้น",
     "จะละการดื่มสุราเมรัยและของมึนเมาที่เป็นเหตุให้ประมาท เว้นขาดจากสิ่งเหล่านั้น"),
    ("ekabhattikā rattūparatā viratā vikālabhojanā",
     "ekabhattiko rattūparato virato vikālabhojanā",
     "กินมื้อเดียว งดกินกลางคืน เว้นขาดจากการกินนอกเวลา",
     "จะกินมื้อเดียว งดกินกลางคืน เว้นขาดจากการกินนอกเวลา"),
    ("naccagītavāditavisūkadassanamālāgandhavilepanadhāraṇamaṇḍanavibhūsanaṭṭhānā paṭiviratā",
     "naccagītavāditavisūkadassanamālāgandhavilepanadhāraṇamaṇḍanavibhūsanaṭṭhānā paṭivirato",
     "เว้นขาดจากการฟ้อนรำ ร้องเพลง เล่นดนตรี และดูการละเล่นที่เป็นข้าศึกต่อกุศล "
     "เว้นจากการทัดทรงดอกไม้ ใช้ของหอม ทาเครื่องลูบไล้ แต่งตัวประดับประดา",
     "จะเว้นขาดจากการฟ้อนรำ ร้องเพลง เล่นดนตรี และดูการละเล่นที่เป็นข้าศึกต่อกุศล "
     "เว้นจากการทัดทรงดอกไม้ ใช้ของหอม ทาเครื่องลูบไล้ แต่งตัวประดับประดา"),
    ("uccāsayanamahāsayanaṁ pahāya uccāsayanamahāsayanā paṭiviratā nīcaseyyaṁ kappenti "
     "mañcake vā tiṇasanthārake vā",
     "uccāsayanamahāsayanaṁ pahāya uccāsayanamahāsayanā paṭivirato nīcaseyyaṁ kappemi "
     "mañcake vā tiṇasanthārake vā",
     "ละที่นอนสูงที่นอนใหญ่หรูหรา เว้นขาดจากที่นอนเช่นนั้น นอนบนที่นอนต่ำ "
     "เป็นเตียงเล็กหรือเสื่อหญ้า",
     "จะละที่นอนสูงที่นอนใหญ่หรูหรา เว้นขาดจากที่นอนเช่นนั้น นอนบนที่นอนต่ำ "
     "เป็นเตียงเล็กหรือเสื่อหญ้า"),
]
NUM_TH = ["๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘"]


def sila8_segments():
    segs = [("AN 3.70:19.1",
             "Sa kho so ariyasāvako iti paṭisañcikkhati",
             "อริยสาวกนั้นพิจารณาอย่างนี้ว่า")]
    for i, (ar, me, ar_th, me_th) in enumerate(SILA8):
        last = i == len(SILA8) - 1
        refrain = REFRAIN[:-len("bhavissati")] + "bhavissatī’ti" if last else REFRAIN
        segs.append(("head", f"องค์ที่ {NUM_TH[i]}"))
        segs.append((f"AN 3.70:{19 + i}.1 · AN 8.41:{2 + i}.1",
                     f"Yāvajīvaṁ arahanto {ar}\n{AJJA} {me}\n{refrain}",
                     f"พระอรหันต์ทั้งหลาย ตลอดชีวิต {ar_th} "
                     f"{AJJA_TH} {me_th} {REFRAIN_TH}"))
    return segs


def anussati(name_th, ref_a, pali_obj, formula, formula_th, simile_ref, simile_obj,
             simile_th, simile_how, simile_how_th, ref_c, upo_word, saddhim, upo_th):
    """ชุดระลึก ๑ ข้อของ AN 3.70 : ระลึก -> ใจผ่องใส (+อุปมา) -> ชื่ออุโบสถ"""
    return [
        ("head", name_th),
        (ref_a,
         f"Idha ariyasāvako {pali_obj} anussarati\n{formula}",
         f"อริยสาวกในธรรมวินัยนี้ ระลึกถึง{formula_th}"),
        (simile_ref,
         f"Tassa {simile_obj} anussarato {RESULT}\n{simile_how}",
         f"เมื่อระลึกอยู่อย่างนี้ {RESULT_TH} {simile_th} {simile_how_th}"),
        (ref_c,
         f"Ayaṁ vuccati ariyasāvako {upo_word}uposathaṁ upavasati, {saddhim} saddhiṁ saṁvasati",
         upo_th),
    ]


CHANTS = {
    # ------------------------------------------------------------------
    "uposatha-lamdap": {
        "title": "ลำดับปฏิบัติวันอุโบสถ",
        "note": "สรุปจากพระสูตร กดชื่อบทในสารบัญเพื่อไปยังบทนั้น",
        "segments": [
            ("guide", "รอยต่อเวลาในแอปมี ๓ อย่าง ตามเวลาของเครื่อง: "
             "๑) วันขึ้นแรมเปลี่ยนตอน ๐๖:๐๐ ใช้บอกว่าวันนี้เป็นกี่ค่ำ · "
             "๒) การถืออุโบสถเริ่มค่ำ ๑๘:๐๐ ถึงค่ำวันรุ่งขึ้น ๑๘:๐๐ (พระสูตรนับ \"คืนนี้และวันนี้\" คืนก่อนวัน) · "
             "๓) พระสูตรประจำคืนสลับตอน ๐๖:๐๐ คืนหนึ่งนับจากเช้าถึงเช้า", ""),
            ("guide", "อุโบสถรักษา \"คืนหนึ่งกับวันหนึ่ง\" พระสูตรใช้คำว่า อิมัญจะ รัตติง อิมัญจะ ทิวะสัง "
             "(คืนนี้และวันนี้) นับคืนก่อนแล้วจึงวัน แอปจึงนับตั้งแต่ค่ำ ๑๘:๐๐ ถึงค่ำวันรุ่งขึ้น ๑๘:๐๐ "
             "ดูเวลาเริ่มและเวลาจบได้ที่ด้านบนของหน้านี้", "AN 3.70:19.3"),
            ("guide", "๑. ถึงเวลาเริ่ม (ค่ำ) ตั้งใจถืออุโบสถด้วยการพิจารณาศีล ๘ ทีละข้อ "
             "ว่าพระอรหันต์รักษาตลอดชีวิต เราจะรักษาตามท่านตลอดคืนนี้และวันพรุ่งนี้ "
             "(บท \"พิจารณาศีล ๘ ตามพระอรหันต์\") จะไปรับศีลจากพระที่วัดด้วยก็ได้ "
             "แต่พระสูตรแสดงการตั้งใจด้วยการพิจารณาเอง", "AN 3.70 · AN 8.41"),
            ("guide", "๒. ชำระใจด้วยการระลึก ๕ อย่าง คือ พระพุทธ พระธรรม พระสงฆ์ "
             "ศีลของตน และคุณธรรมของเทวดา เหมือนสระผม อาบน้ำ ซักผ้า เช็ดกระจก "
             "และหลอมทอง (บท \"ระลึก ๕ ประการ ชำระใจ\")", "AN 3.70:4–18"),
            ("guide", "๓. แผ่เมตตาไปทุกทิศ เป็นองค์ที่ ๙ ของอุโบสถ "
             "(บท \"แผ่เมตตา องค์ที่ ๙\")", "AN 9.18"),
            ("guide", "๔. กินมื้อเดียว ไม่กินกลางคืนและนอกเวลา คืนที่เริ่มถือจึงงดอาหารเย็น "
             "วันรุ่งขึ้นกินมื้อเดียว (อรรถกถาอธิบายว่านอกเวลาคือหลังเที่ยงวัน) "
             "ระหว่างวันอย่าปล่อยใจไปคิดว่าวันนี้กินอะไร พรุ่งนี้จะกินอะไร "
             "พระพุทธเจ้าตรัสว่าแบบนั้นเป็นอุโบสถของคนเลี้ยงวัว ได้ผลน้อย", "AN 3.70:2"),
            ("guide", "๕. ระหว่างวัน เข้าหาพระ ฟังธรรม อ่านธรรม "
             "นางวิสาขาและชาวศากยะก็ไปเฝ้าพระพุทธเจ้าในวันอุโบสถ "
             "เคารพพ่อแม่ ผู้ใหญ่ในตระกูล สมณพราหมณ์ และทำบุญ", "AN 3.70:1 · AN 10.46:1 · AN 3.37:1"),
            ("guide", "๖. กลางคืน ตื่นประพฤติธรรม (ปะฏิชาคะโรนติ) ภาวนาหรือสวดมนต์ "
             "เวลานอนให้นอนที่ต่ำ เช่น เสื่อหรือฟูกบาง ๆ บนพื้น", "AN 3.37:1.2 · AN 3.70:26"),
            ("guide", "๗. เมื่ออยู่อุโบสถครบแล้ว เช้าวันต่อมา ถวายข้าวน้ำแก่พระสงฆ์ตามสมควร "
             "ด้วยใจเลื่อมใสยินดี (บท \"เช้าวันรุ่งขึ้น\")", "Snp 2.14:29"),
            ("guide", "๘. รักษาให้สม่ำเสมอทุกวันอุโบสถ ไม่ใช่บางครั้งบางคราว "
             "(บท \"อานิสงส์อุโบสถ\")", "AN 10.46"),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-wan": {
        "title": "วันอุโบสถตามพระสูตร",
        "note": "วันที่ ๘, ๑๔ และ ๑๕ ของแต่ละปักษ์ (ข้างขึ้นและข้างแรม)",
        "segments": [
            ("AN 3.37:1.1–1.2",
             "Aṭṭhamiyaṁ, bhikkhave, pakkhassa catunnaṁ mahārājānaṁ amaccā pārisajjā imaṁ lokaṁ anuvicaranti: "
             "‘kacci bahū manussā manussesu matteyyā petteyyā sāmaññā brahmaññā kule jeṭṭhāpacāyino "
             "uposathaṁ upavasanti paṭijāgaronti puññāni karontī’ti",
             "ดูก่อนภิกษุทั้งหลาย ในวัน ๘ ค่ำของปักษ์ อำมาตย์และบริวารของท้าวมหาราชทั้งสี่ "
             "เที่ยวตรวจดูโลกว่า มนุษย์ส่วนมากเคารพแม่ เคารพพ่อ เคารพสมณะ เคารพพราหมณ์ "
             "นอบน้อมผู้ใหญ่ในตระกูล รักษาอุโบสถ ตื่นอยู่ประพฤติธรรม และทำบุญกันอยู่หรือเปล่า"),
            ("AN 3.37:1.3",
             "Cātuddasiṁ, bhikkhave, pakkhassa catunnaṁ mahārājānaṁ puttā imaṁ lokaṁ anuvicaranti",
             "ในวัน ๑๔ ค่ำของปักษ์ โอรสของท้าวมหาราชทั้งสี่เที่ยวตรวจดูโลก (ด้วยเรื่องเดียวกัน)"),
            ("AN 3.37:1.5",
             "Tadahu, bhikkhave, uposathe pannarase cattāro mahārājāno sāmaññeva imaṁ lokaṁ anuvicaranti",
             "ในวันอุโบสถ ๑๕ ค่ำ ท้าวมหาราชทั้งสี่เสด็จตรวจดูโลกด้วยพระองค์เอง"),
            ("head", "คาถาของท้าวสักกะ"),
            ("AN 3.37:5.1–5.6",
             "Cātuddasiṁ pañcadasiṁ,\nyā ca pakkhassa aṭṭhamī;\nPāṭihāriyapakkhañca,\n"
             "aṭṭhaṅgasusamāgataṁ;\nUposathaṁ upavaseyya,\nyopissa mādiso naro’ti",
             "ผู้ใดอยากเป็นอย่างเรา ผู้นั้นพึงรักษาอุโบสถที่ประกอบด้วยองค์ ๘ ให้ดี "
             "ในวัน ๑๔ ค่ำ ๑๕ ค่ำ และ ๘ ค่ำของปักษ์ รวมทั้งในปาฏิหาริยปักษ์"),
            ("guide", "พระพุทธเจ้าตรัสต่อว่า คาถานี้ถ้าท้าวสักกะกล่าวยังไม่ดีนัก "
             "เพราะท้าวสักกะยังมีราคะ โทสะ โมหะ ถ้าพระอรหันต์เป็นผู้กล่าวจึงสมควร", "AN 3.37:6–9"),
            ("head", "จากธัมมิกสูตร"),
            ("Snp 2.14:28.1–28.4",
             "Tato ca pakkhassupavassuposathaṁ,\nCātuddasiṁ pañcadasiñca aṭṭhamiṁ;\n"
             "Pāṭihāriyapakkhañca pasannamānaso,\nAṭṭhaṅgupetaṁ susamattarūpaṁ",
             "แต่นั้น พึงมีใจเลื่อมใส รักษาอุโบสถที่ประกอบด้วยองค์ ๘ ให้ครบถ้วนบริบูรณ์ "
             "ในวัน ๑๔ ค่ำ ๑๕ ค่ำ และ ๘ ค่ำของปักษ์ รวมทั้งในปาฏิหาริยปักษ์"),
            ("guide", "วิธีนับวันในแอปนี้: ใช้เวลาข้างขึ้นข้างแรมจริงทางดาราศาสตร์ "
             "๘ ค่ำ คือวันที่ดวงจันทร์สว่างครึ่งดวง (ทั้งข้างขึ้นและข้างแรม) "
             "๑๕ ค่ำ คือวันจันทร์เพ็ญหรือจันทร์ดับ และถือ ๑๔ ค่ำ ซึ่งเป็นวันก่อนหน้าด้วย ตามที่พระสูตรระบุทั้ง ๑๔ และ ๑๕ "
             "แต่ละวันเริ่มค่ำ ๑๘:๐๐ เพราะพระสูตรนับ \"คืนนี้และวันนี้\" คืนก่อนวัน "
             "จึงอาจต่างจากปฏิทินจันทรคติไทย ส่วนปาฏิหาริยปักษ์ พระสูตรไม่ได้ระบุวัน "
             "อรรถกถาอธิบายไว้หลายแบบ แอปจึงไม่นับรวม", ""),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-sam": {
        "title": "อุโบสถ ๓ อย่าง",
        "note": "อุโปสถสูตร (AN 3.70) พระพุทธเจ้าตรัสกับนางวิสาขา",
        "segments": [
            ("AN 3.70:1.3–1.5",
             "Atha kho visākhā migāramātā tadahuposathe yena bhagavā tenupasaṅkami\n"
             "“handa kuto nu tvaṁ, visākhe, āgacchasi divā divassā”ti?\n"
             "“Uposathāhaṁ, bhante, ajja upavasāmī”ti",
             "ในวันอุโบสถ นางวิสาขามิคารมาตาเข้าไปเฝ้าพระผู้มีพระภาคเจ้า "
             "พระองค์ตรัสถามว่า วิสาขา เธอมาจากไหนแต่วัน นางทูลว่า "
             "วันนี้หม่อมฉันรักษาอุโบสถเจ้าค่ะ"),
            ("AN 3.70:2.1–2.3",
             "Tayo khome, visākhe, uposathā. Katame tayo? "
             "Gopālakuposatho, nigaṇṭhuposatho, ariyuposatho",
             "วิสาขา อุโบสถมี ๓ อย่าง คือ อุโบสถแบบคนเลี้ยงวัว อุโบสถแบบนิครนถ์ "
             "และอุโบสถแบบพระอริยะ"),
            ("head", "๑. อุโบสถแบบคนเลี้ยงวัว (ได้ผลน้อย)"),
            ("AN 3.70:2.5–2.7",
             "Seyyathāpi, visākhe, gopālako sāyanhasamaye sāmikānaṁ gāvo niyyātetvā iti paṭisañcikkhati: "
             "‘ajja kho gāvo amukasmiñca amukasmiñca padese cariṁsu, amukasmiñca amukasmiñca padese "
             "pānīyāni piviṁsu; sve dāni gāvo amukasmiñca amukasmiñca padese carissanti, "
             "amukasmiñca amukasmiñca padese pānīyāni pivissantī’ti",
             "เหมือนคนเลี้ยงวัว ตอนเย็นส่งวัวคืนเจ้าของแล้วคิดว่า วันนี้วัวไปกินหญ้าที่นั่นที่นี่ "
             "กินน้ำที่นั่นที่นี่ พรุ่งนี้วัวจะไปกินหญ้าที่นั่นที่นี่ กินน้ำที่นั่นที่นี่"),
            ("AN 3.70:2.8–2.11",
             "evamevaṁ kho, visākhe, idhekacco uposathiko iti paṭisañcikkhati: "
             "‘ahaṁ khvajja idañcidañca khādanīyaṁ khādiṁ, idañcidañca bhojanīyaṁ bhuñjiṁ; "
             "sve dānāhaṁ idañcidañca khādanīyaṁ khādissāmi, idañcidañca bhojanīyaṁ bhuñjissāmī’ti. "
             "So tena abhijjhāsahagatena cetasā divasaṁ atināmeti",
             "คนถืออุโบสถบางคนก็เป็นอย่างนั้น คิดว่า วันนี้เรากินของว่างนี่ กินข้าวนี่ "
             "พรุ่งนี้จะกินของว่างนี่ กินข้าวนี่ เขาปล่อยวันให้ผ่านไปด้วยใจที่อยากได้"),
            ("AN 3.70:2.13",
             "Evaṁ upavuttho kho, visākhe, gopālakuposatho na mahapphalo hoti na mahānisaṁso "
             "na mahājutiko na mahāvipphāro",
             "อุโบสถแบบคนเลี้ยงวัวที่รักษาอย่างนี้ ไม่มีผลมาก ไม่มีอานิสงส์มาก "
             "ไม่รุ่งเรืองมาก ไม่แผ่ไพศาลมาก"),
            ("head", "๒. อุโบสถแบบนิครนถ์ (ได้ผลน้อย)"),
            ("guide", "นักบวชนิครนถ์สอนให้เว้นการทำร้ายสัตว์เฉพาะที่อยู่ไกลเกินร้อยโยชน์ "
             "และในวันอุโบสถให้เปลื้องผ้าแล้วพูดว่า เราไม่ใช่ของใคร ไม่มีอะไรเป็นของเรา "
             "ทั้งที่พ่อแม่ ลูกเมีย คนรับใช้ ยังรู้กันอยู่ว่าเป็นของกันและกัน", "AN 3.70:3.1–3.23"),
            ("AN 3.70:3.24–3.27",
             "Iti yasmiṁ samaye sacce samādapetabbā musāvāde tasmiṁ samaye samādapenti. "
             "Idaṁ tassa musāvādasmiṁ vadāmi. So tassā rattiyā accayena bhoge adinnaṁyeva paribhuñjati. "
             "Idaṁ tassa adinnādānasmiṁ vadāmi",
             "เวลาที่ควรชวนให้พูดจริง กลับชวนให้พูดเท็จ เราเรียกข้อนี้ว่าพูดเท็จ "
             "พอสิ้นคืนนั้น เขาก็กลับมาใช้ทรัพย์สมบัติที่ไม่มีใครให้คืน เราเรียกข้อนี้ว่าลักทรัพย์"),
            ("AN 3.70:3.29",
             "Evaṁ upavuttho kho, visākhe, nigaṇṭhuposatho na mahapphalo hoti na mahānisaṁso "
             "na mahājutiko na mahāvipphāro",
             "อุโบสถแบบนิครนถ์ที่รักษาอย่างนี้ ไม่มีผลมาก ไม่มีอานิสงส์มาก "
             "ไม่รุ่งเรืองมาก ไม่แผ่ไพศาลมาก"),
            ("head", "๓. อุโบสถแบบพระอริยะ (ได้ผลมาก)"),
            ("AN 3.70:4.1–4.2",
             f"Kathañca, visākhe, ariyuposatho hoti? {CLEAN[0].upper() + CLEAN[1:]}",
             "อุโบสถแบบพระอริยะเป็นอย่างไร คือ การชำระใจที่หมองให้ผ่องใสด้วยความพยายาม "
             "(ทำได้ ๕ วิธี ดูบท \"ระลึก ๕ ประการ ชำระใจ\" แล้วตามด้วยการพิจารณาศีล ๘)"),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-anussati": {
        "title": "ระลึก ๕ ประการ ชำระใจ",
        "note": "อุโบสถแบบพระอริยะ (AN 3.70:4–18) อ่านหรือสวดเพื่อระลึกตามทีละข้อ",
        "segments": (
            anussati("๑. ระลึกถึงพระพุทธเจ้า เหมือนสระผม", "AN 3.70:4.4–4.5", "tathāgataṁ",
                     BUDDHA, "พระตถาคตว่า " + BUDDHA_TH, "AN 3.70:4.6 · 5.2", "tathāgataṁ",
                     "เหมือนศีรษะที่สกปรก สะอาดได้ด้วยความพยายาม",
                     "Kakkañca paṭicca mattikañca paṭicca udakañca paṭicca purisassa ca tajjaṁ vāyāmaṁ paṭicca",
                     "อาศัยผงขัดผม ดินสระผม น้ำ และความพยายามที่เหมาะสมของคนนั้น",
                     "AN 3.70:6.6", "brahm", "brahmunā",
                     "นี่เรียกว่าอริยสาวกอยู่อุโบสถของพรหม (คือพระพุทธเจ้า) อยู่ร่วมกับพรหม")
            + anussati("๒. ระลึกถึงพระธรรม เหมือนอาบน้ำชำระกาย", "AN 3.70:7.3–7.4", "dhammaṁ",
                       DHAMMA, "พระธรรมว่า " + DHAMMA_TH, "AN 3.70:7.5 · 8.2", "dhammaṁ",
                       "เหมือนร่างกายที่สกปรก สะอาดได้ด้วยความพยายาม",
                       "Sottiñca paṭicca, cuṇṇañca paṭicca, udakañca paṭicca, purisassa ca tajjaṁ vāyāmaṁ paṭicca",
                       "อาศัยเครื่องขัดตัว ผงอาบน้ำ น้ำ และความพยายามที่เหมาะสมของคนนั้น",
                       "AN 3.70:9.5", "dhamm", "dhammena",
                       "นี่เรียกว่าอริยสาวกอยู่อุโบสถของธรรม อยู่ร่วมกับธรรม")
            + anussati("๓. ระลึกถึงพระสงฆ์ เหมือนซักผ้า", "AN 3.70:10.3–10.4", "saṅghaṁ",
                       SANGHA, "พระสงฆ์ว่า " + SANGHA_TH, "AN 3.70:10.5 · 11.2", "saṅghaṁ",
                       "เหมือนผ้าที่สกปรก สะอาดได้ด้วยความพยายาม",
                       "Usmañca paṭicca, khārañca paṭicca, gomayañca paṭicca, udakañca paṭicca, "
                       "purisassa ca tajjaṁ vāyāmaṁ paṭicca",
                       "อาศัยความร้อน น้ำด่าง มูลโค น้ำ และความพยายามที่เหมาะสมของคนนั้น",
                       "AN 3.70:12.5", "saṅgh", "saṅghena",
                       "นี่เรียกว่าอริยสาวกอยู่อุโบสถของสงฆ์ อยู่ร่วมกับสงฆ์")
            + [
                ("head", "๔. ระลึกถึงศีลของตน เหมือนเช็ดกระจก"),
                ("AN 3.70:13.3", f"Idha ariyasāvako {SILA}", "อริยสาวกในธรรมวินัยนี้ " + SILA_TH),
                ("AN 3.70:13.4 · 14.2",
                 f"Tassa sīlaṁ anussarato {RESULT}\nTelañca paṭicca, chārikañca paṭicca, "
                 "vālaṇḍupakañca paṭicca, purisassa ca tajjaṁ vāyāmaṁ paṭicca",
                 f"เมื่อระลึกอยู่อย่างนี้ {RESULT_TH} เหมือนกระจกที่หมอง ใสได้ด้วยความพยายาม "
                 "อาศัยน้ำมัน ขี้เถ้า แปรงขนสัตว์ และความพยายามที่เหมาะสมของคนนั้น"),
                ("AN 3.70:15.4",
                 "Ayaṁ vuccati ariyasāvako sīluposathaṁ upavasati, sīlena saddhiṁ saṁvasati",
                 "นี่เรียกว่าอริยสาวกอยู่อุโบสถของศีล อยู่ร่วมกับศีล"),
                ("head", "๕. ระลึกถึงเทวดา เหมือนหลอมทอง"),
                ("AN 3.70:16.3–16.4",
                 f"Idha ariyasāvako devatā anussarati\n‘{DEVA[0]}",
                 "อริยสาวกในธรรมวินัยนี้ ระลึกถึงเทวดาว่า " + DEVA_TH[0]),
            ]
            + [(f"AN 3.70:16.{5 + i}", DEVA[1 + i], DEVA_TH[1 + i]) for i in range(5)]
            + [
                ("AN 3.70:16.10 · 17.2",
                 "Tassa attano ca tāsañca devatānaṁ saddhañca sīlañca sutañca cāgañca paññañca "
                 f"anussarato {RESULT}\nUkkañca paṭicca, loṇañca paṭicca, gerukañca paṭicca, "
                 "nāḷikasaṇḍāsañca paṭicca, purisassa ca tajjaṁ vāyāmaṁ paṭicca",
                 "เมื่อระลึกถึงศรัทธา ศีล สุตะ จาคะ ปัญญา ทั้งของตนและของเทวดาเหล่านั้น "
                 f"{RESULT_TH} เหมือนทองที่หมอง บริสุทธิ์ได้ด้วยความพยายาม "
                 "อาศัยเตาหลอม เกลือ ดินแดง ท่อเป่าลมและคีม และความพยายามที่เหมาะสมของคนนั้น"),
                ("AN 3.70:18.10",
                 "Ayaṁ vuccati ariyasāvako devatuposathaṁ upavasati, devatāhi saddhiṁ saṁvasati",
                 "นี่เรียกว่าอริยสาวกอยู่อุโบสถของเทวดา อยู่ร่วมกับเทวดา"),
            ]
        ),
    },
    # ------------------------------------------------------------------
    "uposatha-sila8": {
        "title": "พิจารณาศีล ๘ ตามพระอรหันต์",
        "note": "AN 3.70:19–27 (ตรงกับ AN 8.41) สวดหรืออ่านทีละข้อเพื่อตั้งใจถืออุโบสถ",
        "segments": sila8_segments() + [
            ("AN 3.70:27.1–27.2",
             "Evaṁ kho, visākhe, ariyuposatho hoti. Evaṁ upavuttho kho, visākhe, ariyuposatho "
             "mahapphalo hoti mahānisaṁso mahājutiko mahāvipphāro",
             "วิสาขา อุโบสถแบบพระอริยะเป็นอย่างนี้ อุโบสถแบบพระอริยะที่รักษาอย่างนี้ "
             "มีผลมาก มีอานิสงส์มาก รุ่งเรืองมาก แผ่ไพศาลมาก"),
            ("head", "คาถาสรุปศีล ๘ (ท่องสั้น)"),
            ("AN 3.70:35.1–36.4",
             "Pāṇaṁ na haññe na cadinnamādiye,\nMusā na bhāse na ca majjapo siyā;\n"
             "Abrahmacariyā virameyya methunā,\nRattiṁ na bhuñjeyya vikālabhojanaṁ.\n"
             "Mālaṁ na dhāre na ca gandhamācare,\nMañce chamāyaṁ va sayetha santhate;\n"
             "Etañhi aṭṭhaṅgikamāhuposathaṁ,\nBuddhena dukkhantagunā pakāsitaṁ",
             "ไม่พึงฆ่าสัตว์ ไม่พึงถือเอาของที่เขาไม่ให้ ไม่พึงพูดเท็จ ไม่พึงดื่มน้ำเมา "
             "พึงเว้นจากเมถุนอันไม่ใช่พรหมจรรย์ ไม่พึงกินอาหารในเวลาวิกาลตอนกลางคืน "
             "ไม่พึงทัดทรงดอกไม้ ไม่พึงใช้ของหอม พึงนอนบนเตียงเล็กหรือบนพื้นที่ปูลาด "
             "นี่แหละคืออุโบสถองค์ ๘ ที่พระพุทธเจ้าผู้ถึงที่สุดแห่งทุกข์ทรงประกาศไว้"),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-metta": {
        "title": "แผ่เมตตา องค์ที่ ๙",
        "note": "นวังคุโปสถสูตร (AN 9.18) อุโบสถองค์ ๘ เพิ่มเมตตาเป็นองค์ที่ ๙",
        "segments": [
            ("AN 9.18:3.1",
             "Mettāsahagatena cetasā ekaṁ disaṁ pharitvā viharati, tathā dutiyaṁ tathā tatiyaṁ "
             "tathā catutthaṁ.\nIti uddhamadho tiriyaṁ sabbadhi sabbattatāya sabbāvantaṁ lokaṁ "
             "mettāsahagatena cetasā vipulena mahaggatena appamāṇena averena abyāpajjena "
             "pharitvā viharati",
             "แผ่ใจที่ประกอบด้วยเมตตาไปทิศที่หนึ่ง ทิศที่สอง ทิศที่สาม ทิศที่สี่ ก็อย่างนั้น "
             "ทั้งข้างบน ข้างล่าง ด้านขวาง ทั่วทุกหนแห่ง แผ่ไปทั่วโลกที่มีสัตว์ทุกหมู่เหล่า "
             "ด้วยใจที่ประกอบด้วยเมตตา กว้างขวาง ยิ่งใหญ่ ไม่มีประมาณ ไม่มีเวร ไม่มีความเบียดเบียน"),
            ("AN 9.18:3.2 · 4.1",
             "Iminā navamena aṅgena samannāgato hoti.\nEvaṁ upavuttho kho, bhikkhave, navahaṅgehi "
             "samannāgato uposatho mahapphalo hoti mahānisaṁso mahājutiko mahāvipphāro",
             "นี่คือองค์ที่ ๙ ภิกษุทั้งหลาย อุโบสถที่ประกอบด้วยองค์ ๙ ที่รักษาอย่างนี้ "
             "มีผลมาก มีอานิสงส์มาก รุ่งเรืองมาก แผ่ไพศาลมาก"),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-phrungni": {
        "title": "เช้าวันรุ่งขึ้น",
        "note": "ธัมมิกสูตร (Snp 2.14) หลังอยู่อุโบสถครบคืนหนึ่งวันหนึ่ง",
        "segments": [
            ("Snp 2.14:29.1–29.4",
             "Tato ca pāto upavutthuposatho,\nAnnena pānena ca bhikkhusaṅghaṁ;\n"
             "Pasannacitto anumodamāno,\nYathārahaṁ saṁvibhajetha viññū",
             "ผู้มีปัญญา อยู่อุโบสถครบแล้ว เช้าวันรุ่งขึ้นพึงมีใจเลื่อมใส ยินดีตาม "
             "แบ่งข้าวและน้ำถวายแด่ภิกษุสงฆ์ตามสมควร"),
            ("Snp 2.14:30.1–30.4",
             "Dhammena mātāpitaro bhareyya,\nPayojaye dhammikaṁ so vaṇijjaṁ;\n"
             "Etaṁ gihī vattayamappamatto,\nSayampabhe nāma upeti deve’ti",
             "พึงเลี้ยงดูพ่อแม่โดยชอบธรรม ประกอบอาชีพค้าขายที่ชอบธรรม "
             "คฤหัสถ์ผู้ไม่ประมาท ประพฤติข้อปฏิบัตินี้อยู่ ย่อมไปเกิดในหมู่เทวดาชื่อสยัมปภา (ผู้มีแสงในตัว)"),
        ],
    },
    # ------------------------------------------------------------------
    "uposatha-anisong": {
        "title": "อานิสงส์อุโบสถ",
        "note": "AN 3.70:28–40 และ AN 10.46",
        "segments": [
            ("AN 3.70:28.2–28.3",
             "Seyyathāpi, visākhe, yo imesaṁ soḷasannaṁ mahājanapadānaṁ pahūtarattaratanānaṁ "
             "issariyādhipaccaṁ rajjaṁ kāreyya, seyyathidaṁ: aṅgānaṁ, magadhānaṁ, kāsīnaṁ, kosalānaṁ, "
             "vajjīnaṁ, mallānaṁ, cetīnaṁ, vaṅgānaṁ, kurūnaṁ, pañcālānaṁ, macchānaṁ, sūrasenānaṁ, "
             "assakānaṁ, avantīnaṁ, gandhārānaṁ, kambojānaṁ, aṭṭhaṅgasamannāgatassa uposathassa "
             "etaṁ kalaṁ nāgghati soḷasiṁ",
             "วิสาขา สมมติว่ามีคนได้ครองราชย์เป็นใหญ่ในมหาชนบท ๑๖ แคว้นที่มีรัตนะ ๗ มากมาย "
             "คือ อังคะ มคธ กาสี โกศล วัชชี มัลละ เจตี วังสะ กุรุ ปัญจาละ มัจฉะ สุรเสนะ "
             "อัสสกะ อวันตี คันธาระ กัมโพชะ การครองราชย์นั้น ยังมีค่าไม่ถึงหนึ่งในสิบหก "
             "ของอุโบสถที่ประกอบด้วยองค์ ๘"),
            ("AN 3.70:28.4–28.5",
             "Taṁ kissa hetu? Kapaṇaṁ, visākhe, mānusakaṁ rajjaṁ dibbaṁ sukhaṁ upanidhāya",
             "เพราะอะไร เพราะความเป็นราชาของมนุษย์ เมื่อเทียบกับความสุขของเทวดาแล้ว เป็นของต่ำต้อย"),
        ] + [
            (f"AN 3.70:{n}.1–{n}.5",
             f"{opening}, {gen} devānaṁ eso eko rattindivo. "
             "Tāya rattiyā tiṁsarattiyo māso. Tena māsena dvādasamāsiyo saṁvaccharo. "
             f"Tena saṁvaccharena {life} {gen} devānaṁ āyuppamāṇaṁ.\n"
             "Ṭhānaṁ kho panetaṁ, visākhe, vijjati yaṁ idhekacco itthī vā puriso vā "
             "aṭṭhaṅgasamannāgataṁ uposathaṁ upavasitvā kāyassa bhedā paraṁ maraṇā "
             f"{gen} devānaṁ sahabyataṁ upapajjeyya",
             f"เวลา {hum_th} ปีของมนุษย์ เท่ากับหนึ่งวันหนึ่งคืนของเทวดาชั้น{deva_th} "
             f"สามสิบวันเป็นหนึ่งเดือน สิบสองเดือนเป็นหนึ่งปี เทวดาชั้น{deva_th}มีอายุ {life_th} ปีทิพย์ "
             "เป็นไปได้ที่หญิงหรือชายบางคนในโลกนี้ รักษาอุโบสถองค์ ๘ แล้ว "
             f"เมื่อตายไปจะได้ไปเกิดร่วมกับเทวดาชั้น{deva_th}")
            for n, opening, gen, life, hum_th, deva_th, life_th in [
                (29, "Yāni, visākhe, mānusakāni paññāsa vassāni", "cātumahārājikānaṁ",
                 "dibbāni pañca vassasatāni", "๕๐", "จาตุมหาราชิกา", "๕๐๐"),
                (30, "Yaṁ, visākhe, mānusakaṁ vassasataṁ", "tāvatiṁsānaṁ",
                 "dibbaṁ vassasahassaṁ", "๑๐๐", "ดาวดึงส์", "๑,๐๐๐"),
                (31, "Yāni, visākhe, mānusakāni dve vassasatāni", "yāmānaṁ",
                 "dibbāni dve vassasahassāni", "๒๐๐", "ยามา", "๒,๐๐๐"),
                (32, "Yāni, visākhe, mānusakāni cattāri vassasatāni", "tusitānaṁ",
                 "dibbāni cattāri vassasahassāni", "๔๐๐", "ดุสิต", "๔,๐๐๐"),
                (33, "Yāni, visākhe, mānusakāni aṭṭha vassasatāni", "nimmānaratīnaṁ",
                 "dibbāni aṭṭha vassasahassāni", "๘๐๐", "นิมมานรดี", "๘,๐๐๐"),
                (34, "Yāni, visākhe, mānusakāni soḷasa vassasatāni", "paranimmitavasavattīnaṁ",
                 "dibbāni soḷasa vassasahassāni", "๑,๖๐๐", "ปรนิมมิตวสวัตดี", "๑๖,๐๐๐"),
            ]
        ] + [
            ("head", "คาถาท้ายสูตร"),
            ("AN 3.70:37.1–39.3",
             "Cando ca suriyo ca ubho sudassanā,\nObhāsayaṁ anupariyanti yāvatā;\n"
             "Tamonudā te pana antalikkhagā,\nNabhe pabhāsanti disāvirocanā.\n"
             "Etasmiṁ yaṁ vijjati antare dhanaṁ,\nMuttā maṇi veḷuriyañca bhaddakaṁ;\n"
             "Siṅgī suvaṇṇaṁ atha vāpi kañcanaṁ,\nYaṁ jātarūpaṁ haṭakanti vuccati.\n"
             "Aṭṭhaṅgupetassa uposathassa,\nKalampi te nānubhavanti soḷasiṁ;\n"
             "Candappabhā tāragaṇā ca sabbe",
             "ดวงจันทร์และดวงอาทิตย์ งามน่าดูทั้งคู่ โคจรส่องแสงไปไกลเท่าใด ขจัดความมืด "
             "เคลื่อนไปในอากาศ ส่องสว่างทั่วทิศบนท้องฟ้า ทรัพย์ใดมีอยู่ในระหว่างนั้น "
             "ทั้งไข่มุก แก้วมณี ไพฑูรย์อย่างดี ทองสิงคี ทองคำ ทองกาญจนา ทองชาตรูปที่เรียกว่าหฏกะ "
             "ทรัพย์ทั้งหมดนั้น รวมทั้งแสงจันทร์และหมู่ดาวทั้งปวง "
             "ยังมีค่าไม่ถึงหนึ่งในสิบหกของอุโบสถที่ประกอบด้วยองค์ ๘"),
            ("AN 3.70:40.1–40.4",
             "Tasmā hi nārī ca naro ca sīlavā,\nAṭṭhaṅgupetaṁ upavassuposathaṁ;\n"
             "Puññāni katvāna sukhudrayāni,\nAninditā saggamupenti ṭhānan’ti",
             "เพราะฉะนั้น หญิงและชายผู้มีศีล รักษาอุโบสถที่ประกอบด้วยองค์ ๘ "
             "ทำบุญที่ให้ผลเป็นสุข ไม่มีใครติเตียนได้ ย่อมไปสู่สวรรค์"),
            ("head", "ควรรักษาสม่ำเสมอ (สักกสูตร)"),
            ("AN 10.46:1.3–1.4",
             "“api nu tumhe, sakkā, aṭṭhaṅgasamannāgataṁ uposathaṁ upavasathā”ti?\n"
             "“Appekadā mayaṁ, bhante, aṭṭhaṅgasamannāgataṁ uposathaṁ upavasāma, appekadā na upavasāmā”ti",
             "ในวันอุโบสถ พระพุทธเจ้าตรัสถามอุบาสกชาวศากยะว่า พวกท่านรักษาอุโบสถองค์ ๘ กันไหม "
             "ชาวศากยะทูลว่า บางครั้งก็รักษา บางครั้งก็ไม่ได้รักษา พระเจ้าข้า"),
            ("AN 10.46:1.5",
             "Tesaṁ vo, sakkā, alābhā tesaṁ dulladdhaṁ, ye tumhe evaṁ sokasabhaye jīvite "
             "maraṇasabhaye jīvite appekadā aṭṭhaṅgasamannāgataṁ uposathaṁ upavasatha, "
             "appekadā na upavasatha",
             "ชาวศากยะทั้งหลาย ไม่ใช่ลาภของพวกท่านเลย พวกท่านได้ไม่ดีแล้ว "
             "ชีวิตที่มีภัยคือความโศกและความตายอย่างนี้ พวกท่านยังรักษาอุโบสถเป็นบางครั้ง "
             "ไม่รักษาเป็นบางครั้ง"),
            ("AN 10.46:6.2–6.5",
             "api nu so puriso bhogahetu bhoganidānaṁ bhogādhikaraṇaṁ ekaṁ vā rattiṁ ekaṁ vā "
             "divasaṁ upaḍḍhaṁ vā rattiṁ upaḍḍhaṁ vā divasaṁ ekantasukhappaṭisaṁvedī vihareyyā’ti?\n"
             "“No hetaṁ, bhante. Kāmā hi, bhante, aniccā tucchā musā mosadhammā”ti",
             "(คนที่หาเงินได้วันละร้อยละพัน เก็บสะสมไว้จนอายุร้อยปี) "
             "เขาจะมีความสุขล้วน ๆ เพราะทรัพย์นั้น แม้คืนเดียว วันเดียว หรือครึ่งคืนครึ่งวันได้ไหม "
             "ชาวศากยะทูลว่า ไม่ได้เลย พระเจ้าข้า เพราะกามไม่เที่ยง ว่างเปล่า หลอกลวง มีความหลอกลวงเป็นธรรมดา"),
            ("AN 10.46:12.9",
             "Idha mama sāvako ekaṁ rattindivaṁ appamatto ātāpī pahitatto viharanto yathā "
             "mayānusiṭṭhaṁ tathā paṭipajjamāno satampi vassāni satampi vassasatāni satampi "
             "vassasahassāni ekantasukhappaṭisaṁvedī vihareyya, so ca khvassa sakadāgāmī vā "
             "anāgāmī vā apaṇṇakaṁ vā sotāpanno",
             "ส่วนสาวกของเรา ไม่ประมาท มีความเพียร ตั้งใจมั่น ปฏิบัติตามที่เราสอน "
             "แม้เพียงคืนหนึ่งวันหนึ่ง ก็อาจมีความสุขล้วน ๆ ได้ร้อยปี หมื่นปี แสนปี "
             "และอาจเป็นพระสกทาคามี พระอนาคามี หรืออย่างน้อยเป็นพระโสดาบันแน่นอน"),
            ("AN 10.46:12.11",
             "“Ete mayaṁ, bhante, ajjatagge aṭṭhaṅgasamannāgataṁ uposathaṁ upavasissāmā”ti",
             "ชาวศากยะทูลว่า ตั้งแต่วันนี้เป็นต้นไป พวกข้าพระองค์จะรักษาอุโบสถองค์ ๘ พระเจ้าข้า"),
        ],
    },
}

SESSION = {
    "id": "uposatha",
    "title": "วันอุโบสถ",
    "icon": "🌕",
    "order": [
        "uposatha-lamdap",
        "uposatha-wan",
        "uposatha-sila8",
        "uposatha-anussati",
        "uposatha-metta",
        "phae-metta",
        "uposatha-sam",
        "uposatha-phrungni",
        "uposatha-anisong",
    ],
}
