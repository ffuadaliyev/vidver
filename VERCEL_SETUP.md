# Vercel Setup Guide

## ⚠️ Auth İşləməsi Üçün Vacib!

### 1. Environment Variables (Vercel Dashboard)

Vercel Project Settings → Environment Variables bölməsinə bu dəyişənləri əlavə edin:

```env
# Database (MÜTLƏQ!)
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require

# NextAuth (MÜTLƏQ!)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# App
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 2. NEXTAUTH_SECRET Generasiya

Terminalda:
```bash
openssl rand -base64 32
```

Və ya online: https://generate-secret.vercel.app/32

**Nümunə nəticə:**
```
wJ7xK9mP3vR8nQ2tY6zL4hS5fD1gB0eC
```

### 3. Database Setup (PostgreSQL)

#### Neon (Tövsiyə):

1. https://neon.tech → Sign up
2. New Project → Create
3. Copy Connection String:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

#### Migration:

Lokal terminalda (Neon connection string ilə):

```bash
# DATABASE_URL-i .env-ə əlavə edin
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npm run db:seed
```

### 4. Vercel Environment Variables Əlavə Et

**Project Settings → Environment Variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | postgresql://... | Production |
| `NEXTAUTH_URL` | https://your-app.vercel.app | Production |
| `NEXTAUTH_SECRET` | your-secret-here | Production |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app | Production |

**⚠️ ÖNƏMLİ:**
- Hər dəyəri daxil etdikdən sonra "Add" klikləyin
- "Production" environment seçin
- "Save" klikləyin

### 5. Redeploy

Environment variables əlavə etdikdən sonra:

1. Deployments tab-a gedin
2. Ən son deployment-ə klikləyin
3. "Redeploy" klikləyin

Və ya yeni commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 🔍 Troubleshooting

### Auth işləmir?

**1. Vercel Logs yoxlayın:**
- Vercel Dashboard → Deployments → Latest → View Function Logs
- "/api/auth" endpoint-lərini axtarın

**2. Environment Variables yoxlayın:**
```bash
# Vercel CLI ilə:
vercel env ls
```

**3. Ən çox rast gəlinən problemlər:**

❌ **NEXTAUTH_URL yanlışdır:**
```env
# Yanlış:
NEXTAUTH_URL=http://localhost:3000  ❌
NEXTAUTH_URL=https://vidver.ai  ❌ (əgər Vercel subdomain istifadə edirsinizsə)

# Düzgün:
NEXTAUTH_URL=https://your-app.vercel.app  ✅
```

❌ **NEXTAUTH_SECRET yoxdur:**
```env
# Environment variables-da MÜTLƏQ olmalıdır!
NEXTAUTH_SECRET=wJ7xK9mP3vR8nQ2tY6zL4hS5fD1gB0eC
```

❌ **DATABASE_URL yanlışdır:**
```env
# SQLite işləməz production-da:
DATABASE_URL=file:./dev.db  ❌

# PostgreSQL lazımdır:
DATABASE_URL=postgresql://...  ✅
```

❌ **Database migration edilməyib:**
```bash
# Migration et:
npx prisma db push
npm run db:seed
```

### Database bağlantı erroru?

**Neon/Supabase-də:**
1. Connection pooling aktivdir?
2. SSL mode required: `?sslmode=require`
3. IP whitelist yoxdur? (Neon üçün lazım deyil)

**Connection string formatı:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Qeydiyyat işləmir amma giriş işləyir?

**Prisma schema yoxlayın:**
```bash
# Lokal:
npx prisma studio

# Database-də User table var?
# TokenWallet table var?
```

**Demo user test:**
```
Email: demo@vidver.ai
Password: demo123
```

Əgər demo user işləyirsə, problem qeydiyyat endpoint-indədir.

---

## ✅ Test Checklist

Deploy edəndən sonra test edin:

- [ ] Ana səhifə açılır
- [ ] `/auth/sign-in` açılır
- [ ] Demo user ilə giriş işləyir (demo@vidver.ai / demo123)
- [ ] Yeni qeydiyyat işləyir
- [ ] Dashboard açılır
- [ ] Profile məlumatı görünür
- [ ] Token balance göstərilir
- [ ] Image/Video səhifələri açılır
- [ ] Brand/Model dropdownları işləyir

---

## 🚀 Sürətli Fix

Əgər hələ də işləmirsə:

1. **Vercel-də environment variables yoxlayın:**
   - Settings → Environment Variables
   - 4 dəyişən olmalıdır (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL)

2. **Redeploy edin:**
   ```bash
   git commit --allow-empty -m "Fix: Add environment variables"
   git push origin main
   ```

3. **Vercel logs yoxlayın:**
   - Runtime Logs → Filter: "error"
   - Hansı endpoint fail olur?

4. **Database yoxlayın:**
   ```bash
   # Lokal terminalda:
   DATABASE_URL="your-neon-url" npx prisma studio
   ```
   - User table-də demo user var?
   - TokenWallet table-də entry var?

---

## 📞 Əlavə Kömək

Əgər probleminiz davam edirsə:

1. Vercel Function Logs-u kopyalayın
2. Browser Console error-ları yoxlayın (F12)
3. Network tab-da `/api/auth/` request-ləri yoxlayın

**Nümunə error debugging:**
```
# Browser console:
Failed to fetch
401 Unauthorized
500 Internal Server Error

# Vercel Logs:
[Error]: Database connection failed
[Error]: NEXTAUTH_SECRET is not defined
```

---

## 🎯 Production URL

Vercel auto-generate edər:
```
https://vidver-RANDOM.vercel.app
```

Custom domain üçün:
- Settings → Domains → Add Domain
- DNS konfiqurasiya et

**MÜTLƏQ:** Domain əlavə etdikdən sonra `NEXTAUTH_URL`-i yeniləyin!

---

vidver.ai - Production Ready ✅
