# 📱 คู่มือ: เผยแพร่แอป ชงชา บน Google Play Store

## สิ่งที่ต้องเตรียม

| รายการ | รายละเอียด | ลิงก์ |
|--------|-----------|-------|
| ✅ **Google Play Developer Account** | สมัครครั้งเดียว ค่าธรรมเนียม $25 | [play.google.com/console](https://play.google.com/console) |
| ✅ **เว็บไซต์ที่ deploy แล้ว (HTTPS)** | แนะนำ GitHub Pages หรือ Netlify (ฟรี) | ดูขั้นตอน Deploy ด้านล่าง |
| ✅ **Node.js** | สำหรับรัน Bubblewrap | [nodejs.org](https://nodejs.org) |
| ✅ **Java JDK 11+** | สำหรับ build APK | [adoptium.net](https://adoptium.net) |

---

## ขั้นตอนที่ 1: Deploy เว็บไซต์ขึ้น HTTPS (ฟรี)

### วิธี A: GitHub Pages (แนะนำ — ฟรี)

```bash
# 1. สร้าง Repository บน GitHub ชื่อ "chongcha"
# 2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์ Chongcha/
# 3. ไปที่ Settings > Pages > Source: main branch
# 4. เว็บจะได้ URL: https://username.github.io/chongcha/
```

### วิธี B: Netlify (ฟรี)
1. ไปที่ [netlify.com](https://netlify.com)
2. ลากโฟลเดอร์ `Chongcha/` ไปวางใน Deploy
3. จะได้ URL เช่น `https://chongcha.netlify.app`

> ⚠️ **สำคัญ**: หลัง deploy แล้ว ต้องอัปเดต URL ใน `twa-manifest.json` ให้ตรงกับ URL จริง

---

## ขั้นตอนที่ 2: สร้าง Android App ด้วย Bubblewrap

### ติดตั้ง Bubblewrap CLI
```bash
npm install -g @nickvdh/nickvdh
# หรือ
npm install -g @nickvdh
```

### สร้าง Android Project
```bash
cd android
bubblewrap init --manifest twa-manifest.json
```
> Bubblewrap จะถามว่าจะดาวน์โหลด JDK และ Android SDK ให้ไหม → ตอบ **Yes**

### Build APK
```bash
bubblewrap build
```
> จะได้ไฟล์ `app-release-signed.apk` และ `app-release-bundle.aab`

---

## ขั้นตอนที่ 3: ตั้งค่า Digital Asset Links

สร้างไฟล์ `.well-known/assetlinks.json` บนเว็บไซต์:

```json
[{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
        "namespace": "android_app",
        "package_name": "com.chongcha.app",
        "sha256_cert_fingerprints": [
            "YOUR_SHA256_FINGERPRINT_HERE"
        ]
    }
}]
```

> SHA256 fingerprint ได้จากตอน build ด้วย Bubblewrap (จะแสดงใน terminal)

---

## ขั้นตอนที่ 4: อัปโหลดขึ้น Play Store

1. ไปที่ [Google Play Console](https://play.google.com/console)
2. กด **"สร้างแอป"**
3. กรอกข้อมูล:

| ฟิลด์ | ค่า |
|-------|-----|
| ชื่อแอป | ชงชา — Chongcha |
| ภาษาเริ่มต้น | ไทย |
| ประเภท | แอปพลิเคชัน |
| หมวดหมู่ | อาหารและเครื่องดื่ม |
| ฟรี/เสียเงิน | ฟรี |

4. อัปโหลด **Store Listing**:
   - ชื่อ: `ชงชา — Chongcha Restaurant`
   - คำอธิบาย: `แอปร้านอาหารและเครื่องดื่มชงชา สั่งอาหาร สะสมแต้ม แลกรางวัล`
   - ไอคอน: ใช้ `images/icon-512.jpg`
   - Screenshot: จับหน้าจอแอป 2-8 รูป

5. อัปโหลดไฟล์ `.aab` (app-release-bundle.aab)
6. กด **"ส่งตรวจสอบ"** — Google จะตรวจสอบ 1-7 วัน

---

## วิธีลัด: ใช้ PWABuilder (ง่ายที่สุด!)

> 🏆 **แนะนำสำหรับมือใหม่** — ไม่ต้องติดตั้งอะไรเลย!

1. Deploy เว็บไซต์ขึ้น HTTPS ก่อน (ขั้นตอนที่ 1)
2. ไปที่ **[pwabuilder.com](https://www.pwabuilder.com)**
3. วาง URL ของเว็บไซต์
4. กด **"Package for stores"**
5. เลือก **"Android"** → กด **"Generate"**
6. ดาวน์โหลดไฟล์ `.aab` สำเร็จรูป!
7. อัปโหลดขึ้น Play Console ได้เลย

---

## โครงสร้างไฟล์ในโปรเจค

```
Chongcha/
├── Chongcha.html          ← เว็บไซต์หลัก
├── admin.html             ← ระบบหลังบ้าน
├── manifest.json          ← PWA manifest
├── sw.js                  ← Service Worker
├── robots.txt             ← SEO
├── sitemap.xml            ← SEO
├── images/
│   ├── icon-512.jpg       ← ไอคอนแอป
│   ├── krapao.jpg         ← รูปเมนู...
│   └── ...
└── android/
    ├── twa-manifest.json  ← Bubblewrap config
    ├── build.bat          ← Build script
    └── README.md          ← คู่มือนี้
```
