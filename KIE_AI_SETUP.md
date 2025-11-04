# KIE.AI API Setup Guide

Bu fayl KIE.AI API-ni vidver.ai platformasında konfiqurasiya etmək üçün addım-addım təlimatdır.

## 1. KIE.AI API Key Almaq

1. **KIE.AI saytına gedin:** https://kie.ai/
2. **Qeydiyyatdan keçin** və ya **Giriş edin**
3. **Dashboard** → **API Keys** bölməsinə gedin
4. **Create New API Key** klikləyin
5. API key-i kopyalayın (təhlükəsiz yerdə saxlayın!)

## 2. Environment Variable Konfiqurasiyası

### Lokal Development (Local):

1. Proyekt root qovluğunda `.env` faylını açın
2. Aşağıdakı sətri əlavə edin və ya yeniləyin:

```bash
KIE_AI_API_KEY="your-actual-api-key-here"
```

**Nümunə:**
```bash
KIE_AI_API_KEY="kie_1234567890abcdef..."
```

### Production (Vercel):

1. Vercel Dashboard-a gedin
2. Proyektinizi seçin
3. **Settings** → **Environment Variables**
4. Yeni variable əlavə edin:
   - **Name:** `KIE_AI_API_KEY`
   - **Value:** Your KIE.AI API key
   - **Environment:** Production (və ya hər ikisi)
5. **Save** klikləyin
6. **Redeploy** edin (Deployments → Latest → Redeploy)

## 3. API Endpoint

vidver.ai-də istifadə olunan endpoint:

```
POST /api/image-tuning
```

### Request Format:

```typescript
const formData = new FormData()
formData.append('image', file)           // Car image file
formData.append('prompt', promptText)    // AI prompt
formData.append('style', 'sport')        // or 'classic'
formData.append('tuning', JSON.stringify(parts)) // Selected parts
formData.append('color', 'red')          // Selected color
```

### Response Format:

```json
{
  "success": true,
  "resultUrl": "https://...",
  "prompt": "Generated prompt text",
  "metadata": {
    "style": "sport",
    "tuning": "complete",
    "color": "red"
  }
}
```

## 4. Prompt Generator

Platform avtomatik olaraq seçimlərə əsasən prompt yaradır:

### Tuning Seçimləri:

- **Ümumi:** "complete full body kit modification"
- **Bufer:** "modified bumper"
- **İşıqlar:** "custom headlights and taillights"
- **Kapot:** "carbon fiber hood"
- **Dam:** "roof spoiler"
- **Qapılar:** "custom side skirts and door panels"

### Rəng:

- Seçilmiş rəng: `{color} paint finish`

### Stil:

- **Sport:** "aggressive sport styling, racing aerodynamics"
- **Classic:** "elegant classic styling, vintage design elements"

### Tam Prompt Nümunəsi:

```
A professional automotive tuning photo of a car with
complete full body kit modification,
red paint finish,
aggressive sport styling, racing aerodynamics,
high quality, detailed, realistic, 4k resolution
```

## 5. KIE.AI API Parameters

Kod içində istifadə olunan parametrlər:

```typescript
{
  image: File,                    // Input image
  prompt: string,                 // Generated prompt
  strength: 0.8,                  // Transformation strength (0-1)
  guidance_scale: 7.5,           // Prompt adherence (1-20)
  num_inference_steps: 50,       // Quality vs speed (20-150)
  negative_prompt: string        // What to avoid
}
```

### Negative Prompts:

- **Sport:** "blurry, low quality, distorted, vintage, old-fashioned"
- **Classic:** "blurry, low quality, distorted, modern, aggressive"

## 6. Error Handling

Əgər KIE_AI_API_KEY konfiqurasiya olunmayıbsa:

```json
{
  "resultUrl": "/mock-result.jpg",
  "message": "Mock response - KIE.AI API key not configured"
}
```

Console-da error log:
```
KIE_AI_API_KEY is not configured
```

## 7. Testing

### Test Scenario:

1. Image səhifəsinə gedin: `/image`
2. Avtomobil şəkli yükləyin
3. **Tuning** tab-dan seçim edin (Ümumi və ya ayrı hissələr)
4. **Rəng** tab-dan rəng seçin
5. **Stil** seçin (Sport və ya Klasik)
6. **AI Tuning Başlat** klikləyin
7. Nəticəni gözləyin (~10-30 saniyə)

### Test Prompt:

```
A professional automotive tuning photo of a car with
modified bumper,
custom headlights and taillights,
blue paint finish,
aggressive sport styling, racing aerodynamics,
high quality, detailed, realistic, 4k resolution
```

## 8. Troubleshooting

### Problem: "KIE.AI API key not configured"

**Həll:**
- `.env` faylında `KIE_AI_API_KEY` olduğunu yoxlayın
- Development server-i yenidən başladın: `npm run dev`

### Problem: "KIE.AI API error: 401"

**Həll:**
- API key düzgün olduğunu yoxlayın
- KIE.AI dashboard-da key-in aktiv olduğunu yoxlayın

### Problem: "No result image received"

**Həll:**
- Şəkil həcminin 5MB-dan az olduğunu yoxlayın
- Şəkil formatının JPEG/PNG/WebP olduğunu yoxlayın
- KIE.AI API response-u console-da yoxlayın

## 9. Rate Limits

KIE.AI API-nin rate limit-ləri:

- **Free tier:** ~50 requests/day
- **Paid tiers:** Check KIE.AI pricing page

Platform-da token sistemi ilə inteqrasiya edəcəksinizsə, bu limit-ləri nəzərə alın.

## 10. Cost

Hər AI tuning request-i:

- **KIE.AI cost:** ~$0.01-0.05 per image (depending on plan)
- **vidver.ai token cost:** 10 tokens (konfiqurasiya edilə bilər)

## Resources

- **KIE.AI Documentation:** https://docs.kie.ai/
- **KIE.AI Dashboard:** https://kie.ai/dashboard
- **vidver.ai GitHub:** https://github.com/ffuadaliyev/vidver
