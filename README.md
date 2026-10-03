# 🎓 Learnfy: Next-Gen Educational E-Commerce & Video Streaming Platform

> **Modern Digital Learning Platform + Educational Marketplace + Video Streaming Experience**  
> Powered by the unified **LearnSpring Engine** visual & streaming architecture.

---

## 🌟 Key Product Innovations & Overhaul

1. **Brutally Clean & Architectural Visual Direction**
   - Strictly conforms to the **LearnSpring** and Swiss geometric visual blueprints: warm cream/off-white canvas (`#FAF8F5`), crisp structural borders (`#E5E7EB`), deep charcoal typography (`#111827`), and vibrant coral/red action accents (`#DC2626`).
   - Completely eliminates generic AI tropes: **NO neon purple/blue glowing borders, NO cheesy glassmorphism or floating particles**.

2. **Adaptive Video Streaming Architecture**
   - High-performance streaming player benchmarking Twitch and YouTube quality standards.
   - Precision scrubbing, multi-resolution support (`1080p`, `720p`, `480p`), speed toggling (`0.75x` – `2x`), subtitles/captions, theater mode, buffering states, and ergonomic keyboard shortcuts (`k`, `j`, `l`, `m`, `f`, arrow keys).
   - Server-side authorization tokens protecting full lectures with free previews for prospective students.

3. **Student Learning Lifecycle & Progression Engine**
   - **Continuous Progress Tracking**: Playback timestamps saved per lesson and synced across devices.
   - **Interactive Knowledge Checks**: Multi-question quizzes with instant scoring explanations and milestone verification.
   - **Verifiable Digital Credentials**: Automatically unlocks unique cryptographic completion certificates (`CERT-XXXXX`) upon 100% curriculum completion.
   - **My Learning Library**: Student's private dashboard separating discovery/purchasing from owned courses and progress tracking.

4. **Production Commerce & Digital Entitlements**
   - Instant tokenized cart & checkout.
   - Server-side coupon verification (`LEARNFY20`, `WELCOME50`).
   - Transactional order receipts linked to verifiable course entitlements.

5. **Contextual AI Learning Assistant**
   - Deterministic, domain-bounded curriculum synthesis allowing students to find direct learning paths and ask questions without visual clutter.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Backend & Streaming API**: Express / TypeScript modular REST services for course catalog, media authorization, and order processing.
- **Design Tokens**: Standardized geometry, cream and charcoal palettes, mobile-first responsive bottom navigation and responsive drawers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 22 LTS recommended)
- npm 10+

### Installation & Run

```bash
# Navigate to web application
cd web

# Install dependencies
npm install

# Run the development environment with hot reload
npm run dev

# Or run full-stack server and frontend concurrently
npm run start
```

### Production Build & Verification

```bash
cd web
npm run build
```

---

## 🔒 Security & Entitlement Architecture

- **Server-Side Authorization**: Paid course lectures require validated user entitlements; streaming URLs cannot be exposed simply by toggling client flags.
- **Short-Lived Media Tokens**: Transcoded media segments use HMAC-signed, expiring tokens.
- **Idempotent Order Pipeline**: Eliminates double-charges and ensures guaranteed entitlement grant upon verified settlement.
