# vidver.ai - AI ilə Avtomobil Tuning Platforması

Avtomobilinizi saniyələr içində yeni görkəmə gətirin. Şəkildən modifikasiya və effektli videolar – AI ilə.

## 🚀 Xüsusiyyətlər

- ✅ **Şəkil Tuning:** 4 tərəfdən şəkil yükləyib AI ilə tuning tətbiq edin
- ✅ **Video Generator:** Şəkildən effektli videolar yaradın
- ✅ **Token Sistemi:** İstifadəçi başına 100 pulsuz token
- ✅ **Marka/Model Kataloqu:** 8+ marka, 60+ model
- ✅ **Tuning Presets:** Body kit, disklər, rəng, spoyler və daha çox
- ✅ **Video Effects:** 360° spin, neon drive-by, light sweep və s.
- ✅ **İş Tarixçəsi:** Bütün modifikasiyaların tarixçəsi
- ✅ **Auth Sistemi:** NextAuth ilə təhlükəsiz giriş
- ✅ **Mock AI Adapter:** Real API-lərin simulyasiyası (5s delay)

## 🛠️ Texnoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Animation:** Framer Motion
- **Database:** Prisma + SQLite (development)
- **Auth:** NextAuth.js
- **Validation:** Zod

## 📦 Quraşdırma

### 1. Asılılıqları yükləyin

```bash
npm install
```

### 2. Environment dəyişənlərini konfiqurasiya edin

`.env` faylı artıq mövcuddur, lakin production üçün yeniləyin:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_TOKEN_BALANCE=100
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
```

### 3. Verilənlər bazasını hazırlayın

```bash
# Prisma migrations
npx prisma db push

# Seed demo data
npm run db:seed
```

Bu komanda yaradacaq:
- Demo istifadəçi: `demo@vidver.ai` / `demo123`
- 8 marka (BMW, Mercedes, Audi, Toyota, Hyundai, Kia, VW, Porsche)
- 60+ model
- 10 şəkil tuning preseti
- 8 video effekt preseti

### 4. Development server-i işə salın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) açın.

## 📁 Layihə Strukturu

```
vidver.ai/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── upload/               # File upload
│   │   ├── modify/               # Image modification (mock)
│   │   ├── video/                # Video generation (mock)
│   │   ├── catalog/              # Brands, models, presets
│   │   ├── profile/              # User profile & balance
│   │   └── jobs/                 # Job history
│   ├── image/                    # Image tuning page
│   ├── video/                    # Video generation page
│   ├── dashboard/                # User dashboard
│   ├── auth/                     # Auth pages (sign-in, sign-up)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── layout/                   # Layout components (Header, Footer, BottomBar)
│   ├── image/                    # Image tuning components
│   ├── video/                    # Video generation components
│   └── dashboard/                # Dashboard components
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # App constants
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── public/
│   └── demo/                     # Demo assets (results, videos, effects)
├── uploads/                      # User uploaded files (gitignored)
└── README.md
```

## 🔑 Əsas Komponentlər

### API Endpoints

#### `POST /api/upload`
Fayl yükləmə (şəkil)
- **Input:** `multipart/form-data` (file, side?)
- **Output:** `{ asset: { id, url, filename, size, side } }`

#### `POST /api/modify`
Şəkil modifikasiyası (mock 5s simulyasiya)
- **Input:** `{ assetIds: string[], brandId, modelId, presets: string[] }`
- **Output:** `{ job, outputAssets, remainingBalance }`
- **Token cost:** 20

#### `POST /api/video`
Video generasiyası (mock 5s simulyasiya)
- **Input:** `{ assetId: string, effectKey: string }`
- **Output:** `{ job, video, remainingBalance }`
- **Token cost:** 50

#### `GET /api/catalog`
Marka, model, preset kataloqu
- **Output:** `{ brands, tuningCategories, imagePresets, videoEffects }`

#### `GET /api/profile`
İstifadəçi profili və balans
- **Output:** `{ user, tokenBalance, recentJobs }`

#### `GET /api/jobs?kind=IMAGE&status=DONE&page=1`
İş tarixçəsi
- **Output:** `{ jobs, pagination }`

## 🎨 Dizayn Sistemi

### Rəng Paleti

```css
/* Əsas fon */
--onyx: #0A0D10
--onyx-light: #11161B

/* Aksent rənglər */
--neon-lime: #A6FF47
--electric-cyan: #3EE7FF

/* Mətn rəngləri */
--neutral-text: #E6EAF2
--neutral-secondary: #98A2B3

