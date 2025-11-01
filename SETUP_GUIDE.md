# vidver.ai - Quraşdırma Təlimatı

## ⚠️ Vacib: Node.js Versiyası

**Hazırda sistemizdə Node.js 18.14.0 quraşdırılıb, lakin Next.js 14 üçün minimum 18.17.0 lazımdır!**

### Node.js Yeniləmə

1. **Node.js yüklə:**
   - https://nodejs.org/en/download
   - LTS versiya (20.x) tövsiyə olunur

2. **Yoxla:**
   ```bash
   node --version  # 18.17.0+ və ya 20.x olmalıdır
   ```

## 🚀 Quraşdırma Addımları

### 1. Dependencies yüklə

```bash
npm install
```

### 2. Database hazırla

```bash
# Schema-nı bazaya push et
npx prisma db push

# Demo data yüklə (8 marka, 60+ model, demo user)
npm run db:seed
```

Bu komanda yaradır:
- ✅ Demo istifadəçi: `demo@vidver.ai` / `demo123`
- ✅ 8 marka (BMW, Mercedes, Audi, Toyota, Hyundai, Kia, VW, Porsche)
- ✅ 60+ model
- ✅ 10 şəkil tuning preseti
- ✅ 8 video effekt preseti

### 3. Development server işə sal

```bash
npm run dev
```

Server `http://localhost:3000` ünvanında işə düşəcək.

## 📖 İstifadə

### Demo Hesab

```
Email: demo@vidver.ai
Password: demo123
Token Balansı: 100
```

### Səhifələr

- **Landing:** `http://localhost:3000`
- **Qeydiyyat:** `http://localhost:3000/auth/sign-up`
- **Giriş:** `http://localhost:3000/auth/sign-in`
- **Dashboard:** `http://localhost:3000/dashboard` (auth lazım)
- **Şəkil Tuning:** `http://localhost:3000/image`
- **Video Generator:** `http://localhost:3000/video`
- **Qiymətlər:** `http://localhost:3000/pricing`
- **FAQ:** `http://localhost:3000/faq`
- **Əlaqə:** `http://localhost:3000/contact`
- **Məxfilik:** `http://localhost:3000/legal/privacy`
- **Şərtlər:** `http://localhost:3000/legal/terms`

## 🛠️ Əlavə Komandalar

### Database İdarəetməsi

```bash
# Prisma Studio aç (visual database browser)
npx prisma studio

# Schema dəyişdikdə
npx prisma db push

# Database-i sıfırla və yenidən seed et
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Build & Production

```bash
# Production build
npm run build

# Production serveri işə sal
npm start
```

### Lint

```bash
npm run lint
```

## 📊 Token Sistemi

- **Default balans:** 100 token (yeni istifadəçilər)
- **Şəkil tuning:** 20 token
- **Video generasiya:** 50 token

Token əməliyyatları avtomatik idarə olunur.

## 🔧 Environment Variables

`.env` faylı artıq konfiqurasiya olunub. Production üçün dəyişdirin:

```env
DATABASE_URL="file:./dev.db"  # Production: PostgreSQL URL
NEXTAUTH_URL="http://localhost:3000"  # Production: https://vidver.ai
NEXTAUTH_SECRET="change-this-in-production"  # openssl rand -base64 32
```

## 🎨 Dizayn Sistemi

### Rəng Paleti

- **Fon:** `#0A0D10` (onyx), `#11161B` (onyx-light)
- **Aksent:** `#A6FF47` (neon-lime), `#3EE7FF` (electric-cyan)
- **Mətn:** `#E6EAF2` (neutral-text), `#98A2B3` (neutral-secondary)

### Şriftlər

- **Başlıq:** Rajdhani
- **Mətn:** Inter

### Komponentlər

Bütün UI komponentləri `components/ui/` direktoriyasındadır (shadcn/ui style).

## 📁 Layihə Strukturu

```
vidver.ai/
├── app/
│   ├── api/              # API route handlers
│   ├── auth/             # Auth pages
│   ├── dashboard/        # Dashboard
│   ├── image/            # Image tuning
│   ├── video/            # Video generator
│   ├── legal/            # Privacy, Terms
│   ├── faq/              # FAQ
│   ├── pricing/          # Pricing
│   ├── contact/          # Contact
│   ├── admin/            # Admin panel
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing
│   ├── sitemap.ts        # SEO sitemap
│   └── robots.ts         # SEO robots
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── LoadingCarProgress.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/
    └── demo/             # Demo assets
```

## 🐛 Troubleshooting

### Node.js versiya xətası

```
Error: You are using Node.js 18.14.0. For Next.js, Node.js version >= v18.17.0 is required.
```

**Həll:** Node.js 18.17.0+ və ya 20.x yükləyin: https://nodejs.org

### Prisma xətası

```
Error: Prisma schema not found
```

**Həll:** `npx prisma db push` çalışdırın

### Port artıq istifadədə

```
Error: Port 3000 is already in use
```

**Həll:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Database locked (SQLite)

**Həll:** Prisma Studio-nu bağlayın və yenidən cəhd edin.

## 📞 Dəstək

Probleminiz varsa:

1. README.md faylını oxuyun
2. PROJECT_STATUS.md-də detalları yoxlayın
3. Prisma Studio ilə database-ə baxın: `npx prisma studio`
4. GitHub Issues açın (əgər public repo-dursa)

## ✅ Test Checklist

- [ ] Node.js 18.17.0+ yüklənib
- [ ] `npm install` işləyib
- [ ] `npx prisma db push` uğurlu olub
- [ ] `npm run db:seed` demo data yaradıb
- [ ] `npm run dev` işə düşüb
- [ ] `http://localhost:3000` brauzerdə açılıb
- [ ] Demo user ilə giriş edilib
- [ ] Şəkil tuning səhifəsi işləyir
- [ ] Video generator səhifəsi işləyir
- [ ] Dashboard açılır və tarixçə görünür

## 🎯 Növbəti Addımlar

Əsas platform hazırdır! Əlavə etmək istəyə biləcəyiniz:

1. Real file upload funksionallığı (hazırda UI prototype)
2. Real AI API inteqrasiyası (hazırda mock 5s delay)
3. Payment gateway (Stripe, PayPal və s.)
4. Email verification
5. Social authentication (Google, GitHub)
6. Advanced admin panel
7. Analytics dashboard
8. Production deployment

---

**vidver.ai** - AI ilə avtomobil tuning platforması

Uğurlar! 🚗✨
