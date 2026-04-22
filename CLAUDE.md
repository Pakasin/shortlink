# แผนการพัฒนาเว็บไซต์ ShortLink & QR Code Generator

## 📋 ภาพรวมโครงการ

เว็บไซต์สำหรับสร้างลิงก์สั้น (Short URL) และสร้าง QR Code จากลิงก์ใดๆ พร้อมระบบ Analytics สำหรับติดตามการใช้งาน

---

## ✅ ความคืบหน้าปัจจุบัน (อัปเดต: 2026-04-20)

### โครงสร้างโปรเจคปัจจุบัน:
```
shortlink-qr-generator/
├── frontend/                 # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Navbar, Footer, LinkCreator, LinksList, QRGenerator, AnalyticsChart
│   │   ├── pages/            # LandingPage, LoginPage, RegisterPage, DashboardPage, CreateLinkPage, AnalyticsPage
│   │   ├── services/         # auth.service.ts, link.service.ts, analytics.service.ts, api.ts
│   │   ├── contexts/         # AuthContext.tsx
│   │   ├── types/            # index.ts
│   │   └── App.tsx
│   └── index.html
├── backend/                  # Bun + ElysiaJS + TypeScript + PostgreSQL
│   ├── src/
│   │   ├── routes/           # auth.routes.ts, link.routes.ts, analytics.routes.ts, redirect.routes.ts
│   │   ├── models/           # user.model.ts, link.model.ts, analytics.model.ts
│   │   ├── services/         # auth.service.ts, link.service.ts, analytics.service.ts
│   │   ├── middleware/       # auth.middleware.ts
│   │   ├── config/           # database.ts
│   │   ├── types/            # index.ts
│   │   └── index.ts
│   └── database/
│       └── schema.sql
└── shared/                   # Shared types/utilities
```

### เทคโนโลยีที่ใช้ (อัปเดตแล้ว):
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + lucide-react + recharts
- **Backend:** Bun + ElysiaJS + TypeScript + @elysiajs/jwt + bcryptjs
- **Database:** PostgreSQL (driver: `postgres` by porsager)
- **QR Code:** qrcode library

### ฟีเจอร์ที่พร้อมใช้งาน:
- [x] ระบบ Authentication (JWT)
- [x] สร้าง ShortLink พร้อม Custom Alias
- [x] สร้าง QR Code อัตโนมัติ
- [x] Dashboard แสดงรายการลิงก์
- [x] Analytics พื้นฐาน
- [x] Redirect ระบบ

### ฟีเจอร์ที่ต้องการพัฒนาเพิ่มเติม:
- [ ] OAuth (Google/GitHub Login)
- [ ] QR Code Customization (สี, ขนาด, logo)
- [ ] Analytics แบบเต็ม (กราฟ, แผนที่, referrer)
- [ ] การจัดการลิงก์ (แก้ไข, เปิด/ปิด, ค้นหา/กรอง)
- [ ] Dark Mode
- [ ] Responsive Design ปรับปรุงเพิ่มเติม

---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Charts:** recharts
- **HTTP Client:** axios
- **Routing:** react-router-dom

