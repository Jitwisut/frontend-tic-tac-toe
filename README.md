# 🎮 Tic-Tac-Toe Frontend

เว็บแอปพลิเคชัน Tic-Tac-Toe แบบ Multiplayer สร้างด้วย **Next.js 16** และ **React 19** พร้อมดีไซน์ Glassmorphism สีส้ม-ขาว รองรับทั้ง Desktop และ Mobile

## 📋 สารบัญ

- [Tech Stack](#-tech-stack)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [การติดตั้ง](#-การติดตั้ง)
- [Environment Variables](#-environment-variables)
- [การรันโปรเจค](#-การรันโปรเจค)
- [หน้าเว็บทั้งหมด](#-หน้าเว็บทั้งหมด)
- [Components](#-components)
- [State Management](#-state-management)
- [API Client](#-api-client)
- [Design System](#-design-system)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| เทคโนโลยี | เวอร์ชัน | รายละเอียด |
|---|---|---|
| **Next.js** | 16.1.6 | React Framework (App Router) |
| **React** | 19.2.3 | UI Library |
| **React Compiler** | 1.0.0 | Auto-optimization (ไม่ต้อง useMemo/useCallback) |
| **TailwindCSS** | 4.x | Utility-first CSS |
| **Inter** | Google Fonts | Typography |
| **ESLint** | 9.x | Code Linting |

---

## 📂 โครงสร้างโปรเจค

```
frontend/
├── package.json
├── next.config.mjs           # Next.js config (reactCompiler: true)
├── eslint.config.mjs         # ESLint configuration
├── jsconfig.json             # Path aliases (@/)
├── postcss.config.mjs        # PostCSS + TailwindCSS
├── .env                      # Environment variables
│
├── public/                   # Static assets
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
└── src/
    ├── app/                  # Next.js App Router (Pages)
    │   ├── layout.jsx        # Root layout (Inter font, AuthProvider)
    │   ├── page.jsx          # หน้าหลัก - Lobby (สร้าง/เข้าห้อง)
    │   ├── globals.css       # Global styles + Design system
    │   ├── favicon.ico
    │   │
    │   ├── login/
    │   │   └── page.jsx      # หน้าเข้าสู่ระบบ
    │   │
    │   ├── register/
    │   │   └── page.jsx      # หน้าสมัครสมาชิก
    │   │
    │   ├── room/
    │   │   └── [code]/
    │   │       └── page.jsx  # หน้าเกม Multiplayer (dynamic route)
    │   │
    │   ├── bot/
    │   │   └── page.jsx      # หน้าเล่นกับ Bot AI
    │   │
    │   └── replay/
    │       └── [id]/
    │           └── page.jsx  # หน้าดู Replay เกม
    │
    ├── components/           # Reusable Components
    │   ├── Cell.jsx          # ช่องบนกระดาน (X/O พร้อม animation)
    │   ├── GameBoard.jsx     # กระดาน 3x3
    │   ├── PlayerCard.jsx    # การ์ดผู้เล่น (ชื่อ, สัญลักษณ์, สถานะ)
    │   ├── WinModal.jsx      # Modal แสดงผลชนะ/แพ้/เสมอ + confetti
    │   ├── Toast.jsx         # Toast notification system
    │   └── LoadingSpinner.jsx # Loading spinner + full-screen loading
    │
    ├── contexts/
    │   └── AuthContext.jsx   # Auth state (user, login, register, logout)
    │
    └── lib/
        └── api.js            # API Client class (token management + endpoints)
```

---

## 🚀 การติดตั้ง

### ข้อกำหนดเบื้องต้น

- **Node.js** >= 20.x
- **npm** >= 10.x
- Backend API กำลังรันอยู่ (ดู [Backend README](../backend/README.md))

### ขั้นตอน

```bash
# 1. เข้า directory
cd tic-tac-toe/frontend

# 2. ติดตั้ง dependencies
npm install

# 3. สร้างไฟล์ .env
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
```

---

## 🔐 Environment Variables

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL ของ Backend API | `http://localhost:3001` |

> **หมายเหตุ**: ใช้ prefix `NEXT_PUBLIC_` เพื่อให้เข้าถึงได้จาก client-side

---

## ▶️ การรันโปรเจค

```bash
# Development mode (hot-reload)
npm run dev

# Production build
npm run build

# Production server
npm start

# Lint check
npm run lint
```

เปิด [http://localhost:3000](http://localhost:3000) บนเบราว์เซอร์

### คำสั่ง npm scripts ทั้งหมด

| คำสั่ง | รายละเอียด |
|---|---|
| `npm run dev` | รัน development server |
| `npm run build` | Build สำหรับ production |
| `npm start` | รัน production server |
| `npm run lint` | ตรวจสอบ code ด้วย ESLint |

---

## 📱 หน้าเว็บทั้งหมด

### 1. `/login` — เข้าสู่ระบบ

- ฟอร์ม username + password
- Redirect ไปหน้าหลักเมื่อเข้าสู่ระบบสำเร็จ
- ลิงก์ไปหน้าสมัครสมาชิก

### 2. `/register` — สมัครสมาชิก

- ฟอร์ม username + password
- Validation: username 3-20 ตัว, password 6+ ตัว
- Auto-login เมื่อสมัครสำเร็จ

### 3. `/` — หน้าหลัก (Lobby)

- **สร้างห้อง** — สร้างห้องใหม่พร้อมรหัส 6 ตัว
- **เข้าห้อง** — ใส่รหัสเพื่อเข้าร่วม
- **เล่นกับ Bot** — ไปหน้า Bot mode
- **รายการห้องว่าง** — แสดงห้องที่รอผู้เล่นพร้อมปุ่มเข้าร่วม
- Auto-refresh รายการห้อง
- ปุ่ม Logout

### 4. `/room/[code]` — ห้องเกม Multiplayer

- กระดาน 3x3 แบบ interactive
- แสดงชื่อผู้เล่นทั้ง 2 ฝั่ง + สัญลักษณ์ (X/O)
- ไฮไลต์ช่องเดินล่าสุด
- แสดงตาที่ต้องเดิน (glow effect)
- Auto-polling สถานะเกมทุก 2 วินาที
- Modal แสดงผลเมื่อเกมจบ (ชนะ/แพ้/เสมอ)
- รองรับ Spectator mode
- แชร์รหัสห้องให้เพื่อน

### 5. `/bot` — เล่นกับ Bot AI

- เลือกเดินก่อน (X) หรือให้ Bot เดินก่อน (X)
- Bot ใช้ Minimax Algorithm (**ไม่มีวันแพ้**)
- Optimistic UI update สำหรับ move ที่สั่ง
- แสดง Bot กำลังคิด
- เริ่มเกมใหม่ได้ทันที

### 6. `/replay/[id]` — ดู Replay

- เล่น replay ของเกมที่จบแล้ว move-by-move
- ดูประวัติเกมของตัวเอง

---

## 🧩 Components

### `Cell.jsx`
- แสดงช่อง X/O บนกระดาน
- Animation `pop` เมื่อวาง symbol
- ไฮไลต์ช่องเดินล่าสุด
- Disabled state เมื่อไม่ใช่ตาของเรา

### `GameBoard.jsx`
- Grid 3x3 responsive
- ส่ง click event ไปยัง parent
- รับ `disabled` prop เพื่อป้องกันการคลิก

### `PlayerCard.jsx`
- แสดงชื่อ + symbol ของผู้เล่น
- Glow effect เมื่อถึงตาเดิน
- Pulse indicator สีเขียว (ตาปัจจุบัน) / สีเทา

### `WinModal.jsx`
- Modal popup แสดงผลเกม
- Confetti animation เมื่อชนะ
- ปุ่ม "เล่นอีก" และ "กลับหน้าหลัก"
- รองรับ: ชนะ, แพ้, เสมอ

### `Toast.jsx`
- Toast notification แบบ float
- 2 สถานะ: `success` (เขียว), `error` (แดง)
- Auto-dismiss หลัง 3 วินาที
- Slide-in animation

### `LoadingSpinner.jsx`
- Spinner component (3 ขนาด: sm, md, lg)
- `LoadingScreen` — full-screen loading พร้อมข้อความ

---

## 🔄 State Management

### AuthContext

ใช้ **React Context** สำหรับจัดการ authentication state:

```jsx
const { user, loading, login, register, logout, isAuthenticated } = useAuth();
```

| Property | Type | รายละเอียด |
|---|---|---|
| `user` | `object \| null` | ข้อมูลผู้ใช้ `{ id, username, createdAt }` |
| `loading` | `boolean` | กำลังตรวจสอบ token |
| `isAuthenticated` | `boolean` | สถานะ login |
| `login(username, password)` | `function` | เข้าสู่ระบบ |
| `register(username, password)` | `function` | สมัครสมาชิก |
| `logout()` | `function` | ออกจากระบบ |

- Token เก็บใน `localStorage`
- Auto-check token เมื่อเปิดแอป
- Redirect ไปหน้า login เมื่อ token หมดอายุ

---

## 📡 API Client

`src/lib/api.js` — ApiClient class จัดการ API calls ทั้งหมด:

```javascript
import api from '@/lib/api';

// Auth
await api.register('username', 'password');
await api.login('username', 'password');
await api.getMe();
api.logout();

// Rooms
await api.createRoom();
await api.getRooms();
await api.getRoom(code);
await api.joinRoom(code);
await api.spectateRoom(code);
await api.leaveRoom(code);

// Game
await api.makeMove(roomId, position, version);
await api.getGameState(roomId);
await api.getGameStatus(roomId);

// Bot
await api.createBotGame(goFirst);
await api.makeBotMove(gameId, position, version);
await api.getBotGame(gameId);
await api.getBotGames();

// Replay
await api.getReplay(roomId);
await api.getGameHistory();
```

**Features:**
- Auto-attach JWT token ใน `Authorization` header
- Token persistence ใน localStorage
- Error handling แบบรวมศูนย์

---

## 🎨 Design System

ใช้ **Glassmorphism** theme สีส้ม-ขาว กำหนดใน `globals.css`:

### Color Palette

| Variable | สี | ใช้สำหรับ |
|---|---|---|
| `--background` | `#FFFBF5` | พื้นหลัง |
| `--foreground` | `#1A1A2E` | ตัวหนังสือ |
| `--primary` | `#F97316` (ส้ม) | ปุ่มหลัก, X symbol |
| `--secondary` | `#F59E0B` (เหลือง) | O symbol, accent |
| `--success` | `#10B981` (เขียว) | สำเร็จ |
| `--error` | `#EF4444` (แดง) | ข้อผิดพลาด |

### CSS Classes

| Class | รายละเอียด |
|---|---|
| `.glass-card` | กล่อง glassmorphism (blur + border + shadow) |
| `.gradient-text` | ข้อความ gradient ส้ม→เหลือง |
| `.btn-primary` | ปุ่มหลัก gradient พร้อม hover/active effects |
| `.btn-secondary` | ปุ่มรอง glass-style |
| `.input-field` | Input field พร้อม focus glow |
| `.cell` | ช่องบนกระดาน |
| `.glow-active` | Glow effect สำหรับตาปัจจุบัน |

### Animations

| Class | Effect |
|---|---|
| `.fade-in` | Fade in + slide up เล็กน้อย |
| `.slide-up` | Slide up จากล่าง |
| `.pop` | Scale 0 → 1.15 → 1 |
| `.float` | Floating ขึ้น-ลง |
| `.pulse` | Pulse opacity |
| `.glow-active` | Orange glow box-shadow |

### Responsive Design

- **Mobile-first** approach
- Breakpoint หลัก: `640px` (sm)
- ป้องกัน iOS zoom เมื่อ focus input (font-size: 16px)
- Custom scrollbar styling

---

## 🌐 Deployment

### Vercel (แนะนำ)

1. Push code ไปยัง GitHub
2. Import project บน [Vercel](https://vercel.com)
3. ตั้ง Environment Variable:
   - `NEXT_PUBLIC_API_URL` = URL ของ Backend API ที่ deploy แล้ว
4. Deploy!

### Docker

ร่วมกับ Backend ผ่าน Docker Compose:

```bash
# จาก root directory
docker-compose up --build
```

- Frontend จะรันที่ `http://localhost:3000`
- Backend จะรันที่ `http://localhost:3001`
- PostgreSQL จะรันที่ `localhost:5433`

---

## 📝 License

Private
