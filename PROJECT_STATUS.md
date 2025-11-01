# vidver.ai - Layihə Statusu

## ✅ Tamamlanmış Hissələr

### 1. Layihə Strukturu və Konfiqurasiya
- ✅ Next.js 14 (App Router) + TypeScript
- ✅ Tailwind CSS custom theme (vidver.ai brand colors)
- ✅ Font setup (Rajdhani + Inter)
- ✅ ESLint, PostCSS konfiqurasiyaları
- ✅ Environment variables setup

### 2. Database & Backend
- ✅ Prisma schema (User, TokenWallet, Brand, Model, Preset, Asset, Job)
- ✅ SQLite database (development)
- ✅ Seed script (8 brands, 60+ models, 18 presets)
- ✅ Demo user: demo@vidver.ai / demo123

### 3. Authentication
- ✅ NextAuth.js konfiqurasiyası
- ✅ Credentials provider (email + password)
- ✅ Auto token wallet creation on user registration
- ✅ JWT session strategy
- ✅ Auth API routes (`/api/auth/[...nextauth]`)

### 4. Core API Endpoints
- ✅ `POST /api/upload` - File upload with validation
- ✅ `POST /api/modify` - Image modification (mock 5s delay)
- ✅ `POST /api/video` - Video generation (mock 5s delay)
- ✅ `GET /api/catalog` - Brands, models, presets
- ✅ `GET /api/profile` - User profile & token balance
- ✅ `GET /api/jobs` - Job history with pagination

### 5. UI Components
- ✅ Button component (shadcn/ui style)
- ✅ Card component (shadcn/ui style)
- ✅ Global styles with custom animations

### 6. Pages
- ✅ Landing page (/) - Hero, features, how it works, CTA
- ✅ Root layout with fonts and metadata

### 7. Utilities & Constants
- ✅ `lib/utils.ts` - cn helper, formatDate, formatBytes
- ✅ `lib/constants.ts` - Token costs, asset types, tuning categories, video effects
- ✅ `lib/prisma.ts` - Prisma client singleton
- ✅ `lib/auth.ts` - NextAuth configuration

### 8. Documentation
- ✅ Comprehensive README.md
- ✅ Project structure documentation
- ✅ API endpoint documentation
- ✅ Setup instructions

## ⏳ Qalan İşlər (Priority Sırası ilə)

### HIGH PRIORITY - Əsas Səhifələr

#### 1. `/app/image/page.tsx` - Şəkil Tuning Səhifəsi
**Lazım olan komponentlər:**
- `UploadGridFourSides` - 4 slot (FRONT, REAR, LEFT, RIGHT)
  - Drag & drop support
  - Preview with remove button
  - File validation (type, size)
- `BrandModelSelect` - Dependent dropdowns
  - Fetch from `/api/catalog`
  - Model dropdown activates after brand selection
- `TuningAccordion` - Tuning options
  - Categories: Body Kit, Bumpers, Hood, Spoiler, Wheels, etc.
  - Multiple selection with checkboxes
- `TemplateGallery` - Preset templates
  - Grid of 8-12 templates per brand/model
  - Click to select
- `ModifyButton` + `LoadingCarProgress`
  - POST to `/api/modify`
  - 5s animation with car progress
  - Show results in 4-panel grid

**Qısa implementasiya yolu:**
```tsx
'use client'
import { useState } from 'react'

export default function ImagePage() {
  const [uploads, setUploads] = useState({ front: null, rear: null, left: null, right: null })
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleModify = async () => {
    setLoading(true)
    // Upload files first
    const assetIds = await uploadAll(uploads)
    // Call modify API
    const res = await fetch('/api/modify', {
      method: 'POST',
      body: JSON.stringify({ assetIds, brandId: brand, modelId: model, presets })
    })
    const data = await res.json()
    setResults(data.outputAssets)
    setLoading(false)
  }

  return (
    // UI layout
  )
}
```

#### 2. `/app/video/page.tsx` - Video Generator
**Lazım olan komponentlər:**
- `ImageSelector` - Select from user's assets or upload new
- `VideoEffectsGrid` - 6 effect cards (360° Spin, Neon Drive-by, etc.)
- `GenerateButton` + progress
- Video player for result

#### 3. `/app/dashboard/page.tsx` - Tarixçə
**Lazım olan komponentlər:**
- `JobList` - Fetch from `/api/jobs`
- `JobCard` - Show job details (kind, status, brand, model, cost, date)
- Filters (kind: IMAGE/VIDEO, status: PENDING/DONE/FAILED)
- Pagination