### Backend
- **Runtime:** Bun
- **Framework:** ElysiaJS
- **Language:** TypeScript
- **Database:** PostgreSQL (driver: `postgres` via tagged template `sql``)
- **Auth:** JWT (@elysiajs/jwt)
- **Password Hashing:** bcryptjs
- **QR Code:** qrcode

### Infrastructure
- **Package Manager:** Bun
- **Workspaces:** npm workspaces (frontend, backend, shared)

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

### Table: users
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary Key |
| email | VARCHAR(255) | อีเมล (Unique) |
| password_hash | VARCHAR(255) | รหัสผ่าน (hashed) |
| name | VARCHAR(100) | ชื่อ |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดต |

### Table: links
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary Key |
| user_id | INTEGER | Foreign Key (users.id) |
| original_url | TEXT | URL ต้นฉบับ |
| short_code | VARCHAR(10) | รหัสลิงก์สั้น (Unique) |
| custom_alias | VARCHAR(50) | ชื่อที่กำหนดเอง (Nullable) |
| qr_code_url | VARCHAR(255) | URL รูป QR Code (Nullable) |
| clicks | INTEGER | จำนวนคลิก (Default: 0) |
| is_active | BOOLEAN | สถานะเปิด/ปิด (Default: true) |
| expires_at | TIMESTAMPTZ | วันหมดอายุ (Nullable) |
| created_at | TIMESTAMPTZ | วันที่สร้าง |

### Table: analytics
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary Key |
| link_id | INTEGER | Foreign Key (links.id) |
| ip_address | VARCHAR(45) | IP ผู้เข้าชม |
| user_agent | TEXT | Browser/OS |
| referrer | TEXT | แหล่งที่มา (Nullable) |
| country | VARCHAR(100) | ประเทศ (Nullable) |
| device_type | VARCHAR(50) | อุปกรณ์ (Nullable) |
| clicked_at | TIMESTAMPTZ | วันที่คลิก |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | สมัครสมาชิก |
| POST | /api/auth/login | ล็อกอิน |
| GET | /api/auth/me | ข้อมูลผู้ใช้ปัจจุบัน |
| DELETE | /api/auth/logout | ล็อกเอาต์ |

### Links
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/links | สร้างลิงก์ใหม่ |
| GET | /api/links | ดูรายการลิงก์ (ของผู้ใช้) |
| GET | /api/links/:id | ดูรายละเอียดลิงก์ |
| PATCH | /api/links/:id | แก้ไข URL ปลายทาง, custom alias, หรือเปิด/ปิด link (JWT required) |
| DELETE | /api/links/:id | ลบลิงก์ |

### QR Code
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/qr/:shortCode | ดึง QR Code ของลิงก์ |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/:linkId | สถิติของลิงก์ |
| GET | /api/analytics/summary | สรุปภาพรวม |

### Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /:shortCode | Redirect ไปยัง URL ต้นฉบับ |

---

## 📊 อัลกอริทึมสำคัญ

### สร้าง Short Code
```typescript
// ใช้ nanoid สำหรับสร้างรหัสสั้นๆ ที่ไม่ซ้ำ
import { nanoid } from 'nanoid';
const shortCode = nanoid(6); // 6 ตัวอักษร

// หรือใช้ custom alias ถ้าผู้ใช้กำหนด
const shortCode = customAlias || nanoid(6);
```

### ตรวจสอบ Collision
```typescript
// ตรวจสอบว่า short code ซ้ำหรือไม่
const generateUniqueCode = async () => {
  let code = nanoid(6);
  const [existing] = await sql`SELECT id FROM links WHERE short_code = ${code}`;
  while (existing) { code = nanoid(6); }
  return code;
};
```

---

## 🚀 แผนการพัฒนา

### Phase 1: Core (MVP) ✅ เสร็จแล้ว
- [x] สร้างระบบ Login/Register
- [x] สร้าง Database Schema
- [x] สร้าง API สำหรับสร้าง/ดู/ลบ ShortLink
- [x] สร้างหน้า Dashboard พื้นฐาน
- [x] สร้างระบบ redirect (/:shortCode)

### Phase 2: QR Code ✅ เสร็จแล้ว
- [x] เพิ่ม QR Code generation ให้กับลิงก์
- [x] สร้าง component QRGenerator

### Phase 3: Analytics 🚧 กำลังทำ
- [x] สร้าง table analytics
- [x] บันทึกข้อมูลทุกครั้งที่ redirect
- [x] สร้างหน้า Analytics Dashboard
- [ ] เพิ่มกราฟและ visualization (recharts)
- [ ] เพิ่ม Geolocation lookup

### Phase 4: Polish ⏳ รอทำ
- [ ] OAuth (Google, GitHub)
- [ ] QR Code Customization
- [ ] Dark Mode
- [ ] Responsive Design ปรับปรุง
- [ ] Loading states
- [ ] Error handling
- [ ] SEO optimization

---

## 🔐 ความปลอดภัย

- [x] Hash password ด้วย bcryptjs
- [x] JWT Token สำหรับ authentication
- [ ] Rate limiting
- [x] URL validation
- [x] Parameterized queries (postgres tagged template `sql``)
- [ ] CORS configuration
- [ ] XSS protection (React ช่วยป้องกัน)

---

## 📱 Responsive Breakpoints (Tailwind)

| Breakpoint | Min Width |
|------------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

---

## 🎯 Success Metrics

- [x] ผู้ใช้สามารถสร้าง ShortLink ได้
- [ ] Redirect ทำงานเร็ว (< 100ms)
- [x] QR Code สแกนได้
- [ ] Analytics แสดงข้อมูลถูกต้อง
- [ ] รองรับผู้ใช้ 1000+ concurrent

---

## 📝 หมายเหตุสำหรับ Developer

### การรันโปรเจค
```bash
# ติดตั้ง dependencies
bun install

# รัน development server (ทั้ง frontend และ backend)
bun run dev

# รันเฉพาะ frontend
bun run dev:frontend

# รันเฉพาะ backend
bun run dev:backend

# Build ทั้งหมด
bun run build
```

### Environment Variables (.env)
```
JWT_SECRET=your-jwt-secret-here
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/shortlink
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000
```

### Docker
```bash
# PostgreSQL: host port 5433 → container port 5432
docker run -d --name shortlink-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=shortlink \
  -p 5433:5432 \
  postgres:16-alpine
```

---

*สร้างเมื่อ: 2026-04-16*
*อัปเดตล่าสุด: 2026-04-20*
*แผนการพัฒนา: ShortLink & QR Generator*