/* Sərhəd */
--border-dark: #1E242B
```

### Şriftlər

- **Başlıq:** Rajdhani (300, 400, 500, 600, 700)
- **Mətn:** Inter

### Animasiyalar

- `animate-car-drive` - Avtomobil hərəkəti
- `animate-wheel-spin` - Təkər fırlanması
- `animate-glow` - Glow effekti

## 🔄 İş Axını

### Şəkil Tuning Axını

1. İstifadəçi 4 tərəfdən şəkil yükləyir → `POST /api/upload` (4 dəfə)
2. Marka, model seçir və tuning opsiyalarını konfiqurasiya edir
3. "Modify" düyməsi basılır → `POST /api/modify`
4. 5 saniyə loading animasiyası (avtomobil progress)
5. Mock nəticə qaytarılır (4 tərəf)
6. 20 token balansdan çıxılır
7. Nəticələr göstərilir (preview + download)

### Video Generator Axını

1. İstifadəçi şəkil seçir (əvvəlki yükləmələr və ya yeni)
2. Video effekt seçir (360° Spin, Neon Drive-by və s.)
3. "Generate" düyməsi → `POST /api/video`
4. 5 saniyə simulyasiya
5. Mock video qaytarılır
6. 50 token çıxılır
7. Video preview + download

## 🧪 Test İstifadəçisi

```
Email: demo@vidver.ai
Password: demo123
Token Balance: 100
```

## 📊 Database Schema

### User
İstifadəçi məlumatları və auth

### TokenWallet
Token balans sistemi (default: 100)

### Brand & Model
Avtomobil marka/model kataloqu

### Preset
Tuning və video effekt presetləri

### Asset
Yüklənmiş və yaradılmış media fayllar

### Job
İş tarixçəsi (IMAGE | VIDEO)

## 🚧 TODO - Tamamlanmalı Hissələr

Bu layihədə əsas arxitektura və API-lar hazırdır. Aşağıdakılar tamamlanmalıdır:

### High Priority

- [ ] **Image tuning page** (`/app/image/page.tsx`)
  - 4-sided upload component
  - Brand/Model select (dependent dropdowns)
  - Tuning options accordion
  - Template gallery
  - Modify button + progress animation

- [ ] **Video generation page** (`/app/video/page.tsx`)
  - Image selector (from assets)
  - Video effects grid
  - Generate button + progress

- [ ] **Dashboard page** (`/app/dashboard/page.tsx`)
  - Job list with filters
  - Pagination
  - Result previews

- [ ] **Auth pages** (`/app/auth/sign-in`, `/sign-up`, `/reset`)
  - Login form
  - Register form (with auto token wallet creation)
  - Password reset

### UI Components

- [ ] `LoadingCarProgress` - Avtomobil progress animasiyası
- [ ] `UploadGridFourSides` - 4 tərəf şəkil yükləmə
- [ ] `BrandModelSelect` - Dependent dropdown
- [ ] `TuningAccordion` - Tuning seçimlər
- [ ] `TemplateGrid` - Template qalereya
- [ ] `VideoEffectCard` - Video effekt kartları
- [ ] `JobCard` - Tarixçə kartı
- [ ] `TokenBadge` - Token balans badge
- [ ] `Header` - Sticky header with auth menu
- [ ] `BottomBarMobile` - Mobil naviqasiya

### Medium Priority

- [ ] Admin panel (`/app/admin`)
- [ ] Legal pages (`/app/legal/privacy`, `/terms`)
- [ ] FAQ page
- [ ] Pricing page
- [ ] Contact page

### Low Priority

- [ ] SEO optimization (sitemap, robots.txt)
- [ ] Demo assets (`/public/demo/`)
- [ ] Email verification
- [ ] Social auth (Google, GitHub)

## 🎯 Mock AI Adapter Pattern

Hazırda `modify` və `video` API-lar mock implementasiya istifadə edir (5s delay).

Real AI inteqrasiyası üçün:

```typescript
// lib/ai-adapter.ts
interface AIAdapter {
  modifyImage(params: ModifyParams): Promise<Result>
  generateVideo(params: VideoParams): Promise<Result>
}

class MockAdapter implements AIAdapter { /* current implementation */ }
class StableDiffusionAdapter implements AIAdapter { /* real API */ }
class RunwayAdapter implements AIAdapter { /* real API */ }

// Switch adapter via env
const adapter = process.env.AI_PROVIDER === 'real'
  ? new StableDiffusionAdapter()
  : new MockAdapter()
```

## 📝 Əlavə Qeydlər

- **Performans:** Next.js App Router ilə SSR/SSG optimizasiyası
- **Responsive:** Mobile-first dizayn, bottom bar mobil üçün
- **Accessibility:** ARIA labels, keyboard navigation, contrast ratios
- **Security:** File validation, auth checks, rate limiting (TODO)

## 🤝 Töhfə

Layihəni inkişaf etdirmək üçün:

1. Fork edin
2. Feature branch yaradın (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisenziya

MIT License

---

**vidver.ai** - AI ilə avtomobil tuning platforması
