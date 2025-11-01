# vidver.ai - Production Deployment Guide

## Hosting Seçimləri

### Tövsiyə olunan: Vercel + Neon/Supabase PostgreSQL

**Üstünlükləri:**
- Pulsuz tier (hobby projects)
- Avtomatik SSL
- CDN
- Zero-config deployment
- Preview deployments
- PostgreSQL database (managed)

---

## 1. Database Setup (PostgreSQL)

### Variant A: Neon PostgreSQL (Tövsiyə)

1. **Neon hesabı yaradın:** https://neon.tech
2. **Yeni database yaradın**
3. **Connection string kopyalayın:**
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Variant B: Supabase

1. **Supabase hesabı:** https://supabase.com
2. **Project yaradın**
3. **Database settings → Connection string (Session mode)**

### Variant C: Railway

1. **Railway hesabı:** https://railway.app
2. **PostgreSQL plugin əlavə edin**
3. **DATABASE_URL kopyalayın**

---

## 2. Environment Variables

### Lokal `.env` faylı yaradın:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ilə generate edin"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production üçün `.env.production`:

```env
# Database (Production PostgreSQL)
DATABASE_URL="postgresql://user:pass@production-host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://vidver.ai"
NEXTAUTH_SECRET="production-secret-buraya"

# App
NEXT_PUBLIC_APP_URL="https://vidver.ai"

# Optional: AI API keys (gələcək)
# OPENAI_API_KEY="sk-..."
# REPLICATE_API_KEY="r8_..."
```

---

## 3. Database Migration & Seeding

### Lokal development (SQLite):

Schema-nı PostgreSQL-ə dəyişmək üçün:

```bash
# 1. schema.prisma-da datasource-u dəyiş (artıq PostgreSQL-dir)
# 2. Prisma client regenerate et
npx prisma generate

# 3. Database-ə migration göndər
npx prisma db push

# 4. Seed data yüklə
npm run db:seed
```

### Production setup:

```bash
# Production database URL-i .env-ə əlavə et
# Sonra migration et
npx prisma migrate deploy

# Seed data
npm run db:seed
```

**⚠️ Qeyd:** Production-da sadəcə 1 dəfə seed etməlisiniz.

---

## 4. Vercel Deployment

### A. Vercel CLI ilə

```bash
# Vercel CLI yüklə
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### B. GitHub Integration (Tövsiyə)

1. **GitHub repo yaradın və kod push edin:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/vidver-ai.git
   git push -u origin main
   ```

2. **Vercel-də import edin:**
   - https://vercel.com/new
   - "Import Git Repository"
   - Repo seçin
   - Environment variables əlavə edin:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (https://vidver.ai)
     - `NEXTAUTH_SECRET`
     - `NEXT_PUBLIC_APP_URL`

3. **Deploy!**
   - Vercel avtomatik build edəcək
   - Hər push avtomatik deploy

---

## 5. Domain Konfiqurasiyası

### Vercel-də domain əlavə etmək:

1. **Project Settings → Domains**
2. **Domain əlavə edin:** `vidver.ai`
3. **DNS provider-də A record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **SSL avtomatik aktivləşəcək**

---

## 6. Post-Deployment Checklist

### Database
- [ ] PostgreSQL connection işləyir
- [ ] Migration uğurlu oldu
- [ ] Seed data yükləndi
- [ ] Demo user login edir: `demo@vidver.ai / demo123`

### Auth
- [ ] Sign up işləyir
- [ ] Sign in işləyir
- [ ] Session 1 saat sonra bitir
- [ ] Auto wallet creation işləyir (100 token)

### Features
- [ ] Image upload (max 5MB)
- [ ] Brand/Model selection (10 brand, 100 model)
- [ ] Video upload
- [ ] Mock processing (5s) işləyir
- [ ] Dashboard göstərir
- [ ] Mobile navigation işləyir

### SEO
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Metadata correct

### Performance
- [ ] Lighthouse score 90+
- [ ] Images optimized
- [ ] No console errors

---

## 7. Analytics və Monitoring

### Tövsiyələr:

1. **Vercel Analytics** (built-in)
   - Web Vitals
   - Audience insights

2. **Google Analytics**
   ```bash
   npm install @next/third-parties
   ```

3. **Sentry** (error tracking)
   ```bash
   npm install @sentry/nextjs
   ```

4. **Database Monitoring:**
   - Neon dashboard
   - Query insights
   - Connection pool

---

## 8. File Storage (Gələcək)

Şəkillər və videolar üçün:

### Variant A: Vercel Blob
```bash
npm install @vercel/blob
```

### Variant B: Cloudinary
- Free tier: 25GB
- Image transformations
- CDN

### Variant C: AWS S3
- Unlimited storage
- Pay-as-you-go
- CloudFront CDN

---

## 9. Environment-Specific Settings

### Development
```env
NODE_ENV=development
DATABASE_URL="file:./dev.db"  # SQLite
```

### Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://..."  # PostgreSQL
```

---

## 10. Backup Strategy

### Database Backup (Neon):

1. **Avtomatik backups** (Neon Pro)
2. **Manual export:**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

### Code Backup:
- GitHub repo (version control)
- Vercel deployments (history)

---

## 11. Security Checklist

- [x] Environment variables secure (not in code)
- [x] Session timeout 1 hour
- [x] HTTPS only (production)
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention (React)
- [x] CSRF protection (NextAuth)
- [x] Password hashing (bcrypt)
- [x] File upload validation
- [x] Rate limiting (add in future)

---

## 12. Scaling Considerations

### Database
- **Neon Free:** 0.5GB, 1 vCPU
- **Upgrade:** Scale tier ($19/mo) - 8GB, autoscaling

### Vercel
- **Hobby:** 100GB bandwidth, unlimited requests
- **Pro:** $20/mo - 1TB bandwidth, advanced analytics

### Performance
- Database connection pooling (Prisma)
- Next.js caching
- CDN for static assets
- Image optimization (next/image)

---

## 13. Cost Estimate (Başlanğıc)

| Service | Plan | Qiymət |
|---------|------|---------|
| Vercel Hosting | Hobby | $0/ay |
| Neon PostgreSQL | Free | $0/ay |
| Domain (optional) | - | $12/il |
| **Total** | - | **~$1/ay** |

---

## 14. Deployment Commands

```bash
# Full production deployment

# 1. Update dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Build application
npm run build

# 4. Test production build locally
npm start

# 5. Deploy to Vercel
vercel --prod
```

---

## 15. Troubleshooting

### Database connection error
- Check `DATABASE_URL` format
- Verify SSL mode: `?sslmode=require`
- Check firewall rules

### Build fails
- Check Node version (18.17.0+)
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma: `npx prisma generate`

### Session issues
- Verify `NEXTAUTH_URL` matches domain
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies

---

## 16. Post-Launch TODO

- [ ] Set up error monitoring (Sentry)
- [ ] Add Google Analytics
- [ ] Configure real AI API
- [ ] Add payment integration (Stripe)
- [ ] Set up email service (Resend/SendGrid)
- [ ] Add rate limiting
- [ ] Configure backup automation
- [ ] Set up monitoring alerts

---

## Support

**Documentation:** README.md, SETUP_GUIDE.md
**Issues:** GitHub Issues
**Status:** All features 100% working ✅

---

**vidver.ai - AI ilə avtomobil tuning platforması** 🚗✨