#### 4. `/app/auth/(sign-in|sign-up|reset)/page.tsx` - Auth
**Tələblər:**
- Sign-in form: email, password → NextAuth signIn()
- Sign-up form: email, name, password → NextAuth credential + Prisma user create
- Reset form: email → placeholder (email send simulation)

### MEDIUM PRIORITY - Layout Components

#### 5. `components/layout/Header.tsx`
- Sticky header
- Logo (vidver.ai)
- Nav links (Şəkil, Video, Tarixçə)
- Auth menu (if logged in: avatar + dropdown with Profile, Balance, Logout)

#### 6. `components/layout/BottomBarMobile.tsx`
- Fixed bottom bar (mobile only)
- 5 icons: Home, Şəkil, Video, Tarixçə, Profil

#### 7. `components/LoadingCarProgress.tsx`
- Animated car silhouette moving left to right
- Progress percentage
- "İşlənir..." text
- Optional: spinning wheels

### LOW PRIORITY

- Admin panel (`/app/admin/*`)
- Legal pages (`/app/legal/*`)
- FAQ, Pricing, Contact pages
- SEO (sitemap, robots.txt, dynamic OG images)
- Demo assets (`/public/demo/*`)

## 🚀 İndi Nə Etməli?

### 1. Node.js Yenilə (Vacib!)
```bash
# Node.js 18.17.0+ və ya 20.x yüklə
# https://nodejs.org/en/download/
```

### 2. Layihəni İşə Sal
```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### 3. Landing Page Test Et
[http://localhost:3000](http://localhost:3000) - Landing page görünməlidir

### 4. İlk Səhifəni Yarat
Tövsiyə edirik ki, `/app/image/page.tsx` ilə başlayasınız. Bu səhifə əsas funksionallığı nümayiş etdirir.

## 📋 Komponent Yaratma Template

### Nümunə: UploadGridFourSides

```tsx
// components/image/UploadGridFourSides.tsx
'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'

const SIDES = ['FRONT', 'REAR', 'LEFT', 'RIGHT'] as const

export function UploadGridFourSides({ onUploadComplete }) {
  const [uploads, setUploads] = useState({})
  const [previews, setPreviews] = useState({})

  const handleFileChange = async (side, file) => {
    // Validate
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Yalnız JPG, PNG, WebP')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Maksimum 10MB')
      return
    }

    // Preview
    const url = URL.createObjectURL(file)
    setPreviews(prev => ({ ...prev, [side]: url }))

    // Upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('side', side)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    setUploads(prev => ({ ...prev, [side]: data.asset }))
    onUploadComplete?.(side, data.asset)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {SIDES.map(side => (
        <Card key={side} className="p-4">
          <label className="block text-sm font-medium mb-2">{side}</label>
          {previews[side] ? (
            <div className="relative">
              <img src={previews[side]} alt={side} className="rounded" />
              <button onClick={() => removeSide(side)}>Remove</button>
            </div>
          ) : (
            <label className="border-2 border-dashed rounded-lg p-8 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(side, e.target.files[0])}
                className="hidden"
              />
              <div className="text-center">Klikləyin və ya sürüşdürün</div>
            </label>
          )}
        </Card>
      ))}
    </div>
  )
}
```

## 🎯 Məsləhətlər

1. **API-ları test edin:** Postman və ya Thunder Client ilə `/api/*` endpointləri test edin
2. **Addım-addım:** Hər səhifəni ayrı-ayrılıqda yaradın və test edin
3. **Demo data:** Seed script ilə yaradılmış data-dan istifadə edin
4. **Mock results:** `/public/demo/results/` direktoriyasına demo şəkillər əlavə edin
5. **TypeScript:** Type safety üçün zod və Prisma types istifadə edin

## 📞 Yardım

Hər hansı sual və ya köməyə ehtiyacınız olarsa:
- README.md-ni oxuyun
- Prisma Studio ilə database-i yoxlayın: `npx prisma studio`
- API logs-a baxın: console.log-lar terminaldadır
- GitHub Issues açın (əgər public repo-dursa)

---

**Status:** 🟢 Backend hazır | 🟡 Frontend başlanmalıdır | ⚪ Optional qalır

**Tövsiyə:** İlk olaraq `/app/image/page.tsx` yaradın və əsas funksionallığı işə salın!
