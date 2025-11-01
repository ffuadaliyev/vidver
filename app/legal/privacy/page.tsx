import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Məxfilik Siyasəti',
  description: 'vidver.ai məxfilik siyasəti və şəxsi məlumatların qorunması',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Ana səhifə</Button>
          </Link>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold mb-4">Məxfilik Siyasəti</h1>
        <p className="text-neutral-secondary mb-8">Son yenilənmə: 31 Oktyabr 2025</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">1. Məlumat Toplama</h2>
            <p className="text-neutral-secondary">
              vidver.ai platformasında sizin təcrübənizi təkmilləşdirmək üçün aşağıdakı məlumatları toplayırıq:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Hesab məlumatları (ad, e-poçt ünvanı)</li>
              <li>Yüklədiyiniz şəkil və video faylları</li>
              <li>Token əməliyyatları və iş tarixçəsi</li>
              <li>Texniki məlumatlar (IP ünvanı, brauzər tipi, cihaz məlumatı)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">2. Məlumatlardan İstifadə</h2>
            <p className="text-neutral-secondary">
              Topladığımız məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>AI tuning və video generasiya xidmətlərinin göstərilməsi</li>
              <li>Hesabınızın idarə edilməsi və təhlükəsizliyinin təmin edilməsi</li>
              <li>Token balansının izlənməsi</li>
              <li>Platformanın təkmilləşdirilməsi və xidmət keyfiyyətinin artırılması</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">3. Məlumatların Qorunması</h2>
            <p className="text-neutral-secondary">
              Şəxsi məlumatlarınızın təhlükəsizliyini təmin etmək üçün ən müasir texnologiyalardan istifadə edirik:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Şifrələmə (SSL/TLS) ilə məlumat ötürülməsi</li>
              <li>Təhlükəsiz verilənlər bazası şifrələməsi</li>
              <li>Məhdud giriş nəzarəti</li>
              <li>Müntəzəm təhlükəsizlik yoxlamaları</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">4. Yüklənmiş Fayllar</h2>
            <p className="text-neutral-secondary">
              Yüklədiyiniz şəkil və video faylları:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Yalnız AI emal üçün istifadə olunur</li>
              <li>Təhlükəsiz serverlərdə saxlanılır</li>
              <li>Üçüncü tərəflərlə paylaşılmır</li>
              <li>İstədiyiniz vaxt silə bilərsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">5. Kukilər</h2>
            <p className="text-neutral-secondary">
              Platformamız yalnız zəruri texniki kukilərdən istifadə edir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Giriş sessiyasının saxlanması</li>
              <li>Təhlükəsizlik tokenləri</li>
              <li>İstifadəçi parametrlərinin yadda saxlanması</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">6. Sizin Hüquqlarınız</h2>
            <p className="text-neutral-secondary">
              Şəxsi məlumatlarınızla bağlı aşağıdakı hüquqlara sahibsiniz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Məlumatlarınıza giriş və onların əldə edilməsi</li>
              <li>Məlumatların düzəldilməsi və ya silinməsi</li>
              <li>Məlumatların emalına etiraz edilməsi</li>
              <li>Hesabın silinməsi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">7. Əlaqə</h2>
            <p className="text-neutral-secondary">
              Məxfilik siyasəti ilə bağlı suallarınız varsa, bizə müraciət edin:
            </p>
            <p className="text-neutral-secondary">
              E-poçt: <a href="mailto:privacy@vidver.ai" className="text-primary hover:underline">privacy@vidver.ai</a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">8. Dəyişikliklər</h2>
            <p className="text-neutral-secondary">
              Bu məxfilik siyasəti vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişikliklər haqqında sizi e-poçt vasitəsilə məlumatlandıracağıq.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex gap-4">
            <Link href="/legal/terms">
              <Button variant="outline">İstifadə Şərtləri</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Əlaqə</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
